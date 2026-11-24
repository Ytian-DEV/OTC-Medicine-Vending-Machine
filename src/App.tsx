import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlotGrid } from '@/components/SlotGrid';
import { CartBar } from '@/components/CartBar';
import { CornerControls } from '@/components/CornerControls';
import { PaymentModal } from '@/components/PaymentModal';
import { DispensingModal } from '@/components/DispensingModal';
import { ClaimModal } from '@/components/ClaimModal';
import { SymptomCheckScreen } from '@/components/SymptomCheckScreen';
import { SafetyQuestionnaireScreen } from '@/components/SafetyQuestionnaireScreen';
import { RecommendationScreen } from '@/components/RecommendationScreen';
import { INITIAL_SLOTS } from '@/data/initialSlots';
import { resolveSymptomStep } from '@/data/symptomFlow';
import {
  completeCheckoutTransaction,
  fetchSlots,
  restockAllSlots,
} from '@/lib/supabase';
import type {
  CartItem,
  CheckoutStage,
  KioskView,
  RecommendationResult,
  SlotItem,
  SymptomId,
} from '@/types/kiosk';
import { playClearBeep, playClickBeep, playRestockChime } from '@/utils/sound';

const IDLE_TIMEOUT_SECONDS = 45;

export default function App() {
  const [slots, setSlots] = useState<SlotItem[]>(INITIAL_SLOTS);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [stage, setStage] = useState<CheckoutStage>('idle');
  const [dispensedSnapshot, setDispensedSnapshot] = useState<CartItem[]>([]);
  const [isRestocking, setIsRestocking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Guided Pre-Grid Symptom Check State
  const [view, setView] = useState<KioskView>('symptom-check');
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomId | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answerHistory, setAnswerHistory] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const lastActivityRef = useRef<number>(Date.now());
  const pendingCheckoutRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let active = true;
    fetchSlots().then(({ slots: loaded }) => {
      if (!active) return;
      setSlots(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const cartItems: CartItem[] = useMemo(() => {
    return slots
      .filter((s) => (quantities[s.slot_code] ?? 0) > 0)
      .map((slot) => {
        const quantity = Math.min(quantities[slot.slot_code] ?? 0, slot.stock);
        return {
          slot,
          quantity,
          subtotal: quantity * slot.price,
        };
      })
      .filter((item) => item.quantity > 0);
  }, [slots, quantities]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotal, 0),
    [cartItems]
  );

  const resetToSymptomCheck = useCallback((clearCart = false) => {
    if (clearCart) {
      setQuantities({});
    }
    setSelectedSymptom(null);
    setAnswers({});
    setAnswerHistory([]);
    setRecommendation(null);
    setView('symptom-check');
  }, []);

  // 45-second idle timeout auto-reset back to "Hello! What are you feeling?"
  useEffect(() => {
    const isIdleHome = view === 'symptom-check' && totalQuantity === 0 && stage === 'idle';
    if (isIdleHome || stage === 'dispensing' || stage === 'claim') return;

    lastActivityRef.current = Date.now();

    const resetActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events: (keyof WindowEventMap)[] = ['pointerdown', 'touchstart', 'keydown'];
    events.forEach((evt) => window.addEventListener(evt, resetActivity, { passive: true }));

    const interval = window.setInterval(() => {
      const elapsedSec = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      if (elapsedSec >= IDLE_TIMEOUT_SECONDS) {
        playClearBeep();
        setStage('idle');
        resetToSymptomCheck(true);
      }
    }, 1000);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetActivity));
      window.clearInterval(interval);
    };
  }, [view, totalQuantity, stage, resetToSymptomCheck]);

  // Questionnaire resolution for current symptom & answers
  const questionnaireResolution = useMemo(() => {
    if (!selectedSymptom) return null;
    return resolveSymptomStep(selectedSymptom, answers);
  }, [selectedSymptom, answers]);

  const recommendedSlots: SlotItem[] = useMemo(() => {
    if (!recommendation) return [];
    return recommendation.slotCodes
      .map((code) => slots.find((s) => s.slot_code === code))
      .filter((s): s is SlotItem => Boolean(s));
  }, [recommendation, slots]);

  // Step 1 -> Step 2
  const handleSelectSymptom = useCallback((symptom: SymptomId) => {
    playClickBeep(780, 30);
    setSelectedSymptom(symptom);
    setAnswers({});
    setAnswerHistory([]);
    setRecommendation(null);
    setView('questionnaire');
  }, []);

  // Step 2 answer handler
  const handleQuestionAnswer = useCallback(
    (questionId: string, value: string) => {
      if (!selectedSymptom) return;
      playClickBeep(780, 30);
      const nextAnswers = { ...answers, [questionId]: value };
      setAnswers(nextAnswers);
      setAnswerHistory((prev) => [...prev, questionId]);

      const nextResolution = resolveSymptomStep(selectedSymptom, nextAnswers);
      if (nextResolution.type === 'recommend') {
        setRecommendation(nextResolution.result);
        setView('recommendation');
      }
    },
    [selectedSymptom, answers]
  );

  // Step 2 back handler
  const handleQuestionBack = useCallback(() => {
    playClickBeep(640, 25);
    if (answerHistory.length === 0) {
      resetToSymptomCheck(false);
      return;
    }
    const lastId = answerHistory[answerHistory.length - 1];
    setAnswerHistory((prev) => prev.slice(0, -1));
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[lastId];
      return copy;
    });
  }, [answerHistory, resetToSymptomCheck]);

  const handleBrowseAll = useCallback(() => {
    playClickBeep(760, 30);
    setView('grid');
  }, []);

  const handleStartOver = useCallback(() => {
    playClearBeep();
    resetToSymptomCheck(false);
  }, [resetToSymptomCheck]);

  // Step 3 -> Proceed directly to Payment with recommended item(s)
  const handleRecommendationProceedToPayment = useCallback((inStockSlots: SlotItem[]) => {
    if (inStockSlots.length === 0) return;
    playClickBeep(840, 30);
    const nextQuantities: Record<string, number> = {};
    for (const item of inStockSlots) {
      nextQuantities[item.slot_code] = 1;
    }
    setQuantities(nextQuantities);
    setStage('payment');
  }, []);

  // Step 3 -> Add recommended item(s) to cart & open 3x3 grid
  const handleRecommendationAddAndBrowse = useCallback((inStockSlots: SlotItem[]) => {
    playClickBeep(780, 30);
    if (inStockSlots.length > 0) {
      setQuantities((prev) => {
        const next = { ...prev };
        for (const item of inStockSlots) {
          const current = next[item.slot_code] ?? 0;
          next[item.slot_code] = Math.min(item.stock, Math.max(1, current));
        }
        return next;
      });
    }
    setView('grid');
  }, []);

  const handleIncrement = useCallback(
    (slotCode: string) => {
      const target = slots.find((s) => s.slot_code === slotCode);
      if (!target || target.stock <= 0) return;

      setQuantities((prev) => {
        const current = prev[slotCode] ?? 0;
        if (current >= target.stock) return prev;
        playClickBeep(780, 30);
        return { ...prev, [slotCode]: current + 1 };
      });
    },
    [slots]
  );

  const handleDecrement = useCallback((slotCode: string) => {
    setQuantities((prev) => {
      const current = prev[slotCode] ?? 0;
      if (current <= 0) return prev;
      playClickBeep(620, 30);
      const next = { ...prev };
      if (current === 1) {
        delete next[slotCode];
      } else {
        next[slotCode] = current - 1;
      }
      return next;
    });
  }, []);

  const handleClear = useCallback(() => {
    playClearBeep();
    setQuantities({});
  }, []);

  const handleRestockAll = useCallback(async () => {
    if (isRestocking) return;
    setIsRestocking(true);
    try {
      const { slots: restocked } = await restockAllSlots(slots);
      setSlots(restocked);
      playRestockChime();
    } finally {
      setIsRestocking(false);
    }
  }, [isRestocking, slots]);

  const handleToggleFullscreen = useCallback(() => {
    playClickBeep(720, 30);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const handleConfirmOrder = useCallback(() => {
    if (totalQuantity === 0) return;
    playClickBeep(840, 30);
    setStage('payment');
  }, [totalQuantity]);

  const handleCancelPayment = useCallback(() => {
    setStage('idle');
  }, []);

  const handleDonePaying = useCallback(() => {
    const snapshot = cartItems;
    setDispensedSnapshot(snapshot);
    setStage('dispensing');

    pendingCheckoutRef.current = completeCheckoutTransaction(snapshot, slots).then(
      ({ slots: updatedSlots }) => {
        setSlots(updatedSlots);
      }
    );
  }, [cartItems, slots]);

  const handleDispenseComplete = useCallback(async () => {
    if (pendingCheckoutRef.current) {
      try {
        await pendingCheckoutRef.current;
      } finally {
        pendingCheckoutRef.current = null;
      }
    }
    setStage('claim');
  }, []);

  // Reset cart & return to "Hello! What are you feeling?" after claiming items
  const handleClaimClose = useCallback(() => {
    setDispensedSnapshot([]);
    setStage('idle');
    resetToSymptomCheck(true);
  }, [resetToSymptomCheck]);

  return (
    <div className="h-dvh w-screen overflow-hidden flex flex-col p-4 md:p-6 gap-4 bg-stone-100 select-none">
      <CornerControls
        isRestocking={isRestocking}
        isFullscreen={isFullscreen}
        showBackToSymptomCheck={view === 'grid'}
        onBackToSymptomCheck={() => {
          playClickBeep(680, 25);
          resetToSymptomCheck(false);
        }}
        onRestockAll={handleRestockAll}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {view === 'symptom-check' && (
        <SymptomCheckScreen
          onSelectSymptom={handleSelectSymptom}
          onBrowseAll={handleBrowseAll}
        />
      )}

      {view === 'questionnaire' && selectedSymptom && questionnaireResolution && (
        <SafetyQuestionnaireScreen
          symptom={selectedSymptom}
          question={
            questionnaireResolution.type === 'question'
              ? questionnaireResolution.question
              : undefined
          }
          safetyAlert={
            questionnaireResolution.type === 'safety'
              ? questionnaireResolution.alert
              : undefined
          }
          onAnswer={handleQuestionAnswer}
          onBack={handleQuestionBack}
          onStartOver={handleStartOver}
          onBrowseAll={handleBrowseAll}
        />
      )}

      {view === 'recommendation' && selectedSymptom && recommendation && (
        <RecommendationScreen
          symptom={selectedSymptom}
          recommendedSlots={recommendedSlots}
          cautionNote={recommendation.cautionNote}
          onProceedToPayment={handleRecommendationProceedToPayment}
          onAddAndBrowse={handleRecommendationAddAndBrowse}
          onStartOver={handleStartOver}
        />
      )}

      {view === 'grid' && (
        <>
          <SlotGrid
            slots={slots}
            quantities={quantities}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />

          <CartBar
            cartItems={cartItems}
            totalQuantity={totalQuantity}
            totalAmount={totalAmount}
            onClear={handleClear}
            onConfirm={handleConfirmOrder}
          />
        </>
      )}

      {stage === 'payment' && (
        <PaymentModal
          cartItems={cartItems}
          totalAmount={totalAmount}
          onDonePaying={handleDonePaying}
          onCancel={handleCancelPayment}
        />
      )}

      {stage === 'dispensing' && (
        <DispensingModal
          cartItems={dispensedSnapshot}
          onComplete={handleDispenseComplete}
        />
      )}

      {stage === 'claim' && (
        <ClaimModal
          dispensedItems={dispensedSnapshot}
          onClose={handleClaimClose}
        />
      )}
    </div>
  );
}
