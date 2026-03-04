import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserInitials = (fullName: string) => {
  return fullName
    .split(" ")
    .map((n) => n[0])
    .join("");
};
