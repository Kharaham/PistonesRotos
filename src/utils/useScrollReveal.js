import { useEffect } from 'react';

/**
 * useScrollReveal
 * High-performance, clean scroll-driven entrance animation system.
 * Uses IntersectionObserver to reveal elements smoothly as the user scrolls,
 * and automatically resets them when the user scrolls back up so they re-animate
 * when scrolling down again.
 * 
 * @param {boolean} isActive - Whether the landing page view is currently active.
 *                             Re-initializes seamlessly when switching back from Admin mode.
 */
export function useScrollReveal(isActive = true) {
  useEffect(() => {
    // If not on the landing page view, do nothing
    if (!isActive) return;

    // Safety: ensure body scroll is unlocked when returning to landing
    if (document.body.style.overflow === 'hidden') {
      document.body.style.overflow = '';
    }

    // Respect user's accessibility preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-group > *').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // If the element exits through the bottom of the viewport (user scrolled up past it),
          // reset its visible state so it re-animates smoothly when scrolling down again.
          if (entry.boundingClientRect.top > 0) {
            entry.target.classList.remove('is-visible');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    const setupRevealElements = () => {
      // 1. Setup stagger delays for reveal-group children
      const groups = document.querySelectorAll('.reveal-group');
      groups.forEach((group) => {
        const children = Array.from(group.children);
        children.forEach((child, index) => {
          child.style.setProperty('--reveal-delay', `${Math.min(index * 75, 450)}ms`);
        });
      });

      // 2. Query all reveal targets
      const targets = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-group > *'
      );

      const viewportHeight = window.innerHeight;

      targets.forEach((el) => {
        observer.observe(el);

        const rect = el.getBoundingClientRect();
        // If element is already in the viewport or above the viewport, show immediately
        if (rect.top < viewportHeight * 0.95) {
          el.classList.add('is-visible');
        } else {
          el.classList.remove('is-visible');
        }
      });
    };

    // Helper: When scrolled to the very top, ensure all offscreen sections below reset
    const handleScrollTop = () => {
      if (window.scrollY < 30) {
        const targets = document.querySelectorAll(
          '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-group > *'
        );
        const viewportHeight = window.innerHeight;
        targets.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top > viewportHeight * 0.85) {
            el.classList.remove('is-visible');
          }
        });
      }
    };

    // Run setup immediately on mount/return to landing
    setupRevealElements();

    // Re-check shortly after mount to ensure layout fonts, images and dynamic CMS data settle
    const t1 = setTimeout(setupRevealElements, 60);
    const t2 = setTimeout(setupRevealElements, 200);
    const t3 = setTimeout(setupRevealElements, 500);

    // Watch for DOM changes (filters, dynamic lists, CMS updates)
    let rafId = null;
    const mutationObserver = new MutationObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(setupRevealElements);
    });

    // Observe document.body so the observer never detaches even when views switch
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', handleScrollTop, { passive: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('scroll', handleScrollTop);
    };
  }, [isActive]);
}
