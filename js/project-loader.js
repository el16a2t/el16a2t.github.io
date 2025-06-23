// Handle dynamic project loading
document.addEventListener('DOMContentLoaded', function() {
    // Get the project ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    if (projectId) {
        loadProject(projectId);
    } else {
        // No project ID found
        showError('Project not found. Please check the URL.');
    }
});

// Load project data and render it
function loadProject(id) {
    // Get projects from localStorage
    const projects = getProjectsData();
    const project = projects.find(p => p.id.toString() === id.toString());
    
    if (project) {
        renderProject(project);
    } else {
        showError('Project not found. It may have been removed.');
    }
}

// Render project data on the page
function renderProject(project) {
    document.title = `${project.title} | Adam Thompson`;
    
    const container = document.getElementById('project-container');
    
    // Replace loading indicator with project content
    container.innerHTML = `
        <h1 class="project-title">${project.title}</h1>
        <div class="project-meta">
            <div class="project-tags">${project.tags}</div>
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

// Display error message
function showError(message) {
    const container = document.getElementById('project-container');
    container.innerHTML = `
        <div class="error-message">
            <h2>Oops!</h2>
            <p>${message}</p>
            <a href="projects.html" class="btn">Back to Projects</a>
        </div>
    `;
}

// Function to get projects data from localStorage
function getProjectsData() {
    const projectsJson = localStorage.getItem('portfolioProjects');
    return projectsJson ? JSON.parse(projectsJson) : [];
}