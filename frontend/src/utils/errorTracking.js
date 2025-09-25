// SentraTech Error Tracking & Monitoring
// Enterprise-grade error reporting and performance monitoring

class ErrorTracker {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.errorBuffer = [];
    this.maxBufferSize = 50;
    this.flushInterval = 30000; // 30 seconds
    
    this.init();
  }

  /**
   * Initialize error tracking
   */
  init() {
    console.log('🔍 SentraTech Error Tracking initialized');
    
    // Setup global error handlers
    this.setupGlobalErrorHandlers();
    
    // Setup unhandled promise rejection handler
    this.setupPromiseRejectionHandler();
    
    // Setup console error interceptor
    this.setupConsoleInterceptor();
    
    // Setup performance error detection
    this.setupPerformanceErrorDetection();
    
    // Setup React error boundary integration
    this.setupReactErrorBoundary();
    
    // Start periodic error reporting
    this.startPeriodicReporting();
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
      const errorInfo = {
        type: 'javascript_error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: this.determineSeverity(event.error)
      };
      
      this.captureError(errorInfo);
    });
  }

  /**
   * Setup unhandled promise rejection handler
   */
  setupPromiseRejectionHandler() {
    window.addEventListener('unhandledrejection', (event) => {
      const errorInfo = {
        type: 'unhandled_promise_rejection',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        reason: event.reason,
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        severity: 'error'
      };
      
      this.captureError(errorInfo);
    });
  }

  /**
   * Setup console error interceptor
   */
  setupConsoleInterceptor() {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Track console errors
      if (this.isProduction) {
        const errorInfo = {
          type: 'console_error',
          message: args.join(' '),
          arguments: args,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          stack: new Error().stack,
          severity: 'warning'
        };
        
        this.captureError(errorInfo);
      }
    };
  }

  /**
   * Setup performance error detection
   */
  setupPerformanceErrorDetection() {
    // Monitor for long tasks that could impact user experience
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Tasks longer than 50ms
              const errorInfo = {
                type: 'performance_issue',
                message: `Long task detected: ${entry.duration}ms`,
                duration: entry.duration,
                startTime: entry.startTime,
                name: entry.name,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                severity: entry.duration > 100 ? 'warning' : 'info'
              };
              
              this.captureError(errorInfo);
            }
          });
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task monitoring not supported');
      }
    }

    // Monitor for layout shifts
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.value > 0.1) { // CLS threshold
              const errorInfo = {
                type: 'layout_shift',
                message: `Significant layout shift detected: ${entry.value}`,
                value: entry.value,
                sources: entry.sources,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                severity: entry.value > 0.25 ? 'warning' : 'info'
              };
              
              this.captureError(errorInfo);
            }
          });
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('Layout shift monitoring not supported');
      }
    }
  }

  /**
   * Setup React error boundary integration
   */
  setupReactErrorBoundary() {
    // This will be used by React Error Boundaries to report errors
    window.SentraTechErrorTracker = {
      captureReactError: (error, errorInfo) => {
        const errorData = {
          type: 'react_error',
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          severity: 'error'
        };
        
        this.captureError(errorData);
      }
    };
  }

  /**
   * Capture and process error
   */
  captureError(errorInfo) {
    // Add additional context
    errorInfo.sessionId = this.getSessionId();
    errorInfo.userId = this.getUserId();
    errorInfo.breadcrumbs = this.getBreadcrumbs();
    errorInfo.deviceInfo = this.getDeviceInfo();
    errorInfo.performanceMetrics = this.getPerformanceContext();
    
    // Filter out noise
    if (this.shouldIgnoreError(errorInfo)) {
      return;
    }
    
    // Add to buffer
    this.errorBuffer.push(errorInfo);
    
    // Log locally in development
    if (!this.isProduction) {
      console.group('🚨 Error Captured');
      console.error('Type:', errorInfo.type);
      console.error('Message:', errorInfo.message);
      console.error('Stack:', errorInfo.stack);
      console.error('Context:', errorInfo);
      console.groupEnd();
    }
    
    // Send immediately for critical errors
    if (errorInfo.severity === 'error' || errorInfo.type === 'react_error') {
      this.flushErrors();
    }
    
    // Flush buffer if it's getting full
    if (this.errorBuffer.length >= this.maxBufferSize) {
      this.flushErrors();
    }
    
    // Send to real-time monitoring (if available)
    this.sendToRealTimeMonitoring(errorInfo);
  }

  /**
   * Determine error severity
   */
  determineSeverity(error) {
    if (!error) return 'info';
    
    const message = error.message || '';
    const stack = error.stack || '';
    
    // Critical errors
    if (message.includes('ChunkLoadError') || 
        message.includes('Loading chunk') ||
        message.includes('Script error')) {
      return 'error';
    }
    
    // Network errors
    if (message.includes('NetworkError') || 
        message.includes('fetch') ||
        stack.includes('fetch')) {
      return 'warning';
    }
    
    // Type errors in core functionality
    if (message.includes('TypeError') && 
        (stack.includes('App.js') || stack.includes('index.js'))) {
      return 'error';
    }
    
    return 'warning';
  }

  /**
   * Check if error should be ignored
   */
  shouldIgnoreError(errorInfo) {
    const ignoredPatterns = [
      // Browser extensions
      /extension\//,
      /chrome-extension/,
      /moz-extension/,
      
      // Third-party scripts
      /google-analytics/,
      /googletagmanager/,
      /facebook\.net/,
      
      // Known non-critical errors
      /ResizeObserver loop limit exceeded/,
      /Non-Error promise rejection captured/,
      
      // Development only
      /Warning: /,
    ];
    
    const message = errorInfo.message || '';
    const stack = errorInfo.stack || '';
    const filename = errorInfo.filename || '';
    
    return ignoredPatterns.some(pattern => 
      pattern.test(message) || 
      pattern.test(stack) || 
      pattern.test(filename)
    );
  }

  /**
   * Get session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('sentratech_session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      sessionStorage.setItem('sentratech_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get user ID (if available)
   */
  getUserId() {
    // Check for user ID in localStorage or other auth systems
    return localStorage.getItem('user_id') || 'anonymous';
  }

  /**
   * Get breadcrumbs (user actions leading to error)
   */
  getBreadcrumbs() {
    // Return recent user actions from localStorage or sessionStorage
    const breadcrumbs = JSON.parse(sessionStorage.getItem('error_breadcrumbs') || '[]');
    return breadcrumbs.slice(-10); // Last 10 actions
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(action, data = {}) {
    const breadcrumbs = this.getBreadcrumbs();
    breadcrumbs.push({
      timestamp: new Date().toISOString(),
      action,
      data,
      url: window.location.href
    });
    
    sessionStorage.setItem('error_breadcrumbs', JSON.stringify(breadcrumbs));
  }

  /**
   * Get device information
   */
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenResolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };
  }

  /**
   * Get performance context
   */
  getPerformanceContext() {
    const navigation = performance.getEntriesByType('navigation')[0];
    
    return {
      loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : null,
      domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.fetchStart : null,
      memoryUsage: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      } : null
    };
  }

  /**
   * Start periodic error reporting
   */
  startPeriodicReporting() {
    setInterval(() => {
      if (this.errorBuffer.length > 0) {
        this.flushErrors();
      }
    }, this.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushErrors();
    });
  }

  /**
   * Flush error buffer to monitoring services
   */
  async flushErrors() {
    if (this.errorBuffer.length === 0) return;
    
    const errors = [...this.errorBuffer];
    this.errorBuffer = [];
    
    try {
      // Send to custom backend
      await this.sendToBackend(errors);
      
      // Send to Sentry (if configured)
      this.sendToSentry(errors);
      
      // Send to Google Analytics
      this.sendToGoogleAnalytics(errors);
      
    } catch (error) {
      console.warn('Failed to flush errors:', error);
      // Put errors back in buffer for retry
      this.errorBuffer.unshift(...errors);
    }
  }

  /**
   * Send errors to backend
   */
  async sendToBackend(errors) {
    try {
      await fetch('/api/analytics/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errors,
          batch_id: 'batch_' + Date.now(),
          client_timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.warn('Failed to send errors to backend:', error);
    }
  }

  /**
   * Send to Sentry (mock implementation - replace with actual Sentry SDK)
   */
  sendToSentry(errors) {
    if (window.Sentry) {
      errors.forEach(error => {
        window.Sentry.captureException(new Error(error.message), {
          tags: {
            type: error.type,
            severity: error.severity
          },
          extra: error,
          fingerprint: [error.type, error.message]
        });
      });
    }
  }

  /**
   * Send critical errors to Google Analytics
   */
  sendToGoogleAnalytics(errors) {
    if (typeof window.gtag === 'function') {
      errors.forEach(error => {
        if (error.severity === 'error') {
          window.gtag('event', 'exception', {
            description: error.message,
            fatal: error.type === 'react_error',
            error_type: error.type,
            page_path: window.location.pathname
          });
        }
      });
    }
  }

  /**
   * Send to real-time monitoring
   */
  sendToRealTimeMonitoring(errorInfo) {
    // Send to LogRocket, Datadog, or other real-time monitoring
    if (window.LogRocket) {
      window.LogRocket.captureException(new Error(errorInfo.message), {
        tags: {
          type: errorInfo.type,
          severity: errorInfo.severity
        },
        extra: errorInfo
      });
    }
    
    if (window.DD_RUM) {
      window.DD_RUM.addError(errorInfo.message, {
        errorType: errorInfo.type,
        stack: errorInfo.stack,
        severity: errorInfo.severity
      });
    }
  }

  /**
   * Manual error capture for custom errors
   */
  captureException(error, context = {}) {
    const errorInfo = {
      type: 'manual_error',
      message: error.message || String(error),
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      severity: context.severity || 'error'
    };
    
    this.captureError(errorInfo);
  }

  /**
   * Capture custom message
   */
  captureMessage(message, level = 'info', context = {}) {
    const errorInfo = {
      type: 'custom_message',
      message,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      severity: level
    };
    
    this.captureError(errorInfo);
  }

  /**
   * Set user context
   */
  setUserContext(user) {
    localStorage.setItem('user_context', JSON.stringify(user));
  }

  /**
   * Set extra context
   */
  setExtraContext(key, value) {
    const context = JSON.parse(localStorage.getItem('extra_context') || '{}');
    context[key] = value;
    localStorage.setItem('extra_context', JSON.stringify(context));
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    return {
      bufferSize: this.errorBuffer.length,
      sessionId: this.getSessionId(),
      totalErrorsCaptured: parseInt(sessionStorage.getItem('total_errors_captured') || '0')
    };
  }
}

// Initialize global error tracker
const errorTracker = new ErrorTracker();

// Export for external access
window.SentraTechErrorTracker = errorTracker;

export default errorTracker;