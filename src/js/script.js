// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 6;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = posX + '%';
        particle.style.top = posY + '%';
        particle.style.animationDelay = delay + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll animations
function animateOnScroll() {
    const sections = document.querySelectorAll('.section');
    const navbar = document.getElementById('navbar');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPos = window.pageYOffset + window.innerHeight;
        
        if (scrollPos > sectionTop + sectionHeight / 3) {
            section.classList.add('visible');
        }
    });

    // Navbar scroll effect
    if (window.pageYOffset > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Progress bar
    const scrollPercent = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('progressBar').style.width = scrollPercent + '%';
}

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('active');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    animateOnScroll();
});

// Event listeners
window.addEventListener('scroll', animateOnScroll);

// Smooth reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Add hover effects to skill tags
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'scale(1.05) rotate(2deg)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'scale(1) rotate(0deg)';
    });
});