// Early mobile dropdown fix - run immediately
(function() {
    function setupMobileDropdownEarly() {
        const dropdownToggles = document.querySelectorAll('.nav-item.dropdown .dropdown-toggle');

        dropdownToggles.forEach(toggle => {
            if (window.innerWidth < 992) {
                toggle.removeAttribute('data-bs-toggle');
            }

            // Use capture phase to intercept before Bootstrap
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();

                    const dropdown = this.closest('.nav-item.dropdown');
                    const menu = dropdown.querySelector('.dropdown-menu');

                    dropdown.classList.toggle('show');
                    if (menu) menu.classList.toggle('show');

                    return false;
                }
            }, true); // Use capture phase
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupMobileDropdownEarly);
    } else {
        setupMobileDropdownEarly();
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 100
    });


    initCursorSpotlight();
    initMagneticButtons();
    init3DTiltCards();
    initParticles();
    initTextReveal();
});

function initCursorSpotlight() {
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        document.body.style.setProperty('--x', `${e.clientX}px`);
        document.body.style.setProperty('--y', `${e.clientY}px`);
        document.body.classList.add('cursor-active');
    });
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const moveX = x * 0.3;
            const moveY = y * 0.3;

            this.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

function init3DTiltCards() {
    const cards = document.querySelectorAll('.service-card, .feature-card, .blog-card, .team-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-10px)
            scale3d(1.02, 1.02, 1.02)
        `;
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale3d(1, 1, 1)';
    }
}

function initParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    heroSection.appendChild(particlesContainer);

    
    const particlesStyle = document.createElement('style');
    particlesStyle.textContent = `
        .particles-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }

        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
            border-radius: 50%;
            opacity: 0.4;
            animation: particleFloat linear infinite;
        }

        @keyframes particleFloat {
            0% {
                transform: translateY(0) translateX(0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 0.4;
            }
            90% {
                opacity: 0.4;
            }
            100% {
                transform: translateY(-100vh) translateX(var(--drift)) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particlesStyle);

    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 200);
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const left = Math.random() * 100;
        const size = Math.random() * 3 + 2;
        const duration = Math.random() * 10 + 15;
        const drift = Math.random() * 100 - 50;

        particle.style.left = `${left}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.setProperty('--drift', `${drift}px`);

        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
            createParticle();
        }, duration * 1000);
    }
}

function initTextReveal() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target;
                const words = text.textContent.split(' ');

                text.textContent = '';
                text.style.opacity = '1';

                words.forEach((word, index) => {
                    const span = document.createElement('span');
                    span.textContent = word + ' ';
                    span.style.display = 'inline-block';
                    span.style.opacity = '0';
                    span.style.transform = 'translateY(20px)';
                    span.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;

                    text.appendChild(span);
                });

                textObserver.unobserve(text);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-title').forEach(title => {
        title.style.opacity = '0';
        textObserver.observe(title);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.boxShadow = 'none';
    }

    
    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');

    if (heroSection) {
        const shapes = heroSection.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.2);
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
});

const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;

        
        setTimeout(() => {
            
            const isContactForm = this.classList.contains('contact-form');
            const isNewsletterForm = this.classList.contains('newsletter-form');

            
            let message = 'Form submitted successfully!';
            if (isContactForm) {
                message = 'Thank you for your message! We will get back to you soon.';
            } else if (isNewsletterForm) {
                message = 'Thank you for subscribing to our newsletter!';
            }

            
            showNotification(message, 'success');

            
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
});

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 30px;
        background: white;
        padding: 1.25rem 2rem;
        border-radius: 14px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: 0.95rem;
        opacity: 0;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }

    .notification-success {
        color: #00B894;
        border-left: 4px solid #00B894;
    }

    .notification-error {
        color: #d63031;
        border-left: 4px solid #d63031;
    }

    @media (max-width: 768px) {
        .notification {
            right: 15px;
            left: 15px;
            top: 80px;
        }
    }
`;
document.head.appendChild(notificationStyle);

const animateNumbers = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalValue = parseInt(target.getAttribute('data-value'));
            const duration = 2000;
            const increment = finalValue / (duration / 16);
            let currentValue = 0;

            const updateNumber = () => {
                currentValue += increment;
                if (currentValue < finalValue) {
                    target.textContent = Math.floor(currentValue);
                    requestAnimationFrame(updateNumber);
                } else {
                    target.textContent = finalValue;
                }
            };

            updateNumber();
            observer.unobserve(target);
        }
    });
};

const numberObserver = new IntersectionObserver(animateNumbers, {
    threshold: 0.5
});

document.querySelectorAll('.stat-number[data-value]').forEach(stat => {
    numberObserver.observe(stat);
});

const cards = document.querySelectorAll('.feature-card, .service-card, .team-card, .blog-card, .value-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }
});

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .service-card, .team-card, .blog-card, .value-card').forEach(el => {
    fadeInObserver.observe(el);
});

