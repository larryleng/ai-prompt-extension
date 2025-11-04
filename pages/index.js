// 导入模块
import { tagsManager } from './modules/prompts/tags.js';
import { tagsData } from './modules/data/tagsData.js';
import { testDatabaseConnection, testPromptDataQuery, getPromptConfig } from './modules/prompts/kuozhan.js';
import { customTemplateManager, TEMPLATE_TYPES } from './modules/data/customTemplates.js';
import { StorageUtils, ErrorHandler, DOMUtils, DevUtils } from './modules/utils/commonUtils.js';
import { SearchUtils } from './modules/utils/searchUtils.js';
import { ExternalLinksUtils } from './modules/utils/externalLinksUtils.js';
import { ToastUtils } from './modules/utils/toastUtils.js';
import { themeManager } from './modules/utils/themeUtils.js';

// 工具函数
// 全局保存控制标志
let isSaveBlocked = false;

// 增强的防抖函数，支持取消和保存状态检查
function debounce(func, wait) {
  let timeout;
  const executedFunction = function(...args) {
    const later = () => {
      clearTimeout(timeout);
      timeout = null;
      // 在执行前检查是否允许保存
      if (!isSaveBlocked) {
        func(...args);
      } else {
        console.log('保存被阻止：当前正在进行扩写或翻译操作');
      }
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  
  // 添加取消方法
  executedFunction.cancel = function() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
      console.log('防抖函数已取消');
    }
  };
  
  return executedFunction;
}

// 全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
  console.error('全局错误捕获:', {
    message,
    source,
    lineno,
    colno,
    error
  });
  
  // 显示用户友好的错误提示
  ToastUtils.showError('页面出现了一个错误，请刷新页面重试');
  
  return true; // 阻止默认的错误处理
};

// 处理未捕获的Promise错误
window.addEventListener('unhandledrejection', function(event) {
  console.error('未捕获的Promise错误:', event.reason);
  
  // 显示用户友好的错误提示
  ToastUtils.showError('操作失败，请重试');
  
  // 阻止错误在控制台显示
  event.preventDefault();
});

// 加载状态管理器
class LoadingManager {
  constructor() {
    this.activeOperations = new Set();
  }
  
  init() {
    // 不创建弹出式加载指示器，只管理操作状态
    // 加载状态将只在输入框内显示
  }
  
  startOperation(operationId, text = '加载中...') {
    this.activeOperations.add(operationId);
    // 不显示弹出式加载提示，只记录操作状态
  }
  
  endOperation(operationId) {
    this.activeOperations.delete(operationId);
    // 不需要隐藏弹出式加载提示
  }
  
  isLoading() {
    return this.activeOperations.size > 0;
  }
}

const loadingManager = new LoadingManager();

// 主题管理器已从 themeUtils.js 导入

// 新闻更新检查管理器
class NewsUpdateChecker {
  constructor() {
    this.notificationDot = null;
    this.abortController = null; // 添加 AbortController 用于取消请求
  }

  /**
   * 初始化新闻更新检查器
   */
  init() {
    this.notificationDot = document.querySelector('.notification-dot');
    // 初始化时先隐藏红点，避免在数据加载前显示
    this.toggleNotificationDot(false);
    this.checkNewsUpdate();
  }

  /**
   * 取消所有进行中的请求
   */
  cancelRequests() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * 获取最新新闻的时间戳
   * @returns {Promise<string|null>} 最新新闻的时间戳
   */
  async getLatestNewsTimestamp() {
    try {
      this.abortController = new AbortController();
      
      const { databaseClient } = await import('./modules/api/databaseService.js');
      
      const latestNews = await databaseClient.getNews({ 
        limit: 1, 
        status: 'published' 
      });
      
      if (latestNews && latestNews.length > 0) {
        const newsItem = latestNews[0];
        return newsItem.published_at || newsItem.created_at;
      }
      
      return null;
      
    } catch (error) {
      if (error.name === 'AbortError') {
        return null;
      }
      ErrorHandler.handleSilently(error, 'getLatestNewsTimestamp');
      return null;
    }
  }

  /**
   * 读取本地保存的新闻时间戳
   * @returns {Promise<string|null>} 本地保存的时间戳
   */
  async getLocalNewsTimestamp() {
    try {
      const localTimestamp = localStorage.getItem('lastViewedNewsTimestamp');
      if (localTimestamp) {
        return localTimestamp;
      }

      const response = await fetch('../config/newsTimestamp.json');
      if (response.ok) {
        const data = await response.json();
        return data.lastViewedTimestamp;
      }
      
      return null;
      
    } catch (error) {
      ErrorHandler.handleSilently(error, 'getLocalNewsTimestamp');
      return null;
    }
  }

  /**
   * 控制红色提醒点的显示/隐藏
   * @param {boolean} show - 是否显示提醒点
   */
  toggleNotificationDot(show) {
    DOMUtils.toggleDisplay(this.notificationDot, show);
  }

  /**
   * 检查新闻更新
   */
  async checkNewsUpdate() {
    try {
      const [latestTimestamp, localTimestamp] = await Promise.all([
        this.getLatestNewsTimestamp(),
        this.getLocalNewsTimestamp()
      ]);

      if (!latestTimestamp || !localTimestamp) {
        this.toggleNotificationDot(false);
        return;
      }

      const latestDate = new Date(latestTimestamp);
      const localDate = new Date(localTimestamp);

      this.toggleNotificationDot(latestDate > localDate);

    } catch (error) {
      ErrorHandler.handleSilently(error, 'checkNewsUpdate');
      this.toggleNotificationDot(false);
    }
  }
}

// 创建新闻更新检查器实例
const newsUpdateChecker = new NewsUpdateChecker();

// 数据库测试管理器
class DatabaseTestManager {
  constructor() {
    this.testResults = {};
  }

