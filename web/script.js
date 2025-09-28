// Add CSS to hide notifications immediately
const style = document.createElement('style');
style.textContent = `
    .notification, [class*="notification"], [class*="alert"], [class*="banner"], [class*="success"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
        z-index: -9999 !important;
    }
    div[style*="position: fixed"][style*="top: 20px"][style*="right: 20px"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
    }
`;
document.head.appendChild(style);

// Override common notification functions
(function() {
    // Override showNotification if it exists
    if (window.showNotification) {
        window.showNotification = function() {
            console.log('showNotification called but blocked');
        };
    }
    
    // Override any admin panel notification
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification = function() {
            console.log('adminPanel.showNotification called but blocked');
        };
    }
    
    // Override syncFromGoogleSheets to prevent notifications
    window.syncFromGoogleSheets = async function() {
        console.log('syncFromGoogleSheets called but notifications are disabled');
        // Don't do anything to avoid notifications
    };
    
    // Override startAutoSync to prevent notifications
    window.startAutoSync = function() {
        console.log('startAutoSync called but notifications are disabled');
        // Don't do anything to avoid notifications
    };
    
    // Override document.createElement to block notification creation
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(this, tagName);
        
        if (tagName.toLowerCase() === 'div') {
            const originalAppendChild = element.appendChild;
            element.appendChild = function(child) {
                if (child && child.textContent && 
                    (child.textContent.includes('Dữ liệu đã được cập nhật từ Google Sheets!') ||
                     child.textContent.includes('cập nhật') ||
                     child.textContent.includes('Google Sheets'))) {
                    console.log('Blocked notification creation:', child);
                    return child;
                }
                return originalAppendChild.call(this, child);
            };
        }
        
        return element;
    };
})();

// Main script for website functionality
document.addEventListener('DOMContentLoaded', function() {
    // Clear any existing notifications first
    clearAllNotifications();
    
    // Load and display websites data
    loadWebsitesData();
    
    // Setup search functionality
    setupSearch();
    
    // Setup view toggle
    setupViewToggle();
    
    // Setup stats
    updateStats();
    
    // Set up periodic notification clearing
    setInterval(clearAllNotifications, 1000);
    
    // Clear notifications when window gains focus
    window.addEventListener('focus', clearAllNotifications);
    
    // Set up automatic sync every 30 minutes
    setupAutoSync();
    
    // Force clear notifications immediately and repeatedly
    clearAllNotifications();
    setTimeout(clearAllNotifications, 100);
    setTimeout(clearAllNotifications, 500);
    setTimeout(clearAllNotifications, 1000);
    
    // Set up MutationObserver to watch for new notifications
    setupNotificationWatcher();
    
    // Override DOM methods to prevent notification creation
    overrideDOMMethods();
});

// Function to clear all notifications
function clearAllNotifications() {
    // Remove specific notification with exact text
    const specificText = 'Dữ liệu đã được cập nhật từ Google Sheets!';
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.textContent.includes(specificText)) {
            el.remove();
        }
    });
    
    // Remove all notification elements with more specific selectors
    const notificationSelectors = [
        '.notification',
        '[class*="notification"]',
        '[class*="alert"]',
        '[class*="banner"]',
        '[class*="success"]',
        '[class*="toast"]',
        '[class*="popup"]',
        'div[style*="position: fixed"]',
        'div[style*="top: 20px"]',
        'div[style*="right: 20px"]',
        'div[style*="z-index"]'
    ];
    
    notificationSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const text = el.textContent.toLowerCase();
            if (text.includes('cập nhật') || text.includes('google sheets') || 
                text.includes('dữ liệu') || text.includes('thành công') ||
                text.includes('success') || text.includes('updated')) {
                el.remove();
            }
        });
    });
    
    // Force remove any elements with specific text content
    allElements.forEach(el => {
        const text = el.textContent.toLowerCase();
        if ((text.includes('cập nhật') && text.includes('google sheets')) || 
            text.includes('dữ liệu đã được cập nhật') ||
            text.includes('data has been updated') ||
            (text.includes('thành công') && text.includes('cập nhật'))) {
            el.remove();
        }
    });
    
    // Clear any notification-related data from localStorage
    const keysToRemove = ['lastSyncTime', 'syncStatus', 'notification', 'alert', 'banner'];
    keysToRemove.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
        }
    });
}

