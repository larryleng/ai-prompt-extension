// 通用工具函数模块

// Chrome存储操作工具
export const StorageUtils = {
  /**
   * 安全地使用Chrome存储API
   * @param {string} operation - 操作类型 ('get', 'set', 'remove')
   * @param {*} data - 数据
   * @param {Function} callback - 回调函数
   */
  safeStorageOperation(operation, data, callback) {
    try {
      if (chrome && chrome.storage && chrome.storage.local) {
        switch (operation) {
          case 'get':
            chrome.storage.local.get(data, callback);
            break;
          case 'set':
            chrome.storage.local.set(data, callback);
            break;
          case 'remove':
            chrome.storage.local.remove(data, callback);
            break;
        }
      }
    } catch (e) {
      // 静默处理Chrome存储API不可用的情况
      if (callback) callback({});
    }
  },

  /**
   * 保存提示词相关数据
   * @param {Object} data - 要保存的数据
   */
  savePromptData(data) {
    this.safeStorageOperation('set', data);
  },

  /**
   * 获取提示词相关数据
   * @param {Array} keys - 要获取的键名数组
   * @param {Function} callback - 回调函数
   */
  getPromptData(keys, callback) {
    this.safeStorageOperation('get', keys, callback);
  },

  // 保存完整的提示词状态（包括扩写状态）
  savePromptState(promptText, processedHtml, originalInput, isExpanded, callback) {
    this.safeStorageOperation('set', {
      savedPrompt: promptText,
      processedHtml: processedHtml,
      originalInput: originalInput,
      isExpanded: isExpanded
    }, callback);
  },

  // 保存撤回历史数据
  saveUndoHistory(undoStack, historyPointer, callback) {
    this.safeStorageOperation('set', {
      undoHistory: undoStack,
      historyPointer: historyPointer
    }, callback);
  },

  // 获取撤回历史数据
  getUndoHistory(callback) {
    this.safeStorageOperation('get', ['undoHistory', 'historyPointer'], callback);
  },

  /**
   * 清除提示词相关数据
   * @param {Array} keys - 要清除的键名数组
   */
  clearPromptData(keys) {
    this.safeStorageOperation('remove', keys);
  }
};

// 错误处理工具
export const ErrorHandler = {
  /**
   * 静默处理错误（不显示给用户）
   * @param {Error} error - 错误对象
   * @param {string} context - 错误上下文
   */
  handleSilently(error, context) {
    // 在开发环境中可以输出到控制台，生产环境中静默
  },

  /**
   * 处理关键错误（需要显示给用户）
   * @param {Error} error - 错误对象
   * @param {string} context - 错误上下文
   */
  handleCritical(error, context) {
    console.error(`Critical error in ${context}:`, error);
  },

  /**
   * 恢复原始内容并处理错误
   * @param {HTMLElement} element - 要恢复内容的元素
   * @param {string} originalContent - 原始内容
   * @param {Error} error - 错误对象
   * @param {Function} showEnhancedErrorDialog - 显示错误对话框的函数
   */
  restoreContentAndHandleError(element, originalContent, error, showEnhancedErrorDialog) {
    // 恢复原始内容和样式
    if (originalContent && element) {
      element.innerHTML = originalContent;
      element.style.position = '';
    }
    
    // 显示增强的错误对话框
    if (error.type && error.category) {
      showEnhancedErrorDialog(error);
    } else {
      // 兼容旧的错误格式
      const enhancedError = {
        type: 'DATABASE',
        category: '数据库操作错误',
        message: error.message || error,
        suggestion: '请检查网络连接和数据库配置，或稍后重试',
        retryable: true
      };
      showEnhancedErrorDialog(enhancedError);
    }
  },

  /**
   * 处理翻译错误的专用函数
   * @param {Error} error - 错误对象
   * @param {HTMLElement} promptDiv - 提示词元素
   * @param {string} originalContent - 原始内容
   * @param {Function} showWarningToast - 显示警告提示的函数
   */
  handleTranslationError(error, promptDiv, originalContent, showWarningToast) {
    // 特殊处理API配置错误
    if (error === '请先配置API设置' || error.message === '请先配置API设置') {
      // 使用警告提示框样式
      showWarningToast('请先配置API设置，点击右上角的"API设置"按钮进行配置');
      
      // 恢复原始内容和样式
      if (originalContent && promptDiv) {
        promptDiv.innerHTML = originalContent;
        promptDiv.style.position = '';
      }
    } else {
      // 其他错误正常显示
      console.error('翻译错误:', error);
      if (promptDiv) {
        promptDiv.innerHTML = `<div style="color: red;">翻译失败: ${error.message || error}</div>`;
      }
      alert('翻译失败: ' + (error.message || error));
    }
  }
};

