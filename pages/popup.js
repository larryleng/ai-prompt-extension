// 总控台 - 导入各个功能模块
import { saveApiSettings, loadApiSettings, testApiConnection } from './modules/api/apiService.js';
import { initializeUI, updateUIValues, getUIValues, showNotification } from './modules/ui/uiHandler.js';

// 主题管理器 - 用于同步主题状态，不提供切换功能
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
  }

  init() {
    // 应用保存的主题
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.currentTheme = theme;
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// 创建主题管理器实例
const themeManager = new ThemeManager();

// 应用初始化
function initializeApp() {

  
  // 初始化主题管理器
  themeManager.init();
  
  // 初始化UI元素
  const uiElements = {
    apiKeyInput: document.getElementById('apiKey'),
    endpointInput: document.getElementById('endpointInput'),
    endpointSelect: document.getElementById('endpointSelect'),
    modelInput: document.getElementById('model'),
    saveButton: document.getElementById('saveBtn'),
    testButton: document.getElementById('testBtn')
  };
  
  // 加载已保存的配置
  const config = loadApiSettings();
  updateUIValues(uiElements, config);
  
  // 注册事件处理
  registerEventHandlers(uiElements);
  
  // 初始化端点下拉框事件
  initEndpointDropdown(uiElements);
  
  // 初始化密码显示/隐藏功能
  initPasswordToggle();
  
  // 初始化回退按钮
  initBackButton();
}

// 初始化密码显示/隐藏功能
function initPasswordToggle() {
  const toggleButton = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('apiKey');
  
  if (toggleButton && passwordInput) {
    toggleButton.addEventListener('click', function() {
      const isPassword = passwordInput.type === 'password';
      
      // 切换输入框类型
      passwordInput.type = isPassword ? 'text' : 'password';
      
      // 更新按钮标题
      toggleButton.title = isPassword ? '隐藏密钥' : '显示密钥';
      
      // 更新图标
      const eyeIcon = toggleButton.querySelector('.eye-icon');
      if (eyeIcon) {
        eyeIcon.src = isPassword ? '../images/eye-open.svg' : '../images/eye-closed.svg';
        eyeIcon.alt = isPassword ? '隐藏密钥' : '显示密钥';
      }
    });
  }
}

// 初始化回退按钮功能
function initBackButton() {
  const backButton = document.getElementById('backBtn');
  
  if (backButton) {
    backButton.addEventListener('click', function() {
      // 返回首页
      window.location.href = 'index.html';
    });
  }
}

// 初始化端点下拉框事件
function initEndpointDropdown(uiElements) {
  const endpointInput = uiElements.endpointInput;
  const endpointSelect = uiElements.endpointSelect;
  const modelInput = uiElements.modelInput;
  
  if (endpointInput && endpointSelect) {
    // 监听下拉框变化
    endpointSelect.addEventListener('change', function() {
      if (this.value !== 'custom') {
        // 选择预设选项时，更新输入框的值
        endpointInput.value = this.value;
        
        // 根据选择的API端点自动设置对应的模型
        if (this.value === 'https://api.deepseek.com/v1' && modelInput) {
          modelInput.value = 'deepseek-chat';
        }
        else if (this.value === 'https://open.bigmodel.cn/api/paas/v4/chat/completions' && modelInput) {
          modelInput.value = 'glm-4-flash-250414';
        }
        else if (this.value === 'https://api.siliconflow.cn/v1/chat/completions' && modelInput) {
          modelInput.value = 'Qwen/Qwen2.5-7B-Instruct';
        }
      } else {
        // 选择自定义时，清空端点输入框和模型输入框
        endpointInput.value = '';
        if (modelInput) {
          modelInput.value = '';
        }
      }
    });
    
    // 监听输入框变化，同步更新下拉框选择
    endpointInput.addEventListener('input', function() {
      const inputValue = this.value.trim();
      const options = Array.from(endpointSelect.options);
      
      // 查找匹配的预设选项
      const matchingOption = options.find(option => option.value === inputValue);
      
      if (matchingOption) {
        endpointSelect.value = inputValue;
      } else {
        endpointSelect.value = 'custom';
      }
    });
    
    // 初始化时根据输入框的值设置下拉框
    const currentValue = endpointInput.value;
    const options = Array.from(endpointSelect.options);
    const matchingOption = options.find(option => option.value === currentValue);
    
    if (matchingOption) {
      endpointSelect.value = currentValue;
    } else {
      endpointSelect.value = 'custom';
    }
    
    // 初始化时检查是否需要设置对应的模型
    if (currentValue === 'https://api.deepseek.com/v1' && modelInput) {
      modelInput.value = 'deepseek-chat';
    } else if (currentValue === 'https://open.bigmodel.cn/api/paas/v4/chat/completions' && modelInput) {
      modelInput.value = 'glm-4-flash-250414';
    } else if (currentValue === 'https://api.siliconflow.cn/v1/chat/completions' && modelInput) {
      modelInput.value = 'Qwen/Qwen2.5-7B-Instruct';
    }
  }
}

// 注册事件处理函数
function registerEventHandlers(uiElements) {
  // 保存按钮点击事件
  uiElements.saveButton.addEventListener('click', function() {
    const values = getUIValues(uiElements);
    
    // 保存API设置
    if (saveApiSettings(values.apiKey, values.endpoint, values.model)) {
      showNotification('API配置已保存');
    }
  });
  
  // 测试按钮点击事件
  uiElements.testButton.addEventListener('click', function() {
    const values = getUIValues(uiElements);
    
    // 显示加载状态
    const originalText = uiElements.testButton.textContent;
    uiElements.testButton.disabled = true;
    uiElements.testButton.textContent = '测试中...';
    uiElements.testButton.classList.add('loading');
    
    testApiConnection(values.apiKey, values.endpoint, values.model)
      .then(result => {
        showNotification('连接测试成功: ' + result.message, false);
      })
      .catch(error => {
        // 根据错误类型显示不同的提示
        let errorMessage = error.message;
        
        // 处理超时错误
        if (error.message.includes('超时')) {
          errorMessage = '连接超时：' + error.message + '\n建议检查OLLAMA服务状态或尝试更小的模型';
        }
        // 处理认证错误
        else if (error.message.includes('401') || error.message.includes('Authentication')) {
          errorMessage = 'API密钥错误：请检查您的API密钥是否正确';
        }
        // 处理404错误
        else if (error.message.includes('404')) {
          errorMessage = 'API端点错误：请检查您的API端点地址是否正确';
        }
        // 处理403错误
        else if (error.message.includes('403')) {
          errorMessage = '访问被拒绝：请检查API密钥权限或账户余额';
        }
        // 处理500错误
        else if (error.message.includes('500')) {
          errorMessage = '服务器内部错误：API服务暂时不可用，请稍后重试';
        }
        // 处理网络连接错误
        else if (error.message.includes('Failed to fetch') || error.message.includes('网络')) {
          errorMessage = '网络连接失败：请检查网络连接和API端点地址';
        }
        // 处理模型不存在错误
        else if (error.message.includes('model') && error.message.includes('not found')) {
          errorMessage = '模型不存在：请检查模型名称是否正确或该模型是否可用';
        }
        
        showNotification('连接测试失败: ' + errorMessage, true);
      })
      .finally(() => {
        // 恢复按钮状态
        uiElements.testButton.disabled = false;
        uiElements.testButton.textContent = originalText;
        uiElements.testButton.classList.remove('loading');
      });
  });
}

// 重写getUIValues函数以支持自定义端点
import { getUIValues as originalGetUIValues } from './modules/ui/uiHandler.js';

// 扩展原始getUIValues函数以支持自定义端点
function getCustomEndpointUIValues(uiElements) {
  // 获取原始值
  const values = originalGetUIValues(uiElements);
  
  // 如果选择了自定义端点，则使用自定义输入框的值
  if (values.endpoint === 'custom' && uiElements.customEndpointInput) {
    values.endpoint = uiElements.customEndpointInput.value.trim();
  }
  
  return values;
}

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', initializeApp);