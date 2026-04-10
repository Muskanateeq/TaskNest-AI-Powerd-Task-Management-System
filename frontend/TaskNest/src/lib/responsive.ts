/**
 * Responsive Design Utilities and Breakpoints
 *
 * TaskNest uses Tailwind CSS responsive design system with the following breakpoints:
 *
 * Breakpoints:
 * - sm: 640px  (Mobile landscape, small tablets)
 * - md: 768px  (Tablets)
 * - lg: 1024px (Desktop)
 * - xl: 1280px (Large desktop)
 * - 2xl: 1536px (Extra large desktop)
 *
 * Mobile-First Approach:
 * - Base styles apply to mobile (320px+)
 * - Use responsive prefixes for larger screens (sm:, md:, lg:, etc.)
 *
 * Touch Targets:
 * - Minimum 44x44px for interactive elements
 * - Increased padding on mobile for better touch experience
 *
 * Typography Scale:
 * - Mobile: Smaller font sizes for better readability
 * - Desktop: Larger font sizes with more spacing
 *
 * Layout Patterns:
 * - Mobile: Single column, stacked layout
 * - Tablet: 2-column grid where appropriate
 * - Desktop: Multi-column layouts with sidebars
 */

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Check if viewport matches breakpoint
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Responsive Design Best Practices:
 *
 * 1. Touch Targets:
 *    - Use min-h-[44px] min-w-[44px] for buttons
 *    - Add p-3 or p-4 for better touch area
 *
 * 2. Typography:
 *    - Use responsive text sizes: text-sm md:text-base lg:text-lg
 *    - Adjust line height for readability
 *
 * 3. Spacing:
 *    - Use responsive spacing: p-4 md:p-6 lg:p-8
 *    - Reduce margins on mobile
 *
 * 4. Layout:
 *    - Stack on mobile: flex-col
 *    - Grid on desktop: md:grid md:grid-cols-2 lg:grid-cols-3
 *
 * 5. Navigation:
 *    - Hamburger menu on mobile
 *    - Full navigation on desktop
 *
 * 6. Forms:
 *    - Full width inputs on mobile
 *    - Larger touch targets for form controls
 *    - Use type="tel", type="email" for better mobile keyboards
 *
 * 7. Images:
 *    - Use responsive images with srcset
 *    - Lazy load images below the fold
 *
 * 8. Performance:
 *    - Reduce animations on mobile
 *    - Optimize images for mobile bandwidth
 *    - Use CSS containment for better performance
 */

import React from 'react';

const responsiveUtils = {};

export default responsiveUtils;
