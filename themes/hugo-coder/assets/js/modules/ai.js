// AI Tools Page JavaScript

console.log('AI Tools page loaded');

// 工具类：统一处理URL和缓存
const Utils = {
  extractDomain: (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.startsWith('www.') ? domain.substring(4) : domain;
    } catch (e) {
      console.error('Invalid URL:', url);
      return '';
    }
  },

  getFaviconUrl: (url) => `https://toolb.cn/favicon/${Utils.extractDomain(url)}`,
  getFallbackFaviconUrl: (url) => `https://www.google.com/s2/favicons?domain=${Utils.extractDomain(url)}&sz=64`,

  cache: {
    get: (key) => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        
        const { dataUrl, timestamp } = JSON.parse(item);
        return Date.now() - timestamp < 2592000000 ? dataUrl : (localStorage.removeItem(key), null);
      } catch {
        return null;
      }
    },

    set: (key, dataUrl) => {
      try {
        localStorage.setItem(key, JSON.stringify({ dataUrl, timestamp: Date.now() }));
      } catch (e) {
        console.error('Error caching:', e);
      }
    }
  }
};

// 图标管理器
const IconManager = (() => {
  const iconCache = new Map();

  const getOrCreateImg = (element) => element.querySelector('img') || element.appendChild(new Image());

  // 使用Promise封装图片加载
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img.src);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  // 加载图标并设置到元素
  const setIcon = async (element, url) => {
    const img = getOrCreateImg(element);
    const domain = Utils.extractDomain(url);
    const cacheKey = `favicon_${domain}`;
    
    // 检查缓存
    const cachedUrl = Utils.cache.get(cacheKey);
    if (cachedUrl) {
      img.src = cachedUrl;
      return;
    }

    try {
      // 尝试加载主图标
      const primaryUrl = Utils.getFaviconUrl(url);
      const iconUrl = await loadImage(primaryUrl);
      Utils.cache.set(cacheKey, iconUrl);
      img.src = iconUrl;
    } catch (primaryError) {
      try {
        // 尝试加载备用图标
        const fallbackUrl = Utils.getFallbackFaviconUrl(url);
        const iconUrl = await loadImage(fallbackUrl);
        Utils.cache.set(cacheKey, iconUrl);
        img.src = iconUrl;
      } catch (fallbackError) {
        // 使用占位符图标
        console.log(`Using placeholder for ${domain}:`, primaryError, fallbackError);
        img.src = '/icons/placeholder.svg';
      }
    }
  };

  const loadFavicon = (element) => {
    const url = element.getAttribute('data-url');
    if (!url) return;
    
    setIcon(element, url);
  };

  const loadCustomIcon = (element) => {
    const customUrl = element.dataset.icon;
    if (!customUrl) return;

    const img = getOrCreateImg(element);
    
    if (iconCache.has(customUrl)) {
      img.src = iconCache.get(customUrl);
      return;
    }

    loadImage(customUrl)
      .then(url => {
        iconCache.set(customUrl, url);
        img.src = url;
      })
      .catch(() => {
        iconCache.delete(customUrl);
        loadFavicon(element);
      });
  };

  return {
    loadFavicon,
    loadCustomIcon
  };
})();

// 事件处理器
const EventHandlers = {
  init: () => {
    document.querySelectorAll('.tool-icon').forEach(icon => 
      icon.dataset.icon ? IconManager.loadCustomIcon(icon) : IconManager.loadFavicon(icon)
    );

    document.querySelectorAll('.tool-card').forEach(card => 
      card.addEventListener('click', () => 
        console.log('Tool card clicked:', card.querySelector('.tool-name').textContent)
      )
    );
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', EventHandlers.init);