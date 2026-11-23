// Web Audio API synthesized sound effects — zero external MP3 dependencies

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {
      // Ignore autoplay resume errors until user interaction
    });
  }
  return sharedAudioCtx;
}

/**
 * Short tactile touch-click beep (800Hz, 40ms) for +, -, card taps, and Confirm.
 */
export function playClickBeep(frequency = 800, durationMs = 40): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.14, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationMs / 1000 + 0.01);
  } catch {
    // Graceful fallback if audio device is unavailable
  }
}

/**
 * Subtle downward tone for Clear / Reset actions.
 */
export function playClearBeep(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.09);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.11);
  } catch {
    // Ignore audio errors
  }
}

/**
 * Unmistakable 3-second vending machine dispensing notification beep (880Hz pulsing pattern over 3.0s).
 * Returns a stop() cleanup callback to halt audio cleanly on unmount.
 */
export function playThreeSecondBeep(): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const activeNodes: OscillatorNode[] = [];
  const gainNodes: GainNode[] = [];

  try {
    const startTime = ctx.currentTime;
    const totalDuration = 3.0;

    // Schedule 6 crisp 0.42s pulses across 3.0 seconds (0.5s cycle) at 880Hz
    // so it reads as an unmistakable 3-second vending machine dispensing beep.
    const pulseCount = 6;
    const pulseStep = totalDuration / pulseCount; // 0.5s

    for (let i = 0; i < pulseCount; i++) {
      const pulseStart = startTime + i * pulseStep;
      const pulseDuration = i === pulseCount - 1 ? 0.46 : 0.36;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(i === pulseCount - 1 ? 1046.5 : 880, pulseStart);

      gain.gain.setValueAtTime(0.001, pulseStart);
      gain.gain.linearRampToValueAtTime(0.18, pulseStart + 0.02);
      gain.gain.setValueAtTime(0.18, pulseStart + pulseDuration - 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, pulseStart + pulseDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(pulseStart);
      osc.stop(pulseStart + pulseDuration + 0.02);

      activeNodes.push(osc);
      gainNodes.push(gain);
    }
  } catch {
    // Ignore audio errors
  }

  return () => {
    for (const gain of gainNodes) {
      try {
        gain.disconnect();
      } catch {
        // Already disconnected
      }
    }
    for (const osc of activeNodes) {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Already stopped
      }
    }
  };
}

/**
 * Friendly ascending chime when items are ready at the receiving bin.
 */
export function playClaimChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [587.33, 880, 1174.66]; // D5 -> A5 -> D6

    notes.forEach((freq, idx) => {
      const t = now + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  } catch {
    // Ignore audio errors
  }
}

/**
 * Crisp two-note confirmation chime for "Restock All".
 */
export function playRestockChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    [659.25, 987.77].forEach((freq, idx) => {
      const t = now + idx * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.13, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.22);
    });
  } catch {
    // Ignore audio errors
  }
}
