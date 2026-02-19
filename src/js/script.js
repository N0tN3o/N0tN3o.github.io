document.addEventListener('DOMContentLoaded', () => {
    // ==============================================
    // ELEMENT REFERENCES
    // ==============================================
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    const progressBar = document.getElementById('progressBar');
    const themePanel = document.getElementById('themePanel');
    const themePanelToggle = document.getElementById('themePanelToggle');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const yearTabs = document.querySelectorAll('.year-tab');
    const yearContents = document.querySelectorAll('.year-content');

    // ==============================================
    // SMOOTH SCROLLING
    // ==============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') { e.preventDefault(); return; }
            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (error) {
                console.warn('Invalid anchor href:', href);
            }
        });
    });

    // ==============================================
    // MOBILE NAVIGATION
    // ==============================================
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open', isActive);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ==============================================
    // SCROLL PROGRESS BAR
    // ==============================================
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = (scrollTop / scrollHeight) * 100 + '%';
        }

        // Back to top button visibility
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }
    });

    // ==============================================
    // THEME SYSTEM
    // ==============================================
    const savedTheme = localStorage.getItem('portfolio-theme') || 'slate-dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateActiveThemeButton(savedTheme);

    if (themePanelToggle && themePanel) {
        themePanelToggle.addEventListener('click', () => {
            themePanel.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!themePanel.contains(e.target)) {
                themePanel.classList.remove('open');
            }
        });
    }

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('portfolio-theme', theme);
            updateActiveThemeButton(theme);
        });
    });

    function updateActiveThemeButton(theme) {
        themeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
        });
    }

    // ==============================================
    // ACADEMIC YEAR TABS
    // ==============================================
    yearTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const year = tab.getAttribute('data-year');
            yearTabs.forEach(t => {
                t.classList.toggle('active', t === tab);
                t.setAttribute('aria-selected', t === tab);
            });
            yearContents.forEach(content => {
                content.classList.toggle('active', content.getAttribute('data-year') === year);
            });
        });
    });

    // ==============================================
    // STICKY YEAR TABS (dynamic top offset)
    // Activates on screens <= 768px only
    // ==============================================
    const yearTabsEl = document.querySelector('.year-tabs');

    function updateStickyTabs() {
        if (!yearTabsEl) return;

        if (window.innerWidth <= 768) {
            // Dynamically measure nav height
            const nav = document.getElementById('navbar');
            const navHeight = nav ? nav.offsetHeight : 56;
            document.documentElement.style.setProperty('--nav-height', navHeight + 'px');
            yearTabsEl.classList.add('sticky');
        } else {
            yearTabsEl.classList.remove('sticky');
        }
    }

    updateStickyTabs();
    window.addEventListener('resize', updateStickyTabs);

    // ==============================================
    // SECTION FADE-IN ON SCROLL
    // ==============================================
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        fadeObserver.observe(section);
    });

    // ==============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ==============================================
    const sections = document.querySelectorAll('.section');
    const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

    const highlightNavOnScroll = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinkItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavOnScroll);

    // ==============================================
    // DYNAMIC FOOTER YEAR
    // ==============================================
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
});