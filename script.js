/**
 * AngioGold Landing Page - JavaScript
 * Handles animations, scroll effects, and interactions
 */

(function() {
    'use strict';
    
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isSmallScreen = window.matchMedia('(max-width: 1024px)').matches;
    
    function runWhenIdle(task, timeout) {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(task, { timeout: timeout || 2000 });
        } else {
            setTimeout(task, 1);
        }
    }

    // ===================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply fade-in animation to sections
    function initAnimations() {
        if (prefersReducedMotion || isSmallScreen) return;
        
        const animatedElements = document.querySelectorAll(
            '.section-header, .queixa-card, .step, .feature, .tratamento-card, ' +
            '.medico-card, .resultado-item, .faq-item, .clinica-stat, .google-rating'
        );

        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in');
            const staggerIndex = (index % 5) + 1;
            el.classList.add('stagger-' + staggerIndex);
            animationObserver.observe(el);
        });
    }

    // ===================================
    // HEADER SCROLL EFFECT
    // ===================================
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                header.style.boxShadow = '0 2px 20px rgba(106, 26, 29, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
            
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }

    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                if (href === '#') return;
                
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    var headerHeight = document.querySelector('.header').offsetHeight;
                    var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===================================
    // FAQ ACCORDION
    // ===================================
    function initFaqAccordion() {
        var faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(function(item) {
            item.addEventListener('toggle', function() {
                var self = this;
                if (self.open) {
                    faqItems.forEach(function(otherItem) {
                        if (otherItem !== self && otherItem.open) {
                            otherItem.open = false;
                        }
                    });
                }
            });
        });
    }

    // ===================================
    // WHATSAPP BUTTON EFFECTS
    // ===================================
    function initWhatsAppButton() {
        var whatsappBtn = document.querySelector('.whatsapp-float');
        var heroSection = document.querySelector('.hero');
        
        if (!whatsappBtn || !heroSection) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    whatsappBtn.style.transform = 'scale(0.9)';
                    whatsappBtn.style.opacity = '0.85';
                } else {
                    whatsappBtn.style.transform = 'scale(1)';
                    whatsappBtn.style.opacity = '1';
                }
            });
        }, { threshold: 0.5 });

        observer.observe(heroSection);
    }

    // ===================================
    // COUNTER ANIMATION
    // ===================================
    function animateCounter(element, target, duration) {
        var start = 0;
        var startTime = null;
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var current = Math.floor(progress * target);
            element.textContent = '+' + current;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = '+' + target;
            }
        }
        
        window.requestAnimationFrame(step);
    }

    function initCounterAnimation() {
        var statNumber = document.querySelector('.stat-number');
        if (!statNumber) return;
        
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(statNumber, 13, 1500);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statNumber);
    }

    // ===================================
    // PARALLAX EFFECT FOR HERO
    // ===================================
    function initParallax() {
        if (prefersReducedMotion || isSmallScreen) return;
        
        var heroImage = document.querySelector('.hero-image-wrapper img');
        if (!heroImage) return;
        
        var ticking = false;
        
        function updateParallax() {
            var scrollY = window.scrollY;
            if (scrollY < 600) {
                heroImage.style.transform = 'translateY(' + (scrollY * 0.1) + 'px)';
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // ===================================
    // HIDE SCROLL INDICATOR ON SCROLL
    // ===================================
    function initScrollIndicator() {
        if (isSmallScreen) return;
        
        var indicator = document.querySelector('.hero-scroll-indicator');
        if (!indicator) return;
        
        var hidden = false;
        
        window.addEventListener('scroll', function() {
            if (!hidden && window.scrollY > 100) {
                indicator.style.opacity = '0';
                indicator.style.pointerEvents = 'none';
                hidden = true;
            } else if (hidden && window.scrollY <= 100) {
                indicator.style.opacity = '1';
                indicator.style.pointerEvents = 'auto';
                hidden = false;
            }
        }, { passive: true });
    }

    // ===================================
    // FORM TRACKING (for analytics)
    // ===================================
    function initClickTracking() {
        var whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="wa.link"]');
        
        whatsappLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Track WhatsApp click event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'whatsapp_click', {
                        'event_category': 'engagement',
                        'event_label': 'WhatsApp Lead'
                    });
                }
                
                // Also track with dataLayer for GTM
                if (typeof dataLayer !== 'undefined') {
                    dataLayer.push({
                        'event': 'whatsapp_click',
                        'eventCategory': 'engagement',
                        'eventLabel': 'WhatsApp Lead'
                    });
                }
            });
        });
    }

    // ===================================
    // INITIALIZE ALL FUNCTIONS
    // ===================================
    function init() {
        initSmoothScroll();
        initFaqAccordion();
        initClickTracking();
        
        window.requestAnimationFrame(function() {
            initHeaderScroll();
            if (!isSmallScreen) {
                initScrollIndicator();
            }
        });
        
        runWhenIdle(function() {
            initAnimations();
            initWhatsAppButton();
            initCounterAnimation();
            initParallax();
        }, 2500);
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
