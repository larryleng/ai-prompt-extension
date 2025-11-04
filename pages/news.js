// 新闻页面JavaScript文件

// 新闻时间戳管理器
class NewsTimestampManager {
  constructor() {
    this.timestampFilePath = '../config/newsTimestamp.json';
  }

  // 读取时间戳文件
  async loadTimestamp() {
    try {
      const response = await fetch(this.timestampFilePath);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return { lastViewedTimestamp: null, lastUpdated: null };
    } catch (error) {
      console.error('读取时间戳文件失败:', error);
      // 使用localStorage作为备选方案
      const stored = localStorage.getItem('newsTimestamp');
      return stored ? JSON.parse(stored) : { lastViewedTimestamp: null, lastUpdated: null };
    }
  }

  // 保存时间戳（使用localStorage作为主要存储方式）
  async saveTimestamp(timestamp) {
    try {
      const timestampData = {
        lastViewedTimestamp: timestamp,
        lastUpdated: new Date().toISOString(),
        description: "存储用户最后查看新闻的时间戳信息"
      };
      
      // 保存到localStorage（完整对象格式，保持兼容性）
      localStorage.setItem('newsTimestamp', JSON.stringify(timestampData));
      
      // 同时保存简单格式供首页使用
      localStorage.setItem('lastViewedNewsTimestamp', timestamp);
      
      return true;
    } catch (error) {
      console.error('保存时间戳失败:', error);
      return false;
    }
  }

  // 获取当前时间戳
  getCurrentTimestamp() {
    return new Date().toISOString();
  }

  // 更新最后查看时间
  async updateLastViewedTime() {
    const currentTime = this.getCurrentTimestamp();
    await this.saveTimestamp(currentTime);
    return currentTime;
  }
}

