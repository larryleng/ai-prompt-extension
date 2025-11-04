// 数据库连接状态检测器
class PromptStatusChecker {
  constructor() {
    this.statusElement = null;
    this.checkInterval = null;
    this.lastStatus = null;
  }

  // 初始化状态检测器
  init() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupStatusChecker());
    } else {
      this.setupStatusChecker();
    }
  }

  // 设置状态检测器
  setupStatusChecker() {
    this.statusElement = document.getElementById('prompt-config-status');
    if (!this.statusElement) {
      console.warn('提示词状态显示元素未找到');
      return;
    }

    // 立即检测一次状态
    this.checkPromptStatus();

    // 设置定期检测（每30秒检测一次）
    this.checkInterval = setInterval(() => {
      this.checkPromptStatus();
    }, 30000);
  }

  // 检查数据库连接状态（简化版本）
  async checkPromptStatus() {
    try {
      console.log('🔍 开始检查数据库连接状态...');
      
      // 动态导入kuozhan.js模块
      const module = await import('../prompts/kuozhan.js').catch(err => {
        console.error('❌ 导入kuozhan.js模块失败:', err);
        this.updateStatus('offline', '未连接');
        return { getPromptConfig: null };
      });
      
      // 获取数据库配置
      let getPromptConfig;
      if (typeof module.getPromptConfig === 'function') {
        getPromptConfig = module.getPromptConfig;
      } else if (typeof window !== 'undefined' && window.getPromptConfig) {
        getPromptConfig = window.getPromptConfig;
      } else {
        console.error('❌ 无法找到 getPromptConfig 函数');
        this.updateStatus('offline', '未连接');
        return;
      }

      // 测试数据库连接
      console.log('🔍 测试数据库连接...');
      if (!getPromptConfig) {
        console.error('❌ getPromptConfig 函数不可用');
        this.updateStatus('offline', '未连接');
        return;
      }
      
      try {
        const config = await getPromptConfig();
        
        // 如果能成功获取配置，说明数据库连接正常
        if (config && config.id) {
          console.log('✅ 数据库连接成功');
          this.updateStatus('online', '已连接');
        } else {
          console.log('❌ 数据库连接失败');
          this.updateStatus('offline', '未连接');
        }
      } catch (error) {
        console.error('❌ 数据库连接测试失败：', error);
        this.updateStatus('offline', '未连接');
      }
      
    } catch (error) {
      console.error('❌ 数据库连接测试失败：', error);
      this.updateStatus('offline', '未连接');
    }
  }

  // 显示更新状态（临时显示）
  showUpdateStatus() {
    this.updateStatus('online', '已连接');
    
    // 3秒后恢复正常状态检测
    setTimeout(() => {
      this.checkPromptStatus();
    }, 3000);
  }



  // 更新状态显示
  updateStatus(type, text) {
    if (!this.statusElement) return;

    // 避免重复更新相同状态
    if (this.lastStatus === type) return;
    this.lastStatus = type;

    // 移除所有状态类
    this.statusElement.classList.remove('online', 'offline');
    
    // 添加新的状态类
    this.statusElement.classList.add(type);
    
    // 更新文本内容
    this.statusElement.textContent = text;

    // 输出日志
    console.log(`数据库连接状态更新: ${text} (类型: ${type})`);
  }

  // 销毁检测器
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

// 创建全局实例
const promptStatusChecker = new PromptStatusChecker();

// 自动初始化
promptStatusChecker.init();

// 导出供其他模块使用
export { promptStatusChecker };

// 兼容性导出
if (typeof window !== 'undefined') {
  window.promptStatusChecker = promptStatusChecker;
}