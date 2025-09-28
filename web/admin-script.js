// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.websites = [];
        this.currentEditingId = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.loadData();
        this.setupEventListeners();
        if (this.isLoggedIn) {
            this.restoreCurrentSection();
            this.updateDashboard();
            this.renderWebsitesTable();
            this.populateCategoryFilter();
        }
    }

    checkLoginStatus() {
        const loginStatus = localStorage.getItem('adminLoggedIn');
        if (loginStatus === 'true') {
            this.isLoggedIn = true;
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('adminContainer').style.display = 'flex';
        } else {
            this.isLoggedIn = false;
            document.getElementById('loginModal').style.display = 'block';
            document.getElementById('adminContainer').style.display = 'none';
        }
    }

    login(username, password) {
        // Simple authentication - in real app, this would be server-side
        const validCredentials = {
            'admin': 'SecureP@ssw0rd2024',
            'tungcpl96': 'Str0ngP@ss2024'
        };
        
        if (validCredentials[username] && validCredentials[username] === password) {
            this.isLoggedIn = true;
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('adminUser', username);
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('adminContainer').style.display = 'flex';
            this.updateDashboard();
            this.renderWebsitesTable();
            this.populateCategoryFilter();
            this.showNotification('Đăng nhập thành công!', 'success');
            return true;
        } else {
            this.showNotification('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
            return false;
        }
    }

    logout() {
        this.isLoggedIn = false;
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUser');
        document.getElementById('loginModal').style.display = 'block';
        document.getElementById('adminContainer').style.display = 'none';
        document.getElementById('loginForm').reset();
        this.showNotification('Đã đăng xuất!', 'success');
    }

    // Data Management
    loadData() {
        const savedData = localStorage.getItem('websitesData');
        if (savedData) {
            this.websites = JSON.parse(savedData);
        } else {
            // Load default data if no saved data exists
            this.websites = this.getDefaultData();
            this.saveData();
        }
    }

    saveData() {
        try {
            localStorage.setItem('websitesData', JSON.stringify(this.websites));
            this.showNotification('Dữ liệu đã được lưu!', 'success');
        } catch (error) {
            console.error('Error saving data:', error);
            this.showNotification('Không thể lưu dữ liệu!', 'error');
        }
    }

    getDefaultData() {
        return [
            {
                id: 1,
                category: "XE MÁY",
                demo: "https://mau01.webdep.xyz/",
                password: "765426",
                official: "https://xemay365.com.vn/",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                category: "KIM TUYẾN",
                demo: "https://mau02.webdep.xyz/",
                password: "876542",
                official: "https://dodo-glitter.com/",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                category: "ĐÈN TRẦN XUYÊN SÁNG",
                demo: "https://mau03.webdep.xyz/",
                password: "476654",
                official: "https://dentranxuyensang.com/",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                category: "MỸ PHẨM (NEW)",
                demo: "https://mau05.webdep.xyz/",
                password: "888542",
                official: "https://scentlabo.vn/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                category: "NỒI HƠI - MÁY MÓC (NEW)",
                demo: "https://mau06.webdep.xyz/",
                password: "091098",
                official: "https://tounshingkai.com.vn/vi/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                category: "MÁY LỌC KHÔNG KHÍ",
                demo: "https://mau07.webdep.xyz/",
                password: "091098",
                official: "",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 7,
                category: "NHÀ XE - ĐẶT VÉ XE KHÁCH",
                demo: "https://mau08.webdep.xyz/",
                password: "091098",
                official: "xekhachhanoiyty.com",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 8,
                category: "VẬN CHUYỂN HLE EXPRESS",
                demo: "https://mau09.webdep.xyz/",
                password: "091098",
                official: "hleexpress.com",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 9,
                category: "THAN ĐÁ",
                demo: "https://mau10.webdep.xyz/",
                password: "091098",
                official: "https://thanhuynhphuong.vn/",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 10,
                category: "NỘI THẤT",
                demo: "https://mau11.webdep.xyz/",
                password: "091098",
                official: "",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 11,
                category: "NỘI THẤT",
                demo: "https://mau12.webdep.xyz/",
                password: "091098",
                official: "https://j-design.info/",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 12,
                category: "VISA - TOUR DU LỊCH",
                demo: "https://mau14.webdep.xyz/",
                password: "091098",
                official: "https://saigonfirstsky.com/",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 13,
                category: "RESORT (NEW)",
                demo: "https://mau15.webdep.xyz/en",
                password: "091098",
                official: "https://cloudparadiseyty.com/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 14,
                category: "VISA VIỆT NHẬT (NEW)",
                demo: "https://mau16.webdep.xyz/",
                password: "981009",
                official: "https://favijatravel.com/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 15,
                category: "THIẾT KẾ XÂY DỰNG (NEW)",
                demo: "https://mau17.webdep.xyz/",
                password: "091098",
                official: "https://thietkexaydungbinhminh.com/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 16,
                category: "NỒI HƠI - MÁY MÓC (NEW)",
                demo: "https://mau18.webdep.xyz/",
                password: "091098",
                official: "https://petpboiler.com/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 17,
                category: "NỘI THẤT",
                demo: "https://mau19.webdep.xyz/",
                password: "091098",
                official: "https://bdstan.com/",
                isNew: false,
                createdAt: new Date().toISOString()
            },
            {
                id: 18,
                category: "BÁNH TRUNG THU (NEW)",
                demo: "https://mau20.webdep.xyz/",
                password: "865453",
                official: "",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 19,
                category: "LOGISTIC - VẬN CHUYỂN HÀN QUỐC (NEW)",
                demo: "https://mau21.webdep.xyz/",
                password: "846213",
                official: "https://jinakorea.co.kr/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 20,
                category: "LỐP XE - RESTONE (NEW)",
                demo: "https://mau22.webdep.xyz/",
                password: "654322",
                official: "https://restone-tire.com/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 21,
                category: "KEM HAPPY COOL (NEW)",
                demo: "https://mau23.webdep.xyz/",
                password: "756856",
                official: "",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 22,
                category: "THUỶ SẢN - VS SEAFOOD (NEW)",
                demo: "https://mau24.webdep.xyz/",
                password: "157896",
                official: "https://vietseavn.com/en/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 23,
                category: "TECHNO FARM - NÔNG TRẠI (NEW)",
                demo: "https://mau25.webdep.xyz/",
                password: "765156",
                official: "",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 24,
                category: "GAABOR - SHOPEE MALL (NEW)",
                demo: "https://mau26.webdep.xyz/",
                password: "975156",
                official: "https://gaaborvn.com/",
                isNew: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 25,
                category: "5000 sản phẩm",
                demo: "https://mau27.webdep.xyz/",
                password: "091098",
                official: "",
                isNew: false,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(item.dataset.section);
            });
        });

        // Sidebar toggle
        document.querySelector('.sidebar-toggle').addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('open');
        });

        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const username = formData.get('username');
            const password = formData.get('password');
            this.login(username, password);
        });

        // Website form
        document.getElementById('website-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWebsite();
        });

        // Search
        document.getElementById('admin-search').addEventListener('input', (e) => {
            this.filterWebsites(e.target.value);
        });

        // Category filter
        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.filterByCategory(e.target.value);
        });

        // Import file
        document.getElementById('import-file').addEventListener('change', (e) => {
            this.importData(e.target.files[0]);
        });


        // Confirm modal
        document.getElementById('confirmButton').addEventListener('click', () => {
            this.executeConfirmAction();
        });

        // Cancel button
        document.getElementById('cancelButton').addEventListener('click', () => {
            this.closeConfirmModal();
        });

        // Setup button event listeners
        this.setupButtonListeners();
    }

    // Setup button event listeners
    setupButtonListeners() {
        const adminPanel = this; // Capture the adminPanel instance

        // Add website button
        const addBtn = document.getElementById('addWebsiteBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                adminPanel.resetForm();
                adminPanel.showSection('add-website');
            });
        }


        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                adminPanel.exportData();
            });
        }

        // Import button
        const importBtn = document.getElementById('importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                document.getElementById('hidden-import').click();
            });
        }

        // Edit and Delete buttons in table
        this.setupTableButtonListeners();
    }

    // Setup table button listeners (edit/delete)
    setupTableButtonListeners() {
        const adminPanel = this; // Capture the adminPanel instance

        // Use event delegation for dynamically created buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
                const btn = e.target.classList.contains('edit-btn') ? e.target : e.target.closest('.edit-btn');
                const websiteId = btn.dataset.id;
                console.log('Edit button clicked, websiteId:', websiteId, 'type:', typeof websiteId);
                if (websiteId && !isNaN(websiteId)) {
                    adminPanel.editWebsite(parseInt(websiteId));
                } else {
                    console.error('Invalid websiteId for edit:', websiteId);
                }
            }

            if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
                const websiteId = btn.dataset.id;
                console.log('Delete button clicked, websiteId:', websiteId, 'type:', typeof websiteId);
                if (websiteId && !isNaN(websiteId)) {
                    adminPanel.deleteWebsite(parseInt(websiteId));
                } else {
                    console.error('Invalid websiteId for delete:', websiteId);
                }
            }
        });
    }

    // Navigation
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionId).classList.add('active');

        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'websites': 'Quản lý Website',
            'add-website': 'Thêm Website',
            'settings': 'Cài đặt'
        };
        document.getElementById('page-title').textContent = titles[sectionId];

        // Save current section to localStorage
        localStorage.setItem('currentAdminSection', sectionId);

        // Update content based on section
        if (sectionId === 'dashboard') {
            this.updateDashboard();
        } else if (sectionId === 'websites') {
            this.renderWebsitesTable();
        }
    }

    // Restore current section from localStorage
    restoreCurrentSection() {
        const savedSection = localStorage.getItem('currentAdminSection');
        if (savedSection && document.getElementById(savedSection)) {
            this.showSection(savedSection);
        } else {
            // Default to dashboard if no saved section or invalid section
            this.showSection('dashboard');
        }
    }

    // Dashboard
    updateDashboard() {
        try {
            const total = this.websites.length;
            const newCount = this.websites.filter(w => w.isNew).length;

            document.getElementById('total-websites').textContent = total;
            document.getElementById('new-websites').textContent = newCount;

            this.updateSyncStatus();
            this.updateTrafficStats();
            this.renderTopWebsites();
        } catch (error) {
            console.error('Error updating dashboard:', error);
            // Don't show notification to user as this is internal
        }
    }

    updateSyncStatus() {
        const lastSync = localStorage.getItem('lastSyncTime');
        const syncStatus = document.getElementById('sync-status');
        const lastSyncElement = document.getElementById('last-sync');
        
        if (lastSync) {
            const syncTime = new Date(lastSync);
            lastSyncElement.textContent = syncTime.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            lastSyncElement.textContent = '--:--';
        }
        
        syncStatus.textContent = navigator.onLine ? 'Online' : 'Offline';
        syncStatus.style.color = navigator.onLine ? '#28a745' : '#dc3545';
    }

    // Traffic Statistics
    updateTrafficStats() {
        const trafficData = this.getTrafficData();
        
        document.getElementById('total-views').textContent = trafficData.totalViews.toLocaleString();
        document.getElementById('total-clicks').textContent = trafficData.totalClicks.toLocaleString();
        document.getElementById('demo-visits').textContent = trafficData.demoVisits.toLocaleString();
        document.getElementById('official-visits').textContent = trafficData.officialVisits.toLocaleString();
    }

    getTrafficData() {
        // Get traffic data from localStorage or generate mock data
        let trafficData = JSON.parse(localStorage.getItem('trafficData') || '{}');
        
        if (!trafficData.totalViews) {
            // Generate initial traffic data
            trafficData = {
                totalViews: Math.floor(Math.random() * 10000) + 5000,
                totalClicks: Math.floor(Math.random() * 5000) + 2000,
                demoVisits: Math.floor(Math.random() * 3000) + 1000,
                officialVisits: Math.floor(Math.random() * 2000) + 500,
                websiteStats: {}
            };
            
            // Generate individual website stats
            this.websites.forEach(website => {
                trafficData.websiteStats[website.id] = {
                    views: Math.floor(Math.random() * 500) + 50,
                    clicks: Math.floor(Math.random() * 200) + 20,
                    demoVisits: Math.floor(Math.random() * 150) + 10,
                    officialVisits: website.official ? Math.floor(Math.random() * 100) + 5 : 0
                };
            });
            
            localStorage.setItem('trafficData', JSON.stringify(trafficData));
        }
        
        return trafficData;
    }

    renderTopWebsites() {
        const trafficData = this.getTrafficData();
        const websiteStats = Object.entries(trafficData.websiteStats)
            .map(([id, stats]) => {
                const website = this.websites.find(w => w.id == id);
                return {
                    ...website,
                    totalVisits: stats.views + stats.clicks + stats.demoVisits + stats.officialVisits,
                    ...stats
                };
            })
            .sort((a, b) => b.totalVisits - a.totalVisits)
            .slice(0, 10);

        const topContainer = document.getElementById('top-websites');
        topContainer.innerHTML = websiteStats.map((website, index) => `
            <div class="top-item">
                <div class="rank ${index < 3 ? `top-${index + 1}` : ''}">${index + 1}</div>
                <div class="website-info">
                    <div class="website-name">${website.category}</div>
                    <div class="website-stats">
                        ${website.views} lượt xem • ${website.clicks} lượt click
                    </div>
                </div>
                <div class="visit-count">${website.totalVisits}</div>
            </div>
        `).join('');
    }

    // Track website interaction
    trackWebsiteInteraction(websiteId, action) {
        const trafficData = this.getTrafficData();
        
        if (!trafficData.websiteStats[websiteId]) {
            trafficData.websiteStats[websiteId] = {
                views: 0,
                clicks: 0,
                demoVisits: 0,
                officialVisits: 0
            };
        }
        
        switch(action) {
            case 'view':
                trafficData.websiteStats[websiteId].views++;
                trafficData.totalViews++;
                break;
            case 'click':
                trafficData.websiteStats[websiteId].clicks++;
                trafficData.totalClicks++;
                break;
            case 'demo':
                trafficData.websiteStats[websiteId].demoVisits++;
                trafficData.demoVisits++;
                break;
            case 'official':
                trafficData.websiteStats[websiteId].officialVisits++;
                trafficData.officialVisits++;
                break;
        }
        
        localStorage.setItem('trafficData', JSON.stringify(trafficData));
    }

    // Website Management
    renderWebsitesTable() {
        try {
            const tbody = document.getElementById('websites-table-body');
            if (!tbody) {
                console.error('Table body element not found');
                return;
            }
            tbody.innerHTML = this.websites.map(website => `
            <tr>
                <td>${website.id}</td>
                <td>${website.category}</td>
                <td>
                    <a href="${website.demo}" target="_blank" style="color: #667eea; text-decoration: none;">
                        ${website.demo}
                        <i class="fas fa-external-link-alt" style="margin-left: 0.5rem; font-size: 0.8rem;"></i>
                    </a>
                </td>
                <td>${website.password || '-'}</td>
                <td>
                    ${website.official ?
                        `<a href="${website.official.startsWith('http') ? website.official : 'https://' + website.official}" target="_blank" style="color: #667eea; text-decoration: none;">
                            ${website.official}
                            <i class="fas fa-external-link-alt" style="margin-left: 0.5rem; font-size: 0.8rem;"></i>
                        </a>` :
                        '-'
                    }
                </td>
                <td>
                    <span class="status-badge ${website.isNew ? 'new' : 'old'}">
                        ${website.isNew ? 'Mới' : 'Cũ'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${website.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${website.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        } catch (error) {
            console.error('Error rendering websites table:', error);
            // Don't show notification to user as this is internal
        }
    }

    populateCategoryFilter() {
        const categories = [...new Set(this.websites.map(w => w.category))];
        const filter = document.getElementById('category-filter');
        filter.innerHTML = '<option value="">Tất cả danh mục</option>' +
            categories.map(category => `<option value="${category}">${category}</option>`).join('');
    }

    filterWebsites(searchTerm) {
        const filtered = this.websites.filter(website => 
            website.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            website.demo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (website.official && website.official.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        this.renderFilteredTable(filtered);
    }

    filterByCategory(category) {
        if (!category) {
            this.renderWebsitesTable();
            return;
        }
        const filtered = this.websites.filter(website => website.category === category);
        this.renderFilteredTable(filtered);
    }

    renderFilteredTable(websites) {
        const tbody = document.getElementById('websites-table-body');
        tbody.innerHTML = websites.map(website => `
            <tr>
                <td>${website.id}</td>
                <td>${website.category}</td>
                <td>
                    <a href="${website.demo}" target="_blank" style="color: #667eea; text-decoration: none;">
                        ${website.demo}
                        <i class="fas fa-external-link-alt" style="margin-left: 0.5rem; font-size: 0.8rem;"></i>
                    </a>
                </td>
                <td>${website.password || '-'}</td>
                <td>
                    ${website.official ? 
                        `<a href="${website.official.startsWith('http') ? website.official : 'https://' + website.official}" target="_blank" style="color: #667eea; text-decoration: none;">
                            ${website.official}
                            <i class="fas fa-external-link-alt" style="margin-left: 0.5rem; font-size: 0.8rem;"></i>
                        </a>` : 
                        '-'
                    }
                </td>
                <td>
                    <span class="status-badge ${website.isNew ? 'new' : 'old'}">
                        ${website.isNew ? 'Mới' : 'Cũ'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" data-id="${website.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" data-id="${website.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // CRUD Operations
    saveWebsite() {
        const form = document.getElementById('website-form');
        const formData = new FormData(form);
        
        const websiteData = {
            category: formData.get('category'),
            demo: formData.get('demo'),
            password: formData.get('password') || '',
            official: formData.get('official') || '',
            isNew: formData.get('isNew') === 'on'
        };

        if (this.currentEditingId) {
            // Update existing website
            const index = this.websites.findIndex(w => w.id === this.currentEditingId);
            if (index !== -1) {
                this.websites[index] = { ...this.websites[index], ...websiteData };
                this.showNotification('Website đã được cập nhật!', 'success');
            }
        } else {
            // Add new website
            const newId = Math.max(...this.websites.map(w => w.id)) + 1;
            this.websites.push({
                id: newId,
                ...websiteData,
                createdAt: new Date().toISOString()
            });
            this.showNotification('Website đã được thêm!', 'success');
        }

        this.saveData();
        this.resetForm();
        this.showSection('websites');
        this.renderWebsitesTable();
        this.updateDashboard();
    }

    editWebsite(id) {
        console.log('editWebsite called with id:', id, 'type:', typeof id);
        console.log('Available websites:', this.websites.map(w => ({id: w.id, category: w.category})));

        const website = this.websites.find(w => w.id === id || w.id === parseInt(id));
        if (!website) {
            console.error('Website not found with id:', id);
            this.showNotification('Không tìm thấy website để chỉnh sửa', 'error');
            return;
        }

        console.log('Found website:', website);

        this.currentEditingId = id;

        try {
            // Fill form
            document.getElementById('category').value = website.category;
            document.getElementById('demo').value = website.demo;
            document.getElementById('password').value = website.password || '';
            document.getElementById('official').value = website.official || '';
            document.getElementById('isNew').checked = website.isNew;

            // Update form title
            document.getElementById('form-title').textContent = 'Chỉnh sửa Website';

            // Show add-website section
            this.showSection('add-website');
        } catch (error) {
            console.error('Error filling edit form:', error);
            this.showNotification('Có lỗi xảy ra khi mở form chỉnh sửa', 'error');
        }
    }

    deleteWebsite(id) {
        console.log('deleteWebsite called with id:', id, 'type:', typeof id);

        const website = this.websites.find(w => w.id === id || w.id === parseInt(id));
        if (!website) {
            console.error('Website not found for deletion with id:', id);
            this.showNotification('Không tìm thấy website để xóa', 'error');
            return;
        }

        const adminPanel = this; // Capture the correct context
        const numericId = parseInt(id);

        this.showConfirmModal(
            'Xóa Website',
            `Bạn có chắc chắn muốn xóa website "${website.category}"?`,
            function() {
                console.log('Deleting website with id:', id);
                try {
                    console.log('Before deletion, websites count:', adminPanel.websites.length);
                    adminPanel.websites = adminPanel.websites.filter(w => w.id !== numericId);
                    console.log('After deletion, websites count:', adminPanel.websites.length);
                    console.log('Deleted website id:', numericId);

                    // Save data first
                    try {
                        adminPanel.saveData();
                    } catch (saveError) {
                        console.error('Error saving data after deletion:', saveError);
                        throw new Error('Không thể lưu dữ liệu sau khi xóa');
                    }

                    // Then update UI
                    try {
                        adminPanel.renderWebsitesTable();
                        adminPanel.updateDashboard();
                    } catch (uiError) {
                        console.error('Error updating UI after deletion:', uiError);
                        throw new Error('Không thể cập nhật giao diện sau khi xóa');
                    }

                    // Show success message
                    adminPanel.showNotification('Website đã được xóa!', 'success');
                } catch (error) {
                    console.error('Error deleting website:', error);
                    adminPanel.showNotification(error.message || 'Có lỗi xảy ra khi xóa website', 'error');
                }
            }
        );
    }

    resetForm() {
        document.getElementById('website-form').reset();
        this.currentEditingId = null;
        document.getElementById('form-title').textContent = 'Thêm Website Mới';
    }

    // Utility Functions
    showConfirmModal(title, message, callback) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMessage').textContent = message;
        document.getElementById('confirmModal').style.display = 'block';
        
        // Store callback
        this.confirmCallback = callback;
    }

    closeConfirmModal() {
        document.getElementById('confirmModal').style.display = 'none';
        this.confirmCallback = null;
    }

    executeConfirmAction() {
        try {
            if (this.confirmCallback) {
                this.confirmCallback();
            }
        } catch (error) {
            console.error('Error in confirm callback:', error);
            this.showNotification('Có lỗi xảy ra khi thực hiện thao tác', 'error');
        } finally {
            this.closeConfirmModal();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Data Import/Export
    exportData() {
        const dataStr = JSON.stringify(this.websites, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `websites-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Dữ liệu đã được xuất!', 'success');
    }

    importData(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    this.websites = importedData;
                    this.saveData();
                    this.renderWebsitesTable();
                    this.updateDashboard();
                    this.showNotification('Dữ liệu đã được nhập!', 'success');
                } else {
                    this.showNotification('File không hợp lệ!', 'error');
                }
            } catch (error) {
                this.showNotification('Lỗi khi đọc file!', 'error');
            }
        };
        reader.readAsText(file);
    }

    resetToDefault() {
        this.showConfirmModal(
            'Khôi phục dữ liệu mặc định',
            'Bạn có chắc chắn muốn khôi phục dữ liệu mặc định? Tất cả dữ liệu hiện tại sẽ bị mất.',
            () => {
                this.websites = this.getDefaultData();
                this.saveData();
                this.renderWebsitesTable();
                this.updateDashboard();
                this.showNotification('Dữ liệu đã được khôi phục!', 'success');
            }
        );
    }

    clearAllData() {
        this.showConfirmModal(
            'Xóa tất cả dữ liệu',
            'Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.',
            () => {
                this.websites = [];
                this.saveData();
                this.renderWebsitesTable();
                this.updateDashboard();
                this.showNotification('Tất cả dữ liệu đã được xóa!', 'success');
            }
        );
    }

    manualSync() {
        // Try to call syncFromGoogleSheets directly
        try {
            if (typeof syncFromGoogleSheets === 'function') {
                syncFromGoogleSheets();
            } else {
                // Show error if sync function is not available
                console.error('Sync function not available');
                this.showNotification('Chức năng đồng bộ không khả dụng', 'error');
            }
        } catch (error) {
            console.error('Error calling sync function:', error);
            this.showNotification('Lỗi khi đồng bộ dữ liệu', 'error');
        }
    }

    // Method to force re-render table (for debugging)
    refreshTable() {
        this.renderWebsitesTable();
    }
}

// Global functions for HTML onclick handlers (backup)
function showAddWebsite() {
    if (window.adminPanel) {
        window.adminPanel.resetForm();
        window.adminPanel.showSection('add-website');
    }
}

function showWebsitesList() {
    if (window.adminPanel) {
        window.adminPanel.showSection('websites');
    }
}

function exportData() {
    if (window.adminPanel) {
        window.adminPanel.exportData();
    }
}

function importData() {
    document.getElementById('hidden-import').click();
}

function manualSync() {
    if (typeof window.manualSync === 'function') {
        window.manualSync();
    } else {
        console.error('Manual sync function not available');
    }
}

function resetToDefault() {
    if (window.adminPanel) {
        window.adminPanel.resetToDefault();
    }
}

function clearAllData() {
    if (window.adminPanel) {
        window.adminPanel.clearAllData();
    }
}


function logout() {
    if (window.adminPanel) {
        window.adminPanel.logout();
    }
}

// Initialize admin panel when DOM is loaded
let adminPanel;
document.addEventListener('DOMContentLoaded', function() {
    adminPanel = new AdminPanel();
    window.adminPanel = adminPanel; // Make it globally available
    
        // Setup import file handler
        document.getElementById('hidden-import').addEventListener('change', function(e) {
            adminPanel.importData(e.target.files[0]);
        });

        // Close modal when clicking outside
        document.getElementById('confirmModal').addEventListener('click', function(e) {
            if (e.target === this) {
                adminPanel.closeConfirmModal();
            }
        });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            adminPanel.closeConfirmModal();
        }
    });
});
