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

  const loadImage = (img, src, onLoad, onError) => {
    img.onload = onLoad;
    img.onerror = onError;
    img.src = src;
  };

  const loadFavicon = (element) => {
    const url = element.getAttribute('data-url');
    if (!url) return;

    const img = getOrCreateImg(element);
    const domain = Utils.extractDomain(url);
    const cached = Utils.cache.get(`favicon_${domain}`);

    if (cached) {
      img.src = cached;
      return;
    }

    loadImage(
      img,
      Utils.getFaviconUrl(url),
      () => Utils.cache.set(`favicon_${domain}`, Utils.getFaviconUrl(url)),
      () => {
        const fallbackImg = new Image();
        loadImage(
          fallbackImg,
          Utils.getFallbackFaviconUrl(url),
          () => {
            Utils.cache.set(`favicon_${domain}`, Utils.getFallbackFaviconUrl(url));
            img.src = fallbackImg.src;
          },
          () => img.src = '/icons/placeholder.svg'
        );
      }
    );
  };

  const loadCustomIcon = (element) => {
    const customUrl = element.dataset.icon;
    if (!customUrl) return;

    const img = getOrCreateImg(element);
    
    if (iconCache.has(customUrl)) {
      img.src = iconCache.get(customUrl);
      return;
    }

    loadImage(
      img,
      customUrl,
      () => iconCache.set(customUrl, customUrl),
      () => {
        iconCache.delete(customUrl);
        loadFavicon(element);
      }
    );
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