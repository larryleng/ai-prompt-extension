// 翻译服务
import { loadApiSettings } from './apiService.js';
import { translationPrompt } from '../prompts/fanyi.js';

/**
 * 检测文本的主要语言
 * @param {string} text - 要检测的文本
 * @returns {string} - 'en' 表示主要是英文，'zh' 表示主要是中文
 */
function detectLanguage(text) {
  if (!text || text.trim() === '') {
    return 'zh'; // 默认返回中文
  }

  // 移除空格、标点符号和数字，只统计字母和汉字
  const cleanText = text.replace(/[\s\d\p{P}]/gu, '');
  
  if (cleanText.length === 0) {
    return 'zh'; // 如果没有有效字符，默认返回中文
  }

  // 统计英文字符（包括字母）
  const englishChars = cleanText.match(/[a-zA-Z]/g) || [];
  
  // 统计中文字符（汉字）
  const chineseChars = cleanText.match(/[\u4e00-\u9fff]/g) || [];
  
  // 计算英文字符比例
  const totalValidChars = englishChars.length + chineseChars.length;
  
  if (totalValidChars === 0) {
    return 'zh'; // 如果没有英文或中文字符，默认返回中文
  }
  
  const englishRatio = englishChars.length / totalValidChars;
  
  // 如果英文字符超过80%，认为是英文文本，需要翻译为中文
  // 否则认为是中文文本，需要翻译为英文
  return englishRatio > 0.8 ? 'en' : 'zh';
}

// 执行翻译
export async function translateText(text) {
  if (!text || text.trim() === '') {
    throw new Error('请输入要翻译的文本');
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

    // 检测文本的主要语言
    const detectedLanguage = detectLanguage(text);
    
    // 根据检测结果选择翻译方向
    let translationPromptMethod;
    if (detectedLanguage === 'en') {
      // 主要是英文，翻译为中文
      translationPromptMethod = translationPrompt.enToZh(text);
    } else {
      // 主要是中文，翻译为英文
      translationPromptMethod = translationPrompt.zhToEn(text);
    }

    // 创建请求数据
    const requestData = {
      model: config.model || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: translationPrompt.system },
        translationPromptMethod
      ],
      temperature: 0.3,
      max_tokens: 4000 // 增加最大token数以支持更长文本
    };

    // 使用background.js发送API请求（与扩写功能保持一致）
    try {
  
      
      // 发送消息到background script
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          action: 'ollamaApiRequest',
          data: {
            apiKey: config.apiKey,
            endpoint: config.endpoint,
            model: config.model || 'gpt-3.5-turbo',
            messages: requestData.messages,
            maxTokens: requestData.max_tokens
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
        throw new Error(response.error || '翻译请求失败');
      }

      const data = response.data;
      const translatedText = data.choices?.[0]?.message?.content?.trim();

      if (!translatedText) {
        throw new Error('翻译结果为空');
      }

      return translatedText;
    } catch (error) {
      console.error('翻译错误:', error);
      
      // 如果是在非扩展环境中运行，回退到直接fetch调用
      if (error.message && error.message.includes('Extension context invalidated')) {
  
        
        // 回退到直接API调用
        const controller = new AbortController();
        const textLength = text.length;
        let timeoutMs = (typeof config.timeoutMs === 'number' && config.timeoutMs > 0) ? config.timeoutMs : 15000;
        
        // 对于长文本，增加超时时间
        if (textLength > 1000) {
          const additionalTime = Math.min(Math.floor(textLength / 1000) * 5000, 45000);
          timeoutMs = timeoutMs + additionalTime;
      
        }
        
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
            let errorMessage;
            
            // 根据HTTP状态码生成中文错误提示（与扩写功能保持一致）
            if (response.status === 401) {
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
          const translatedText = data.choices[0]?.message?.content?.trim();

          if (!translatedText) {
            throw new Error('翻译结果为空');
          }

          return translatedText;
        } catch (fetchError) {
          if (fetchError.name === 'AbortError') {
            throw new Error('翻译请求超时，可能是文本过长，请尝试分段翻译');
          }
          
          // 处理网络连接错误
          if (fetchError.message.includes('Failed to fetch') || fetchError instanceof TypeError) {
            throw new Error('网络连接失败：请检查网络连接和API端点地址');
          }
          
          // 处理其他类型的错误，确保显示中文错误信息
          const errorMessage = fetchError.message || fetchError.toString();
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
      } else {
        throw new Error(`翻译失败: ${error.message || error}`);
      }
    }
  } catch (error) {
    console.error('翻译过程中发生错误:', error);
    throw new Error(error.message || '翻译过程中发生错误');
  }
}