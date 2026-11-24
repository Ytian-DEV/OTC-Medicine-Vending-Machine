import { useEffect, useState } from 'react';
import { ArrowRight, Info, LayoutGrid, RotateCcw } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { motion } from 'motion/react';
import { formatPHP, getFallbackProductImage } from '@/data/initialSlots';
import { SYMPTOM_OPTIONS, SYMPTOM_PILL_STYLES } from '@/data/symptomFlow';
import type { SlotItem, SymptomId } from '@/types/kiosk';
import { cn } from '@/lib/utils';

interface RecommendationScreenProps {
  symptom: SymptomId;
  recommendedSlots: SlotItem[];
  cautionNote?: string;
  onProceedToPayment: (inStockSlots: SlotItem[]) => void;
  onAddAndBrowse: (inStockSlots: SlotItem[]) => void;
  onStartOver: () => void;
}

function RecommendedItemCard({ slot }: { slot: SlotItem }) {
  const [imgSrc, setImgSrc] = useState(slot.image_url);

  useEffect(() => {
    setImgSrc(slot.image_url);
  }, [slot.image_url]);

  const isSoldOut = slot.stock <= 0;

  return (
    <div
      className={cn(
        'rounded-2xl bg-white border p-4 sm:p-5 flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5 shadow-sm min-h-0',
        isSoldOut ? 'border-stone-200 opacity-85' : 'border-zinc-900/15'
      )}
    >
      {/* Product Photo */}
      <div className="sm:w-36 md:w-44 h-32 sm:h-auto shrink-0 rounded-xl bg-stone-50 flex items-center justify-center p-3 overflow-hidden">
        <img
          src={imgSrc}
          alt={slot.name}
          onError={() => setImgSrc(getFallbackProductImage(slot.slot_code))}
          className="w-full h-full object-contain select-none pointer-events-none"
          draggable={false}
        />
      </div>

      {/* Product Details + Ingredients + Usage */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-2.5 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-zinc-900 text-white px-2.5 py-0.5 text-xs font-semibold">
                {slot.slot_code}
              </span>
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums',
                  isSoldOut
                    ? 'bg-red-50 text-red-600'
                    : slot.stock <= 3
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-stone-100 text-zinc-600'
                )}
              >
                {isSoldOut ? 'Sold out' : `${slot.stock} left`}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight mt-1.5">
              {slot.name}
            </h3>
          </div>

          <span className="text-xl sm:text-2xl font-semibold text-zinc-900 tabular-nums shrink-0">
            {formatPHP(slot.price)}
          </span>
        </div>

        <div className="space-y-2 border-t border-stone-100 pt-2.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              {slot.category === 'medicine' ? 'Active Ingredients' : 'Materials'}
            </p>
            <p className="text-xs sm:text-sm text-zinc-700 leading-snug mt-0.5">
              {slot.ingredients}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Usage Instruction
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 leading-snug mt-0.5">
              {slot.usageInstruction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecommendationScreen({
  symptom,
  recommendedSlots,
  cautionNote,
  onProceedToPayment,
  onAddAndBrowse,
  onStartOver,
}: RecommendationScreenProps) {
  const symptomMeta = SYMPTOM_OPTIONS.find((s) => s.id === symptom);
  const inStockSlots = recommendedSlots.filter((s) => s.stock > 0);
  const allSoldOut = inStockSlots.length === 0;
  const totalAmount = inStockSlots.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between gap-4 max-w-4xl w-full mx-auto py-1 sm:py-2">
      {/* Header */}
      <div className="shrink-0 text-center space-y-2 flex flex-col items-center">
        <span
          className={cn(
            'inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold',
            SYMPTOM_PILL_STYLES[symptom]
          )}
        >
          {symptomMeta?.label}
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
          {allSoldOut ? 'Recommended Item Out of Stock' : 'Recommended for You'}
        </h2>
      </div>

      {/* Recommended Item Card(s) */}
      <div className="flex-1 min-h-0 flex flex-col justify-center gap-3 overflow-y-auto py-1">
        <div
          className={cn(
            'grid gap-3',
            recommendedSlots.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
          )}
        >
          {recommendedSlots.map((slot) => (
            <RecommendedItemCard key={slot.slot_code} slot={slot} />
          ))}
        </div>

        {/* Optional Caution Note + Standard Safety Note */}
        <div className="rounded-2xl bg-stone-200/60 border border-stone-200 px-4 py-3 flex items-start gap-2.5 text-left">
          <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-zinc-600 space-y-1">
            {cautionNote && <p className="font-medium text-amber-800">{cautionNote}</p>}
            <p>For minor symptoms only. Visit the school clinic if symptoms persist or worsen.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="shrink-0 bg-white border border-stone-200 rounded-2xl px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={onStartOver}
          className="h-11 px-4 rounded-full text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-stone-100 inline-flex items-center justify-center gap-1.5 transition-colors order-3 sm:order-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start Over</span>
        </motion.button>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2.5 order-1 sm:order-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onAddAndBrowse(inStockSlots)}
            className="w-full sm:w-auto h-11 px-5 rounded-full bg-white border border-stone-200 hover:border-zinc-900 text-zinc-800 text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{allSoldOut ? 'Browse All Items' : 'Add & Browse All Items'}</span>
          </motion.button>

          {!allSoldOut && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={() => onProceedToPayment(inStockSlots)}
              className="w-full sm:w-auto h-11 px-7 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 transition-colors"
            >
              <span>Proceed to Payment</span>
              <span className="text-zinc-300 tabular-nums">
                (<NumberFlow value={totalAmount} prefix="₱" />)
              </span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
