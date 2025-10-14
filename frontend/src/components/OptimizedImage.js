import React, { useState, useRef, useEffect } from 'react';
import { throttle } from '../utils/performanceOptimizations';

/**
 * High-Performance Optimized Image Component
 * Features:
 * - Modern format support (WebP, AVIF)
 * - Lazy loading with intersection observer
 * - Blur-up placeholder effect
 * - Responsive srcsets
 * - Layout shift prevention
 * - Error handling with fallbacks
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = null,
  sizes = '',
  priority = false,
  quality = 80,
  format = 'auto', // 'auto', 'webp', 'avif', 'jpg', 'png'
  aspectRatio,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate responsive image sources
  const generateSrcSet = (baseSrc, format) => {
    if (!baseSrc || baseSrc.startsWith('data:')) return '';
    
    const widths = [320, 640, 768, 1024, 1280, 1600, 1920];
    const extension = format === 'auto' ? getOriginalFormat(baseSrc) : format;
    
    return widths
      .map(w => {
        const optimizedSrc = generateOptimizedSrc(baseSrc, w, extension, quality);
        return `${optimizedSrc} ${w}w`;
      })
      .join(', ');
  };

  // Get original image format
  const getOriginalFormat = (src) => {
    const ext = src.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext) ? ext : 'jpg';
  };

  // Generate optimized source URL (placeholder function - would integrate with image CDN)
  const generateOptimizedSrc = (src, width, format, quality) => {
    // In a real implementation, this would generate URLs for your CDN
    // For now, return the original source
    if (src.includes('images/team/')) {
      // Convert team images to WebP if supported
      if (format === 'webp' && supportsWebP()) {
        return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      }
      if (format === 'avif' && supportsAVIF()) {
        return src.replace(/\.(jpg|jpeg|png)$/i, '.avif');
      }
    }
    return src;
  };

  // Feature detection
  const supportsWebP = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  const supportsAVIF = () => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  // Image load handlers
  const handleLoad = throttle((e) => {
    setImageLoaded(true);
    if (onLoad) onLoad(e);
  }, 100);

  const handleError = (e) => {
    setImageError(true);
    console.warn('Image failed to load:', src);
    if (onError) onError(e);
  };

  // Calculate aspect ratio styles
  const aspectRatioStyle = aspectRatio ? {
    aspectRatio: aspectRatio,
    width: '100%',
    height: 'auto'
  } : {
    width: width || '100%',
    height: height || 'auto'
  };

  // Generate optimized sources
  const webpSrcSet = format === 'auto' || format === 'webp' 
    ? generateSrcSet(src, 'webp') 
    : null;
  const avifSrcSet = format === 'auto' || format === 'avif' 
    ? generateSrcSet(src, 'avif') 
    : null;
  const fallbackSrcSet = generateSrcSet(src, getOriginalFormat(src));

  // Placeholder component
  const PlaceholderComponent = () => (
    <div 
      className={`bg-gray-800 animate-pulse ${className}`}
      style={{
        ...aspectRatioStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}
    >
      {placeholder || (
        <svg 
          className="w-8 h-8 text-gray-600" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );

  // Error component
  const ErrorComponent = () => (
    <div 
      className={`bg-red-900/20 border border-red-500/30 ${className}`}
      style={aspectRatioStyle}
    >
      <div className="flex items-center justify-center h-full text-red-400 text-sm">
        Failed to load image
      </div>
    </div>
  );

  if (imageError) {
    return <ErrorComponent />;
  }

  if (!inView) {
    return <PlaceholderComponent />;
  }

  return (
    <div className={`relative ${className}`} ref={imgRef}>
      {/* Show placeholder while loading */}
      {!imageLoaded && <PlaceholderComponent />}
      
      {/* Main picture element with multiple sources */}
      <picture
        className={`${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      >
        {/* AVIF source for maximum compression */}
        {avifSrcSet && supportsAVIF() && (
          <source 
            srcSet={avifSrcSet} 
            sizes={sizes} 
            type="image/avif" 
          />
        )}
        
        {/* WebP source for broad support */}
        {webpSrcSet && supportsWebP() && (
          <source 
            srcSet={webpSrcSet} 
            sizes={sizes} 
            type="image/webp" 
          />
        )}
        
        {/* Fallback image */}
        <img
          src={generateOptimizedSrc(src, width || 800, getOriginalFormat(src), quality)}
          srcSet={fallbackSrcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            ...aspectRatioStyle,
            objectFit: objectFit,
            transform: imageLoaded ? 'none' : 'scale(1.05)',
            filter: imageLoaded ? 'none' : 'blur(5px)',
            transition: 'all 0.3s ease-out'
          }}
          {...props}
        />
      </picture>
    </div>
  );
};

// Higher-order component for critical images (above-the-fold)
export const CriticalImage = (props) => (
  <OptimizedImage {...props} priority={true} loading="eager" />
);

// Specialized component for team photos
export const TeamPhoto = ({ src, name, role, ...props }) => (
  <OptimizedImage
    src={src}
    alt={`${name} - ${role}`}
    aspectRatio="1/1"
    objectFit="cover"
    className="rounded-xl"
    sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
    {...props}
  />
);

// Avatar component with fallback initials
export const Avatar = ({ src, name, size = 'md', ...props }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg'
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (!src) {
    return (
      <div 
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#00FF41] to-[#00e83a] flex items-center justify-center font-bold text-black`}
      >
        {initials}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={name}
      className={`${sizeClasses[size]} rounded-full`}
      aspectRatio="1/1"
      objectFit="cover"
      {...props}
    />
  );
};

export default OptimizedImage;