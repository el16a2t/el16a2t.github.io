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
});
// Admin mode functionality
document.addEventListener('DOMContentLoaded', function() {
    const adminTrigger = document.getElementById('admin-trigger');
    
    if (adminTrigger) {
        adminTrigger.addEventListener('click', function() {
            showAdminLoginModal();
        });
    }
});

// Function to show admin login modal
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

// Function to validate admin login
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

// Function to check if user is in admin mode
function isAdminMode() {
    return sessionStorage.getItem('adminMode') === 'active';
}
// Admin Controls for Projects Page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the projects page
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projectsGrid && isAdminMode()) {
        // Show admin mode indicator
        const adminIndicator = document.createElement('div');
        adminIndicator.className = 'admin-mode-indicator';
        adminIndicator.innerHTML = `
            <span>Admin Mode</span>
            <button id="admin-logout">Exit</button>
        `;
        document.body.appendChild(adminIndicator);
        
        // Add logout functionality
        document.getElementById('admin-logout').addEventListener('click', function() {
            sessionStorage.removeItem('adminMode');
            location.reload();
        });
        
        // Add "New Project" button
        const projectsHeader = document.querySelector('.projects-header');
        const newProjectBtn = document.createElement('button');
        newProjectBtn.className = 'btn btn-new-project';
        newProjectBtn.textContent = 'Add New Project';
        newProjectBtn.style.marginTop = '20px';
        projectsHeader.appendChild(newProjectBtn);
        
        // Add edit buttons to each project card
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const editBtn = document.createElement('button');
            editBtn.className = 'project-edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            card.appendChild(editBtn);
            
            // Add edit event listener
            editBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const projectLink = card.querySelector('a').getAttribute('href');
                const projectTitle = card.querySelector('.project-title').textContent;
                editProject(projectLink, projectTitle);
            });
        });
        
        // New Project button event listener
        newProjectBtn.addEventListener('click', function() {
            createNewProject();
        });
    }
});

// Function to show project edit form
function editProject(projectLink, projectTitle) {
    // Extract project ID from link (e.g., project1.html -> 1)
    const projectId = projectLink.replace('project', '').replace('.html', '');
    
    showProjectModal('edit', {
        id: projectId,
        title: projectTitle,
        // We'll need to fetch more details from the project page
    });
}

// Function to create new project
function createNewProject() {
    showProjectModal('new');
}

// Function to show project edit/create modal
function showProjectModal(mode, projectData = {}) {
    // Remove any existing modal
    const existingModal = document.getElementById('project-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'admin-modal';
    
    // Prepare modal content based on mode (edit or new)
    const title = mode === 'edit' ? 'Edit Project' : 'New Project';
    const submitBtnText = mode === 'edit' ? 'Update Project' : 'Create Project';
    
    modal.innerHTML = `
        <div class="admin-modal-content project-modal-content">
            <span class="admin-modal-close">&times;</span>
            <h3>${title}</h3>
            <form id="project-form" class="project-form">
                <div class="form-group">
                    <label for="project-title">Project Title</label>
                    <input type="text" id="project-title" class="form-input" value="${projectData.title || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="project-tags">Tags (comma separated)</label>
                    <input type="text" id="project-tags" class="form-input" value="${projectData.tags || ''}">
                </div>
                
                <div class="form-group">
                    <label for="project-image">Image URL</label>
                    <input type="text" id="project-image" class="form-input" value="${projectData.image || ''}">
                </div>
                
                <div class="form-group">
                    <label for="project-description">Short Description</label>
                    <textarea id="project-description" class="form-textarea">${projectData.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="project-content">Full Content (HTML)</label>
                    <textarea id="project-content" class="form-textarea" rows="10">${projectData.content || ''}</textarea>
                </div>
                
                <input type="hidden" id="project-id" value="${projectData.id || ''}">
                
                <button type="submit" class="submit-btn">${submitBtnText}</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener for close button
    const closeBtn = modal.querySelector('.admin-modal-close');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Add event listener for form submission
    const projectForm = document.getElementById('project-form');
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (mode === 'edit') {
            saveProjectChanges();
        } else {
            saveNewProject();
        }
    });
    
    // If editing, fetch project content
    if (mode === 'edit' && projectData.id) {
        // Here we would normally fetch the project content from a server
        // Since we're client-side only, we'll use placeholder data
        // In a real implementation, you'd load the project's HTML file
        
        // For demo purposes, we'll just show the form
    }
    
    // Show the modal
    modal.style.display = 'block';
}

// Add these styles to your CSS
function addProjectModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .project-modal-content {
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .project-form .form-group {
            margin-bottom: 20px;
        }
        
        .project-form .form-textarea {
            min-height: 120px;
        }
        
        .project-edit-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            opacity: 0.7;
            transition: var(--transition);
        }
        
        .project-edit-btn:hover {
            opacity: 1;
            transform: scale(1.1);
        }
        
        .btn-new-project {
            margin-left: auto;
            margin-right: auto;
            display: block;
        }
    `;
    document.head.appendChild(style);
}

// Call this function to add the styles
document.addEventListener('DOMContentLoaded', function() {
    addProjectModalStyles();
});
// Project data storage functions
function saveNewProject() {
    const projectTitle = document.getElementById('project-title').value;
    const projectTags = document.getElementById('project-tags').value;
    const projectImage = document.getElementById('project-image').value;
    const projectDescription = document.getElementById('project-description').value;
    const projectContent = document.getElementById('project-content').value;
    
    if (!projectTitle || !projectTags || !projectImage) {
        alert('Please fill out all required fields');
        return;
    }
    
    // Generate a new project ID
    const projects = getProjectsData();
    const newId = projects.length > 0 ? Math.max(...projects.map(p => parseInt(p.id))) + 1 : 1;
    
    // Create new project object
    const newProject = {
        id: newId.toString(),
        title: projectTitle,
        tags: projectTags,
        image: projectImage,
        description: projectDescription,
        content: projectContent,
        date: new Date().toISOString()
    };
    
    // Add to projects array
    projects.push(newProject);
    
    // Save to localStorage
    saveProjectsData(projects);
    
    // Generate HTML file for download
    generateProjectHTML(newProject);
    
    // Generate project card HTML
    const projectCardHTML = generateProjectCardHTML(newProject);
    
    // Close modal
    document.getElementById('project-modal').style.display = 'none';
    
    // Add to projects grid
    const projectsGrid = document.getElementById('projects-grid');
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = projectCardHTML;
    projectsGrid.appendChild(tempContainer.firstChild);
    
    // Show success message
    alert('Project created successfully! The HTML file for this project has been downloaded. Please upload it to your server.');
}

function saveProjectChanges() {
    const projectId = document.getElementById('project-id').value;
    const projectTitle = document.getElementById('project-title').value;
    const projectTags = document.getElementById('project-tags').value;
    const projectImage = document.getElementById('project-image').value;
    const projectDescription = document.getElementById('project-description').value;
    const projectContent = document.getElementById('project-content').value;
    
    if (!projectTitle || !projectTags || !projectImage) {
        alert('Please fill out all required fields');
        return;
    }
    
    // Get all projects
    const projects = getProjectsData();
    
    // Find the project to update
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex === -1) {
        alert('Project not found');
        return;
    }
    
    // Update project data
    projects[projectIndex] = {
        ...projects[projectIndex],
        title: projectTitle,
        tags: projectTags,
        image: projectImage,
        description: projectDescription,
        content: projectContent,
        updated: new Date().toISOString()
    };
    
    // Save to localStorage
    saveProjectsData(projects);
    
    // Generate updated HTML file for download
    generateProjectHTML(projects[projectIndex]);
    
    // Close modal
    document.getElementById('project-modal').style.display = 'none';
    
    // Show success message and reload
    alert('Project updated successfully! The HTML file for this project has been downloaded. Please upload it to your server.');
    location.reload();
}

