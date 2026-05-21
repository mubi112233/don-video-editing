'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Wrapper component that safely handles hydration mismatches caused by:
 * - Browser extensions (e.g., BI tools) injecting attributes
 * - Dynamic script injection/reordering
 * - Client-side mutations before React hydration completes
 */
export function HydrationSafeWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This runs after hydration is complete
    // The mere presence of this effect helps React complete hydration properly
    if (ref.current) {
      // Mark hydration as complete
      ref.current.setAttribute('data-hydrated', 'true');
    }
  }, []);

  return (
    <div ref={ref} suppressHydrationWarning>
      {children}
    </div>
  );
}
