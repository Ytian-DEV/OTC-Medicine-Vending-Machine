import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface CornerControlsProps {
  isRestocking: boolean;
  isFullscreen: boolean;
  onRestockAll: () => void;
  onToggleFullscreen: () => void;
}

/**
 * Two tiny, low-contrast corner icon buttons so maintenance controls never
 * distract customers or add navbar clutter.
 */
export function CornerControls({
  isRestocking,
  isFullscreen,
  onRestockAll,
  onToggleFullscreen,
}: CornerControlsProps) {
  return (
    <div className="fixed top-1.5 right-2 z-30 flex items-center gap-1">
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        disabled={isRestocking}
        onClick={onRestockAll}
        title="Restock all slots"
        aria-label="Restock all slots"
        className="h-7 w-7 rounded-full flex items-center justify-center text-zinc-400/80 hover:text-zinc-700 hover:bg-stone-200/70 transition-colors disabled:opacity-40"
      >
        <RotateCcw className={`w-3.5 h-3.5 ${isRestocking ? 'animate-spin' : ''}`} />
      </motion.button>

      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={onToggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        className="h-7 w-7 rounded-full flex items-center justify-center text-zinc-400/80 hover:text-zinc-700 hover:bg-stone-200/70 transition-colors"
      >
        {isFullscreen ? (
          <Minimize2 className="w-3.5 h-3.5" />
        ) : (
          <Maximize2 className="w-3.5 h-3.5" />
        )}
      </motion.button>
    </div>
  );
}
