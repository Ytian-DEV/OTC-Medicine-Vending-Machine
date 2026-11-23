import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_SLOTS } from '@/data/initialSlots';
import type { CartItem, SlotItem, TransactionLineItem } from '@/types/kiosk';

const LOCAL_SLOTS_KEY = 'vending_kiosk_slots_v2';
const LOCAL_TXNS_KEY = 'vending_kiosk_transactions_v2';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    '[Vending Kiosk] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing. Running with LocalStorage fallback.'
  );
}

export const isSupabaseConfigured = Boolean(supabase);

function normalizeSlot(row: Record<string, unknown>): SlotItem {
  return {
    id: String(row.id ?? row.slot_code),
    slot_code: String(row.slot_code),
    name: String(row.name),
    price: Number(row.price ?? 0),
    stock: Math.max(0, Number(row.stock ?? 0)),
    default_stock: Math.max(0, Number(row.default_stock ?? 10)),
    image_url: String(row.image_url ?? ''),
    sort_order: Number(row.sort_order ?? 1),
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

function readLocalSlots(): SlotItem[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_SLOTS_KEY);
    if (!raw) return INITIAL_SLOTS;
    const parsed = JSON.parse(raw) as SlotItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return INITIAL_SLOTS;
    return parsed.sort((a, b) => a.sort_order - b.sort_order);
  } catch {
    return INITIAL_SLOTS;
  }
}

function writeLocalSlots(slots: SlotItem[]): void {
  try {
    window.localStorage.setItem(LOCAL_SLOTS_KEY, JSON.stringify(slots));
  } catch {
    // Ignore storage quota errors
  }
}

function appendLocalTransaction(record: {
  items: TransactionLineItem[];
  total_quantity: number;
  total_amount: number;
}): void {
  try {
    const raw = window.localStorage.getItem(LOCAL_TXNS_KEY);
    const existing = raw ? (JSON.parse(raw) as unknown[]) : [];
    existing.unshift({
      id: `local-${Date.now()}`,
      ...record,
      created_at: new Date().toISOString(),
    });
    window.localStorage.setItem(LOCAL_TXNS_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchSlots(): Promise<{ slots: SlotItem[]; connected: boolean }> {
  if (!supabase) {
    return { slots: readLocalSlots(), connected: false };
  }

  try {
    const { data, error } = await supabase
      .from('slots')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) {
        console.warn('[Vending Kiosk] Supabase fetchSlots failed, using local fallback:', error.message);
      }
      return { slots: readLocalSlots(), connected: false };
    }

    const normalized = data.map((row) => normalizeSlot(row as Record<string, unknown>));
    writeLocalSlots(normalized);
    return { slots: normalized, connected: true };
  } catch (err) {
    console.warn('[Vending Kiosk] Supabase unreachable, using local fallback:', err);
    return { slots: readLocalSlots(), connected: false };
  }
}

export async function completeCheckoutTransaction(
  cartItems: CartItem[],
  currentSlots: SlotItem[]
): Promise<{ slots: SlotItem[]; connected: boolean }> {
  const lineItems: TransactionLineItem[] = cartItems.map(({ slot, quantity, subtotal }) => ({
    slot_code: slot.slot_code,
    name: slot.name,
    quantity,
    unit_price: slot.price,
    subtotal,
  }));

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const locallyUpdatedSlots = currentSlots.map((slot) => {
    const purchased = cartItems.find((c) => c.slot.slot_code === slot.slot_code);
    if (!purchased) return slot;
    return {
      ...slot,
      stock: Math.max(0, slot.stock - purchased.quantity),
      updated_at: new Date().toISOString(),
    };
  });

  if (!supabase) {
    writeLocalSlots(locallyUpdatedSlots);
    appendLocalTransaction({
      items: lineItems,
      total_quantity: totalQuantity,
      total_amount: totalAmount,
    });
    return { slots: locallyUpdatedSlots, connected: false };
  }

  try {
    const { error: txError } = await supabase.from('transactions').insert({
      items: lineItems,
      total_quantity: totalQuantity,
      total_amount: totalAmount,
    });

    if (txError) {
      console.warn('[Vending Kiosk] Failed to insert transaction:', txError.message);
    }

    await Promise.all(
      cartItems.map(async ({ slot, quantity }) => {
        const { error: rpcErr } = await supabase!.rpc('deduct_slot_stock', {
          p_slot_code: slot.slot_code,
          p_qty: quantity,
        });

        if (rpcErr) {
          const nextStock = Math.max(0, slot.stock - quantity);
          const { error: updateErr } = await supabase!
            .from('slots')
            .update({ stock: nextStock, updated_at: new Date().toISOString() })
            .eq('slot_code', slot.slot_code);

          if (updateErr) {
            console.warn(`[Vending Kiosk] Failed to update slot ${slot.slot_code}:`, updateErr.message);
          }
        }
      })
    );

    const refreshed = await fetchSlots();
    if (refreshed.connected) {
      return refreshed;
    }

    writeLocalSlots(locallyUpdatedSlots);
    return { slots: locallyUpdatedSlots, connected: false };
  } catch (err) {
    console.warn('[Vending Kiosk] Checkout sync failed, applied locally:', err);
    writeLocalSlots(locallyUpdatedSlots);
    appendLocalTransaction({
      items: lineItems,
      total_quantity: totalQuantity,
      total_amount: totalAmount,
    });
    return { slots: locallyUpdatedSlots, connected: false };
  }
}

export async function restockAllSlots(
  currentSlots: SlotItem[]
): Promise<{ slots: SlotItem[]; connected: boolean }> {
  const locallyRestocked = (currentSlots.length > 0 ? currentSlots : INITIAL_SLOTS).map((slot) => ({
    ...slot,
    stock: slot.default_stock,
    updated_at: new Date().toISOString(),
  }));

  if (!supabase) {
    writeLocalSlots(locallyRestocked);
    return { slots: locallyRestocked, connected: false };
  }

  try {
    const { data, error } = await supabase.rpc('restock_all_slots');

    if (!error && Array.isArray(data) && data.length > 0) {
      const normalized = data
        .map((row) => normalizeSlot(row as Record<string, unknown>))
        .sort((a, b) => a.sort_order - b.sort_order);
      writeLocalSlots(normalized);
      return { slots: normalized, connected: true };
    }

    await Promise.all(
      locallyRestocked.map((slot) =>
        supabase!
          .from('slots')
          .update({ stock: slot.default_stock, updated_at: new Date().toISOString() })
          .eq('slot_code', slot.slot_code)
      )
    );

    const refreshed = await fetchSlots();
    if (refreshed.connected) return refreshed;

    writeLocalSlots(locallyRestocked);
    return { slots: locallyRestocked, connected: false };
  } catch (err) {
    console.warn('[Vending Kiosk] Restock sync failed, restocked locally:', err);
    writeLocalSlots(locallyRestocked);
    return { slots: locallyRestocked, connected: false };
  }
}