// 主题管理器
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.themeToggleBtn = null;
  }

  init() {
    // 应用保存的主题
    this.applyTheme(this.currentTheme);
    
    // 绑定主题切换按钮事件
    this.themeToggleBtn = document.getElementById('themeToggle');
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

class NewsPage {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.isLoading = false;
        this.totalNews = 0;
        this.currentCategory = 'all'; // 当前选中的分类
        this.currentTag = null; // 当前选中的标签
        this.expandedNewsId = null; // 当前展开的新闻ID
        this.favoriteNewsIds = new Set(); // 收藏的新闻ID集合
        this.allNewsData = []; // 存储所有新闻数据用于收藏筛选
        this.currentNewsData = []; // 存储当前页面显示的新闻数据
        
        // 分类名称到ID的映射
        this.categoryMapping = {
            '业界': 6,
            '技巧': 7,
            '推荐': 8,
            '更新': 9
        };
        
        // 初始化时间戳管理器
        this.timestampManager = new NewsTimestampManager();
        
        this.init();
    }

    async init() {
        this.loadFavorites();
        this.bindEvents();
        
        // 进入新闻页面时立即更新时间戳，标记用户已查看最新新闻
        await this.timestampManager.updateLastViewedTime();
        
        this.loadNews();
    }

    bindEvents() {
        // 返回按钮功能
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // 分页功能
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.expandedNewsId = null; // 重置展开状态
                this.loadNews();
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.currentPage++;
            this.expandedNewsId = null; // 重置展开状态
            this.loadNews();
        });

        // 分类筛选按钮事件
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterByCategory(category);
            });
        });
    }

    async loadNews() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading();

        try {
            let newsData;
            
            if (this.currentCategory === 'favorites') {
                // 显示收藏的新闻
                newsData = await this.loadFavoriteNews();
            } else if (this.currentTag) {
                // 按标签筛选新闻
                newsData = await this.loadNewsByTag(this.currentTag);
            } else {
                // 动态导入数据库客户端
                const { databaseClient } = await import('./modules/api/databaseService.js');
                
                // 获取分页新闻
                const offset = (this.currentPage - 1) * this.pageSize;
                
                if (this.currentCategory === 'all') {
                    // 获取所有新闻
                    newsData = await databaseClient.getNews({
                        limit: this.pageSize,
                        offset: offset,
                        status: 'published'
                    });
                } else {
                    // 按分类筛选新闻，使用分类ID
                    const categoryId = this.categoryMapping[this.currentCategory];
                    newsData = await databaseClient.getNews({
                        categoryId: categoryId,
                        limit: this.pageSize,
                        offset: offset,
                        status: 'published'
                    });
                }
            }

            if (newsData && newsData.length > 0) {
                this.displayNews(newsData);
                this.updatePagination(newsData.length);
            } else {
                this.showNoData();
            }

        } catch (error) {
            console.error('加载新闻失败:', error);
            // 显示友好的离线提示
            this.showOfflineMessage();
        } finally {
            this.isLoading = false;
        }
    }

    showLoading() {
        const newsContent = document.getElementById('newsContent');
        
        // 创建加载容器和加载动画
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-container';
        
        const loadingSpinner = document.createElement('div');
        loadingSpinner.className = 'loading-spinner';
        
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = '正在加载新闻数据...';
        
        loadingContainer.appendChild(loadingSpinner);
        loadingContainer.appendChild(loadingText);
        
        // 创建骨架屏效果
        const skeletonContainer = document.createElement('div');
        skeletonContainer.className = 'skeleton-container';
        
        // 生成多个骨架屏项目
        for (let i = 0; i < 3; i++) {
            const skeletonItem = document.createElement('div');
            skeletonItem.className = 'skeleton-news-item';
            
            skeletonItem.innerHTML = `
                <div class="skeleton-header">
                    <div class="skeleton-category"></div>
                    <div class="skeleton-date"></div>
                </div>
                <div class="skeleton-title"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
                <div class="skeleton-tags">
                    <div class="skeleton-tag"></div>
                    <div class="skeleton-tag"></div>
                    <div class="skeleton-tag"></div>
                </div>
            `;
            
            skeletonContainer.appendChild(skeletonItem);
        }
        
        // 清空内容并添加加载效果
        newsContent.innerHTML = '';
        newsContent.appendChild(loadingContainer);
        newsContent.appendChild(skeletonContainer);
        
        const pagination = document.getElementById('pagination');
        pagination.style.display = 'none';
    }

    showError(message) {
        const newsContent = document.getElementById('newsContent');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = String(message || '加载失败，请稍后重试');
        newsContent.textContent = '';
        newsContent.appendChild(errorDiv);
        
        const pagination = document.getElementById('pagination');
        pagination.style.display = 'none';
    }

    showNoData() {
        const newsContent = document.getElementById('newsContent');
        const container = document.createElement('div');
        container.className = 'no-data';
        const h3 = document.createElement('h3');
        h3.textContent = '暂无新闻数据';
        const p = document.createElement('p');
        p.textContent = '请稍后再试';
        container.appendChild(h3);
        container.appendChild(p);
        newsContent.textContent = '';
        newsContent.appendChild(container);
        
        const pagination = document.getElementById('pagination');
        pagination.style.display = 'none';
    }

    showOfflineMessage() {
        const newsContent = document.getElementById('newsContent');
        const container = document.createElement('div');
        container.className = 'offline-message';
        container.style.cssText = `
            text-align: center;
            padding: 60px 20px;
            color: var(--text-secondary);
        `;
        
        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 48px;
            margin-bottom: 20px;
            opacity: 0.6;
        `;
        icon.textContent = '📡';
        
        const h3 = document.createElement('h3');
        h3.textContent = '离线模式';
        h3.style.cssText = `
            margin: 0 0 10px 0;
            color: var(--text-primary);
        `;
        
        const p = document.createElement('p');
        p.textContent = '无法连接到服务器，请检查网络连接';
        p.style.cssText = `
            margin: 0;
            opacity: 0.8;
        `;
        
        container.appendChild(icon);
        container.appendChild(h3);
        container.appendChild(p);
        newsContent.textContent = '';
        newsContent.appendChild(container);
        
        const pagination = document.getElementById('pagination');
        pagination.style.display = 'none';
    }

    displayNews(newsData) {
        // 保存当前页面的新闻数据
        this.currentNewsData = newsData;
        
        const newsContent = document.getElementById('newsContent');
        
        const newsListHTML = newsData.map(news => {
            const publishDate = this.formatDate(news.published_at || news.created_at);
            const category = news.categories ? news.categories.name : '未分类';
            const isExpanded = this.expandedNewsId === news.id;
            const isFavorited = this.favoriteNewsIds.has(news.id);
            
            return `
                <div class="news-item ${isExpanded ? 'expanded' : ''}" data-news-id="${news.id}">
                    <div class="news-item-header">
                        <div class="news-item-title-container">
                            ${this.renderCategoryTag(category)}
                            <h3 class="news-item-title">${this.escapeHtml(news.title)}</h3>
                        </div>
                        <div class="news-item-actions">
                            <span class="expand-indicator ${isExpanded ? 'expanded' : ''}">▼</span>
                        </div>
                    </div>
                    <div class="news-item-meta">
                        <span>${publishDate}</span>
                        ${this.renderTagsWithFavorite(news.tags, news.id, isFavorited)}
                    </div>
                    <div class="news-item-content ${isExpanded ? 'expanded' : ''}">
                        <div class="news-content-text">${this.sanitizeHtml(news.content || '')}</div>
                    </div>
                </div>
            `;
        }).join('');

        newsContent.innerHTML = `<div class="news-list">${newsListHTML}</div>`;
        
        // 为新闻项目添加点击事件
        this.bindNewsItemEvents();
        // 为收藏按钮添加点击事件
        this.bindFavoriteEvents();
    }

    async updatePagination(currentPageCount) {
        const pagination = document.getElementById('pagination');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const pageNumbers = document.getElementById('pageNumbers');

        // 获取总记录数
        let totalCount = 0;
        try {
            if (this.currentCategory === 'favorites') {
                // 收藏页面：使用收藏新闻的数量作为总记录数
                totalCount = this.favoriteNewsIds.size;
            } else {
                // 动态导入数据库客户端
                const { databaseClient } = await import('./modules/api/databaseService.js');
                
                // 其他页面：从数据库获取总记录数
                const filters = {};
                if (this.currentCategory !== 'all') {
                    filters.categoryId = this.categoryMapping[this.currentCategory];
                }
                totalCount = await databaseClient.getNewsCount(filters);
            }
        } catch (error) {
            console.error('获取新闻总数失败:', error);
            totalCount = this.currentPage * this.pageSize; // 使用估算值
        }

        const totalPages = Math.ceil(totalCount / this.pageSize);

        // 如果总页数小于等于1，隐藏分页控件
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        // 显示分页控件
        pagination.style.display = 'flex';

        // 更新按钮状态
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= totalPages;

        // 生成页码按钮
        this.generatePageNumbers(totalPages);
    }

    generatePageNumbers(totalPages) {
        const pageNumbers = document.getElementById('pageNumbers');
        pageNumbers.innerHTML = '';

        if (totalPages <= 1) {
            return;
        }

        const currentPage = this.currentPage;

        // 页码显示逻辑
        if (totalPages <= 5) {
            // 总页数小于等于5，显示所有页码
            for (let i = 1; i <= totalPages; i++) {
                this.createPageButton(i, i === currentPage);
            }
        } else {
            // 总页数大于5，使用省略号
            if (currentPage <= 3) {
                // 当前页在前3页
                for (let i = 1; i <= 4; i++) {
                    this.createPageButton(i, i === currentPage);
                }
                this.createEllipsis();
                this.createPageButton(totalPages, false);
            } else if (currentPage >= totalPages - 2) {
                // 当前页在后3页
                this.createPageButton(1, false);
                this.createEllipsis();
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    this.createPageButton(i, i === currentPage);
                }
            } else {
                // 当前页在中间
                this.createPageButton(1, false);
                this.createEllipsis();
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    this.createPageButton(i, i === currentPage);
                }
                this.createEllipsis();
                this.createPageButton(totalPages, false);
            }
        }
    }

    createPageButton(pageNumber, isActive) {
        const pageNumbers = document.getElementById('pageNumbers');
        const button = document.createElement('button');
        button.className = `page-btn ${isActive ? 'active' : ''}`;
        button.textContent = pageNumber;
        button.addEventListener('click', () => {
            if (pageNumber !== this.currentPage) {
                this.currentPage = pageNumber;
                this.loadNews();
            }
        });
        pageNumbers.appendChild(button);
    }

    createEllipsis() {
        const pageNumbers = document.getElementById('pageNumbers');
        const ellipsis = document.createElement('span');
        ellipsis.className = 'page-ellipsis';
        ellipsis.textContent = '...';
        pageNumbers.appendChild(ellipsis);
    }

    formatDate(dateString) {
        if (!dateString) return '未知时间';
        
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        } catch (error) {
            return '时间格式错误';
        }
    }

    truncateContent(content, maxLength) {
        if (!content) return '';
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 安全的 HTML 白名单解析（允许有限标签与属性）
    sanitizeHtml(html) {
        if (!html) return '';
        const allowedTags = new Set(['A','P','BR','B','STRONG','I','EM','UL','OL','LI','CODE','PRE','BLOCKQUOTE']);
        const allowedAttrs = { 'A': ['href', 'target', 'rel'] };
        const container = document.createElement('div');
        container.innerHTML = html;

        const walk = (node) => {
            const children = Array.from(node.childNodes);
            for (const child of children) {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    const tag = child.tagName.toUpperCase();

                    // 非白名单标签：保留纯文本内容
                    if (!allowedTags.has(tag)) {
                        const textNode = document.createTextNode(child.textContent || '');
                        node.replaceChild(textNode, child);
                        continue;
                    }

                    // 清理不允许的属性，移除事件属性与 style
                    const attrs = Array.from(child.attributes);
                    for (const attr of attrs) {
                        const name = attr.name.toLowerCase();
                        const allowedForTag = allowedAttrs[tag] || [];
                        const keep = allowedForTag.includes(name);
                        if (!keep || name.startsWith('on') || name === 'style') {
                            child.removeAttribute(attr.name);
                        }
                    }

                    // 特殊处理链接
                    if (tag === 'A') {
                        let href = child.getAttribute('href') || '';
                        try {
                            const url = new URL(href, location.origin);
                            const protocol = url.protocol;
                            if (protocol !== 'http:' && protocol !== 'https:') {
                                child.removeAttribute('href');
                            } else {
                                child.setAttribute('href', url.href);
                            }
                        } catch (e) {
                            child.removeAttribute('href');
                        }
                        const target = child.getAttribute('target');
                        if (target !== '_blank' && target !== '_self') {
                            child.removeAttribute('target');
                        }
                        child.setAttribute('rel', 'noopener noreferrer');
                    }

                    // 递归处理子节点
                    walk(child);
                }
            }
        };

        walk(container);
        return container.innerHTML;
    }

    // 渲染标签
    renderTags(tags) {
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            return '';
        }
        
        const tagElements = tags.map(tag => 
            `<span class="news-tag clickable-tag" data-tag="${this.escapeHtml(tag)}" title="点击筛选相同标签的新闻">${this.escapeHtml(tag)}</span>`
        ).join('');
        
        return `<div class="news-tags">${tagElements}</div>`;
    }

    // 渲染分类标签
    renderCategoryTag(category) {
        if (!category || category === '未分类') {
            return '';
        }
        
        // 根据分类名称生成对应的CSS类名
        const categoryClass = this.getCategoryClass(category);
        
        return `<span class="news-category-tag ${categoryClass} clickable-category" data-category="${this.escapeHtml(category)}" title="点击筛选相同分类的新闻">${this.escapeHtml(category)}</span>`;
    }

    // 根据分类名称获取对应的CSS类名
    getCategoryClass(category) {
        const categoryMap = {
            '业界': 'category-industry',
            '技巧': 'category-skill',
            '推荐': 'category-recommend',
            '更新': 'category-update'
        };
        
        return categoryMap[category] || 'category-default';
    }

    // 渲染标签和收藏按钮
    renderTagsWithFavorite(tags, newsId, isFavorited, isExpanded = null) {
        const tagsHtml = this.renderTags(tags);
        const favoriteBtn = `
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-news-id="${newsId}" title="${isFavorited ? '取消收藏' : '收藏'}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
        `;
        
        // 复制按钮，只在新闻展开时显示
        // 如果传入了isExpanded参数，使用该参数；否则使用当前的expandedNewsId
        const expanded = isExpanded !== null ? isExpanded : (this.expandedNewsId === newsId);
        const copyBtn = expanded ? `
            <button class="copy-btn" data-news-id="${newsId}" title="复制新闻内容">
                <img src="../images/copy.png" width="18" height="18" alt="复制">
            </button>
        ` : '';
        
        if (tagsHtml) {
            return `<div class="news-tags-container">${tagsHtml}${favoriteBtn}${copyBtn}</div>`;
        } else {
            return `<div class="news-tags-container">${favoriteBtn}${copyBtn}</div>`;
        }
    }

    // 分类筛选方法
    filterByCategory(category) {
        // 更新当前分类
        this.currentCategory = category;
        
        // 重置当前标签（确保分类筛选和标签筛选互相独立）
        this.currentTag = null;
        
        // 重置到第一页
        this.currentPage = 1;
        
        // 重置展开状态
        this.expandedNewsId = null;
        
        // 更新按钮状态
        this.updateFilterButtons(category);
        
        // 重新加载新闻
        this.loadNews();
    }

    // 标签筛选方法
    filterByTag(tag) {
        // 更新当前标签
        this.currentTag = tag;
        
        // 重置分类筛选
        this.currentCategory = 'all';
        
        // 重置到第一页
        this.currentPage = 1;
        
        // 重置展开状态
        this.expandedNewsId = null;
        
        // 更新按钮状态
        this.updateFilterButtons('all');
        
        // 重新加载新闻
        this.loadNews();
    }

    // 更新筛选按钮状态
    updateFilterButtons(activeCategory) {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            const btnCategory = btn.getAttribute('data-category');
            if (btnCategory === activeCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 为新闻项目绑定点击事件
    bindNewsItemEvents() {
        // 移除之前可能存在的事件监听器
        const newsContent = document.getElementById('newsContent');
        if (this.newsContentClickHandler) {
            newsContent.removeEventListener('click', this.newsContentClickHandler);
        }
        
        // 使用事件委托，在父容器上绑定点击事件
        this.newsContentClickHandler = (e) => {
            // 处理新闻标题点击
            if (e.target.classList.contains('news-item-title') || e.target.closest('.news-item-title')) {
                // 检查点击的是否是标签或分类标签，如果是则不处理
                if (e.target.classList.contains('clickable-tag') || 
                    e.target.classList.contains('clickable-category')) {
                    return;
                }
                
                const newsItem = e.target.closest('.news-item');
                if (newsItem) {
                    const newsId = parseInt(newsItem.getAttribute('data-news-id'));
                    this.toggleNewsExpansion(newsId);
                }
                return;
            }
            
            // 处理新闻头部区域点击（包括标题行的空白区域）
            if (e.target.classList.contains('news-item-header') || e.target.closest('.news-item-header')) {
                // 检查点击的是否是标签或分类标签，如果是则不处理
                if (e.target.classList.contains('clickable-tag') || 
                    e.target.classList.contains('clickable-category')) {
                    return;
                }
                
                const newsItem = e.target.closest('.news-item');
                if (newsItem) {
                    const newsId = parseInt(newsItem.getAttribute('data-news-id'));
                    this.toggleNewsExpansion(newsId);
                }
                return;
            }
            
            // 处理标签区域点击
            if (e.target.classList.contains('news-item-meta') || e.target.closest('.news-item-meta')) {
                // 检查点击的是否是标签、分类标签、收藏按钮或复制按钮，如果是则不处理
                if (e.target.classList.contains('clickable-tag') || 
                    e.target.classList.contains('clickable-category') ||
                    e.target.classList.contains('favorite-btn') ||
                    e.target.classList.contains('copy-btn') ||
                    e.target.closest('.favorite-btn') ||
                    e.target.closest('.copy-btn')) {
                    return;
                }
                
                const newsItem = e.target.closest('.news-item');
                if (newsItem) {
                    const newsId = parseInt(newsItem.getAttribute('data-news-id'));
                    this.toggleNewsExpansion(newsId);
                }
                return;
            }
            
            // 处理展开指示器点击
            if (e.target.classList.contains('expand-indicator')) {
                e.stopPropagation(); // 阻止事件冒泡
                const newsItem = e.target.closest('.news-item');
                if (newsItem) {
                    const newsId = parseInt(newsItem.getAttribute('data-news-id'));
                    this.toggleNewsExpansion(newsId);
                }
                return;
            }
        };
        
        newsContent.addEventListener('click', this.newsContentClickHandler);
        
        // 为标签绑定点击事件
        this.bindTagEvents();
        
        // 为复制按钮绑定点击事件
        this.bindCopyEvents();
    }
    
    // 为标签绑定点击事件
    bindTagEvents() {
        const clickableTags = document.querySelectorAll('.clickable-tag');
        clickableTags.forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡，避免触发新闻展开
                const tagName = tag.getAttribute('data-tag');
                if (tagName) {
                    this.filterByTag(tagName);
                }
            });
        });

        // 为分类标签绑定点击事件
        const clickableCategories = document.querySelectorAll('.clickable-category');
        clickableCategories.forEach(category => {
            category.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡，避免触发新闻展开
                const categoryName = category.getAttribute('data-category');
                if (categoryName) {
                    this.filterByCategory(categoryName);
                }
            });
        });
    }

    // 切换新闻展开/收缩状态
    toggleNewsExpansion(newsId) {
        if (this.expandedNewsId === newsId) {
            // 如果点击的是已展开的新闻，则收缩
            this.expandedNewsId = null;
        } else {
            // 展开新的新闻，收缩其他新闻
            this.expandedNewsId = newsId;
            
            // 当展开新闻时，更新时间戳
            this.updateNewsTimestamp(newsId);
        }
        
        // 重新渲染新闻列表以更新展开状态
        this.updateNewsItemsDisplay();
    }

    // 更新新闻时间戳
    async updateNewsTimestamp(newsId) {
        try {
            // 获取当前新闻的时间信息
            const currentNews = this.currentNewsData.find(news => news.id === newsId);
            if (currentNews) {
                const newsTimestamp = currentNews.published_at || currentNews.created_at;
                
                // 更新最后查看时间戳
                await this.timestampManager.updateLastViewedTime();
                
                // 可以在这里添加更多逻辑，比如标记为已读等
            }
        } catch (error) {
            console.error('更新新闻时间戳失败:', error);
        }
    }

    // 更新新闻项目的展开状态显示
    updateNewsItemsDisplay() {
        const newsItems = document.querySelectorAll('.news-item');
        newsItems.forEach(item => {
            const newsId = parseInt(item.getAttribute('data-news-id'));
            const isExpanded = this.expandedNewsId === newsId;
            
            // 更新新闻项目的展开状态
            if (isExpanded) {
                item.classList.add('expanded');
            } else {
                item.classList.remove('expanded');
            }
            
            // 更新展开指示器
            const indicator = item.querySelector('.expand-indicator');
            if (indicator) {
                if (isExpanded) {
                    indicator.classList.add('expanded');
                } else {
                    indicator.classList.remove('expanded');
                }
            }
            
            // 更新内容区域的展开状态
            const contentArea = item.querySelector('.news-item-content');
            if (contentArea) {
                if (isExpanded) {
                    contentArea.classList.add('expanded');
                } else {
                    contentArea.classList.remove('expanded');
                }
            }
            
            // 重新渲染标签和按钮区域以显示/隐藏复制按钮
            const metaContainer = item.querySelector('.news-item-meta');
            if (metaContainer) {
                // 获取新闻数据
                const news = this.currentNewsData.find(n => n.id === newsId);
                if (news) {
                    const isFavorited = this.favoriteNewsIds.has(newsId);
                    const publishDate = this.formatDate(news.published_at || news.created_at);
                    
                    // 重新生成标签和按钮HTML
                    metaContainer.innerHTML = `
                        <span>${publishDate}</span>
                        ${this.renderTagsWithFavorite(news.tags, news.id, isFavorited, isExpanded)}
                    `;
                }
            }
        });
        
        // 重新绑定事件监听器
        this.bindNewsItemEvents();
        this.bindFavoriteEvents();
    }

    // 收藏管理方法
    loadFavorites() {
        const favorites = localStorage.getItem('favoriteNews');
        if (favorites) {
            this.favoriteNewsIds = new Set(JSON.parse(favorites));
        }
    }

    saveFavorites() {
        localStorage.setItem('favoriteNews', JSON.stringify([...this.favoriteNewsIds]));
    }

    toggleFavorite(newsId) {
        if (this.favoriteNewsIds.has(newsId)) {
            this.favoriteNewsIds.delete(newsId);
        } else {
            this.favoriteNewsIds.add(newsId);
        }
        this.saveFavorites();
    }

    async loadFavoriteNews() {
        if (this.favoriteNewsIds.size === 0) {
            return [];
        }

        try {
            // 动态导入数据库客户端
            const { databaseClient } = await import('./modules/api/databaseService.js');
            
            // 获取所有收藏的新闻
            const favoriteIds = [...this.favoriteNewsIds];
            const favoriteNews = [];

            // 分批获取收藏的新闻（避免URL过长）
            for (let i = 0; i < favoriteIds.length; i += 10) {
                const batch = favoriteIds.slice(i, i + 10);
                const batchNews = await Promise.all(
                    batch.map(id => databaseClient.getNewsById(id))
                );
                
                // 过滤掉获取失败的新闻并展平数组
                const validNews = batchNews.filter(news => news && news.length > 0).map(news => news[0]);
                favoriteNews.push(...validNews);
            }

            // 按创建时间排序
            favoriteNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            // 实现分页
            const offset = (this.currentPage - 1) * this.pageSize;
            return favoriteNews.slice(offset, offset + this.pageSize);

        } catch (error) {
            console.error('加载收藏新闻失败:', error);
            return [];
        }
    }

    // 按标签加载新闻
    async loadNewsByTag(tag) {
        try {
            // 动态导入数据库客户端
            const { databaseClient } = await import('./modules/api/databaseService.js');
            
            // 由于searchNews方法只搜索标题和内容，不搜索标签字段
            // 我们需要获取所有新闻然后在前端进行标签筛选
            
            // 获取所有已发布的新闻（不分页，以便进行完整的标签筛选）
            const allNews = await databaseClient.getNews({
                limit: 1000, // 获取足够多的新闻进行筛选
                status: 'published'
            });
            
            // 筛选出真正包含该标签的新闻
            const filteredNews = allNews.filter(news => {
                if (news.tags && Array.isArray(news.tags)) {
                    const hasTag = news.tags.some(newsTag => 
                        newsTag.toLowerCase() === tag.toLowerCase()
                    );
                    return hasTag;
                }
                return false;
            });
            
            // 按创建时间排序（最新的在前）
            filteredNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            
            // 实现分页
            const offset = (this.currentPage - 1) * this.pageSize;
            const paginatedNews = filteredNews.slice(offset, offset + this.pageSize);
            
            return paginatedNews;
            
        } catch (error) {
            console.error('按标签加载新闻失败:', error);
            return [];
        }
    }

    // 复制新闻内容
    async copyNewsContent(newsId) {
        try {
            const newsItem = this.currentNewsData.find(news => news.id === newsId);
            if (!newsItem) {
                this.showCopyMessage('未找到新闻内容', false);
                return;
            }

            // 处理标题（纯文本）
            const titleText = `标题：${newsItem.title}\n\n`;
            
            // 处理内容 - 如果包含HTML标签，需要提取纯文本并保持段落结构
            let contentText = '';
            if (newsItem.content) {
                // 创建一个安全的HTML处理函数
                const processHtmlContent = (htmlString) => {
                    // 首先创建临时DOM元素来安全地处理HTML
                    const tempContainer = document.createElement('div');
                    tempContainer.innerHTML = htmlString;
                    
                    // 遍历所有文本节点和元素，构建带换行的纯文本
                    const extractTextWithLineBreaks = (element) => {
                        let result = '';
                        
                        for (const node of element.childNodes) {
                            if (node.nodeType === Node.TEXT_NODE) {
                                // 文本节点直接添加内容
                                result += node.textContent;
                            } else if (node.nodeType === Node.ELEMENT_NODE) {
                                const tagName = node.tagName.toLowerCase();
                                
                                // 在块级元素前添加换行（除了第一个元素）
                                if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(tagName) && result.length > 0) {
                                    result += '\n';
                                }
                                
                                // 递归处理子元素
                                result += extractTextWithLineBreaks(node);
                                
                                // 在段落和块级元素后添加换行
                                if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
                                    result += '\n';
                                } else if (tagName === 'br') {
                                    result += '\n';
                                } else if (tagName === 'li') {
                                    result += '\n';
                                }
                            }
                        }
                        
                        return result;
                    };
                    
                    return extractTextWithLineBreaks(tempContainer);
                };
                
                // 处理HTML内容
                let plainText = processHtmlContent(newsItem.content);
                
                // 清理多余的空行和空格，但保留段落结构
                plainText = plainText
                    .replace(/\n{3,}/g, '\n\n')  // 将3个或更多连续换行替换为2个
                    .replace(/[ \t]+/g, ' ')     // 将多个空格替换为单个空格
                    .replace(/^\s+|\s+$/g, '')   // 去除首尾空白
                    .replace(/\n /g, '\n')       // 去除换行后的空格
                    .replace(/ \n/g, '\n');      // 去除换行前的空格
                
                contentText = plainText;
            } else {
                contentText = '';
            }
            
            const copyText = titleText + contentText;

            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(copyText);
                this.showCopyMessage('新闻内容已复制到剪贴板', true);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = copyText;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    this.showCopyMessage('新闻内容已复制到剪贴板', true);
                } catch (err) {
                    this.showCopyMessage('复制失败，请手动选择复制', false);
                } finally {
                    textArea.remove();
                }
            }
        } catch (error) {
            console.error('复制新闻内容失败:', error);
            this.showCopyMessage('复制失败，请稍后重试', false);
        }
    }

    // 显示复制结果消息
    showCopyMessage(message, isSuccess) {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `copy-message ${isSuccess ? 'success' : 'error'}`;
        messageEl.textContent = message;
        
        // 添加到页面
        document.body.appendChild(messageEl);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }

    bindFavoriteEvents() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡，避免触发新闻展开
                const newsId = parseInt(btn.getAttribute('data-news-id'));
                this.toggleFavorite(newsId);
                
                // 更新按钮状态
                const isFavorited = this.favoriteNewsIds.has(newsId);
                btn.classList.toggle('favorited', isFavorited);
                btn.title = isFavorited ? '取消收藏' : '收藏';
                
                // 更新SVG填充
                const svg = btn.querySelector('svg');
                if (svg) {
                    svg.setAttribute('fill', isFavorited ? 'currentColor' : 'none');
                }

                // 如果当前在收藏筛选模式下，重新加载数据
                if (this.currentCategory === 'favorites') {
                    this.loadNews();
                }
            });
        });
    }

    bindCopyEvents() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡，避免触发新闻展开
                const newsId = parseInt(btn.getAttribute('data-news-id'));
                this.copyNewsContent(newsId);
            });
        });
    }
}

// 创建主题管理器实例
const themeManager = new ThemeManager();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题管理器
    themeManager.init();
    
    // 直接初始化新闻页面，数据库连接将在需要时动态导入
    new NewsPage();
});