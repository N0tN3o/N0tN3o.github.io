document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    // ==============================================
    // MOBILE NAVIGATION
    // ==============================================
    if (hamburger && navLinks) {
        const mainContent = document.getElementById('main-content');

        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open', isActive);
            if (mainContent) mainContent.inert = isActive;
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                if (mainContent) mainContent.inert = false;
            });
        });
    }

    // ==============================================
    // DYNAMIC EMAIL SUBJECT
    // ==============================================
    const subjectSelect = document.getElementById('page-subject');
    const subjectHidden = document.getElementById('formSubject');
    if (subjectSelect && subjectHidden) {
        const labels = {
            general: 'General',
            internship: 'Internship',
            freelance: 'Freelance',
            collaboration: 'Collaboration'
        };
        subjectSelect.addEventListener('change', () => {
            subjectHidden.value = 'Portfolio Inquiry: ' + (labels[subjectSelect.value] || 'General');
        });
    }

    // ==============================================
    // HCAPTCHA THEME SYNC
    // Matches captcha to current light/dark theme
    // ==============================================
    const captchaEl = document.querySelector('.h-captcha');
    if (captchaEl) {
        const theme = document.documentElement.getAttribute('data-theme') || 'slate-dark';
        const lightThemes = ['light-clean', 'light-warm', 'light-sage', 'high-contrast-light'];
        captchaEl.setAttribute('data-theme', lightThemes.includes(theme) ? 'light' : 'dark');
    }

    // ==============================================
    // BACK TO TOP
    // ==============================================
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        });
    }

    // ==============================================
    // DYNAMIC FOOTER YEAR
    // ==============================================
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
});