/**
 * SAILL - SRIT AI Language Laboratory
 * Accessibility Utilities & Screen Reader Announcement Helpers (WCAG 2.2 AA)
 */

import { useState, useEffect } from 'react';

/**
 * Dynamically announces messages to screen readers via an aria-live region.
 */
export function announceToScreenReader(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
) {
  if (typeof document === 'undefined') return;

  const liveRegionId = politeness === 'assertive' ? 'saill-a11y-assertive' : 'saill-a11y-polite';
  let liveRegion = document.getElementById(liveRegionId);

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = liveRegionId;
    liveRegion.setAttribute('aria-live', politeness);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  // Clear briefly then update content to force screen reader announcement
  liveRegion.textContent = '';
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, 50);
}

/**
 * Custom hook to detect if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Sets focus safely to an element by ID or ref
 */
export function setFocus(elementIdOrRef: string | HTMLElement | null) {
  if (!elementIdOrRef) return;
  const el = typeof elementIdOrRef === 'string' ? document.getElementById(elementIdOrRef) : elementIdOrRef;
  if (el) {
    el.focus();
  }
}