  async runAllTests() {
    try {
      const connectionResult = await testDatabaseConnection();
      this.testResults.connection = connectionResult;
      
      const queryResult = await testPromptDataQuery();
      this.testResults.query = queryResult;
      
      const config = await getPromptConfig();
      this.testResults.config = config;
      
      this.outputTestSummary();
      
    } catch (error) {
      ErrorHandler.handleCritical(error, 'DatabaseTestManager');
      this.testResults.error = error.message;
    }
  }

  outputTestSummary() {
    if (!DevUtils.isDevelopment()) return;
    
    const connectionStatus = this.testResults.connection ? '✅ 成功' : '❌ 失败';
    const queryStatus = this.testResults.query?.success ? '✅ 成功' : '❌ 失败';
    const configSource = this.testResults.config === window.DEFAULT_CONFIG ? '本地默认配置' : '数据库配置';
    
    DevUtils.devLog('📋 数据库测试总结:');
    DevUtils.devLog('==========================================');
    DevUtils.devLog(`📡 数据库连接: ${connectionStatus}`);
    DevUtils.devLog(`📊 数据库查询: ${queryStatus}`);
    DevUtils.devLog(`⚙️ 配置来源: ${configSource}`);
    
    if (this.testResults.error) {
      DevUtils.devLog(`❌ 测试错误: ${this.testResults.error}`);
    }
    
    DevUtils.devLog('==========================================');
  }

  getTestResults() {
    return this.testResults;
  }
}

// 创建数据库测试管理器实例
const databaseTestManager = new DatabaseTestManager();

// 模板来源管理器
class TemplateSourceManager {
  constructor() {
    this.currentSource = localStorage.getItem('templateSource') || 'cloud';
    this.checkboxElement = null;
  }

  init() {
    this.checkboxElement = DOMUtils.safeQuery('#templateSourceCheckbox');
    
    if (!this.checkboxElement) return;

    this.checkboxElement.checked = this.currentSource === 'cloud';

    this.checkboxElement.addEventListener('change', (e) => {
      const newSource = e.target.checked ? 'cloud' : 'local';
      this.handleSourceChange(newSource);
    });
  }

  handleSourceChange(newSource) {
    this.currentSource = newSource;
    localStorage.setItem('templateSource', newSource);
    
    // 触发模板来源切换事件
    this.onSourceChange(newSource);
  }

  onSourceChange(source) {
    if (typeof tagsManager !== 'undefined' && tagsManager.refreshTags) {
      // tagsManager.refreshTags(source);
    }
  }

  getCurrentSource() {
    return this.currentSource;
  }

  isCloudSource() {
    return this.currentSource === 'cloud';
  }

  isLocalSource() {
    return this.currentSource === 'local';
  }
}

// 创建模板来源管理器实例
const templateSourceManager = new TemplateSourceManager();

