import type { SlotItem } from '@/types/kiosk';
import { SlotCard } from '@/components/SlotCard';

interface SlotGridProps {
  slots: SlotItem[];
  quantities: Record<string, number>;
  onIncrement: (slotCode: string) => void;
  onDecrement: (slotCode: string) => void;
}

export function SlotGrid({
  slots,
  quantities,
  onIncrement,
  onDecrement,
}: SlotGridProps) {
  return (
    <main className="flex-1 min-h-0 grid grid-cols-3 grid-rows-3 gap-3 md:gap-4">
      {slots.map((slot) => (
        <SlotCard
          key={slot.slot_code}
          slot={slot}
          selectedQuantity={quantities[slot.slot_code] ?? 0}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      ))}
    </main>
  );
}
