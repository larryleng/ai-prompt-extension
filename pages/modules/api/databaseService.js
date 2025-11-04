/**
 * 大西瓜数据库服务模块
 * 基于 Supabase 的只读数据库访问客户端
 * 提供新闻、代码片段、作者、分类、版本和外部链接等数据的查询功能
 */

// 数据库连接配置（只读）
const DATABASE_CONFIG = {
    url: 'https://xvlhgtktpyohuvocaeuo.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bGhndGt0cHlvaHV2b2NhZXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1Mjc1MzAsImV4cCI6MjA3NjEwMzUzMH0.AIQPqiezRNWuX6GjU6UhQEbXdjLwi649VzaVOHSr-vY'
};

/**
 * 大西瓜数据库客户端类
 * 提供完整的只读数据库访问功能
 */
class WatermelonDatabaseClient {
    constructor() {
        this.baseUrl = `${DATABASE_CONFIG.url}/rest/v1`;
        this.apiKey = DATABASE_CONFIG.anonKey;
        
        // HTTP 请求头配置
        this.headers = {
            'apikey': this.apiKey,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
        
        // 缓存配置
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
    }
    
    /**
     * 错误分类和处理
     * @param {Error} error - 原始错误
     * @param {Response} response - HTTP响应对象（可选）
     * @returns {Object} 分类后的错误信息
     */
    classifyDatabaseError(error, response = null) {
        const message = error.message.toLowerCase();
        
        // 网络连接错误
        if (message.includes('fetch') || message.includes('network') || message.includes('connection') || 
            message.includes('timeout') || error.name === 'TypeError') {
            return {
                type: 'NETWORK',
                category: '网络连接错误',
                suggestion: '请检查网络连接，确保能够访问数据库服务器',
                retryable: true
            };
        }
        
        // HTTP状态码错误
        if (response) {
            const status = response.status;
            if (status === 401) {
                return {
                    type: 'PERMISSION',
                    category: '认证失败',
                    suggestion: '请检查数据库访问密钥是否正确',
                    retryable: false
                };
            } else if (status === 403) {
                return {
                    type: 'PERMISSION',
                    category: '访问权限不足',
                    suggestion: '当前用户没有访问该资源的权限',
                    retryable: false
                };
            } else if (status === 404) {
                return {
                    type: 'DATABASE',
                    category: '资源不存在',
                    suggestion: '请求的数据不存在，请检查查询条件',
                    retryable: false
                };
            } else if (status >= 500) {
                return {
                    type: 'DATABASE',
                    category: '服务器内部错误',
                    suggestion: '数据库服务器出现问题，请稍后重试',
                    retryable: true
                };
            }
        }
        
        // 数据格式错误
        if (message.includes('json') || message.includes('parse')) {
            return {
                type: 'DATA_FORMAT',
                category: '数据格式错误',
                suggestion: '服务器返回的数据格式不正确',
                retryable: false
            };
        }
        
        return {
            type: 'DATABASE',
            category: '数据库操作错误',
            suggestion: '请检查数据库连接和配置',
            retryable: true
        };
    }

    /**
     * 通用请求方法
     * @param {string} endpoint - API端点
     * @param {object} options - 请求选项
     * @returns {Promise<any>} 响应数据
     */
    async request(endpoint, options = {}) {
        // 检查缓存
        const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            console.log('📦 [databaseService] 从缓存返回数据:', endpoint);
            return cached.data;
        }
        
        const requestId = Math.random().toString(36).substr(2, 9);
        const startTime = Date.now();
        
        try {
            const url = `${this.baseUrl}/${endpoint}`;
            console.log(`🚀 [databaseService] [${requestId}] 开始请求:`, {
                url: url,
                endpoint: endpoint,
                method: 'GET',
                timestamp: new Date().toISOString()
            });
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers,
                ...options
            });
            
            const responseTime = Date.now() - startTime;
            
            console.log(`📡 [databaseService] [${requestId}] 响应状态:`, {
                status: response.status,
                statusText: response.statusText,
                responseTime: `${responseTime}ms`,
                headers: Object.fromEntries(response.headers.entries())
            });
            
