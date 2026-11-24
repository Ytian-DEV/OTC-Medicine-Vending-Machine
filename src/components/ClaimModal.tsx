import { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CartItem } from '@/types/kiosk';
import { playClaimChime } from '@/utils/sound';

const AUTO_CLOSE_MS = 4000;

interface ClaimModalProps {
  dispensedItems: CartItem[];
  onClose: () => void;
}

export function ClaimModal({ dispensedItems, onClose }: ClaimModalProps) {
  const closedRef = useRef(false);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    playClaimChime();

    const timer = window.setTimeout(() => {
      if (!closedRef.current) {
        closedRef.current = true;
        onCloseRef.current();
      }
    }, AUTO_CLOSE_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const summaryLine = dispensedItems
    .map(({ slot, quantity }) => `${slot.name} ×${quantity}`)
    .join(', ');

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !closedRef.current) {
          closedRef.current = true;
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md text-center items-center justify-items-center gap-5 py-10">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-16 w-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-zinc-900"
        >
          <ArrowDown className="w-7 h-7 stroke-[1.75]" />
        </motion.div>

        <DialogHeader className="items-center space-y-2">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-zinc-900 leading-snug max-w-xs">
            Please claim your item at the receiving bin.
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            {summaryLine}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
