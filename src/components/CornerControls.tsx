import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface CornerControlsProps {
  isRestocking: boolean;
  isFullscreen: boolean;
  onRestockAll: () => void;
  onToggleFullscreen: () => void;
}

/**
 * Two tiny, low-contrast corner icon buttons placed cleanly above the top-right
 * edge of the grid so they never overlap slot A3's stock indicator.
 */
export function CornerControls({
  isRestocking,
  isFullscreen,
  onRestockAll,
  onToggleFullscreen,
}: CornerControlsProps) {
  return (
    <div className="shrink-0 flex items-center justify-end gap-1 -my-2">
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
  );
}
