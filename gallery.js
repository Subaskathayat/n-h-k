// Modern Gallery JavaScript
class ModernGallery {
    constructor() {
        this.currentIndex = 0;
        this.totalSlides = 10;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.createDots();
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoPlay();
        this.setupLazyLoading();
    }

    setupElements() {
        this.carouselTrack = document.getElementById('carouselTrack');
        this.progressBar = document.getElementById('progressBar');
        this.dotsContainer = document.getElementById('carouselDots');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.masonryItems = document.querySelectorAll('.masonry-item');
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
        this.dots = document.querySelectorAll('.dot');
    }

    setupEventListeners() {
        // Carousel scroll events
        this.carouselTrack.addEventListener('scroll', () => this.handleScroll());
        
        // Touch events for mobile swipe
        let startX = 0;
        let isDragging = false;

        this.carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.carouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        this.carouselTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            isDragging = false;
        });

        // Masonry grid click events
        this.masonryItems.forEach((item, index) => {
            item.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause auto-play on hover
        this.carouselTrack.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carouselTrack.addEventListener('mouseleave', () => this.startAutoPlay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    handleScroll() {
        const scrollLeft = this.carouselTrack.scrollLeft;
        const slideWidth = this.carouselTrack.offsetWidth;
        const newIndex = Math.round(scrollLeft / slideWidth);
        
        if (newIndex !== this.currentIndex && !this.isAnimating) {
            this.currentIndex = newIndex;
            this.updateCarousel();
        }
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        
        const slideWidth = this.carouselTrack.offsetWidth;
        const targetScroll = index * slideWidth;
        
        this.carouselTrack.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
        
        this.updateCarousel();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }

    updateCarousel() {
        // Update slides
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });

        // Update progress bar
        const progress = ((this.currentIndex + 1) / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;

        // Update masonry grid
        this.masonryItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 3500);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.addEventListener('load', () => {
                        img.style.opacity = '0';
                        setTimeout(() => {
                            img.style.transition = 'opacity 0.5s ease';
                            img.style.opacity = '1';
                        }, 100);
                    });
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    handleResize() {
        // Maintain current slide position on resize
        const slideWidth = this.carouselTrack.offsetWidth;
        const targetScroll = this.currentIndex * slideWidth;
        this.carouselTrack.scrollTo({
            left: targetScroll,
            behavior: 'auto'
        });
    }
}

// Lightbox functionality
class Lightbox {
    constructor() {
        this.isOpen = false;
        this.currentImage = null;
        this.init();
    }

    init() {
        this.createLightbox();
        this.setupEventListeners();
    }

    createLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-caption">
                    <h4></h4>
                    <p></p>
                </div>
            </div>
        `;
        document.body.appendChild(this.lightbox);
    }

    setupEventListeners() {
        // Add click listeners to masonry items for lightbox
        document.querySelectorAll('.masonry-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.open(item);
                }
            });
        });

        // Close lightbox
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('lightbox-close')) {
                this.close();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isOpen) {
                if (e.key === 'Escape') this.close();
            }
        });
    }

    open(item) {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.masonry-overlay');
        const title = overlay.querySelector('h4').textContent;
        const description = overlay.querySelector('span').textContent;

        this.lightbox.querySelector('.lightbox-image').src = img.src;
        this.lightbox.querySelector('.lightbox-image').alt = img.alt;
        this.lightbox.querySelector('h4').textContent = title;
        this.lightbox.querySelector('p').textContent = description;

        this.lightbox.classList.add('open');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.lightbox.classList.remove('open');
        this.isOpen = false;
        document.body.style.overflow = '';
    }
}

// Add lightbox CSS
const lightboxStyles = `
.lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.lightbox.open {
    opacity: 1;
    visibility: visible;
}

.lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    text-align: center;
}

.lightbox-image {
    max-width: 100%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 8px;
}

.lightbox-caption {
    margin-top: 1rem;
    color: white;
}

.lightbox-caption h4 {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
}

.lightbox-caption p {
    opacity: 0.8;
    font-size: 0.9rem;
}

.lightbox-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 0.5rem;
    transition: opacity 0.3s ease;
}

.lightbox-close:hover {
    opacity: 0.7;
}

@media (max-width: 768px) {
    .lightbox-content {
        max-width: 95%;
        max-height: 95%;
    }
    
    .lightbox-image {
        max-height: 70vh;
    }
    
    .lightbox-caption h4 {
        font-size: 1rem;
    }
    
    .lightbox-caption p {
        font-size: 0.8rem;
    }
}
`;

// Inject lightbox styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lightboxStyles;
document.head.appendChild(styleSheet);

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ModernGallery();
    new Lightbox();
});

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll behavior for anchor links
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
