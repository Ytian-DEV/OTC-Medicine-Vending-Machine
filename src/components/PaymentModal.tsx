import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CartItem } from '@/types/kiosk';

interface PaymentModalProps {
  cartItems: CartItem[];
  totalAmount: number;
  onDonePaying: () => void;
  onCancel: () => void;
}

export function PaymentModal({
  cartItems,
  totalAmount,
  onDonePaying,
  onCancel,
}: PaymentModalProps) {
  const summaryLine = cartItems
    .map(({ slot, quantity }) => `${slot.name} ×${quantity}`)
    .join(', ');

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="sm:max-w-md text-center gap-6">
        <DialogHeader className="items-center space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-zinc-900">
            Insert Cash
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            {summaryLine}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <p className="text-5xl sm:text-6xl font-semibold tracking-tight text-zinc-900 tabular-nums">
            <NumberFlow value={totalAmount} prefix="₱" />
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={onDonePaying}
            className="w-full h-12 rounded-full bg-zinc-900 text-white text-base font-medium hover:bg-zinc-800 transition-colors"
          >
            Done Paying
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="w-full h-11 rounded-full text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-stone-100 transition-colors"
          >
            Back
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
