import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = null,
  fallback = null,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad = () => {},
  onError = () => {},
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  // Image loading handlers
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad();
  };

  const handleError = () => {
    setHasError(true);
    onError();
  };

  // Placeholder component
  const PlaceholderComponent = placeholder || (
    <div 
      className={`bg-gradient-to-r from-[rgb(38,40,42)] to-[rgb(26,28,30)] animate-pulse flex items-center justify-center ${className}`}
      style={{ minHeight: '200px' }}
    >
      <div className="text-[rgb(161,161,170)] text-sm font-medium">
        Loading...
      </div>
    </div>
  );

  // Error fallback component  
  const FallbackComponent = fallback || (
    <div 
      className={`bg-[rgb(38,40,42)] border-2 border-dashed border-[rgb(63,63,63)] flex items-center justify-center ${className}`}
      style={{ minHeight: '200px' }}
    >
      <div className="text-center text-[rgb(161,161,170)]">
        <div className="text-2xl mb-2">📷</div>
        <div className="text-sm">Failed to load image</div>
      </div>
    </div>
  );

  return (
    <div ref={imgRef} className="relative">
      {!isInView && PlaceholderComponent}
      
      {isInView && !hasError && (
        <>
          {!isLoaded && PlaceholderComponent}
          <img
            src={src}
            alt={alt}
            className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ease-in-out`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
            decoding="async"
            {...props}
          />
        </>
      )}
      
      {hasError && FallbackComponent}
    </div>
  );
};

export default LazyImage;