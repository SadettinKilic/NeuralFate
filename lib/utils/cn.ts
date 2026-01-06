import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge class names conditionally
 * Similar to clsx but with TypeScript support
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
