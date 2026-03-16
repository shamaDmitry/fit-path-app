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

export const getEdgeFunctionErrorMessage = async (
  error: unknown,
  data: unknown,
  response?: Response | null,
) => {
  if (data && typeof data === "object") {
    const payload = data as { error?: unknown; message?: unknown };

    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }

    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  }

  if (response) {
    try {
      const payload = (await response.clone().json()) as {
        error?: unknown;
        message?: unknown;
      };

      if (typeof payload.error === "string" && payload.error.trim()) {
        return payload.error;
      }

      if (typeof payload.message === "string" && payload.message.trim()) {
        return payload.message;
      }
    } catch {
      // Response can be non-JSON for some failures.
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};