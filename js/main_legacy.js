/**
 * Adam Thompson Portfolio
 * Main JavaScript
 */

// Constants for security
const SITE_SALT = 'adamthompson2025'; 
const ADMIN_HASH = 'cbd750afee7b079b3944e97c1782812d94fd9059f436d65a174072900c65a8c9';

// Utility Functions
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

function isAdminMode() {
    return sessionStorage.getItem('adminMode') === 'active';
}

function getProjectsData() {
    const projectsJson = localStorage.getItem('portfolioProjects');
    return projectsJson ? JSON.parse(projectsJson) : [];
}

function saveProjectsData(projects) {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

// Admin Functions
function validateAdminLogin() {
    const passwordInput = document.getElementById('admin-password');
    const errorMsg = document.getElementById('admin-error');
    
    // Hash the entered password with the salt
    const saltedPassword = passwordInput.value + SITE_SALT;
    const hashedInput = CryptoJS.SHA256(saltedPassword).toString();
    
    // Compare the hashed input with the stored hash
    if (hashedInput === ADMIN_HASH) {
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

function addAdminControls() {
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
    
    // Get projects header
    const projectsHeader = document.querySelector('.projects-header');
    if (!projectsHeader) {
        console.error('Projects header not found');
        return;
    }
    
    // Add "New Project" button
    const newProjectBtn = document.createElement('button');
    newProjectBtn.className = 'btn btn-new-project';
    newProjectBtn.textContent = 'Add New Project';
    newProjectBtn.style.marginTop = '20px';
    projectsHeader.appendChild(newProjectBtn);
    
    // Add "Export Projects" button with extra visibility
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-export-projects';
    exportBtn.textContent = 'Export Projects';
    exportBtn.style.marginTop = '20px';
    exportBtn.style.marginLeft = '10px';
    exportBtn.style.backgroundColor = '#ff5722'; // Bright orange
    exportBtn.style.color = 'white';
    exportBtn.style.fontWeight = 'bold';
    projectsHeader.appendChild(exportBtn);
    
    // New Project button event listener
    newProjectBtn.addEventListener('click', function() {
        showProjectModal('new');
    });
    
    // Export Projects button event listener
    exportBtn.addEventListener('click', function() {
        exportProjectsToJSON();
        alert('Projects exported! Upload the downloaded file to your GitHub repository.');
    });
    
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
            const projectId = card.getAttribute('data-id');
            editProject(projectId);
        });
    });
}

// Projects Management Functions
function createNewProject() {
    showProjectModal('new');
}

function editProject(projectId) {
    const projects = getProjectsData();
    const project = projects.find(p => p.id.toString() === projectId.toString());
    
    if (project) {
        showProjectModal('edit', project);
    } else {
        alert('Project not found');
    }
}

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
                    <input type="text" id="project-tags" class="form-input" value="${projectData.tags || ''}" required>
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
                
                <div class="form-actions">
                    <button type="submit" class="submit-btn">${submitBtnText}</button>
                    ${mode === 'edit' ? '<button type="button" id="delete-project-btn" class="delete-btn">Delete Project</button>' : ''}
                </div>
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
    
    // Add event listener for delete button if in edit mode
    if (mode === 'edit') {
        const deleteBtn = document.getElementById('delete-project-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
                deleteProject(projectData.id);
            }
        });
    }
    
    // Show the modal
    modal.style.display = 'block';
}

function saveNewProject() {
    const projectTitle = document.getElementById('project-title').value;
    const projectTags = document.getElementById('project-tags').value;
    const projectImage = document.getElementById('project-image').value;
    const projectDescription = document.getElementById('project-description').value;
    const projectContent = document.getElementById('project-content').value;
    
    if (!projectTitle || !projectTags) {
        alert('Please fill out all required fields');
        return;
    }
    
    // Get projects and generate a new ID
    const projects = getProjectsData();
    const newId = projects.length > 0 ? Math.max(...projects.map(p => parseInt(p.id))) + 1 : 1;
    
    // Create new project object
    const newProject = {
        id: newId.toString(),
        title: projectTitle,
        tags: projectTags,
        image: projectImage, // This is now optional
        description: projectDescription,
        content: projectContent,
        created: new Date().toISOString()
    };
    
    // Add to projects array
    projects.push(newProject);
    
    // Save to localStorage
    saveProjectsData(projects);
    
    // Close modal
    document.getElementById('project-modal').style.display = 'none';
    
    // Reload projects
    loadProjects();
    
    // Show success message
    alert('Project created successfully!');
}

