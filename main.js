// Main JavaScript for Events Website

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeCategories();
    initializeEventCards();
    initializeNavigation();
});

// Initialize Carousel Functionality
function initializeCarousel() {
    const carousel = document.getElementById('featuredCarousel');
    if (carousel) {
        // Carousel is initialized by Bootstrap automatically
        // Add custom functionality if needed
        const carouselItems = carousel.querySelectorAll('.carousel-item');
        carouselItems.forEach((item, index) => {
            item.addEventListener('slide.bs.carousel', function() {
                console.log('Carousel slide ' + index);
            });
        });
    }
}

// Initialize Category Badges
function initializeCategories() {
    const categoryBadges = document.querySelectorAll('.category-badge');
    categoryBadges.forEach(badge => {
        badge.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('span').textContent;
            filterEventsByCategory(category);
            console.log('Filtering by category: ' + category);
        });
    });
}

// Initialize Event Cards
function initializeEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        const button = card.querySelector('.btn');
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const eventName = card.querySelector('h4').textContent;
                showEventDetails(eventName);
            });
        }

        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
}

// Initialize Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Close navbar when link is clicked on mobile
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarToggler.offsetParent !== null) {
                    navbarToggler.click();
                }
            });
        });
    }
}

// Filter Events by Category
function filterEventsByCategory(category) {
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        const eventCategory = card.querySelector('.event-category').textContent;
        if (eventCategory.trim() === category.trim()) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 10);
        } else {
            card.style.opacity = '0.3';
        }
    });

    // Reset filter with a "Show All" option
    setTimeout(() => {
        const reset = confirm('هل تريد عرض جميع الفعاليات؟');
        if (reset) {
            eventCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
            });
        }
    }, 3000);
}

// Show Event Details
function showEventDetails(eventName) {
    alert('تم اختيار: ' + eventName + '\nسيتم نقلك إلى صفحة التفاصيل الكاملة للفعالية.');
    // In a real application, you would navigate to the event details page
    // window.location.href = '/event.html?name=' + encodeURIComponent(eventName);
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Add scroll animation for elements on page load
function animateOnScroll() {
    const elements = document.querySelectorAll('.event-card, .category-badge');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations
animateOnScroll();

// Search functionality (for potential search feature)
function searchEvents(query) {
    const eventCards = document.querySelectorAll('.event-card');
    let results = 0;

    eventCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('.event-description').textContent.toLowerCase();

        if (title.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
            card.style.display = 'block';
            results++;
        } else {
            card.style.display = 'none';
        }
    });

    return results;
}

// Sort events by date
function sortEventsByDate() {
    const eventsContainer = document.querySelector('.events-grid');
    const eventCards = Array.from(document.querySelectorAll('.event-card'));

    eventCards.sort((a, b) => {
        const dateA = new Date(a.querySelector('.event-date').textContent);
        const dateB = new Date(b.querySelector('.event-date').textContent);
        return dateA - dateB;
    });

    eventCards.forEach(card => {
        eventsContainer.appendChild(card);
    });
}

// Handle window resize for responsive behavior
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        console.log('Window resized to:', window.innerWidth, 'x', window.innerHeight);
    }, 250);
});

// Add active state styling
const style = document.createElement('style');
style.innerHTML = `
    .event-card:active {
        transform: scale(0.98);
    }
    
    .category-badge:active {
        transform: scale(0.95);
    }
`;
document.head.appendChild(style);
