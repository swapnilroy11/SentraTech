// SentraTech Real User Monitoring (RUM) & Core Web Vitals
// Enterprise-grade performance tracking and optimization

// Import web-vitals functions (v5.x API)
let onCLS, onFID, onFCP, onLCP, onTTFB, onINP;

// Dynamic import for web-vitals with proper v5 API
try {
  const webVitals = require('web-vitals');
  onCLS = webVitals.onCLS;
  onFID = webVitals.onFID || webVitals.onINP; // FID deprecated, use INP as fallback
  onFCP = webVitals.onFCP;
  onLCP = webVitals.onLCP;
  onTTFB = webVitals.onTTFB;
  onINP = webVitals.onINP || webVitals.onFID; // INP is the new metric replacing FID
} catch (error) {
  console.warn('Web Vitals library not available:', error);
  // Fallback functions that won't break the app
  onCLS = onFID = onFCP = onLCP = onTTFB = onINP = (callback) => {
    console.warn('Web Vitals not available');
  };
}

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.thresholds = {
      // Google's Core Web Vitals thresholds
      LCP: { good: 2500, needs_improvement: 4000 }, // Largest Contentful Paint
      FID: { good: 100, needs_improvement: 300 },    // First Input Delay  
      CLS: { good: 0.1, needs_improvement: 0.25 },   // Cumulative Layout Shift
      FCP: { good: 1800, needs_improvement: 3000 },  // First Contentful Paint
      TTFB: { good: 600, needs_improvement: 1500 }   // Time to First Byte
    };
    
    this.init();
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    console.log('📊 SentraTech Performance Monitoring initialized');
    
    // Start collecting Core Web Vitals
    this.collectCoreWebVitals();
    
    // Monitor custom metrics
    this.monitorCustomMetrics();
    
    // Track resource loading performance
    this.monitorResourceLoading();
    
    // Monitor JavaScript errors that impact performance
    this.monitorPerformanceErrors();
    
    // Set up periodic reporting
    this.setupPeriodicReporting();
  }

  /**
   * Collect Core Web Vitals metrics
   */
  collectCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    onLCP((metric) => {
      this.recordMetric('LCP', metric);
    });

    // First Input Delay (FID) or Interaction to Next Paint (INP)
    if (onINP) {
      onINP((metric) => {
        this.recordMetric('INP', metric);
      });
    } else if (onFID) {
      onFID((metric) => {
        this.recordMetric('FID', metric);
      });
    }

    // Cumulative Layout Shift (CLS)
    onCLS((metric) => {
      this.recordMetric('CLS', metric);
    });

    // First Contentful Paint (FCP)
    onFCP((metric) => {
      this.recordMetric('FCP', metric);
    });

    // Time to First Byte (TTFB)
    onTTFB((metric) => {
      this.recordMetric('TTFB', metric);
    });
  }

  /**
   * Monitor custom SentraTech metrics
   */
  monitorCustomMetrics() {
    // Page load complete time
    window.addEventListener('load', () => {
      const pageLoadTime = performance.now();
      this.recordCustomMetric('PAGE_LOAD_COMPLETE', pageLoadTime);
    });

    // DOM Content Loaded time
    document.addEventListener('DOMContentLoaded', () => {
      const domLoadTime = performance.now();
      this.recordCustomMetric('DOM_CONTENT_LOADED', domLoadTime);
    });

    // React hydration time (if applicable)
    if (window.React) {
      const reactStart = performance.now();
      setTimeout(() => {
        const reactReady = performance.now() - reactStart;
        this.recordCustomMetric('REACT_HYDRATION', reactReady);
      }, 0);
    }

    // Hero section render time
    this.monitorHeroSectionRender();
    
    // Interactive elements response time
    this.monitorInteractivity();
    
    // API response times
    this.monitorApiPerformance();
  }

  /**
   * Monitor hero section rendering time
   */
  monitorHeroSectionRender() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const heroElement = document.querySelector('[data-testid="hero-section"], .hero-section, h1');
          if (heroElement) {
            const heroRenderTime = performance.now();
            this.recordCustomMetric('HERO_RENDER_TIME', heroRenderTime);
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Fallback timeout
    setTimeout(() => {
      observer.disconnect();
    }, 10000);
  }

  /**
   * Monitor interactive elements response time
   */
  monitorInteractivity() {
    const interactiveElements = ['button', 'a', '[data-testid*="button"]', '[role="button"]'];
    
    interactiveElements.forEach(selector => {
      document.addEventListener('click', (event) => {
        if (event.target.matches(selector)) {
          const startTime = performance.now();
          
          // Measure time to visual feedback
          requestAnimationFrame(() => {
            const responseTime = performance.now() - startTime;
            this.recordCustomMetric('INTERACTION_RESPONSE_TIME', responseTime, {
              element: selector,
              elementText: event.target.textContent?.substring(0, 20)
            });
          });
        }
      });
    });
  }

  /**
   * Monitor API performance
   */
  monitorApiPerformance() {
    // Intercept fetch requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0];
      const startTime = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        this.recordCustomMetric('API_RESPONSE_TIME', duration, {
          url: typeof url === 'string' ? url : url.url,
          status: response.status,
          method: args[1]?.method || 'GET'
        });
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        this.recordCustomMetric('API_ERROR_TIME', duration, {
          url: typeof url === 'string' ? url : url.url,
          error: error.message,
          method: args[1]?.method || 'GET'
        });
        
        throw error;
      }
    };
  }

  /**
   * Monitor resource loading performance
   */
  monitorResourceLoading() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const resources = performance.getEntriesByType('resource');

      // Navigation timing
      if (navigation) {
        this.recordCustomMetric('DNS_LOOKUP_TIME', navigation.domainLookupEnd - navigation.domainLookupStart);
        this.recordCustomMetric('TCP_CONNECTION_TIME', navigation.connectEnd - navigation.connectStart);
        this.recordCustomMetric('SSL_NEGOTIATION_TIME', navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0);
        this.recordCustomMetric('SERVER_RESPONSE_TIME', navigation.responseStart - navigation.requestStart);
        this.recordCustomMetric('DOM_PROCESSING_TIME', navigation.domComplete - navigation.domLoading);
      }

      // Resource timing
      const resourceSummary = this.analyzeResourcePerformance(resources);
      this.recordCustomMetric('RESOURCE_SUMMARY', 0, resourceSummary);
    });
  }

  /**
   * Analyze resource performance
   */
  analyzeResourcePerformance(resources) {
    const summary = {
      totalResources: resources.length,
      slowResources: [],
      largeResources: [],
      resourceTypes: {}
    };

    resources.forEach(resource => {
      const duration = resource.responseEnd - resource.startTime;
      const size = resource.transferSize || resource.decodedBodySize || 0;
      
      // Track resource types
      const type = this.getResourceType(resource.name);
      if (!summary.resourceTypes[type]) {
        summary.resourceTypes[type] = { count: 0, totalTime: 0, totalSize: 0 };
      }
      summary.resourceTypes[type].count++;
      summary.resourceTypes[type].totalTime += duration;
      summary.resourceTypes[type].totalSize += size;

      // Flag slow resources (>2s)
      if (duration > 2000) {
        summary.slowResources.push({
          name: resource.name,
          duration: Math.round(duration),
          size: size
        });
      }

      // Flag large resources (>1MB)
      if (size > 1048576) {
        summary.largeResources.push({
          name: resource.name,
          size: size,
          duration: Math.round(duration)
        });
      }
    });

    return summary;
  }

  /**
   * Get resource type from URL
   */
  getResourceType(url) {
    if (url.includes('.js')) return 'javascript';
    if (url.includes('.css')) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)/)) return 'image';
    if (url.includes('.woff')) return 'font';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  /**
   * Monitor performance-related errors
   */
  monitorPerformanceErrors() {
    // Long task detection
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordCustomMetric('LONG_TASK', entry.duration, {
              startTime: entry.startTime,
              name: entry.name
            });
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
    }

    // Memory usage monitoring
    this.monitorMemoryUsage();
  }

  /**
   * Monitor memory usage
   */
  monitorMemoryUsage() {
    if (performance.memory) {
      setInterval(() => {
        const memoryInfo = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          usagePercentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
        };
        
        this.recordCustomMetric('MEMORY_USAGE', memoryInfo.usagePercentage, memoryInfo);
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Record Core Web Vital metric
   */
  recordMetric(name, metric) {
    const value = metric.value;
    const threshold = this.thresholds[name];
    
    let rating = 'poor';
    if (value <= threshold.good) {
      rating = 'good';
    } else if (value <= threshold.needs_improvement) {
      rating = 'needs-improvement';
    }

    const metricData = {
      name,
      value,
      rating,
      id: metric.id,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: navigator.connection?.effectiveType || 'unknown'
    };

    this.metrics[name] = metricData;
    
    // Send to analytics
    this.sendMetricToAnalytics(metricData);
    
    console.log(`📊 ${name}: ${value}ms (${rating})`);
  }

  /**
   * Record custom metric
   */
  recordCustomMetric(name, value, metadata = {}) {
    const metricData = {
      name,
      value,
      metadata,
      timestamp: Date.now(),
      url: window.location.href
    };

    this.metrics[name] = metricData;
    
    // Send to analytics for important metrics
    if (this.isImportantMetric(name)) {
      this.sendMetricToAnalytics(metricData);
    }
  }

  /**
   * Check if metric is important enough to send to analytics
   */
  isImportantMetric(name) {
    const importantMetrics = [
      'PAGE_LOAD_COMPLETE',
      'HERO_RENDER_TIME', 
      'API_RESPONSE_TIME',
      'LONG_TASK',
      'MEMORY_USAGE'
    ];
    
    return importantMetrics.includes(name);
  }

  /**
   * Send metric to Google Analytics and other monitoring services
   */
  sendMetricToAnalytics(metricData) {
    // Send to Google Analytics
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'performance_metric', {
        event_category: 'Performance',
        event_label: metricData.name,
        value: Math.round(metricData.value),
        custom_parameter_1: metricData.rating || 'custom',
        custom_parameter_2: window.location.pathname
      });
    }

    // Send to custom analytics endpoint
    this.sendToCustomEndpoint(metricData);
    
    // Send to Datadog (if configured)
    if (window.DD_RUM) {
      window.DD_RUM.addUserAction(metricData.name, {
        value: metricData.value,
        rating: metricData.rating,
        url: metricData.url
      });
    }
  }

  /**
   * Send metrics to custom backend endpoint
   */
  async sendToCustomEndpoint(metricData) {
    try {
      // Only send critical metrics to avoid spam
      if (metricData.name.includes('LCP') || metricData.name.includes('FID') || metricData.name.includes('CLS')) {
        await fetch('/api/analytics/performance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metric: metricData.name,
            value: metricData.value,
            rating: metricData.rating,
            page: window.location.pathname,
            timestamp: metricData.timestamp,
            user_agent: navigator.userAgent,
            connection_type: navigator.connection?.effectiveType
          })
        });
      }
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  /**
   * Setup periodic reporting
   */
  setupPeriodicReporting() {
    // Report summary every 5 minutes
    setInterval(() => {
      this.generatePerformanceReport();
    }, 300000);

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.generatePerformanceReport();
    });
  }

  /**
   * Generate comprehensive performance report
   */
  generatePerformanceReport() {
    const report = {
      timestamp: Date.now(),
      url: window.location.href,
      metrics: { ...this.metrics },
      summary: this.getPerformanceSummary(),
      recommendations: this.getPerformanceRecommendations()
    };

    console.log('📊 Performance Report:', report);
    
    // Send aggregated report
    this.sendPerformanceReport(report);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    const coreVitals = ['LCP', 'FID', 'CLS'];
    const summary = {
      coreVitalsScore: 0,
      goodMetrics: 0,
      needsImprovementMetrics: 0,
      poorMetrics: 0
    };

    coreVitals.forEach(metric => {
      if (this.metrics[metric]) {
        const rating = this.metrics[metric].rating;
        if (rating === 'good') {
          summary.goodMetrics++;
          summary.coreVitalsScore += 100;
        } else if (rating === 'needs-improvement') {
          summary.needsImprovementMetrics++;
          summary.coreVitalsScore += 50;
        } else {
          summary.poorMetrics++;
        }
      }
    });

    summary.coreVitalsScore = Math.round(summary.coreVitalsScore / coreVitals.length);
    
    return summary;
  }

  /**
   * Get performance recommendations
   */
  getPerformanceRecommendations() {
    const recommendations = [];
    
    // Check LCP
    if (this.metrics.LCP && this.metrics.LCP.value > 4000) {
      recommendations.push('Optimize Largest Contentful Paint - consider image optimization, server response time, and render-blocking resources');
    }

    // Check FID
    if (this.metrics.FID && this.metrics.FID.value > 300) {
      recommendations.push('Reduce First Input Delay - minimize JavaScript execution time and use code splitting');
    }

    // Check CLS
    if (this.metrics.CLS && this.metrics.CLS.value > 0.25) {
      recommendations.push('Improve Cumulative Layout Shift - set dimensions for images and ads, avoid inserting content above existing content');
    }

    // Check custom metrics
    if (this.metrics.API_RESPONSE_TIME && this.metrics.API_RESPONSE_TIME.value > 1000) {
      recommendations.push('Optimize API response times - consider caching, database optimization, or CDN implementation');
    }

    return recommendations;
  }

  /**
   * Send performance report to monitoring services
   */
  async sendPerformanceReport(report) {
    try {
      await fetch('/api/analytics/performance-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report)
      });
    } catch (error) {
      console.warn('Failed to send performance report:', error);
    }
  }

  /**
   * Get current performance score
   */
  getPerformanceScore() {
    const summary = this.getPerformanceSummary();
    return summary.coreVitalsScore;
  }

  /**
   * Get all metrics
   */
  getAllMetrics() {
    return { ...this.metrics };
  }
}

// Initialize global performance monitor
const performanceMonitor = new PerformanceMonitor();

// Export for external access
window.SentraTechPerformanceMonitor = performanceMonitor;

export default performanceMonitor;