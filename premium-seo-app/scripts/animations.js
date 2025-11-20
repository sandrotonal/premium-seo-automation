// ===== ANIMATION SYSTEM =====

class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.performance = {
            reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollAnimations();
        this.setupWaveformAnimation();
        this.setupMicroAnimations();
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);

        // Observe all elements with reveal class
        $$('.reveal').forEach(element => {
            this.scrollObserver.observe(element);
        });
    }

    // Waveform animation for hero section
    setupWaveformAnimation() {
        const waveformPaths = $$('.wave-path');
        
        waveformPaths.forEach(path => {
            this.createWaveform(path);
        });
    }

    createWaveform(pathElement) {
        if (this.performance.reduceMotion) return;

        const svg = pathElement.closest('svg');
        const width = 200;
        const height = 60;
        const points = 50;
        const amplitude = 20;

        const createPath = (time) => {
            let path = 'M 0 ' + (height / 2);
            
            for (let i = 0; i <= points; i++) {
                const x = (i / points) * width;
                const y = (height / 2) + Math.sin((i / points) * Math.PI * 4 + time * 0.003) * amplitude;
                path += ' L ' + x + ' ' + y;
            }
            
            return path;
        };

        const animate = () => {
            const time = Date.now();
            pathElement.setAttribute('d', createPath(time));
            requestAnimationFrame(animate);
        };

        animate();
    }

    // Scroll-based animations
    setupScrollAnimations() {
        if (this.performance.reduceMotion) return;

        // Parallax effect for hero section
        const heroCard = $('.hero-card');
        if (heroCard) {
            on(window, 'scroll', throttle(() => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                heroCard.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }, 16));
        }

        // Floating animation for cards
        this.setupFloatingAnimations();
    }

    setupFloatingAnimations() {
        const cards = $$('.glassmorphic');
        
        cards.forEach((card, index) => {
            if (this.performance.reduceMotion) return;

            // Add floating animation with delay
            card.style.animationDelay = `${index * 0.1}s`;
            addClass(card, 'animate-float');
        });
    }

    // Micro animations for interactive elements
    setupMicroAnimations() {
        // Button hover effects
        $$('.primary-btn, .secondary-btn, .action-btn').forEach(btn => {
            on(btn, 'mouseenter', () => {
                this.animateButtonHover(btn);
            });
            
            on(btn, 'mouseleave', () => {
                this.resetButtonState(btn);
            });
            
            on(btn, 'click', (e) => {
                this.animateButtonClick(btn, e);
            });
        });

        // Card hover effects
        $$('.project-card, .automation-card, .analytics-card').forEach(card => {
            on(card, 'mouseenter', () => {
                this.animateCardHover(card);
            });
            
            on(card, 'mouseleave', () => {
                this.resetCardState(card);
            });
        });

        // Input focus animations
        $$('.chat-input, .language-select').forEach(input => {
            on(input, 'focus', () => {
                this.animateInputFocus(input);
            });
            
            on(input, 'blur', () => {
                this.resetInputState(input);
            });
        });

        // Navigation item animations
        $$('.nav-item').forEach(item => {
            on(item, 'click', () => {
                this.animateNavClick(item);
            });
        });
    }

    // Animation methods
    animateElement(element) {
        if (this.performance.reduceMotion) {
            addClass(element, 'visible');
            return;
        }

        addClass(element, 'visible');
        
        // Add stagger effect for child elements
        const children = $$('.stagger-item', element);
        if (children.length > 0) {
            children.forEach((child, index) => {
                setTimeout(() => {
                    addClass(child, 'animate-in');
                }, index * 100);
            });
        }
    }

    animateButtonHover(button) {
        if (this.performance.reduceMotion) return;
        
        // Subtle scale and glow effect
        button.style.transform = 'translateY(-2px) scale(1.02)';
        button.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.4)';
    }

    resetButtonState(button) {
        button.style.transform = '';
        button.style.boxShadow = '';
    }

    animateButtonClick(button, event) {
        if (this.performance.reduceMotion) return;

        // Ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.style.position = 'relative';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    animateCardHover(card) {
        if (this.performance.reduceMotion) return;

        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
    }

    resetCardState(card) {
        card.style.transform = '';
        card.style.boxShadow = '';
    }

    animateInputFocus(input) {
        if (this.performance.reduceMotion) return;

        const container = input.closest('.chat-input-container') || input.parentElement;
        if (container) {
            container.style.boxShadow = '0 0 0 2px rgba(79, 70, 229, 0.3)';
            container.style.transform = 'scale(1.02)';
        }
    }

    resetInputState(input) {
        const container = input.closest('.chat-input-container') || input.parentElement;
        if (container) {
            container.style.boxShadow = '';
            container.style.transform = '';
        }
    }

    animateNavClick(item) {
        if (this.performance.reduceMotion) return;

        // Bounce effect
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = '';
        }, 150);
    }

    // Loading animations
    showLoadingAnimation(element) {
        const loader = document.createElement('div');
        loader.className = 'loading-animation';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-dots">
                <div></div>
                <div></div>
                <div></div>
            </div>
        `;
        
        element.appendChild(loader);
        addClass(loader, 'animate-in');
    }

    hideLoadingAnimation(element) {
        const loader = $('.loading-animation', element);
        if (loader) {
            addClass(loader, 'animate-out');
            setTimeout(() => loader.remove(), 300);
        }
    }

    // Progress bar animation
    animateProgressBar(element, targetValue, duration = 2000) {
        if (this.performance.reduceMotion) {
            element.style.width = targetValue + '%';
            return;
        }

        let startTime = null;
        const startValue = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (targetValue - startValue) * easeOut;
            
            element.style.width = currentValue + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Counter animation
    animateCounter(element, targetValue, duration = 2000) {
        if (this.performance.reduceMotion) {
            element.textContent = targetValue;
            return;
        }

        let startTime = null;
        const startValue = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
            
            element.textContent = currentValue.toLocaleString('tr-TR');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    // Notification animations
    slideInNotification(notification, direction = 'right') {
        if (this.performance.reduceMotion) {
            notification.style.transform = 'translateX(0)';
            return;
        }

        const startPosition = direction === 'right' ? '100%' : '-100%';
        notification.style.transform = `translateX(${startPosition})`;
        
        setTimeout(() => {
            notification.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            notification.style.transform = 'translateX(0)';
        }, 100);
    }

    slideOutNotification(notification, callback) {
        if (this.performance.reduceMotion) {
            callback();
            return;
        }

        notification.style.transition = 'transform 0.3s ease';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(callback, 300);
    }

    // Typing animation
    animateTyping(element, text, speed = 50) {
        if (this.performance.reduceMotion) {
            element.textContent = text;
            return;
        }

        element.textContent = '';
        let index = 0;

        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        };

        type();
    }

    // Staggered animation for lists
    animateListStagger(elements, delay = 100) {
        if (this.performance.reduceMotion) {
            elements.forEach(el => addClass(el, 'visible'));
            return;
        }

        elements.forEach((element, index) => {
            setTimeout(() => {
                addClass(element, 'animate-in');
            }, index * delay);
        });
    }

    // Modal animations
    animateModalOpen(modal) {
        const backdrop = $('.modal-backdrop', modal);
        const content = $('.modal-content', modal);

        if (this.performance.reduceMotion) {
            backdrop.style.opacity = '1';
            content.style.opacity = '1';
            content.style.transform = 'translate(-50%, -50%)';
            return;
        }

        backdrop.style.opacity = '0';
        content.style.opacity = '0';
        content.style.transform = 'translate(-50%, -60%)';

        setTimeout(() => {
            backdrop.style.transition = 'opacity 0.3s ease';
            content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            backdrop.style.opacity = '1';
            content.style.opacity = '1';
            content.style.transform = 'translate(-50%, -50%)';
        }, 100);
    }

    animateModalClose(modal, callback) {
        const backdrop = $('.modal-backdrop', modal);
        const content = $('.modal-content', modal);

        if (this.performance.reduceMotion) {
            callback();
            return;
        }

        backdrop.style.transition = 'opacity 0.2s ease';
        content.style.transition = 'all 0.3s ease';

        backdrop.style.opacity = '0';
        content.style.opacity = '0';
        content.style.transform = 'translate(-50%, -40%)';

        setTimeout(callback, 300);
    }

    // Particle effects
    createParticles(container, count = 10) {
        if (this.performance.reduceMotion) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${chartTheme.accent};
                border-radius: 50%;
                pointer-events: none;
                left: ${Math.random() * 100}%;
                top: 100%;
                animation: particleFloat ${3 + Math.random() * 2}s ease-out forwards;
            `;

            container.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 5000);
        }
    }

    // Chart animations
    animateChartEntrance(chartCanvas, delay = 0) {
        if (this.performance.reduceMotion) return;

        setTimeout(() => {
            const chart = chartManager.getChart(chartCanvas);
            if (chart) {
                chart.update('active');
            }
        }, delay);
    }

    // Performance monitoring
    startPerformanceMonitoring() {
        if (this.performance.reduceMotion) return;

        // Monitor scroll performance
        let scrollTimeout;
        on(window, 'scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Optimize animations if scrolling is too frequent
                if (window.scrollY > 100) {
                    this.optimizeForScroll();
                }
            }, 100);
        });
    }

    optimizeForScroll() {
        // Reduce animation complexity during scroll
        $$('.floating-animation').forEach(el => {
            el.style.animationDuration = '0.5s';
        });
    }

    // Cleanup methods
    destroy() {
        this.scrollObserver?.disconnect();
        this.observers.forEach(observer => observer.disconnect());
        this.animations.clear();
        this.observers.clear();
    }

    // Utility method to check if animations should run
    shouldAnimate() {
        return !this.performance.reduceMotion && 
               document.visibilityState === 'visible' &&
               !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
}

// Create global animation manager
const animationManager = new AnimationManager();

// CSS for animations (injected dynamically)
function injectAnimationStyles() {
    const styles = `
        <style id="animation-styles">
            .animate-float {
                animation: float 6s ease-in-out infinite;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .loading-animation {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                padding: 2rem;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #334155;
                border-top: 3px solid #4F46E5;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-dots {
                display: flex;
                gap: 0.25rem;
            }
            
            .loading-dots div {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #4F46E5;
                animation: loadingDots 1.4s infinite;
            }
            
            .loading-dots div:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .loading-dots div:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes loadingDots {
                0%, 80%, 100% {
                    opacity: 0.3;
                    transform: scale(0.8);
                }
                40% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .particle {
                position: absolute;
                pointer-events: none;
                border-radius: 50%;
                animation: particleFloat 3s ease-out forwards;
            }
            
            @keyframes particleFloat {
                0% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-100px) scale(0);
                }
            }
        </style>
    `;
    
    if (!$('#animation-styles')) {
        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

// Initialize animation styles
document.addEventListener('DOMContentLoaded', injectAnimationStyles);

// Export functions for global use
window.animationManager = animationManager;
window.injectAnimationStyles = injectAnimationStyles;