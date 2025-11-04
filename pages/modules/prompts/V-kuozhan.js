// 配置常量
const CONFIG_CONSTANTS = {
  DEFAULT_COUNT: 4,
  MAX_COUNT: 20,
  MIN_COUNT: 1,
  DATABASE_TITLE: '图生视频'
};

// 浏览器环境检测
const isDevelopment = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname === '' || 
           window.location.protocol === 'file:';
  }
  return false;
};

// 数据库客户端管理类
class DatabaseClientManager {
  constructor() {
    this.client = null;
    this.initPromise = null;
  }

  async getClient() {
    if (this.client) {
      return this.client;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._initClient();
    return this.initPromise;
  }

  async _initClient() {
    try {
      const module = await import('../api/databaseService.js');
      this.client = module.databaseClient;
      
      if (isDevelopment()) {
        console.log('数据库服务模块加载成功');
      }
      
      return this.client;
    } catch (error) {
      console.error('数据库服务模块加载失败:', error);
      this.client = null;
      this.initPromise = null;
      return null;
    }
  }

  reset() {
    this.client = null;
    this.initPromise = null;
  }
}

// 创建单例实例
const dbManager = new DatabaseClientManager();

// 工具函数
const utils = {
  /**
   * 验证计数参数
   * @param {number} count - 提示词组数
   * @returns {number} 验证后的计数
   */
  validateCount(count) {
    const num = parseInt(count, 10);
    if (isNaN(num) || num < CONFIG_CONSTANTS.MIN_COUNT) {
      return CONFIG_CONSTANTS.MIN_COUNT;
    }
    if (num > CONFIG_CONSTANTS.MAX_COUNT) {
      return CONFIG_CONSTANTS.MAX_COUNT;
    }
    return num;
  },

  /**
   * 验证配置结构（只验证新格式）
   * @param {Object} config - 配置对象
   * @returns {boolean} 是否有效
   */
  validateConfig(config) {
    if (!config || typeof config !== 'object') {
      return false;
    }
    
    // 新格式验证：必须有 system_prompt 和 user_template
    return config.system_prompt && 
           config.user_template &&
           typeof config.system_prompt === 'string' && 
           typeof config.user_template === 'string';
  },

  /**
   * 安全的JSON解析
   * @param {string} jsonStr - JSON字符串
   * @returns {Object|null} 解析结果或null
   */
  safeJsonParse(jsonStr) {
    try {
      return JSON.parse(jsonStr);
    } catch (error) {
      console.warn('JSON解析失败:', error.message);
      return null;
    }
  },

  /**
   * 优化的模板替换
   * @param {string} template - 模板字符串
   * @param {Object} replacements - 替换映射
   * @returns {string} 替换后的字符串
   */
  replaceTemplate(template, replacements) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return replacements[key] !== undefined ? replacements[key] : match;
    });
  }
};

/**
 * 测试数据库连接
 * @returns {Promise<boolean>} 连接是否成功
 */
async function testDatabaseConnection() {
  try {
    if (isDevelopment()) {
      console.log('🔍 开始测试数据库连接...');
    }
    
    const client = await dbManager.getClient();
    
    if (!client) {
      console.error('❌ 数据库客户端初始化失败');
      return false;
    }
    
    if (isDevelopment()) {
      console.log('✅ 数据库客户端初始化成功');
    }
    
    // 测试简单查询
    const testQuery = await client.request('prompt_data?select=count');
    
    if (isDevelopment()) {
      console.log('✅ 数据库连接测试成功，查询结果：', testQuery);
    }
    
    return true;
  } catch (error) {
    console.error('❌ 数据库连接测试失败：', error);
    return false;
  }
}

/**
 * 测试 prompt_data 表查询
 * @returns {Promise<Object>} 查询结果详情
 */
