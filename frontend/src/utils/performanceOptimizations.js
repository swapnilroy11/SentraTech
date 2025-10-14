/**
 * Performance Optimization Utilities
 * Handles lazy loading, intersection observers, and smooth animations
 */

// Intersection Observer for animations and lazy loading
class PerformanceObserver {
  constructor() {
    this.observers = new Map();
    this.lazyImages = new Set();
    this.animationElements = new Set();
    
    // Initialize observers
    this.initLazyImageObserver();
    this.initAnimationObserver();
    this.initPrefetchObserver();
  }

  // Lazy image loading with blur-up effect
  initLazyImageObserver() {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImage(img);
            imageObserver.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.01
      }
    );

    this.observers.set('images', imageObserver);
  }

  // Animation observer for scroll-triggered animations
  initAnimationObserver() {
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            this.triggerAnimation(element);
            // Keep observing for exit animations if needed
            if (!element.dataset.keepObserving) {
              animationObserver.unobserve(element);
            }
          } else if (entry.target.dataset.exitAnimation) {
            this.triggerExitAnimation(entry.target);
          }
        });
      },
      {
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0.1, 0.3, 0.7]
      }
    );

    this.observers.set('animations', animationObserver);
  }

  // Prefetch observer for next-page preloading
  initPrefetchObserver() {
    const prefetchObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target;
            this.prefetchPage(link.href);
            prefetchObserver.unobserve(link);
          }
        });
      },
      {
        rootMargin: '200px 0px',
        threshold: 0.01
      }
    );

    this.observers.set('prefetch', prefetchObserver);
  }

  // Load image with performance optimizations
  async loadImage(img) {
    const src = img.dataset.src || img.dataset.original;
    const srcset = img.dataset.srcset;
    
    if (!src) return;

    // Create high-resolution image
    const highResImg = new Image();
    
    // Use modern formats if supported
    if (this.supportsWebP() && img.dataset.webp) {
      highResImg.src = img.dataset.webp;
    } else if (this.supportsAVIF() && img.dataset.avif) {
      highResImg.src = img.dataset.avif;
    } else {
      highResImg.src = src;
    }

    if (srcset) {
      highResImg.srcset = srcset;
    }

    try {
      await this.imagePromise(highResImg);
      
      // Smooth transition from low-quality to high-quality
      requestAnimationFrame(() => {
        img.src = highResImg.src;
        if (srcset) img.srcset = srcset;
        img.classList.add('loaded');
        img.classList.remove('lazy-image');
      });
    } catch (error) {
      console.warn('Failed to load image:', src, error);
      img.classList.add('error');
    }
  }

  // Convert image loading to promise
  imagePromise(img) {
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
  }

  // Trigger scroll animations with stagger effect
  triggerAnimation(element) {
    const animationType = element.dataset.animation || 'fade-in-up';
    const delay = parseInt(element.dataset.delay) || 0;
    const duration = parseInt(element.dataset.duration) || 600;
    const stagger = parseInt(element.dataset.stagger) || 0;

    // Handle staggered animations for child elements
    if (stagger > 0) {
      const children = element.querySelectorAll('[data-stagger-child]');
      children.forEach((child, index) => {
        setTimeout(() => {
          child.classList.add('animate');
        }, delay + (index * stagger));
      });
    } else {
      setTimeout(() => {
        element.classList.add('animate');
        element.style.setProperty('--animation-duration', `${duration}ms`);
      }, delay);
    }

    // Performance tracking
    if (window.performance?.mark) {
      window.performance.mark(`animation-triggered-${element.id || 'anonymous'}`);
    }
  }

  // Exit animations for elements leaving viewport
  triggerExitAnimation(element) {
    const exitAnimation = element.dataset.exitAnimation;
    if (exitAnimation) {
      element.classList.add(exitAnimation);
    }
  }

  // Prefetch next pages for instant navigation
  async prefetchPage(href) {
    if (!href || href === '#' || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }

    try {
      // Create prefetch link
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);

      // Also prefetch DNS for external links
      if (!href.startsWith(window.location.origin)) {
        const dnsPrefetch = document.createElement('link');
        dnsPrefetch.rel = 'dns-prefetch';
        dnsPrefetch.href = new URL(href).origin;
        document.head.appendChild(dnsPrefetch);
      }
    } catch (error) {
      console.warn('Prefetch failed:', href, error);
    }
  }

  // Feature detection utilities
  supportsWebP() {
    if (typeof this._webpSupport !== 'undefined') {
      return this._webpSupport;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    this._webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return this._webpSupport;
  }

  supportsAVIF() {
    if (typeof this._avifSupport !== 'undefined') {
      return this._avifSupport;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    this._avifSupport = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    return this._avifSupport;
  }

  // Register elements for observation
  observeImages(selector = 'img[data-src], img[data-original]') {
    const images = document.querySelectorAll(selector);
    const observer = this.observers.get('images');
    
    images.forEach(img => {
      img.classList.add('lazy-image');
      observer.observe(img);
      this.lazyImages.add(img);
    });
  }

  observeAnimations(selector = '[data-animation]') {
    const elements = document.querySelectorAll(selector);
    const observer = this.observers.get('animations');
    
    elements.forEach(element => {
      observer.observe(element);
      this.animationElements.add(element);
    });
  }

  observePrefetchLinks(selector = 'a[href^="/"], a[data-prefetch]') {
    const links = document.querySelectorAll(selector);
    const observer = this.observers.get('prefetch');
    
    links.forEach(link => {
      if (link.href && !link.dataset.noPrefetch) {
        observer.observe(link);
      }
    });
  }

  // Initialize all performance optimizations
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupOptimizations());
    } else {
      this.setupOptimizations();
    }
  }

  setupOptimizations() {
    // Observe images for lazy loading
    this.observeImages();
    
    // Observe elements for animations
    this.observeAnimations();
    
    // Observe links for prefetching
    this.observePrefetchLinks();

    // Initialize performance monitoring
    this.initPerformanceMonitoring();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => this.cleanup());
  }

  // Performance monitoring
  initPerformanceMonitoring() {
    // Mark when optimizations are ready
    if (window.performance?.mark) {
      window.performance.mark('optimizations-initialized');
    }

    // Monitor Core Web Vitals
    this.observeCoreWebVitals();
  }

  // Core Web Vitals monitoring
  observeCoreWebVitals() {
    // LCP (Largest Contentful Paint)
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observation not supported:', error);
    }

    // FID (First Input Delay)
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID observation not supported:', error);
    }

    // CLS (Cumulative Layout Shift)
    try {
      new PerformanceObserver((entryList) => {
        let clsValue = 0;
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS observation not supported:', error);
    }
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.lazyImages.clear();
    this.animationElements.clear();
  }
}

