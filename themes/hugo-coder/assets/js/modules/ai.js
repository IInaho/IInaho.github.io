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

  // https://api.xinac.net/
  getFaviconUrl: (url) => `https://api.xinac.net/icon/?url=${Utils.extractDomain(url)}`,

  // 备用图标服务1 - toolb.cn (国内在线工具网站)
  getFallbackFaviconUrl1: (url) => `https://toolb.cn/favicon/${Utils.extractDomain(url)}`,
  
  // 备用图标服务1
  getFallbackFaviconUrl2: (url) => `https://ico.la4.cn/ico.php?url=${Utils.extractDomain(url)}`,
  
  // 备用图标服务2 - Google Favicon API (全球通用)
  getFallbackFaviconUrl3: (url) => `https://www.google.com/s2/favicons?domain=${Utils.extractDomain(url)}`,

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
      // 设置超时时间为5秒
      const timeout = setTimeout(() => reject(new Error(`Image load timeout: ${src}`)), 5000);
      img.onload = () => {
        clearTimeout(timeout);
        resolve(img.src);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to load image: ${src}`));
      };
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
        // 尝试加载备用图标1
        const fallbackUrl1 = Utils.getFallbackFaviconUrl1(url);
        const iconUrl = await loadImage(fallbackUrl1);
        Utils.cache.set(cacheKey, iconUrl);
        img.src = iconUrl;
      } catch (fallbackError1) {
        try {
          // 尝试加载备用图标2 - Google Favicon API
          const fallbackUrl2 = Utils.getFallbackFaviconUrl2(url);
          const iconUrl = await loadImage(fallbackUrl2);
          Utils.cache.set(cacheKey, iconUrl);
          img.src = iconUrl;
        } catch (fallbackError2) {
          try {
            // 尝试加载备用图标3 - toolb.cn
            const fallbackUrl3 = Utils.getFallbackFaviconUrl3(url);
            const iconUrl = await loadImage(fallbackUrl3);
            Utils.cache.set(cacheKey, iconUrl);
            img.src = iconUrl;
          } catch (fallbackError3) {
            // 使用占位符图标
            console.log(`Using placeholder for ${domain}:`, primaryError, fallbackError1, fallbackError2, fallbackError3);
            img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEuNSI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiByeD0iMiIvPjxyZWN0IHg9IjgiIHk9IjgiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==';
          }
        }
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