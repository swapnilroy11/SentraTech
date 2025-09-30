// Lightweight Performance Monitoring - Optimized for Production
// Minimal monitoring to prevent performance bottlenecks

class PerformanceMonitor {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    // Disable heavy monitoring in production for better performance
    this.enabled = false; 
    this.init();
  }

  init() {
    if (!this.enabled) {
      console.log('Performance monitoring disabled for optimal performance');
      return;
    }
    // No heavy monitoring setup
  }

  // Stub methods for compatibility
  trackPageLoad() {}
  trackUserInteraction() {}
  trackApiCall() {}
  trackError() {}
  getPerformanceMetrics() { return {}; }
  reportMetrics() {}
}

// Initialize lightweight performance monitor
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;