// 页面卸载时的清理函数
function cleanupOnPageUnload() {
  if (newsUpdateChecker) {
    newsUpdateChecker.cancelRequests();
  }
  
  // 清理外部链接工具
  ExternalLinksUtils.cleanup();
  
  // 保存当前输入框状态
  const promptDiv = document.getElementById('promptText');
  if (promptDiv) {
    StorageUtils.savePromptData({
      savedPrompt: promptDiv.textContent,
      processedHtml: promptDiv.innerHTML,
      isExpanded: window.isExpanded || false,
      originalInput: window.originalInput || ''
    });
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 设置全局变量，供其他模块使用
  window.customTemplateManager = customTemplateManager;
  window.TEMPLATE_TYPES = TEMPLATE_TYPES;
  
  // 初始化加载管理器
  loadingManager.init();
  
  // 初始化主题管理器
  themeManager.init();
  
  // 初始化新闻更新检查器
  newsUpdateChecker.init();
  
  // 初始化模板来源管理器
  templateSourceManager.init();
  
  // 数据库测试已移除，避免页面加载时的不必要连接
  // 如需测试数据库连接，可在控制台手动调用：databaseTestManager.runAllTests()
  // setTimeout(() => {
  //   databaseTestManager.runAllTests();
  // }, 1000); // 延迟1秒执行，确保页面完全加载
  
  // 获取DOM元素
  const elements = DOMUtils.getCommonElements();
  const {
    apiSettingsBtn, promptDiv, translateBtn, expandBtn, clearBtn, copyBtn, 
    undoBtn, piggyBankIcon, expandCountInput, externalLinksSelect, templateSourceCheckbox
  } = elements;
  
  // 添加键盘输入限制
  if (expandCountInput) {
    // 禁用右键菜单
    expandCountInput.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
    
    // 禁用鼠标选择
    expandCountInput.addEventListener('selectstart', function(e) {
      e.preventDefault();
      return false;
    });
    
    // 禁用拖拽
    expandCountInput.addEventListener('dragstart', function(e) {
      e.preventDefault();
      return false;
    });
    
    // 禁用鼠标点击选择文本
    expandCountInput.addEventListener('mousedown', function(e) {
      // 允许获得焦点，但阻止文本选择
      setTimeout(() => {
        if (document.activeElement === expandCountInput) {
          // 检查输入框类型，只对支持文本选择的类型调用setSelectionRange
          if (expandCountInput.type === 'text' || expandCountInput.type === 'search' || 
              expandCountInput.type === 'url' || expandCountInput.type === 'tel' || 
              expandCountInput.type === 'password') {
            expandCountInput.setSelectionRange(expandCountInput.value.length, expandCountInput.value.length);
          }
        }
      }, 0);
    });
    
    // 禁用双击选择
    expandCountInput.addEventListener('dblclick', function(e) {
      e.preventDefault();
      return false;
    });
    
    // 只允许数字键盘输入
    expandCountInput.addEventListener('keydown', function(e) {
      // 允许的键：数字键、退格键、删除键、方向键、Tab键、Enter键
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Tab', 'Enter', 'Escape'
      ];
      
      // 允许数字键（主键盘和数字键盘）
      const isNumber = (e.key >= '0' && e.key <= '9') || 
                      (e.code >= 'Digit0' && e.code <= 'Digit9') ||
                      (e.code >= 'Numpad0' && e.code <= 'Numpad9');
      
      if (!isNumber && !allowedKeys.includes(e.key)) {
        e.preventDefault();
        return false;
      }
    });
  }
  
  const { saveIcon, bellIcon } = elements;
  const tagElements = DOMUtils.getTagElements();
  const { qualityTags, navItems, tagContainers, categoryContents, categoryTitles, tagsSection } = tagElements;
  
  // 存储已激活的标签
  const activeTags = new Set();
  
  // 加载标签数据到标签区域
  if (tagsSection && tagsData && typeof tagsData.generateTagsHTML === 'function') {
    tagsSection.innerHTML = tagsData.generateTagsHTML();
  }
  
  // 初始化标签管理器
  if (tagsManager && typeof tagsManager.init === 'function') {
    tagsManager.init(promptDiv, activeTags);
  }
  
  // 初始化子类别的下拉效果
  initSubcategoryEvents();
  
  // 初始化标签搜索功能
  initTagSearch();
  
  // 初始化子分类默认缩入 - 仅设置初始状态，事件处理由tagsManager负责
  categoryTitles.forEach(title => {
    // 默认添加collapsed类
    title.classList.add('collapsed');
    const container = title.nextElementSibling;
    if (container && container.classList.contains('tags-container')) {
      container.classList.add('collapsed');
    }
  });
  
  // 为导航项添加点击事件，实现标签组切换
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      // 移除所有导航项的active类
      navItems.forEach(nav => nav.classList.remove('active'));
      // 为当前点击的导航项添加active类
      this.classList.add('active');
      
      // 获取要显示的分类ID
      const categoryId = this.getAttribute('data-category');
      
      // 隐藏所有分类内容
      categoryContents.forEach(content => content.classList.remove('active'));
      
      // 显示对应的分类内容
      document.getElementById(categoryId).classList.add('active');
      
      // 如果是"已添加"分类，则更新显示已激活的标签
      if (categoryId === '已添加') {
        updateActiveTags();
      }
    });
  });
  
  // 更新已激活标签的显示 - 使用tagsManager
  function updateActiveTags() {
    tagsManager.updateActiveTags(promptDiv, activeTags);
  }
  
  // 统一的事件委托处理 - 优化性能，减少事件监听器数量
  document.addEventListener('click', function(event) {
    // 处理标签点击事件
    if (event.target.classList.contains('tag') && event.target.closest('.tags-container')) {
      event.preventDefault();
      event.stopPropagation();
      
      // 保存当前内容到撤回历史
      saveCurrentContent();
      
      const tagValue = event.target.getAttribute('data-value');
      const isActive = event.target.classList.contains('active');
      
      // 切换标签激活状态
      if (isActive) {
        // 如果标签已激活，则取消激活并从提示词中删除
        event.target.classList.remove('active');
        activeTags.delete(tagValue);
        
        // 直接修改promptDiv的内容，确保标签被移除
        let content = promptDiv.textContent || '';
        
        // 处理各种可能的标签位置情况
        if (content.includes(`, ${tagValue}`)) {
          // 中间或末尾的标签
          content = content.replace(`, ${tagValue}`, '');
        } else if (content.startsWith(`${tagValue}, `)) {
          // 开头的标签
          content = content.replace(`${tagValue}, `, '');
        } else if (content.trim() === tagValue) {
          // 唯一的标签
          content = '';
        } else {
          // 其他情况，尝试直接替换并清理格式
          content = content.replace(tagValue, '').replace(/,\s*,/g, ',').replace(/^\s*,\s*$/g, '');
        }
        
        promptDiv.textContent = content;
      } else {
        // 如果标签未激活，则激活并添加到提示词
        event.target.classList.add('active');
        activeTags.add(tagValue);
        addTagToPrompt(promptDiv, tagValue);
      }
      
      // 如果当前显示的是"已添加"分类，则更新显示
      const activeCategory = document.querySelector('.tags-category-content.active');
      if (activeCategory && activeCategory.id === '已添加') {
        updateActiveTags();
      }
      
      // 保存更新后的内容
      savePromptContent();
      return;
    }
    
    // 处理分类标题点击事件
    if (event.target.classList.contains('category-title')) {
      const content = event.target.nextElementSibling;
      if (content) {
        const isExpanded = content.style.display !== 'none';
        content.style.display = isExpanded ? 'none' : 'block';
        event.target.classList.toggle('collapsed', isExpanded);
      }
      return;
    }
  });
  
  // API设置按钮点击事件
  if (apiSettingsBtn) {
    apiSettingsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'popup.html';
    });
  }
  
  // 铃铛按钮点击事件 - 跳转到新闻页面
  if (bellIcon) {
    bellIcon.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'news.html';
    });
  }
  
  // 清除按钮点击事件
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
    // 保存当前内容到撤回历史
    saveCurrentContent();
    
    promptDiv.innerHTML = '';
    
    // 清除所有已选中标签的状态
    const activeTagElements = document.querySelectorAll('.tag.active');
    activeTagElements.forEach(tag => {
      tag.classList.remove('active');
    });
    
    // 清空activeTags集合
    activeTags.clear();
    
    // 更新"已添加"标签显示
    if (tagsManager && typeof tagsManager.updateActiveTags === 'function') {
      tagsManager.updateActiveTags(promptDiv, activeTags);
    }
    
    // 清除存储的提示词和状态
    try {
      if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.remove(['savedPrompt', 'processedHtml', 'originalInput', 'isExpanded']);
      }
    } catch (e) {
      
    }
    
    // 重置扩写状态
    window.isExpanded = false;
    window.originalInput = '';
    
    // 更新按钮文本
    expandBtn.textContent = '扩写';
    });
  }

  // 撤回按钮点击事件
  if (undoBtn) {
    undoBtn.addEventListener('click', function() {
      performUndo();
    });
  }
  
  // 重做按钮点击事件
  const redoBtn = document.getElementById('redoBtn');
  if (redoBtn) {
    redoBtn.addEventListener('click', function() {
      performRedo();
    });
  }
  
  // 加载保存的提示词（如果有）
  StorageUtils.getPromptData(['savedPrompt', 'processedHtml', 'isExpanded', 'originalInput'], function(result) {
    // 检查并清理任何残留的加载状态
    function isLoadingState(content) {
      if (!content) return false;
      return content.includes('loading-overlay') || 
             content.includes('loading-spinner') || 
             content.includes('loading-container') ||
             content.includes('扩写中...') ||
             content.includes('翻译中...') ||
             content.includes('重写中...');
    }
    
    // 简化的内容恢复逻辑：优先使用processedHtml，其次使用savedPrompt
    // 检查加载状态，如果发现则跳过恢复
    
    if (result.processedHtml && result.processedHtml.trim() && !isLoadingState(result.processedHtml)) {
      // 如果有处理过的HTML内容且不是加载状态，直接使用
      promptDiv.innerHTML = result.processedHtml;
    } else if (result.savedPrompt && result.savedPrompt.trim() && !isLoadingState(result.savedPrompt)) {
      // 否则使用纯文本内容，但也要检查是否为加载状态
      promptDiv.textContent = result.savedPrompt;
    } else if (isLoadingState(result.processedHtml) || isLoadingState(result.savedPrompt)) {
      // 如果检测到加载状态，清理存储并重置内容
      console.log('检测到残留的加载状态，正在清理...');
      StorageUtils.savePromptData('', '', false, '');
      promptDiv.innerHTML = '';
    }
    
    // 恢复扩写状态
    window.isExpanded = result.isExpanded || false;
    window.originalInput = result.originalInput || '';
    
    // 确保按钮状态正确初始化
    if (expandBtn) {
      expandBtn.disabled = false;
      expandBtn.textContent = window.isExpanded ? '重写' : '扩写';
    }
    
    // 清理可能的样式残留
    if (promptDiv) {
      promptDiv.style.position = '';
    }
    
    // 清理LoadingManager状态
    if (loadingManager && loadingManager.activeOperations) {
      loadingManager.activeOperations.clear();
    }
  });
  
  // 自动保存提示词（使用防抖优化）
  const debouncedSave = debounce(function() {
    StorageUtils.savePromptData({
      savedPrompt: promptDiv.textContent,
      processedHtml: promptDiv.innerHTML,
      isExpanded: window.isExpanded || false,
      originalInput: window.originalInput || ''
    });
  }, 400); // 400ms防抖延迟
  
  promptDiv.addEventListener('input', debouncedSave);


