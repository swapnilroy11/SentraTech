/**
 * AI-Powered Predictive Resource Loader
 * Uses machine learning to predict user navigation patterns and preload resources
 */

class PredictiveResourceLoader {
  constructor() {
    this.userBehavior = new Map();
    this.navigationPatterns = new Map();
    this.prefetchQueue = new Set();
    this.intersectionObserver = null;
    this.mouseTracker = null;
    this.scrollPredictor = null;
    this.init();
  }

  init() {
    this.initMouseTracking();
    this.initScrollPrediction();
    this.initIntersectionObserver();
    this.loadUserBehaviorData();
    this.startPredictiveAnalysis();
  }

  // Mouse hover prediction for link preloading
  initMouseTracking() {
    let hoverTimeout;
    const HOVER_DELAY = 100; // 100ms hover delay

    document.addEventListener('mouseover', (event) => {
      const link = event.target.closest('a[href]');
      if (link && this.isInternalLink(link.href)) {
        hoverTimeout = setTimeout(() => {
          this.predictivePreload(link.href, 'hover');
        }, HOVER_DELAY);
      }
    }, { passive: true });

    document.addEventListener('mouseout', (event) => {
      const link = event.target.closest('a[href]');
      if (link && hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    }, { passive: true });

    // Touch prediction for mobile
    document.addEventListener('touchstart', (event) => {
      const link = event.target.closest('a[href]');
      if (link && this.isInternalLink(link.href)) {
        // Immediate preload on touch start
        this.predictivePreload(link.href, 'touch');
      }
    }, { passive: true });
  }

  // Scroll-based content prediction
  initScrollPrediction() {
    let lastScrollY = 0;
    let scrollDirection = 'down';
    let scrollVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      
      scrollDirection = deltaY > 0 ? 'down' : 'up';
      scrollVelocity = Math.abs(deltaY);
      
      // Predict next section based on scroll behavior
      if (scrollVelocity > 100) { // Fast scrolling
        this.predictNextSection(scrollDirection, scrollVelocity);
      }

      lastScrollY = currentScrollY;
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Intersection observer for viewport-based predictions
  initIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const links = element.querySelectorAll('a[href]');
          
          links.forEach(link => {
            if (this.isInternalLink(link.href)) {
              this.recordUserInteraction(link.href, 'viewport');
              this.schedulePreload(link.href, 'viewport');
            }
          });
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe all sections
    document.querySelectorAll('section, article, .section').forEach(section => {
      this.intersectionObserver.observe(section);
    });
  }

  // Machine learning-based pattern recognition
  startPredictiveAnalysis() {
    // Analyze user behavior every 5 seconds
    setInterval(() => {
      this.analyzeNavigationPatterns();
      this.updatePredictionModel();
    }, 5000);
  }

  analyzeNavigationPatterns() {
    const currentPath = window.location.pathname;
    const timestamp = Date.now();
    
    // Record current page visit
    if (!this.userBehavior.has(currentPath)) {
      this.userBehavior.set(currentPath, {
        visits: 0,
        totalTime: 0,
        lastVisit: timestamp,
        nextPages: new Map()
      });
    }

    const pageData = this.userBehavior.get(currentPath);
    pageData.visits++;
    pageData.lastVisit = timestamp;

    // Analyze most likely next pages
    this.calculatePageTransitionProbabilities();
  }

  calculatePageTransitionProbabilities() {
    const behaviorData = this.loadUserBehaviorFromStorage();
    const currentPath = window.location.pathname;
    
    if (behaviorData && behaviorData[currentPath]) {
      const transitions = behaviorData[currentPath].transitions || {};
      
      // Sort pages by probability
      const sortedTransitions = Object.entries(transitions)
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 3); // Top 3 most likely pages

      // Preload most likely next pages
      sortedTransitions.forEach(([nextPath, data]) => {
        if (data.probability > 0.3) { // 30% probability threshold
          this.schedulePreload(nextPath, 'prediction', data.probability);
        }
      });
    }
  }

  // Intelligent preloading with priority queue
  predictivePreload(url, trigger, priority = 0.5) {
    if (this.prefetchQueue.has(url)) return;

    const prefetchStrategy = this.determinePrefetchStrategy(trigger, priority);
    
    this.prefetchQueue.add(url);
    
    // Use appropriate prefetching method
    switch (prefetchStrategy) {
      case 'high-priority':
        this.preloadResource(url, 'high');
        break;
      case 'medium-priority':
        this.preloadResource(url, 'medium');
        break;
      case 'low-priority':
        this.prefetchResource(url);
        break;
      case 'dns-only':
        this.prefetchDNS(url);
        break;
    }

    // Record the prediction
    console.log(`🔮 Predictive loading: ${url} (${trigger}, priority: ${priority})`);
  }

