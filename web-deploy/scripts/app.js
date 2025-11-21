// ===== MAIN APPLICATION =====

class SEOSuiteApp {
    constructor() {
        this.currentScreen = 'dashboard';
        this.isInitialized = false;
        this.user = {
            name: 'Murat Demir',
            email: 'murat.demir@email.com',
            plan: 'Pro',
            projects: 12
        };
        this.data = {
            projects: [],
            automations: [],
            notifications: [],
            analytics: {}
        };
        this.init();
    }

    async init() {
        try {
            // Initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize screen navigation
            this.initializeNavigation();
            
            // Load initial data
            await this.loadInitialData();
            
            // Initialize current screen
            await this.initializeScreen(this.currentScreen);
            
            // Start real-time updates
            this.startRealTimeUpdates();
            
            this.isInitialized = true;
            console.log('SEO Suite App initialized successfully');
            
        } catch (error) {
            handleError(error, 'App initialization');
        }
    }

    setupEventListeners() {
        // Bottom navigation
        $$('.nav-item').forEach(item => {
            on(item, 'click', () => {
                const screenName = item.dataset.screen;
                if (screenName) {
                    this.navigateTo(screenName);
                }
            });
        });

        // AI Tools sidebar
        const aiToolsToggle = $('#aiToolsToggle');
        const aiToolsSidebar = $('#aiToolsSidebar');
        const closeToolsBtn = $('#closeToolsBtn');

        if (aiToolsToggle && aiToolsSidebar) {
            on(aiToolsToggle, 'click', () => {
                toggleClass(aiToolsSidebar, 'open');
            });
        }

        if (closeToolsBtn && aiToolsSidebar) {
            on(closeToolsBtn, 'click', () => {
                removeClass(aiToolsSidebar, 'open');
            });
        }

        // Tool items in AI sidebar
        $$('.tool-item').forEach(item => {
            on(item, 'click', () => {
                const tool = item.dataset.tool;
                if (tool) {
                    this.activateAITool(tool);
                }
            });
        });

        // Chat functionality
        const chatInput = $('#chatInput');
        const sendBtn = $('#sendMessage');

        if (chatInput && sendBtn) {
            on(chatInput, 'keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            on(sendBtn, 'click', () => {
                this.sendMessage();
            });
        }

        // Voice input
        const voiceInput = $('#voiceInput');
        if (voiceInput) {
            on(voiceInput, 'click', () => {
                this.activateVoiceInput();
            });
        }

        // Upload URL
        const uploadUrl = $('#uploadUrl');
        if (uploadUrl) {
            on(uploadUrl, 'click', () => {
                this.uploadUrl();
            });
        }

        // Project filters
        $$('.filter-chip').forEach(chip => {
            on(chip, 'click', () => {
                $$('.filter-chip').forEach(c => removeClass(c, 'active'));
                addClass(chip, 'active');
                this.filterProjects(chip.dataset.filter);
            });
        });

        // Automation toggles
        $$('.toggle-switch input[type="checkbox"]').forEach(toggle => {
            on(toggle, 'change', () => {
                this.toggleAutomation(toggle.id, toggle.checked);
            });
        });

        // New project button
        const newProjectBtn = $('.new-project-btn');
        if (newProjectBtn) {
            on(newProjectBtn, 'click', () => {
                this.showNewProjectModal();
            });
        }

        // New automation button
        const newAutomationBtn = $('.new-automation-btn');
        if (newAutomationBtn) {
            on(newAutomationBtn, 'click', () => {
                this.showNewAutomationModal();
            });
        }

        // Quick actions
        $$('.action-btn').forEach(btn => {
            on(btn, 'click', () => {
                const action = btn.dataset.action;
                if (action) {
                    this.executeQuickAction(action);
                }
            });
        });

        // Theme toggle
        $$('.theme-btn').forEach(btn => {
            on(btn, 'click', () => {
                $$('.theme-btn').forEach(b => removeClass(b, 'active'));
                addClass(btn, 'active');
                setTheme(btn.dataset.theme);
            });
        });

        // Logout button
        const logoutBtn = $('.logout-btn');
        if (logoutBtn) {
            on(logoutBtn, 'click', () => {
                this.handleLogout();
            });
        }