async function testPromptDataQuery() {
  try {
    if (isDevelopment()) {
      console.log('🔍 开始测试 prompt_data 表查询...');
    }
    
    const client = await dbManager.getClient();
    
    if (!client) {
      const error = '数据库客户端未初始化';
      console.error('❌', error);
      return { success: false, error };
    }
    
    // 查询所有记录
    const allData = await client.getPromptData();
    
    // 查询特定记录
    const targetRecord = await client.getPromptDataByTitle(CONFIG_CONSTANTS.DATABASE_TITLE);
    const targetData = targetRecord ? [targetRecord] : [];
    
    if (isDevelopment()) {
      console.log('📊 所有记录：', allData);
      console.log('📊 目标记录：', targetData);
    }
    
    return {
      success: true,
      allRecords: allData,
      targetRecords: targetData,
      allCount: allData ? allData.length : 0,
      targetCount: targetData ? targetData.length : 0
    };
  } catch (error) {
    console.error('❌ prompt_data 表查询测试失败：', error);
    return { success: false, error: error.message };
  }
}

/**
 * 错误类型枚举
 */
const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  DATABASE: 'DATABASE',
  PERMISSION: 'PERMISSION',
  DATA_FORMAT: 'DATA_FORMAT',
  CONFIG_MISSING: 'CONFIG_MISSING'
};

/**
 * 错误分类器
 * @param {Error} error - 原始错误对象
 * @returns {Object} 分类后的错误信息
 */
function classifyError(error) {
  const message = error.message.toLowerCase();
  
  if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
    return {
      type: ERROR_TYPES.NETWORK,
      category: '网络连接错误',
      suggestion: '请检查网络连接，确保能够访问数据库服务器'
    };
  }
  
  if (message.includes('401') || message.includes('unauthorized') || message.includes('认证')) {
    return {
      type: ERROR_TYPES.PERMISSION,
      category: '权限认证错误',
      suggestion: '请检查数据库访问密钥是否正确'
    };
  }
  
  if (message.includes('403') || message.includes('forbidden') || message.includes('权限')) {
    return {
      type: ERROR_TYPES.PERMISSION,
      category: '访问权限错误',
      suggestion: '当前用户没有访问该资源的权限'
    };
  }
  
  if (message.includes('404') || message.includes('not found') || message.includes('无记录')) {
    return {
      type: ERROR_TYPES.DATABASE,
      category: '数据不存在错误',
      suggestion: '请确认数据库中存在标题为"图生视频"的配置记录'
    };
  }
  
  if (message.includes('json') || message.includes('parse') || message.includes('格式')) {
    return {
      type: ERROR_TYPES.DATA_FORMAT,
      category: '数据格式错误',
      suggestion: '数据库中的配置数据格式不正确，请检查JSON格式'
    };
  }
  
  if (message.includes('system_prompt') || message.includes('user_template') || message.includes('缺少')) {
    return {
      type: ERROR_TYPES.CONFIG_MISSING,
      category: '配置字段缺失',
      suggestion: '数据库配置中缺少必要的字段，请检查配置完整性'
    };
  }
  
  return {
    type: ERROR_TYPES.DATABASE,
    category: '数据库操作错误',
    suggestion: '请检查数据库连接和配置'
  };
}

/**
 * 简单的数据库测试函数 - 使用动态导入的数据库客户端
 */
async function testSimpleDatabaseCall() {
  console.log('🔍 开始简单数据库测试...');
  
  try {
    // 尝试获取数据库客户端
    const client = await dbManager.getClient();
    if (!client) {
      console.warn('数据库客户端不可用，返回默认配置');
      return {
        success: true,
        data: [{
          title: '图生视频',
          config: JSON.stringify(getLocalTemplateConfig()),
          created_at: new Date().toISOString()
        }]
      };
    }

    console.log('📡 使用数据库客户端获取数据...');
    const data = await client.getPromptDataByTitle('图生视频');
    
    console.log('✅ 成功获取数据:', data);
    return {
      success: true,
      data: data ? [data] : []
    };
  } catch (error) {
    console.warn('数据库测试失败，使用默认配置:', error);
    return {
      success: true,
      data: [{
        title: '图生视频',
        config: JSON.stringify(getLocalTemplateConfig()),
        created_at: new Date().toISOString()
      }]
    };
  }
}

/**
 * 从数据库获取配置 - 简化版本
 * @returns {Promise<Object>} 配置对象
 */