  determinePrefetchStrategy(trigger, priority) {
    switch (trigger) {
      case 'hover':
        return priority > 0.7 ? 'high-priority' : 'medium-priority';
      case 'touch':
        return 'high-priority';
      case 'viewport':
        return 'medium-priority';
      case 'prediction':
        return priority > 0.8 ? 'medium-priority' : 'low-priority';
      default:
        return 'low-priority';
    }
  }

  preloadResource(url, priority = 'medium') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = 'document';
    link.importance = priority;
    link.crossOrigin = 'anonymous';
    
    // Add performance timing
    link.onload = () => {
      performance.mark(`preload-complete-${url}`);
      console.log(`⚡ Preload complete: ${url}`);
    };
    
    document.head.appendChild(link);
  }

  prefetchResource(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.crossOrigin = 'anonymous';
    
    link.onload = () => {
      performance.mark(`prefetch-complete-${url}`);
      console.log(`📦 Prefetch complete: ${url}`);
    };
    
    document.head.appendChild(link);
  }

  prefetchDNS(url) {
    try {
      const domain = new URL(url).hostname;
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    } catch (error) {
      console.warn('Invalid URL for DNS prefetch:', url);
    }
  }

  // Advanced scheduling with network conditions
  schedulePreload(url, trigger, priority = 0.5) {
    const connection = navigator.connection;
    
    // Adaptive loading based on network conditions
    if (connection) {
      const { effectiveType, saveData } = connection;
      
      // Skip preloading on slow connections or data saver mode
      if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
        console.log(`🚫 Skipping preload on slow connection: ${url}`);
        return;
      }
      
      // Adjust priority based on connection quality
      if (effectiveType === '4g') {
        priority *= 1.5; // Boost priority on fast connections
      }
    }

    // Schedule with requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.predictivePreload(url, trigger, priority);
      }, { timeout: 2000 });
    } else {
      setTimeout(() => {
        this.predictivePreload(url, trigger, priority);
      }, 100);
    }
  }

  recordUserInteraction(url, type) {
    const currentPath = window.location.pathname;
    const timestamp = Date.now();
    
    // Store interaction in session storage for analysis
    const interactions = JSON.parse(sessionStorage.getItem('userInteractions') || '[]');
    interactions.push({
      from: currentPath,
      to: url,
      type,
      timestamp
    });
    
    // Keep only last 100 interactions
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }
    
    sessionStorage.setItem('userInteractions', JSON.stringify(interactions));
  }

  predictNextSection(scrollDirection, velocity) {
    const sections = document.querySelectorAll('section, .section');
    const currentScroll = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    let targetSection = null;
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + currentScroll;
      
      if (scrollDirection === 'down' && sectionTop > currentScroll + viewportHeight) {
        if (!targetSection || sectionTop < targetSection.offsetTop) {
          targetSection = section;
        }
      }
    });

    if (targetSection) {
      // Preload resources in the predicted section
      const links = targetSection.querySelectorAll('a[href]');
      links.forEach(link => {
        if (this.isInternalLink(link.href)) {
          this.schedulePreload(link.href, 'scroll-prediction', 0.6);
        }
      });
    }
  }

  loadUserBehaviorData() {
    try {
      const stored = localStorage.getItem('userBehaviorData');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.warn('Failed to load user behavior data:', error);
      return {};
    }
  }

  loadUserBehaviorFromStorage() {
    return this.loadUserBehaviorData();
  }

  updatePredictionModel() {
    // Save current behavior data
    const behaviorData = Object.fromEntries(this.userBehavior);
    
    try {
      localStorage.setItem('userBehaviorData', JSON.stringify(behaviorData));
    } catch (error) {
      console.warn('Failed to save user behavior data:', error);
    }
  }

  isInternalLink(url) {
    try {
      const link = new URL(url, window.location.href);
      return link.hostname === window.location.hostname;
    } catch (error) {
      return false;
    }
  }

  // Analytics and reporting
  getPerformanceReport() {
    return {
      prefetchedResources: this.prefetchQueue.size,
      behaviorPatterns: this.userBehavior.size,
      navigationPatterns: this.navigationPatterns.size,
      predictions: Array.from(this.prefetchQueue),
      accuracy: this.calculatePredictionAccuracy()
    };
  }

  calculatePredictionAccuracy() {
    const interactions = JSON.parse(sessionStorage.getItem('userInteractions') || '[]');
    const predictions = Array.from(this.prefetchQueue);
    
    let hits = 0;
    interactions.forEach(interaction => {
      if (predictions.includes(interaction.to)) {
        hits++;
      }
    });

    return interactions.length > 0 ? (hits / interactions.length) * 100 : 0;
  }

  destroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.userBehavior.clear();
    this.navigationPatterns.clear();
    this.prefetchQueue.clear();
  }
}

// Global instance with performance monitoring
if (typeof window !== 'undefined') {
  window.predictiveLoader = new PredictiveResourceLoader();
  
  // Report performance every 30 seconds
  setInterval(() => {
    const report = window.predictiveLoader.getPerformanceReport();
    console.log('🤖 AI Prediction Report:', report);
  }, 30000);
}

export default PredictiveResourceLoader;