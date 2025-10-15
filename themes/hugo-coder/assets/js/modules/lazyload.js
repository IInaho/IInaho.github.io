// 简洁图片懒加载
(function() {
  const cfg = { rootMargin: '50px', threshold: 0.01, retry: 3, delay: 1000 };
  const states = new WeakMap();
  let observer;

  const loadImg = (img, obs) => {
    if (states.get(img)?.loading) return;
    const state = { loading: true, retry: 0, obs };
    states.set(img, state);

    const src = img.dataset.src, srcset = img.dataset.srcset;
    if (!src && !srcset) return done(img, state);

    const temp = new Image();
    temp.onload = () => {
      if (srcset) img.srcset = srcset;
      if (src) img.src = src;
      img.classList.replace('lazyload', 'lazyloaded');
      done(img, state);
    };
    temp.onerror = () => handleErr(img, state);
    srcset && (temp.srcset = srcset);
    src && (temp.src = src);
  };

  const done = (img, state) => {
    state.loading = false;
    state.obs?.unobserve(img);
  };

  const handleErr = (img, state) => {
    state.loading = false;
    if (state.retry < cfg.retry) {
      state.retry++;
      setTimeout(() => states.get(img) === state && loadImg(img, state.obs), cfg.delay);
    } else {
      img.classList.replace('lazyload', 'lazyload-error');
    }
  };

  const init = () => {
    if (!window.IntersectionObserver) return loadAll();
    observer = new IntersectionObserver((entries) => {
      entries.forEach(e => e.isIntersecting && loadImg(e.target, observer));
    }, cfg);
    
    document.querySelectorAll('img[data-src].lazyload, img[data-srcset].lazyload')
      .forEach(img => observer.observe(img));
    
    new MutationObserver(muts => muts.forEach(m => m.addedNodes.forEach(n => {
      if (n.tagName === 'IMG' && (n.dataset.src || n.dataset.srcset) && n.classList.contains('lazyload')) {
        observer.observe(n);
      }
      n.querySelectorAll?.('img[data-src].lazyload, img[data-srcset].lazyload').forEach(img => observer.observe(img));
    }))).observe(document.body, { childList: true, subtree: true });
  };

  const loadAll = () => document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
    img.classList.replace('lazyload', 'lazyloaded');
  });

  const ready = () => document.readyState === 'loading' 
    ? document.addEventListener('DOMContentLoaded', init) 
    : init();

  ready();
  window.lazyLoad = { init, loadAll, load: img => loadImg(img) };
})();