/**
 * Performance Analysis Utility
 * Comprehensive performance monitoring and optimization suggestions
 */

class PerformanceAnalyzer {
  constructor() {
    this.metrics = {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null
    };
    this.resourceTimings = [];
    this.observers = [];
    this.startTime = performance.now();
  }

  // Initialize all performance observers
  init() {
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeResourceTimings();
    this.analyzePageLoad();
  }

  // Observe Largest Contentful Paint
  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.evaluateLCP(lastEntry.startTime);
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(observer);
  }

  // Observe First Input Delay
  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          const fid = entry.processingStart - entry.startTime;
          this.metrics.fid = fid;
          this.evaluateFID(fid);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('FID observation not supported:', error);
    }
  }

  // Observe Cumulative Layout Shift
  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
      this.evaluateCLS(clsValue);
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(observer);
  }

  // Observe First Contentful Paint
  observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.evaluateFCP(entry.startTime);
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.push(observer);
  }

  // Observe resource loading timings
  observeResourceTimings() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        this.resourceTimings.push({
          name: entry.name,
          duration: entry.duration,
          transferSize: entry.transferSize || 0,
          type: this.getResourceType(entry.name)
        });
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  // Analyze overall page load performance
  analyzePageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.metrics.ttfb = navigation.responseStart - navigation.fetchStart;
          this.evaluateTTFB(this.metrics.ttfb);
        }

        this.generatePerformanceReport();
      }, 1000);
    });
  }

  // Determine resource type from URL
  getResourceType(url) {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/)) return 'image';
    if (url.includes('font')) return 'font';
    return 'other';
  }

  // Evaluate LCP performance
  evaluateLCP(lcp) {
    let status = 'good';
    let suggestions = [];

    if (lcp > 4000) {
      status = 'poor';
      suggestions = [
        'Optimize largest contentful element (likely an image)',
        'Implement image preloading for hero images',
        'Use modern image formats (WebP, AVIF)',
        'Reduce server response time',
        'Minimize render-blocking resources'
      ];
    } else if (lcp > 2500) {
      status = 'needs-improvement';
      suggestions = [
        'Consider optimizing largest visible element',
        'Implement resource hints (preload, prefetch)',
        'Optimize critical CSS delivery'
      ];
    }

    this.logMetric('LCP', lcp, status, suggestions);
  }

  // Evaluate FID performance
  evaluateFID(fid) {
    let status = 'good';
    let suggestions = [];

    if (fid > 300) {
      status = 'poor';
      suggestions = [
        'Break up long-running JavaScript tasks',
        'Use Web Workers for heavy computations',
        'Implement code splitting and lazy loading',
        'Optimize third-party scripts',
        'Consider using React Concurrent features'
      ];
    } else if (fid > 100) {
      status = 'needs-improvement';
      suggestions = [
        'Audit JavaScript execution time',
        'Consider deferring non-critical scripts'
      ];
    }

    this.logMetric('FID', fid, status, suggestions);
  }

  // Evaluate CLS performance
  evaluateCLS(cls) {
    let status = 'good';
    let suggestions = [];

    if (cls > 0.25) {
      status = 'poor';
      suggestions = [
        'Always include size attributes on images and videos',
        'Reserve space for ad slots and embeds',
        'Avoid inserting content above existing content',
        'Use CSS aspect-ratio for responsive images'
      ];
    } else if (cls > 0.1) {
      status = 'needs-improvement';
      suggestions = [
        'Audit layout shifts during loading',
        'Ensure images have explicit dimensions'
      ];
    }

    this.logMetric('CLS', cls, status, suggestions);
  }

  // Evaluate FCP performance
  evaluateFCP(fcp) {
    let status = 'good';
    let suggestions = [];

    if (fcp > 3000) {
      status = 'poor';
      suggestions = [
        'Minimize critical resource chain',
        'Eliminate render-blocking resources',
        'Inline critical CSS',
        'Optimize server response time'
      ];
    } else if (fcp > 1800) {
      status = 'needs-improvement';
      suggestions = [
        'Optimize critical rendering path',
        'Consider resource hints'
      ];
    }

    this.logMetric('FCP', fcp, status, suggestions);
  }

  // Evaluate TTFB performance
  evaluateTTFB(ttfb) {
    let status = 'good';
    let suggestions = [];

    if (ttfb > 800) {
      status = 'poor';
      suggestions = [
        'Optimize server processing time',
        'Use CDN for static assets',
        'Implement server-side caching',
        'Optimize database queries'
      ];
    } else if (ttfb > 600) {
      status = 'needs-improvement';
      suggestions = [
        'Consider server optimization',
        'Implement edge caching'
      ];
    }

    this.logMetric('TTFB', ttfb, status, suggestions);
  }

  // Log performance metric with status and suggestions
  logMetric(name, value, status, suggestions = []) {
    const statusColor = {
      good: '🟢',
      'needs-improvement': '🟡',
      poor: '🔴'
    };

    console.group(`${statusColor[status]} ${name}: ${Math.round(value)}ms (${status})`);
    if (suggestions.length > 0) {
      console.log('Suggestions:');
      suggestions.forEach(suggestion => console.log(`• ${suggestion}`));
    }
    console.groupEnd();
  }

  // Analyze resource loading performance
  analyzeResources() {
    const resourcesByType = this.resourceTimings.reduce((acc, resource) => {
      if (!acc[resource.type]) acc[resource.type] = [];
      acc[resource.type].push(resource);
      return acc;
    }, {});

    console.group('📊 Resource Analysis');
    
    Object.entries(resourcesByType).forEach(([type, resources]) => {
      const totalSize = resources.reduce((sum, r) => sum + r.transferSize, 0);
      const totalDuration = resources.reduce((sum, r) => sum + r.duration, 0);
      const avgDuration = totalDuration / resources.length;

      console.log(`${type.toUpperCase()}:`);
      console.log(`  Count: ${resources.length}`);
      console.log(`  Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
      console.log(`  Avg Duration: ${avgDuration.toFixed(2)}ms`);

      // Identify slow resources
      const slowResources = resources.filter(r => r.duration > 500);
      if (slowResources.length > 0) {
        console.warn(`  ⚠️ Slow ${type} resources:`, slowResources.map(r => ({
          name: r.name,
          duration: `${r.duration.toFixed(2)}ms`
        })));
      }
    });

    console.groupEnd();
  }

  // Generate comprehensive performance report
  generatePerformanceReport() {
    console.group('🚀 SentraTech Performance Report');
    
    // Core Web Vitals summary
    console.log('Core Web Vitals:');
    console.log(`  LCP: ${this.metrics.lcp ? Math.round(this.metrics.lcp) + 'ms' : 'Not measured'}`);
    console.log(`  FID: ${this.metrics.fid ? Math.round(this.metrics.fid) + 'ms' : 'Not measured'}`);
    console.log(`  CLS: ${this.metrics.cls ? this.metrics.cls.toFixed(3) : 'Not measured'}`);
    console.log(`  FCP: ${this.metrics.fcp ? Math.round(this.metrics.fcp) + 'ms' : 'Not measured'}`);
    console.log(`  TTFB: ${this.metrics.ttfb ? Math.round(this.metrics.ttfb) + 'ms' : 'Not measured'}`);

    // Resource analysis
    this.analyzeResources();

    // Performance score
    const score = this.calculatePerformanceScore();
    console.log(`Overall Performance Score: ${score}/100`);

    console.groupEnd();

    // Send metrics to analytics (if available)
    this.sendToAnalytics();
  }

  // Calculate overall performance score
  calculatePerformanceScore() {
    let score = 100;

    // Deduct points for poor metrics
    if (this.metrics.lcp > 2500) score -= 20;
    if (this.metrics.fid > 100) score -= 20;
    if (this.metrics.cls > 0.1) score -= 20;
    if (this.metrics.fcp > 1800) score -= 20;
    if (this.metrics.ttfb > 600) score -= 20;

    return Math.max(0, score);
  }

  // Send metrics to analytics service
  sendToAnalytics() {
    if (typeof gtag === 'function') {
      gtag('event', 'performance_metrics', {
        lcp: this.metrics.lcp,
        fid: this.metrics.fid,
        cls: this.metrics.cls,
        fcp: this.metrics.fcp,
        ttfb: this.metrics.ttfb,
        score: this.calculatePerformanceScore()
      });
    }

    // Could also send to custom analytics endpoint
    if (window.navigator.sendBeacon) {
      window.navigator.sendBeacon('/api/analytics/performance', JSON.stringify({
        metrics: this.metrics,
        score: this.calculatePerformanceScore(),
        userAgent: navigator.userAgent,
        url: location.href,
        timestamp: Date.now()
      }));
    }
  }

  // Manual performance audit
  audit() {
    return {
      metrics: this.metrics,
      score: this.calculatePerformanceScore(),
      suggestions: this.getAllSuggestions()
    };
  }

  // Get all performance suggestions
  getAllSuggestions() {
    const suggestions = [];

    // Image optimization
    const images = document.querySelectorAll('img');
    const unoptimizedImages = Array.from(images).filter(img => 
      !img.loading || img.loading !== 'lazy' || 
      (!img.src.includes('.webp') && !img.src.includes('.avif'))
    );
    
    if (unoptimizedImages.length > 0) {
      suggestions.push(`Optimize ${unoptimizedImages.length} images with lazy loading and modern formats`);
    }

    // Script optimization
    const scripts = document.querySelectorAll('script[src]');
    const nonAsyncScripts = Array.from(scripts).filter(script => 
      !script.async && !script.defer
    );
    
    if (nonAsyncScripts.length > 0) {
      suggestions.push(`Make ${nonAsyncScripts.length} scripts async or defer`);
    }

    // Font optimization
    const fontLinks = document.querySelectorAll('link[href*="font"]');
    const unoptimizedFonts = Array.from(fontLinks).filter(link =>
      !link.rel.includes('preload')
    );
    
    if (unoptimizedFonts.length > 0) {
      suggestions.push(`Preload ${unoptimizedFonts.length} font resources`);
    }

    return suggestions;
  }

  // Cleanup observers
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Auto-initialize performance analyzer (disabled to prevent blocking)
const performanceAnalyzer = new PerformanceAnalyzer();

// Start monitoring when DOM is ready (commented out for now)
// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', () => performanceAnalyzer.init());
// } else {
//   performanceAnalyzer.init();
// }

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  performanceAnalyzer.destroy();
});

export default performanceAnalyzer;