// 初始化标签搜索功能
function initTagSearch() {
  SearchUtils.initTagSearch();
}

// 初始化标签点击事件（已移除，功能已合并到主DOMContentLoaded事件中）

// 添加标签到提示词（保留以兼容旧代码）
function addTagToPrompt(element, tagValue) {
  // 获取当前内容（不再强制设置焦点，防止页面滚动）
  const currentContent = element.textContent;
  
  // 检查是否需要添加逗号（如果内容不为空且末尾不是逗号）
  let prefix = "";
  if (currentContent && currentContent.trim() !== "") {
    if (!currentContent.trim().endsWith(",")) {
      prefix = ", ";
    } else {
      prefix = " ";
    }
  }
  
  // 创建标签内容（不带星号，根据需要添加逗号）
  const tagContent = `${prefix}${tagValue}`;
  
  // 始终将内容追加到文本末尾
  const textNode = document.createTextNode(tagContent);
  element.appendChild(textNode);
  
  // 创建新的范围并设置到文本节点之后
  const selection = window.getSelection();
  const range = document.createRange();
  range.setStartAfter(textNode);
  range.setEndAfter(textNode);
  selection.removeAllRanges();
  selection.addRange(range);
  
  // 自动保存更新后的内容
  StorageUtils.savePromptData({
    savedPrompt: element.textContent,
    processedHtml: element.innerHTML,
    isExpanded: window.isExpanded || false,
    originalInput: window.originalInput || ''
  });
}

// 初始化子类别的下拉效果
function initSubcategoryEvents() {
  const subcategories = document.querySelectorAll('.subcategory');
  
  // 默认隐藏所有子类别的标签容器，完全不占位
  subcategories.forEach(subcategory => {
    const tagsContainer = subcategory.querySelector('.tags-container');
    if (tagsContainer) {
      tagsContainer.style.display = 'none';
    }
  });
  
  // 为每个子类别标题添加点击事件
  const subcategoryTitles = document.querySelectorAll('.subcategory-title');
  
  subcategoryTitles.forEach(title => {
    title.addEventListener('click', function() {
      const subcategory = title.parentElement;
      const tagsContainer = subcategory.querySelector('.tags-container');
      
      if (tagsContainer) {
        const isVisible = tagsContainer.style.display === 'block';
        
        // 先隐藏所有子类别的标签容器并移除expanded类
        subcategories.forEach(sub => {
          const subTagsContainer = sub.querySelector('.tags-container');
          const subTitle = sub.querySelector('.subcategory-title');
          if (subTagsContainer) {
            subTagsContainer.style.display = 'none';
          }
          if (subTitle) {
            subTitle.classList.remove('expanded');
          }
        });
        
        // 如果当前子类别的标签容器是隐藏的，则显示它
        if (!isVisible) {
          tagsContainer.style.display = 'block';
          title.classList.add('expanded');
        }
      }
    });
  });
}

