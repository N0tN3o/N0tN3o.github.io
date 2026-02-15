# N0tN3o.github.io

Personal portfolio website for Vince Nemeth -- AI Developer and Data Scientist.

Live at: [https://n0tn3o.github.io](https://n0tn3o.github.io)

---

## About

A responsive, single-page portfolio showcasing my work in deep learning, computer vision, robotics, NLP, and full-stack ML engineering. Built as a static site with no frameworks -- just HTML, CSS, and vanilla JavaScript.

## Features

- **Responsive layout** -- separate stylesheets for desktop (1024px+) and mobile, no media-query spaghetti
- **12 colour themes** -- dark, light, high-contrast, and accent variants; saved to localStorage
- **Service worker** -- network-first caching strategy with offline fallback page
- **Accessible navigation** -- hamburger menu on mobile, keyboard-navigable, ARIA roles throughout
- **Academic timeline** -- tabbed year-by-year view of my BSc Applied Data Science & AI curriculum
- **SVG icon system** -- single sprite sheet, no external icon library dependency
- **Progressive Web App ready** -- installable with offline support

## Structure

```
.
├── index.html                 # Main portfolio page
├── contact.html               # Contact / inquiry page
├── offline.html               # Offline fallback (served by service worker)
├── sw.js                      # Service worker
├── images/
│   ├── icons.svg              # SVG icon sprite
│   ├── webicon.ico            # Favicon (legacy)
│   └── webicon2.ico           # Favicon (modern)
└── src/
    ├── css/
    │   ├── styles-base.css    # Variables, themes, shared components
    │   ├── styles-desktop.css # Desktop-specific layout (min-width: 1024px)
    │   └── styles-mobile.css  # Mobile-specific layout (max-width: 1023px)
    └── js/
        └── script.js          # Theme picker, navigation, tabs, scroll effects
```

## Running Locally

Open `index.html` in a browser. No build step required.

For service worker testing, serve over HTTP:

```bash
npx serve .
```

## Tech

HTML5, CSS3 (custom properties, grid, flexbox), vanilla JavaScript, Service Workers.

## License

This is a personal portfolio. Source is public for reference but not licensed for reuse.