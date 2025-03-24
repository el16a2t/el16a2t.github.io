/**
 * Adam Thompson Portfolio
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Projects filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter projects
                projectCards.forEach(card => {
                    const tags = card.getAttribute('data-tags');
                    
                    if (filter === 'all' || tags.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Projects search
    const searchInput = document.getElementById('project-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase().trim();
            
            projectCards.forEach(card => {
                const title = card.querySelector('.project-title').textContent.toLowerCase();
                const tags = card.getAttribute('data-tags').toLowerCase();
                
                if (title.includes(searchValue) || tags.includes(searchValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
    
    // Form validation
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // Here you would typically send the form data to a server
                // For demo purposes, we'll just show an alert
                alert('Thanks for your message! I\'ll get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill out all required fields.');
            }
        });
    }
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Project image hover effect
    const projectImages = document.querySelectorAll('.project-card .project-image');
    
    projectImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.05)';
        });
        
        image.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });
    
    // Add fade-in animation to elements when they come into view
    const animateElements = document.querySelectorAll('.project-section, .project-images, .hero-content, .hero-image, .about-content, .about-image');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to add 'visible' class to elements in viewport
    function checkVisibility() {
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    // Set initial styles for animation
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Add CSS rule for the 'visible' class
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Check element visibility on load and scroll
    window.addEventListener('load', checkVisibility);
    window.addEventListener('scroll', checkVisibility);
    
    // Admin mode trigger
    const adminTrigger = document.getElementById('admin-trigger');
    
    if (adminTrigger) {
        adminTrigger.addEventListener('click', function() {
            showAdminLoginModal();
        });
    }
});

// Admin functionality
function showAdminLoginModal() {
    // Create modal elements if they don't exist
    if (!document.getElementById('admin-modal')) {
        const modal = document.createElement('div');
        modal.id = 'admin-modal';
        modal.className = 'admin-modal';
        
        modal.innerHTML = `
            <div class="admin-modal-content">
                <span class="admin-modal-close">&times;</span>
                <h3>Admin Login</h3>
                <div class="admin-form">
                    <label for="admin-password">Password</label>
                    <input type="password" id="admin-password" class="admin-password">
                    <button id="admin-login-btn" class="admin-login-btn">Login</button>
                    <p id="admin-error" class="admin-error"></p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners for modal
        const closeBtn = document.querySelector('.admin-modal-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        const loginBtn = document.getElementById('admin-login-btn');
        loginBtn.addEventListener('click', function() {
            validateAdminLogin();
        });
        
        // Allow Enter key to submit
        const passwordInput = document.getElementById('admin-password');
        passwordInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                validateAdminLogin();
            }
        });
    }
    
    // Show the modal
    document.getElementById('admin-modal').style.display = 'block';
}

function validateAdminLogin() {
    const passwordInput = document.getElementById('admin-password');
    const errorMsg = document.getElementById('admin-error');
    
    // Simple password check - you should change 'adminpass' to your preferred password
    if (passwordInput.value === 'adminpass') {
        // Set admin session
        sessionStorage.setItem('adminMode', 'active');
        
        // Close modal
        document.getElementById('admin-modal').style.display = 'none';
        
        // Refresh to show admin controls
        location.reload();
    } else {
        errorMsg.textContent = 'Invalid password';
        passwordInput.value = '';
    }
}

function isAdminMode() {
    return sessionStorage.getItem('adminMode') === 'active';
}

// Data storage functions
function getProjectsData() {
    const projectsJson = localStorage.getItem('portfolioProjects');
    return projectsJson ? JSON.parse(projectsJson) : [];
}

function saveProjectsData(projects) {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}