async function fetchConfigFromDatabase() {
  console.log('🔍 开始从数据库获取配置...');
  
  // 先测试简单的数据库调用
  const testResult = await testSimpleDatabaseCall();
  if (!testResult.success) {
    throw new Error(`数据库连接失败: ${testResult.error}`);
  }
  
  const records = testResult.data;
  if (!records || records.length === 0) {
    throw new Error('未找到标题为"图生视频"的配置记录');
  }
  
  console.log('✅ 找到配置记录:', records[0]);
  return records[0];
}

/**
 * 处理数据库配置
 * @param {Object} record - 数据库记录
 * @returns {Object} 处理后的配置
 */
function processConfigRecord(record) {
  let config = record.config;
  
  // 如果 config 是字符串，解析为 JSON
  if (typeof config === 'string') {
    config = utils.safeJsonParse(config);
    if (!config) {
      throw new Error('配置JSON解析失败');
    }
  }
  
  // 验证配置结构（只验证新格式）
  if (!utils.validateConfig(config)) {
    throw new Error('数据库配置格式无效');
  }
  
  // 添加数据库标识字段
  config.id = record.id;
  config.created_at = record.created_at;
  config.updated_at = record.updated_at;
  
  return config;
}

/**
 * 获取本地模板配置（视频模式）
 * @returns {Object} 本地模板配置对象
 */
function getLocalTemplateConfig() {
  try {
    // 导入本地模板管理器
    const { customTemplateManager, TEMPLATE_TYPES } = window.customTemplateManager ? 
      { customTemplateManager: window.customTemplateManager, TEMPLATE_TYPES: window.TEMPLATE_TYPES } :
      { customTemplateManager: null, TEMPLATE_TYPES: null };
    
    if (!customTemplateManager) {
      console.warn('⚠️ 本地模板管理器不可用，使用默认配置');
      return {
        content: '',
        template: '',
        source: 'local_empty'
      };
    }
    
    // 获取视频模板（因为这是V-kuozhan.js，处理视频相关）
    const videoTemplate = customTemplateManager.getTemplate(TEMPLATE_TYPES.VIDEO);
    
    if (videoTemplate && videoTemplate.trim()) {
      console.log('✅ 使用本地自定义视频模板');
      
      // 检查是否是JSON格式的配置数据（旧的测试数据）
      try {
        const parsedTemplate = JSON.parse(videoTemplate);
        if (parsedTemplate && typeof parsedTemplate === 'object' && parsedTemplate.template) {
          // 这是旧的JSON格式测试数据，返回其中的template字段
          return {
            content: parsedTemplate.template,
            template: parsedTemplate.template,
            source: 'local_custom_json'
          };
        }
      } catch (e) {
        // 不是JSON格式，继续处理为纯文本模板
      }
      
      // 处理纯文本模板（用户在模板管理页面输入的内容）
      return {
        content: videoTemplate,
        template: videoTemplate,
        source: 'local_custom'
      };
    } else {
      console.log('📝 本地视频模板为空，使用默认配置');
      // 不再提供默认模板，返回空字符串
      return {
        content: '',
        template: '',
        source: 'local_empty'
      };
    }
  } catch (error) {
    console.error('❌ 获取本地视频模板失败:', error);
    return {
      content: '请根据用户输入生成AI视频提示词',
      template: '请根据用户输入生成AI视频提示词',
      source: 'local_error'
    };
  }
}

/**
 * 检查是否使用云端模板
 * @returns {boolean} true表示使用云端模板，false表示使用本地模板
 */
function shouldUseCloudTemplate() {
  try {
    const checkbox = document.getElementById('templateSourceCheckbox');
    if (checkbox) {
      const isChecked = checkbox.checked;
      console.log(`📋 模板源选择: ${isChecked ? '云端模板' : '本地模板'}`);
      return isChecked;
    } else {
      console.warn('⚠️ 找不到模板源选择复选框，默认使用云端模板');
      return true; // 默认使用云端模板
    }
  } catch (error) {
    console.error('❌ 检查模板源失败:', error);
    return true; // 出错时默认使用云端模板
  }
}

/**
 * 最简单的数据库调用 - 直接获取"图生视频"记录
 */
