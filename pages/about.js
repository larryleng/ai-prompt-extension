/**
 * 关于作者页面 JavaScript 功能
 */

// 动态数据库客户端
let databaseClient = null;

class AboutPage {
    constructor() {
        this.socialMediaData = [];
        this.init();
    }

    /**
     * 初始化页面功能
     */
    async init() {
        this.initThemeToggle();
        this.initBackButton();
        this.loadTheme();
        await this.loadAuthorData();
        await this.loadSocialMediaData();
    }

    /**
     * 动态导入数据库客户端
     */
    async initDatabaseClient() {
        if (!databaseClient) {
            try {
                const module = await import('./modules/api/databaseService.js');
                databaseClient = module.databaseClient;
            } catch (error) {
                return false;
            }
        }
        return true;
    }

    /**
     * 获取作者信息
     */
    async getAuthorData() {
        try {
            // 尝试初始化数据库客户端
            const dbAvailable = await this.initDatabaseClient();
            if (!dbAvailable || !databaseClient) {
                return this.getDefaultAuthorData();
            }

            const data = await databaseClient.getAuthorById(1);
            
            if (data && data.length > 0) {
                return data[0];
            } else {
                return this.getDefaultAuthorData();
            }
        } catch (error) {
            return this.getDefaultAuthorData();
        }
    }

    /**
     * 获取默认作者信息（离线模式）
     */
    getDefaultAuthorData() {
        return {
            name: '作者',
            bio: '欢迎访问我的个人页面',
            avatar_url: './styles/images/default-avatar.png',
            email: 'contact@example.com'
        };
    }

    /**
     * 加载作者数据并更新页面
     */
    async loadAuthorData() {
        const authorSection = document.querySelector('.author-info-section');
        
        try {
            const authorData = await this.getAuthorData();
            
            if (authorData) {
                // 更新作者头像
                const avatarImg = document.querySelector('.avatar-img');
                if (avatarImg && authorData.avatar_url) {
                    avatarImg.src = authorData.avatar_url;
                }
                
                // 更新作者名称
                const authorName = document.querySelector('.author-name');
                if (authorName && authorData.name) {
                    authorName.textContent = authorData.name;
                }
                
                // 更新作者职位
                const authorTitle = document.querySelector('.author-title');
                if (authorTitle && authorData.title) {
                    authorTitle.textContent = authorData.title;
                }
                
                // 更新作者简介
                if (authorData.bio) {
                    const bioParagraphs = authorData.bio.split('\n\n');
                    const bioContainer = document.querySelector('.author-details');
                    
                    // 移除现有的简介段落
                    const existingBios = document.querySelectorAll('.author-bio');
                    existingBios.forEach(bio => bio.remove());
                    
                    // 在作者座右铭前插入新的简介段落
                    const motto = document.querySelector('.author-motto');
                    bioParagraphs.forEach(paragraph => {
                        const p = document.createElement('p');
                        p.className = 'author-bio';
                        p.textContent = paragraph;
                        bioContainer.insertBefore(p, motto);
                    });
                    
                    // 更新座右铭
                    if (authorData.motto) {
                        const authorMotto = document.querySelector('.author-motto');
                        if (authorMotto) {
                            authorMotto.textContent = authorData.motto;
                        }
                    }
                }
            }
        } catch (error) {
            // 保留默认作者信息
        }
    }

    /**
     * 获取所有活跃的社交媒体账号
     */
    async getAllSocialMedia() {
        try {
            // 尝试初始化数据库客户端
            const dbAvailable = await this.initDatabaseClient();
            if (!dbAvailable || !databaseClient) {
                return this.getDefaultSocialMediaData();
            }
            
            // 首先尝试获取社交媒体表数据
            try {
                const socialMediaData = await databaseClient.getSocialMedia({activeOnly: true});
                if (socialMediaData && socialMediaData.length > 0) {
                    return socialMediaData;
                }
            } catch (socialMediaError) {
                // 社交媒体表查询失败，尝试使用外部链接表
            }
            
            // 如果社交媒体表没有数据或不存在，使用外部链接表
            const externalLinksData = await databaseClient.getExternalLinks(true);
            if (externalLinksData && externalLinksData.length > 0) {
                // 将外部链接数据转换为社交媒体数据格式
                return externalLinksData.map(link => ({
                    platform_name: link.title || link.name || 'Unknown',
                    profile_url: link.url,
                    account_id: link.description || '',
                    description: link.description || '',
                    author_id: link.author_id || null,
                    authors: link.authors || null,
                    is_active: link.is_active
                }));
            } else {
                return this.getDefaultSocialMediaData();
            }
        } catch (error) {
            return this.getDefaultSocialMediaData();
        }
    }

    /**
     * 获取默认社交媒体信息（离线模式）
     */
    getDefaultSocialMediaData() {
        return [
            {
                platform_name: 'GitHub',
                profile_url: 'https://github.com',
                account_id: 'daxigua-tools',
                description: 'GitHub 项目主页',
                is_active: true
            },
            {
                platform_name: 'WeChat',
                profile_url: null,
                account_id: '150 650 1711',
                description: '微信联系',
                is_active: true
            }
        ];
    }

    /**
     * 加载社交媒体数据并更新页面
     */
    async loadSocialMediaData() {
        const contactSection = document.querySelector('.contact-section');
        if (!contactSection) return;

        // 显示加载状态
        this.showLoadingState(contactSection);

        try {
            this.socialMediaData = await this.getAllSocialMedia();
            this.renderContactItems();
        } catch (error) {
            // 使用默认数据而不是显示错误状态
            this.socialMediaData = this.getDefaultSocialMediaData();
            this.renderContactItems();
        }
    }

