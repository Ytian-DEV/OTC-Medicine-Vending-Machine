import { ArrowLeft, Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface CornerControlsProps {
  isRestocking: boolean;
  isFullscreen: boolean;
  showBackToSymptomCheck?: boolean;
  onBackToSymptomCheck?: () => void;
  onRestockAll: () => void;
  onToggleFullscreen: () => void;
}

/**
 * Slim, unobtrusive top utility strip:
 * - Left (on 3x3 grid only): quiet "Back to Symptom Check" pill button
 * - Right: tiny low-contrast Restock & Fullscreen icon buttons
 */
export function CornerControls({
  isRestocking,
  isFullscreen,
  showBackToSymptomCheck = false,
  onBackToSymptomCheck,
  onRestockAll,
  onToggleFullscreen,
}: CornerControlsProps) {
  return (
    <div
      className={cn(
        'shrink-0 flex items-center gap-2 -my-1.5',
        showBackToSymptomCheck ? 'justify-between' : 'justify-end'
      )}
    >
      {showBackToSymptomCheck && onBackToSymptomCheck && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={onBackToSymptomCheck}
          className="h-8 px-3 rounded-full bg-white/90 border border-stone-200 hover:border-zinc-900 text-zinc-600 hover:text-zinc-900 text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Symptom Check</span>
        </motion.button>
      )}

      <div className="flex items-center gap-1">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          disabled={isRestocking}
          onClick={onRestockAll}
          title="Restock all slots"
          aria-label="Restock all slots"
          className="h-7 w-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-stone-200/70 transition-colors disabled:opacity-40"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isRestocking ? 'animate-spin' : ''}`} />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="h-7 w-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-stone-200/70 transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
