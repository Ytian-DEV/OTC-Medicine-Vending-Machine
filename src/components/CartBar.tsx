import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';
import type { CartItem } from '@/types/kiosk';

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
  const summaryLine = cartItems
    .map(({ slot, quantity }) => `${slot.name} ×${quantity}`)
    .join(', ');

  return (
    <footer className="shrink-0 bg-white border border-stone-200 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4 shadow-sm">
      {/* Left: Animated Total Price & Subtle Item Summary */}
      <div className="flex items-baseline gap-3 min-w-0">
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums shrink-0">
          <NumberFlow value={totalAmount} prefix="₱" />
        </span>

        <span className="text-xs sm:text-sm text-zinc-500 truncate">
          {isEmpty
            ? 'Select items'
            : `${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`}
          {!isEmpty && (
            <span className="hidden md:inline text-zinc-400"> · {summaryLine}</span>
          )}
        </span>
      </div>

      {/* Right: Quiet Clear & Charcoal Confirm Pill */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <motion.button
          type="button"
          whileTap={!isEmpty ? { scale: 0.95 } : undefined}
          disabled={isEmpty}
          onClick={onClear}
          className="h-11 px-4 rounded-full text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-stone-100 transition-colors disabled:opacity-35 disabled:pointer-events-none"
        >
          Clear
        </motion.button>

        <motion.button
          type="button"
          whileTap={!isEmpty ? { scale: 0.95 } : undefined}
          disabled={isEmpty}
          onClick={onConfirm}
          className="h-11 px-7 rounded-full bg-zinc-900 text-white text-sm sm:text-base font-medium hover:bg-zinc-800 transition-colors disabled:opacity-35 disabled:pointer-events-none"
        >
          Confirm
        </motion.button>
      </div>
    </footer>
  );
}
