// SentraTech Enterprise Service Worker
// Advanced caching strategies for optimal performance and offline capability

const CACHE_NAME = 'sentratech-v2.0.0';
const RUNTIME_CACHE_NAME = 'sentratech-runtime-v2.0.0';
const API_CACHE_NAME = 'sentratech-api-v2.0.0';

// Cache configuration
const CACHE_CONFIG = {
  // Static assets that rarely change
  STATIC_CACHE_DURATION: 365 * 24 * 60 * 60 * 1000, // 1 year
  // API responses
  API_CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  // Runtime assets
  RUNTIME_CACHE_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
  // Maximum cache entries to prevent storage bloat
  MAX_ENTRIES: {
    STATIC: 100,
    RUNTIME: 50,
    API: 30
  }
};
// Advanced cache strategy configuration with versioning
const ADVANCED_CACHE_CONFIG = {
  STATIC_CACHE: 'sentratech-static-v2.0.0',
  DYNAMIC_CACHE: 'sentratech-dynamic-v2.0.0',
  IMAGE_CACHE: 'sentratech-images-v2.0.0',
  API_CACHE: 'sentratech-api-v2.0.0',
  FONT_CACHE: 'sentratech-fonts-v2.0.0',
  CDN_CACHE: 'sentratech-cdn-v2.0.0'
};

// Critical assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico',
  // Critical pages
  '/features',
  '/pricing',
  '/demo-request',
  // Fonts and critical resources
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap',
];

// API endpoints to cache with different strategies
const API_CACHE_PATTERNS = [
  { pattern: /\/api\/metrics\/live/, strategy: 'networkFirst', ttl: 30000 }, // 30s
  { pattern: /\/api\/metrics\/kpis/, strategy: 'staleWhileRevalidate', ttl: 60000 }, // 1min
  { pattern: /\/api\/roi\/calculate/, strategy: 'networkFirst', ttl: 300000 }, // 5min
];

// Critical API routes that should NEVER be cached and always use network-first
const NETWORK_ONLY_PATTERNS = [
  /\/api\/health/,              // Health check endpoint
  /\/api\/forms\//,             // Form submission endpoints
  /\/api\/chat\//,              // Chat endpoints
  /\/api\/ingest\//,            // Ingest endpoints
];

// Check if request should bypass cache completely
const shouldBypassCache = (url) => {
  return NETWORK_ONLY_PATTERNS.some(pattern => pattern.test(url));
};

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('🚀 SentraTech Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Precache static assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📦 Precaching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      }),
      // Initialize other cache storages
      caches.open(RUNTIME_CACHE_NAME),
      caches.open(API_CACHE_NAME)
    ]).then(() => {
      console.log('✅ Service Worker installation complete');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 SentraTech Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      cleanupOldCaches(),
      // Claim all clients immediately
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activation complete');
    })
  );
});

// Fetch event - handle all network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Critical API routes: Always bypass cache for form submissions, health checks, etc.
  if (shouldBypassCache(url.pathname)) {
    console.log('🌐 SW: Bypassing cache for critical API route:', url.pathname);
    event.respondWith(fetch(request)); // Direct network request, no caching
    return;
  }

  // Skip non-GET requests and chrome-extension requests for caching strategies
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different request types with appropriate strategies
  if (url.pathname.startsWith('/api/')) {
    // API requests (non-critical ones)
    event.respondWith(handleApiRequest(request));
  } else if (isStaticAsset(request)) {
    // Static assets (JS, CSS, images, fonts)
    event.respondWith(handleStaticAsset(request));
  } else {
    // Navigation requests (pages)
    event.respondWith(handleNavigation(request));
  }
});

// Cache strategies implementation

/**
 * Handle API requests with network-first strategy and intelligent caching
 */
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const cachePattern = API_CACHE_PATTERNS.find(p => p.pattern.test(url.pathname));
  
  if (!cachePattern) {
    // No caching pattern defined, use network-first with short TTL
    return networkFirstWithFallback(request, API_CACHE_NAME, 60000);
  }

  switch (cachePattern.strategy) {
    case 'networkFirst':
      return networkFirstWithFallback(request, API_CACHE_NAME, cachePattern.ttl);
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(request, API_CACHE_NAME, cachePattern.ttl);
    case 'cacheFirst':
      return cacheFirstWithRefresh(request, API_CACHE_NAME, cachePattern.ttl);
    default:
      return networkFirstWithFallback(request, API_CACHE_NAME, cachePattern.ttl);
  }
}

/**
 * Handle static assets with cache-first strategy
 */
async function handleStaticAsset(request) {
  return cacheFirstWithRefresh(request, CACHE_NAME, CACHE_CONFIG.STATIC_CACHE_DURATION);
}

/**
 * Handle navigation requests with network-first strategy and offline fallback
 */
async function handleNavigation(request) {
  return networkFirstWithOfflineFallback(request, RUNTIME_CACHE_NAME);
}

// Cache strategy implementations

/**
 * Network-first strategy with cache fallback
 */
