import type { RecommendationResult, SafetyAlertInfo, SymptomId } from '@/types/kiosk';

export interface SymptomOption {
  id: SymptomId;
  label: string;
  subtitle: string;
}

export const SYMPTOM_OPTIONS: SymptomOption[] = [
  {
    id: 'headache-fever',
    label: 'Headache / Fever / Body Pain',
    subtitle: 'Pain or fever relief',
  },
  {
    id: 'cold-nose',
    label: 'Cold / Stuffy or Runny Nose',
    subtitle: 'Nasal congestion & colds',
  },
  {
    id: 'cough',
    label: 'Cough',
    subtitle: 'Mild herbal cough relief',
  },
  {
    id: 'diarrhea',
    label: 'Diarrhea / Stomachache (LBM)',
    subtitle: 'Loose bowel movement',
  },
  {
    id: 'allergies',
    label: 'Allergies / Sneezing / Itchiness',
    subtitle: 'Antihistamine relief',
  },
  {
    id: 'cut-scrape',
    label: 'Minor Cut or Scrape',
    subtitle: 'First-aid wound cover',
  },
  {
    id: 'menstrual',
    label: 'Period / Menstrual Care',
    subtitle: 'Pads, cup & cramp relief',
  },
];

export const SYMPTOM_PILL_STYLES: Record<SymptomId, string> = {
  'headache-fever': 'bg-orange-600 text-white',
  'cold-nose': 'bg-teal-600 text-white',
  cough: 'bg-emerald-600 text-white',
  diarrhea: 'bg-sky-600 text-white',
  allergies: 'bg-indigo-600 text-white',
  'cut-scrape': 'bg-amber-600 text-white',
  menstrual: 'bg-rose-600 text-white',
};

export interface QuestionChoice {
  label: string;
  description?: string;
  value: string;
  emphasis?: 'primary' | 'secondary';
}

export interface FlowQuestion {
  id: string;
  stepNumber: number;
  totalSteps: number;
  prompt: string;
  helper?: string;
  choices: QuestionChoice[];
}

export type FlowStepResolution =
  | { type: 'question'; question: FlowQuestion }
  | { type: 'safety'; alert: SafetyAlertInfo }
  | { type: 'recommend'; result: RecommendationResult };

/**
 * Pure deterministic decision tree for the 7 kiosk symptom/need flows.
 */
