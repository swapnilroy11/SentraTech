// Lightweight Error Tracking - Performance Optimized
// Minimal error tracking for production use

class ErrorTracker {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.init();
  }

  /**
   * Initialize minimal error tracking
   */
  init() {
    // Only setup basic error handling to prevent performance issues
    if (this.isProduction) {
      this.setupBasicErrorHandlers();
    }
  }

  /**
   * Setup basic error handlers
   */
  setupBasicErrorHandlers() {
    // Only catch critical errors in production
    window.addEventListener('error', (event) => {
      // Log critical errors only
      if (event.error && event.error.name === 'ChunkLoadError') {
        console.error('Critical error:', event.error);
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      // Log critical promise rejections only
      console.warn('Unhandled promise rejection:', event.reason);
    });
  }

  // Stub methods for compatibility
  addBreadcrumb() {}
  captureException() {}
  captureMessage() {}
  setUserContext() {}
  setExtraContext() {}
}

// Initialize lightweight error tracker - single declaration
const errorTracker = new ErrorTracker();

// Export for external access
window.SentraTechErrorTracker = errorTracker;

export default errorTracker;

// Initialize global error tracker
const errorTracker = new ErrorTracker();

// Export for external access
window.SentraTechErrorTracker = errorTracker;

export default errorTracker;