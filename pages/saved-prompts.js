// 保存的提示词页面主控制脚本

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

// 创建主题管理器实例
const themeManager = new ThemeManager();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  
  
  // 初始化主题管理器
  themeManager.init();
  
  // 绑定返回首页按钮事件
  const backToHomeBtn = document.getElementById('backToHome');
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
  
  // 绑定去首页创建按钮事件
  const goToHomeBtn = document.getElementById('goToHome');
  if (goToHomeBtn) {
    goToHomeBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
  
  // 确保SavedPromptsManager已加载，如果没有则等待
  if (window.savedPromptsManager) {
    loadAndDisplayPrompts();
  } else {
    // 等待模块加载完成
    setTimeout(() => {
      if (window.savedPromptsManager) {
        loadAndDisplayPrompts();
      } else {
        // 显示错误状态
        showErrorState();
      }
    }, 100);
  }
});

// 加载并显示保存的提示词
async function loadAndDisplayPrompts(offlineMode = false) {
  try {
    // 检查SavedPromptsManager是否可用
    if (!window.savedPromptsManager) {
      showErrorState('module');
      return;
    }
    
    // 获取本地保存的提示词
    const prompts = window.savedPromptsManager.getAllPrompts();
    
    // 直接显示本地提示词，不尝试连接数据库
    displayPrompts(prompts);
    
  } catch (error) {
    showErrorState('module');
  }
}

// 显示提示词列表
function displayPrompts(prompts) {
  const promptsList = document.getElementById('promptsList');
  const emptyState = document.getElementById('emptyState');
  const promptsTitle = document.getElementById('promptsTitle');
  const promptsListContainer = document.querySelector('.prompts-list-container');
  
  // 更新标题中的总条数
  if (promptsTitle) {
    promptsTitle.textContent = `我的提示词 (${prompts.length})`;
  }
  
  if (prompts.length === 0) {
    // 显示空状态，隐藏列表
    if (promptsList) {
      promptsList.style.display = 'none';
      promptsList.innerHTML = ''; // 清空列表内容
    }
    if (emptyState) emptyState.style.display = 'block';
    
    // 确保容器高度适应空状态
    if (promptsListContainer) {
      promptsListContainer.classList.add('empty-state-active');
      promptsListContainer.style.minHeight = 'auto';
    }
  } else {
    // 显示提示词列表，隐藏空状态
    if (emptyState) emptyState.style.display = 'none';
    if (promptsList) {
      promptsList.style.display = 'block';
      renderPromptsList(prompts);
    }
    
    // 恢复容器高度
    if (promptsListContainer) {
      promptsListContainer.classList.remove('empty-state-active');
      promptsListContainer.style.minHeight = '';
    }
  }
  
  // 强制页面重新布局，确保页脚正确定位
  setTimeout(() => {
    // 强制重新计算页面布局
    document.body.offsetHeight;
    // 触发resize事件
    window.dispatchEvent(new Event('resize'));
    // 强制重新渲染
    document.documentElement.style.display = 'none';
    document.documentElement.offsetHeight;
    document.documentElement.style.display = '';
  }, 100);
}

// 格式化提示词内容，保留换行和分段
function formatPromptContent(content) {
  if (!content) return '';
  
  // 如果已经是HTML内容，直接返回
  if (content.includes('<') && content.includes('>')) {
    return content;
  }
  
  // 将换行符转换为<br>标签，保留分段格式
  return content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>').replace(/^(.+)$/, '<p>$1</p>');
}

// 渲染提示词列表
function renderPromptsList(prompts) {
  const promptsList = document.getElementById('promptsList');
  if (!promptsList) return;
  
  promptsList.innerHTML = '';
  
  prompts.forEach(prompt => {
    const promptItem = createPromptItem(prompt);
    promptsList.appendChild(promptItem);
  });
}

