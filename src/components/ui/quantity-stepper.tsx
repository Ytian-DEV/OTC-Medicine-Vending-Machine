import { Minus, Plus } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  max: number;
  disabled?: boolean;
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
  className?: string;
}

/**
 * Origin UI grouped pill quantity stepper with animated @number-flow/react value
 * and subtle Motion press feedback.
 */
export function QuantityStepper({
  value,
  max,
  disabled = false,
  label,
  onIncrement,
  onDecrement,
  className,
}: QuantityStepperProps) {
  const canDecrement = !disabled && value > 0;
  const canIncrement = !disabled && value < max;
  const isActive = value > 0;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border p-0.5 transition-colors',
        isActive
          ? 'border-zinc-900 bg-white shadow-sm'
          : 'border-stone-200 bg-stone-50',
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.button
        type="button"
        whileTap={canDecrement ? { scale: 0.95 } : undefined}
        disabled={!canDecrement}
        onClick={(e) => {
          e.stopPropagation();
          if (canDecrement) onDecrement();
        }}
        aria-label={`Decrease ${label} quantity`}
        className={cn(
          'h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-colors',
          canDecrement
            ? 'bg-white text-zinc-900 border border-stone-200/90 shadow-2xs hover:bg-stone-100'
            : 'text-zinc-300 cursor-not-allowed'
        )}
      >
        <Minus className="w-4 h-4 stroke-[2]" />
      </motion.button>

      <span
        aria-label={`${label} quantity`}
        className={cn(
          'min-w-[2.25rem] sm:min-w-[2.5rem] text-center text-sm sm:text-base font-medium tabular-nums select-none',
          isActive ? 'text-zinc-900' : 'text-zinc-400'
        )}
      >
        <NumberFlow value={value} />
      </span>

      <motion.button
        type="button"
        whileTap={canIncrement ? { scale: 0.95 } : undefined}
        disabled={!canIncrement}
        onClick={(e) => {
          e.stopPropagation();
          if (canIncrement) onIncrement();
        }}
        aria-label={`Increase ${label} quantity`}
        className={cn(
          'h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-colors',
          canIncrement
            ? isActive
              ? 'bg-zinc-900 text-white hover:bg-zinc-800'
              : 'bg-white text-zinc-900 border border-stone-200/90 shadow-2xs hover:bg-zinc-900 hover:text-white hover:border-zinc-900'
            : 'text-zinc-300 cursor-not-allowed'
        )}
      >
        <Plus className="w-4 h-4 stroke-[2]" />
      </motion.button>
    </div>
  );
}
