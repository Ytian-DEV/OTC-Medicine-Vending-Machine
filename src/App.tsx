import { useMemo, useState } from 'react';
import { KioskHeader } from './components/KioskHeader';
import { SlotGrid } from './components/SlotGrid';
import { CartBar } from './components/CartBar';
import { INITIAL_SLOTS } from './data/initialSlots';
import type { CartItem, SlotItem } from './types/kiosk';
import { playClearBeep, playClickBeep } from './utils/sound';

export default function App() {
  const [slots, setSlots] = useState<SlotItem[]>(INITIAL_SLOTS);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleIncrement = (slotCode: string) => {
    const target = slots.find((s) => s.slot_code === slotCode);
    if (!target || target.stock <= 0) return;

    setQuantities((prev) => {
      const current = prev[slotCode] ?? 0;
      if (current >= target.stock) return prev;
      playClickBeep(800, 40);
      return { ...prev, [slotCode]: current + 1 };
    });
  };

  const handleDecrement = (slotCode: string) => {
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
  };

  const handleClear = () => {
    playClearBeep();
    setQuantities({});
  };

  const handleRestockAll = () => {
    playClickBeep(920, 60);
    setSlots((prev) => prev.map((s) => ({ ...s, stock: s.default_stock })));
  };

  const handleToggleFullscreen = () => {
    playClickBeep(760, 40);
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  const cartItems: CartItem[] = useMemo(() => {
    return slots
      .filter((s) => (quantities[s.slot_code] ?? 0) > 0)
      .map((slot) => {
        const quantity = quantities[slot.slot_code] ?? 0;
        return {
          slot,
          quantity,
          subtotal: quantity * slot.price,
        };
      });
  }, [slots, quantities]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems]
  );

  return (
    <div className="h-dvh w-screen overflow-hidden flex flex-col justify-between bg-slate-50 select-none">
      <KioskHeader
        connectionStatus="offline"
        idleSecondsLeft={null}
        isRestocking={false}
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
        onConfirm={() => playClickBeep(880, 50)}
      />
    </div>
  );
}
