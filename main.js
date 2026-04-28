// Main JavaScript for Events Website

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeCategories();
    initializeEventCards();
    initializeNavigation();
    initializeBonusFeatures();
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

// ========================================
// BONUS FEATURES - Merged Module
// ========================================

// Initialize Booking Modal
function initializeBookingModal() {
    const bookingForm = document.getElementById('bookingForm');
    const successAlert = document.getElementById('bookingSuccess');
    const modal = document.getElementById('bookingModal');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('bookingName').value;
            const email = document.getElementById('bookingEmail').value;
            const tickets = document.getElementById('bookingTickets').value;
            const eventName = document.getElementById('eventNameHidden').value;

            if (name && email && tickets) {
                const booking = {
                    name: name,
                    email: email,
                    tickets: tickets,
                    event: eventName,
                    date: new Date().toLocaleString('ar-SA')
                };

                let bookings = JSON.parse(localStorage.getItem('eventBookings')) || [];
                bookings.push(booking);
                localStorage.setItem('eventBookings', JSON.stringify(bookings));

                successAlert.style.display = 'block';
                this.reset();

                setTimeout(() => {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) bsModal.hide();
                    successAlert.style.display = 'none';
                }, 2000);

                console.log('Booking saved:', booking);
            }
        });
    }
}

// Initialize Scroll-to-Top Button
function initializeScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize Dark Mode Toggle
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (darkModeToggle) {
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

        if (isDarkMode) {
            enableDarkMode();
            darkModeToggle.checked = true;
        }

        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                enableDarkMode();
                localStorage.setItem('darkMode', 'enabled');
            } else {
                disableDarkMode();
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }

    function enableDarkMode() {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
    }

    function disableDarkMode() {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-mode');
    }
}

// Initialize Category Preferences
function initializeCategoryPreferences() {
    const categoryBadges = document.querySelectorAll('.category-badge');
    const savedCategories = JSON.parse(localStorage.getItem('favoriteCategories')) || [];

    categoryBadges.forEach(badge => {
        const category = badge.querySelector('span').textContent.trim();

        if (savedCategories.includes(category)) {
            badge.classList.add('favorite-category');
        }

        badge.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const categoryName = this.querySelector('span').textContent.trim();

            if (this.classList.contains('favorite-category')) {
                this.classList.remove('favorite-category');
                const index = savedCategories.indexOf(categoryName);
                if (index > -1) {
                    savedCategories.splice(index, 1);
                }
            } else {
                this.classList.add('favorite-category');
                if (!savedCategories.includes(categoryName)) {
                    savedCategories.push(categoryName);
                }
            }

            localStorage.setItem('favoriteCategories', JSON.stringify(savedCategories));
            console.log('Updated favorite categories:', savedCategories);
        });
    });
}

// Initialize Share Event Functionality
function initializeShareEvent() {
    const shareButtons = document.querySelectorAll('[data-share-event]');

    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const eventName = document.querySelector('h1')?.textContent || 'فعالية';
            const eventUrl = window.location.href;
            const shareText = `تحقق من هذه الفعالية: ${eventName}`;

            if (navigator.share) {
                navigator.share({
                    title: eventName,
                    text: shareText,
                    url: eventUrl
                }).then(() => {
                    console.log('Event shared successfully');
                }).catch(err => {
                    console.log('Share cancelled or failed', err);
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = eventUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                showNotification('تم نسخ رابط الفعالية!');
            }
        });
    });
}

// Initialize Add to Calendar Functionality
function initializeAddToCalendar() {
    const addCalendarButtons = document.querySelectorAll('[data-add-calendar]');

    addCalendarButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const eventName = document.querySelector('h1')?.textContent || 'فعالية';
            const eventDate = document.querySelector('.event-date')?.textContent || '';
            const eventLocation = document.querySelector('.event-location')?.textContent || '';

            const calendarEvents = JSON.parse(localStorage.getItem('calendarEvents')) || [];
            calendarEvents.push({
                name: eventName,
                date: eventDate,
                location: eventLocation,
                savedDate: new Date().toISOString()
            });
            localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));

            showNotification('تم إضافة الفعالية إلى التقويم!');
        });
    });
}

// Show temporary notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification-alert';
    notification.innerHTML = `
        <i class="bi bi-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}

// Share Event Function
function shareEvent() {
    const eventTitle = document.querySelector('h1') ? document.querySelector('h1').textContent : 'الفعالية';
    const eventUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'دليل الفعاليات',
            text: `تحقق من هذه الفعالية: ${eventTitle}`,
            url: eventUrl
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `${eventTitle}\n${eventUrl}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('تم نسخ رابط الفعالية إلى الحافظة!');
            });
        } else {
            alert(`رابط الفعالية:\n${eventUrl}`);
        }
    }
}

// Add to Calendar Function
function addToCalendar() {
    const eventTitle = document.querySelector('h1') ? document.querySelector('h1').textContent : 'الفعالية';
    const eventDate = document.querySelector('[data-event-date]') ? 
                      document.querySelector('[data-event-date]').getAttribute('data-event-date') : 
                      '28/04/2026';
    const eventLocation = 'صالة العرض الفني، شارع الفنون';
    
    // Create .ics file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//دليل الفعاليات//Events//AR
BEGIN:VEVENT
UID:event-${Date.now()}@eventguide.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, -5)}Z
DTSTART:20260428T150000Z
SUMMARY:${eventTitle}
LOCATION:${eventLocation}
DESCRIPTION:فعالية من دليل الفعاليات
END:VEVENT
END:VCALENDAR`;
    
    // Create blob and download
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${eventTitle}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    alert(`تم إضافة "${eventTitle}" إلى التقويم!`);
}

// Initialize Share Event
function initializeShareEvent() {
    const shareButtons = document.querySelectorAll('[onclick="shareEvent()"]');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', shareEvent);
    });
}

// Initialize Add to Calendar
function initializeAddToCalendar() {
    const calendarButtons = document.querySelectorAll('[onclick="addToCalendar()"]');
    calendarButtons.forEach(btn => {
        btn.addEventListener('click', addToCalendar);
    });
}

// Initialize all bonus features
function initializeBonusFeatures() {
    console.log('Initializing bonus features...');
    initializeScrollToTop();
    initializeDarkMode();
    initializeBookingModal();
    initializeCategoryPreferences();
    initializeShareEvent();
    initializeAddToCalendar();
    
    // Update total price when quantity changes
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const total = this.value * 50;
            const totalPriceSpan = document.getElementById('totalPrice');
            if (totalPriceSpan) {
                totalPriceSpan.textContent = total;
            }
        });
    }
    
    console.log('Bonus features initialized successfully');
}

