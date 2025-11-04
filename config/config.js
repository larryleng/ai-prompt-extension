// AI API 配置文件
const apiConfig = {
  // API密钥
  apiKey: '',
  
  // API端点
  endpoint: 'https://api.openai.com/v1/chat/completions',
  
  // 模型设置
  model: 'gpt-3.5-turbo',
  
  // 请求参数
  parameters: {
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  }
};

// 保存API配置
function saveApiConfig(config) {
  chrome.storage.sync.set({ 'aiApiConfig': config }, function() {
    console.log('API配置已保存');
  });
}

// 获取API配置
function getApiConfig(callback) {
  chrome.storage.sync.get('aiApiConfig', function(result) {
    callback(result.aiApiConfig || apiConfig);
  });
}

// 导出函数和配置
export { apiConfig, saveApiConfig, getApiConfig };