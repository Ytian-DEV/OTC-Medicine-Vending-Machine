import { AlertTriangle, ArrowLeft, LayoutGrid, RotateCcw, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import {
  SYMPTOM_OPTIONS,
  SYMPTOM_PILL_STYLES,
  type FlowQuestion,
} from '@/data/symptomFlow';
import type { SafetyAlertInfo, SymptomId } from '@/types/kiosk';
import { cn } from '@/lib/utils';

interface SafetyQuestionnaireScreenProps {
  symptom: SymptomId;
  question?: FlowQuestion;
  safetyAlert?: SafetyAlertInfo;
  onAnswer: (questionId: string, value: string) => void;
  onBack: () => void;
  onStartOver: () => void;
  onBrowseAll: () => void;
}

export function SafetyQuestionnaireScreen({
  symptom,
  question,
  safetyAlert,
  onAnswer,
  onBack,
  onStartOver,
  onBrowseAll,
}: SafetyQuestionnaireScreenProps) {
  const symptomMeta = SYMPTOM_OPTIONS.find((s) => s.id === symptom);

  if (safetyAlert) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center p-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'w-full max-w-xl rounded-3xl bg-white border p-7 sm:p-9 text-center flex flex-col items-center gap-5 shadow-sm',
            safetyAlert.urgent ? 'border-red-300 ring-4 ring-red-500/10' : 'border-amber-300'
          )}
        >
          <div
            className={cn(
              'h-16 w-16 rounded-full flex items-center justify-center border',
              safetyAlert.urgent
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-amber-50 border-amber-200 text-amber-600'
            )}
          >
            {safetyAlert.urgent ? (
              <ShieldAlert className="w-8 h-8 stroke-[1.75]" />
            ) : (
              <AlertTriangle className="w-8 h-8 stroke-[1.75]" />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {symptomMeta?.label}
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900">
              {safetyAlert.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-md mx-auto">
              {safetyAlert.message}
            </p>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onStartOver}
              className="w-full sm:w-auto h-12 px-7 rounded-full bg-zinc-900 text-white text-sm sm:text-base font-medium hover:bg-zinc-800 inline-flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Over</span>
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              onClick={onBrowseAll}
              className="w-full sm:w-auto h-12 px-6 rounded-full bg-white border border-stone-200 hover:border-zinc-900 text-zinc-700 hover:text-zinc-900 text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 transition-colors"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Browse All Items</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-1 sm:p-2">
      <div className="w-full max-w-2xl flex flex-col gap-4">
        {/* Subtle Back + Step Indicator */}
        <div className="flex items-center justify-between px-1">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="h-10 px-4 rounded-full bg-white border border-stone-200 hover:border-zinc-900 text-zinc-700 hover:text-zinc-900 text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </motion.button>

          <span className="text-xs sm:text-sm font-medium text-zinc-400">
            Quick check · {question.stepNumber} of {question.totalSteps}
          </span>
        </div>

        {/* Question Card */}
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl bg-white border border-stone-200/80 p-6 sm:p-9 shadow-sm flex flex-col gap-6"
        >
          <div className="space-y-2.5 text-center flex flex-col items-center">
            <span
              className={cn(
                'inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold',
                SYMPTOM_PILL_STYLES[symptom]
              )}
            >
              {symptomMeta?.label}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 leading-snug">
              {question.prompt}
            </h2>
            {question.helper && (
              <p className="text-sm text-zinc-500 max-w-lg mx-auto">{question.helper}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {question.choices.map((choice) => (
              <motion.button
                key={choice.value}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onAnswer(question.id, choice.value)}
                className={cn(
                  'w-full min-h-[58px] sm:min-h-[64px] px-6 py-3.5 rounded-2xl text-left flex items-center justify-between gap-4 transition-colors',
                  choice.emphasis === 'primary'
                    ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                    : 'bg-stone-50 border border-stone-200 text-zinc-900 hover:border-zinc-900 hover:bg-white'
                )}
              >
                <div>
                  <p className="text-base sm:text-lg font-medium leading-snug">
                    {choice.label}
                  </p>
                  {choice.description && (
                    <p
                      className={cn(
                        'text-xs sm:text-sm mt-0.5',
                        choice.emphasis === 'primary' ? 'text-zinc-300' : 'text-zinc-500'
                      )}
                    >
                      {choice.description}
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
