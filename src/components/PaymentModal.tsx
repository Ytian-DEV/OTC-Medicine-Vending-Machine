import { Banknote, CheckCircle2, Coins, X } from 'lucide-react';
import type { CartItem } from '../types/kiosk';
import { formatPHP } from '../data/initialSlots';

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
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-5 max-h-[92dvh] overflow-y-auto">
        {/* Animated Cash / Peso Icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center animate-cash-bob shadow-sm">
            <Banknote className="w-10 h-10 text-amber-600" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow">
            <Coins className="w-4 h-4" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h2
            id="payment-modal-title"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            Please Insert Cash
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
            Insert bills or coins into the acceptor, then tap{' '}
            <span className="font-bold text-emerald-700">Done Paying</span>.
          </p>
        </div>

        {/* Order Breakdown */}
        <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5 max-h-48 overflow-y-auto">
          {cartItems.map(({ slot, quantity, subtotal }) => (
            <div
              key={slot.slot_code}
              className="flex items-center justify-between gap-3 text-sm sm:text-base"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white shrink-0">
                  {slot.slot_code}
                </span>
                <span className="font-semibold text-slate-800 truncate">{slot.name}</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-teal-700 shrink-0">
                  ×{quantity}
                </span>
              </div>
              <span className="font-mono font-bold text-slate-900 shrink-0">
                {formatPHP(subtotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Highlighted Total Due Box */}
        <div className="w-full rounded-2xl bg-amber-50 border-2 border-amber-500 px-5 py-4 flex items-center justify-between gap-4">
          <span className="text-base sm:text-lg font-bold text-amber-900">
            Insert Cash Total
          </span>
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-amber-600 tracking-tight">
            {formatPHP(totalAmount)}
          </span>
        </div>

        {/* Prototype Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={onDonePaying}
            className="w-full min-h-[58px] rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 active:scale-95 transition-transform duration-100 text-white font-extrabold text-lg sm:text-xl flex items-center justify-center gap-2.5 shadow-md"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>Done Paying</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full min-h-[48px] rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 transition-transform duration-100 text-slate-700 font-bold text-sm sm:text-base flex items-center justify-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>Cancel / Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
