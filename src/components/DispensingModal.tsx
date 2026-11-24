import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import type { CartItem } from '@/types/kiosk';
import { playThreeSecondBeep } from '@/utils/sound';

const DISPENSE_DURATION_MS = 3000;

interface DispensingModalProps {
  cartItems: CartItem[];
  onComplete: () => void;
}

export function DispensingModal({ cartItems, onComplete }: DispensingModalProps) {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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

  const summaryLine = cartItems
    .map(({ slot, quantity }) => `${slot.name} ×${quantity}`)
    .join(', ');

  return (
    <Dialog open>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md text-center gap-6 py-9"
      >
        <DialogHeader className="items-center space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-zinc-900">
            Dispensing
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            {summaryLine}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full pt-1">
          <Progress value={progress} className="h-2.5 bg-stone-200" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
