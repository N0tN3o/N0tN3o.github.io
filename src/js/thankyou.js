document.addEventListener('DOMContentLoaded', () => {
    // ==============================================
    // THEME SYSTEM (persistence from other pages)
    // ==============================================
    const savedTheme = localStorage.getItem('portfolio-theme') || 'slate-dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themePanel = document.getElementById('themePanel');
    const themePanelToggle = document.getElementById('themePanelToggle');

    if (themePanel && themePanelToggle) {
        themePanelToggle.addEventListener('click', () => themePanel.classList.toggle('open'));

        themePanel.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('portfolio-theme', theme);
                themePanel.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        const activeBtn = themePanel.querySelector(`.theme-btn[data-theme="${savedTheme}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        document.addEventListener('click', (e) => {
            if (!themePanel.contains(e.target)) themePanel.classList.remove('open');
        });
    }

    // ==============================================
    // DYNAMIC FOOTER YEAR
    // ==============================================
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ==============================================
    // COUNTDOWN REDIRECT
    // ==============================================
    const countdownEl = document.getElementById('countdown');
    let seconds = 10;

    const timer = setInterval(() => {
        seconds--;
        if (countdownEl) countdownEl.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(timer);
            window.location.href = './index.html';
        }
    }, 1000);
});