function saveProjectChanges() {
    const projectId = document.getElementById('project-id').value;
    const projectTitle = document.getElementById('project-title').value;
    const projectTags = document.getElementById('project-tags').value;
    const projectImage = document.getElementById('project-image').value;
    const projectDescription = document.getElementById('project-description').value;
    const projectContent = document.getElementById('project-content').value;
    
    if (!projectTitle || !projectTags) {
        alert('Please fill out all required fields');
        return;
    }
    
    // Get all projects
    const projects = getProjectsData();
    
    // Find the project to update
    const projectIndex = projects.findIndex(p => p.id.toString() === projectId.toString());
    
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
    
    // Close modal
    document.getElementById('project-modal').style.display = 'none';
    
    // Reload projects
    loadProjects();
    
    // Show success message
    alert('Project updated successfully!');
}

function deleteProject(projectId) {
    // Get all projects
    const projects = getProjectsData();
    
    // Filter out the project to delete
    const updatedProjects = projects.filter(p => p.id.toString() !== projectId.toString());
    
    // Save to localStorage
    saveProjectsData(updatedProjects);
    
    // Close modal
    document.getElementById('project-modal').style.display = 'none';
    
    // Reload projects
    loadProjects();
    
    // Show success message
    alert('Project deleted successfully!');
}

function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;
    
    const projects = getProjectsData();
    
    // Clear the grid
    projectsGrid.innerHTML = '';
    
    // If no projects, show a message
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<div style="text-align: center; padding: 50px;">No projects found. Add your first project!</div>';
        return;
    }
    
    // Add each project to the grid
    projects.forEach(project => {
        // Convert tags string to data-tags attribute format
        const tagsList = project.tags.split(',').map(tag => tag.trim().toLowerCase()).join(',');
        
        const projectHTML = `
        <div class="project-card" data-tags="${tagsList}" data-id="${project.id}">
            <a href="javascript:void(0)" onclick="viewProject(${project.id})" class="project-link">
                <div class="project-image">
                <img src="${project.image || 'images/placeholder.jpg'}" alt="${project.title}">
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="project-tags-container">
                    ${project.tags.split(',').map(tag => 
                    `<span class="project-tag">${tag.trim()}</span>`
                    ).join('')}
                    </div>
                </div>
            </a>
            ${isAdminMode() ? '<button class="project-edit-btn"><i class="fas fa-edit"></i></button>' : ''}
        </div>
`;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = projectHTML;
        const projectCard = tempDiv.firstElementChild;
        
        // Add edit button event listener if in admin mode
        if (isAdminMode()) {
            const editBtn = projectCard.querySelector('.project-edit-btn');
            editBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                editProject(project.id);
            });
        }
        
        projectsGrid.appendChild(projectCard);
    });
    
    // Reinitialize project filters
    initializeFilters();
}

function viewProject(projectId) {
    const projects = getProjectsData();
    const project = projects.find(p => p.id.toString() === projectId.toString());
    
    if (!project) {
        alert('Project not found');
        return;
    }
    
    // Store current view in session
    sessionStorage.setItem('currentProject', JSON.stringify(project));
    
    // Navigate to project view page
    window.location.href = 'view-project.html';
}

function loadProjectDetails() {
    const projectJson = sessionStorage.getItem('currentProject');
    
    if (!projectJson) {
        window.location.href = 'projects.html';
        return;
    }
    
    const project = JSON.parse(projectJson);
    const container = document.getElementById('project-container');
    
    // Set page title
    document.title = `${project.title} | Adam Thompson`;
    
    // Populate project content
    container.innerHTML = `
    <h1 class="project-title">${project.title}</h1>
    <div class="project-meta">
        <div class="project-tags">
            ${project.tags.split(',').map(tag => 
                `<span class="project-tag">${tag.trim()}</span>`
            ).join('')}
        </div>
    </div>

    ${project.image ? `
    <div class="project-main-image">
        <img src="${project.image}" alt="${project.title}">
    </div>
    ` : ''}

    <div class="project-description">
        ${project.description || ''}
    </div>

    <div class="project-full-content">
        ${project.content || ''}
    </div>

    <div class="project-nav">
        <a href="projects.html" class="btn">&larr; Back to Projects</a>
    </div>
    `;
}

function exportProjectsToJSON() {
    const projects = getProjectsData();
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'projects.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function loadProjectsFromJSON(url) {
    fetch(url + '?t=' + new Date().getTime()) // Add cache-busting parameter
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Save fetched projects to localStorage
            saveProjectsData(data);
            // Reload projects display
            loadProjects();
        })
        .catch(error => {
            console.log('Error loading projects.json, falling back to localStorage:', error);
            // If fetch fails, just load from localStorage
            loadProjects();
        });
}

// Filter Functions
function initializeFilters() {
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
}

