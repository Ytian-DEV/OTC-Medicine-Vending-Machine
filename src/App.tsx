import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { KioskHeader } from './components/KioskHeader';
import { SlotGrid } from './components/SlotGrid';
import { CartBar } from './components/CartBar';
import { PaymentModal } from './components/PaymentModal';
import { DispensingModal } from './components/DispensingModal';
import { ClaimModal } from './components/ClaimModal';
import { INITIAL_SLOTS } from './data/initialSlots';
import {
  completeCheckoutTransaction,
  fetchSlots,
  restockAllSlots,
} from './lib/supabase';
import type {
  CartItem,
  CheckoutStage,
  ConnectionStatus,
  SlotItem,
} from './types/kiosk';
import { playClearBeep, playClickBeep, playRestockChime } from './utils/sound';

const IDLE_TIMEOUT_SECONDS = 45;

export default function App() {
  const [slots, setSlots] = useState<SlotItem[]>(INITIAL_SLOTS);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<CheckoutStage>('idle');
  const [dispensedSnapshot, setDispensedSnapshot] = useState<CartItem[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('loading');
  const [isRestocking, setIsRestocking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [idleSecondsLeft, setIdleSecondsLeft] = useState<number | null>(null);

  const lastActivityRef = useRef<number>(Date.now());
  const pendingCheckoutRef = useRef<Promise<void> | null>(null);

  // Load initial 9 slots from Supabase (gracefully falling back to LocalStorage)
  useEffect(() => {
    let active = true;
    fetchSlots().then(({ slots: loaded, connected }) => {
      if (!active) return;
      setSlots(loaded);
      setConnectionStatus(connected ? 'connected' : 'offline');
    });
    return () => {
      active = false;
    };
  }, []);

  // Track browser fullscreen changes (including Esc key)
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const cartItems: CartItem[] = useMemo(() => {
    return slots
      .filter((s) => (quantities[s.slot_code] ?? 0) > 0)
      .map((slot) => {
        const quantity = Math.min(quantities[slot.slot_code] ?? 0, slot.stock);
        return {
          slot,
          quantity,
          subtotal: quantity * slot.price,
        };
      })
      .filter((item) => item.quantity > 0);
  }, [slots, quantities]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems]
  );

  // 45-second idle timeout auto-reset when items are selected and no modal is open
  useEffect(() => {
    if (totalQuantity === 0 || stage !== 'idle') {
      setIdleSecondsLeft(null);
      return;
    }

    lastActivityRef.current = Date.now();
    setIdleSecondsLeft(IDLE_TIMEOUT_SECONDS);

    const resetActivity = () => {
      lastActivityRef.current = Date.now();
      setIdleSecondsLeft(IDLE_TIMEOUT_SECONDS);
    };

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'touchstart', 'keydown'];
    events.forEach((evt) => window.addEventListener(evt, resetActivity, { passive: true }));

    const interval = window.setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const remaining = Math.max(0, IDLE_TIMEOUT_SECONDS - elapsedSec);
      setIdleSecondsLeft(remaining);

      if (remaining === 0) {
        playClearBeep();
        setQuantities({});
        setIdleSecondsLeft(null);
      }
    }, 1000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetActivity));
      window.clearInterval(interval);
    };
  }, [totalQuantity, stage]);

  const handleIncrement = useCallback(
    (slotCode: string) => {
      const target = slots.find((s) => s.slot_code === slotCode);
      if (!target || target.stock <= 0) return;

      setQuantities((prev) => {
        const current = prev[slotCode] ?? 0;
        if (current >= target.stock) return prev;
        playClickBeep(800, 40);
        return { ...prev, [slotCode]: current + 1 };
      });
    },
    [slots]
  );

  const handleDecrement = useCallback((slotCode: string) => {
    setQuantities((prev) => {
      const current = prev[slotCode] ?? 0;
      if (current <= 0) return prev;
      playClickBeep(640, 35);
      const next = { ...prev };
      if (current === 1) {
        delete next[slotCode];
      } else {
        next[slotCode] = current - 1;
      }
      return next;
    });
  }, []);

  const handleClear = useCallback(() => {
    playClearBeep();
    setQuantities({});
  }, []);

  const handleRestockAll = useCallback(async () => {
    if (isRestocking) return;
    setIsRestocking(true);
    try {
      const { slots: restocked, connected } = await restockAllSlots(slots);
      setSlots(restocked);
      setConnectionStatus(connected ? 'connected' : 'offline');
      playRestockChime();
    } finally {
      setIsRestocking(false);
    }
  }, [isRestocking, slots]);

  const handleToggleFullscreen = useCallback(() => {
    playClickBeep(760, 40);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen may be blocked in some embedded contexts
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleConfirmOrder = useCallback(() => {
    if (totalQuantity === 0) return;
    playClickBeep(880, 50);
    setStage('payment');
  }, [totalQuantity]);

  const handleCancelPayment = useCallback(() => {
    playClearBeep();
    setStage('idle');
  }, []);

  // Simultaneously kick off 3-second dispensing beep + Supabase stock deduction & transaction log
  const handleDonePaying = useCallback(() => {
    const snapshot = cartItems;
    setDispensedSnapshot(snapshot);
    setStage('dispensing');

    pendingCheckoutRef.current = completeCheckoutTransaction(snapshot, slots).then(
      ({ slots: updatedSlots, connected }) => {
        setSlots(updatedSlots);
        setConnectionStatus(connected ? 'connected' : 'offline');
      }
    );
  }, [cartItems, slots]);

  const handleDispenseComplete = useCallback(async () => {
    if (pendingCheckoutRef.current) {
      try {
        await pendingCheckoutRef.current;
      } finally {
        pendingCheckoutRef.current = null;
      }
    }
    setStage('claim');
  }, []);

  const handleClaimClose = useCallback(() => {
    setQuantities({});
    setDispensedSnapshot([]);
    setStage('idle');
  }, []);

  return (
    <div className="h-dvh w-screen overflow-hidden flex flex-col justify-between bg-slate-50 select-none">
      <KioskHeader
        connectionStatus={connectionStatus}
        idleSecondsLeft={idleSecondsLeft}
        isRestocking={isRestocking}
        isFullscreen={isFullscreen}
        onRestockAll={handleRestockAll}
        onToggleFullscreen={handleToggleFullscreen}
      />

      <SlotGrid
        slots={slots}
        quantities={quantities}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />

      <CartBar
        cartItems={cartItems}
        totalQuantity={totalQuantity}
        totalAmount={totalAmount}
        onClear={handleClear}
        onConfirm={handleConfirmOrder}
      />

      {stage === 'payment' && (
        <PaymentModal
          cartItems={cartItems}
          totalAmount={totalAmount}
          onDonePaying={handleDonePaying}
          onCancel={handleCancelPayment}
        />
      )}

      {stage === 'dispensing' && (
        <DispensingModal
          cartItems={dispensedSnapshot}
          onComplete={handleDispenseComplete}
        />
      )}

      {stage === 'claim' && (
        <ClaimModal
          dispensedItems={dispensedSnapshot}
          onClose={handleClaimClose}
        />
      )}
    </div>
  );
}
