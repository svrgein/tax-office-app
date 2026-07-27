import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely, resolving conflicting utility classes.
 * Used by all shadcn/ui components and reusable components in this project.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
