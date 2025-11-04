// 自定义模板管理页面主控制脚本
import { customTemplateManager, TEMPLATE_TYPES } from './modules/data/customTemplates.js';

// 当前模板类型
let currentTemplateType = TEMPLATE_TYPES.VIDEO;

// 主题管理器
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'light';
  }

  init() {
    this.applyTheme(this.currentTheme);
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
  }
}

// 模板管理器
class TemplateManager {
  constructor() {
    // 获取标签页相关元素
    this.videoTab = document.getElementById('videoTab');
    this.imageTab = document.getElementById('imageTab');
    this.videoContent = document.getElementById('videoContent');
    this.imageContent = document.getElementById('imageContent');
    
    // 获取文本框元素
    this.videoTemplateContent = document.getElementById('videoTemplateContent');
    this.imageTemplateContent = document.getElementById('imageTemplateContent');
    
    // 获取按钮元素
    this.saveVideoBtn = document.getElementById('saveVideoTemplateBtn');
    this.backBtn = document.getElementById('backBtn');
    
    this.init();
  }

  init() {
    // 初始化事件监听器
    this.setupEventListeners();
    
    // 加载模板内容
    this.loadAllTemplateContent();
    
    // 设置初始状态
    this.setActiveTab('video');
  }

  setupEventListeners() {
    // 标签页切换
    if (this.videoTab) {
      this.videoTab.addEventListener('click', (e) => {
        e.preventDefault();
        this.setActiveTab('video');
      });
    }

    if (this.imageTab) {
      this.imageTab.addEventListener('click', (e) => {
        e.preventDefault();
        this.setActiveTab('image');
      });
    }

    // 视频模板按钮
    if (this.saveVideoBtn) {
      this.saveVideoBtn.addEventListener('click', () => {
        this.saveTemplate(currentTemplateType);
      });
    }

    // 返回按钮
    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => {
        this.goBack();
      });
    }

    // 内容变化监听（自动保存）
    if (this.videoTemplateContent) {
      this.videoTemplateContent.addEventListener('input', () => {
        this.autoSaveTemplate(TEMPLATE_TYPES.VIDEO);
      });
    }

    if (this.imageTemplateContent) {
      this.imageTemplateContent.addEventListener('input', () => {
        this.autoSaveTemplate(TEMPLATE_TYPES.IMAGE);
      });
    }
  }

  setActiveTab(tabType) {
    // 更新标签按钮状态
    if (this.videoTab && this.imageTab) {
      this.videoTab.classList.toggle('active', tabType === 'video');
      this.imageTab.classList.toggle('active', tabType === 'image');
    }

    // 更新内容显示状态
    if (this.videoContent && this.imageContent) {
      this.videoContent.classList.toggle('active', tabType === 'video');
      this.imageContent.classList.toggle('active', tabType === 'image');
    }

    // 更新当前模板类型
    currentTemplateType = tabType === 'video' ? TEMPLATE_TYPES.VIDEO : TEMPLATE_TYPES.IMAGE;
  }

  loadAllTemplateContent() {
    // 加载视频模板内容
    if (this.videoTemplateContent) {
      const videoContent = customTemplateManager.getTemplate(TEMPLATE_TYPES.VIDEO);
      this.videoTemplateContent.value = videoContent;
    }

    // 加载图片模板内容
    if (this.imageTemplateContent) {
      const imageContent = customTemplateManager.getTemplate(TEMPLATE_TYPES.IMAGE);
      this.imageTemplateContent.value = imageContent;
    }
  }

  saveTemplate(type) {
    const textarea = type === TEMPLATE_TYPES.VIDEO ? 
      this.videoTemplateContent : this.imageTemplateContent;
    
    if (!textarea) return;
    
    const content = textarea.value.trim();
    
    if (!content) {
      const typeName = type === TEMPLATE_TYPES.VIDEO ? '视频' : '图片';
      this.showNotification(`请输入${typeName}模板内容`, 'warning');
      return;
    }

    const success = customTemplateManager.saveTemplate(type, content);
    
    if (success) {
      const templateTypeName = type === TEMPLATE_TYPES.VIDEO ? '视频' : '图片';
      this.showNotification(`${templateTypeName}模板保存成功！`, 'success');
    } else {
      this.showNotification('保存失败，请重试', 'error');
    }
  }

  autoSaveTemplate(type) {
    const textarea = type === TEMPLATE_TYPES.VIDEO ? 
      this.videoTemplateContent : this.imageTemplateContent;
    
    if (!textarea) return;
    
    const content = textarea.value.trim();
    customTemplateManager.saveTemplate(type, content);
  }

  goBack() {
    // 返回主页面
    window.location.href = 'index.html';
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    if (!container) {
      return;
    }

    // 清除所有现有通知
    container.innerHTML = '';

    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      margin-bottom: 15px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      opacity: 1;
      transform: translateY(0);
      transition: all 0.3s ease;
    `;
    
    notification.innerHTML = `
      <div class="notification-content" style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 20px;
      ">
        <span class="notification-message" style="
          font-size: 14px;
          font-weight: 500;
          flex: 1;
        ">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()" style="
          background: none;
          border: none;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          padding: 0;
          margin-left: 15px;
          opacity: 0.7;
          color: inherit;
        ">×</button>
      </div>
    `;

    // 设置通知类型的背景色
    switch(type) {
      case 'success':
        notification.style.backgroundColor = '#10b981';
        notification.style.color = 'white';
        break;
      case 'error':
        notification.style.backgroundColor = '#ef4444';
        notification.style.color = 'white';
        break;
      case 'warning':
        notification.style.backgroundColor = '#f59e0b';
        notification.style.color = 'white';
        break;
      default:
        notification.style.backgroundColor = '#3b82f6';
        notification.style.color = 'white';
    }

    // 添加到容器
    container.appendChild(notification);

    // 设置自动移除定时器 (3秒显示时间)
     const removeTimer = setTimeout(() => {
       if (notification.parentElement) {
         notification.style.opacity = '0';
         notification.style.transform = 'translateY(-20px)';
         setTimeout(() => {
           if (notification.parentElement) {
             notification.remove();
           }
         }, 300);
       }
     }, 3000);

    // 为关闭按钮添加事件监听器
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        clearTimeout(removeTimer);
        if (notification.parentElement) {
          notification.style.opacity = '0';
          notification.style.transform = 'translateY(-20px)';
          setTimeout(() => {
            if (notification.parentElement) {
              notification.remove();
            }
          }, 300);
        }
      });
    }
  }

  // 获取模板内容的公共方法
  getTemplate(type) {
    return customTemplateManager.getTemplate(type);
  }

  // 检查是否有自定义模板
  hasCustomTemplate(type) {
    return customTemplateManager.hasCustomTemplate(type);
  }

  // 获取模板统计信息
  getStatistics() {
    return customTemplateManager.getStatistics();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化主题管理器
  const themeManager = new ThemeManager();
  themeManager.init();
  
  // 初始化模板管理器
  const templateManager = new TemplateManager();
  
  // 将模板管理器实例暴露到全局，供其他模块使用
  window.templateManager = templateManager;
});

// 导出模板管理器类供其他模块使用
export { TemplateManager };