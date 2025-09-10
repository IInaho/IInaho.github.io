// AI Tools Page JavaScript

// Add any interactive functionality here
console.log('AI Tools page loaded');

// Icon cache to store loaded icons
const iconCache = new Map();

// Function to extract domain from URL
function extractDomain(url) {
  try {
    const domain = new URL(url).hostname;
    return domain.startsWith('www.') ? domain.substring(4) : domain;
  } catch (e) {
    console.error('Invalid URL:', url);
    return '';
  }
}

// Function to get favicon URL
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).origin;
    return `${domain}/favicon.ico`;
  } catch (e) {
    console.error('Invalid URL for favicon:', url);
    return '';
  }
}

// Function to load favicon for a tool icon element
function loadFavicon(iconElement) {
  const url = iconElement.dataset.url;
  if (!url) return;
  
  const img = iconElement.querySelector('img');
  if (!img) return;
  
  // Check if the image already has a custom icon (not empty and not placeholder)
  if (img.src && img.src !== window.location.origin + '/' && img.src.indexOf('placeholder.svg') === -1) {
    // Image already has a custom icon, don't override it
    return;
  }
  
  const faviconUrl = getFaviconUrl(url);
  if (faviconUrl) {
    // Try to load the favicon
    img.src = faviconUrl;
    
    // If the favicon fails to load, try alternative methods
    img.onerror = function() {
      // Try to get favicon using Google's favicon service as a fallback
      const domain = extractDomain(url);
      if (domain) {
        img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        img.onerror = function() {
          // If all else fails, use our placeholder
          img.src = '/icons/placeholder.svg';
        };
      } else {
        // If we can't extract domain, use placeholder
        img.src = '/icons/placeholder.svg';
      }
    };
  }
}

// Function to load custom icon with caching
function loadCustomIcon(iconElement) {
  const img = iconElement.querySelector('img');
  if (!img) return;
  
  // Check if we have a custom icon URL in the data attribute
  const customIconUrl = iconElement.dataset.icon;
  if (!customIconUrl) return;
  
  // Check if icon is already cached
  if (iconCache.has(customIconUrl)) {
    // Use cached icon
    img.src = iconCache.get(customIconUrl);
    return;
  }
  
  // Load icon and cache it
  const tempImg = new Image();
  tempImg.onload = function() {
    // Cache the loaded icon
    iconCache.set(customIconUrl, customIconUrl);
    img.src = customIconUrl;
  };
  tempImg.onerror = function() {
    // If custom icon fails to load, remove from cache if present
    if (iconCache.has(customIconUrl)) {
      iconCache.delete(customIconUrl);
    }
    // Fallback to favicon loading
    loadFavicon(iconElement);
  };
  tempImg.src = customIconUrl;
}

// Load favicons when page loads
document.addEventListener('DOMContentLoaded', function() {
  const toolIcons = document.querySelectorAll('.tool-icon');
  
  toolIcons.forEach(icon => {
    // Check if tool has a custom icon URL
    if (icon.dataset.icon) {
      // Load custom icon with caching
      loadCustomIcon(icon);
    } else {
      // Load favicon for tools without custom icons
      loadFavicon(icon);
    }
  });
  
  // Add click event to tool cards
  const toolCards = document.querySelectorAll('.tool-card');
  toolCards.forEach(card => {
    card.addEventListener('click', function() {
      console.log('Tool card clicked:', this.querySelector('.tool-name').textContent);
    });
  });
});