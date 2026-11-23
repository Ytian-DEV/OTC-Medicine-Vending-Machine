import { useEffect, useRef, useState } from 'react';
import { ArrowDown, Check } from 'lucide-react';
import type { CartItem } from '../types/kiosk';
import { playClaimChime } from '../utils/sound';

const AUTO_CLOSE_MS = 5000;

interface ClaimModalProps {
  dispensedItems: CartItem[];
  onClose: () => void;
}

export function ClaimModal({ dispensedItems, onClose }: ClaimModalProps) {
  const [remainingMs, setRemainingMs] = useState(AUTO_CLOSE_MS);
  const closedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    playClaimChime();
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const left = Math.max(0, AUTO_CLOSE_MS - elapsed);
      setRemainingMs(left);

      if (left > 0) {
        rafId = requestAnimationFrame(tick);
      } else if (!closedRef.current) {
        closedRef.current = true;
        onCloseRef.current();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const progressPct = (remainingMs / AUTO_CLOSE_MS) * 100;
  const secondsLeft = Math.ceil(remainingMs / 1000);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border border-emerald-200 shadow-2xl p-6 sm:p-8 flex flex-col items-center gap-5 text-center">
        {/* Glowing Downward Receiving-Bin Arrow */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-pulse-ring" />
          <div className="relative w-24 h-24 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center shadow-md">
            <ArrowDown className="w-12 h-12 text-emerald-600 stroke-[2.75] animate-bounce-bin" />
          </div>
        </div>

        {/* Headline */}
        <div>
          <h2
            id="claim-modal-title"
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug"
          >
            Please claim your item at the receiving bin.
          </h2>
          <p className="text-sm sm:text-base text-emerald-700 font-semibold mt-1.5">
            Thank you for using CareVend PH!
          </p>
        </div>

        {/* Dispensed Items List */}
        <div className="w-full bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex flex-wrap items-center justify-center gap-2">
          {dispensedItems.map(({ slot, quantity }) => (
            <span
              key={slot.slot_code}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold shadow-sm"
            >
              <span className="font-mono text-emerald-700">{slot.slot_code}</span>
              <span>{slot.name}</span>
              <span className="font-mono">×{quantity}</span>
            </span>
          ))}
        </div>

        {/* Auto-Close 5s Countdown Bar */}
        <div className="w-full space-y-1.5">
          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-75 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Returning to main menu automatically in{' '}
            <span className="font-mono font-bold text-slate-700">{secondsLeft}s</span>
          </p>
        </div>

        {/* Early Dismiss Done Button */}
        <button
          type="button"
          onClick={() => {
            if (!closedRef.current) {
              closedRef.current = true;
              onClose();
            }
          }}
          className="w-full min-h-[54px] rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 active:scale-95 transition-transform duration-100 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-sm"
        >
          <Check className="w-5 h-5 stroke-[2.75]" />
          <span>Done</span>
        </button>
      </div>
    </div>
  );
}
