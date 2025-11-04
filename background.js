// Background Script for OLLAMA API requests
// 用于处理OLLAMA API请求，绕过扩展页面的网络限制

console.log('🚀 Background script loaded');

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 收到消息:', request);
  
  try {
    if (request.action === 'testOllamaConnection') {
      console.log('🔄 处理testOllamaConnection请求');
      testOllamaConnection(request.data)
        .then(result => {
          console.log('✅ OLLAMA连接测试成功:', result);
          sendResponse({ success: true, data: result });
        })
        .catch(error => {
          console.log('❌ OLLAMA连接测试失败:', error);
          sendResponse({ success: false, error: error.message || error.toString() });
        });
      
      // 返回true表示异步响应
      return true;
    }
    
    if (request.action === 'ollamaApiRequest') {
      console.log('🔄 处理ollamaApiRequest请求');
      makeOllamaRequest(request.data)
        .then(result => {
          console.log('✅ OLLAMA API请求成功:', result);
          sendResponse({ success: true, data: result });
        })
        .catch(error => {
          console.log('❌ OLLAMA API请求失败:', error);
          sendResponse({ success: false, error: error.message || error.toString() });
        });
      
      return true;
    }
    
    // 如果不是预期的action，返回错误
    console.log('❓ 未知的action:', request.action);
    sendResponse({ success: false, error: `未知的action: ${request.action}` });
  } catch (error) {
    console.log('💥 消息处理异常:', error);
    sendResponse({ success: false, error: `消息处理异常: ${error.message}` });
  }
  
  return false;
});

// 测试OLLAMA连接
async function testOllamaConnection({ apiKey, endpoint, model }) {
  console.log('🔍 开始OLLAMA连接测试');
  console.log('📝 参数:', { 
    apiKey: apiKey ? `${apiKey.substring(0, 10)}...` : '(空)', 
    endpoint, 
    model 
  });
  
  // 对于OLLAMA本地服务，API Key可以为空或任意值
  const isOllamaLocal = endpoint && endpoint.includes('localhost:11434');
  console.log('🏠 是否为OLLAMA本地服务:', isOllamaLocal);
  
  if (!apiKey && !isOllamaLocal) {
    throw new Error('API密钥不能为空');
  }
  
  if (!endpoint) {
    throw new Error('API端点不能为空');
  }
  
  // 确保endpoint以/chat/completions结尾
  let apiEndpoint = endpoint;
  if (!apiEndpoint.endsWith('/chat/completions') && !apiEndpoint.endsWith('/v1/chat/completions')) {
    if (apiEndpoint.endsWith('/v1')) {
      apiEndpoint = `${apiEndpoint}/chat/completions`;
    } else if (!apiEndpoint.includes('/v1/')) {
      apiEndpoint = apiEndpoint.endsWith('/') 
        ? `${apiEndpoint}v1/chat/completions` 
        : `${apiEndpoint}/v1/chat/completions`;
    } else {
      apiEndpoint = apiEndpoint.endsWith('/') 
        ? `${apiEndpoint}chat/completions` 
        : `${apiEndpoint}/chat/completions`;
    }
  }
  
  console.log('🎯 最终API端点:', apiEndpoint);
  
  // 创建测试请求 - 使用更小的token数量以减少响应时间
  const testData = {
    model: model || "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Hi" }],
    max_tokens: 1,  // 减少到1个token以加快测试速度
    stream: false   // 确保不使用流式响应
  };
  
  console.log('📦 请求数据:', testData);
  
  // 设置请求头
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (!isOllamaLocal || apiKey) {
    headers['Authorization'] = `Bearer ${apiKey || 'ollama'}`;
  }
  
  console.log('📋 请求头:', headers);
  console.log('🚀 发送fetch请求...');
  
  // 创建AbortController用于超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('⏰ 请求超时，中止请求');
    controller.abort();
  }, 30000); // 30秒超时
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(testData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 收到响应:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (response.ok) {
      console.log('✅ 连接成功!');
      return { success: true, message: '连接成功！API配置有效。' };
    } else {
      console.log('❌ 响应状态不正常');
      const errorData = await response.json().catch(() => ({}));
      
      // 根据HTTP状态码生成友好的中文错误提示
      let errorMessage;
      switch (response.status) {
        case 401:
          // 强制显示中文错误信息，忽略服务器返回的英文信息
          errorMessage = 'API密钥错误：请检查您的API密钥是否正确';
          break;
        case 403:
          errorMessage = '访问被拒绝：请检查API密钥权限或账户余额';
          break;
        case 404:
          errorMessage = 'API端点错误：请检查您的API端点地址是否正确';
          break;
        case 500:
          errorMessage = '服务器内部错误：API服务暂时不可用，请稍后重试';
          break;
        default:
          // 检查是否是模型相关错误
          const originalError = errorData.error?.message || response.statusText;
          if (originalError && originalError.toLowerCase().includes('model') && originalError.toLowerCase().includes('not found')) {
            errorMessage = '模型不存在：请检查模型名称是否正确或该模型是否可用';
          } else {
            errorMessage = `连接失败 (HTTP ${response.status})：${originalError}`;
          }
      }
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('⏰ 请求超时');
      throw new Error('连接超时：OLLAMA响应时间过长，请检查模型是否已加载或尝试使用更小的模型');
    }
    
    // 处理网络连接错误
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      console.log('🌐 网络连接错误');
      throw new Error('网络连接失败：请检查网络连接和API端点地址');
    }
    
    console.log('💥 请求异常:', error);
    throw error;
  }
}

