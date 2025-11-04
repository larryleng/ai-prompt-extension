// API服务模块
// 处理API配置的保存、加载和测试功能

// 保存主要API配置
export function saveApiSettings(apiKey, endpoint, model) {
  try {
    // 获取现有配置
    const existingConfig = loadApiSettings() || {};
    
    // 更新主要API配置，保留视觉API配置
    const newConfig = {
      ...existingConfig,
      apiKey: apiKey,
      endpoint: endpoint,
      model: model
    };
    
    // 保存到localStorage
    localStorage.setItem('aiApiConfig', JSON.stringify(newConfig));
    return true;
  } catch (error) {
    return false;
  }
}

// 保存视觉API配置
export function saveVisionApiSettings(visionApiKey, visionEndpoint, visionModel) {
  try {
    // 获取现有配置
    const existingConfig = loadApiSettings() || {};
    
    // 更新视觉API配置，保留主要API配置
    const newConfig = {
      ...existingConfig,
      vision: {
        visionApiKey: visionApiKey || '',
        visionEndpoint: visionEndpoint || '',
        visionModel: visionModel || ''
      }
    };
    
    // 保存到localStorage
    localStorage.setItem('aiApiConfig', JSON.stringify(newConfig));
    return true;
  } catch (error) {
    return false;
  }
}

// 加载API配置
export function loadApiSettings() {
  try {
    const configStr = localStorage.getItem('aiApiConfig');
    if (configStr) {
      return JSON.parse(configStr);
    } else {
      // 返回默认配置
      return {
        apiKey: '',
        endpoint: '',
        model: '',
        vision: {
          visionApiKey: '',
          visionEndpoint: '',
          visionModel: ''
        }
      };
    }
  } catch (error) {
    return null;
  }
}

// 测试主要API连接
export function testApiConnection(apiKey, endpoint, model) {
  return new Promise((resolve, reject) => {
    // 检查chrome.runtime是否可用
    if (!chrome || !chrome.runtime) {
      reject({ success: false, message: 'Chrome扩展程序环境不可用' });
      return;
    }
    
    // 使用background script进行API测试
    try {
      chrome.runtime.sendMessage({
        action: 'testOllamaConnection',
        data: { apiKey, endpoint, model }
      }, (response) => {
        // 检查runtime错误
        if (chrome.runtime.lastError) {
          reject({ success: false, message: `通信错误: ${chrome.runtime.lastError.message}` });
          return;
        }
        
        // 检查响应
        if (!response) {
          reject({ success: false, message: '没有收到background script的响应' });
          return;
        }
        
        if (response.success) {
          resolve(response.data);
        } else {
          reject({ success: false, message: response.error });
        }
      });
    } catch (error) {
      reject({ success: false, message: `发送消息异常: ${error.message}` });
    }
  });
}

// 测试视觉API连接
export function testVisionApiConnection(visionApiKey, visionEndpoint, visionModel) {
  return new Promise((resolve, reject) => {
    if (!visionApiKey) {
      resolve({ success: false, message: '视觉API密钥不能为空' });
      return;
    }
    
    if (!visionEndpoint) {
      resolve({ success: false, message: '视觉API端点不能为空' });
      return;
    }
    
    // 确保endpoint以/chat/completions结尾
    let apiEndpoint = visionEndpoint;
    if (!apiEndpoint.endsWith('/chat/completions') && !apiEndpoint.endsWith('/v1/chat/completions')) {
      // 检查是否已经有/v1路径
      if (apiEndpoint.endsWith('/v1')) {
        apiEndpoint = `${apiEndpoint}/chat/completions`;
      } else if (!apiEndpoint.includes('/v1/')) {
        // 如果没有/v1路径，添加完整路径
        apiEndpoint = apiEndpoint.endsWith('/') 
          ? `${apiEndpoint}v1/chat/completions` 
          : `${apiEndpoint}/v1/chat/completions`;
      } else {
        // 已经包含/v1/但没有chat/completions
        apiEndpoint = apiEndpoint.endsWith('/') 
          ? `${apiEndpoint}chat/completions` 
          : `${apiEndpoint}/chat/completions`;
      }
    }
    
    // 创建一个简单的请求来测试视觉API连接
    const testData = {
      model: visionModel || "gpt-4-vision-preview",
      messages: [{ 
        role: "user", 
        content: [
          { type: "text", text: "Hello" }
        ]
      }],
      max_tokens: 5
    };
    
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${visionApiKey}`
      },
      body: JSON.stringify(testData)
    })
    .then(response => {
      if (response.ok) {
        resolve({ success: true, message: '视觉API连接成功！配置有效。' });
      } else {
        response.json().then(data => {
          resolve({ success: false, message: `视觉API连接失败: ${data.error?.message || '未知错误'}` });
        }).catch(() => {
          resolve({ success: false, message: `视觉API连接失败: HTTP状态码 ${response.status}` });
        });
      }
    })
    .catch(error => {
      resolve({ success: false, message: `视觉API连接错误: ${error.message}` });
     });
  });
}