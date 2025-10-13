import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "@/payload-types";
import { ClientUser } from "payload";

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

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m ${seconds % 60}s`;
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

export function evaluateSpeed(
  timePerQuestion: number,
  testType: "toeic" | "ielts"
) {
  if (timePerQuestion === 0) return '"The Flash"';
  if (testType === "toeic") {
    if (timePerQuestion < 30) return "Excellent";
    if (timePerQuestion < 40) return "Good";
    if (timePerQuestion < 50) return "Average";
    if (timePerQuestion < 65) return "Slow";
    return "Very Slow";
  }

  if (testType === "ielts") {
    if (timePerQuestion < 70) return "Excellent";
    if (timePerQuestion < 100) return "Good";
    if (timePerQuestion < 120) return "Average";
    if (timePerQuestion < 150) return "Slow";
    return "Very Slow";
  }
}

export const isSuperAdmin = (user: User | ClientUser | null) => {
  return Boolean(user?.roles.includes("super-admin"));
};
