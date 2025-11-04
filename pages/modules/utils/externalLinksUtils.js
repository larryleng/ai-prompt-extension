/**
 * 外部链接管理工具模块
 * 提供外部链接加载和管理功能
 */

export const ExternalLinksUtils = {
  abortController: null,

  /**
   * 加载外部链接数据
   */
  async loadExternalLinks() {
    const externalLinksSelect = document.getElementById('externalLinksSelect');
    if (!externalLinksSelect) return;

    try {
      // 取消之前的请求
      this.cancelPreviousRequest();
      
      // 创建新的 AbortController
      this.abortController = new AbortController();
      
      // 显示加载状态
      this.showLoadingState(externalLinksSelect);

      // 获取外部链接数据
      const links = await this.fetchExternalLinks();

      // 检查请求是否已被取消
      if (this.abortController.signal.aborted) {
        return;
      }

      // 更新选择框内容
      this.updateSelectOptions(externalLinksSelect, links);

    } catch (error) {
      this.handleLoadError(error, externalLinksSelect);
    }
  },

  /**
   * 取消之前的请求
   */
  cancelPreviousRequest() {
    if (this.abortController) {
      this.abortController.abort();
    }
  },

  /**
   * 显示加载状态
   */
  showLoadingState(selectElement) {
    selectElement.innerHTML = '<option value="">加载中...</option>';
    selectElement.disabled = true;
  },

  /**
   * 获取外部链接数据
   */
  async fetchExternalLinks() {
    // 动态导入数据库客户端
    const { databaseClient } = await import('../api/databaseService.js');
    
    // 从数据库获取外部链接数据
    return await databaseClient.getExternalLinks(true); // activeOnly = true
  },

  /**
   * 更新选择框选项
   */
  updateSelectOptions(selectElement, links) {
    // 清空选择框并添加默认选项
    selectElement.innerHTML = '<option value="">选择链接...</option>';

    // 添加链接选项
    if (links && links.length > 0) {
      links.forEach(link => {
        const option = document.createElement('option');
        option.value = link.url;
        option.textContent = link.title;
        selectElement.appendChild(option);
      });
    } else {
      // 如果没有链接数据，显示提示
      const option = document.createElement('option');
      option.value = '';
      option.textContent = '暂无可用链接';
      selectElement.appendChild(option);
    }

    // 恢复选择框状态
    selectElement.disabled = false;
  },

  /**
   * 处理加载错误
   */
  handleLoadError(error, selectElement) {
    // 如果是取消请求的错误，静默处理
    if (error.name === 'AbortError') {
      return;
    }
    
    console.error('加载外部链接失败:', error);
    
    // 静默处理数据库连接失败，显示默认状态
    selectElement.innerHTML = '<option value="">暂无可用链接</option>';
    selectElement.disabled = false;
    
    // 不显示错误提示，静默处理数据库连接问题
  },

  /**
   * 清理资源
   */
  cleanup() {
    this.cancelPreviousRequest();
    this.abortController = null;
  }
};