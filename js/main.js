/**
 * Adam Thompson Portfolio
 * Main JavaScript - Updated for Dark Theme with Ramblings
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

// New functions for Ramblings
function getRamblingsData() {
    const ramblingsJson = localStorage.getItem('portfolioRamblings');
    return ramblingsJson ? JSON.parse(ramblingsJson) : [];
}

function saveRamblingsData(ramblings) {
    localStorage.setItem('portfolioRamblings', JSON.stringify(ramblings));
}

// Determine current page type
function getCurrentPageType() {
    const path = window.location.pathname;
    if (path.includes('ramblings')) return 'ramblings';
    if (path.includes('projects')) return 'projects';
    return null;
}

// Generic data functions that work for both projects and ramblings
function getItemsData(type) {
    return type === 'ramblings' ? getRamblingsData() : getProjectsData();
}

function saveItemsData(items, type) {
    if (type === 'ramblings') {
        saveRamblingsData(items);
    } else {
        saveProjectsData(items);
    }
}

// Admin Functions
function validateAdminLogin() {
    const passwordInput = document.getElementById('admin-password');
    const errorMsg = document.getElementById('admin-error');
    
    const saltedPassword = passwordInput.value + SITE_SALT;
    const hashedInput = CryptoJS.SHA256(saltedPassword).toString();
    
    if (hashedInput === ADMIN_HASH) {
        sessionStorage.setItem('adminMode', 'active');
        document.getElementById('admin-modal').style.display = 'none';
        location.reload();
    } else {
        errorMsg.textContent = 'Invalid password';
        passwordInput.value = '';
    }
}

function showAdminLoginModal() {
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
                    <input type="password" id="admin-password" class="form-input admin-password">
                    <button id="admin-login-btn" class="submit-btn admin-login-btn">Login</button>
                    <p id="admin-error" class="admin-error"></p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = document.querySelector('.admin-modal-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        const loginBtn = document.getElementById('admin-login-btn');
        loginBtn.addEventListener('click', validateAdminLogin);
        
        const passwordInput = document.getElementById('admin-password');
        passwordInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                validateAdminLogin();
            }
        });
    }
    
    document.getElementById('admin-modal').style.display = 'block';
}

function addAdminControls() {
    const pageType = getCurrentPageType();
    if (!pageType) return;
    
    // Show admin mode indicator
    const adminIndicator = document.createElement('div');
    adminIndicator.className = 'admin-mode-indicator';
    adminIndicator.innerHTML = `
        <span>Admin Mode</span>
        <button id="admin-logout">Exit</button>
    `;
    document.body.appendChild(adminIndicator);
    
    document.getElementById('admin-logout').addEventListener('click', function() {
        sessionStorage.removeItem('adminMode');
        location.reload();
    });
    
    // Add export button for both projects and ramblings
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn btn-export-items';
    exportBtn.textContent = `Export ${pageType === 'ramblings' ? 'Ramblings' : 'Projects'}`;
    exportBtn.style.marginTop = '20px';
    exportBtn.style.marginLeft = '10px';
    exportBtn.style.backgroundColor = '#ff5722';
    exportBtn.style.color = 'white';
    exportBtn.style.fontWeight = 'bold';
    
    // Get page header based on page type
    const pageHeader = document.querySelector('.page-header');
    if (!pageHeader) return;
    
    // Add "New Item" button
    const newItemBtn = document.createElement('button');
    newItemBtn.className = 'btn btn-new-item';
    newItemBtn.textContent = pageType === 'ramblings' ? 'Add New Post' : 'Add New Project';
    newItemBtn.style.marginTop = '20px';
    pageHeader.appendChild(newItemBtn);
    pageHeader.appendChild(exportBtn);
    
    newItemBtn.addEventListener('click', function() {
        showItemModal('new', {}, pageType);
    });
    
    exportBtn.addEventListener('click', function() {
        exportItemsToJSON(pageType);
        alert(`${pageType === 'ramblings' ? 'Ramblings' : 'Projects'} exported! Upload the downloaded file to your GitHub repository.`);
    });
    
    // Add edit buttons to each item card
    const itemCards = document.querySelectorAll('.item-card');
    itemCards.forEach(card => {
        const editBtn = document.createElement('button');
        editBtn.className = 'item-edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        card.appendChild(editBtn);
        
        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const itemId = card.getAttribute('data-id');
            editItem(itemId, pageType);
        });
    });
}

// Item Management Functions (works for both projects and ramblings)
function editItem(itemId, type) {
    const items = getItemsData(type);
    const item = items.find(i => i.id.toString() === itemId.toString());
    
    if (item) {
        showItemModal('edit', item, type);
    } else {
        alert(`${type === 'ramblings' ? 'Post' : 'Project'} not found`);
    }
}

function showItemModal(mode, itemData = {}, type) {
    const existingModal = document.getElementById('item-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'item-modal';
    modal.className = 'admin-modal';
    
    const title = mode === 'edit' 
        ? `Edit ${type === 'ramblings' ? 'Post' : 'Project'}` 
        : `New ${type === 'ramblings' ? 'Post' : 'Project'}`;
    const submitBtnText = mode === 'edit' 
        ? `Update ${type === 'ramblings' ? 'Post' : 'Project'}` 
        : `Create ${type === 'ramblings' ? 'Post' : 'Project'}`;
    
    modal.innerHTML = `
        <div class="admin-modal-content project-modal-content">
            <span class="admin-modal-close">&times;</span>
            <h3>${title}</h3>
            <form id="item-form" class="project-form">
                <div class="form-group">
                    <label for="item-title">${type === 'ramblings' ? 'Post' : 'Project'} Title</label>
                    <input type="text" id="item-title" class="form-input" value="${itemData.title || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="item-tags">Tags (comma separated)</label>
                    <input type="text" id="item-tags" class="form-input" value="${itemData.tags || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="item-image">Image URL</label>
                    <input type="text" id="item-image" class="form-input" value="${itemData.image || ''}">
                </div>
                
                <div class="form-group">
                    <label for="item-description">Short Description</label>
                    <textarea id="item-description" class="form-textarea">${itemData.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label for="item-content">Full Content (HTML)</label>
                    <textarea id="item-content" class="form-textarea" rows="10">${itemData.content || ''}</textarea>
                </div>
                
                <input type="hidden" id="item-id" value="${itemData.id || ''}">
                <input type="hidden" id="item-type" value="${type}">
                
                <div class="form-actions">
                    <button type="submit" class="submit-btn">${submitBtnText}</button>
                    ${mode === 'edit' ? '<button type="button" id="delete-item-btn" class="delete-btn">Delete</button>' : ''}
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.admin-modal-close');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    const itemForm = document.getElementById('item-form');
    itemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (mode === 'edit') {
            saveItemChanges();
        } else {
            saveNewItem();
        }
    });
    
    if (mode === 'edit') {
        const deleteBtn = document.getElementById('delete-item-btn');
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm(`Are you sure you want to delete this ${type === 'ramblings' ? 'post' : 'project'}? This cannot be undone.`)) {
                deleteItem(itemData.id, type);
            }
        });
    }
    
    modal.style.display = 'block';
}

function saveNewItem() {
    const itemTitle = document.getElementById('item-title').value;
    const itemTags = document.getElementById('item-tags').value;
    const itemImage = document.getElementById('item-image').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemContent = document.getElementById('item-content').value;
    const itemType = document.getElementById('item-type').value;
    
    if (!itemTitle || !itemTags) {
        alert('Please fill out all required fields');
        return;
    }
    
    const items = getItemsData(itemType);
    const newId = items.length > 0 ? Math.max(...items.map(i => parseInt(i.id))) + 1 : 1;
    
    const newItem = {
        id: newId.toString(),
        title: itemTitle,
        tags: itemTags,
        image: itemImage,
        description: itemDescription,
        content: itemContent,
        created: new Date().toISOString()
    };
    
    items.push(newItem);
    saveItemsData(items, itemType);
    
    document.getElementById('item-modal').style.display = 'none';
    loadItems(itemType);
    
    alert(`${itemType === 'ramblings' ? 'Post' : 'Project'} created successfully!`);
}

function saveItemChanges() {
    const itemId = document.getElementById('item-id').value;
    const itemTitle = document.getElementById('item-title').value;
    const itemTags = document.getElementById('item-tags').value;
    const itemImage = document.getElementById('item-image').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemContent = document.getElementById('item-content').value;
    const itemType = document.getElementById('item-type').value;
    
    if (!itemTitle || !itemTags) {
        alert('Please fill out all required fields');
        return;
    }
    
    const items = getItemsData(itemType);
    const itemIndex = items.findIndex(i => i.id.toString() === itemId.toString());
    
    if (itemIndex === -1) {
        alert(`${itemType === 'ramblings' ? 'Post' : 'Project'} not found`);
        return;
    }
    
    items[itemIndex] = {
        ...items[itemIndex],
        title: itemTitle,
        tags: itemTags,
        image: itemImage,
        description: itemDescription,
        content: itemContent,
        updated: new Date().toISOString()
    };
    
    saveItemsData(items, itemType);
    document.getElementById('item-modal').style.display = 'none';
    loadItems(itemType);
    
    alert(`${itemType === 'ramblings' ? 'Post' : 'Project'} updated successfully!`);
}

function deleteItem(itemId, type) {
    const items = getItemsData(type);
    const updatedItems = items.filter(i => i.id.toString() !== itemId.toString());
    
    saveItemsData(updatedItems, type);
    document.getElementById('item-modal').style.display = 'none';
    loadItems(type);
    
    alert(`${type === 'ramblings' ? 'Post' : 'Project'} deleted successfully!`);
}

function loadItems(type) {
    const gridId = type === 'ramblings' ? 'ramblings-grid' : 'projects-grid';
    const itemsGrid = document.getElementById(gridId);
    if (!itemsGrid) return;
    
    const items = getItemsData(type);
    
    itemsGrid.innerHTML = '';
    
    if (items.length === 0) {
        itemsGrid.innerHTML = `<div class="no-items">No ${type === 'ramblings' ? 'posts' : 'projects'} found. Add your first one!</div>`;
        return;
    }
    
    items.forEach(item => {
        const tagsList = item.tags.split(',').map(tag => tag.trim().toLowerCase()).join(',');
        
        const itemHTML = `
            <div class="item-card" data-tags="${tagsList}" data-id="${item.id}">
                <a href="javascript:void(0)" onclick="viewItem(${item.id}, '${type}')" class="item-link">
                    <div class="item-thumbnail">
                        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : `[${type === 'ramblings' ? 'Post' : 'Project'} Image]`}
                    </div>
                    <div class="item-info">
                        <h3 class="item-title">${item.title}</h3>
                        <div class="item-tags">
                            ${item.tags.split(',').map(tag => 
                                `<span class="tag">${tag.trim()}</span>`
                            ).join('')}
                        </div>
                    </div>
                </a>
                ${isAdminMode() ? '<button class="item-edit-btn"><i class="fas fa-edit"></i></button>' : ''}
            </div>
        `;
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = itemHTML;
        const itemCard = tempDiv.firstElementChild;
        
        if (isAdminMode()) {
            const editBtn = itemCard.querySelector('.item-edit-btn');
            editBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                editItem(item.id, type);
            });
        }
        
        itemsGrid.appendChild(itemCard);
    });
    
    initializeFilters(type);
}

function viewItem(itemId, type) {
    const items = getItemsData(type);
    const item = items.find(i => i.id.toString() === itemId.toString());
    
    if (!item) {
        alert(`${type === 'ramblings' ? 'Post' : 'Project'} not found`);
        return;
    }
    
    sessionStorage.setItem('currentItem', JSON.stringify({...item, type}));
    window.location.href = `view-${type === 'ramblings' ? 'post' : 'project'}.html`;
}

function loadItemDetails() {
    const itemJson = sessionStorage.getItem('currentItem');
    
    if (!itemJson) {
        window.location.href = 'home.html';
        return;
    }
    
    const item = JSON.parse(itemJson);
    const container = document.getElementById('project-container');
    
    document.title = `${item.title} | Adam Thompson`;
    
    container.innerHTML = `
        <div class="detail-header">
            <h1 class="detail-title">${item.title}</h1>
            <div class="detail-meta">
                <span>Published ${new Date(item.created).toLocaleDateString()}</span>
                ${item.updated ? `<span>Updated ${new Date(item.updated).toLocaleDateString()}</span>` : ''}
            </div>
            <div class="detail-tags">
                ${item.tags.split(',').map(tag => 
                    `<span class="tag">${tag.trim()}</span>`
                ).join('')}
            </div>
        </div>

        ${item.image ? `
        <div class="detail-image">
            <img src="${item.image}" alt="${item.title}">
        </div>
        ` : ''}

        <div class="detail-content">
            ${item.description ? `<p class="detail-description">${item.description}</p>` : ''}
            ${item.content || ''}
        </div>

        <div class="detail-nav">
            <a href="${item.type === 'ramblings' ? 'ramblings' : 'projects'}.html" class="btn">&larr; Back to ${item.type === 'ramblings' ? 'Posts' : 'Projects'}</a>
        </div>
    `;
}

function exportItemsToJSON(type) {
    const items = getItemsData(type);
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${type}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function loadItemsFromJSON(url, type) {
    fetch(url + '?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            saveItemsData(data, type);
            loadItems(type);
        })
        .catch(error => {
            console.log(`Error loading ${type}.json, falling back to localStorage:`, error);
            loadItems(type);
        });
}

// Filter Functions
function initializeFilters(type) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const itemCards = document.querySelectorAll('.item-card');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                itemCards.forEach(card => {
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

// Search Functions
function initializeSearch(type) {
    const searchId = type === 'ramblings' ? 'rambling-search' : 'project-search';
    const searchInput = document.getElementById(searchId);
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchValue = this.value.toLowerCase().trim();
            const itemCards = document.querySelectorAll('.item-card');
            
            itemCards.forEach(card => {
                const title = card.querySelector('.item-title').textContent.toLowerCase();
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
}

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

function initFadeAnimations() {
    const animateElements = document.querySelectorAll('.project-section, .project-images, .hero-content, .hero-image, .about-content, .about-image');
    
    function checkVisibility() {
        animateElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('load', checkVisibility);
    window.addEventListener('scroll', checkVisibility);
}

function initAdminFunctionality() {
    const adminTrigger = document.getElementById('admin-trigger');
    
    if (adminTrigger) {
        adminTrigger.addEventListener('click', function() {
            showAdminLoginModal();
        });
    }
    
    if (isAdminMode()) {
        const pageType = getCurrentPageType();
        if (pageType) {
            addAdminControls();
        }
    }
}

function initPageFunctionality() {
    const pageType = getCurrentPageType();
    
    if (pageType) {
        // Load items from JSON or localStorage
        loadItemsFromJSON(`${pageType}.json`, pageType);
        
        // Initialize search
        initializeSearch(pageType);
    }
    
    // Check if we're on a detail page
    const projectContainer = document.getElementById('project-container');
    if (projectContainer) {
        loadItemDetails();
    }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize basic site functionality
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initFadeAnimations();
    
    // Initialize admin functionality
    initAdminFunctionality();
    
    // Initialize page-specific functionality
    initPageFunctionality();
});

// Export functions for inline onclick handlers
window.viewItem = viewItem;