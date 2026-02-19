document.addEventListener('DOMContentLoaded', () => {
    // ==============================================
    // SHARED INITIALISERS
    // ==============================================
    initFooterYear();

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