// Styling Functions
function addProjectModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .admin-modal {
            display: none;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            overflow-y: auto;
        }
        
        .admin-modal-content {
            background-color: white;
            margin: 5vh auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }

        .project-modal-content {
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .admin-modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 24px;
            cursor: pointer;
        }
        
        .admin-modal-content h3 {
            margin-bottom: 20px;
            font-family: 'Space Grotesk', sans-serif;
        }
        
        .admin-form label {
            display: block;
            margin-bottom: 10px;
            font-weight: 500;
        }
        
        .admin-password {
            width: 100%;
            padding: 12px;
            margin-bottom: 20px;
            border: 1px solid var(--medium-gray);
            font-size: 16px;
        }
        
        .admin-login-btn {
            background-color: var(--black);
            color: white;
            border: none;
            padding: 12px 20px;
            font-size: 16px;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .admin-login-btn:hover {
            opacity: 0.8;
        }
        
        .admin-error {
            color: #d32f2f;
            margin-top: 15px;
            font-size: 14px;
        }
        
        .admin-mode-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--black);
            color: white;
            padding: 8px 15px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 999;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .admin-mode-indicator button {
            background: none;
            border: none;
            color: white;
            text-decoration: underline;
            cursor: pointer;
            padding: 0;
            font-size: 14px;
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
        
        .form-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
        }
        
        .delete-btn {
            background-color: #d32f2f;
            color: white;
            border: none;
            padding: 12px 20px;
            font-size: 16px;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .delete-btn:hover {
            opacity: 0.8;
        }
        
        .submit-btn {
            position: sticky;
            bottom: 0;
            background-color: var(--black);
            margin-top: 20px;
        }
        
        .project-form {
            padding-bottom: 20px;
        }
        
        /* Tag styling */
        .project-tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }
        
        .project-tag {
            background-color: #f0f0f0;
            border-radius: 16px;
            padding: 4px 12px;
            font-size: 0.8rem;
            color: var(--dark-gray);
            transition: var(--transition);
        }
        
        .project-tag:hover {
            background-color: #e0e0e0;
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// Main Initialization - Single DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing site functionality");
    
    // Initialize basic site functionality
    initMobileMenu();
    initHeaderScroll();
    initProjectFiltering();
    initContactForm();
    initSmoothScroll();
    initProjectImageHover();
    initFadeAnimations();
    
    // Add styles
    addProjectModalStyles();
    
    // Initialize admin functionality
    initAdminFunctionality();
    
    // Initialize projects functionality
    initProjectsFunctionality();
});

// Site Functionality Initializers
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });
    }
}

function initHeaderScroll() {
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
}

function initProjectFiltering() {
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
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
                const title = card.querySelector('.project-title').textContent.toLowerCase();
                const tags = card.getAttribute('data-tags').toLowerCase();
                const description = card.querySelector('.project-description')
                    ? card.querySelector('.project-description').textContent.toLowerCase()
                    : '';
                
                if (title.includes(searchValue) || 
                    tags.includes(searchValue) || 
                    description.includes(searchValue)) {
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
}

function initContactForm() {
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
}

function initSmoothScroll() {
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
}

function initProjectImageHover() {
    const projectImages = document.querySelectorAll('.project-card .project-image');
    
    projectImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            if (this.querySelector('img')) {
                this.querySelector('img').style.transform = 'scale(1.05)';
            }
        });
        
        image.addEventListener('mouseleave', function() {
            if (this.querySelector('img')) {
                this.querySelector('img').style.transform = 'scale(1)';
            }
        });
    });
}

function initFadeAnimations() {
    const animateElements = document.querySelectorAll('.project-section, .project-images, .hero-content, .hero-image, .about-content, .about-image');
    
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
}

function initAdminFunctionality() {
    const adminTrigger = document.getElementById('admin-trigger');
    
    if (adminTrigger) {
        console.log("Admin trigger found, adding click handler");
        adminTrigger.addEventListener('click', function() {
            showAdminLoginModal();
        });
    }
    
    // Check if admin mode is active and we're on the projects page
    if (isAdminMode()) {
        console.log("Admin mode detected");
        const projectsGrid = document.getElementById('projects-grid');
        
        if (projectsGrid) {
            console.log("Projects grid found, adding admin controls");
            addAdminControls();
        }
    }
}

function initProjectsFunctionality() {
    // Check if we're on the projects page
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        console.log("Loading projects from JSON");
        // First try to load from the remote JSON file
        loadProjectsFromJSON('projects.json');
    }
    
    // Check if we're on the view-project page
    const projectContainer = document.getElementById('project-container');
    if (projectContainer) {
        console.log("Loading project details");
        loadProjectDetails();
    }
}