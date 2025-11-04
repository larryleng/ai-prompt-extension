/**
 * 保存的提示词管理器
 * 用于管理用户保存的提示词数据，支持持久化存储
 */
class SavedPromptsManager {
  constructor() {
    this.storageKey = 'daxigua_saved_prompts';
    this.prompts = this.loadPrompts();
  }

  /**
   * 从localStorage加载保存的提示词
   */
  loadPrompts() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        // 首次使用，创建默认的空数组结构
  
        return [];
      }
      
      const parsed = JSON.parse(stored);
      
      // 确保返回的是数组格式
      if (!Array.isArray(parsed)) {
        console.warn('存储的数据不是数组格式，重置为空数组');
        return [];
      }
      
      return parsed;
    } catch (error) {
      console.error('加载保存的提示词失败:', error);
      // 出错时返回空数组，确保应用能正常运行
      return [];
    }
  }

  /**
   * 保存提示词到localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.prompts));
      return true;
    } catch (error) {
      console.error('保存提示词到存储失败:', error);
      return false;
    }
  }

  /**
   * 添加新的提示词
   * @param {Object} promptData - 提示词数据
   * @param {string} promptData.content - 提示词内容（纯文本）
   * @param {string} promptData.htmlContent - 提示词内容（HTML格式）
   * @param {Array} promptData.activeTags - 当前激活的标签
   * @param {string} promptData.theme - 当前主题设置
   * @param {string} promptData.mediaType - 媒体类型（'image'或'video'）
   */
  addPrompt(promptData) {
    const newPrompt = {
      id: this.generateId(),
      content: promptData.content || '',
      htmlContent: promptData.htmlContent || '',
      activeTags: promptData.activeTags || [],
      theme: promptData.theme || 'light',
      mediaType: promptData.mediaType || 'image', // 默认为图片类型
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    this.prompts.unshift(newPrompt); // 添加到数组开头，最新的在前面
    
    // 限制保存的提示词数量，避免存储空间过大
    if (this.prompts.length > 100) {
      this.prompts = this.prompts.slice(0, 100);
    }

    return this.saveToStorage() ? newPrompt : null;
  }

  /**
   * 获取所有保存的提示词
   */
  getAllPrompts() {
    return [...this.prompts];
  }

  /**
   * 根据ID获取提示词
   */
  getPromptById(id) {
    return this.prompts.find(prompt => prompt.id === id);
  }

  /**
   * 删除提示词
   */
  deletePrompt(id) {
    const index = this.prompts.findIndex(prompt => prompt.id === id);
    if (index !== -1) {
      this.prompts.splice(index, 1);
      return this.saveToStorage();
    }
    return false;
  }

  /**
   * 更新提示词
   */
  updatePrompt(id, updateData) {
    const index = this.prompts.findIndex(prompt => prompt.id === id);
    if (index !== -1) {
      this.prompts[index] = { ...this.prompts[index], ...updateData };
      return this.saveToStorage();
    }
    return false;
  }

  /**
   * 清空所有保存的提示词
   */
  clearAll() {
    this.prompts = [];
    return this.saveToStorage();
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 获取保存的提示词数量
   */
  getCount() {
    return this.prompts.length;
  }

  /**
   * 搜索提示词
   */
  searchPrompts(keyword) {
    if (!keyword) return this.getAllPrompts();
    
    const lowerKeyword = keyword.toLowerCase();
    return this.prompts.filter(prompt => 
      prompt.content.toLowerCase().includes(lowerKeyword) ||
      prompt.activeTags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * 导出数据（用于备份）
   */
  exportData() {
    return {
      version: '1.0',
      exportTime: new Date().toISOString(),
      prompts: this.prompts
    };
  }

  /**
   * 导入数据（用于恢复备份）
   */
  importData(data) {
    try {
      if (data && Array.isArray(data.prompts)) {
        this.prompts = data.prompts;
        return this.saveToStorage();
      }
      return false;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
}

// 创建全局实例
window.savedPromptsManager = new SavedPromptsManager();

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SavedPromptsManager;
}