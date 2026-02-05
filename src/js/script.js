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
            
            // Skip if href is just "#" or empty
            if (!href || href === '#') {
                e.preventDefault();
                return;
            }
            
            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } catch (error) {
                // Invalid selector, let browser handle it normally
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
            
            // Prevent body scroll when menu is open
            document.body.classList.toggle('menu-open', isActive);
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu when clicking outside
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
    });

    // ==============================================
    // THEME SYSTEM
    // ==============================================
    
    // Load saved theme or use default
    const savedTheme = localStorage.getItem('portfolio-theme') || 'slate-dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateActiveThemeButton(savedTheme);

    // Toggle theme panel
    if (themePanelToggle && themePanel) {
        themePanelToggle.addEventListener('click', () => {
            themePanel.classList.toggle('open');
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!themePanel.contains(e.target)) {
                themePanel.classList.remove('open');
            }
        });
    }

    // Theme button clicks
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
            
            // Update tabs
            yearTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update content
            yearContents.forEach(content => {
                content.classList.toggle('active', content.getAttribute('data-year') === year);
            });
        });
    });

    // ==============================================
    // SECTION FADE-IN ON SCROLL
    // ==============================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // ==============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ==============================================
    const sections = document.querySelectorAll('.section');
    const navLinkItems = document.querySelectorAll('.nav-links a');

    const highlightNavOnScroll = () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
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