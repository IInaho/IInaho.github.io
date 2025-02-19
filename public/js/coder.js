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

document.addEventListener("DOMContentLoaded", function () {
    let node = document.querySelector('.preload-transitions');
    node.classList.remove('preload-transitions');
});

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

    // Create and send event
    const event = new Event('themeChanged');
    document.dispatchEvent(event);
}

function rememberTheme(theme) {
    localStorage.setItem('colorscheme', theme);
}


document.addEventListener('DOMContentLoaded', function () {
    const toc = document.querySelector('.table-of-contents');
    if (!toc) return;

    // 初始状态设置为隐藏
    toc.classList.add('hidden');
    let timer;

    // 鼠标交互处理
    toc.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        toc.classList.add('visible');
        toc.classList.remove('hidden');
    });

    toc.addEventListener('mouseleave', () => {
        timer = setTimeout(() => {
            toc.classList.remove('visible');
            toc.classList.add('hidden');
        }, 300);
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

    // 点击处理
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                isScrolling = true;

                if (currentActiveLink) {
                    currentActiveLink.classList.remove('active');
                }

                link.classList.add('active');
                currentActiveLink = link;

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                setTimeout(() => {
                    isScrolling = false;
                }, 1000);
            }
        });
    });

    // 为每个标题添加观察
    headings.forEach(heading => {
        if (!heading.id) {
            heading.id = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        }
        observer.observe(heading);
    });
});