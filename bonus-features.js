// ========================================
// BONUS FEATURES - Organized Module
// ========================================

// ========================================
// 1. MODAL BOOKING SYSTEM
// ========================================
function initializeBookingModal() {
    const bookingButtons = document.querySelectorAll('[data-bs-target="#bookingModal"]');
    const modal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    const successAlert = document.getElementById('bookingSuccess');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('bookingName').value;
            const email = document.getElementById('bookingEmail').value;
            const tickets = document.getElementById('bookingTickets').value;
            const eventName = document.getElementById('eventNameHidden').value;
            
            if (name && email && tickets) {
                // Save booking data
                const booking = {
                    name: name,
                    email: email,
                    tickets: tickets,
                    event: eventName,
                    date: new Date().toLocaleString('ar-SA')
                };
                
                // Save to localStorage
                let bookings = JSON.parse(localStorage.getItem('eventBookings')) || [];
                bookings.push(booking);
                localStorage.setItem('eventBookings', JSON.stringify(bookings));
                
                // Show success message
                successAlert.style.display = 'block';
                
                // Reset form
                this.reset();
                
                // Hide modal after delay
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

// ========================================
// 2. SCROLL-TO-TOP BUTTON
// ========================================
function initializeScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        // Scroll to top on click
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// 3. DARK MODE TOGGLE
// ========================================
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    
    if (darkModeToggle) {
        // Load dark mode preference from localStorage
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        
        if (isDarkMode) {
            enableDarkMode();
            darkModeToggle.checked = true;
        }

        // Handle toggle change
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

// ========================================
// 4. SAVE CATEGORY PREFERENCES TO localStorage
// ========================================
function initializeCategoryPreferences() {
    const categoryBadges = document.querySelectorAll('.category-badge');
    
    // Load saved preferences
    const savedCategories = JSON.parse(localStorage.getItem('favoriteCategories')) || [];
    
    categoryBadges.forEach(badge => {
        const category = badge.querySelector('span').textContent.trim();
        
        // Mark as favorite if in saved list
        if (savedCategories.includes(category)) {
            badge.classList.add('favorite-category');
        }

        // Toggle favorite on click (with modifier key)
        badge.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const categoryName = this.querySelector('span').textContent.trim();
            
            if (this.classList.contains('favorite-category')) {
                // Remove from favorites
                this.classList.remove('favorite-category');
                const index = savedCategories.indexOf(categoryName);
                if (index > -1) {
                    savedCategories.splice(index, 1);
                }
            } else {
                // Add to favorites
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

// ========================================
// 5. SHARE EVENT FUNCTIONALITY
// ========================================
function initializeShareEvent() {
    const shareButtons = document.querySelectorAll('[data-share-event]');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const eventName = document.querySelector('h1')?.textContent || 'فعالية';
            const eventUrl = window.location.href;
            const shareText = `تحقق من هذه الفعالية: ${eventName}`;
            
            if (navigator.share) {
                // Native share API
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
                // Fallback: Copy to clipboard
                const textArea = document.createElement('textarea');
                textArea.value = eventUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Show copy notification
                showNotification('تم نسخ رابط الفعالية!');
            }
        });
    });
}

// ========================================
// 6. ADD TO CALENDAR FUNCTIONALITY
// ========================================
function initializeAddToCalendar() {
    const addCalendarButtons = document.querySelectorAll('[data-add-calendar]');
    
    addCalendarButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const eventName = document.querySelector('h1')?.textContent || 'فعالية';
            const eventDate = document.querySelector('.event-date')?.textContent || '';
            const eventLocation = document.querySelector('.event-location')?.textContent || '';
            
            // Create calendar event text
            const calendarText = `${eventName}\n${eventDate}\n${eventLocation}`;
            
            // Save to localStorage
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

// ========================================
// UTILITY FUNCTIONS
// ========================================

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

// Initialize all bonus features
function initializeBonusFeatures() {
    console.log('Initializing bonus features...');
    
    initializeScrollToTop();
    initializeDarkMode();
    initializeBookingModal();
    initializeCategoryPreferences();
    initializeShareEvent();
    initializeAddToCalendar();
    
    console.log('Bonus features initialized successfully');
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initializeBonusFeatures);
