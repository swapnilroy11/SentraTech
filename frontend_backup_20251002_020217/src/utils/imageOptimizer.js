// Image optimization utilities
export class ImageOptimizer {
  // WebP detection and fallback
  static supportsWebP() {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  // Lazy loading with Intersection Observer
  static initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadOptimizedImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px', // Load 50px before entering viewport
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without Intersection Observer
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.loadOptimizedImage(img);
      });
    }
  }

  static async loadOptimizedImage(img) {
    const dataSrc = img.getAttribute('data-src');
    const dataWebP = img.getAttribute('data-webp');
    
    if (dataWebP && await this.supportsWebP()) {
      img.src = dataWebP;
    } else if (dataSrc) {
      img.src = dataSrc;
    }
    
    img.classList.remove('lazy');
    img.classList.add('loaded');
  }

  // Progressive image loading
  static createProgressiveImage(src, placeholder, alt = '') {
    const container = document.createElement('div');
    container.className = 'progressive-image-container';
    container.style.cssText = `
      position: relative;
      overflow: hidden;
      background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                  linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                  linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
      background-size: 20px 20px;
      background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
    `;
    
    // Low quality placeholder
    const placeholderImg = document.createElement('img');
    placeholderImg.src = placeholder;
    placeholderImg.alt = alt;
    placeholderImg.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(5px);
      transition: opacity 0.3s ease;
    `;
    
    // High quality image
    const mainImg = document.createElement('img');
    mainImg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    mainImg.onload = () => {
      mainImg.style.opacity = '1';
      placeholderImg.style.opacity = '0';
    };
    
    mainImg.src = src;
    mainImg.alt = alt;
    
    container.appendChild(placeholderImg);
    container.appendChild(mainImg);
    
    return container;
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  ImageOptimizer.initializeLazyLoading();
});