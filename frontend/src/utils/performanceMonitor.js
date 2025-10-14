/**
 * Advanced Performance Monitoring System
 * Tracks Core Web Vitals, user interactions, and provides analytics
 */

class AdvancedPerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isSupported = this.checkSupport();
    this.init();
  }

  checkSupport() {
    return (
      'performance' in window &&
      'PerformanceObserver' in window &&
      'navigator' in window
    );
  }

  init() {
    if (!this.isSupported) {
      console.warn('Performance monitoring not supported in this browser');
      return;
    }

    this.trackCoreWebVitals();
    this.trackResourceTiming();
    this.trackUserInteractions();
    this.trackNavigationTiming();
    this.trackMemoryUsage();
  }

  // Core Web Vitals tracking
  trackCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entry) => {
      this.recordMetric('LCP', entry.startTime, {
        element: entry.element?.tagName,
        url: entry.url,
        timestamp: Date.now()
      });
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', (entry) => {
      this.recordMetric('FID', entry.processingStart - entry.startTime, {
        eventType: entry.name,
        timestamp: Date.now()
      });
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    this.observeMetric('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        this.recordMetric('CLS', clsValue, {
          timestamp: Date.now(),
          sources: entry.sources?.map(s => s.node?.tagName)
        });
      }
    });

    // Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      this.recordMetric('TTFB', ttfb, {
        timestamp: Date.now()
      });
    }
  }

  // Resource timing analysis
  trackResourceTiming() {
    this.observeMetric('resource', (entry) => {
      const duration = entry.responseEnd - entry.startTime;
      this.recordMetric('Resource Loading', duration, {
        name: entry.name,
        type: entry.initiatorType,
        size: entry.transferSize,
        cached: entry.transferSize === 0,
        timestamp: Date.now()
      });
    });
  }

  // User interaction tracking
  trackUserInteractions() {
    ['click', 'scroll', 'keydown', 'touchstart'].forEach(eventType => {
      let lastTime = 0;
      document.addEventListener(eventType, (event) => {
        const now = performance.now();
        if (now - lastTime > 100) { // Throttle to avoid spam
          this.recordMetric('User Interaction', now - lastTime, {
            type: eventType,
            target: event.target?.tagName,
            timestamp: Date.now()
          });
          lastTime = now;
        }
      }, { passive: true });
    });
  }

  // Navigation timing
  trackNavigationTiming() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.recordMetric('DOM Content Loaded', 
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        this.recordMetric('Load Complete', 
          navigation.loadEventEnd - navigation.loadEventStart);
        this.recordMetric('Total Page Load', 
          navigation.loadEventEnd - navigation.navigationStart);
      }
    });
  }

  // Memory usage tracking
  trackMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.recordMetric('Memory Usage', memory.usedJSHeapSize, {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          timestamp: Date.now()
        });
      }, 30000); // Every 30 seconds
    }
  }

  // Generic performance observer
  observeMetric(entryType, callback) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(callback);
      });
      observer.observe({ entryTypes: [entryType] });
      this.observers.set(entryType, observer);
    } catch (error) {
      console.warn(`Failed to observe ${entryType}:`, error);
    }
  }

  // Record metrics
  recordMetric(name, value, metadata = {}) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const metric = {
      value,
      timestamp: Date.now(),
      ...metadata
    };
    
    this.metrics.get(name).push(metric);
    
    // Emit custom event for external tracking
    window.dispatchEvent(new CustomEvent('performanceMetric', {
      detail: { name, ...metric }
    }));
    
    // Log critical metrics
    if (['LCP', 'FID', 'CLS', 'TTFB'].includes(name)) {
      console.log(`📊 ${name}:`, value, metadata);
    }
  }

  // Get performance report
  getReport() {
    const report = {};
    
    for (const [name, values] of this.metrics) {
      const numericValues = values.map(v => v.value).filter(v => typeof v === 'number');
      if (numericValues.length > 0) {
        report[name] = {
          count: values.length,
          average: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          latest: values[values.length - 1]
        };
      }
    }
    
    return report;
  }

  // Performance score calculation
  calculatePerformanceScore() {
    const report = this.getReport();
    let score = 100;
    
    // LCP scoring (0-2.5s = 100, 2.5-4s = 90-50, >4s = 50-0)
    if (report.LCP) {
      const lcp = report.LCP.latest.value;
      if (lcp > 4000) score -= 50;
      else if (lcp > 2500) score -= (lcp - 2500) / 1500 * 40;
    }
    
    // FID scoring (0-100ms = 100, 100-300ms = 90-50, >300ms = 50-0)
    if (report.FID) {
      const fid = report.FID.latest.value;
      if (fid > 300) score -= 30;
      else if (fid > 100) score -= (fid - 100) / 200 * 20;
    }
    
    // CLS scoring (0-0.1 = 100, 0.1-0.25 = 90-50, >0.25 = 50-0)
    if (report.CLS) {
      const cls = report.CLS.latest.value;
      if (cls > 0.25) score -= 20;
      else if (cls > 0.1) score -= (cls - 0.1) / 0.15 * 10;
    }
    
    return Math.max(0, Math.round(score));
  }

  // Export data for analytics
  exportData() {
    return {
      metrics: Object.fromEntries(this.metrics),
      report: this.getReport(),
      score: this.calculatePerformanceScore(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
  }

  // Cleanup
  destroy() {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
    this.metrics.clear();
  }
}

// Global instance
window.performanceMonitor = new AdvancedPerformanceMonitor();

// Auto-export performance data periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    const data = window.performanceMonitor.exportData();
    console.log('🚀 Performance Report:', data.report);
    console.log('📊 Performance Score:', data.score);
  }, 60000); // Every minute
}

export default AdvancedPerformanceMonitor;