// 从提示词中删除标签（保留以兼容旧代码）
function removeTagFromPrompt(element, tagValue) {
  // 获取当前内容
  let content = element.textContent;
  
  // 直接使用字符串替换，更可靠地处理各种情况
  // 情况1: ", 标签值" - 中间或末尾的标签
  if (content.includes(`, ${tagValue}`)) {
    content = content.replace(`, ${tagValue}`, '');
  } 
  // 情况2: "标签值, " - 开头的标签
  else if (content.startsWith(`${tagValue}, `)) {
    content = content.replace(`${tagValue}, `, '');
  }
  // 情况3: "标签值" - 唯一的标签
  else if (content.trim() === tagValue) {
    content = '';
  }
  // 情况4: 其他可能的格式
  else {
    // 尝试简单的字符串替换
    content = content.replace(tagValue, '');
    // 清理可能留下的多余逗号
    content = content.replace(/,\s*,/g, ',').replace(/^\s*,\s*|\s*,\s*$/g, '');
  }
  
  // 更新元素内容
  element.textContent = content;
  
  // 自动保存更新后的内容
  StorageUtils.savePromptData({
    savedPrompt: element.textContent,
    processedHtml: element.innerHTML,
    isExpanded: window.isExpanded || false,
    originalInput: window.originalInput || ''
  });
}

