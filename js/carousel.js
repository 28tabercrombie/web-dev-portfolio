const images = ['/assets/images/slide_0.jpg', '/assets/images/slide_1.jpg', '/assets/images/slide_2.jpg', '/assets/images/slide_3.jpg'];
let currentIndex = 0, autoSlideTimer, transitionTimeout;

// DOM Elements
const el = (id) => document.getElementById(id);
const ui = {
    hero: el('carousel-hero'),
    fade: el('carousel-crossfade'),
    bubbles: document.getElementsByClassName('carousel-bubble'),
    section: el('carousel-section'),
    loading: el('carousel-loading')
};

function updateCarousel(newIndex, instant = false) {
    // Clear any pending transitions/timers
    clearTimeout(transitionTimeout);
    clearInterval(autoSlideTimer);

    // Update Bubbles
    [...ui.bubbles].forEach((b, i) => b.classList.toggle('carousel-bubble-active', i === newIndex));

    const url = `url('${images[newIndex]}')`;

    if (instant) {
        ui.hero.style.backgroundImage = url;
        ui.fade.style.opacity = 0;
    } else {
        ui.fade.style.backgroundImage = url;
        ui.fade.style.opacity = 1;
        transitionTimeout = setTimeout(() => {
            ui.hero.style.backgroundImage = url;
            ui.fade.style.opacity = 0;
        }, 1000); // transitionDuration
    }

    currentIndex = newIndex;
    autoSlideTimer = setInterval(() => updateCarousel((currentIndex + 1) % images.length), 5000);
}

// Global handler for HTML onclick
window.navigateCarousel = (dir) => {
    let n = typeof dir === 'number' ? dir : (currentIndex + (dir === 'next' ? 1 : -1) + images.length) % images.length;
    if (n !== currentIndex) updateCarousel(n, true);
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    Promise.all(images.map(src => new Promise(res => { const img = new Image(); img.onload = res; img.src = src; })))
        .then(() => {
            ui.loading.style.display = 'none';
            ui.section.style.display = 'block';
            updateCarousel(0, true);
        })
        .catch(() => ui.loading.textContent = 'Error loading images.');
});