            if (!response.ok) {
                let errorData = null;
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                
                try {
                    errorData = await response.json();
                    console.error(`❌ [databaseService] [${requestId}] 错误响应数据:`, errorData);
                    errorMessage = errorData.message || errorData.error?.message || errorMessage;
                } catch (e) {
                    console.error(`❌ [databaseService] [${requestId}] 无法解析错误响应:`, e);
                }
                
                const errorInfo = this.classifyDatabaseError(new Error(errorMessage), response);
                const enhancedError = new Error(`${errorInfo.category}: ${errorMessage}`);
                enhancedError.type = errorInfo.type;
                enhancedError.category = errorInfo.category;
                enhancedError.suggestion = errorInfo.suggestion;
                enhancedError.retryable = errorInfo.retryable;
                enhancedError.status = response.status;
                enhancedError.requestId = requestId;
                enhancedError.responseTime = responseTime;
                
                throw enhancedError;
            }
            
            const data = await response.json();
            console.log(`✅ [databaseService] [${requestId}] 成功获取数据:`, {
                dataType: typeof data,
                isArray: Array.isArray(data),
                length: data ? data.length : 0,
                responseTime: `${responseTime}ms`,
                firstRecord: data && data.length > 0 ? {
                    id: data[0].id,
                    hasRequiredFields: true
                } : null
            });
            