// Throttle and debounce utilities for scroll handlers
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const debounce = (func, wait) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

// Advanced Web Worker Manager with pooling and error handling
export class WebWorkerManager {
  constructor() {
    this.workers = new Map();
    this.workerPools = new Map();
    this.taskQueue = [];
    this.maxPoolSize = navigator.hardwareConcurrency || 4;
  }

  createWorker(name, scriptPath, poolSize = 1) {
    if (!this.workers.has(name)) {
      try {
        const pool = [];
        for (let i = 0; i < Math.min(poolSize, this.maxPoolSize); i++) {
          const worker = new Worker(scriptPath, { type: 'module' });
          worker.busy = false;
          pool.push(worker);
        }
        this.workerPools.set(name, pool);
        this.workers.set(name, pool[0]); // Keep backward compatibility
        return pool[0];
      } catch (error) {
        console.warn(`Failed to create worker ${name}:`, error);
        return null;
      }
    }
    return this.workers.get(name);
  }

  getAvailableWorker(poolName) {
    const pool = this.workerPools.get(poolName);
    if (!pool) return null;
    
    return pool.find(worker => !worker.busy) || pool[0];
  }

  executeTask(workerName, data, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const worker = this.getAvailableWorker(workerName);
      if (!worker) {
        reject(new Error(`No available worker for ${workerName}`));
        return;
      }

      worker.busy = true;
      
      const timeoutId = setTimeout(() => {
        worker.busy = false;
        reject(new Error(`Worker task timeout after ${timeout}ms`));
      }, timeout);

      const cleanup = () => {
        worker.busy = false;
        clearTimeout(timeoutId);
        worker.onmessage = null;
        worker.onerror = null;
      };

      worker.onmessage = (event) => {
        cleanup();
        resolve(event.data);
      };

      worker.onerror = (error) => {
        cleanup();
        reject(error);
      };

      // Enhanced error handling for transferable objects
      try {
        worker.postMessage(data);
      } catch (error) {
        cleanup();
        reject(new Error(`Failed to post message: ${error.message}`));
      }
    });
  }

  terminateWorker(name) {
    const pool = this.workerPools.get(name);
    if (pool) {
      pool.forEach(worker => worker.terminate());
      this.workerPools.delete(name);
    }
    
    const worker = this.workers.get(name);
    if (worker) {
      worker.terminate();
      this.workers.delete(name);
    }
  }

  terminateAll() {
    for (const [name, pool] of this.workerPools) {
      pool.forEach(worker => worker.terminate());
    }
    this.workerPools.clear();
    
    for (const [name, worker] of this.workers) {
      worker.terminate();
    }
    this.workers.clear();
  }

  getStats() {
    const stats = {};
    for (const [name, pool] of this.workerPools) {
      const busy = pool.filter(w => w.busy).length;
      stats[name] = { total: pool.length, busy, available: pool.length - busy };
    }
    return stats;
  }
}

// Global performance optimizer instance
export const performanceOptimizer = new PerformanceObserver();

// Auto-initialize disabled to prevent blocking React app
// performanceOptimizer.init();

export default performanceOptimizer;