        // Keyboard shortcuts
        on(document, 'keydown', (e) => {
            this.handleKeyboardShortcut(e);
        });

        // Window resize
        on(window, 'resize', debounce(() => {
            this.handleResize();
        }, 250));

        // Page visibility change
        on(document, 'visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // API Modal functionality
        this.setupAPIModalEvents();
    }

    setupAPIModalEvents() {
        // API Modal elements
        const apiModal = $('#apiModal');
        const openApiModalBtn = $('#openApiModal');
        const closeApiModalBtn = $('#closeApiModal');
        const apiKeyInput = $('#apiKeyInput');
        const saveApiKeyBtn = $('#saveApiKey');
        const testConnectionBtn = $('#testConnection');
        const togglePasswordBtn = $('#togglePassword');

        // Open API modal
        if (openApiModalBtn) {
            on(openApiModalBtn, 'click', () => {
                this.openAPIModal();
            });
        }

        // Close API modal
        if (closeApiModalBtn) {
            on(closeApiModalBtn, 'click', () => {
                this.closeAPIModal();
            });
        }

        // Click outside to close
        if (apiModal) {
            on(apiModal, 'click', (e) => {
                if (e.target === apiModal) {
                    this.closeAPIModal();
                }
            });
        }

        // Save API key
        if (saveApiKeyBtn) {
            on(saveApiKeyBtn, 'click', () => {
                this.saveApiKey();
            });
        }

        // Test connection
        if (testConnectionBtn) {
            on(testConnectionBtn, 'click', () => {
                this.testApiConnection();
            });
        }

        // Toggle password visibility
        if (togglePasswordBtn && apiKeyInput) {
            on(togglePasswordBtn, 'click', () => {
                const isPassword = apiKeyInput.type === 'password';
                apiKeyInput.type = isPassword ? 'text' : 'password';
                
                const icon = togglePasswordBtn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', isPassword ? 'eye-off' : 'eye');
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            });
        }

        // Enter key in API key input
        if (apiKeyInput) {
            on(apiKeyInput, 'keypress', (e) => {
                if (e.key === 'Enter') {
                    this.saveApiKey();
                }
            });
        }

        // Update connection status on page load
        this.updateConnectionStatus();
    }

