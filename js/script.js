// ===== CONFIGURATION =====
const CONFIG = {
    openingDate: new Date('2026-05-18T12:00:00-04:00').getTime(),
    taglines: [
        'Una nueva experiencia en sushi handroll',
        'Ingredientes frescos, hechos al momento',
        'Próximamente en tu ciudad',
    ],
    typewriterSpeed: 60,
    typewriterPause: 3000,
    typewriterDeleteSpeed: 30,
};

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
    const now = new Date().getTime();
    const distance = CONFIG.openingDate - now;

    if (distance <= 0) {
        document.getElementById('countdown-label').textContent = '¡Ya abrimos!';
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';

        const cta = document.getElementById('cta-menu');
        if (cta) cta.querySelector('span').textContent = 'Pedir Ahora';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    animateNumber(document.getElementById('days'), days);
    animateNumber(document.getElementById('hours'), hours);
    animateNumber(document.getElementById('minutes'), minutes);
    animateNumber(document.getElementById('seconds'), seconds);
}

function animateNumber(element, value) {
    const formatted = String(value).padStart(2, '0');
    if (element.textContent !== formatted) {
        element.style.transform = 'scale(1.1)';
        element.textContent = formatted;
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }
}

// ===== TYPEWRITER EFFECT =====
class Typewriter {
    constructor(element, phrases, options = {}) {
        this.element = element;
        this.phrases = phrases;
        this.speed = options.speed || 60;
        this.pause = options.pause || 3000;
        this.deleteSpeed = options.deleteSpeed || 30;
        this.currentPhrase = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.cursor = document.createElement('span');
        this.cursor.classList.add('cursor');
        this.element.appendChild(this.cursor);
        this.textNode = document.createTextNode('');
        this.element.insertBefore(this.textNode, this.cursor);
        this.tick();
    }

    tick() {
        const phrase = this.phrases[this.currentPhrase];

        if (this.isDeleting) {
            this.currentChar--;
            this.textNode.textContent = phrase.substring(0, this.currentChar);
        } else {
            this.currentChar++;
            this.textNode.textContent = phrase.substring(0, this.currentChar);
        }

        let delay = this.isDeleting ? this.deleteSpeed : this.speed;

        // Add variation to feel natural
        if (!this.isDeleting) {
            delay += Math.random() * 40;
        }

        if (!this.isDeleting && this.currentChar === phrase.length) {
            // Finished typing, pause then start deleting
            delay = this.pause;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            // Finished deleting, move to next phrase
            this.isDeleting = false;
            this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
            delay = 400;
        }

        setTimeout(() => this.tick(), delay);
    }
}

// ===== FLOATING PARTICLES =====
function createParticles() {
    const container = document.getElementById('particles');
    const count = window.innerWidth < 768 ? 12 : 25;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${Math.random() * 14 + 8}s`;
        particle.style.animationDelay = `${Math.random() * 10}s`;

        const colors = [
            'rgba(230, 0, 110, 0.5)',
            'rgba(255, 106, 176, 0.35)',
            'rgba(255, 255, 255, 0.25)',
            'rgba(230, 0, 110, 0.35)',
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);
    }
}

// ===== INTERSECTION OBSERVER (scroll animations) =====
function setupScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    // Observe info cards
    document.querySelectorAll('.info-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(card);
    });

    // Observe gallery items
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
        observer.observe(item);
    });

    // Observe phase cards
    document.querySelectorAll('.phase-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });
}

// ===== SMOOTH PARALLAX ON HERO =====
function setupParallax() {
    const content = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (scrolled < window.innerHeight) {
            const rate = scrolled * 0.3;
            content.style.transform = `translateY(${rate * 0.5}px)`;
            content.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
        }
    }, { passive: true });
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Typewriter
    const tagline = document.getElementById('tagline');
    if (tagline) {
        new Typewriter(tagline, CONFIG.taglines, {
            speed: CONFIG.typewriterSpeed,
            pause: CONFIG.typewriterPause,
            deleteSpeed: CONFIG.typewriterDeleteSpeed,
        });
    }

    // Effects
    createParticles();
    setupScrollAnimations();
    setupParallax();
});
