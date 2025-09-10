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
    const domain = new URL(url).hostname;
    return `https://toolb.cn/favicon/${domain}`;
  } catch (e) {
    console.error('Invalid URL for favicon:', url);
    return '';
  }
}

// Function to get fallback favicon URL using Google service
function getFallbackFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (e) {
    console.error('Invalid URL for fallback favicon:', url);
    return '';
  }
}

// Function to get cached favicon
function getCachedFavicon(domain) {
  try {
    const cachedData = localStorage.getItem(`favicon_${domain}`);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      // Cache for 30 days (2592000000 milliseconds)
      if (Date.now() - parsedData.timestamp < 2592000000) {
        return parsedData.dataUrl;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(`favicon_${domain}`);
      }
    }
    return null;
  } catch (e) {
    console.error('Error getting cached favicon:', e);
    return null;
  }
}

// Function to cache favicon
function cacheFavicon(domain, dataUrl) {
  try {
    const cacheData = {
      dataUrl: dataUrl,
      timestamp: Date.now()
    };
    localStorage.setItem(`favicon_${domain}`, JSON.stringify(cacheData));
  } catch (e) {
    console.error('Error caching favicon:', e);
  }
}

// Function to load favicon for a tool icon element
function loadFavicon(iconElement) {
  const url = iconElement.getAttribute('data-url');
  if (!url) return;
  
  // Find existing img or create new one
  let img = iconElement.querySelector('img');
  if (!img) {
    img = new Image();
    iconElement.appendChild(img);
  }
  
  const domain = extractDomain(url);
  
  // First, try to get favicon from cache
  const cachedFavicon = getCachedFavicon(domain);
  if (cachedFavicon) {
    img.src = cachedFavicon;
    return;
  }
  
  const faviconUrl = getFaviconUrl(url);
  if (faviconUrl) {
    // Set up onload handler before setting src
    img.onload = function() {
      // Since we can't reliably convert cross-origin images to data URLs due to CORS,
      // we'll cache the URL instead of the image data
      try {
        cacheFavicon(domain, faviconUrl);
      } catch (e) {
        // Silently ignore caching errors
      }
    };
    
    // If the favicon fails to load, try Google service as fallback
    img.onerror = function() {
      const fallbackUrl = getFallbackFaviconUrl(url);
      if (fallbackUrl) {
        // Set up a new image for the fallback to avoid conflicts
        const fallbackImg = new Image();
        
        // Set up onload handler for fallback before setting src
        fallbackImg.onload = function() {
          // Cache the fallback URL instead of image data
          try {
            cacheFavicon(domain, fallbackUrl);
          } catch (e) {
            // Silently ignore caching errors
          }
          img.src = fallbackUrl;
        };
        
        fallbackImg.onerror = function() {
          // If all else fails, use our placeholder
          img.src = '/icons/placeholder.svg';
        };
        
        // Try to load the fallback favicon
        fallbackImg.src = fallbackUrl;
      } else {
        // If we can't get fallback URL, use placeholder
        img.src = '/icons/placeholder.svg';
      }
    };
    
    // Try to load the favicon using domestic service first
    img.src = faviconUrl;
  }
}

// Function to load custom icon with caching
function loadCustomIcon(iconElement) {
  let img = iconElement.querySelector('img');
  if (!img) {
    img = new Image();
    iconElement.appendChild(img);
  }
  
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
  img.onload = function() {
    // Cache the loaded icon
    iconCache.set(customIconUrl, customIconUrl);
  };
  img.onerror = function() {
    // If custom icon fails to load, remove from cache if present
    if (iconCache.has(customIconUrl)) {
      iconCache.delete(customIconUrl);
    }
    // Fallback to favicon loading
    loadFavicon(iconElement);
  };
  img.src = customIconUrl;
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