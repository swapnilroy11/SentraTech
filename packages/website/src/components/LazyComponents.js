import React, { Suspense, lazy } from 'react';

// Lazy-loaded heavy components
export const LazyCustomerJourney3D = lazy(() => 
  import('./CustomerJourney3D').then(module => ({ default: module.default }))
);

export const LazyHorizontalJourney = lazy(() => 
  import('./HorizontalJourney').then(module => ({ default: module.default }))
);

export const LazyContactSalesSlideIn = lazy(() => 
  import('./ContactSalesSlideIn').then(module => ({ default: module.default }))
);

export const LazyCaseStudies = lazy(() => 
  import('./CaseStudies').then(module => ({ default: module.default }))
);

// Wrapper component with loading fallback
export const LazyComponentWrapper = ({ children, fallback = <div className="animate-pulse bg-gray-200 h-20 rounded"></div> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Optimized motion components - only import when needed
export const OptimizedMotion = {
  div: lazy(() => 
    import('framer-motion').then(module => ({ default: module.motion.div }))
  ),
  section: lazy(() => 
    import('framer-motion').then(module => ({ default: module.motion.section }))
  ),
  h1: lazy(() => 
    import('framer-motion').then(module => ({ default: module.motion.h1 }))
  ),
  p: lazy(() => 
    import('framer-motion').then(module => ({ default: module.motion.p }))
  ),
  AnimatePresence: lazy(() => 
    import('framer-motion').then(module => ({ default: module.AnimatePresence }))
  ),
};