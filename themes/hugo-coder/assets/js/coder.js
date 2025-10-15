const body = document.body;
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Check if user preference is set, if not check value of body class for light or dark else it means that colorscheme = auto
if (localStorage.getItem("colorscheme")) {
    setTheme(localStorage.getItem("colorscheme"));
} else if (body.classList.contains('colorscheme-light') || body.classList.contains('colorscheme-dark')) {
    setTheme(body.classList.contains("colorscheme-dark") ? "dark" : "light");
} else {
    setTheme(darkModeMediaQuery.matches ? "dark" : "light");
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        let theme = body.classList.contains("colorscheme-dark") ? "light" : "dark";
        setTheme(theme);
        rememberTheme(theme);
    });
}

darkModeMediaQuery.addListener((event) => {
    setTheme(event.matches ? "dark" : "light");
});

// 添加图片点击放大功能
function initImageZoom() {
    // 获取所有菜谱图片
    const recipeImages = document.querySelectorAll('.recipe-image img');
    
    // 添加调试信息
    console.log('Found recipe images:', recipeImages.length);
    
    if (recipeImages.length === 0) {
        // 如果当前页面没有找到菜谱图片，可能是其他页面
        return;
    }
    
    recipeImages.forEach(img => {
        // 添加调试信息
        console.log('Adding click event to image:', img);
        
        // 为图片添加点击事件
        img.addEventListener('click', function() {
            // 添加调试信息
            console.log('Image clicked:', this.src);
            
            // 创建遮罩层
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                cursor: zoom-out;
            `;
            
            // 创建放大图片
            const zoomedImage = document.createElement('img');
            zoomedImage.src = this.src;
            zoomedImage.alt = this.alt;
            zoomedImage.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            `;
            
            // 添加到遮罩层
            overlay.appendChild(zoomedImage);
            
            // 点击遮罩层关闭
            overlay.addEventListener('click', function() {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            });
            
            // 添加ESC键关闭功能
            function closeOnEscape(e) {
                if (e.key === 'Escape') {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                    document.removeEventListener('keydown', closeOnEscape);
                }
            }
            
            document.addEventListener('keydown', closeOnEscape);
            
            // 添加到页面
            document.body.appendChild(overlay);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let node = document.querySelector('.preload-transitions');
    node.classList.remove('preload-transitions');
    
    // 添加代码块复制按钮
    addCopyButtonsToCodeBlocks();
    
    // 初始化代码块折叠功能
    initCodeBlockCollapse();
    
    // 初始化图片放大功能
    initImageZoom();
    
    // 初始化图片懒加载
    if (window.lazyLoad) {
        window.lazyLoad.init();
    }
});

function addCopyButtonsToCodeBlocks() {
    // 获取所有代码块
    const codeBlocks = document.querySelectorAll('pre.chroma');
    
    codeBlocks.forEach(block => {
        // 检查是否已经添加了复制按钮
        if (block.querySelector('.copy-button')) {
            return;
        }
        
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '复制';
        copyButton.setAttribute('aria-label', '复制代码');
        
        // 将按钮添加到代码块
        block.style.position = 'relative';
        block.appendChild(copyButton);
        
        // 添加点击事件
        copyButton.addEventListener('click', () => {
            const code = block.querySelector('code');
            if (code) {
                // 复制代码到剪贴板，使用textContent替代innerText以避免额外空行
                const codeText = code.textContent;
                navigator.clipboard.writeText(codeText).then(() => {
                    // 显示复制成功状态
                    copyButton.innerHTML = '已复制';
                    copyButton.classList.add('copied');
                    
                    // 2秒后恢复原始状态
                    setTimeout(() => {
                        copyButton.innerHTML = '复制';
                        copyButton.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('复制失败:', err);
                    copyButton.innerHTML = '复制失败';
                    setTimeout(() => {
                        copyButton.innerHTML = '复制';
                    }, 2000);
                });
            }
        });
    });
}

// 代码块折叠功能
function initCodeBlockCollapse() {
    const codeBlocks = document.querySelectorAll('pre.chroma');
    
    codeBlocks.forEach(block => {
        // 获取代码行数
        const codeElement = block.querySelector('code');
        if (!codeElement) return;
        
        // 计算代码行数
        const codeLines = codeElement.textContent.split('\n').length;
        
        // 只有当代码行数超过8行时才添加折叠功能
        if (codeLines <= 8) return;
        
        // 避免重复处理
        if (block.classList.contains('collapsible')) return;
        
        // 添加折叠类
        block.classList.add('collapsible');
        
        // 创建折叠遮罩层
        const collapseOverlay = document.createElement('div');
        collapseOverlay.className = 'code-collapse-overlay';
        collapseOverlay.innerHTML = `
            <div class="code-collapse-content">
                <span class="code-collapse-text">显示全部代码 (${codeLines} 行)</span>
                <i class="fas fa-chevron-down"></i>
            </div>
        `;
        
        block.appendChild(collapseOverlay);
        
        // 创建收起按钮（初始隐藏）
        const collapseButton = document.createElement('button');
        collapseButton.className = 'collapse-button';
        collapseButton.innerHTML = '<i class="fas fa-chevron-up"></i> 收起代码';
        collapseButton.style.display = 'none';
        collapseButton.style.position = 'absolute';
        collapseButton.style.top = '0.8rem';
        collapseButton.style.right = '6.5rem'; // 调整位置避免与复制按钮重叠
        collapseButton.style.zIndex = '15';
        
        block.appendChild(collapseButton);
        
        // 添加遮罩层点击事件（展开）
        collapseOverlay.addEventListener('click', () => {
            block.classList.add('expanded');
            collapseOverlay.style.display = 'none';
            collapseButton.style.display = 'block';
        });
        
        // 添加收起按钮点击事件（收起）
        collapseButton.addEventListener('click', () => {
            block.classList.remove('expanded');
            collapseOverlay.style.display = 'flex';
            collapseButton.style.display = 'none';
            
            // 平滑滚动到代码块顶部
            block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
}

function setTheme(theme) {
    body.classList.remove('colorscheme-auto');
    let inverse = theme === 'dark' ? 'light' : 'dark';
    body.classList.remove('colorscheme-' + inverse);
    body.classList.add('colorscheme-' + theme);
    document.documentElement.style['color-scheme'] = theme;

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    if (theme === 'dark') {
        const message = {
            type: 'set-theme',
            theme: 'github-dark'
        };
        waitForElm('.utterances-frame').then((iframe) => {
            iframe.contentWindow.postMessage(message, 'https://utteranc.es');
        })

    }
    else {
        const message = {
            type: 'set-theme',
            theme: 'github-light'
        };
        waitForElm('.utterances-frame').then((iframe) => {
            iframe.contentWindow.postMessage(message, 'https://utteranc.es');
        })

    }

    function sendMessage(message) {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe) return;
        iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
    }
    sendMessage({
        setConfig: {
            theme: theme,
        },
    });

    // 重新应用复制按钮样式
    setTimeout(() => {
        addCopyButtonsToCodeBlocks();
    }, 100);

    // Create and send event
    const event = new Event('themeChanged');
    document.dispatchEvent(event);
}

function rememberTheme(theme) {
    localStorage.setItem('colorscheme', theme);
}


document.addEventListener('DOMContentLoaded', function () {
    const toc = document.querySelector('.table-of-contents');
    if (!toc) {
        console.log('目录未找到');
        return;
    }
    
    console.log('目录已找到，开始初始化...');

    // 初始状态设置为隐藏
    toc.classList.add('hidden');
    let timer;

    // 鼠标交互处理 - 改进为更智能的显示/隐藏
    let isUserInteracting = false;
    
    toc.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        toc.classList.add('visible');
        toc.classList.remove('hidden');
    });

    toc.addEventListener('mouseleave', () => {
        // 如果用户正在与目录交互（如点击），延迟隐藏
        timer = setTimeout(() => {
            if (!isUserInteracting) {
                toc.classList.remove('visible');
                toc.classList.add('hidden');
            }
        }, 300);
    });
    
    // 点击目录时保持可见
    toc.addEventListener('click', () => {
        isUserInteracting = true;
        setTimeout(() => {
            isUserInteracting = false;
        }, 1000);
    });
    
    // 点击页面其他地方时隐藏目录
    document.addEventListener('click', (e) => {
        if (!toc.contains(e.target)) {
            toc.classList.remove('visible');
            toc.classList.add('hidden');
        }
    });

    // 滚动监听逻辑
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocLinks = document.querySelectorAll('#TableOfContents a');

    const observerOptions = {
        rootMargin: '-80px 0px -80px 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    let currentActiveLink = null;
    let isScrolling = false;

    const observer = new IntersectionObserver(entries => {
        if (isScrolling) return;

        entries.forEach(entry => {
            const targetId = '#' + entry.target.id;
            const link = Array.from(tocLinks).find(link => link.getAttribute('href') === targetId);

            if (!link) return;

            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                if (currentActiveLink) {
                    currentActiveLink.classList.remove('active');
                }
                link.classList.add('active');
                currentActiveLink = link;
            }
        });
    }, observerOptions);

    // 点击处理 - 简化和优化
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetIdClean = targetId.substring(1); // 移除#号
            const targetElement = document.getElementById(targetIdClean);
            
            if (targetElement) {
                isScrolling = true;

                // 更新当前激活的链接
                if (currentActiveLink) {
                    currentActiveLink.classList.remove('active');
                }
                link.classList.add('active');
                currentActiveLink = link;

                // 计算滚动位置并滚动
                const headerOffset = 96;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // 滚动完成后延迟隐藏目录
                setTimeout(() => {
                    toc.classList.remove('visible');
                    toc.classList.add('hidden');
                    isScrolling = false;
                }, 1000);
            } else {
                console.warn('无法找到目标元素:', targetId);
            }
        });
    });

    // 为每个标题添加观察
        headings.forEach(heading => {
            if (!heading.id) {
                // 确保标题ID与Hugo生成的锚点一致
                heading.id = heading.textContent.trim()
                    .toLowerCase()
                    .replace(/[^\w\u4e00-\u9fa5\d]+/g, '-') // 保留中文、数字、字母
                    .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符
                    .replace(/-+/g, '-'); // 合并多个连字符
            }
            observer.observe(heading);
        });
});