    /**
     * 显示加载状态
     */
    showLoadingState(container) {
        const contactItems = container.querySelector('.contact-items');
        if (contactItems) {
            contactItems.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <span>正在加载联系方式...</span>
                </div>
            `;
        }
    }

    /**
     * 渲染联系方式项目
     */
    renderContactItems() {
        const contactItems = document.querySelector('.contact-items');
        if (!contactItems) return;

        let html = '';

        // 如果有社交媒体数据，使用数据库数据
        if (this.socialMediaData && this.socialMediaData.length > 0) {
            this.socialMediaData.forEach(item => {
                const iconSrc = this.getPlatformIcon(item.platform_name);
                const displayName = this.getPlatformDisplayName(item.platform_name);
                
                html += `
                    <div class="contact-item">
                        <img src="${iconSrc}" alt="${displayName}" class="contact-icon">
                        <div class="contact-info">
                            ${item.profile_url ? 
                                `<a href="${item.profile_url}" class="contact-link" target="_blank" rel="noopener noreferrer">
                                    ${displayName}${item.account_id ? ` (@${item.account_id})` : ''}
                                </a>` : 
                                `<span class="contact-text">${displayName}${item.account_id ? ` (@${item.account_id})` : ''}</span>`
                            }
                            ${item.description ? `<span class="contact-description">${item.description}</span>` : ''}
                        </div>
                    </div>
                `;
            });

            // 添加作者邮箱（如果有的话）
            const authorWithEmail = this.socialMediaData.find(item => item.author_id && item.authors && item.authors.email);
            if (authorWithEmail && authorWithEmail.authors && authorWithEmail.authors.email) {
                html += `
                    <div class="contact-item">
                        <img src="../images/settings.png" alt="邮箱" class="contact-icon">
                        <span class="contact-text clickable-email">${authorWithEmail.authors.email}</span>
                    </div>
                `;
            }
        } else {
            // 如果没有数据，显示默认联系方式
            html = `
                <div class="contact-item">
                    <img src="../images/settings.png" alt="邮箱" class="contact-icon">
                    <span class="contact-text clickable-email">support@daxigua-tools.com</span>
                </div>
                <div class="contact-item">
                    <img src="../images/settings.png" alt="GitHub" class="contact-icon">
                    <a href="#" class="contact-link">GitHub 项目主页</a>
                </div>
                <div class="contact-item">
                    <img src="../images/bell-ring.png" alt="反馈" class="contact-icon">
                    <span class="contact-text">欢迎反馈建议和问题</span>
                </div>
            `;
        }

        contactItems.innerHTML = html;

        // 为邮箱添加点击复制功能
        this.initEmailCopyFeature();
    }

    /**
     * 根据平台名称获取对应的图标
     */
    getPlatformIcon(platformName) {
        const iconMap = {
            'GitHub': '../images/settings.png',
            'Twitter': '../images/settings.png',
            'WeChat': '../images/settings.png',
            'Weibo': '../images/settings.png',
            'QQ': '../images/settings.png',
            'Email': '../images/settings.png',
            'LinkedIn': '../images/settings.png',
            'Facebook': '../images/settings.png'
        };
        return iconMap[platformName] || '../images/settings.png';
    }

    /**
     * 根据平台名称获取显示名称
     */
    getPlatformDisplayName(platformName) {
        const displayMap = {
            'GitHub': 'GitHub',
            'Twitter': 'Twitter',
            'WeChat': '微信',
            'Weibo': '微博',
            'QQ': 'QQ',
            'Email': '邮箱',
            'LinkedIn': 'LinkedIn',
            'Facebook': 'Facebook'
        };
        return displayMap[platformName] || platformName;
    }

    /**
     * 初始化邮箱复制功能
     */
    initEmailCopyFeature() {
        const emailElements = document.querySelectorAll('.clickable-email');
        emailElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.title = '点击复制邮箱地址';
            element.addEventListener('click', () => {
                this.copyEmail(element.textContent);
            });
        });
    }

    /**
     * 初始化主题切换功能
     */
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    /**
     * 初始化返回按钮功能
     */
    initBackButton() {
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.goBack();
            });
        }
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // 保存主题设置到本地存储
        try {
            localStorage.setItem('theme', newTheme);
        } catch (error) {
            // 静默处理错误
        }
    }

    /**
     * 加载保存的主题设置
     */
    loadTheme() {
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
            } else {
                // 默认使用浅色主题
                document.documentElement.setAttribute('data-theme', 'light');
            }
        } catch (error) {
            // 默认使用浅色主题
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    /**
     * 返回上一页或主页
     */
    goBack() {
        // 尝试返回上一页
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // 如果没有历史记录，返回主页
            window.location.href = 'index.html';
        }
    }

    /**
     * 复制邮箱地址到剪贴板
     */
    copyEmail(email) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(() => {
                this.showMessage('邮箱地址已复制到剪贴板');
            }).catch(error => {
                this.fallbackCopyEmail(email);
            });
        } else {
            this.fallbackCopyEmail(email);
        }
    }

    /**
     * 备用复制方法
     */
    fallbackCopyEmail(email) {
        const textArea = document.createElement('textarea');
        textArea.value = email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showMessage('邮箱地址已复制到剪贴板');
        } catch (error) {
            this.showMessage('复制失败，请手动复制邮箱地址');
        }
        
        document.body.removeChild(textArea);
    }

    /**
     * 显示消息提示
     */
    showMessage(message) {
        // 创建消息提示元素
        const messageEl = document.createElement('div');
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        // 3秒后自动移除
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new AboutPage();
});