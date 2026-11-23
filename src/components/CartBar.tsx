import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import type { CartItem } from '../types/kiosk';
import { formatPHP } from '../data/initialSlots';

interface CartBarProps {
  cartItems: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  onClear: () => void;
  onConfirm: () => void;
}

export function CartBar({
  cartItems,
  totalQuantity,
  totalAmount,
  onClear,
  onConfirm,
}: CartBarProps) {
  const isEmpty = totalQuantity === 0;

  return (
    <footer className="shrink-0 bg-white border-t border-slate-200 px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] z-10">
      <div className="flex flex-col landscape:lg:flex-row landscape:lg:items-center justify-between gap-2.5 sm:gap-3">
        {/* Selected Items Horizontal Scrollable Pills */}
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-x-auto no-scrollbar py-0.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
            <ShoppingBag className="w-4 h-4 text-teal-600" />
            <span>Selected:</span>
          </span>

          {isEmpty ? (
            <span className="text-xs sm:text-sm font-medium text-slate-400 truncate">
              Tap any product or + button above to add items
            </span>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {cartItems.map(({ slot, quantity }) => (
                <span
                  key={slot.slot_code}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-300 text-teal-800 text-xs sm:text-sm font-bold whitespace-nowrap"
                >
                  <span className="font-mono text-[11px] bg-teal-600 text-white px-1.5 py-0.2 rounded">
                    {slot.slot_code}
                  </span>
                  <span>{slot.name}</span>
                  <span className="font-mono text-teal-700">×{quantity}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Total Summary & Primary Action Buttons */}
        <div className="flex items-center justify-between landscape:lg:justify-end gap-2.5 sm:gap-4 shrink-0">
          <div className="flex flex-col landscape:lg:items-end">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 leading-none">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} selected
            </span>
            <span className="font-mono text-xl sm:text-2xl lg:text-[26px] font-bold text-slate-900 leading-tight">
              Total: <span className="text-teal-700">{formatPHP(totalAmount)}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              disabled={isEmpty}
              onClick={onClear}
              className="min-h-[48px] min-w-[48px] px-3 sm:px-4 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 active:scale-95 transition-transform duration-100 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Clear / Reset</span>
            </button>

            <button
              type="button"
              disabled={isEmpty}
              onClick={onConfirm}
              className="min-h-[52px] min-w-[130px] sm:min-w-[190px] px-4 sm:px-6 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 active:scale-95 transition-transform duration-100 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <span>Confirm Order</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