// 保存提示词内容
function savePromptContent() {
  const promptDiv = document.getElementById('promptText');
  const content = promptDiv.innerHTML;
  const textContent = promptDiv.textContent;
  
  try {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({
        'savedPrompt': textContent,
        'processedHtml': content
      });
    }
  } catch (e) {
    ErrorHandler.handleSilently(e);
  }
}
  
  // 处理变量高亮显示
  function processVariableHighlighting(text) {
    // 使用正则表达式查找所有 **变量** 格式的文本
    const regex = /\*\*(.*?)\*\*/g;
    
    // 替换变量标记为纯文本（移除颜色和样式）
    const processedText = text.replace(regex, function(match, p1) {
      return p1;
    });
    
    return processedText;
  }
  
  // 翻译功能
   if (translateBtn) {
     translateBtn.addEventListener('click', function() {
     // 保存当前内容到撤回历史
     saveCurrentContent();
     
     const text = promptDiv.textContent.trim();
     if (!text) {
       showWarningToast('请输入要翻译的文本');
       return;
     }
    
    // 立即取消所有待执行的防抖函数并阻止保存
    debouncedSave.cancel();
    isSaveBlocked = true;
    
    // 暂停自动保存功能，避免在操作过程中保存任何状态
    promptDiv.removeEventListener('input', debouncedSave);
    
    // 使用统一的加载管理器
    const operationId = 'translate-' + Date.now();
    loadingManager.startOperation(operationId, '翻译中...');
    
    // 显示加载状态
    translateBtn.disabled = true;
    translateBtn.textContent = '翻译中...';
    
    // 清除之前的内容，显示加载动画和遮罩层
    const originalContent = promptDiv.innerHTML;
    promptDiv.innerHTML = '<div class="loading-overlay"></div><div class="loading-container"><div class="loading-spinner"></div></div>';
    
    // 为提示词区域添加相对定位，确保遮罩层正确覆盖
    promptDiv.style.position = 'relative';
    
    // 导入翻译服务模块
    import('./modules/api/translationService.js')
      .then(module => {
        // 调用翻译服务
        return module.translateText(text);
      })
      .then(translatedText => {
        // 检查返回结果是否有效
        if (!translatedText || translatedText.trim() === '') {
          console.error('翻译返回了空结果');
          throw new Error('翻译返回了空结果，请重试');
        }
        
        // 处理翻译结果中的变量高亮
        const processedTranslation = processVariableHighlighting(translatedText);
        
        // 显示处理后的翻译结果
        promptDiv.innerHTML = processedTranslation;
        
        // 保存翻译结果
        StorageUtils.savePromptData(translatedText, promptDiv.innerHTML);
      })
      .catch(error => {
        ErrorHandler.handleTranslationError(error, promptDiv, originalContent, showWarningToast);
      })
      .finally(() => {
        // 结束加载状态
        loadingManager.endOperation(operationId);
        
        // 恢复按钮状态
        translateBtn.disabled = false;
        translateBtn.textContent = '翻译';
        
        // 重新启用保存功能和自动保存
        isSaveBlocked = false;
        promptDiv.addEventListener('input', debouncedSave);
      });
    });
  }
  
  // 扩写功能
  // 将变量移到全局作用域
  window.isExpanded = false; // 标记是否已经扩写过
  
  // 撤回功能相关变量 - 简化版本
  let undoStack = []; // 撤回栈，最多保存10步
  const MAX_UNDO_STEPS = 10; // 最大撤回步数
  let currentIndex = -1; // 当前位置索引，-1表示最新状态（未保存到栈中）
  
  // 保存当前内容到撤回栈的函数
  function saveCurrentContent() {
    const promptDiv = document.getElementById('promptText');
    if (!promptDiv) return;
    
    const currentState = {
      content: promptDiv.innerHTML,
      textContent: promptDiv.textContent,
      activeTags: [...activeTags], // 复制当前激活的标签
      isExpanded: window.isExpanded,
      timestamp: Date.now()
    };
    
    // 如果当前不在最新状态，清除后面的历史
    if (currentIndex !== -1) {
      undoStack = undoStack.slice(0, currentIndex + 1);
    }
    
    // 添加到撤回栈
    undoStack.push(currentState);
    
    // 保持最多10步
    if (undoStack.length > MAX_UNDO_STEPS) {
      undoStack.shift();
    }
    
    // 重置到最新状态
    currentIndex = -1;
    
    // 保存到持久化存储并更新按钮状态
    saveUndoHistoryToPersistent();
    updateButtonsState();
  }
  
  // 持久化存储撤回历史
  function saveUndoHistoryToPersistent() {
    StorageUtils.saveUndoHistory(undoStack, currentIndex);
  }

  // 从持久化存储加载撤回历史
  function loadUndoHistoryFromPersistent() {
    StorageUtils.getUndoHistory(function(result) {
      if (result.undoHistory && Array.isArray(result.undoHistory)) {
        undoStack = result.undoHistory;
      }
      if (typeof result.historyPointer === 'number') {
        currentIndex = result.historyPointer;
      }
      updateButtonsState();
    });
  }
  
  // 执行撤回操作
  function performUndo() {
    if (undoStack.length === 0) return false;
    
    const promptDiv = document.getElementById('promptText');
    if (!promptDiv) return false;
    
    // 如果在最新状态，先保存当前状态，然后回到上一个状态
    if (currentIndex === -1) {
      const currentState = {
        content: promptDiv.innerHTML,
        textContent: promptDiv.textContent,
        activeTags: [...activeTags],
        isExpanded: window.isExpanded,
        timestamp: Date.now()
      };
      undoStack.push(currentState);
      if (undoStack.length > MAX_UNDO_STEPS) {
        undoStack.shift();
      }
      currentIndex = undoStack.length - 2; // 指向倒数第二个
    } else {
      currentIndex--; // 简单地向前移动
    }
    
    // 边界检查
    if (currentIndex < 0) {
      currentIndex = 0;
      return false;
    }
    
    // 恢复状态
    restoreState(undoStack[currentIndex]);
    return true;
  }
  
  // 恢复状态的通用函数
  function restoreState(state) {
    const promptDiv = document.getElementById('promptText');
    if (!promptDiv || !state) return;
    
    // 恢复内容
    promptDiv.innerHTML = state.content;
    
    // 恢复激活标签状态
    activeTags.clear();
    if (state.activeTags) {
      state.activeTags.forEach(tag => activeTags.add(tag));
    }
    
    // 恢复扩写状态
    window.isExpanded = state.isExpanded;
    
    // 更新标签显示
    updateTagsDisplay();
    
    // 保存恢复后的内容（不触发新的历史记录）
    savePromptContent();
    
    // 更新按钮状态
    updateButtonsState();
  }
  
  // 更新标签显示的辅助函数
  function updateTagsDisplay() {
    const tagElements = document.querySelectorAll('.tag');
    tagElements.forEach(tag => {
      const tagText = tag.textContent.trim();
      if (activeTags.has(tagText)) {
        tag.classList.add('active');
      } else {
        tag.classList.remove('active');
      }
    });
  }
  
  // 执行重做操作
  function performRedo() {
    if (undoStack.length === 0 || currentIndex === -1) {
      return false; // 没有历史或已在最新状态
    }
    
    currentIndex++; // 向后移动
    
    // 如果到达最新状态
    if (currentIndex >= undoStack.length - 1) {
      currentIndex = -1; // 重置为最新状态
      restoreState(undoStack[undoStack.length - 1]);
    } else {
      restoreState(undoStack[currentIndex]);
    }
    
    return true;
  }
  
  // 统一的按钮状态更新函数
  function updateButtonsState() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    
    // 更新撤回按钮：有历史记录就可以撤回
    if (undoBtn) {
      const canUndo = undoStack.length > 0;
      undoBtn.style.opacity = canUndo ? '1' : '0.5';
      undoBtn.style.cursor = canUndo ? 'pointer' : 'not-allowed';
    }
    
    // 更新重做按钮：不在最新状态且有历史记录就可以重做
    if (redoBtn) {
      const canRedo = undoStack.length > 0 && currentIndex !== -1;
      redoBtn.style.opacity = canRedo ? '1' : '0.5';
      redoBtn.style.cursor = canRedo ? 'pointer' : 'not-allowed';
    }
  }
  
  if (expandBtn) {
    expandBtn.addEventListener('click', function() {
    // 保存当前内容到撤回历史
    saveCurrentContent();
    
    const text = promptDiv.textContent.trim();
    if (!text) {
      showWarningToast('请输入要扩写的文本');
      return;
    }
    
    // 获取扩写组数
    const expandCountInput = document.getElementById('expandCount');
    const expandCount = expandCountInput ? parseInt(expandCountInput.value) || 1 : 1;
    
    // 立即取消所有待执行的防抖函数并阻止保存
    debouncedSave.cancel();
    isSaveBlocked = true;
    
    // 暂停自动保存功能，避免在操作过程中保存任何状态
    promptDiv.removeEventListener('input', debouncedSave);
    
    // 使用统一的加载管理器
    const operationId = 'expand-' + Date.now();
    const loadingText = window.isExpanded ? '重写中...' : '扩写中...';
    loadingManager.startOperation(operationId, loadingText);
    
    // 显示加载状态
    expandBtn.disabled = true;
    expandBtn.textContent = loadingText;
    
    // 清除之前的内容，显示加载动画和遮罩层
    const originalContent = promptDiv.innerHTML;
    promptDiv.innerHTML = '<div class="loading-overlay"></div><div class="loading-container"><div class="loading-spinner"></div></div>';
    
    // 为提示词区域添加相对定位，确保遮罩层正确覆盖
    promptDiv.style.position = 'relative';
    
    // 如果是首次扩写，保存原始输入
    if (!window.isExpanded) {
      window.originalInput = text;
    }
    
    // 检查如果选择了本地模板，但模板为空，则提示用户
    const checkbox = document.getElementById('templateSourceCheckbox');
    if (checkbox && !checkbox.checked) {
      // 导入本地模板管理器
      const { customTemplateManager, TEMPLATE_TYPES } = window.customTemplateManager ? 
        { customTemplateManager: window.customTemplateManager, TEMPLATE_TYPES: window.TEMPLATE_TYPES } :
        { customTemplateManager: null, TEMPLATE_TYPES: null };
      
      if (customTemplateManager) {
        // 获取滑块状态，确定使用哪个扩写模块
        const modeToggle = document.getElementById('modeToggle');
        const useFilmMode = modeToggle ? !modeToggle.checked : false;
        
        // 根据当前模式选择检查图片或视频模板
        const templateType = useFilmMode ? TEMPLATE_TYPES.VIDEO : TEMPLATE_TYPES.IMAGE;
        const template = customTemplateManager.getTemplate(templateType);
        
        // 如果模板为空，使用橙色提示框样式提示用户
        if (!template || !template.trim()) {
          const templateTypeName = useFilmMode ? '视频' : '图片';
          
          // 创建橙色提示框
          const notificationDiv = document.createElement('div');
          notificationDiv.style.backgroundColor = '#ff8c00';
          notificationDiv.style.color = 'white';
          notificationDiv.style.padding = '15px 20px';
          notificationDiv.style.borderRadius = '5px';
          notificationDiv.style.margin = '10px auto';
          notificationDiv.style.textAlign = 'center';
          notificationDiv.style.maxWidth = '400px';
          notificationDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
          notificationDiv.style.display = 'flex';
          notificationDiv.style.alignItems = 'center';
          notificationDiv.style.justifyContent = 'center';
          
          // 添加图标
          const iconSpan = document.createElement('span');
          iconSpan.innerHTML = '&#9888;'; // 警告图标
          iconSpan.style.marginRight = '10px';
          iconSpan.style.fontSize = '20px';
          
          // 添加文本
          const textSpan = document.createElement('span');
          textSpan.textContent = `模板内容不能为空`;
          
          // 组装提示框
          notificationDiv.appendChild(iconSpan);
          notificationDiv.appendChild(textSpan);
          
          // 插入到页面并定位到输入框中间
          document.body.appendChild(notificationDiv);
          
          // 获取输入框元素
          const promptText = document.getElementById('promptText');
          const promptRect = promptText.getBoundingClientRect();
          
          // 设置固定定位，使其显示在输入框的中间位置
          notificationDiv.style.position = 'fixed';
          notificationDiv.style.top = `${promptRect.top + promptRect.height/2}px`;
          notificationDiv.style.left = `${promptRect.left + promptRect.width/2}px`;
          notificationDiv.style.transform = 'translate(-50%, -50%)';
          notificationDiv.style.zIndex = '1000';
          
          // 自动消失
          setTimeout(() => {
            if (notificationDiv.parentNode) {
              notificationDiv.parentNode.removeChild(notificationDiv);
            }
          }, 3000);
          
          // 结束加载状态
          loadingManager.endOperation(operationId);
          
          // 恢复原始内容
          promptDiv.innerHTML = originalContent;
          promptDiv.style.position = '';
          expandBtn.disabled = false;
          expandBtn.textContent = window.isExpanded ? '重写' : '扩写';
          return;
        }
      }
    }
    
    // 获取滑块状态，确定使用哪个扩写模块
    const modeToggle = document.getElementById('modeToggle');
    const useFilmMode = modeToggle ? !modeToggle.checked : false; // 未选中时使用胶片模式(V-kuozhan.js)
    

    
    // 导入扩写服务模块
    import('./modules/api/expansionService.js')
      .then(module => {
        // 调用扩写服务，传递模式参数和扩写组数
        return module.expandText(text, useFilmMode, expandCount);
      })
      .then(expandedText => {
        // 检查返回结果是否有效
        if (!expandedText || expandedText.trim() === '') {
          console.error('AI返回了空结果');
          throw new Error('AI返回了空结果，请重试');
        }
        
        // 处理扩写结果中的变量高亮
        const processedExpansion = processVariableHighlighting(expandedText);
        
        // 显示处理后的扩写结果
        promptDiv.innerHTML = processedExpansion;
        
        // 保存原始文本和扩写后的文本
        StorageUtils.savePromptData({
          savedPrompt: promptDiv.textContent,
          processedHtml: promptDiv.innerHTML,
          originalInput: window.originalInput,
          isExpanded: true
        });
        
        // 更新按钮状态为"重写"
        window.isExpanded = true;
      })
      .catch(error => {
        // 特殊处理API配置错误
        if (error === '请先配置API设置' || error.message === '请先配置API设置') {
          // 使用警告提示框样式
          showWarningToast('请先配置API设置，点击右上角的"API设置"按钮进行配置');
          
          // 恢复原始内容和样式
          if (originalContent) {
            promptDiv.innerHTML = originalContent;
            promptDiv.style.position = '';
          }
        } else {
          // 其他错误使用增强的错误对话框
          console.error('扩写错误:', error);
          ErrorHandler.restoreContentAndHandleError(promptDiv, originalContent, error, showEnhancedErrorDialog);
        }
      })
      .finally(() => {
        // 结束加载状态
        loadingManager.endOperation(operationId);
        
        // 恢复按钮状态
        expandBtn.disabled = false;
        expandBtn.textContent = window.isExpanded ? '重写' : '扩写';
        
        // 重新启用自动保存功能
        promptDiv.addEventListener('input', debouncedSave);
      });
    });
  }
  
  // 磁盘图标点击事件 - 跳转到保存的提示词页面
  if (saveIcon) {
    saveIcon.addEventListener('click', function() {
      window.location.href = 'saved-prompts.html';
    });
  }

  // 小猪图标点击事件 - 保存提示词
  if (piggyBankIcon) {
    piggyBankIcon.addEventListener('click', function() {
      const content = promptDiv.textContent.trim();
      const htmlContent = promptDiv.innerHTML;
      
      if (!content) {
        showWarningToast('请先输入提示词内容');
        return;
      }
      
      // 获取当前激活的标签
      const activeTagsArray = Array.from(activeTags);
      
      // 获取当前主题
      const currentTheme = themeManager.getCurrentTheme();
      
      // 保存提示词数据
      const promptData = {
        content: content,
        htmlContent: htmlContent,
        activeTags: activeTagsArray,
        theme: currentTheme,
        mediaType: window.currentMediaType || 'image' // 保存当前媒体类型（图片或视频）
      };
      
      // 使用savedPromptsManager保存数据
      if (window.savedPromptsManager) {
        const savedPrompt = window.savedPromptsManager.addPrompt(promptData);
        if (savedPrompt) {
          showSaveSuccessToast();
        } else {
          showWarningToast('保存失败，请重试');
        }
      } else {
        showWarningToast('保存功能未初始化');
      }
    });
  }

  // 复制功能
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
    // 获取纯文本内容，去除HTML标签和星号标记
    let text;
    if (promptDiv.innerHTML.includes('<span style="color:')) {
      // 创建临时元素来提取纯文本
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = promptDiv.innerHTML;
      
      // 提取所有文本内容，去除HTML标签
      text = tempDiv.textContent.trim();
      
      // 去除所有星号标记
      text = text.replace(/\*\*/g, '');
    } else {
      // 如果没有HTML标签，直接使用textContent并去除星号
      text = promptDiv.textContent.trim().replace(/\*\*/g, '');
    }
    
    if (!text) {
       showCopyWarningToast();
       return;
     }
    
    // 优先使用现代的 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showCopySuccessToast();
      }).catch(err => {
        console.error('复制失败:', err);
        // 如果 Clipboard API 失败，回退到传统方法
        fallbackCopyToClipboard(text);
      });
    } else {
      // 回退到传统的复制方法
      fallbackCopyToClipboard(text);
    }
    
    // 传统的复制方法（回退方案）
    function fallbackCopyToClipboard(textToCopy) {
      // 创建临时textarea元素，设置样式避免影响页面布局
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      
      // 设置样式使其不影响页面布局和滚动条
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      textarea.style.zIndex = '-1';
      
      document.body.appendChild(textarea);
      
      // 选择文本并复制
      textarea.focus();
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          showCopySuccessToast();
        } else {
          showCopyWarningToast();
        }
      } catch (err) {
        console.error('复制失败:', err);
        showCopyWarningToast();
      }
      
      // 移除临时元素
      document.body.removeChild(textarea);
    }
    
    // 移除原有的按钮文本修改逻辑
    // const originalText = copyBtn.textContent;
    // copyBtn.textContent = '已复制!';
    // copyBtn.disabled = true;
    
    // // 2秒后恢复按钮状态
    // setTimeout(() => {
    //   copyBtn.textContent = originalText;
    //   copyBtn.disabled = false;
    // }, 2000);
    });
  }

  // 初始化外部链接下拉菜单
  if (externalLinksSelect) {
    // 加载外部链接数据
    loadExternalLinks();
    
    // 添加选择事件监听器
    externalLinksSelect.addEventListener('change', function() {
      const selectedUrl = this.value;
      if (selectedUrl) {
        // 在新标签页中打开链接
        window.open(selectedUrl, '_blank');
        // 重置选择框到默认状态
        this.value = '';
      }
    });
  }

  // 初始化导航开关按钮
  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    modeToggle.addEventListener('change', function() {
      const isChecked = this.checked;
      
      // 可以在这里添加具体的功能逻辑
      if (isChecked) {
        // 切换到picture模式的逻辑
        window.currentMediaType = 'image';
      } else {
        // 切换到film模式的逻辑
        window.currentMediaType = 'video';
      }
    });
    
    // 初始化媒体类型
    window.currentMediaType = modeToggle.checked ? 'image' : 'video';
  }
  
  // 初始化撤回功能
  loadUndoHistoryFromPersistent(); // 加载持久化的撤回历史
});

