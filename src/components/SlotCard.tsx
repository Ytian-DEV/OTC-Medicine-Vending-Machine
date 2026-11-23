import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
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
  const isLowStock = !isSoldOut && slot.stock <= 3;
  const canIncrement = !isSoldOut && selectedQuantity < slot.stock;

  const handleCardTap = () => {
    if (canIncrement) {
      onIncrement(slot.slot_code);
    }
  };

  const renderTopRow = (className?: string) => (
    <div className={cn('flex items-center justify-between gap-2 shrink-0', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-semibold tracking-wide transition-colors',
          isSelected
            ? 'bg-zinc-900 text-white shadow-sm'
            : 'text-zinc-400 bg-transparent px-0.5'
        )}
      >
        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
        <span>{slot.slot_code}</span>
      </span>

      <span
        className={cn(
          'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-medium tabular-nums',
          isSoldOut
            ? 'bg-red-50 text-red-600'
            : isLowStock
              ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
              : isSelected
                ? 'bg-zinc-900/10 text-zinc-800 font-semibold'
                : 'bg-stone-100 text-zinc-500'
        )}
      >
        {isSoldOut ? '0 left' : `${slot.stock} left`}
      </span>
    </div>
  );

  return (
    <div
      role="button"
      tabIndex={isSoldOut ? -1 : 0}
      aria-disabled={isSoldOut}
      aria-pressed={isSelected}
      onClick={handleCardTap}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && canIncrement) {
          e.preventDefault();
          onIncrement(slot.slot_code);
        }
      }}
      className={cn(
        'relative rounded-2xl border p-3 sm:p-4 flex flex-col landscape:lg:flex-row items-stretch justify-between gap-2 sm:gap-3 lg:gap-5 min-h-0 min-w-0 overflow-hidden transition-all duration-150',
        isSoldOut
          ? 'bg-white border-stone-200/80 cursor-not-allowed'
          : isSelected
            ? 'bg-zinc-900/[0.035] border-2 border-zinc-900 ring-4 ring-zinc-900/15 shadow-lg cursor-pointer'
            : 'bg-white border-stone-200/80 hover:border-stone-300 hover:shadow-sm cursor-pointer'
      )}
    >
      {/* Portrait Top Row: Slot Code + Live Stock Count */}
      {renderTopRow('landscape:lg:hidden')}

      {/* Product photo centered in a clean neutral well */}
      <div
        className={cn(
          'flex-1 landscape:lg:flex-none landscape:lg:w-[40%] landscape:lg:h-full min-h-0 rounded-xl flex items-center justify-center overflow-hidden p-2 sm:p-3 transition-colors',
          isSelected ? 'bg-white ring-1 ring-zinc-900/10' : 'bg-stone-50'
        )}
      >
        <img
          src={imgSrc}
          alt={slot.name}
          onError={() => setImgSrc(getFallbackProductImage(slot.slot_code))}
          className="w-full h-full object-contain pointer-events-none select-none"
          draggable={false}
        />
      </div>

      {/* Info + Origin UI pill stepper */}
      <div className="shrink-0 landscape:lg:flex-1 landscape:lg:h-full flex flex-col items-center landscape:lg:items-stretch justify-center landscape:lg:justify-between gap-2 sm:gap-2.5 min-w-0 landscape:lg:py-0.5">
        {/* Landscape Top Row: Slot Code + Live Stock Count */}
        {renderTopRow('hidden landscape:lg:flex w-full')}

        <div className="w-full text-center landscape:lg:text-left min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-zinc-900 tracking-tight leading-snug truncate">
            {slot.name}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 font-medium mt-0.5 sm:mt-1 tabular-nums">
            {formatPHP(slot.price)}
          </p>
        </div>

        <div className="flex justify-center landscape:lg:justify-start">
          <QuantityStepper
            value={selectedQuantity}
            max={slot.stock}
            disabled={isSoldOut}
            label={slot.name}
            onIncrement={() => onIncrement(slot.slot_code)}
            onDecrement={() => onDecrement(slot.slot_code)}
          />
        </div>
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
