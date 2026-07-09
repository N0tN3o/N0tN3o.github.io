// ==============================================
// SHARED THEME PICKER
// Generates the theme panel DOM and handles
// theme switching + persistence via localStorage.
// Usage: include this script, then call initThemePanel()
// ==============================================

const THEMES = [
    { id: 'slate-dark',          name: 'Slate Dark',          color: '#0f172a' },
    { id: 'pitch-black',         name: 'Pitch Black',         color: '#000000' },
    { id: 'midnight-purple',     name: 'Midnight Purple',     color: '#1a1625' },
    { id: 'ocean-deep',          name: 'Ocean Deep',          color: '#0c1929' },
    { id: 'forest-dark',         name: 'Forest Dark',         color: '#0f1a14' },
    { id: 'warm-dark',           name: 'Warm Dark',           color: '#1c1512' },
    { id: 'mono-dark',           name: 'Monochrome Dark',     color: '#0a0a0a' },
    { id: 'high-contrast-dark',  name: 'High Contrast Dark',  color: '#000000' },
    { id: 'light-clean',         name: 'Light Clean',         color: '#ffffff' },
    { id: 'light-warm',          name: 'Light Warm',          color: '#fefce8' },
    { id: 'light-sage',          name: 'Light Sage',          color: '#f0fdf4' },
    { id: 'high-contrast-light', name: 'High Contrast Light', color: '#ffffff' },
];

/**
 * Update the browser chrome colour to match the current theme.
 */
function updateThemeColor(themeId) {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
        meta.setAttribute('content', theme.color);
    }
}

function initThemePanel() {
    // Build panel HTML
    const panel = document.createElement('aside');
    panel.className = 'theme-panel';
    panel.id = 'themePanel';

    const savedTheme = localStorage.getItem('portfolio-theme') || 'slate-dark';

    const toggle = document.createElement('button');
    toggle.className = 'theme-panel-toggle';
    toggle.id = 'themePanelToggle';
    toggle.setAttribute('aria-label', 'Toggle theme picker');
    toggle.innerHTML = '<svg class="icon"><use href="./images/icons.svg#icon-palette"/></svg>';

    const options = document.createElement('div');
    options.className = 'theme-options';
    options.innerHTML = '<h4>Theme</h4>';

    const grid = document.createElement('div');
    grid.className = 'theme-grid';

    THEMES.forEach(theme => {
        const btn = document.createElement('button');
        btn.className = 'theme-btn';
        if (theme.id === savedTheme) btn.classList.add('active');
        btn.setAttribute('data-theme', theme.id);
        btn.setAttribute('title', theme.name);
        btn.innerHTML = '<span class="theme-preview"></span>';

        btn.addEventListener('click', () => {
            document.documentElement.setAttribute('data-theme', theme.id);
            localStorage.setItem('portfolio-theme', theme.id);
            updateThemeColor(theme.id);
            grid.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });

        grid.appendChild(btn);
    });

    options.appendChild(grid);
    panel.appendChild(toggle);
    panel.appendChild(options);

    // Insert into DOM (after bg-animation if it exists, otherwise as first body child)
    const bgAnim = document.querySelector('.bg-animation');
    if (bgAnim) {
        bgAnim.after(panel);
    } else {
        document.body.prepend(panel);
    }

    // Toggle open/close
    toggle.addEventListener('click', () => panel.classList.toggle('open'));

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target)) panel.classList.remove('open');
    });
}

// Apply saved theme immediately to prevent flash of unstyled content
(function() {
    const saved = localStorage.getItem('portfolio-theme') || 'slate-dark';
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeColor(saved);
})();

// Build panel once DOM is ready
document.addEventListener('DOMContentLoaded', initThemePanel);