export function resolveSymptomStep(
  symptom: SymptomId,
  answers: Record<string, string>
): FlowStepResolution {
  switch (symptom) {
    case 'headache-fever': {
      if (!answers.stuffyNose) {
        return {
          type: 'question',
          question: {
            id: 'stuffyNose',
            stepNumber: 1,
            totalSteps: 2,
            prompt: 'Do you also have a stuffy or runny nose?',
            choices: [
              { label: 'Yes, I have a stuffy or runny nose', value: 'yes' },
              { label: 'No, just headache, fever, or body pain', value: 'no' },
            ],
          },
        };
      }
      if (!answers.paracetamolCheck) {
        return {
          type: 'question',
          question: {
            id: 'paracetamolCheck',
            stepNumber: 2,
            totalSteps: 2,
            prompt:
              'Are you allergic to Paracetamol, or have you already taken Paracetamol in the last 4 hours?',
            helper:
              answers.stuffyNose === 'yes'
                ? 'Also answer Yes if you are allergic to decongestants or have high blood pressure.'
                : 'Taking Paracetamol too frequently can be unsafe.',
            choices: [
              { label: 'No, safe to proceed', value: 'no', emphasis: 'primary' },
              { label: 'Yes (allergic / recent dose)', value: 'yes', emphasis: 'secondary' },
            ],
          },
        };
      }
      if (answers.paracetamolCheck === 'yes') {
        return {
          type: 'safety',
          alert: {
            title: 'Please visit the school clinic',
            message:
              'Because of a possible Paracetamol allergy, recent dose within 4 hours, or medical precaution, we cannot safely recommend this medicine from the kiosk. Please consult the school clinic nurse.',
          },
        };
      }
      return {
        type: 'recommend',
        result: {
          slotCodes: [answers.stuffyNose === 'yes' ? 'B1' : 'B2'],
        },
      };
    }

    case 'cold-nose': {
      if (!answers.coldSafety) {
        return {
          type: 'question',
          question: {
            id: 'coldSafety',
            stepNumber: 1,
            totalSteps: 1,
            prompt:
              'Are you allergic to Paracetamol or decongestants, or do you have high blood pressure?',
            choices: [
              { label: 'No, none of these apply', value: 'no', emphasis: 'primary' },
              { label: 'Yes', value: 'yes', emphasis: 'secondary' },
            ],
          },
        };
      }
      if (answers.coldSafety === 'yes') {
        return {
          type: 'safety',
          alert: {
            title: 'Please visit the school clinic',
            message:
              'Cold medicines with decongestants and Paracetamol may not be safe for allergies or high blood pressure. Please check with the school clinic for a safe alternative.',
          },
        };
      }
      return { type: 'recommend', result: { slotCodes: ['B1'] } };
    }

    case 'cough': {
      if (!answers.mildCough) {
        return {
          type: 'question',
          question: {
            id: 'mildCough',
            stepNumber: 1,
            totalSteps: 1,
            prompt: 'Is it a mild cough (without high fever or trouble breathing)?',
            choices: [
              { label: 'Yes, it is a mild cough', value: 'yes', emphasis: 'primary' },
              { label: 'No, I have high fever or trouble breathing', value: 'no', emphasis: 'secondary' },
            ],
          },
        };
      }
      if (answers.mildCough === 'no') {
        return {
          type: 'safety',
          alert: {
            title: 'Please visit the school clinic',
            message:
              'A cough paired with high fever or difficulty breathing needs proper medical evaluation. Please visit the school clinic right away.',
          },
        };
      }
      return { type: 'recommend', result: { slotCodes: ['B3'] } };
    }

    case 'diarrhea': {
      if (!answers.mildDiarrhea) {
        return {
          type: 'question',
          question: {
            id: 'mildDiarrhea',
            stepNumber: 1,
            totalSteps: 1,
            prompt: 'Are you having watery stools WITHOUT high fever or blood in stool?',
            choices: [
              { label: 'Yes, watery stools only', value: 'yes', emphasis: 'primary' },
              { label: 'No, I have high fever or blood in stool', value: 'no', emphasis: 'secondary' },
            ],
          },
        };
      }
      if (answers.mildDiarrhea === 'no') {
        return {
          type: 'safety',
          alert: {
            title: 'Please visit the school clinic',
            message:
              'Diarrhea accompanied by high fever or bloody stool should not be treated with anti-diarrheal medication alone. Please seek care at the school clinic.',
          },
        };
      }
      return { type: 'recommend', result: { slotCodes: ['C1'] } };
    }

    case 'allergies': {
      if (!answers.mildAllergy) {
        return {
          type: 'question',
          question: {
            id: 'mildAllergy',
            stepNumber: 1,
            totalSteps: 1,
            prompt:
              'Are symptoms mild (sneezing, itchy eyes, mild rash) with NO trouble breathing or face swelling?',
            choices: [
              { label: 'Yes, mild symptoms only', value: 'yes', emphasis: 'primary' },
              { label: 'No, I have trouble breathing or swelling', value: 'no', emphasis: 'secondary' },
            ],
          },
        };
      }
      if (answers.mildAllergy === 'no') {
        return {
          type: 'safety',
          alert: {
            urgent: true,
            title: 'Urgent Clinic Notice',
            message:
              'Trouble breathing or swelling of the face, lips, or throat can be a serious allergic reaction. Please go to the school clinic or seek emergency medical help immediately.',
          },
        };
      }
      return { type: 'recommend', result: { slotCodes: ['A2'] } };
    }

    case 'cut-scrape': {
      if (!answers.minorCut) {
        return {
          type: 'question',
          question: {
            id: 'minorCut',
            stepNumber: 1,
            totalSteps: 1,
            prompt: 'Is it a small, shallow cut or scrape (not deep or heavily bleeding)?',
            choices: [
              { label: 'Yes, small and shallow', value: 'yes', emphasis: 'primary' },
              { label: 'No, it is deep or bleeding heavily', value: 'no', emphasis: 'secondary' },
            ],
          },
        };
      }
      if (answers.minorCut === 'no') {
        return {
          type: 'safety',
          alert: {
            title: 'Please visit the school clinic',
            message:
              'Deep or heavily bleeding wounds need proper cleaning and dressing by a nurse. Apply gentle pressure with a clean cloth and visit the school clinic.',
          },
        };
      }
      return { type: 'recommend', result: { slotCodes: ['A1'] } };
    }

    case 'menstrual': {
      if (!answers.periodType) {
        return {
          type: 'question',
          question: {
            id: 'periodType',
            stepNumber: 1,
            totalSteps: 2,
            prompt: 'Which type of menstrual care do you prefer?',
            choices: [
              { label: 'Disposable Pad', description: 'Modess Napkin — ₱8', value: 'C2' },
              { label: 'Reusable Pad', description: 'Washable cloth pad — ₱120', value: 'A3' },
              { label: 'Menstrual Cup', description: 'Medical-grade silicone — ₱350', value: 'C3' },
            ],
          },
        };
      }
      if (!answers.hasCramps) {
        return {
          type: 'question',
          question: {
            id: 'hasCramps',
            stepNumber: 2,
            totalSteps: 2,
            prompt: 'Do you also have period cramps?',
            choices: [
              { label: 'No, just the menstrual care item', value: 'no', emphasis: 'primary' },
              { label: 'Yes, I would like pain relief too', value: 'yes', emphasis: 'secondary' },
            ],
          },
        };
      }
      if (answers.hasCramps === 'no') {
        return {
          type: 'recommend',
          result: { slotCodes: [answers.periodType] },
        };
      }
      if (!answers.crampSafety) {
        return {
          type: 'question',
          question: {
            id: 'crampSafety',
            stepNumber: 3,
            totalSteps: 3,
            prompt:
              'Are you allergic to Paracetamol, or have you already taken Paracetamol in the last 4 hours?',
            choices: [
              { label: 'No, safe to add Biogesic (₱6)', value: 'no', emphasis: 'primary' },
              { label: 'Yes (skip pain reliever)', value: 'yes', emphasis: 'secondary' },
            ],
          },
        };
      }
      if (answers.crampSafety === 'yes') {
        return {
          type: 'recommend',
          result: {
            slotCodes: [answers.periodType],
            cautionNote:
              'Paracetamol was skipped for your safety. Please visit the school clinic if your period cramps are severe.',
          },
        };
      }
      return {
        type: 'recommend',
        result: {
          slotCodes: [answers.periodType, 'B2'],
        },
      };
    }
  }
}
