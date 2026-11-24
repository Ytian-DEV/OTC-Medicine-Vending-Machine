import {
  Activity,
  ArrowRight,
  Bandage,
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

interface SymptomVisualTheme {
  icon: React.ComponentType<{ className?: string }>;
  iconBox: string;
  hoverCard: string;
  arrowColor: string;
}

const SYMPTOM_THEMES: Record<SymptomId, SymptomVisualTheme> = {
  'headache-fever': {
    icon: Thermometer,
    iconBox: 'bg-orange-50 text-orange-600 ring-1 ring-orange-200/80',
    hoverCard: 'hover:border-orange-300 hover:bg-orange-50/25',
    arrowColor: 'group-hover:text-orange-500',
  },
  'cold-nose': {
    icon: Wind,
    iconBox: 'bg-teal-50 text-teal-600 ring-1 ring-teal-200/80',
    hoverCard: 'hover:border-teal-300 hover:bg-teal-50/25',
    arrowColor: 'group-hover:text-teal-500',
  },
  cough: {
    icon: Stethoscope,
    iconBox: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/80',
    hoverCard: 'hover:border-emerald-300 hover:bg-emerald-50/25',
    arrowColor: 'group-hover:text-emerald-500',
  },
  diarrhea: {
    icon: Activity,
    iconBox: 'bg-sky-50 text-sky-600 ring-1 ring-sky-200/80',
    hoverCard: 'hover:border-sky-300 hover:bg-sky-50/25',
    arrowColor: 'group-hover:text-sky-500',
  },
  allergies: {
    icon: Sparkles,
    iconBox: 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/80',
    hoverCard: 'hover:border-indigo-300 hover:bg-indigo-50/25',
    arrowColor: 'group-hover:text-indigo-500',
  },
  'cut-scrape': {
    icon: Bandage,
    iconBox: 'bg-amber-50 text-amber-600 ring-1 ring-amber-200/80',
    hoverCard: 'hover:border-amber-300 hover:bg-amber-50/25',
    arrowColor: 'group-hover:text-amber-500',
  },
  menstrual: {
    icon: Droplets,
    iconBox: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200/80',
    hoverCard: 'hover:border-rose-300 hover:bg-rose-50/25',
    arrowColor: 'group-hover:text-rose-500',
  },
};

export function SymptomCheckScreen({
  onSelectSymptom,
  onBrowseAll,
}: SymptomCheckScreenProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-center gap-5 sm:gap-6 max-w-6xl w-full mx-auto py-2 sm:py-4">
      {/* Welcoming Greeting Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="shrink-0 text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200/90 shadow-2xs text-xs font-medium text-zinc-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
          </span>
          <span>Guided Quick Check</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900">
          Hello! What are you feeling?
        </h1>
        <p className="text-sm sm:text-base text-zinc-500">
          Tap a symptom or need below for a quick recommendation.
        </p>
      </motion.div>

      {/* Uniform 8-Card Grid (7 Symptoms + 1 Browse All Items card — 2×4 Portrait / 4×2 Landscape) */}
      <div className="flex-1 min-h-0 max-h-[540px] landscape:lg:max-h-[460px] grid grid-cols-2 lg:grid-cols-4 grid-rows-4 lg:grid-rows-2 gap-3 sm:gap-4">
        {SYMPTOM_OPTIONS.map((option, idx) => {
          const theme = SYMPTOM_THEMES[option.id];
          const Icon = theme.icon;

          return (
            <motion.button
              key={option.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.28,
                delay: idx * 0.035,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectSymptom(option.id)}
              className={cn(
                'group rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-md p-4 sm:p-5 flex flex-col justify-between text-left transition-all duration-150 min-h-0 min-w-0',
                theme.hoverCard
              )}
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <div
                  className={cn(
                    'h-11 w-11 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110',
                    theme.iconBox
                  )}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.9]" />
                </div>

                <ArrowRight
                  className={cn(
                    'w-4 h-4 sm:w-5 sm:h-5 text-zinc-300 transition-all duration-200 group-hover:translate-x-0.5',
                    theme.arrowColor
                  )}
                />
              </div>

              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-sm sm:text-base md:text-lg font-semibold text-zinc-900 tracking-tight leading-snug">
                  {option.label}
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 leading-snug line-clamp-2">
                  {option.subtitle}
                </p>
              </div>
            </motion.button>
          );
        })}

        {/* 8th Uniform Card: Skip / Browse All Items */}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.28,
            delay: SYMPTOM_OPTIONS.length * 0.035,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBrowseAll}
          className="group rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-900 shadow-sm hover:shadow-md p-4 sm:p-5 flex flex-col justify-between text-left transition-all duration-150 min-h-0 min-w-0 text-white"
        >
          <div className="flex items-start justify-between gap-2 w-full">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-white/10 ring-1 ring-white/15 text-white flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.9]" />
            </div>

            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
          </div>

          <div className="space-y-0.5 sm:space-y-1 min-w-0">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-white tracking-tight leading-snug">
              Browse All Items
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-snug">
              Skip check &amp; view all 9 slots
            </p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
