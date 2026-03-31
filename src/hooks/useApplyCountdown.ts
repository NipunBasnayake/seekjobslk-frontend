import { useCallback, useEffect, useState } from "react";
import { isBrowser } from "@/lib/safeBrowser";

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
  const safeInitialSeconds = Math.max(0, Math.floor(initialSeconds));
  const [secondsLeft, setSecondsLeft] = useState(safeInitialSeconds);

  const isLocked = secondsLeft > 0;
  const isComplete = secondsLeft === 0;
  const progress =
    safeInitialSeconds === 0 ? 1 : 1 - secondsLeft / safeInitialSeconds;

  // Format time as "Xs" or "X" for display
  const formattedTime = `${secondsLeft}s`;

  // Countdown effect

  useEffect(() => {
    if (!isBrowser()) return;
    if (secondsLeft <= 0) {
      onComplete?.();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [secondsLeft, onComplete]);

  const reset = useCallback(() => {
    setSecondsLeft(safeInitialSeconds);
  }, [safeInitialSeconds]);

  return {
    secondsLeft,
    isLocked,
    isComplete,
    progress,
    formattedTime,
    reset,
  };
}
