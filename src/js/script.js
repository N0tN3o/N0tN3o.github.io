document.addEventListener('DOMContentLoaded', () => {
    // ==============================================
    // SHARED INITIALISERS
    // ==============================================
    initMobileNav();
    initBackToTop();
    initFooterYear();

    // ==============================================
    // ELEMENT REFERENCES
    // ==============================================
    const progressBar = document.getElementById('progressBar');
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
    // SCROLL PROGRESS BAR
    // ==============================================
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = (scrollTop / scrollHeight) * 100 + '%';
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
});