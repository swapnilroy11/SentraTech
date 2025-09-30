// SentraTech Service Worker Registration
// Enterprise-grade PWA capabilities and caching strategies

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.0/8 are considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            '🔧 This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('🚀 SentraTech Service Worker registered successfully');
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                '🔄 New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('✅ Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        });
      });
      
      // Enable background sync if supported
      if ('sync' in window.ServiceWorkerRegistration.prototype) {
        console.log('📡 Background sync supported');
        
        // Register background sync for demo requests
        registration.sync.register('demo-request-sync');
      }
      
      // Request persistent storage for better caching
      if ('storage' in navigator && 'persist' in navigator.storage) {
        navigator.storage.persist().then((persistent) => {
          if (persistent) {
            console.log('💾 Persistent storage granted');
          } else {
            console.log('💾 Persistent storage not granted');
          }
        });
      }
      
      // Estimate storage usage
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then((estimate) => {
          console.log(`📊 Storage estimate: ${formatBytes(estimate.usage)} / ${formatBytes(estimate.quota)}`);
        });
      }
    })
    .catch((error) => {
      console.error('❌ Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('🔌 No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('🗑️ Service worker unregistered');
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Utility functions

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Check if app can be installed (PWA)
 */
export function checkInstallPrompt() {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💿 PWA install prompt available');
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    
    // Show install button or banner to user
    if (window.showInstallPrompt) {
      window.showInstallPrompt();
    }
  });

  // Handle the install prompt
  window.addEventListener('appinstalled', (evt) => {
    console.log('📱 SentraTech PWA installed successfully');
    
    // Track installation
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'pwa_installed', {
        event_category: 'engagement',
        event_label: 'PWA Installation',
      });
    }
  });

  return deferredPrompt;
}

/**
 * Show update available notification
 */
export function showUpdateAvailableNotification() {
  // Create a simple notification that new content is available
  if (Notification.permission === 'granted') {
    new Notification('SentraTech Updated', {
      body: 'New version available! Please refresh the page.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    });
  } else {
    // Fallback to browser notification or in-app banner
    console.log('🔄 App update available - please refresh');
  }
}

/**
 * Request notification permission
 */
export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      console.log('🔔 Notification permission:', permission);
    });
  }
}

/**
 * Cache important resources proactively
 */
export function precacheImportantResources() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    // Send message to service worker to precache additional resources
    navigator.serviceWorker.controller.postMessage({
      type: 'PRECACHE_RESOURCES',
      resources: [
        '/features',
        '/pricing', 
        '/case-studies',
        '/security',
        '/roi-calculator'
      ]
    });
  }
}

export default {
  register,
  unregister,
  checkInstallPrompt,
  showUpdateAvailableNotification,
  requestNotificationPermission,
  precacheImportantResources
};