function getProjectsData() {
    const projectsJson = localStorage.getItem('portfolioProjects');
    return projectsJson ? JSON.parse(projectsJson) : [];
}

function saveProjectsData(projects) {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

function generateProjectCardHTML(project) {
    // Convert tags string to data-tags attribute format
    const tagsList = project.tags.split(',').map(tag => tag.trim().toLowerCase()).join(',');
    
    return `
        <div class="project-card" data-tags="${tagsList}">
            <a href="project${project.id}.html">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-tags">${project.tags}</p>
                </div>
            </a>
            ${isAdminMode() ? '<button class="project-edit-btn"><i class="fas fa-edit"></i></button>' : ''}
        </div>
    `;
}

function generateProjectHTML(project) {
    // Create HTML content for a new project page based on existing template
    const projectHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.title} | Adam Thompson</title>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container header-inner">
            <div class="logo">
                <a href="home.html">Adam Thompson</a>
            </div>
            
            <button class="mobile-toggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
            
            <nav class="nav">
                <ul>
                    <li><a href="home.html">Home</a></li>
                    <li><a href="projects.html" class="active">Projects</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Project Content -->
    <section class="project-content" style="padding-top: 150px;">
        <div class="container">
            <h1 class="project-title">${project.title}</h1>
            <div class="project-meta">
                <div class="project-tags">${project.tags}</div>
            </div>
            
            <div class="project-main-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            
            <div class="project-description">
                ${project.description}
            </div>
            
            <div class="project-full-content">
                ${project.content}
            </div>
            
            <div class="project-nav">
                <a href="projects.html" class="btn">&larr; Back to Projects</a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-info">
                    <div class="footer-logo">Adam Thompson</div>
                    <p>Helping businesses transform their digital presence and achieve meaningful outcomes through strategic consulting and creative solutions.</p>
                    <div class="footer-social">
                        <a href="https://instagram.com/adamthompson" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="https://twitter.com/adamthompson" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="https://linkedin.com/in/adamthompson" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                    </div>
                </div>
                
                <div class="footer-nav">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="home.html">Home</a></li>
                        <li><a href="projects.html">Projects</a></li>
                        <li><a href="contact.html">Contact</a></li>
                        <li><a href="index.html">Landing Page</a></li>
                    </ul>
                </div>
                
                <div class="footer-nav">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="mailto:adam@adamthompson.me">adam@adamthompson.me</a></li>
                        <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
                        <li><a href="https://mycompany.com">My Business</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2025 Adam Thompson. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="js/main.js"></script>
</body>
</html>`;

    // Create a downloadable file
    const blob = new Blob([projectHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `project${project.id}.html`;
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