// 创建单个提示词项目
function createPromptItem(prompt) {
  const item = document.createElement('div');
  item.className = 'prompt-item';
  item.setAttribute('data-id', prompt.id);
  
  // 格式化时间
  const createdDate = new Date(prompt.createdAt);
  const formattedDate = createdDate.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // 生成标签HTML
  const tagsHtml = prompt.activeTags && prompt.activeTags.length > 0
    ? prompt.activeTags.map(tag => `<span class="prompt-tag">${tag}</span>`).join('')
    : '<span class="no-tags">无标签</span>';
  
  // 媒体类型图标
  const mediaTypeIcon = prompt.mediaType === 'video' ? 
    '<img src="../images/film.png" alt="视频" class="media-type-icon" title="视频提示词">' : 
    '<img src="../images/picture.png" alt="图片" class="media-type-icon" title="图片提示词">';
    
  item.innerHTML = `
    <div class="prompt-header">
      <div class="prompt-meta">
        <span class="media-type">${mediaTypeIcon}</span>
        <span class="prompt-date">${formattedDate}</span>
      </div>
      <div class="prompt-actions">
        <img src="../images/copy.png" alt="复制" class="action-icon copy-btn" title="复制内容" data-id="${prompt.id}">
        <img src="../images/delete.png" alt="删除" class="action-icon delete-btn" title="删除" data-id="${prompt.id}">
      </div>
    </div>
    <div class="prompt-content">
      <div class="prompt-full-text">${formatPromptContent(prompt.htmlContent || prompt.content)}</div>
    </div>
    <div class="prompt-tags">
      ${tagsHtml}
    </div>
  `;
  
  // 绑定事件
  bindPromptItemEvents(item, prompt);
  
  return item;
}

// 绑定提示词项目事件
function bindPromptItemEvents(item, prompt) {
  // 复制按钮事件
  const copyBtn = item.querySelector('.copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      copyPromptContent(prompt);
    });
  }
  
  // 删除按钮事件
  const deleteBtn = item.querySelector('.delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      deletePrompt(prompt.id, item);
    });
  }
}

// 复制提示词内容
function copyPromptContent(prompt) {
  const textToCopy = prompt.content;
  
  if (!textToCopy) {
    showToast('内容为空，无法复制', 'warning');
    return;
  }
  
  // 优先使用现代的 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('复制成功！', 'success');
    }).catch(err => {
      // 如果 Clipboard API 失败，回退到传统方法
      fallbackCopyTextToClipboard(textToCopy);
    });
  } else {
    // 回退到传统的复制方法
    fallbackCopyTextToClipboard(textToCopy);
  }
}

// 传统的复制方法（回退方案）
function fallbackCopyTextToClipboard(text) {
  // 创建临时textarea元素，设置样式避免影响页面布局
  const textarea = document.createElement('textarea');
  textarea.value = text;
  
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
      showToast('复制成功！', 'success');
    } else {
      showToast('复制失败，请手动复制', 'warning');
    }
  } catch (err) {
    showToast('复制失败，请手动复制', 'warning');
  }
  
  // 移除临时元素
  document.body.removeChild(textarea);
}

// 删除提示词
function deletePrompt(promptId, itemElement) {
  // 创建确认对话框
  showConfirmDialog('确定要删除这条提示词吗？此操作不可撤销。', 
    // 确认回调
    () => {
      if (!window.savedPromptsManager) {
        showToast('删除失败：管理器未初始化', 'error');
        return;
      }
      
      const success = window.savedPromptsManager.deletePrompt(promptId);
      
      if (success) {
        // 添加删除动画
        itemElement.classList.add('deleting');
        
        // 动画结束后移除元素并刷新列表
        setTimeout(() => {
          loadAndDisplayPrompts();
          showToast('删除成功！', 'success');
          
          // 额外延迟确保DOM完全更新后再触发布局调整
          setTimeout(() => {
            // 强制重新计算页面布局
            document.body.offsetHeight;
            // 触发resize事件
            window.dispatchEvent(new Event('resize'));
            // 强制重新渲染页面
            document.documentElement.style.display = 'none';
            document.documentElement.offsetHeight;
            document.documentElement.style.display = '';
            
            // 额外的页脚重新定位
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
              footerContainer.style.display = 'none';
              footerContainer.offsetHeight;
              footerContainer.style.display = '';
            }
          }, 150);
        }, 300);
      } else {
        showToast('删除失败，请重试', 'error');
      }
    },
    // 取消回调
    () => {
      // 用户取消删除，不执行任何操作
    }
  );
}

