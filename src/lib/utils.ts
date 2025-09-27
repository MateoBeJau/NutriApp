/**
 * Utility function to conditionally join class names
 * @param classes Array of class names, undefined, null, or false values
 * @returns String of joined class names
 */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}