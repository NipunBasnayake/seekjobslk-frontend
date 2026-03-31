// src/lib/safeBrowser.ts

/**
 * Returns true if running in a browser (not SSR).
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Returns true if running inside an iframe or embedded context.
 * Safe for cross-origin.
 */
export function isInIframe(): boolean {
  if (!isBrowser()) return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/**
 * Safely focus an element, catching errors (e.g., in restricted/preview/iframe environments).
 */
export function safeFocus(element: HTMLElement | null | undefined) {
  if (!element) return;
  try {
    element.focus();
  } catch {
    // Ignore focus errors (e.g., AdSense preview, cross-origin, etc.)
  }
}

/**
 * Safely open a URL in a new window/tab, catching errors.
 */
export function safeWindowOpen(url: string, target?: string, features?: string) {
  if (!isBrowser()) return;
  try {
    window.open(url, target, features);
  } catch {
    // Ignore window.open errors (e.g., sandboxed/preview/iframe environments)
  }
}