async function networkFirstWithFallback(request, cacheName, ttl) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful response
      const cache = await caches.open(cacheName);
      const responseToCache = networkResponse.clone();
      
      // Add timestamp for TTL management
      const responseWithTimestamp = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: {
          ...Object.fromEntries(responseToCache.headers.entries()),
          'sw-cached-at': Date.now().toString(),
          'sw-ttl': ttl.toString()
        }
      });
      
      cache.put(request, responseWithTimestamp);
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Network failed, try cache
    console.log('📡 Network failed, trying cache for:', request.url);
    
    const cachedResponse = await getCachedResponse(request, cacheName);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // No cache available, return error
    return new Response(
      JSON.stringify({ error: 'Network unavailable and no cached data' }), 
      { 
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Stale-while-revalidate strategy
 */
async function staleWhileRevalidate(request, cacheName, ttl) {
  const cachedResponse = await getCachedResponse(request, cacheName);
  
  // Always try to fetch fresh data in the background
  const networkPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      const responseToCache = networkResponse.clone();
      
      const responseWithTimestamp = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: {
          ...Object.fromEntries(responseToCache.headers.entries()),
          'sw-cached-at': Date.now().toString(),
          'sw-ttl': ttl.toString()
        }
      });
      
      cache.put(request, responseWithTimestamp);
    }
    return networkResponse;
  }).catch(() => null);

  // Return cached response immediately if available, otherwise wait for network
  if (cachedResponse) {
    // Don't await networkPromise to return cached response immediately
    networkPromise;
    return cachedResponse;
  } else {
    return await networkPromise || new Response('Not found', { status: 404 });
  }
}

/**
 * Cache-first strategy with background refresh
 */
async function cacheFirstWithRefresh(request, cacheName, ttl) {
  const cachedResponse = await getCachedResponse(request, cacheName);
  
  if (cachedResponse) {
    // Check if cache is stale
    const cachedAt = cachedResponse.headers.get('sw-cached-at');
    const cacheTtl = cachedResponse.headers.get('sw-ttl');
    
    if (cachedAt && cacheTtl) {
      const age = Date.now() - parseInt(cachedAt);
      const maxAge = parseInt(cacheTtl);
      
      if (age > maxAge) {
        // Cache is stale, refresh in background
        fetch(request).then(async (networkResponse) => {
          if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            const responseToCache = networkResponse.clone();
            
            const responseWithTimestamp = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: {
                ...Object.fromEntries(responseToCache.headers.entries()),
                'sw-cached-at': Date.now().toString(),
                'sw-ttl': ttl.toString()
              }
            });
            
            cache.put(request, responseWithTimestamp);
          }
        }).catch(() => {}); // Ignore background refresh errors
      }
    }
    
    return cachedResponse;
  } else {
    // No cache, fetch from network
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        const responseToCache = networkResponse.clone();
        
        const responseWithTimestamp = new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: {
            ...Object.fromEntries(responseToCache.headers.entries()),
            'sw-cached-at': Date.now().toString(),
            'sw-ttl': ttl.toString()
          }
        });
        
        cache.put(request, responseWithTimestamp);
        return networkResponse;
      }
    } catch (error) {
      console.error('Cache-first strategy failed:', error);
    }
    
    return new Response('Not found', { status: 404 });
  }
}

/**
 * Network-first with offline fallback for navigation
 */
async function networkFirstWithOfflineFallback(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful navigation response
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page or main page as fallback
    const offlineResponse = await caches.match('/') || 
                           await caches.match('/offline.html');
    
    return offlineResponse || new Response(
      `<!DOCTYPE html>
       <html>
         <head><title>SentraTech - Offline</title></head>
         <body>
           <h1>You're offline</h1>
           <p>Please check your connection and try again.</p>
         </body>
       </html>`,
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 200
      }
    );
  }
}

// Utility functions

/**
 * Get cached response if valid
 */
async function getCachedResponse(request, cacheName) {
  const cache = await caches.open(cacheName);
  return await cache.match(request);
}

/**
 * Check if request is for static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.woff2', '.ico'];
  
  return staticExtensions.some(ext => url.pathname.includes(ext)) ||
         url.pathname.startsWith('/static/') ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com';
}

/**
 * Clean up old cache versions
 */
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE_NAME, API_CACHE_NAME];
  
  const deletionPromises = cacheNames
    .filter(name => !currentCaches.includes(name))
    .map(name => {
      console.log('🗑️ Deleting old cache:', name);
      return caches.delete(name);
    });
  
  return Promise.all(deletionPromises);
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'demo-request-sync') {
    event.waitUntil(syncDemoRequests());
  }
});

/**
 * Sync demo requests when back online
 */
async function syncDemoRequests() {
  // Implementation for syncing offline demo requests
  console.log('🔄 Syncing offline demo requests');
  
  // This would integrate with your demo request system
  // to handle offline form submissions
}

// Push notification handling (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: data.url
      })
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data) {
    event.waitUntil(
      self.clients.openWindow(event.notification.data)
    );
  }
});

console.log('🎯 SentraTech Enterprise Service Worker loaded successfully');