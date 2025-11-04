// 用户自定义模板数据管理模块
// 处理图片和视频提示词模板的本地存储

// 模板类型常量
export const TEMPLATE_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image'
};

// 本地存储键名
export const STORAGE_KEYS = {
  VIDEO_TEMPLATE: 'customVideoTemplate',
  IMAGE_TEMPLATE: 'customImageTemplate',
  TEMPLATE_SETTINGS: 'customTemplateSettings'
};

// 默认模板设置
const DEFAULT_SETTINGS = {
  useCustomTemplates: false, // 是否使用自定义模板
  lastModified: {
    video: null,
    image: null
  },
  version: '1.0.0'
};

/**
 * 自定义模板管理器类
 */
export class CustomTemplateManager {
  constructor() {
    this.settings = this.loadSettings();
  }

  /**
   * 保存模板内容
   * @param {string} type - 模板类型 (video/image)
   * @param {string} content - 模板内容
   * @returns {boolean} 保存是否成功
   */
  saveTemplate(type, content) {
    try {
      const storageKey = type === TEMPLATE_TYPES.VIDEO ? 
        STORAGE_KEYS.VIDEO_TEMPLATE : STORAGE_KEYS.IMAGE_TEMPLATE;
      
      // 保存模板内容
      localStorage.setItem(storageKey, content);
      
      // 更新设置中的修改时间
      this.settings.lastModified[type] = new Date().toISOString();
      this.saveSettings();
      

      return true;
    } catch (error) {
      console.error(`保存${type}模板失败:`, error);
      return false;
    }
  }

  /**
   * 获取模板内容
   * @param {string} type - 模板类型 (video/image)
   * @returns {string} 模板内容
   */
  getTemplate(type) {
    try {
      const storageKey = type === TEMPLATE_TYPES.VIDEO ? 
        STORAGE_KEYS.VIDEO_TEMPLATE : STORAGE_KEYS.IMAGE_TEMPLATE;
      
      return localStorage.getItem(storageKey) || '';
    } catch (error) {
      console.error(`获取${type}模板失败:`, error);
      return '';
    }
  }

  /**
   * 检查是否有自定义模板
   * @param {string} type - 模板类型 (video/image)
   * @returns {boolean} 是否有自定义模板
   */
  hasCustomTemplate(type) {
    const template = this.getTemplate(type);
    return template.trim().length > 0;
  }

  /**
   * 删除模板内容
   * @param {string} type - 模板类型 (video/image)
   * @returns {boolean} 删除是否成功
   */
  deleteTemplate(type) {
    try {
      const storageKey = type === TEMPLATE_TYPES.VIDEO ? 
        STORAGE_KEYS.VIDEO_TEMPLATE : STORAGE_KEYS.IMAGE_TEMPLATE;
      
      localStorage.removeItem(storageKey);
      
      // 更新设置
      this.settings.lastModified[type] = null;
      this.saveSettings();
      

      return true;
    } catch (error) {
      console.error(`删除${type}模板失败:`, error);
      return false;
    }
  }

  /**
   * 获取所有模板信息
   * @returns {Object} 包含所有模板信息的对象
   */
  getAllTemplates() {
    return {
      video: {
        content: this.getTemplate(TEMPLATE_TYPES.VIDEO),
        hasContent: this.hasCustomTemplate(TEMPLATE_TYPES.VIDEO),
        lastModified: this.settings.lastModified.video
      },
      image: {
        content: this.getTemplate(TEMPLATE_TYPES.IMAGE),
        hasContent: this.hasCustomTemplate(TEMPLATE_TYPES.IMAGE),
        lastModified: this.settings.lastModified.image
      }
    };
  }

  /**
   * 导出模板数据
   * @returns {Object} 可导出的模板数据
   */
  exportTemplates() {
    const templates = this.getAllTemplates();
    return {
      version: this.settings.version,
      exportTime: new Date().toISOString(),
      templates: {
        video: templates.video.content,
        image: templates.image.content
      },
      metadata: {
        videoLastModified: templates.video.lastModified,
        imageLastModified: templates.image.lastModified
      }
    };
  }

  /**
   * 导入模板数据
   * @param {Object} data - 导入的模板数据
   * @returns {boolean} 导入是否成功
   */
  importTemplates(data) {
    try {
      if (!data || !data.templates) {
        throw new Error('无效的导入数据格式');
      }

      // 导入视频模板
      if (data.templates.video) {
        this.saveTemplate(TEMPLATE_TYPES.VIDEO, data.templates.video);
      }

      // 导入图片模板
      if (data.templates.image) {
        this.saveTemplate(TEMPLATE_TYPES.IMAGE, data.templates.image);
      }


      return true;
    } catch (error) {
      console.error('导入模板失败:', error);
      return false;
    }
  }

  /**
   * 设置是否使用自定义模板
   * @param {boolean} useCustom - 是否使用自定义模板
   */
  setUseCustomTemplates(useCustom) {
    this.settings.useCustomTemplates = useCustom;
    this.saveSettings();
  }

  /**
   * 检查是否使用自定义模板
   * @returns {boolean} 是否使用自定义模板
   */
  isUsingCustomTemplates() {
    return this.settings.useCustomTemplates;
  }

  /**
   * 加载设置
   * @returns {Object} 设置对象
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATE_SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('加载模板设置失败:', error);
    }
    return { ...DEFAULT_SETTINGS };
  }

  /**
   * 保存设置
   */
  saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPLATE_SETTINGS, JSON.stringify(this.settings));
    } catch (error) {
      console.error('保存模板设置失败:', error);
    }
  }

  /**
   * 获取模板统计信息
   * @returns {Object} 统计信息
   */
  getStatistics() {
    const templates = this.getAllTemplates();
    return {
      totalTemplates: Object.values(templates).filter(t => t.hasContent).length,
      videoTemplateLength: templates.video.content.length,
      imageTemplateLength: templates.image.content.length,
      lastActivity: Math.max(
        new Date(templates.video.lastModified || 0).getTime(),
        new Date(templates.image.lastModified || 0).getTime()
      ),
      isUsingCustom: this.isUsingCustomTemplates()
    };
  }

  /**
   * 清空所有模板数据
   * @returns {boolean} 清空是否成功
   */
  clearAllTemplates() {
    try {
      this.deleteTemplate(TEMPLATE_TYPES.VIDEO);
      this.deleteTemplate(TEMPLATE_TYPES.IMAGE);
      
      // 重置设置
      this.settings = { ...DEFAULT_SETTINGS };
      this.saveSettings();
      
  
      return true;
    } catch (error) {
      console.error('清空模板数据失败:', error);
      return false;
    }
  }
}

// 创建全局实例
export const customTemplateManager = new CustomTemplateManager();

// 默认导出
export default customTemplateManager;