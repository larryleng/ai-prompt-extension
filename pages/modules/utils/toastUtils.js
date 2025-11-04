/**
 * Toast 通知工具模块
 * 提供统一的提示信息显示功能
 */

export const ToastUtils = {
  /**
   * 显示成功提示
   */
  showSuccess(message) {
    this.removeExistingToast('success-toast');
    
    const toast = this.createToast('success-toast', message, '✅', {
      background: 'linear-gradient(135deg, #00b894, #00a085)',
      shadowColor: 'rgba(0, 184, 148, 0.3)',
      duration: 3000
    });
    
    this.showToast(toast);
  },

  /**
   * 显示警告提示
   */
  showWarning(message, position = 'center') {
    this.removeExistingToast('warning-toast');
    
    const toast = this.createToast('warning-toast', message, '⚠️', {
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      shadowColor: 'rgba(255, 107, 107, 0.3)',
      duration: 3000
    }, position);
    
    this.showToast(toast);
  },

  /**
   * 显示信息提示
   */
  showInfo(message) {
    this.removeExistingToast('info-toast');
    
    const toast = this.createToast('info-toast', message, 'ℹ️', {
      background: 'linear-gradient(135deg, #0984e3, #74b9ff)',
      shadowColor: 'rgba(9, 132, 227, 0.3)',
      duration: 3000
    });
    
    this.showToast(toast);
  },

  /**
   * 显示错误提示
   */
  showError(message) {
    this.removeExistingToast('error-toast');
    
    const toast = this.createToast('error-toast', message, '❌', {
      background: 'linear-gradient(135deg, #d63031, #e17055)',
      shadowColor: 'rgba(214, 48, 49, 0.3)',
      duration: 3000
    });
    
    this.showToast(toast);
  },

  /**
   * 显示保存成功提示
   */
  showSaveSuccess(position = 'center') {
    this.removeExistingToast('success-toast');
    
    const toast = this.createToast('success-toast', '内容已保存', '✅', {
      background: 'linear-gradient(135deg, #00b894, #00a085)',
      shadowColor: 'rgba(0, 184, 148, 0.3)',
      duration: 3000
    }, position);
    
    this.showToast(toast);
  },

  /**
   * 显示复制成功提示
   */
  showCopySuccess(position = 'center') {
    this.removeExistingToast('success-toast');
    
    const toast = this.createToast('success-toast', '内容已复制到剪贴板', '✅', {
      background: 'linear-gradient(135deg, #00b894, #00a085)',
      shadowColor: 'rgba(0, 184, 148, 0.3)',
      duration: 3000
    }, position);
    
    this.showToast(toast);
  },

  /**
   * 显示复制警告提示
   */
  showCopyWarning() {
    this.showWarning('复制功能需要HTTPS环境或本地环境');
  },

  /**
   * 显示增强错误提示（用于扩写功能等复杂错误处理）
   */
  showEnhancedError(error) {
    this.removeExistingToast('error-toast');
    
    // 解析错误信息并提供明确的错误原因和解决建议
    let errorMessage = '';
    let suggestion = '';
    
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = '发生了未知错误';
    }
    
    // 针对不同类型的错误提供具体的解决建议
    if (errorMessage.includes('请先配置API设置') || errorMessage.includes('API密钥')) {
      suggestion = '请点击右上角的"API设置"按钮进行配置';
    } else if (errorMessage.includes('API密钥错误') || errorMessage.includes('authentication') || errorMessage.includes('401')) {
      suggestion = '请检查您的API密钥是否正确';
    } else if (errorMessage.includes('API密钥无效') || errorMessage.includes('invalid')) {
      suggestion = '请检查您的API密钥格式是否正确';
    } else if (errorMessage.includes('访问被拒绝') || errorMessage.includes('access denied') || errorMessage.includes('403')) {
      suggestion = '请检查您的API密钥权限设置';
    } else if (errorMessage.includes('API端点错误') || errorMessage.includes('endpoint')) {
      suggestion = '请检查API端点URL配置是否正确';
    } else if (errorMessage.includes('服务器错误') || errorMessage.includes('500')) {
      suggestion = '服务器暂时不可用，请稍后重试';
    } else if (errorMessage.includes('模型不存在') || errorMessage.includes('model')) {
      suggestion = '请检查模型名称是否正确或该模型是否可用';
    } else if (errorMessage.includes('网络') || errorMessage.includes('network')) {
      suggestion = '请检查网络连接是否正常';
    } else {
      suggestion = '请检查配置或稍后重试';
    }
    
    // 组合完整的错误信息
    const fullMessage = suggestion ? `${errorMessage}\n💡 ${suggestion}` : errorMessage;
    
    const toast = this.createToast('error-toast', fullMessage, '❌', {
      background: 'linear-gradient(135deg, #d63031, #e17055)',
      shadowColor: 'rgba(214, 48, 49, 0.3)',
      duration: 3000
    }, 'center');
    
    this.showToast(toast);
  },

  /**
   * 移除现有的提示
   */
  removeExistingToast(className) {
    const existingToast = document.querySelector(`.${className}`);
    if (existingToast) {
      existingToast.remove();
    }
  },

  /**
   * 创建提示元素
   */
  createToast(className, message, icon, options, position = 'top-right') {
    const toast = document.createElement('div');
    toast.className = className;
    
    // 处理多行消息，将换行符转换为HTML换行
    const formattedMessage = message.replace(/\n/g, '<br>');
    
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${formattedMessage}</div>
      </div>
    `;
    
    // 根据位置设置样式
    let positionStyles = '';
    let animationName = '';
    
    if (position === 'center') {
      // 获取输入框位置
      const promptContainer = document.getElementById('promptContainer');
      if (promptContainer) {
        const rect = promptContainer.getBoundingClientRect();
        positionStyles = `
          position: fixed;
          left: 50%;
          top: ${rect.top + rect.height / 2}px;
          transform: translate(-50%, -50%);
        `;
        animationName = 'fadeInCenter 0.3s ease-out';
      } else {
        // 如果找不到输入框，使用屏幕中心
        positionStyles = `
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        `;
        animationName = 'fadeInCenter 0.3s ease-out';
      }
    } else {
      // 默认右上角位置
      positionStyles = `
        position: fixed;
        top: 20px;
        right: 20px;
      `;
      animationName = 'slideInRight 0.3s ease-out';
    }
    
    // 应用样式
    toast.style.cssText = `
      ${positionStyles}
      background: ${options.background};
      color: white;
      padding: 0;
      border-radius: 12px;
      box-shadow: 0 8px 32px ${options.shadowColor};
      z-index: 10000;
      animation: ${animationName};
      max-width: 400px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // 存储位置信息，用于移除动画
    toast.dataset.position = position;
    
    // 设置自动移除
    if (options.duration) {
      setTimeout(() => {
        this.removeToast(toast);
      }, options.duration);
    }
    
    return toast;
  },

  /**
   * 显示提示
   */
  showToast(toast) {
    document.body.appendChild(toast);
    
    // 添加动画样式（如果不存在）
    this.addAnimationStyles();
  },

  /**
   * 移除提示
   */
  removeToast(toast) {
    if (toast.parentNode) {
      const position = toast.dataset.position || 'top-right';
      const animationName = position === 'center' ? 'fadeOutCenter 0.3s ease-in' : 'slideOutRight 0.3s ease-in';
      toast.style.animation = animationName;
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }
  },

  /**
   * 添加动画样式
   */
  addAnimationStyles() {
    if (document.getElementById('toast-animations')) return;
    
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      @keyframes fadeInCenter {
        from {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
        }
        to {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      }
      
      @keyframes fadeOutCenter {
        from {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        to {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
        }
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        padding: 16px 20px;
        gap: 12px;
      }
      
      .toast-icon {
        font-size: 20px;
        flex-shrink: 0;
      }
      
      .toast-message {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
        font-weight: 500;
      }
    `;
    
    document.head.appendChild(style);
  }
};