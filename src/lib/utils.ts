import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getExcerpt(content: string, maxLength = 100): string {
  const plain = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#*`\[\]()_~>|]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > maxLength ? plain.slice(0, maxLength) + "…" : plain;
}
