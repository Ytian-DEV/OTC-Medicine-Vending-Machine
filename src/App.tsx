import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  SlotItem,
} from './types/kiosk';
import { playClearBeep, playClickBeep, playRestockChime } from './utils/sound';

const IDLE_TIMEOUT_SECONDS = 45;

export default function App() {
  const [slots, setSlots] = useState<SlotItem[]>(INITIAL_SLOTS);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<CheckoutStage>('idle');
  const [dispensedSnapshot, setDispensedSnapshot] = useState<CartItem[]>([]);
  const [isRestocking, setIsRestocking] = useState(false);

  const lastActivityRef = useRef<number>(Date.now());
  const pendingCheckoutRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let active = true;
    fetchSlots().then(({ slots: loaded }) => {
      if (!active) return;
      setSlots(loaded);
    });
    return () => {
      active = false;
    };
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

  useEffect(() => {
    if (totalQuantity === 0 || stage !== 'idle') return;
    lastActivityRef.current = Date.now();
    const resetActivity = () => {
      lastActivityRef.current = Date.now();
    };
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'touchstart', 'keydown'];
    events.forEach((evt) => window.addEventListener(evt, resetActivity, { passive: true }));

    const interval = window.setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      if (elapsedSec >= IDLE_TIMEOUT_SECONDS) {
        playClearBeep();
        setQuantities({});
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
        playClickBeep(800, 30);
        return { ...prev, [slotCode]: current + 1 };
      });
    },
    [slots]
  );

  const handleDecrement = useCallback((slotCode: string) => {
    setQuantities((prev) => {
      const current = prev[slotCode] ?? 0;
      if (current <= 0) return prev;
      playClickBeep(640, 30);
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
      const { slots: restocked } = await restockAllSlots(slots);
      setSlots(restocked);
      playRestockChime();
    } finally {
      setIsRestocking(false);
    }
  }, [isRestocking, slots]);

  const handleConfirmOrder = useCallback(() => {
    if (totalQuantity === 0) return;
    playClickBeep(880, 30);
    setStage('payment');
  }, [totalQuantity]);

  const handleCancelPayment = useCallback(() => {
    setStage('idle');
  }, []);

  const handleDonePaying = useCallback(() => {
    const snapshot = cartItems;
    setDispensedSnapshot(snapshot);
    setStage('dispensing');

    pendingCheckoutRef.current = completeCheckoutTransaction(snapshot, slots).then(
      ({ slots: updatedSlots }) => {
        setSlots(updatedSlots);
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

  void handleRestockAll;

  return (
    <div className="h-dvh w-screen overflow-hidden flex flex-col bg-stone-100 select-none">
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
