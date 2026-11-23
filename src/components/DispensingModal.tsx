import { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { CartItem } from '../types/kiosk';
import { playThreeSecondBeep } from '../utils/sound';

const DISPENSE_DURATION_MS = 3000;

interface DispensingModalProps {
  cartItems: CartItem[];
  onComplete: () => void;
}

export function DispensingModal({ cartItems, onComplete }: DispensingModalProps) {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const stopBeep = playThreeSecondBeep();
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / DISPENSE_DURATION_MS) * 100);
      setProgress(pct);

      if (elapsed < DISPENSE_DURATION_MS) {
        rafId = requestAnimationFrame(tick);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current();
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      stopBeep();
    };
  }, []);

  const elapsedSeconds = ((progress / 100) * 3).toFixed(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dispensing-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-5 text-center">
        {/* Pulsing Audio Beep Indicator */}
        <div className="relative flex items-center justify-center w-24 h-24">
          <span className="absolute inset-0 rounded-full bg-teal-400/35 animate-pulse-ring" />
          <div className="relative w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-600 flex items-center justify-center shadow-sm">
            <Volume2 className="w-10 h-10 text-teal-600 animate-pulse" />
          </div>
        </div>

        <div>
          <h2
            id="dispensing-modal-title"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
          >
            Dispensing Your Items...
          </h2>
          <p className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 font-mono text-xs sm:text-sm font-bold text-teal-700">
            <span>3-Second Audio Alert Active</span>
            <span>•</span>
            <span>880Hz</span>
          </p>
        </div>

        {/* Live 3.0s Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full h-5 rounded-full bg-slate-200 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-teal-600 transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-xs sm:text-sm font-semibold text-slate-600">
            <span>{Math.round(progress)}%</span>
            <span>{elapsedSeconds}s / 3.0s</span>
          </div>
        </div>

        {/* Dispensing Items Chips */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-1">
          {cartItems.map(({ slot, quantity }) => (
            <span
              key={slot.slot_code}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700"
            >
              <span className="font-mono text-teal-700">{slot.slot_code}</span>
              <span>{slot.name}</span>
              <span className="font-mono">×{quantity}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
