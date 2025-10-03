import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for optimal className handling
 * @param inputs - Variable number of className arguments
 * @returns Merged className string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Additional utilities (placeholders for future implementation)

/**
 * Format date for Brazilian locale
 * @param date - Date to format
 * @returns Formatted date string
 */
// export const formatDate = (date: Date): string => {
//   return new Intl.DateTimeFormat('pt-BR').format(date);
// };

/**
 * Format currency for Brazilian Real
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
// export const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat('pt-BR', {
//     style: 'currency',
//     currency: 'BRL',
//   }).format(amount);
// };

/**
 * Convert string to URL-safe slug
 * @param text - Text to convert
 * @returns URL-safe slug
 */
// export const slugify = (text: string): string => {
//   return text
//     .toLowerCase()
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/(^-|-$)/g, '');
// };

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis
 */
// export const truncate = (text: string, maxLength: number): string => {
//   if (text.length <= maxLength) return text;
//   return text.slice(0, maxLength).trim() + '...';
// };

/* Usage example:
import { cn } from '@/lib/utils';

// Merge classes with conflict resolution
const className = cn(
  'px-4 py-2',
  isActive && 'bg-primary text-white',
  'px-6' // This overrides px-4
);
// Result: 'py-2 bg-primary text-white px-6'
*/