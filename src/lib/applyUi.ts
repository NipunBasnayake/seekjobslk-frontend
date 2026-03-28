import type { ApplyTarget } from "@/lib/applyTarget";

interface ApplyButtonState {
  canApply: boolean;
  label: string;
  showCountdownHelper: boolean;
  isUnavailable: boolean;
}

export function getApplyButtonState(target: ApplyTarget, secondsLeft: number): ApplyButtonState {
  if (target.kind === "none") {
    return {
      canApply: false,
      label: "Application unavailable",
      showCountdownHelper: false,
      isUnavailable: true,
    };
  }

  if (secondsLeft > 0) {
    return {
      canApply: false,
      label: `Available in ${secondsLeft}s`,
      showCountdownHelper: true,
      isUnavailable: false,
    };
  }

  return {
    canApply: true,
    label: "Apply now",
    showCountdownHelper: false,
    isUnavailable: false,
  };
}