    openAPIModal() {
        const apiModal = $('#apiModal');
        const apiKeyInput = $('#apiKeyInput');
        
        if (apiModal) {
            addClass(apiModal, 'active');
        }

        // Focus on input
        if (apiKeyInput) {
            apiKeyInput.focus();
            // Load existing API key
            const existingKey = window.aiAPI.getApiKey();
            if (existingKey) {
                apiKeyInput.value = existingKey;
            }
        }

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    closeAPIModal() {
        const apiModal = $('#apiModal');
        if (apiModal) {
            removeClass(apiModal, 'active');
        }
    }

    async saveApiKey() {
        const apiKeyInput = $('#apiKeyInput');
        const saveBtn = $('#saveApiKey');
        const statusDiv = $('#apiStatus');
        const statusMessage = $('#statusMessage');

        if (!apiKeyInput || !saveBtn) return;

        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showApiStatus('Lütfen geçerli bir API anahtarı girin', 'error');
            return;
        }

        // Show loading state
        saveBtn.classList.add('btn-loading');
        saveBtn.disabled = true;

        try {
            // Save API key
            window.aiAPI.setApiKey(apiKey);
            
            // Test the connection
            const testResult = await window.aiAPI.testConnection();
            
            if (testResult.success) {
                this.showApiStatus('API anahtarı başarıyla kaydedildi ve bağlantı testi başarılı!', 'success');
                this.updateConnectionStatus();
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    this.closeAPIModal();
                    showNotification('AI asistanı aktif! Artık dinamik yanıtlar alacaksınız.', 'success');
                }, 2000);
            } else {
                this.showApiStatus(`Bağlantı hatası: ${testResult.message}`, 'error');
                window.aiAPI.removeApiKey(); // Remove invalid key
            }
        } catch (error) {
            this.showApiStatus(`Hata: ${error.message}`, 'error');
            window.aiAPI.removeApiKey();
        } finally {
            // Remove loading state
            saveBtn.classList.remove('btn-loading');
            saveBtn.disabled = false;
        }
    }

    async testApiConnection() {
        const testBtn = $('#testConnection');
        const apiKeyInput = $('#apiKeyInput');
        const statusDiv = $('#apiStatus');

        if (!testBtn || !apiKeyInput) return;

        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showApiStatus('Test etmek için önce API anahtarı girin', 'warning');
            return;
        }

        // Show loading state
        testBtn.classList.add('btn-loading');
        testBtn.disabled = true;

        try {
            // Temporarily set the API key for testing
            const originalKey = window.aiAPI.getApiKey();
            window.aiAPI.setApiKey(apiKey);

            // Test connection
            const testResult = await window.aiAPI.testConnection();
            
            if (testResult.success) {
                this.showApiStatus('Bağlantı başarılı! API çalışıyor.', 'success');
            } else {
                this.showApiStatus(`Bağlantı hatası: ${testResult.message}`, 'error');
            }

            // Restore original key
            window.aiAPI.setApiKey(originalKey);
            
        } catch (error) {
            this.showApiStatus(`Test hatası: ${error.message}`, 'error');
        } finally {
            // Remove loading state
            testBtn.classList.remove('btn-loading');
            testBtn.disabled = false;
        }
    }

    showApiStatus(message, type) {
        const statusDiv = $('#apiStatus');
        const statusMessage = $('#statusMessage');

        if (!statusDiv || !statusMessage) return;

        statusMessage.textContent = message;
        statusDiv.className = `api-status ${type}`;
        statusDiv.style.display = 'flex';

        // Auto hide after 5 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }

    updateConnectionStatus() {
        const connectionDot = $('#connectionDot');
        const connectionStatus = $('#connectionStatus');

        if (!connectionDot || !connectionStatus) return;

        const isConnected = window.aiAPI.isApiConfigured();

        if (isConnected) {
            connectionDot.className = 'connection-dot connected';
            connectionStatus.textContent = 'Bağlı';
        } else {
            connectionDot.className = 'connection-dot disconnected';
            connectionStatus.textContent = 'Bağlantı Yok';
        }
    }

    initializeNavigation() {
        // Check URL parameters
        const params = getUrlParams();
        const screenFromUrl = params.screen;
        
        if (screenFromUrl && $(`#${screenFromUrl}-screen`)) {
            this.currentScreen = screenFromUrl;
        }

        // Show initial screen
        this.showScreen(this.currentScreen);
    }

    navigateTo(screenName) {
        if (screenName === this.currentScreen) return;

        this.currentScreen = screenName;
        this.showScreen(screenName);
        
        // Update URL
        setUrlParams({ screen: screenName });
    }

    showScreen(screenName) {
        // Hide all screens
        $$('.screen').forEach(screen => {
            removeClass(screen, 'active');
        });

        // Show target screen
        const targetScreen = $(`#${screenName}-screen`);
        if (targetScreen) {
            addClass(targetScreen, 'active');
            this.initializeScreen(screenName);
        }

        // Update navigation
        $$('.nav-item').forEach(item => {
            removeClass(item, 'active');
            if (item.dataset.screen === screenName) {
                addClass(item, 'active');
            }
        });
    }

    async initializeScreen(screenName) {
        try {
            switch (screenName) {
                case 'dashboard':
                    await this.initializeDashboard();
                    break;
                case 'projects':
                    await this.initializeProjects();
                    break;
                case 'chat':
                    await this.initializeChat();
                    break;
                case 'automations':
                    await this.initializeAutomations();
                    break;
                case 'profile':
                    await this.initializeProfile();
                    break;
            }
        } catch (error) {
            handleError(error, `Screen initialization: ${screenName}`);
        }
    }

    async initializeDashboard() {
        // Animate counters
        const scoreElement = $('.score-value');
        if (scoreElement) {
            animationManager.animateCounter(scoreElement, 87);
        }

        const conversationsElement = $('.conversations-count');
        if (conversationsElement) {
            animationManager.animateCounter(conversationsElement, 1247);
        }

        // Initialize charts
        setTimeout(() => {
            createTrafficChart();
        }, 500);

        // Animate elements
        const heroCard = $('.hero-card');
        if (heroCard) {
            animateIn(heroCard);
        }

        const analyticsCards = $$('.analytics-card');
        if (analyticsCards.length > 0) {
            staggerAnimation(analyticsCards, 100);
        }
    }

    async initializeProjects() {
        // Animate project cards
        const projectCards = $$('.project-card');
        if (projectCards.length > 0) {
            staggerAnimation(projectCards, 150);
        }

        // Initialize search functionality
        this.setupProjectSearch();
    }

    async initializeChat() {
        // Scroll to bottom of messages
        const chatMessages = $('#chatMessages');
        if (chatMessages) {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }

        // Focus on input
        const chatInput = $('#chatInput');
        if (chatInput) {
            chatInput.focus();
        }

        // Update connection status for chat
        this.updateChatConnectionStatus();
    }

    updateChatConnectionStatus() {
        const chatConnectionDot = $('#chatConnectionDot');
        const chatConnectionStatus = $('#chatConnectionStatus');

        if (!chatConnectionDot || !chatConnectionStatus) return;

        const isConnected = window.aiAPI.isApiConfigured();

        if (isConnected) {
            chatConnectionDot.className = 'connection-dot connected';
            chatConnectionStatus.textContent = 'Aktif';
            chatConnectionStatus.style.display = 'inline';
            chatConnectionDot.style.display = 'inline-block';
        } else {
            chatConnectionDot.className = 'connection-dot disconnected';
            chatConnectionStatus.textContent = 'API Gerekli';
            chatConnectionStatus.style.display = 'inline';
            chatConnectionDot.style.display = 'inline-block';
        }
    }

    async initializeAutomations() {
        // Animate automation cards
        const automationCards = $$('.automation-card');
        if (automationCards.length > 0) {
            staggerAnimation(automationCards, 100);
        }

        // Animate workflow nodes
        const workflowNodes = $$('.workflow-node');
        if (workflowNodes.length > 0) {
            workflowNodes.forEach((node, index) => {
                setTimeout(() => {
                    animateIn(node);
                }, index * 200);
            });
        }
    }

    async initializeProfile() {
        // Animate profile sections
        const profileSections = $$('.profile-card, .settings-section');
        if (profileSections.length > 0) {
            staggerAnimation(profileSections, 150);
        }

        // Update theme toggle state
        const currentTheme = getTheme();
        $$('.theme-btn').forEach(btn => {
            removeClass(btn, 'active');
            if (btn.dataset.theme === currentTheme) {
                addClass(btn, 'active');
            }
        });
    }

    // Chat functionality
    async sendMessage() {
        const chatInput = $('#chatInput');
        const chatMessages = $('#chatMessages');
        
        if (!chatInput || !chatMessages) return;

        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        chatInput.value = '';

        // Generate AI response
        await this.generateAIResponse(message);
    }

    addChatMessage(content, sender) {
        const chatMessages = $('#chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i data-lucide="${sender === 'user' ? 'user' : 'bot'}"></i>
            </div>
            <div class="message-content">
                <p>${content}</p>
                <span class="message-time">${formatTime(new Date())}</span>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        
        // Initialize icons for new message
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Animate message entrance
        animateIn(messageDiv);
    }

    showTypingIndicator() {
        const chatMessages = $('#chatMessages');
        if (!chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i data-lucide="bot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="message-time">${formatTime(new Date())}</span>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    hideTypingIndicator() {
        const typingIndicator = $('#typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async generateAIResponse(userMessage) {
        try {
            // Show typing indicator
            this.showTypingIndicator();
            
            // Get AI response using the API service
            const response = await window.aiAPI.getResponse(userMessage);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addChatMessage(response, 'ai');
            
        } catch (error) {
            console.error('AI Response Error:', error);
            this.hideTypingIndicator();
            
            // Fallback response in case of error
            const fallbackResponse = 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin veya internet bağlantınızı kontrol edin.';
            this.addChatMessage(fallbackResponse, 'ai');
            
            showNotification('AI yanıt hatası oluştu', 'error');
        }
    }

    activateVoiceInput() {
        showNotification('Ses girişi henüz desteklenmiyor', 'info');
    }

    uploadUrl() {
        const url = prompt('Analiz edilecek URL\'i girin:');
        if (url && isValidUrl(url)) {
            showNotification('URL analiz ediliyor...', 'info');
            // Simulate URL analysis
            setTimeout(() => {
                this.addChatMessage(`URL ${url} başarıyla analiz edildi. Teknik sorunlar tespit edildi ve çözüm önerileri hazırlandı.`, 'ai');
            }, 2000);
        } else if (url) {
            showNotification('Geçerli bir URL girin', 'error');
        }
    }

    // Project functionality
    filterProjects(filter) {
        const projectCards = $$('.project-card');
        
        projectCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                // Add filter logic based on project status
                const hasIssue = $('.stat-value.error', card) !== null;
                const hasWarning = $('.stat-value.warning', card) !== null;
                
                switch (filter) {
                    case 'high-priority':
                        card.style.display = hasIssue ? 'block' : 'none';
                        break;
                    case 'low-ranking':
                        card.style.display = hasWarning ? 'block' : 'none';
                        break;
                    case 'needs-fixing':
                        card.style.display = hasIssue || hasWarning ? 'block' : 'none';
                        break;
                }
            }
        });

        // Animate filtered results
        const visibleCards = projectCards.filter(card => card.style.display !== 'none');
        staggerAnimation(visibleCards, 50);
    }

    setupProjectSearch() {
        // Add search input if it doesn't exist
        if (!$('#projectSearch')) {
            const searchContainer = document.createElement('div');
            searchContainer.innerHTML = `
                <div class="project-search glassmorphic">
                    <i data-lucide="search"></i>
                    <input type="text" id="projectSearch" placeholder="Proje ara...">
                </div>
            `;
            
            const projectsScreen = $('#projects-screen');
            if (projectsScreen) {
                const screenHeader = $('.screen-header', projectsScreen);
                if (screenHeader) {
                    screenHeader.appendChild(searchContainer);
                    // Initialize icons
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                }
            }
        }
    }

    showNewProjectModal() {
        showNotification('Yeni proje oluşturma özelliği yakında!', 'info');
    }

    // Automation functionality
    toggleAutomation(automationId, isEnabled) {
        const automation = this.data.automations.find(a => a.id === automationId);
        if (automation) {
            automation.enabled = isEnabled;
            showNotification(
                `${automation.name} ${isEnabled ? 'etkinleştirildi' : 'devre dışı bırakıldı'}`,
                'success'
            );
        }
    }

    showNewAutomationModal() {
        showNotification('Yeni otomasyon oluşturma özelliği yakında!', 'info');
    }

    // Quick actions
    executeQuickAction(action) {
        const actions = {
            'generate-keywords': () => {
                this.navigateTo('chat');
                setTimeout(() => {
                    this.addChatMessage('Anahtar kelime araştırması yapmak istiyorum', 'user');
                    setTimeout(() => {
                        this.generateAIResponse('anahtar kelime');
                    }, 1000);
                }, 500);
            },
            'optimize-page': () => {
                showNotification('Sayfa optimizasyonu için URL girin', 'info');
            },
            'create-backlinks': () => {
                showNotification('Backlink stratejisi analizi başlatılıyor...', 'info');
            },
            'analyze-competitors': () => {
                showNotification('Rakip analizi raporu hazırlanıyor...', 'info');
            }
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    // AI Tools
    activateAITool(tool) {
        const tools = {
            'keyword-generator': () => {
                this.addChatMessage('Anahtar kelime üretici aracını kullanıyorum', 'user');
                setTimeout(() => {
                    this.generateAIResponse('anahtar kelime');
                }, 1000);
            },
            'meta-writer': () => {
                showNotification('Meta açıklama yazıcısı aktif', 'success');
            },
            'technical-analyzer': () => {
                showNotification('Teknik analiz başlatılıyor...', 'info');
            },
            'competitor-summary': () => {
                showNotification('Rakip özeti oluşturuluyor...', 'info');
            }
        };

        if (tools[tool]) {
            tools[tool]();
            // Close sidebar
            const sidebar = $('#aiToolsSidebar');
            if (sidebar) {
                removeClass(sidebar, 'open');
            }
        }
    }

    // Data management
    async loadInitialData() {
        // Simulate API calls
        try {
            // Load projects
            this.data.projects = [
                {
                    id: 'tech-blog',
                    name: 'TechBlog Pro',
                    domain: 'techblog.com',
                    score: 89,
                    issues: 3,
                    keywords: 127,
                    status: 'good'
                },
                {
                    id: 'ecommerce',
                    name: 'ShopNow',
                    domain: 'shopnow.com',
                    score: 94,
                    issues: 0,
                    keywords: 284,
                    status: 'excellent'
                },
                {
                    id: 'portfolio',
                    name: 'Designer Portfolio',
                    domain: 'muratdesigner.com',
                    score: 67,
                    issues: 8,
                    keywords: 45,
                    status: 'needs-work'
                }
            ];

            // Load automations
            this.data.automations = [
                {
                    id: 'keywordScan',
                    name: 'Günlük Anahtar Kelime Taraması',
                    enabled: true,
                    lastRun: 'Bugün 06:00',
                    nextRun: 'Yarın 06:00'
                },
                {
                    id: 'linkMonitor',
                    name: 'Broken Link Monitor',
                    enabled: true,
                    lastRun: '2 saat önce',
                    nextRun: '8 saat sonra'
                },
                {
                    id: 'rankTracking',
                    name: 'Sıralama Takibi',
                    enabled: false,
                    lastRun: 'Hiç',
                    nextRun: 'Önce yapılandır'
                }
            ];

        } catch (error) {
            handleError(error, 'Loading initial data');
        }
    }

    // Real-time updates
    startRealTimeUpdates() {
        // Update charts periodically
        setInterval(() => {
            if (this.currentScreen === 'dashboard') {
                this.updateDashboardData();
            }
        }, 30000); // Every 30 seconds

        // Check for notifications
        setInterval(() => {
            this.checkNotifications();
        }, 60000); // Every minute
    }

    updateDashboardData() {
        // Simulate data updates
        const scoreElement = $('.score-value');
        if (scoreElement) {
            const currentScore = parseInt(scoreElement.textContent) || 87;
            const newScore = Math.max(0, Math.min(100, currentScore + (Math.random() - 0.5) * 4));
            animationManager.animateCounter(scoreElement, Math.round(newScore));
        }
    }

    checkNotifications() {
        // Simulate new notifications
        if (Math.random() < 0.1) { // 10% chance every minute
            const notifications = [
                'Yeni anahtar kelime fırsatı keşfedildi',
                'Rakip sıralama değişikliği tespit edildi',
                'Teknik SEO sorunu çözüldü',
                'Haftalık SEO raporu hazır'
            ];
            
            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            showNotification(randomNotification, 'info');
        }
    }

    // Event handlers
    handleKeyboardShortcut(e) {
        // Cmd/Ctrl + K for quick search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (this.currentScreen === 'chat') {
                $('#chatInput')?.focus();
            }
        }

        // Cmd/Ctrl + 1-5 for navigation
        if ((e.metaKey || e.ctrlKey) && e.key >= '1' && e.key <= '5') {
            e.preventDefault();
            const screens = ['dashboard', 'projects', 'chat', 'automations', 'profile'];
            const index = parseInt(e.key) - 1;
            if (screens[index]) {
                this.navigateTo(screens[index]);
            }
        }
    }

    handleResize() {
        // Resize charts
        const charts = ['trafficChart', 'rankingChart', 'keywordChart'];
        charts.forEach(chartId => {
            const chart = chartManager.getChart(chartId);
            if (chart) {
                chart.resize();
            }
        });
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'visible' && this.isInitialized) {
            // Resume animations and updates
            animationManager.startPerformanceMonitoring();
        }
    }

    handleLogout() {
        if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
            session.clear();
            showNotification('Çıkış yapıldı', 'success');
            // In a real app, redirect to login
        }
    }

    // Utility methods
    getCurrentScreen() {
        return this.currentScreen;
    }

    getUserData() {
        return this.user;
    }

    getProjectData() {
        return this.data.projects;
    }

    isInitialized() {
        return this.isInitialized;
    }
}

// Global screen initialization function
window.initializeScreen = function(screenName) {
    if (window.seoApp) {
        return window.seoApp.initializeScreen(screenName);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Create global app instance
        window.seoApp = new SEOSuiteApp();
        
        // Make app globally accessible
        window.SEOSuiteApp = SEOSuiteApp;
        
        console.log('SEO Suite App DOMContentLoaded');
        
    } catch (error) {
        handleError(error, 'App initialization');
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.seoApp) {
        // Cleanup
        destroyAllCharts();
        animationManager.destroy();
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOSuiteApp;
}