            // 缓存结果
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
            
        } catch (error) {
            const responseTime = Date.now() - startTime;
            
            if (!error.requestId) {
                // 如果是网络错误等，添加错误分类
                const errorInfo = this.classifyDatabaseError(error);
                error.type = errorInfo.type;
                error.category = errorInfo.category;
                error.suggestion = errorInfo.suggestion;
                error.retryable = errorInfo.retryable;
                error.requestId = requestId;
                error.responseTime = responseTime;
            }
            
            console.error(`❌ [databaseService] [${requestId}] 请求失败:`, {
                error: error.message,
                type: error.type,
                category: error.category,
                suggestion: error.suggestion,
                retryable: error.retryable,
                responseTime: `${responseTime}ms`,
                stack: error.stack
            });
            
            throw error;
        }
    }
    
    /**
     * 清除缓存
     * @param {string} pattern - 缓存键模式（可选）
     */
    clearCache(pattern = null) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }

    /**
     * 检测网络连接状态
     * @returns {Promise<boolean>} 网络是否可用
     */
    async checkNetworkConnection() {
        try {
            // 检查浏览器网络状态
            if (!navigator.onLine) {
                console.warn('🌐 [databaseService] 浏览器显示离线状态');
                return false;
            }

            // 尝试连接到数据库服务器
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

            const response = await fetch(this.baseUrl, {
                method: 'HEAD',
                headers: this.headers,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            const isConnected = response.ok || response.status < 500;
            console.log(`🌐 [databaseService] 网络连接检测:`, {
                status: response.status,
                connected: isConnected
            });
            
            return isConnected;
        } catch (error) {
            console.warn('🌐 [databaseService] 网络连接检测失败:', error.message);
            return false;
        }
    }

    /**
     * 带重试机制的请求方法
     * @param {string} endpoint - API端点
     * @param {object} options - 请求选项
     * @param {number} maxRetries - 最大重试次数
     * @returns {Promise<any>} 响应数据
     */
    async requestWithRetry(endpoint, options = {}, maxRetries = 3) {
        let lastError = null;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(`🔄 [databaseService] 尝试请求 (${attempt}/${maxRetries}): ${endpoint}`);
                
                // 在重试前检查网络连接
                if (attempt > 1) {
                    const isConnected = await this.checkNetworkConnection();
                    if (!isConnected) {
                        throw new Error('网络连接不可用，无法重试');
                    }
                    
                    // 重试延迟：第2次重试等待1秒，第3次重试等待2秒
                    const delay = (attempt - 1) * 1000;
                    console.log(`⏳ [databaseService] 等待 ${delay}ms 后重试...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                
                const result = await this.request(endpoint, options);
                
                if (attempt > 1) {
                    console.log(`✅ [databaseService] 重试成功 (第${attempt}次尝试)`);
                }
                
                return result;
                
            } catch (error) {
                lastError = error;
                
                console.warn(`⚠️ [databaseService] 第${attempt}次尝试失败:`, {
                    error: error.message,
                    type: error.type,
                    retryable: error.retryable
                });
                
                // 如果错误不可重试，直接抛出
                if (!error.retryable || attempt === maxRetries) {
                    break;
                }
            }
        }
        
        // 所有重试都失败了
        console.error(`❌ [databaseService] 所有重试都失败了 (${maxRetries}次尝试)`);
        lastError.message = `请求失败 (已重试${maxRetries}次): ${lastError.message}`;
        throw lastError;
    }
    
    // ==================== 新闻相关方法 ====================
    
    /**
     * 获取新闻列表
     * @param {object} filters - 过滤条件
     * @param {number} filters.limit - 限制数量
     * @param {number} filters.offset - 偏移量
     * @param {string} filters.status - 状态过滤
     * @param {number} filters.categoryId - 分类ID
     * @returns {Promise<Array>} 新闻列表
     */
    async getNews(filters = {}) {
        let query = 'news?select=*,authors(name,email),categories(name)';
        
        if (filters.limit) query += `&limit=${filters.limit}`;
        if (filters.offset) query += `&offset=${filters.offset}`;
        if (filters.status) query += `&status=eq.${filters.status}`;
        if (filters.categoryId) query += `&category_id=eq.${filters.categoryId}`;
        
        query += '&order=created_at.desc';
        
        return this.request(query);
    }

    /**
     * 获取新闻总数
     * @param {object} filters - 过滤条件
     * @param {string} filters.status - 状态过滤
     * @param {number} filters.categoryId - 分类ID
     * @returns {Promise<number>} 新闻总数
     */
    async getNewsCount(filters = {}) {
        let query = 'news?select=count';
        
        if (filters.status) query += `&status=eq.${filters.status}`;
        if (filters.categoryId) query += `&category_id=eq.${filters.categoryId}`;
        
        const result = await this.request(query);
        return result && result.length > 0 ? result[0].count : 0;
    }
    
    /**
     * 根据ID获取单条新闻
     * @param {number} id - 新闻ID
     * @returns {Promise<object>} 新闻详情
     */
    async getNewsById(id) {
        return this.request(`news?select=*,authors(name,email),categories(name)&id=eq.${id}`);
    }
    
    /**
     * 搜索新闻
     * @param {string} keyword - 搜索关键词
     * @param {number} limit - 限制数量
     * @returns {Promise<Array>} 搜索结果
     */
    async searchNews(keyword, limit = 20) {
        const encodedKeyword = encodeURIComponent(keyword);
        return this.request(`news?select=*,authors(name),categories(name)&or=(title.ilike.%25${encodedKeyword}%25,content.ilike.%25${encodedKeyword}%25)&order=created_at.desc&limit=${limit}`);
    }
    
    // ==================== 代码片段相关方法 ====================
    
    /**
     * 获取代码片段列表
     * @param {object} filters - 过滤条件
     * @param {string} filters.language - 编程语言
     * @param {boolean} filters.isPublic - 是否公开
     * @param {number} filters.limit - 限制数量
     * @param {number} filters.categoryId - 分类ID
     * @returns {Promise<Array>} 代码片段列表
     */
    async getCodeSnippets(filters = {}) {
        let query = 'code_snippets?select=*,authors(name,email),categories(name)';
        
        if (filters.language) query += `&language=eq.${filters.language}`;
        if (filters.isPublic !== undefined) query += `&is_public=eq.${filters.isPublic}`;
        if (filters.categoryId) query += `&category_id=eq.${filters.categoryId}`;
        if (filters.limit) query += `&limit=${filters.limit}`;
        
        query += '&order=created_at.desc';
        
        return this.request(query);
    }
    
    /**
     * 根据ID获取代码片段
     * @param {number} id - 代码片段ID
     * @returns {Promise<object>} 代码片段详情
     */
    async getCodeSnippetById(id) {
        return this.request(`code_snippets?select=*,authors(name,email),categories(name)&id=eq.${id}`);
    }
    
    /**
     * 搜索代码片段
     * @param {string} keyword - 搜索关键词
     * @param {string} language - 编程语言（可选）
     * @param {number} limit - 限制数量
     * @returns {Promise<Array>} 搜索结果
     */
    async searchCodeSnippets(keyword, language = null, limit = 20) {
        const encodedKeyword = encodeURIComponent(keyword);
        let query = `code_snippets?select=*,authors(name),categories(name)&or=(title.ilike.%25${encodedKeyword}%25,description.ilike.%25${encodedKeyword}%25,code.ilike.%25${encodedKeyword}%25)`;
        
        if (language) query += `&language=eq.${language}`;
        query += `&order=created_at.desc&limit=${limit}`;
        
        return this.request(query);
    }
    
    /**
     * 获取编程语言列表
     * @returns {Promise<Array>} 编程语言列表
     */
    async getLanguages() {
        return this.request('code_snippets?select=language&order=language.asc');
    }
    
    // ==================== 分类相关方法 ====================
    
    /**
     * 获取所有分类
     * @returns {Promise<Array>} 分类列表
     */
    async getCategories() {
        return this.request('categories?select=*&order=name.asc');
    }
    
    /**
     * 根据ID获取分类
     * @param {number} id - 分类ID
     * @returns {Promise<object>} 分类详情
     */
    async getCategoryById(id) {
        return this.request(`categories?select=*&id=eq.${id}`);
    }
    
    // ==================== 作者相关方法 ====================
    
    /**
     * 获取所有作者
     * @returns {Promise<Array>} 作者列表
     */
    async getAuthors() {
        return this.request('authors?select=*&order=name.asc');
    }
    
    /**
     * 根据ID获取作者
     * @param {number} id - 作者ID
     * @returns {Promise<object>} 作者详情
     */
    async getAuthorById(id) {
        return this.request(`authors?select=*&id=eq.${id}`);
    }
    
    /**
     * 获取作者的所有内容
     * @param {number} authorId - 作者ID
     * @returns {Promise<object>} 作者的新闻和代码片段
     */
    async getAuthorContent(authorId) {
        const [news, codeSnippets] = await Promise.all([
            this.request(`news?select=*,categories(name)&author_id=eq.${authorId}&order=created_at.desc`),
            this.request(`code_snippets?select=*,categories(name)&author_id=eq.${authorId}&order=created_at.desc`)
        ]);
        
        return { news, codeSnippets };
    }
    
    // ==================== 外部链接相关方法 ====================
    
    /**
     * 获取外部链接
     * @param {boolean} activeOnly - 仅获取活跃链接
     * @returns {Promise<Array>} 外部链接列表
     */
    async getExternalLinks(activeOnly = true) {
        let query = 'external_links?select=*';
        if (activeOnly) query += '&is_active=eq.true';
        query += '&order=created_at.desc';
        
        return this.request(query);
    }
    
    /**
     * 根据ID获取外部链接
     * @param {number} id - 链接ID
     * @returns {Promise<object>} 链接详情
     */
    async getExternalLinkById(id) {
        return this.request(`external_links?select=*&id=eq.${id}`);
    }
    
    // ==================== 社交媒体相关方法 ====================
    
    /**
     * 获取社交媒体账号
     * @param {Object} filters - 过滤条件
     * @param {number} filters.authorId - 作者ID
     * @param {string} filters.platform - 平台名称
     * @param {boolean} filters.activeOnly - 仅获取活跃账号
     * @param {number} filters.limit - 限制数量
     * @returns {Promise<Array>} 社交媒体账号列表
     */
    async getSocialMedia(filters = {}) {
        let query = 'social_media?select=*,authors(name,email,bio,avatar_url)';
        
        if (filters.authorId) query += `&author_id=eq.${filters.authorId}`;
        if (filters.platform) query += `&platform_name=eq.${filters.platform}`;
        if (filters.activeOnly !== false) query += '&is_active=eq.true';
        if (filters.limit) query += `&limit=${filters.limit}`;
        
        query += '&order=created_at.desc';
        
        return this.request(query);
    }
    
    /**
     * 根据ID获取社交媒体账号详情
     * @param {number} id - 社交媒体账号ID
     * @returns {Promise<object>} 社交媒体账号详情
     */
    async getSocialMediaById(id) {
        return this.request(`social_media?select=*,authors(name,email,bio,avatar_url)&id=eq.${id}`);
    }
    
    // ==================== 版本相关方法 ====================
    
    /**
     * 根据代码片段ID获取版本历史
     * @param {number} snippetId - 代码片段ID
     * @returns {Promise<Array>} 版本历史
     */
    async getVersionsBySnippetId(snippetId) {
        return this.request(`versions?select=*&code_snippet_id=eq.${snippetId}&order=created_at.desc`);
    }
    
    /**
     * 根据ID获取版本详情
     * @param {number} id - 版本ID
     * @returns {Promise<object>} 版本详情
     */
    async getVersionById(id) {
        return this.request(`versions?select=*&id=eq.${id}`);
    }
    
    // ==================== 提示词配置相关方法 ====================
    
    /**
     * 获取所有提示词配置
     * @returns {Promise<Array>} 提示词配置列表
     */
    async getPromptData() {
        return this.request('prompt_data?select=*&order=created_at.desc');
    }
    
    /**
     * 根据标题获取提示词配置
     * @param {string} title - 配置标题
     * @returns {Promise<object|null>} 提示词配置详情
     */
    async getPromptDataByTitle(title) {
        try {
            console.log(`🔍 [databaseService] 开始查询 prompt_data 表，title="${title}"`);
            
            const encodedTitle = encodeURIComponent(title);
            const endpoint = `prompt_data?select=*&title=eq.${encodedTitle}`;
            
            console.log(`🔗 [databaseService] 请求端点: ${endpoint}`);
            console.log(`🔗 [databaseService] 完整URL: ${this.baseUrl}/${endpoint}`);
            
            const result = await this.request(endpoint);
            
            console.log(`📊 [databaseService] 查询结果:`, {
                resultType: typeof result,
                isArray: Array.isArray(result),
                length: result ? result.length : 0,
                result: result
            });
            
            if (result && result.length > 0) {
                const record = result[0];
                console.log(`✅ [databaseService] 找到记录:`, {
                    id: record.id,
                    title: record.title,
                    hasConfig: !!record.config,
                    configType: typeof record.config,
                    configKeys: record.config ? Object.keys(record.config) : []
                });
                return record;
            } else {
                console.warn(`❌ [databaseService] 未找到 title="${title}" 的记录`);
                return null;
            }
        } catch (error) {
            console.error(`❌ [databaseService] 获取提示词配置失败 (title: ${title}):`, error);
            console.error(`❌ [databaseService] 错误详情:`, {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            return null;
        }
    }
    
    /**
     * 根据ID获取提示词配置
     * @param {number} id - 配置ID
     * @returns {Promise<object|null>} 提示词配置详情
     */
    async getPromptDataById(id) {
        try {
            const result = await this.request(`prompt_data?select=*&id=eq.${id}`);
            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            console.error(`获取提示词配置失败 (id: ${id}):`, error);
            return null;
        }
    }
    
    /**
     * 搜索提示词配置
     * @param {string} keyword - 搜索关键词
     * @param {number} limit - 限制数量
     * @returns {Promise<Array>} 搜索结果
     */
    async searchPromptData(keyword, limit = 20) {
        try {
            const encodedKeyword = encodeURIComponent(keyword);
            const query = `prompt_data?select=*&or=(title.ilike.%25${encodedKeyword}%25)&order=created_at.desc&limit=${limit}`;
            return this.request(query);
        } catch (error) {
            console.error(`搜索提示词配置失败 (keyword: ${keyword}):`, error);
            return [];
        }
    }
    
    // ==================== 统计和聚合方法 ====================
    
    /**
     * 获取数据库统计信息
     * @returns {Promise<object>} 统计信息
     */
    async getStatistics() {
        try {
            const [newsCount, snippetsCount, authorsCount, categoriesCount] = await Promise.all([
                this.request('news?select=count'),
                this.request('code_snippets?select=count'),
                this.request('authors?select=count'),
                this.request('categories?select=count')
            ]);
            
            return {
                news: newsCount.length || 0,
                codeSnippets: snippetsCount.length || 0,
                authors: authorsCount.length || 0,
                categories: categoriesCount.length || 0
            };
        } catch (error) {
            console.error('获取统计信息失败:', error);
            return {
                news: 0,
                codeSnippets: 0,
                authors: 0,
                categories: 0
            };
        }
    }
    
    /**
     * 获取最新内容
     * @param {number} limit - 限制数量
     * @returns {Promise<object>} 最新的新闻和代码片段
     */
    async getLatestContent(limit = 5) {
        const [latestNews, latestSnippets] = await Promise.all([
            this.getNews({ limit, status: 'published' }),
            this.getCodeSnippets({ limit, isPublic: true })
        ]);
        
        return {
            news: latestNews,
            codeSnippets: latestSnippets
        };
    }
    
    // ==================== 连接测试方法 ====================
    
    /**
     * 测试数据库连接
     * @returns {Promise<object>} 连接测试结果
     */
    async testConnection() {
        try {
            const startTime = Date.now();
            await this.request('categories?select=id&limit=1');
            const endTime = Date.now();
            
            return {
                success: true,
                message: '数据库连接成功',
                responseTime: endTime - startTime
            };
        } catch (error) {
            return {
                success: false,
                message: `数据库连接失败: ${error.message}`,
                responseTime: null
            };
        }
    }
}

// 创建全局实例
const databaseClient = new WatermelonDatabaseClient();

// 导出客户端实例和类
export { WatermelonDatabaseClient, databaseClient };