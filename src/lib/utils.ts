import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

type calculateScoreType = {
  tType: "toeic" | "ielts";
  pType: "listening" | "reading" | "speaking" | "writing";
  correct: number;
};

export function calculateScore({ tType, pType, correct }: calculateScoreType) {
  // Toeic
  if (tType === "toeic") {
    if (pType === "listening") {
      return correct < 1
        ? 0
        : correct < 76
        ? (correct - 1) * 5 + 15
        : correct < 96
        ? (correct - 1) * 5 + 15
        : 495;
    } else if (pType === "reading") {
      return correct < 1 ? 0 : correct < 3 ? 5 : 10 + (correct - 3) * 5;
    }
  }
  return 0;
}