// DOM操作工具
export const DOMUtils = {
  /**
   * 安全地查询DOM元素
   * @param {string} selector - 选择器
   * @returns {Element|null} DOM元素
   */
  safeQuery(selector) {
    try {
      return document.querySelector(selector);
    } catch (e) {
      console.warn('DOM查询失败:', selector, e);
      return null;
    }
  },

  /**
   * 安全地查询多个DOM元素
   * @param {string} selector - 选择器
   * @returns {NodeList} DOM元素列表
   */
  safeQueryAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch (e) {
      console.warn('DOM查询失败:', selector, e);
      return [];
    }
  },

  // 安全的getElementById
  safeGetById(id) {
    try {
      return document.getElementById(id);
    } catch (e) {
      console.warn('DOM查询失败:', id, e);
      return null;
    }
  },

  // 获取常用的DOM元素集合
  getCommonElements() {
    return {
      promptDiv: this.safeGetById('promptText'),
      expandBtn: this.safeGetById('expandBtn'),
      translateBtn: this.safeGetById('translateBtn'),
      clearBtn: this.safeGetById('clearBtn'),
      copyBtn: this.safeGetById('copyBtn'),
      undoBtn: this.safeGetById('undoBtn'),
      redoBtn: this.safeGetById('redoBtn'),
      expandCountInput: this.safeGetById('expandCount'),
      apiSettingsBtn: this.safeQuery('.settings-link'),
      piggyBankIcon: this.safeQuery('.piggy-bank-icon'),
      saveIcon: this.safeQuery('.save-icon'),
      bellIcon: this.safeQuery('.bell-icon'),
      modeToggle: this.safeGetById('modeToggle'),
      templateSourceCheckbox: this.safeGetById('templateSourceCheckbox'),
      externalLinksSelect: this.safeGetById('externalLinksSelect')
    };
  },

  // 获取标签相关的DOM元素
  getTagElements() {
    return {
      qualityTags: this.safeGetById('qualityTags'),
      navItems: this.safeQueryAll('.nav-item'),
      tagContainers: this.safeQueryAll('.tags-container'),
      categoryContents: this.safeQueryAll('.tags-category-content'),
      categoryTitles: this.safeQueryAll('.category-title'),
      tagsSection: this.safeQuery('.tags-section'),
      searchInput: this.safeGetById('tagSearchInput'),
      clearSearchBtn: this.safeGetById('clearSearchBtn'),
      activeCategory: this.safeQuery('.tags-category-content.active'),
      activeTagElements: this.safeQueryAll('.tag.active'),
      allTags: this.safeQueryAll('.tag')
    };
  },

  // 获取搜索相关的DOM元素
  getSearchElements() {
    return {
      searchInput: this.safeGetById('tagSearchInput'),
      clearSearchBtn: this.safeGetById('clearSearchBtn'),
      searchResults: this.safeGetById('搜索结果'),
      searchNavItem: this.safeQuery('.tags-nav .nav-item[data-category="搜索结果"]'),
      searchTagsContainer: this.safeGetById('searchTagsContainer'),
      initialActiveNavItem: this.safeQuery('.tags-nav .nav-item.active'),
      activeNavItem: this.safeQuery('.tags-nav .nav-item.active'),
      allNavItems: this.safeQueryAll('.tags-nav .nav-item'),
      allCategoryContents: this.safeQueryAll('.tags-category-content')
    };
  },

  /**
   * 切换元素的显示状态
   * @param {Element} element - DOM元素
   * @param {boolean} show - 是否显示
   */
  toggleDisplay(element, show) {
    if (!element) return;
    element.style.display = show ? 'block' : 'none';
  }
};

// 开发环境检测工具
export const DevUtils = {
  /**
   * 检查是否为开发环境
   * @returns {boolean} 是否为开发环境
   */
  isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.protocol === 'file:';
  },

  /**
   * 开发环境日志输出
   * @param {...any} args - 日志参数
   */
  devLog(...args) {
    if (this.isDevelopment()) {
      console.log(...args);
    }
  }
};