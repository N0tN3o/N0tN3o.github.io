// ==============================================
// SHARED UTILITIES
// Common functionality used across multiple pages.
// Load before page-specific scripts.
// ==============================================

/**
 * Mobile navigation with focus trap and outside-click close.
 */
function initMobileNav() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    const mainContent = document.getElementById('main-content');

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        if (mainContent) mainContent.inert = false;
    }

    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open', isActive);
        if (mainContent) mainContent.inert = isActive;
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            closeMenu();
        }
    });
}

/**
 * Back-to-top button visibility on scroll.
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    });
}

/**
 * Dynamic footer year.
 */
function initFooterYear() {
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
}

/**
 * Service Worker registration.
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const reg = await navigator.serviceWorker.register('./sw.js');
            console.log('SW registered:', reg.scope);
        } catch (err) {
            console.warn('SW registration failed:', err);
        }
    });
}