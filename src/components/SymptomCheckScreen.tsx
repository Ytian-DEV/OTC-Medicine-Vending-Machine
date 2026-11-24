import {
  Activity,
  Bandage,
  ChevronRight,
  Droplets,
  LayoutGrid,
  Sparkles,
  Stethoscope,
  Thermometer,
  Wind,
} from 'lucide-react';
import { motion } from 'motion/react';
import { SYMPTOM_OPTIONS } from '@/data/symptomFlow';
import type { SymptomId } from '@/types/kiosk';
import { cn } from '@/lib/utils';

interface SymptomCheckScreenProps {
  onSelectSymptom: (symptom: SymptomId) => void;
  onBrowseAll: () => void;
}

const SYMPTOM_ICONS: Record<SymptomId, React.ComponentType<{ className?: string }>> = {
  'headache-fever': Thermometer,
  'cold-nose': Wind,
  cough: Stethoscope,
  diarrhea: Activity,
  allergies: Sparkles,
  'cut-scrape': Bandage,
  menstrual: Droplets,
};

export function SymptomCheckScreen({
  onSelectSymptom,
  onBrowseAll,
}: SymptomCheckScreenProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between gap-4 sm:gap-5 max-w-5xl w-full mx-auto py-1 sm:py-2">
      {/* Calm Greeting Header */}
      <div className="shrink-0 text-center space-y-1.5 pt-1 sm:pt-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900">
          Hello! What are you feeling?
        </h1>
        <p className="text-sm sm:text-base text-zinc-500">
          Tap a symptom or need below for a quick recommendation.
        </p>
      </div>

      {/* 7 Symptom / Need Touch Cards */}
      <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5 auto-rows-fr">
        {SYMPTOM_OPTIONS.map((option, idx) => {
          const Icon = SYMPTOM_ICONS[option.id];
          const isLastOdd = idx === SYMPTOM_OPTIONS.length - 1;

          return (
            <motion.button
              key={option.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSymptom(option.id)}
              className={cn(
                'group rounded-2xl bg-white border border-stone-200/80 hover:border-zinc-900 hover:shadow-sm px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-3.5 text-left transition-all min-h-0',
                isLastOdd && 'sm:col-span-2 lg:col-span-3'
              )}
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-stone-100 group-hover:bg-zinc-900 group-hover:text-white text-zinc-700 flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-base md:text-lg font-semibold text-zinc-900 tracking-tight leading-snug">
                    {option.label}
                  </p>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-0.5 truncate">
                    {option.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 shrink-0 transition-colors" />
            </motion.button>
          );
        })}
      </div>

      {/* Secondary Skip / Browse All Bar */}
      <div className="shrink-0 flex justify-center pt-1">
        <motion.button
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={onBrowseAll}
          className="h-12 px-6 sm:px-8 rounded-full bg-white border border-stone-200 hover:border-zinc-900 text-zinc-700 hover:text-zinc-900 text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Skip / Browse All Items</span>
        </motion.button>
      </div>
    </div>
  );
}
