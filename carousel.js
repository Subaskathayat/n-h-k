// Interactive Carousel/Crowsell JavaScript
class InteractiveCarousel {
    constructor() {
        this.currentIndex = 0;
        this.items = [];
        this.autoplayInterval = null;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    init() {
        this.setupElements();
        this.createNavigation();
        this.setupEventListeners();
        this.startAutoplay();
        this.updateCarousel();
    }

    setupElements() {
        // Find carousel container
        this.carousel = document.querySelector('.interactive-carousel');
        if (!this.carousel) return;

        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = Array.from(this.carousel.querySelectorAll('.carousel-item'));
        this.items = this.slides.map((slide, index) => ({
            element: slide,
            index: index,
            title: slide.querySelector('h4')?.textContent || '',
            description: slide.querySelector('p')?.textContent || ''
        }));

        // Set total items
        this.totalItems = this.items.length;
    }

    createNavigation() {
        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.className = 'carousel-navigation';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn carousel-btn--prev';
        prevBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6" />
            </svg>
        `;
        prevBtn.setAttribute('aria-label', 'Previous slide');

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn carousel-btn--next';
        nextBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" />
            </svg>
        `;
        nextBtn.setAttribute('aria-label', 'Next slide');

        // Progress dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';

        for (let i = 0; i < this.totalItems; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        // Append navigation
        navContainer.appendChild(prevBtn);
        navContainer.appendChild(dotsContainer);
        navContainer.appendChild(nextBtn);
        this.carousel.appendChild(navContainer);

        // Store references
        this.prevBtn = prevBtn;
        this.nextBtn = nextBtn;
        this.dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));
    }

    setupEventListeners() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());

        // Touch events for mobile
        this.carousel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.carousel.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // Mouse drag events
        this.carousel.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.carousel.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.carousel.addEventListener('mouseleave', (e) => this.handleMouseUp(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].clientX;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        this.carousel.style.cursor = 'grabbing';
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.carousel.style.cursor = 'grab';
        
        const diff = this.startX - e.clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }

    next() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this.updateCarousel();
    }

    prev() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.updateCarousel();
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;

        // Update track position
        const slideWidth = this.carousel.offsetWidth;
        const offset = -this.currentIndex * slideWidth;
        
        this.track.style.transform = `translateX(${offset}px)`;
        this.track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update slide visibility
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });

        // Reset transition flag
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, 5000);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    handleResize() {
        // Maintain current slide position on resize
        const slideWidth = this.carousel.offsetWidth;
        const offset = -this.currentIndex * slideWidth;
        this.track.style.transform = `translateX(${offset}px)`;
    }
}

// Initialize carousels when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveCarousel();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveCarousel;
}
