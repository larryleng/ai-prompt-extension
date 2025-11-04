/**
 * 大西瓜数据库使用示例
 * 展示如何在浏览器插件中使用数据库服务
 */

import { databaseClient } from './databaseService.js';

/**
 * 示例1: 获取最新的提示词相关内容
 * 适用于插件首页展示最新内容
 */
export async function getLatestPromptContent() {
    try {
        console.log('获取最新提示词内容...');
        
        // 获取最新的新闻和代码片段
        const latestContent = await databaseClient.getLatestContent(10);
        
        // 过滤出与提示词相关的内容
        const promptNews = latestContent.news.filter(news => 
            news.title?.toLowerCase().includes('prompt') || 
            news.title?.toLowerCase().includes('提示词') ||
            news.content?.toLowerCase().includes('prompt') ||
            news.content?.toLowerCase().includes('提示词')
        );
        
        const promptSnippets = latestContent.codeSnippets.filter(snippet =>
            snippet.title?.toLowerCase().includes('prompt') ||
            snippet.title?.toLowerCase().includes('提示词') ||
            snippet.description?.toLowerCase().includes('prompt') ||
            snippet.description?.toLowerCase().includes('提示词') ||
            (snippet.tags && snippet.tags.some(tag => 
                tag.toLowerCase().includes('prompt') || 
                tag.toLowerCase().includes('提示词')
            ))
        );
        
        return {
            success: true,
            data: {
                news: promptNews,
                codeSnippets: promptSnippets,
                total: promptNews.length + promptSnippets.length
            }
        };
        
    } catch (error) {
        console.error('获取最新提示词内容失败:', error);
        return {
            success: false,
            error: error.message,
            data: { news: [], codeSnippets: [], total: 0 }
        };
    }
}

/**
 * 示例2: 搜索提示词相关内容
 * 适用于插件的搜索功能
 */
export async function searchPromptContent(keyword, options = {}) {
    try {
        console.log(`搜索提示词内容: ${keyword}`);
        
        const {
            limit = 20,
            includeNews = true,
            includeCodeSnippets = true,
            language = null
        } = options;
        
        const searchPromises = [];
        
        // 搜索新闻
        if (includeNews) {
            searchPromises.push(databaseClient.searchNews(keyword, limit));
        }
        
        // 搜索代码片段
        if (includeCodeSnippets) {
            searchPromises.push(databaseClient.searchCodeSnippets(keyword, language, limit));
        }
        
        const results = await Promise.all(searchPromises);
        
        let news = [];
        let codeSnippets = [];
        
        if (includeNews && results[0]) {
            news = results[0];
        }
        
        if (includeCodeSnippets) {
            const snippetIndex = includeNews ? 1 : 0;
            if (results[snippetIndex]) {
                codeSnippets = results[snippetIndex];
            }
        }
        
        return {
            success: true,
            data: {
                keyword,
                news,
                codeSnippets,
                total: news.length + codeSnippets.length
            }
        };
        
    } catch (error) {
        console.error('搜索提示词内容失败:', error);
        return {
            success: false,
            error: error.message,
            data: { keyword, news: [], codeSnippets: [], total: 0 }
        };
    }
}

/**
 * 示例3: 获取分类化的提示词内容
 * 适用于按分类浏览功能
 */