// 发送OLLAMA API请求
async function makeOllamaRequest({ apiKey, endpoint, model, messages, maxTokens }) {
  console.log('🔍 开始OLLAMA API请求');
  
  const isOllamaLocal = endpoint && endpoint.includes('localhost:11434');
  
  // 确保endpoint格式正确
  let apiEndpoint = endpoint;
  if (!apiEndpoint.endsWith('/chat/completions') && !apiEndpoint.endsWith('/v1/chat/completions')) {
    if (apiEndpoint.endsWith('/v1')) {
      apiEndpoint = `${apiEndpoint}/chat/completions`;
    } else if (!apiEndpoint.includes('/v1/')) {
      apiEndpoint = apiEndpoint.endsWith('/') 
        ? `${apiEndpoint}v1/chat/completions` 
        : `${apiEndpoint}/v1/chat/completions`;
    } else {
      apiEndpoint = apiEndpoint.endsWith('/') 
        ? `${apiEndpoint}chat/completions` 
        : `${apiEndpoint}/chat/completions`;
    }
  }
  
  const requestData = {
    model: model,
    messages: messages,
    max_tokens: maxTokens || 1000,
    stream: false  // 确保不使用流式响应以避免复杂的超时处理
  };
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (!isOllamaLocal || apiKey) {
    headers['Authorization'] = `Bearer ${apiKey || 'ollama'}`;
  }
  
  console.log('🎯 API端点:', apiEndpoint);
  console.log('📦 请求数据:', requestData);
  
  // 创建AbortController用于超时控制 - 对于实际请求使用更长的超时时间
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('⏰ API请求超时，中止请求');
    controller.abort();
  }, 120000); // 2分钟超时，适合大模型的响应时间
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // 根据HTTP状态码生成友好的中文错误提示
      let errorMessage;
      switch (response.status) {
        case 401:
          errorMessage = 'API密钥错误：请检查您的API密钥是否正确';
          break;
        case 403:
          errorMessage = '访问被拒绝：请检查API密钥权限或账户余额';
          break;
        case 404:
          errorMessage = 'API端点错误：请检查您的API端点地址是否正确';
          break;
        case 500:
          errorMessage = '服务器内部错误：API服务暂时不可用，请稍后重试';
          break;
        default:
          // 检查是否是模型相关错误
          const originalError = errorData.error?.message || response.statusText;
          if (originalError && originalError.toLowerCase().includes('model') && originalError.toLowerCase().includes('not found')) {
            errorMessage = '模型不存在：请检查模型名称是否正确或该模型是否可用';
          } else {
            // 根据常见错误类型生成中文提示
            if (originalError && originalError.toLowerCase().includes('authentication')) {
              errorMessage = 'API密钥错误：请检查您的API密钥是否正确';
            } else if (originalError && originalError.toLowerCase().includes('invalid')) {
              errorMessage = 'API密钥无效：请检查您的API密钥是否正确';
            } else {
              errorMessage = `API请求失败：请检查API配置和网络连接`;
            }
          }
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('✅ API请求成功');
    return data;
    
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.log('⏰ API请求超时');
      throw new Error('扩写超时：模型响应时间过长，建议使用更小的模型或减少扩写组数');
    }
    
    // 处理网络连接错误
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      console.log('🌐 网络连接错误');
      throw new Error('网络连接失败：请检查网络连接和API端点地址');
    }
    
    console.log('💥 API请求异常:', error);
    
    // 处理其他类型的错误，确保显示中文错误信息
    const errorMessage = error.message || error.toString();
    if (errorMessage.toLowerCase().includes('authentication') || errorMessage.toLowerCase().includes('401')) {
      throw new Error('API密钥错误：请检查您的API密钥是否正确');
    } else if (errorMessage.toLowerCase().includes('invalid') && errorMessage.toLowerCase().includes('api key')) {
      throw new Error('API密钥无效：请检查您的API密钥是否正确');
    } else if (errorMessage.toLowerCase().includes('403')) {
      throw new Error('访问被拒绝：请检查API密钥权限或账户余额');
    } else if (errorMessage.toLowerCase().includes('404')) {
      throw new Error('API端点错误：请检查您的API端点地址是否正确');
    } else if (errorMessage.toLowerCase().includes('500')) {
      throw new Error('服务器内部错误：API服务暂时不可用，请稍后重试');
    } else {
      throw new Error('API请求失败：请检查API配置和网络连接');
    }
  }
}