// Set up MutationObserver to watch for new notifications
function setupNotificationWatcher() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a notification element
                        if (node.classList && (
                            node.classList.contains('notification') ||
                            node.classList.contains('success') ||
                            node.textContent.includes('Dữ liệu đã được cập nhật từ Google Sheets!') ||
                            node.textContent.includes('cập nhật') ||
                            node.textContent.includes('Google Sheets')
                        )) {
                            console.log('Notification detected, removing:', node);
                            node.remove();
                        }
                        
                        // Check child elements too
                        const notificationElements = node.querySelectorAll('.notification, [class*="notification"], [class*="success"]');
                        notificationElements.forEach(el => {
                            if (el.textContent.includes('cập nhật') || el.textContent.includes('Google Sheets')) {
                                console.log('Child notification detected, removing:', el);
                                el.remove();
                            }
                        });
                    }
                });
            }
        });
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Override DOM methods to prevent notification creation
function overrideDOMMethods() {
    // Override appendChild
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(child) {
        if (child && child.nodeType === 1) { // Element node
            if (child.classList && (
                child.classList.contains('notification') ||
                child.classList.contains('success') ||
                child.textContent.includes('Dữ liệu đã được cập nhật từ Google Sheets!') ||
                child.textContent.includes('cập nhật') ||
                child.textContent.includes('Google Sheets')
            )) {
                console.log('Blocked notification appendChild:', child);
                return child;
            }
        }
        return originalAppendChild.call(this, child);
    };
    
    // Override insertBefore
    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function(newNode, referenceNode) {
        if (newNode && newNode.nodeType === 1) { // Element node
            if (newNode.classList && (
                newNode.classList.contains('notification') ||
                newNode.classList.contains('success') ||
                newNode.textContent.includes('Dữ liệu đã được cập nhật từ Google Sheets!') ||
                newNode.textContent.includes('cập nhật') ||
                newNode.textContent.includes('Google Sheets')
            )) {
                console.log('Blocked notification insertBefore:', newNode);
                return newNode;
            }
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
    };
    
    // Override innerHTML setter
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    Object.defineProperty(Element.prototype, 'innerHTML', {
        set: function(value) {
            if (value && (
                value.includes('Dữ liệu đã được cập nhật từ Google Sheets!') ||
                value.includes('cập nhật') ||
                value.includes('Google Sheets') ||
                value.includes('notification') ||
                value.includes('success')
            )) {
                console.log('Blocked notification innerHTML:', value);
                return;
            }
            originalInnerHTML.set.call(this, value);
        },
        get: originalInnerHTML.get
    });
}

// Load websites data from localStorage
function loadWebsitesData() {
    const savedData = localStorage.getItem('websitesData');
    let websites = [];
    
    if (savedData) {
        try {
            websites = JSON.parse(savedData);
        } catch (error) {
            console.error('Error parsing websites data:', error);
            websites = getDefaultWebsites();
        }
    } else {
        websites = getDefaultWebsites();
        localStorage.setItem('websitesData', JSON.stringify(websites));
    }
    
    renderWebsites(websites);
    return websites;
}

// Get default websites data
function getDefaultWebsites() {
    return [
        {
            id: 1,
            category: "XE MÁY",
            demo: "https://mau01.webdep.xyz/",
            password: "765426",
            official: "https://xemay365.com.vn/",
            isNew: false
        },
        {
            id: 2,
            category: "KIM TUYẾN",
            demo: "https://mau02.webdep.xyz/",
            password: "876542",
            official: "https://dodo-glitter.com/",
            isNew: false
        },
        {
            id: 3,
            category: "ĐÈN TRẦN XUYÊN SÁNG",
            demo: "https://mau03.webdep.xyz/",
            password: "476654",
            official: "https://dentranxuyensang.com/",
            isNew: false
        },
        {
            id: 4,
            category: "MỸ PHẨM (NEW)",
            demo: "https://mau05.webdep.xyz/",
            password: "888542",
            official: "https://scentlabo.vn/",
            isNew: true
        },
        {
            id: 5,
            category: "NỒI HƠI - MÁY MÓC (NEW)",
            demo: "https://mau06.webdep.xyz/",
            password: "091098",
            official: "https://tounshingkai.com.vn/vi/",
            isNew: true
        }
    ];
}

// Render websites to the grid
function renderWebsites(websites) {
    const grid = document.getElementById('websitesGrid');
    if (!grid) return;
    
    grid.innerHTML = websites.map(website => `
        <div class="website-card ${website.isNew ? 'new' : ''}" data-category="${website.category}">
            <div class="website-header">
                <h3>${website.category}</h3>
                ${website.isNew ? '<span class="new-badge">Mới</span>' : ''}
            </div>
            <div class="website-actions">
                <button class="btn btn-primary" onclick="openWebsiteModal(${website.id})">
                    <i class="fas fa-eye"></i>
                    Xem chi tiết
                </button>
            </div>
        </div>
    `).join('');
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.website-card');
        
        cards.forEach(card => {
            const category = card.querySelector('h3').textContent.toLowerCase();
            if (category.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Setup view toggle
function setupViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const grid = document.getElementById('websitesGrid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Toggle view
            const view = this.dataset.view;
            if (view === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });
}

// Update statistics
function updateStats() {
    const websites = loadWebsitesData();
    const totalWebsites = document.getElementById('totalWebsites');
    const newWebsites = document.getElementById('newWebsites');
    
    if (totalWebsites) {
        totalWebsites.textContent = websites.length;
    }
    
    if (newWebsites) {
        const newCount = websites.filter(w => w.isNew).length;
        newWebsites.textContent = newCount;
    }
}

// Open website modal
function openWebsiteModal(websiteId) {
    const websites = loadWebsitesData();
    const website = websites.find(w => w.id === websiteId);
    
    if (!website) return;
    
    const modal = document.getElementById('websiteModal');
    if (!modal) return;
    
    // Fill modal content
    document.getElementById('modalTitle').textContent = website.category;
    document.getElementById('modalCategory').textContent = website.category;
    document.getElementById('modalDemoLink').href = website.demo;
    document.getElementById('modalPassword').value = website.password || '';
    
    // Show/hide password section
    const passwordSection = document.getElementById('passwordSection');
    if (website.password) {
        passwordSection.style.display = 'block';
    } else {
        passwordSection.style.display = 'none';
    }
    
    // Show/hide official website section
    const officialSection = document.getElementById('officialSection');
    if (website.official) {
        officialSection.style.display = 'block';
        document.getElementById('modalOfficialLink').href = website.official.startsWith('http') ? website.official : 'https://' + website.official;
    } else {
        officialSection.style.display = 'none';
    }
    
    // Show modal
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('websiteModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('modalPassword');
    const toggleBtn = document.getElementById('togglePassword');
    const icon = toggleBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Copy password to clipboard
function copyPassword() {
    const passwordInput = document.getElementById('modalPassword');
    passwordInput.select();
    document.execCommand('copy');
    
    // Show brief feedback
    const copyBtn = document.getElementById('copyPassword');
    const originalHTML = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
    }, 1000);
}

// Filter by type
function filterByType(type) {
    const cards = document.querySelectorAll('.website-card');
    
    cards.forEach(card => {
        if (type === 'all') {
            card.style.display = 'block';
        } else if (type === 'new') {
            if (card.classList.contains('new')) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Setup automatic sync every 30 minutes
function setupAutoSync() {
    // Check if auto sync is enabled (default: true)
    const autoSyncEnabled = localStorage.getItem('autoSyncEnabled') !== 'false';
    
    if (autoSyncEnabled) {
        // Set up interval for 30 minutes (30 * 60 * 1000 ms)
        setInterval(() => {
            console.log('Auto sync triggered at:', new Date().toLocaleTimeString());
            syncFromGoogleSheets();
        }, 30 * 60 * 1000);
        
        // Also sync immediately if it's been more than 30 minutes since last sync
        const lastSync = localStorage.getItem('lastSyncTime');
        if (!lastSync) {
            // First time, sync immediately
            syncFromGoogleSheets();
        } else {
            const lastSyncTime = new Date(lastSync);
            const now = new Date();
            const timeDiff = now - lastSyncTime;
            const thirtyMinutes = 30 * 60 * 1000;
            
            if (timeDiff > thirtyMinutes) {
                console.log('Last sync was more than 30 minutes ago, syncing now...');
                syncFromGoogleSheets();
            }
        }
    }
}

// Toggle auto sync on/off
function toggleAutoSync() {
    const currentStatus = localStorage.getItem('autoSyncEnabled') !== 'false';
    const newStatus = !currentStatus;
    localStorage.setItem('autoSyncEnabled', newStatus.toString());
    
    // Update UI
    updateStats();
    
    console.log('Auto sync', newStatus ? 'enabled' : 'disabled');
    
    // Show brief feedback
    const syncStatus = document.getElementById('syncStatus');
    if (syncStatus) {
        const originalText = syncStatus.textContent;
        syncStatus.textContent = newStatus ? 'ON' : 'OFF';
        setTimeout(() => {
            syncStatus.textContent = originalText;
        }, 1000);
    }
    
    return newStatus;
}

// Get sync status
function getSyncStatus() {
    const lastSync = localStorage.getItem('lastSyncTime');
    const autoSyncEnabled = localStorage.getItem('autoSyncEnabled') !== 'false';
    
    return {
        lastSync: lastSync ? new Date(lastSync) : null,
        autoSyncEnabled: autoSyncEnabled,
        nextSync: lastSync ? new Date(new Date(lastSync).getTime() + 30 * 60 * 1000) : null
    };
}

// Override syncFromGoogleSheets to prevent notifications
window.syncFromGoogleSheets = async function() {
    try {
        // Convert Google Sheets URL to CSV export URL
        const sheetId = '1L5OqP8IGL_2kLPZL7au66WvfL4VASK0-Z-y9repBeoA';
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch data from Google Sheets');
        }
        
        const csvText = await response.text();
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        const websites = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                if (values.length >= 4) {
                    websites.push({
                        id: i,
                        category: values[0] || '',
                        demo: values[1] || '',
                        password: values[2] || '',
                        official: values[3] || '',
                        isNew: values[4] === 'true' || values[4] === '1'
                    });
                }
            }
        }
        
        // Save to localStorage
        localStorage.setItem('websitesData', JSON.stringify(websites));
        localStorage.setItem('lastSyncTime', new Date().toISOString());
        
        // Reload data
        loadWebsitesData();
        updateStats();
        
        // Clear any notifications that might have been created
        clearAllNotifications();
        
        // Don't show notification - just log
        console.log('Data synced successfully from Google Sheets at:', new Date().toLocaleTimeString());
        
    } catch (error) {
        console.error('Error syncing from Google Sheets:', error);
        // Don't show notification on error either
    }
};

// Override startAutoSync if it exists
window.startAutoSync = function() {
    console.log('startAutoSync called but notifications are disabled');
    // Don't call syncFromGoogleSheets to avoid notifications
};

// Sync from Google Sheets (placeholder function)
function syncFromGoogleSheets() {
    // This function can be implemented to sync with Google Sheets
    // For now, it just updates the last sync time
    localStorage.setItem('lastSyncTime', new Date().toISOString());
    
    // Reload data
    loadWebsitesData();
    updateStats();
    
    // Clear any notifications that might have been created
    clearAllNotifications();
    
    // Don't show notification to avoid the issue
    console.log('Data synced successfully at:', new Date().toLocaleTimeString());
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('websiteModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with X button
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close')) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
