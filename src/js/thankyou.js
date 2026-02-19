document.addEventListener('DOMContentLoaded', () => {
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