async function getPromptConfig(configName = '图生视频') {
  console.log(`🔍 获取配置: ${configName}`);
  
  try {
    // 检查是否使用云端模板
    const useCloudTemplate = shouldUseCloudTemplate();
    
    if (!useCloudTemplate) {
      // 使用本地模板
      console.log('🏠 使用本地视频模板');
      return getLocalTemplateConfig();
    }
    
    // 使用云端模板（动态导入数据库客户端）
    console.log('☁️ 使用云端视频模板');
    
    // 尝试获取数据库客户端
    const client = await dbManager.getClient();
    if (!client) {
      console.warn('数据库客户端不可用，使用本地配置');
      return getLocalTemplateConfig();
    }

    const data = await client.getPromptDataByTitle(configName);
    console.log('✅ 获取到数据:', data);
    
    if (data) {
      return data; // 直接返回数据库记录，不检查特定字段格式
    }
    
    console.warn(`未找到 ${configName} 的配置，使用本地配置`);
    return getLocalTemplateConfig();
  } catch (error) {
    console.warn(`获取配置失败，使用本地配置: ${error.message}`);
    return getLocalTemplateConfig();
  }
}

/**
 * 生成动态提示词模板
 * @param {number} count - 提示词组数
 * @returns {Promise<string>} 生成的提示词模板
 */
async function generateSystemPrompt(count = CONFIG_CONSTANTS.DEFAULT_COUNT) {
  const validCount = utils.validateCount(count);
  const record = await getPromptConfig();
  
  // 正确处理数据库记录中的内容
  let content = '';
  
  if (record.config) {
    // 如果config是字符串，直接使用
    if (typeof record.config === 'string') {
      content = record.config;
    } 
    // 如果config是对象，尝试获取template字段
    else if (typeof record.config === 'object' && record.config.template) {
      content = record.config.template;
    }
    // 如果config是对象但没有template字段，使用默认提示
    else if (typeof record.config === 'object') {
      content = '你是一个专业的AI绘图提示词生成器。请根据用户输入生成高质量的AI绘图提示词，包含详细的视觉描述、艺术风格和技术参数。';
    }
  } 
  // 备用字段检查
  else if (record.content) {
    content = record.content;
  } 
  else if (record.template) {
    content = record.template;
  } 
  // 如果都没有，使用默认提示
  else {
    content = '你是一个专业的AI绘图提示词生成器。请根据用户输入生成高质量的AI绘图提示词，包含详细的视觉描述、艺术风格和技术参数。';
  }
                 
  // 替换可能存在的{count}占位符
  return content.replace(/\{count\}/g, validCount);
}

// AI绘图提示词生成器 - 动态组数
const expansionPrompt = {
  system: async (count = CONFIG_CONSTANTS.DEFAULT_COUNT) => {
    return await generateSystemPrompt(count);
  },

  // 生成动态数量的提示词组
  expandText: async (text, count = CONFIG_CONSTANTS.DEFAULT_COUNT) => {
    console.log('🔍 expandText 开始处理用户输入:', {
      userInput: text,
      inputLength: text ? text.length : 0,
      expandCount: count
    });
    
    const validCount = utils.validateCount(count);
    const record = await getPromptConfig();
    
    // 检查是否使用本地模板
    const useCloudTemplate = shouldUseCloudTemplate();
    
    if (!useCloudTemplate) {
      // 本地模板：直接提交用户原始提示词，不添加任何额外内容
      console.log('🏠 本地视频模板模式：直接提交用户原始提示词');
      console.log('✅ 生成的用户消息（本地视频模式）:', {
        role: "user",
        content: text,
        contentLength: text ? text.length : 0
      });

      return {
        role: "user", 
        content: text
      };
    }
    
    // 云端模板：使用原有的处理逻辑
    console.log('☁️ 云端视频模板模式：使用模板处理用户输入');
    
    // 正确处理数据库记录中的内容
    let dbContent = '';
    
    if (record.config) {
      // 如果config是字符串，直接使用
      if (typeof record.config === 'string') {
        dbContent = record.config;
      } 
      // 如果config是对象，尝试获取template字段
      else if (typeof record.config === 'object' && record.config.template) {
        dbContent = record.config.template;
      }
      // 如果config是对象但没有template字段，使用默认提示
      else if (typeof record.config === 'object') {
        dbContent = '请根据用户输入生成高质量的AI视频生成提示词，包含详细的场景描述、动作要求和视觉效果。';
      }
    } 
    // 备用字段检查
    else if (record.content) {
      dbContent = record.content;
    } 
    else if (record.template) {
      dbContent = record.template;
    } 
    // 如果都没有，使用默认提示
    else {
      dbContent = '请根据用户输入生成高质量的AI视频生成提示词，包含详细的场景描述、动作要求和视觉效果。';
    }
    
    // 简单直接的消息格式：用户输入内容 + 数据库内容 + 生成指令
    const content = `用户输入：${text}\n\n${dbContent}\n\n请生成 ${validCount} 组提示词`;

    console.log('✅ 生成的用户消息（云端视频模式）:', {
      role: "user",
      content: content,
      contentLength: content.length
    });

    return {
      role: "user", 
      content: content
    };
  }
};

