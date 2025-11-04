// 扩写服务
import { loadApiSettings } from './apiService.js';
import { expansionPrompt as defaultExpansionPrompt } from '../prompts/kuozhan.js';
import { expansionPrompt as filmExpansionPrompt } from '../prompts/V-kuozhan.js';

/**
 * 处理扩写内容，标记必要元素
 * @param {string} content 原始扩写内容
 * @returns {string} 处理后的内容
 */
function processExpandedContent(content) {
  // 移除所有双星号标记，使用正则表达式替换
  let processedContent = content.replace(/\*\*(.*?)\*\*/g, '$1');
  
  // 如果没有HTML颜色标记，我们可以在这里添加对关键词的识别和标记
  // 但为了简化实现，这里直接返回处理后的内容
  
  return processedContent;
}

/**
 * 回退到直接API调用（当扩展上下文无效时使用）
 */
async function fallbackDirectApiCall(apiEndpoint, requestData, config) {
  
  
  const controller = new AbortController();
  const timeoutMs = 120000; // 2分钟超时，与background.js保持一致
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(requestData),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // 生成用户友好的中文错误信息
      let errorMessage;
      if (response.status === 401) {
        // 强制显示中文错误信息，忽略服务器返回的英文信息
        errorMessage = 'API密钥错误：请检查您的API密钥是否正确';
      } else if (response.status === 403) {
        errorMessage = '访问被拒绝：请检查API密钥权限或账户余额';
      } else if (response.status === 404) {
        errorMessage = 'API端点错误：请检查您的API端点地址是否正确';
      } else if (response.status === 500) {
        errorMessage = '服务器内部错误：API服务暂时不可用，请稍后重试';
      } else if (errorData.error?.message?.includes('model not found') || 
                 errorData.error?.message?.includes('model') && errorData.error?.message?.includes('not found')) {
        errorMessage = '模型不存在：请检查模型名称是否正确或该模型是否可用';
      } else {
        // 根据常见错误类型生成中文提示
        const originalError = errorData.error?.message || response.statusText;
        if (originalError && originalError.toLowerCase().includes('authentication')) {
          errorMessage = 'API密钥错误：请检查您的API密钥是否正确';
        } else if (originalError && originalError.toLowerCase().includes('invalid')) {
          errorMessage = 'API密钥无效：请检查您的API密钥是否正确';
        } else {
          errorMessage = `API请求失败：请检查API配置和网络连接`;
        }
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const originalContent = data.choices?.[0]?.message?.content?.trim();

    if (!originalContent) {
      throw new Error('扩写结果为空');
    }

    return processExpandedContent(originalContent);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('扩写超时：模型响应时间过长，建议使用更小的模型或减少扩写组数');
    }
    
    // 处理网络连接错误
    if (err.message.includes('Failed to fetch') || err instanceof TypeError) {
      throw new Error('网络连接失败：请检查网络连接和API端点地址');
    }
    
    // 处理其他类型的错误，确保显示中文错误信息
    const errorMessage = err.message || err.toString();
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
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 扩写文本
 * @param {string} text 要扩写的文本
 * @param {boolean} useFilmMode 是否使用胶片模式（默认false）
 * @param {number} expandCount 扩写组数（默认1）
 * @returns {Promise<string>} 扩写后的文本
 */
export async function expandText(text, useFilmMode = false, expandCount = 1) {
  if (!text || text.trim() === '') {
    throw new Error('请输入要扩写的文本');
  }

  try {
    // 获取API配置
    const config = loadApiSettings();
    if (!config || !config.apiKey || !config.endpoint) {
      throw new Error('请先配置API设置');
    }

    // 确保endpoint以/chat/completions结尾
    let apiEndpoint = config.endpoint;
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

    // 根据模式选择对应的扩写模块
    const selectedExpansionPrompt = useFilmMode ? filmExpansionPrompt : defaultExpansionPrompt;

    // 获取系统提示词（异步调用）
    let systemContent;
    try {
      // 确保正确处理异步调用
      if (typeof selectedExpansionPrompt.system === 'function') {
        systemContent = await selectedExpansionPrompt.system(expandCount);
      } else {
        throw new Error('系统提示词函数不存在');
      }
    } catch (error) {
      console.error('获取系统提示词失败:', error);
      // 不使用默认配置，直接抛出错误
      throw new Error(`获取系统提示词失败: ${error.message}`);
    }

    // 确保 systemContent 是字符串
    if (typeof systemContent !== 'string') {
      console.error('系统提示词不是字符串类型');
      throw new Error('系统提示词格式错误');
    }

    // 获取用户消息对象（异步调用）
    let userMessage;
    try {
      // 确保正确处理异步调用
      if (typeof selectedExpansionPrompt.expandText === 'function') {
        userMessage = await selectedExpansionPrompt.expandText(text, expandCount);
      } else {
        throw new Error('扩写函数不存在');
      }
    } catch (error) {
      console.error('获取用户消息失败:', error);
      throw new Error('获取用户消息失败: ' + error.message);
    }
    
    // 确保用户消息格式正确
    if (!userMessage || typeof userMessage !== 'object' || !userMessage.role || !userMessage.content) {
      throw new Error('用户消息格式错误');
    }

    // 创建请求数据（用于回退方案）
    const requestData = {
      model: config.model || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemContent },
        { role: userMessage.role, content: userMessage.content }
      ],
      temperature: 0.8, // 增加随机性
      max_tokens: 2000 * expandCount, // 根据组数调整最大token数
      stream: false  // 确保不使用流式响应
    };

    // 使用background.js的优化API调用
    try {
  
      
      // 发送消息到background script
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'ollamaApiRequest',
          data: {
            apiKey: config.apiKey,
            endpoint: config.endpoint,
            model: config.model || 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: systemContent },
              { role: userMessage.role, content: userMessage.content }
            ],
            maxTokens: 2000 * expandCount // 根据组数调整最大token数
          }
        }, (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });

      if (!response.success) {
        throw new Error(response.error || '扩写请求失败');
      }

      const data = response.data;
      const originalContent = data.choices?.[0]?.message?.content?.trim();

      if (!originalContent) {
        throw new Error('扩写结果为空');
      }

      // 处理返回的内容，标记必要元素
      const processedContent = processExpandedContent(originalContent);
      return processedContent;
    } catch (error) {
      console.error('扩写失败:', error);
      
      // 如果是在非扩展环境中运行，回退到直接fetch调用
      if (error.message && error.message.includes('Extension context invalidated')) {
  
        return await fallbackDirectApiCall(apiEndpoint, requestData, config);
      }
      
      throw new Error(error.message || '扩写请求失败');
    }
  } catch (error) {
    console.error('扩写过程中发生错误:', error);
    throw new Error(error.message || '扩写过程中发生错误');
  }
}