// 全局变量用于管理外部链接请求的取消
// 加载外部链接数据
async function loadExternalLinks() {
  await ExternalLinksUtils.loadExternalLinks();
}

// 显示保存成功提示框
function showSaveSuccessToast() {
  ToastUtils.showSaveSuccess();
}

// 显示复制成功提示框
function showCopySuccessToast() {
  ToastUtils.showCopySuccess();
}

// 显示增强的错误提示框
function showEnhancedErrorDialog(error) {
  ToastUtils.showEnhancedError(error);
}

// 设置重试操作的全局函数
window.retryLastOperation = function() {

  
  // 检查是否有扩写按钮，如果有则重新触发扩写
  const expandBtn = document.getElementById('expandBtn');
  if (expandBtn && !expandBtn.disabled) {
    
    expandBtn.click();
    return;
  }
  
  // 数据库测试重试已禁用，避免不必要的连接尝试
  // 如需重试数据库测试，请在控制台手动调用：databaseTestManager.runAllTests()
  // if (window.databaseTestManager) {
  //   console.log('🔄 重试数据库测试');
  //   window.databaseTestManager.runAllTests();
  //   return;
  // }
  
  // 默认重试：重新加载页面
  
  window.location.reload();
};

// 显示通用警告提示框
function showWarningToast(message) {
  ToastUtils.showWarning(message || '暂无内容可复制');
}

// 显示复制警告提示框（保持向后兼容）
function showCopyWarningToast() {
  ToastUtils.showCopyWarning();
}

// 添加页面卸载事件监听器
window.addEventListener('beforeunload', cleanupOnPageUnload);
window.addEventListener('unload', cleanupOnPageUnload);

// 添加页面隐藏事件监听器（用于处理页面切换）
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    cleanupOnPageUnload();
  }
});