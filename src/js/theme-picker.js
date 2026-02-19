// ==============================================
// SHARED THEME PICKER
// Generates the theme panel DOM and handles
// theme switching + persistence via localStorage.
// Usage: include this script, then call initThemePanel()
// ==============================================

const THEMES = [
    { id: 'slate-dark',          name: 'Slate Dark' },
    { id: 'pitch-black',         name: 'Pitch Black' },
    { id: 'midnight-purple',     name: 'Midnight Purple' },
    { id: 'ocean-deep',          name: 'Ocean Deep' },
    { id: 'forest-dark',         name: 'Forest Dark' },
    { id: 'warm-dark',           name: 'Warm Dark' },
    { id: 'mono-dark',           name: 'Monochrome Dark' },
    { id: 'high-contrast-dark',  name: 'High Contrast Dark' },
    { id: 'light-clean',         name: 'Light Clean' },
    { id: 'light-warm',          name: 'Light Warm' },
    { id: 'light-sage',          name: 'Light Sage' },
    { id: 'high-contrast-light', name: 'High Contrast Light' },
];

function initThemePanel() {
    // Apply saved theme immediately (before DOM builds, to prevent flash)
    const savedTheme = localStorage.getItem('portfolio-theme') || 'slate-dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Build panel HTML
    const panel = document.createElement('aside');
    panel.className = 'theme-panel';
    panel.id = 'themePanel';

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