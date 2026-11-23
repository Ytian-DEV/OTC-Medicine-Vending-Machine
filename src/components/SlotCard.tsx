import { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { SlotItem } from '../types/kiosk';
import { formatPHP, getFallbackProductImage } from '../data/initialSlots';

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

  const isOutOfStock = slot.stock <= 0;
  const isSelected = selectedQuantity > 0 && !isOutOfStock;
  const canIncrement = !isOutOfStock && selectedQuantity < slot.stock;
  const canDecrement = selectedQuantity > 0;
  const isHygiene = slot.category === 'Hygiene';

  const handleCardTap = () => {
    if (canIncrement) {
      onIncrement(slot.slot_code);
    }
  };

  return (
    <div
      role="button"
      tabIndex={isOutOfStock ? -1 : 0}
      aria-disabled={isOutOfStock}
      onClick={handleCardTap}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && canIncrement) {
          e.preventDefault();
          onIncrement(slot.slot_code);
        }
      }}
      className={`relative rounded-2xl border p-2.5 sm:p-3 lg:p-3.5 flex flex-col landscape:lg:flex-row justify-between gap-2 lg:gap-3.5 min-h-0 min-w-0 overflow-hidden transition-all duration-150 ${
        isOutOfStock
          ? 'bg-white border-slate-200 cursor-not-allowed'
          : isSelected
            ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-600 shadow-md cursor-pointer'
            : 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-sm cursor-pointer'
      }`}
    >
      {/* Portrait Top Row (hidden in wide landscape where it sits inside the right column) */}
      <div className="flex landscape:lg:hidden items-center justify-between gap-1 shrink-0">
        <span
          className={`font-mono font-bold text-xs sm:text-sm px-2 py-0.5 rounded-lg ${
            isSelected ? 'bg-teal-600 text-white' : 'bg-slate-900 text-white'
          }`}
        >
          {slot.slot_code}
        </span>
        <span
          className={`text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
            isOutOfStock
              ? 'bg-red-100 text-red-700'
              : slot.stock <= 3
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isOutOfStock ? 'OUT OF STOCK' : `${slot.stock} left`}
        </span>
      </div>

      {/* Product Photo Container */}
      <div
        className={`relative rounded-xl flex items-center justify-center overflow-hidden min-h-0 flex-1 landscape:lg:flex-none landscape:lg:w-[36%] landscape:lg:h-full ${
          isHygiene ? 'bg-rose-50/80' : 'bg-sky-50/80'
        }`}
      >
        <img
          src={imgSrc}
          alt={slot.name}
          onError={() => setImgSrc(getFallbackProductImage(slot.slot_code))}
          className="w-full h-full object-contain p-1.5 sm:p-2 pointer-events-none select-none"
          draggable={false}
        />
        <span
          className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold shadow-sm border ${
            isHygiene
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-sky-50 text-sky-700 border-sky-200'
          }`}
        >
          {slot.category}
        </span>
      </div>

      {/* Right Column (Landscape) / Lower Section (Portrait) */}
      <div className="flex flex-col justify-between gap-1.5 sm:gap-2 min-w-0 shrink-0 landscape:lg:flex-1 landscape:lg:h-full">
        {/* Landscape-only Top Row */}
        <div className="hidden landscape:lg:flex items-center justify-between gap-2 shrink-0">
          <span
            className={`font-mono font-bold text-xs xl:text-sm px-2.5 py-0.5 rounded-lg ${
              isSelected ? 'bg-teal-600 text-white' : 'bg-slate-900 text-white'
            }`}
          >
            {slot.slot_code}
          </span>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
              isOutOfStock
                ? 'bg-red-100 text-red-700'
                : slot.stock <= 3
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isOutOfStock ? 'OUT OF STOCK' : `${slot.stock} left`}
          </span>
        </div>

        {/* Product Info */}
        <div className="min-w-0">
          <h2 className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-slate-900 leading-tight truncate">
            {slot.name}
          </h2>
          <div className="flex items-baseline justify-between gap-1 mt-0.5 landscape:lg:flex-col landscape:lg:items-start">
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 truncate">
              {slot.unit_label}
            </span>
            <span className="font-mono font-bold text-sm sm:text-base lg:text-lg xl:text-xl text-teal-600 leading-tight">
              {formatPHP(slot.price)}
            </span>
          </div>
        </div>

        {/* Interactive Stepper Row (minimum 48x48 touch targets) */}
        <div className="flex items-center justify-between gap-1.5 shrink-0 pt-0.5">
          <button
            type="button"
            disabled={!canDecrement}
            onClick={(e) => {
              e.stopPropagation();
              if (canDecrement) onDecrement(slot.slot_code);
            }}
            aria-label={`Decrease ${slot.name} quantity`}
            className={`min-w-[48px] min-h-[48px] rounded-xl flex items-center justify-center border transition-transform duration-100 active:scale-95 ${
              canDecrement
                ? 'bg-white border-teal-600 text-teal-700 hover:bg-teal-50 shadow-sm'
                : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Minus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <span
            aria-label={`Selected quantity for ${slot.name}`}
            className={`font-mono font-bold text-base sm:text-lg lg:text-xl tabular-nums text-center min-w-[24px] ${
              isSelected ? 'text-teal-700' : 'text-slate-400'
            }`}
          >
            {selectedQuantity}
          </span>

          <button
            type="button"
            disabled={!canIncrement}
            onClick={(e) => {
              e.stopPropagation();
              if (canIncrement) onIncrement(slot.slot_code);
            }}
            aria-label={`Increase ${slot.name} quantity`}
            className={`min-w-[48px] min-h-[48px] rounded-xl flex items-center justify-center transition-transform duration-100 active:scale-95 ${
              canIncrement
                ? 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Out of Stock Frosted Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 z-10">
          <span className="px-3.5 py-1.5 rounded-xl bg-red-500 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md">
            OUT OF STOCK
          </span>
          <span className="text-[11px] font-semibold text-slate-600 mt-1.5 text-center">
            Slot {slot.slot_code} • Tap Restock All to refill
          </span>
        </div>
      )}
    </div>
  );
}
