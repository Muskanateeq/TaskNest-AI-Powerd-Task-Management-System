/**
 * Performance Optimization Utilities
 *
 * Best practices for optimizing React performance in TaskNest
 */

import { useCallback, useRef, useEffect } from 'react';

/**
 * Debounce Hook
 * Delays execution of a function until after a specified delay
 * Useful for search inputs, resize handlers, etc.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Throttle Hook
 * Limits the rate at which a function can fire
 * Useful for scroll handlers, mouse move events, etc.
 */
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 300
): T {
  const lastRan = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Previous Value Hook
 * Returns the previous value of a state or prop
 * Useful for comparing changes
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Intersection Observer Hook
 * Detects when an element enters the viewport
 * Useful for lazy loading images, infinite scroll, etc.
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
): boolean {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options]);

  return isIntersecting;
}

/**
 * Performance Monitoring
 * Measures component render time
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Performance] ${componentName} - Render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
      );
    }

    startTime.current = performance.now();
  });
}

/**
 * Performance Best Practices:
 *
 * 1. Memoization:
 *    - Use React.memo for components that render often with same props
 *    - Use useMemo for expensive computations
 *    - Use useCallback for functions passed as props
 *
 * 2. Code Splitting:
 *    - Use dynamic imports for large components
 *    - Lazy load routes and modals
 *    - Split vendor bundles
 *
 * 3. List Optimization:
 *    - Use key prop correctly (stable, unique IDs)
 *    - Virtualize long lists (react-window, react-virtualized)
 *    - Paginate or infinite scroll for large datasets
 *
 * 4. Image Optimization:
 *    - Use Next.js Image component
 *    - Lazy load images below the fold
 *    - Use appropriate image formats (WebP, AVIF)
 *    - Optimize image sizes
 *
 * 5. Bundle Optimization:
 *    - Tree shake unused code
 *    - Minimize dependencies
 *    - Use production builds
 *    - Enable compression (gzip, brotli)
 *
 * 6. State Management:
 *    - Keep state as local as possible
 *    - Avoid unnecessary context re-renders
 *    - Use state selectors for large contexts
 *
 * 7. Network Optimization:
 *    - Debounce API calls
 *    - Cache responses
 *    - Use optimistic updates
 *    - Implement request deduplication
 */

import React from 'react';

const performanceUtils = {};

export default performanceUtils;