const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    heroSection.addEventListener('mousemove', function(e) {
        const shapes = this.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const moveX = (x - 0.5) * speed;
            const moveY = (y - 0.5) * speed;

            shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
}

const createBackToTop = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

createBackToTop();

const backToTopStyle = document.createElement('style');
backToTopStyle.textContent = `
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #d10072, #e6cccd);
        color: white;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        box-shadow: 0 5px 20px rgba(209, 0, 114, 0.3);
        opacity: 0;
        visibility: hidden;
        transform: scale(0);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 999;
        display: none;
    }

    .back-to-top.show {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
    }

    .back-to-top:hover {
        transform: scale(1.1) translateY(-3px);
        box-shadow: 0 8px 25px rgba(209, 0, 114, 0.4);
    }

    @media (max-width: 768px) {
        .back-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }
    }
`;
document.head.appendChild(backToTopStyle);

function initAppointmentModal() {
    const appointmentBtn = document.getElementById('appointmentBtn');
    const ctaBookAppointment = document.getElementById('ctaBookAppointment');
    const appointmentModal = document.getElementById('appointmentModal1');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const appointmentForm = document.getElementById('appointmentForm');
    const modalOverlay = document.querySelector('.appointment-modal-overlay');


    if (appointmentBtn) {
        appointmentBtn.addEventListener('click', () => {
            appointmentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }


    if (ctaBookAppointment) {
        ctaBookAppointment.addEventListener('click', (e) => {
            e.preventDefault();
            appointmentModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    
    const closeModal = () => {
        appointmentModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && appointmentModal.classList.contains('active')) {
            closeModal();
        }
    });

    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Booking...';
            submitBtn.disabled = true;

            
            setTimeout(() => {
                
                showNotification('Appointment booked successfully! We will contact you shortly to confirm.', 'success');

                
                this.reset();
                closeModal();

                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppointmentModal);
} else {
    initAppointmentModal();
}

function initBeforeVisitModal() {
    const beforeVisitBtn = document.getElementById('beforeVisitBtn');
    const beforeVisitModal = document.getElementById('beforeVisitModal');
    const closeBeforeVisitModalBtn = document.getElementById('closeBeforeVisitModal');
    const closeBeforeVisitBtn = document.getElementById('closeBeforeVisitBtn');
    const modalOverlay = beforeVisitModal?.querySelector('.appointment-modal-overlay');

    if (!beforeVisitBtn || !beforeVisitModal) return;

    // Open modal
    beforeVisitBtn.addEventListener('click', () => {
        beforeVisitModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close modal function
    const closeModal = () => {
        beforeVisitModal.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Close button
    if (closeBeforeVisitModalBtn) {
        closeBeforeVisitModalBtn.addEventListener('click', closeModal);
    }

    // Got It button
    if (closeBeforeVisitBtn) {
        closeBeforeVisitBtn.addEventListener('click', closeModal);
    }

    // Overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && beforeVisitModal.classList.contains('active')) {
            closeModal();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBeforeVisitModal);
} else {
    initBeforeVisitModal();
}

// Mobile Menu Dropdown Fix
function initMobileDropdown() {
    const dropdownToggles = document.querySelectorAll('.nav-item.dropdown .dropdown-toggle');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (!dropdownToggles.length) return;

    dropdownToggles.forEach(dropdownToggle => {
        const dropdown = dropdownToggle.closest('.nav-item.dropdown');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        // Remove Bootstrap's data attributes on mobile to prevent auto-behavior
        if (window.innerWidth < 992) {
            dropdownToggle.removeAttribute('data-bs-toggle');
        }

        // Handle click on dropdown toggle
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth < 992) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                // Close all other dropdowns first
                document.querySelectorAll('.nav-item.dropdown').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('show');
                        const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                        if (otherMenu) {
                            otherMenu.classList.remove('show');
                        }
                    }
                });

                // Toggle current dropdown
                dropdown.classList.toggle('show');
                if (dropdownMenu) {
                    dropdownMenu.classList.toggle('show');
                }

                return false;
            }
        });

        // Close dropdown when clicking dropdown items on mobile
        if (dropdownMenu) {
            const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    if (window.innerWidth < 992) {
                        // Close dropdown
                        dropdown.classList.remove('show');
                        dropdownMenu.classList.remove('show');

                        // Close navbar after a short delay to allow navigation
                        setTimeout(() => {
                            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                                    toggle: true
                                });
                            }
                        }, 100);
                    }
                });
            });
        }
    });

    // Reset dropdown attributes when resizing
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            dropdownToggles.forEach(dropdownToggle => {
                const dropdown = dropdownToggle.closest('.nav-item.dropdown');
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');

                if (window.innerWidth >= 992) {
                    // Desktop: re-enable Bootstrap dropdown
                    dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
                    dropdown.classList.remove('show');
                    if (dropdownMenu) {
                        dropdownMenu.classList.remove('show');
                    }
                } else {
                    // Mobile: disable Bootstrap dropdown
                    dropdownToggle.removeAttribute('data-bs-toggle');
                }
            });
        }, 100);
    });
}

// Initialize mobile dropdown
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileDropdown);
} else {
    initMobileDropdown();
}

console.log('Sage Meadows Allied Health Clinic - Enhanced UI/UX loaded successfully! 🎉');
