// Optimized third-party script loader
export class OptimizedScriptLoader {
  static loadedScripts = new Set();

  // Lazy load Google Analytics only when needed
  static loadGoogleAnalytics() {
    if (this.loadedScripts.has('ga')) return;
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-75HTVL1QME';
    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-75HTVL1QME', {
        page_title: document.title,
        page_location: window.location.href
      });
    };
    document.head.appendChild(script);
    this.loadedScripts.add('ga');
  }

  // Lazy load PostHog only when user interacts
  static loadPostHog() {
    if (this.loadedScripts.has('posthog')) return;

    // Load PostHog with reduced features for better performance
    window.posthog = window.posthog || [];
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://us-assets.i.posthog.com/static/array.js';
    script.onload = () => {
      if (window.posthog && window.posthog.init) {
        window.posthog.init('phc_yJW1VjHGGwmCbbrtczfqqNxgBDbhlhOWcdzcIJEOTFE', {
          api_host: 'https://us.i.posthog.com',
          // Optimize for performance
          autocapture: false, // Disable heavy autocapture
          session_recording: false, // Disable session recording initially
          disable_session_recording: true,
          loaded: (posthog) => {
            // Only enable essential features
            posthog.identify();
          }
        });
      }
    };
    document.head.appendChild(script);
    this.loadedScripts.add('posthog');
  }

  // Load scripts based on user interaction
  static initializeOnUserInteraction() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const loadOnInteraction = () => {
      this.loadGoogleAnalytics();
      this.loadPostHog();
      
      // Remove listeners after loading
      events.forEach(event => {
        document.removeEventListener(event, loadOnInteraction, { passive: true });
      });
    };

    // Add listeners for user interaction
    events.forEach(event => {
      document.addEventListener(event, loadOnInteraction, { passive: true });
    });

    // Fallback: load after 5 seconds if no interaction
    setTimeout(() => {
      if (!this.loadedScripts.has('ga')) {
        loadOnInteraction();
      }
    }, 5000);
  }
}

// Initialize optimized loading
document.addEventListener('DOMContentLoaded', () => {
  OptimizedScriptLoader.initializeOnUserInteraction();
});