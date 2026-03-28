import { useCallback, useEffect, useState } from "react";

interface UseApplyCountdownOptions {
  initialSeconds?: number;
  onComplete?: () => void;
}

interface UseApplyCountdownResult {
  secondsLeft: number;
  isLocked: boolean;
  isComplete: boolean;
  progress: number; // 0 to 1 representing countdown progress
  formattedTime: string;
  reset: () => void;
}

/**
 * Hook for managing apply button countdown state
 *
 * @param options.initialSeconds - Total seconds for countdown (default: 10)
 * @param options.onComplete - Callback when countdown completes
 */
export function useApplyCountdown(
  options: UseApplyCountdownOptions = {}
): UseApplyCountdownResult {
  const { initialSeconds = 10, onComplete } = options;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  const isLocked = secondsLeft > 0;
  const isComplete = secondsLeft === 0;
  const progress = 1 - secondsLeft / initialSeconds;

  // Format time as "Xs" or "X" for display
  const formattedTime = `${secondsLeft}s`;

  // Countdown effect
  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete?.();
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [secondsLeft, onComplete]);

  const reset = useCallback(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  return {
    secondsLeft,
    isLocked,
    isComplete,
    progress,
    formattedTime,
    reset,
  };
}