// 显示确认对话框
function showConfirmDialog(message, onConfirm, onCancel) {
  // 移除已存在的对话框
  const existingDialog = document.querySelector('.confirm-dialog-container');
  if (existingDialog) {
    existingDialog.remove();
  }
  
  // 创建对话框容器
  const dialogContainer = document.createElement('div');
  dialogContainer.className = 'confirm-dialog-container';
  
  // 创建对话框
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';
  
  // 创建消息
  const messageElement = document.createElement('div');
  messageElement.className = 'confirm-message';
  messageElement.textContent = message;
  
  // 创建按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'confirm-buttons';
  
  // 创建确认按钮
  const confirmButton = document.createElement('button');
  confirmButton.className = 'confirm-button confirm-yes';
  confirmButton.textContent = '确认';
  confirmButton.addEventListener('click', () => {
    dialogContainer.remove();
    if (onConfirm) onConfirm();
  });
  
  // 创建取消按钮
  const cancelButton = document.createElement('button');
  cancelButton.className = 'confirm-button confirm-no';
  cancelButton.textContent = '取消';
  cancelButton.addEventListener('click', () => {
    dialogContainer.remove();
    if (onCancel) onCancel();
  });
  
  // 组装对话框
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(confirmButton);
  dialog.appendChild(messageElement);
  dialog.appendChild(buttonContainer);
  dialogContainer.appendChild(dialog);
  
  // 添加到页面
  document.body.appendChild(dialogContainer);
  
  // 显示动画
  setTimeout(() => {
    dialogContainer.classList.add('show');
  }, 10);
}

// 显示错误状态
function showErrorState(errorType = 'module') {
  const promptsList = document.getElementById('promptsList');
  const emptyState = document.getElementById('emptyState');
  const promptsTitle = document.getElementById('promptsTitle');
  
  if (promptsList) {
    promptsList.style.display = 'none';
  }
  
  if (emptyState) {
    let errorContent = '';
    
    if (errorType === 'database') {
      errorContent = `
        <img src="../images/cross-circle.png" alt="错误" class="empty-state-icon">
        <h3>网络连接失败</h3>
        <p>无法连接到数据库服务，但您仍可以查看本地保存的提示词</p>
        <button id="retryConnection" class="go-to-home-btn">重试连接</button>
        <button id="offlineMode" class="go-to-home-btn" style="margin-left: 10px;">离线模式</button>
      `;
    } else {
      errorContent = `
        <img src="../images/cross-circle.png" alt="错误" class="empty-state-icon">
        <h3>加载失败</h3>
        <p>提示词管理器未能正确初始化，请刷新页面重试</p>
        <button onclick="location.reload()" class="go-to-home-btn">刷新页面</button>
      `;
    }
    
    emptyState.innerHTML = errorContent;
    emptyState.style.display = 'block';
    
    // 绑定按钮事件
    const retryBtn = document.getElementById('retryConnection');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        loadAndDisplayPrompts();
      });
    }
    
    const offlineBtn = document.getElementById('offlineMode');
    if (offlineBtn) {
      offlineBtn.addEventListener('click', () => {
        loadAndDisplayPrompts(true); // 强制离线模式
      });
    }
  }
  
  if (promptsTitle) {
    promptsTitle.textContent = '我的提示词 (加载失败)';
  }
}

// 显示提示框
function showToast(message, type = 'info') {
  // 移除已存在的提示框
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  // 创建提示框元素
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // 创建图标
  const icon = document.createElement('div');
  icon.className = 'toast-icon';
  
  // 根据类型设置图标
  switch (type) {
    case 'success':
      icon.innerHTML = '✓';
      break;
    case 'error':
      icon.innerHTML = '✗';
      break;
    case 'warning':
      icon.innerHTML = '!';
      break;
    default:
      icon.innerHTML = 'i';
  }
  
  // 创建文本
  const text = document.createElement('span');
  text.textContent = message;
  
  // 组装提示框
  toast.appendChild(icon);
  toast.appendChild(text);
  
  // 添加到页面
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // 3秒后隐藏并移除
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    
    // 动画结束后移除元素
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}