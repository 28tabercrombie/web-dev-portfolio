// Define global variables and functions that the HTML onclick events can access
const images = [
    '/assets/images/slide_0.jpg',
    '/assets/images/slide_1.jpg',
    '/assets/images/slide_2.jpg',
    '/assets/images/slide_3.jpg'
];

let currentImageIndex = 0;
let carouselHero, crossfadeLayer, bubbles, carouselSection, loadingIndicator;
const slideInterval = 5000;
const transitionDuration = 1000;
let autoSlideTimer;
let transitionTimeoutId = null;

// Helper functions (defined globally)
function updateBubbles(index) {
    bubbles.forEach(bubble => bubble.classList.remove('carousel-bubble-active'));
    bubbles[index].classList.add('carousel-bubble-active');
}

function snapToStableState() {
    if (transitionTimeoutId) {
        clearTimeout(transitionTimeoutId);
        transitionTimeoutId = null;
        carouselHero.style.backgroundImage = crossfadeLayer.style.backgroundImage;
        crossfadeLayer.style.opacity = 0;
    }
}

function instantImageChange(newIndex) {
    snapToStableState();
    currentImageIndex = newIndex;
    carouselHero.style.backgroundImage = `url('${images[newIndex]}')`;
    updateBubbles(newIndex);
}

function fadeToImage(newIndex) {
    snapToStableState();
    updateBubbles(newIndex); 

    crossfadeLayer.style.backgroundImage = `url('${images[newIndex]}')`;

    requestAnimationFrame(() => {
        crossfadeLayer.style.opacity = 1;
    });

    transitionTimeoutId = setTimeout(() => {
        carouselHero.style.backgroundImage = `url('${images[newIndex]}')`;
        crossfadeLayer.style.opacity = 0;
        currentImageIndex = newIndex;
        transitionTimeoutId = null;
    }, transitionDuration);
}

// Global handler function linked to the HTML
window.navigateCarousel = function(directionOrIndex) {
    let newIndex;
    
    if (typeof directionOrIndex === 'number') {
        newIndex = directionOrIndex;
    } else if (directionOrIndex === 'next') {
        newIndex = (currentImageIndex + 1) % images.length;
    } else if (directionOrIndex === 'prev') {
        newIndex = (currentImageIndex - 1 + images.length) % images.length;
    }

    if (newIndex !== currentImageIndex) {
        instantImageChange(newIndex);
        resetAutoSlide();
    }
};

// Timer logic
function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
        const nextIndex = (currentImageIndex + 1) % images.length;
        fadeToImage(nextIndex);
    }, slideInterval);
}

/**
 * Preloads all images using Promises and JS Image objects.
 */
function preloadImages(imageUrls) {
    const promises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = reject;
        });
    });
    return Promise.all(promises);
}

// DOM content loaded event for initial setup
document.addEventListener('DOMContentLoaded', () => {
    // Assign DOM elements to global variables
    carouselHero = document.getElementById('carousel-hero');
    crossfadeLayer = document.getElementById('carousel-crossfade');
    bubbles = document.querySelectorAll('.carousel-bubble');
    carouselSection = document.getElementById('carousel-section');
    loadingIndicator = document.getElementById('carousel-loading');

    // Start preloading the images first
    preloadImages(images)
        .then(() => {
            // All images are now in the browser cache.
            console.log('All carousel images preloaded!');
            
            // Hide the loading indicator and show the carousel
            loadingIndicator.style.display = 'none';
            carouselSection.style.display = 'block'; 

            // Initialize the carousel now that assets are ready
            instantImageChange(currentImageIndex);
            resetAutoSlide();
        })
        .catch(error => {
            console.error('Failed to load one or more images', error);
            loadingIndicator.textContent = 'Error loading carousel images.';
        });
});
