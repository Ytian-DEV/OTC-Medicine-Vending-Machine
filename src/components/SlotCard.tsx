import { useEffect, useState } from 'react';
import { Check, Info, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import type { SlotItem } from '@/types/kiosk';
import { formatPHP, getFallbackProductImage } from '@/data/initialSlots';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { playClickBeep } from '@/utils/sound';
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
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setImgSrc(slot.image_url);
  }, [slot.image_url]);

  const isSoldOut = slot.stock <= 0;
  const isSelected = selectedQuantity > 0 && !isSoldOut;
  const isLowStock = !isSoldOut && slot.stock <= 3;
  const canIncrement = !isSoldOut && selectedQuantity < slot.stock;

  const handleCardTap = () => {
    if (isFlipped) return;
    if (canIncrement) {
      onIncrement(slot.slot_code);
    }
  };

  const handleFlipToIngredients = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickBeep(700, 25);
    setIsFlipped(true);
  };

  const handleFlipToFront = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    playClickBeep(640, 25);
    setIsFlipped(false);
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

  const cardSurfaceClasses = cn(
    'absolute inset-0 rounded-2xl border p-3 sm:p-4 min-h-0 min-w-0 overflow-hidden transition-colors duration-150',
    isSoldOut
      ? 'bg-white border-stone-200/80'
      : isSelected
        ? 'bg-stone-50 border-2 border-zinc-900 ring-4 ring-zinc-900/15 shadow-lg'
        : 'bg-white border-stone-200/80 hover:border-stone-300 hover:shadow-sm'
  );

  return (
    <div className="relative h-full w-full min-h-0 min-w-0 [perspective:1200px]">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-full w-full"
      >
        {/* FRONT FACE */}
        <div
          role="button"
          tabIndex={isSoldOut || isFlipped ? -1 : 0}
          aria-disabled={isSoldOut}
          aria-pressed={isSelected}
          aria-hidden={isFlipped}
          onClick={handleCardTap}
          onKeyDown={(e) => {
            if (!isFlipped && (e.key === 'Enter' || e.key === ' ') && canIncrement) {
              e.preventDefault();
              onIncrement(slot.slot_code);
            }
          }}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className={cn(
            cardSurfaceClasses,
            'flex flex-col landscape:lg:flex-row items-stretch justify-between gap-2 sm:gap-2.5 lg:gap-4',
            isSoldOut ? 'cursor-not-allowed' : 'cursor-pointer',
            isFlipped && 'pointer-events-none'
          )}
        >
          {/* Portrait Top Row: Slot Code + Live Stock Count */}
          {renderTopRow('landscape:lg:hidden')}

          {/* Product photo centered in a clean neutral well */}
          <div
            className={cn(
              'flex-1 landscape:lg:flex-none landscape:lg:w-[38%] landscape:lg:h-full min-h-0 rounded-xl flex items-center justify-center overflow-hidden p-2 sm:p-2.5 transition-colors',
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

          {/* Info + Origin UI pill stepper + View ingredients button */}
          <div className="shrink-0 landscape:lg:flex-1 landscape:lg:h-full flex flex-col items-center landscape:lg:items-stretch justify-center landscape:lg:justify-between gap-1.5 sm:gap-2 min-w-0 landscape:lg:py-0.5">
            {/* Landscape Top Row: Slot Code + Live Stock Count */}
            {renderTopRow('hidden landscape:lg:flex w-full')}

            <div className="w-full text-center landscape:lg:text-left min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-zinc-900 tracking-tight leading-snug truncate">
                {slot.name}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-600 font-medium mt-0.5 tabular-nums">
                {formatPHP(slot.price)}
              </p>
            </div>

            <div className="flex flex-col landscape:xl:flex-row items-center landscape:lg:items-start landscape:xl:items-center justify-between gap-1.5 sm:gap-2 w-full">
              <QuantityStepper
                value={selectedQuantity}
                max={slot.stock}
                disabled={isSoldOut}
                label={slot.name}
                onIncrement={() => onIncrement(slot.slot_code)}
                onDecrement={() => onDecrement(slot.slot_code)}
              />

              <button
                type="button"
                onClick={handleFlipToIngredients}
                aria-label={`View ingredients for ${slot.name}`}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-stone-200/60 transition-colors whitespace-nowrap"
              >
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>View ingredients</span>
              </button>
            </div>
          </div>

          {/* Clean Sold out overlay only when stock === 0 (still allows viewing ingredients) */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 z-20">
              <span className="px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs sm:text-sm font-medium text-zinc-500">
                Sold out
              </span>
              <button
                type="button"
                onClick={handleFlipToIngredients}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-white border border-stone-200 text-[11px] sm:text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <Info className="w-3 h-3" />
                <span>View ingredients</span>
              </button>
            </div>
          )}
        </div>

        {/* BACK FACE — Ingredients & Short Usage */}
        <div
          role="button"
          tabIndex={isFlipped ? 0 : -1}
          aria-hidden={!isFlipped}
          onClick={handleFlipToFront}
          onKeyDown={(e) => {
            if (isFlipped && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
              e.preventDefault();
              handleFlipToFront();
            }
          }}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className={cn(
            cardSurfaceClasses,
            'flex flex-col justify-between gap-2 cursor-pointer text-left',
            !isFlipped && 'pointer-events-none'
          )}
        >
          {/* Back Header */}
          <div className="flex items-center justify-between gap-2 shrink-0 pb-1.5 border-b border-stone-200/80">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] font-semibold text-zinc-400 shrink-0">
                {slot.slot_code}
              </span>
              <h3 className="text-xs sm:text-sm md:text-base font-semibold text-zinc-900 truncate">
                {slot.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleFlipToFront}
              aria-label={`Flip ${slot.name} card back`}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-zinc-700 text-[11px] sm:text-xs font-medium shrink-0 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Back</span>
            </button>
          </div>

          {/* Ingredients & Usage Body */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-0.5">
            <div>
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                {slot.category === 'medicine' ? 'Active Ingredients' : 'Materials'}
              </p>
              <p className="text-xs sm:text-sm text-zinc-800 leading-snug mt-0.5">
                {slot.ingredients}
              </p>
            </div>

            <div>
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                How to use
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 leading-snug mt-0.5">
                {slot.usageInstruction}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
