import { useEffect, useState } from 'react';
import type { SlotItem } from '@/types/kiosk';
import { formatPHP, getFallbackProductImage } from '@/data/initialSlots';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { cn } from '@/lib/utils';

interface SlotCardProps {
  slot: SlotItem;
  selectedQuantity: number;
  onIncrement: (slotCode: string) => void;
  onDecrement: (slotCode: string) => void;
}

export function SlotCard({
  slot,
  selectedQuantity,
  onIncrement,
  onDecrement,
}: SlotCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(slot.image_url);

  useEffect(() => {
    setImgSrc(slot.image_url);
  }, [slot.image_url]);

  const isSoldOut = slot.stock <= 0;
  const isSelected = selectedQuantity > 0 && !isSoldOut;
  const canIncrement = !isSoldOut && selectedQuantity < slot.stock;

  const handleCardTap = () => {
    if (canIncrement) {
      onIncrement(slot.slot_code);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isSoldOut ? -1 : 0}
      aria-disabled={isSoldOut}
      onClick={handleCardTap}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && canIncrement) {
          e.preventDefault();
          onIncrement(slot.slot_code);
        }
      }}
      className={cn(
        'relative rounded-2xl bg-white border p-3 sm:p-4 flex flex-col landscape:lg:flex-row items-stretch justify-between gap-2.5 sm:gap-3 lg:gap-5 min-h-0 min-w-0 overflow-hidden transition-colors duration-150',
        isSoldOut
          ? 'border-stone-200/80 cursor-not-allowed'
          : isSelected
            ? 'border-zinc-900 ring-1 ring-zinc-900 bg-white cursor-pointer'
            : 'border-stone-200/80 hover:border-stone-300 cursor-pointer'
      )}
    >
      {/* Quiet slot code in top-left corner */}
      <span className="absolute top-2.5 left-3 text-[11px] sm:text-xs font-medium text-zinc-400 tracking-wide pointer-events-none z-10">
        {slot.slot_code}
      </span>

      {/* Product photo centered in a clean neutral stone-50 well */}
      <div className="flex-1 landscape:lg:flex-none landscape:lg:w-[40%] landscape:lg:h-full min-h-0 rounded-xl bg-stone-50 flex items-center justify-center overflow-hidden p-2 sm:p-3">
        <img
          src={imgSrc}
          alt={slot.name}
          onError={() => setImgSrc(getFallbackProductImage(slot.slot_code))}
          className="w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* Minimal info + Origin UI pill stepper */}
      <div className="shrink-0 landscape:lg:flex-1 landscape:lg:h-full flex flex-col items-center landscape:lg:items-start justify-center landscape:lg:justify-between gap-2 sm:gap-2.5 min-w-0 landscape:lg:py-1">
        <div className="w-full text-center landscape:lg:text-left min-w-0">
          <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-zinc-900 tracking-tight leading-snug truncate">
            {slot.name}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-zinc-500 font-normal mt-0.5 tabular-nums">
            {formatPHP(slot.price)}
          </p>
        </div>

        <QuantityStepper
          value={selectedQuantity}
          max={slot.stock}
          disabled={isSoldOut}
          label={slot.name}
          onIncrement={() => onIncrement(slot.slot_code)}
          onDecrement={() => onDecrement(slot.slot_code)}
        />
      </div>

      {/* Clean Sold out overlay only when stock === 0 */}
      {isSoldOut && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center z-20">
          <span className="px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs sm:text-sm font-medium text-zinc-500">
            Sold out
          </span>
        </div>
      )}
    </div>
  );
}
