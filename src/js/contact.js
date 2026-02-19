document.addEventListener('DOMContentLoaded', () => {
    // ==============================================
    // SHARED INITIALISERS
    // ==============================================
    initMobileNav();
    initBackToTop();
    initFooterYear();

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
});