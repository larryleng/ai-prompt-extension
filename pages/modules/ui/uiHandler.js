// UI交互处理模块

// 初始化UI元素
export function initializeUI() {
  return {
    apiKeyInput: document.getElementById('apiKey'),
    endpointInput: document.getElementById('endpointInput'),
    endpointSelect: document.getElementById('endpointSelect'),
    modelInput: document.getElementById('model'),
    saveButton: document.getElementById('saveBtn'),
    testButton: document.getElementById('testBtn')
  };
}

// 更新UI元素值
export function updateUIValues(elements, config) {
  if (!config) {
    config = {
      apiKey: '',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo'
    };
  }
  
  elements.apiKeyInput.value = config.apiKey || '';
  elements.endpointInput.value = config.endpoint || 'https://api.openai.com/v1/chat/completions';
  elements.modelInput.value = config.model || 'gpt-3.5-turbo';
}

// 获取UI元素值
export function getUIValues(elements) {
  return {
    apiKey: elements.apiKeyInput.value.trim(),
    endpoint: elements.endpointInput.value.trim(),
    model: elements.modelInput.value.trim()
  };
}

// 显示通知消息
export function showNotification(message, isError = false, isLoading = false) {
  const container = document.getElementById('notificationContainer');
  if (!container) {
    alert(message);
    return;
  }

  // 如果是加载状态，先清除之前的加载通知
  if (isLoading) {
    const existingLoadingNotifications = container.querySelectorAll('.notification.loading');
    existingLoadingNotifications.forEach(notification => {
      notification.remove();
    });
  } else {
    // 如果不是加载状态，清除所有加载通知（成功/错误结果应该替换加载通知）
    const existingLoadingNotifications = container.querySelectorAll('.notification.loading');
    existingLoadingNotifications.forEach(notification => {
      notification.remove();
    });
  }

  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `notification ${isError ? 'error' : 'success'} ${isLoading ? 'loading' : ''}`;
  
  // 如果是加载状态，添加加载动画
  if (isLoading) {
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'loading-spinner-small';
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    notification.appendChild(loadingSpinner);
    notification.appendChild(messageSpan);
  } else {
    notification.textContent = message;
  }

  // 添加到容器
  container.appendChild(notification);

  // 触发显示动画
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  // 自动移除通知（加载状态的通知不自动移除）
  if (!isLoading) {
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300); // 等待淡出动画完成
    }, 3000); // 3秒后开始淡出
  }
}