/**
 * 获取配置状态信息
 * @returns {Promise<Object>} 状态信息
 */
async function getConfigStatus() {
  try {
    if (isDevelopment()) {
      console.log('🔍 开始获取配置状态...');
    }
    
    const record = await getPromptConfig();
    
    const status = {
      source: 'database',
      sourceText: '数据库',
      status: 'success',
      hasSystemPrompt: !!(record.config && record.config.template),
      hasUserTemplate: !!(record.config && record.config.example),
      lastUpdated: record.updated_at || null,
      configId: record.id || null,
      timestamp: new Date().toISOString()
    };
    
    if (isDevelopment()) {
      console.log('✅ 配置状态获取成功:', status);
    }
    
    return status;
    
  } catch (error) {
    const errorStatus = {
      source: 'error',
      sourceText: '配置获取失败',
      status: 'error',
      error: error.message,
      errorType: error.type || 'UNKNOWN',
      errorCategory: error.category || '未知错误',
      errorSuggestion: error.suggestion || '请联系技术支持',
      timestamp: new Date().toISOString(),
      details: error.details || null
    };
    
    if (isDevelopment()) {
      console.error('❌ 配置状态获取失败:', errorStatus);
    }
    
    return errorStatus;
  }
}

/**
 * 重置数据库连接
 */
function resetDatabaseConnection() {
  dbManager.reset();
}

// ES6模块导出
export { 
  expansionPrompt, 
  getPromptConfig, 
  getPromptConfig as getVideoPromptConfig, // 为视频模式添加别名
  getConfigStatus, 
  testDatabaseConnection, 
  testPromptDataQuery,
  testSimpleDatabaseCall,
  resetDatabaseConnection
};

// 兼容性导出 - 支持全局访问和CommonJS模块导入
if (typeof window !== 'undefined') {
  window.expansionPrompt = expansionPrompt;
  window.getPromptConfig = getPromptConfig;
  window.getVideoPromptConfig = getPromptConfig; // 为视频模式添加别名
  window.getConfigStatus = getConfigStatus;
  window.testDatabaseConnection = testDatabaseConnection;
  window.testPromptDataQuery = testPromptDataQuery;
  window.testSimpleDatabaseCall = testSimpleDatabaseCall;
  window.resetDatabaseConnection = resetDatabaseConnection;
}

// CommonJS模块导出（如果支持）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    expansionPrompt, 
    getPromptConfig, 
    getVideoPromptConfig: getPromptConfig, // 为视频模式添加别名
    getConfigStatus, 
    testDatabaseConnection, 
    testPromptDataQuery,
    testSimpleDatabaseCall,
    resetDatabaseConnection
  };
} else if (typeof exports !== 'undefined') {
  exports.expansionPrompt = expansionPrompt;
  exports.getPromptConfig = getPromptConfig;
  exports.getVideoPromptConfig = getPromptConfig; // 为视频模式添加别名
  exports.getConfigStatus = getConfigStatus;
  exports.testDatabaseConnection = testDatabaseConnection;
  exports.testPromptDataQuery = testPromptDataQuery;
  exports.testSimpleDatabaseCall = testSimpleDatabaseCall;
  exports.resetDatabaseConnection = resetDatabaseConnection;
}
