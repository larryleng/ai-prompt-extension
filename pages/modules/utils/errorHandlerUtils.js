/**
 * 错误处理工具模块
 * 提供统一的错误处理和用户反馈功能
 */

export const ErrorHandlerUtils = {
  /**
   * 显示增强错误对话框
   */
  showEnhancedErrorDialog(error) {
    const errorDialog = document.getElementById('errorDialog');
    const errorMessage = document.getElementById('errorMessage');
    const errorDetails = document.getElementById('errorDetails');
    const retryBtn = document.getElementById('retryBtn');
    const closeBtn = document.getElementById('closeBtn');
    
    if (!errorDialog) return;
    
    // 设置错误信息
    if (errorMessage) {
      errorMessage.textContent = error.message || '发生了未知错误';
    }
    
    if (errorDetails) {
      errorDetails.textContent = error.stack || error.toString();
    }
    
    // 显示对话框
    errorDialog.style.display = 'flex';
    
    // 绑定重试按钮事件
    if (retryBtn) {
      retryBtn.onclick = () => {
        errorDialog.style.display = 'none';
        if (window.retryLastOperation) {
          window.retryLastOperation();
        }
      };
    }
    
    // 绑定关闭按钮事件
    if (closeBtn) {
      closeBtn.onclick = () => {
        errorDialog.style.display = 'none';
      };
    }
    
    // 点击背景关闭
    errorDialog.onclick = (e) => {
      if (e.target === errorDialog) {
        errorDialog.style.display = 'none';
      }
    };
  },

  /**
   * 显示警告提示
   */
  showWarningToast(message) {
    // 移除现有的警告提示
    const existingToast = document.querySelector('.warning-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // 创建警告提示元素
    const toast = document.createElement('div');
    toast.className = 'warning-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">⚠️</div>
        <div class="toast-message">${message}</div>
      </div>
    `;
    
    // 添加样式
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
      padding: 0;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, 5000);
  },

  /**
   * 显示成功提示
   */
  showSuccessToast(message) {
    // 移除现有的成功提示
    const existingToast = document.querySelector('.success-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // 创建成功提示元素
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-icon">✅</div>
        <div class="toast-message">${message}</div>
      </div>
    `;
    
    // 添加样式
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #00b894, #00a085);
      color: white;
      padding: 0;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 184, 148, 0.3);
      z-index: 10000;
      animation: slideInRight 0.3s ease-out;
      max-width: 400px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove();
          }
        }, 300);
      }
    }, 3000);
  },

  /**
   * 显示复制成功提示
   */
  showCopySuccessToast() {
    this.showSuccessToast('内容已复制到剪贴板');
  },

  /**
   * 显示复制警告提示
   */
  showCopyWarningToast() {
    this.showWarningToast('复制功能需要HTTPS环境或本地环境');
  },

  /**
   * 显示保存成功提示
   */
  showSaveSuccessToast() {
    this.showSuccessToast('内容已保存');
  },

  /**
   * 通用错误处理函数
   */
  handleError(error, context = '') {
    console.error(`${context ? context + ': ' : ''}`, error);
    
    // 根据错误类型显示不同的处理方式
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      this.showWarningToast('网络连接失败，请检查网络设置');
    } else if (error.name === 'TypeError') {
      this.showWarningToast('数据格式错误，请刷新页面重试');
    } else if (error.message.includes('storage')) {
      this.showWarningToast('存储空间不足或访问受限');
    } else {
      this.showEnhancedErrorDialog(error);
    }
  },

  /**
   * 异步操作错误处理包装器
   */
  async withErrorHandling(asyncFn, context = '') {
    try {
      return await asyncFn();
    } catch (error) {
      this.handleError(error, context);
      throw error; // 重新抛出错误以便调用者处理
    }
  },

  /**
   * 重试机制包装器
   */
  async withRetry(asyncFn, maxRetries = 3, delay = 1000, context = '') {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await asyncFn();
      } catch (error) {
        lastError = error;
        
        if (i === maxRetries - 1) {
          // 最后一次重试失败
          this.handleError(error, `${context} (重试 ${maxRetries} 次后失败)`);
          throw error;
        }
        
        // 等待后重试
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
};