export async function getPromptContentByCategory() {
    try {
        console.log('获取分类化的提示词内容...');
        
        // 获取所有分类
        const categories = await databaseClient.getCategories();
        
        // 为每个分类获取相关内容
        const categoryContent = await Promise.all(
            categories.map(async (category) => {
                const [news, codeSnippets] = await Promise.all([
                    databaseClient.getNews({ 
                        categoryId: category.id, 
                        limit: 5,
                        status: 'published' 
                    }),
                    databaseClient.getCodeSnippets({ 
                        categoryId: category.id, 
                        limit: 5,
                        isPublic: true 
                    })
                ]);
                
                return {
                    category,
                    news,
                    codeSnippets,
                    total: news.length + codeSnippets.length
                };
            })
        );
        
        // 过滤掉没有内容的分类
        const filteredContent = categoryContent.filter(item => item.total > 0);
        
        return {
            success: true,
            data: filteredContent
        };
        
    } catch (error) {
        console.error('获取分类化内容失败:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * 示例4: 获取热门编程语言的代码片段
 * 适用于代码片段推荐功能
 */
export async function getPopularLanguageSnippets() {
    try {
        console.log('获取热门编程语言代码片段...');
        
        // 定义热门编程语言
        const popularLanguages = [
            'javascript', 'python', 'java', 'typescript', 'go', 
            'rust', 'cpp', 'c', 'php', 'ruby', 'swift', 'kotlin'
        ];
        
        // 为每种语言获取代码片段
        const languageSnippets = await Promise.all(
            popularLanguages.map(async (language) => {
                try {
                    const snippets = await databaseClient.getCodeSnippets({
                        language,
                        limit: 10,
                        isPublic: true
                    });
                    
                    return {
                        language,
                        snippets,
                        count: snippets.length
                    };
                } catch (error) {
                    console.warn(`获取 ${language} 代码片段失败:`, error);
                    return {
                        language,
                        snippets: [],
                        count: 0
                    };
                }
            })
        );
        
        // 过滤掉没有代码片段的语言并按数量排序
        const filteredLanguages = languageSnippets
            .filter(item => item.count > 0)
            .sort((a, b) => b.count - a.count);
        
        return {
            success: true,
            data: filteredLanguages
        };
        
    } catch (error) {
        console.error('获取热门语言代码片段失败:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * 示例5: 获取作者的所有内容
 * 适用于作者页面或作者推荐功能
 */
export async function getAuthorProfile(authorId) {
    try {
        console.log(`获取作者资料: ${authorId}`);
        
        // 获取作者基本信息
        const authorData = await databaseClient.getAuthorById(authorId);
        
        if (!authorData || authorData.length === 0) {
            throw new Error('作者不存在');
        }
        
        const author = authorData[0];
        
        // 获取作者的所有内容
        const authorContent = await databaseClient.getAuthorContent(authorId);
        
        // 获取作者的统计信息
        const stats = {
            totalNews: authorContent.news.length,
            totalCodeSnippets: authorContent.codeSnippets.length,
            totalContent: authorContent.news.length + authorContent.codeSnippets.length,
            languages: [...new Set(authorContent.codeSnippets.map(s => s.language).filter(Boolean))],
            categories: [...new Set([
                ...authorContent.news.map(n => n.categories?.name).filter(Boolean),
                ...authorContent.codeSnippets.map(s => s.categories?.name).filter(Boolean)
            ])]
        };
        
        return {
            success: true,
            data: {
                author,
                content: authorContent,
                stats
            }
        };
        
    } catch (error) {
        console.error('获取作者资料失败:', error);
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
}

/**
 * 示例6: 获取外部资源链接
 * 适用于资源推荐功能
 */
export async function getRecommendedResources() {
    try {
        console.log('获取推荐资源链接...');
        
        const links = await databaseClient.getExternalLinks(true);
        
        // 按类型分组（如果有type字段）
        const groupedLinks = links.reduce((groups, link) => {
            const type = link.type || 'other';
            if (!groups[type]) {
                groups[type] = [];
            }
            groups[type].push(link);
            return groups;
        }, {});
        
        return {
            success: true,
            data: {
                links,
                groupedLinks,
                total: links.length
            }
        };
        
    } catch (error) {
        console.error('获取推荐资源失败:', error);
        return {
            success: false,
            error: error.message,
            data: { links: [], groupedLinks: {}, total: 0 }
        };
    }
}

/**
 * 示例7: 缓存管理示例
 * 展示如何管理数据库缓存
 */
export class DatabaseCacheManager {
    constructor() {
        this.client = databaseClient;
    }
    
    /**
     * 清除所有缓存
     */
    clearAllCache() {
        this.client.clearCache();
        console.log('已清除所有数据库缓存');
    }
    
    /**
     * 清除特定类型的缓存
     * @param {string} type - 缓存类型 (news, code_snippets, categories, authors, etc.)
     */
    clearCacheByType(type) {
        this.client.clearCache(type);
        console.log(`已清除 ${type} 相关缓存`);
    }
    
    /**
     * 预加载常用数据
     */
    async preloadCommonData() {
        try {
            console.log('预加载常用数据...');
            
            // 并行预加载常用数据
            await Promise.all([
                this.client.getCategories(),
                this.client.getAuthors(),
                this.client.getNews({ limit: 20, status: 'published' }),
                this.client.getCodeSnippets({ limit: 20, isPublic: true }),
                this.client.getExternalLinks(true)
            ]);
            
            console.log('常用数据预加载完成');
            return { success: true };
            
        } catch (error) {
            console.error('预加载数据失败:', error);
            return { success: false, error: error.message };
        }
    }
}

/**
 * 示例8: 错误处理和重试机制
 */
export class DatabaseErrorHandler {
    constructor(maxRetries = 3, retryDelay = 1000) {
        this.maxRetries = maxRetries;
        this.retryDelay = retryDelay;
        this.client = databaseClient;
    }
    
    /**
     * 带重试的数据库请求
     * @param {Function} operation - 数据库操作函数
     * @param {Array} args - 操作参数
     * @returns {Promise} 操作结果
     */
    async withRetry(operation, ...args) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                console.log(`尝试第 ${attempt} 次数据库操作...`);
                return await operation.apply(this.client, args);
                
            } catch (error) {
                lastError = error;
                console.warn(`第 ${attempt} 次尝试失败:`, error.message);
                
                if (attempt < this.maxRetries) {
                    console.log(`等待 ${this.retryDelay}ms 后重试...`);
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                }
            }
        }
        
        throw new Error(`数据库操作失败，已重试 ${this.maxRetries} 次: ${lastError.message}`);
    }
    
    /**
     * 安全的数据库操作（不抛出异常）
     * @param {Function} operation - 数据库操作函数
     * @param {Array} args - 操作参数
     * @param {any} defaultValue - 默认返回值
     * @returns {Promise} 操作结果或默认值
     */
    async safeOperation(operation, args = [], defaultValue = null) {
        try {
            return await this.withRetry(operation, ...args);
        } catch (error) {
            console.error('数据库操作最终失败:', error);
            return defaultValue;
        }
    }
}

// 创建全局实例
export const cacheManager = new DatabaseCacheManager();
export const errorHandler = new DatabaseErrorHandler();

// 导出便捷方法
export default {
    getLatestPromptContent,
    searchPromptContent,
    getPromptContentByCategory,
    getPopularLanguageSnippets,
    getAuthorProfile,
    getRecommendedResources,
    cacheManager,
    errorHandler
};