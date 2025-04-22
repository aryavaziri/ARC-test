import { ZodError } from "zod";
import { Barlow_Condensed } from "next/font/google";

export type TResponse<T = any> = {
  data?: T;
  error?: string;
  success: boolean;
};
export async function handleWithTryCatch<T>(fn: () => Promise<T>): Promise<{ data?: T; error?: string; success: boolean }> {
  try {
    const data = await fn();
    return { data, success: true };
  } catch (error) {
    // console.error("Handle With Try Catch error occurred:", (error as Error));
    console.error("Handle With Try Catch error occurred:", (error as Error).message);
    if (error instanceof ZodError) {
      return { error: `Validation Error: ` + error.errors.map(v => v.message).join(", "), success: false };
    }
    return { error: (error as Error).message, success: false };
  }
}

export const generateFileName = (inputString: string): string => {
  return inputString
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_.]/g, "");
}

export const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export function slugify(str: string) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '')       // Remove non-word chars
    .replace(/\-\-+/g, '-')         // Collapse multiple dashes
}
