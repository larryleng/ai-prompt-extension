/**
 * 搜索工具模块
 * 提供标签搜索相关的工具函数
 */

import { DOMUtils } from './commonUtils.js';

export const SearchUtils = {
  /**
   * 初始化搜索功能
   */
  initTagSearch() {
    const searchElements = DOMUtils.getSearchElements();
    const { searchInput, clearSearchBtn, initialActiveNavItem } = searchElements;
    if (!searchInput) return;
    
    // 保存搜索前的状态
    let beforeSearchCategory = '';
    let isSearching = false;
    if (initialActiveNavItem) {
      beforeSearchCategory = initialActiveNavItem.getAttribute('data-category');
    }
    
    // 为清空按钮添加点击事件
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        // 手动触发input事件，以便清空搜索结果
        searchInput.dispatchEvent(new Event('input'));
      });
    }
    
    // 搜索输入事件处理
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      SearchUtils.handleSearchInput(searchTerm, beforeSearchCategory, isSearching, (newIsSearching) => {
        isSearching = newIsSearching;
      });
    });
  },

  /**
   * 处理搜索输入
   */
  handleSearchInput(searchTerm, beforeSearchCategory, isSearching, setIsSearching) {
    const allTags = document.querySelectorAll('.tag');
    
    // 获取当前激活的分类
    const { activeNavItem, allCategoryContents } = DOMUtils.getSearchElements();
    if (!activeNavItem) return;
    
    const activeCategory = activeNavItem.getAttribute('data-category');
    
    // 如果开始搜索，保存当前分类
    if (searchTerm !== '' && !isSearching) {
      beforeSearchCategory = activeCategory;
      setIsSearching(true);
    }
    
    // 如果搜索框为空，恢复搜索前的显示
    if (searchTerm === '') {
      this.restoreBeforeSearchState(beforeSearchCategory, allTags, allCategoryContents);
      setIsSearching(false);
      return;
    }
    
    // 执行搜索
    this.performSearch(searchTerm, allTags, allCategoryContents);
  },

  /**
   * 恢复搜索前的状态
   */
  restoreBeforeSearchState(beforeSearchCategory, allTags, allCategoryContents) {
    const { allNavItems, searchNavItem, searchResults } = DOMUtils.getSearchElements();
    
    // 更新导航栏显示，显示所有原始导航项
    allNavItems.forEach(item => {
      if (item.getAttribute('data-category') !== '搜索结果') {
        item.style.display = '';
      }
    });
    
    // 隐藏搜索结果导航项（如果存在）
    if (searchNavItem) {
      searchNavItem.style.display = 'none';
    }
    
    // 隐藏搜索结果内容（如果存在）
    if (searchResults) {
      searchResults.style.display = 'none';
    }
    
    // 重新初始化所有导航项的点击事件
    this.reinitializeNavigation(allNavItems, allCategoryContents);
    
    // 激活搜索前选中的导航项
    this.activatePreviousCategory(beforeSearchCategory, allNavItems, allCategoryContents);
    
    // 恢复所有标签的显示
    allTags.forEach(tag => {
      tag.style.display = '';
    });
  },

  /**
   * 重新初始化导航事件
   */
  reinitializeNavigation(navItems, categoryContents) {
    navItems.forEach(item => {
      // 移除旧的事件监听器（通过重新设置onclick属性）
      item.onclick = null;
      
      // 重新添加点击事件
      item.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        // 更新激活状态
        navItems.forEach(navItem => {
          navItem.classList.remove('active');
        });
        this.classList.add('active');
        
        // 显示对应分类内容
        categoryContents.forEach(content => {
          content.style.display = content.id === category ? 'block' : 'none';
        });
        
        // 如果是"已添加"分类，则更新显示已激活的标签
        if (category === '已添加') {
          window.updateActiveTags && window.updateActiveTags();
        }
      });
    });
  },

  /**
   * 激活之前的分类
   */
  activatePreviousCategory(beforeSearchCategory, navItems, allCategoryContents) {
    const navItem = document.querySelector(`.tags-nav .nav-item[data-category="${beforeSearchCategory}"]`);
    if (navItem) {
      navItems.forEach(item => {
        item.classList.remove('active');
      });
      navItem.classList.add('active');
      
      // 手动触发导航项的点击事件，确保分类切换正常工作
      navItem.click();
    }
    
    // 显示搜索前分类下的所有标签
    allCategoryContents.forEach(content => {
      content.style.display = content.id === beforeSearchCategory ? 'block' : 'none';
    });
  },

  /**
   * 执行搜索
   */
  performSearch(searchTerm, allTags, allCategoryContents) {
    // 隐藏所有分类内容
    allCategoryContents.forEach(content => {
      content.style.display = 'none';
    });
    
    // 创建或获取搜索结果
    const searchResults = this.createOrGetSearchResults(allCategoryContents);
    
    // 激活搜索结果导航项
    this.activateSearchResults(searchResults);
    
    // 查找匹配的标签并添加到搜索结果
    this.findAndDisplayMatchingTags(searchTerm, allTags);
  },

  /**
   * 创建或获取搜索结果容器
   */
  createOrGetSearchResults(categoryContents) {
    let searchResults = DOMUtils.getSearchElements().searchResults;
    if (!searchResults) {
      searchResults = this.createSearchResultsContainer(categoryContents);
    }
    return searchResults;
  },

  /**
   * 创建搜索结果容器
   */
  createSearchResultsContainer(categoryContents) {
    // 创建搜索结果导航项
    const searchNavItem = document.createElement('span');
    searchNavItem.className = 'nav-item';
    searchNavItem.setAttribute('data-category', '搜索结果');
    searchNavItem.textContent = '搜索结果';
    document.querySelector('.tags-nav').appendChild(searchNavItem);
    
    // 为搜索结果导航项添加点击事件
    searchNavItem.addEventListener('click', function() {
      const { allNavItems } = DOMUtils.getSearchElements();
      // 移除其他导航项的激活状态
      allNavItems.forEach(item => {
        item.classList.remove('active');
      });
      
      // 激活搜索结果导航项
      this.classList.add('active');
      
      // 显示搜索结果内容，隐藏其他内容
      categoryContents.forEach(content => {
        content.style.display = content.id === '搜索结果' ? 'block' : 'none';
      });
    });
    
    // 创建搜索结果内容容器
    const searchResults = document.createElement('div');
    searchResults.className = 'tags-category-content';
    searchResults.id = '搜索结果';
    
    // 创建搜索结果分类
    const searchCategory = document.createElement('div');
    searchCategory.className = 'tags-category';
    
    // 创建标签容器
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'search-results-section';
    tagsContainer.id = 'searchTagsContainer';
    
    // 组装搜索结果模块
    searchCategory.appendChild(tagsContainer);
    searchResults.appendChild(searchCategory);
    
    // 将搜索结果容器添加到标签内容区域
    document.querySelector('.tags-content').appendChild(searchResults);
    
    return searchResults;
  },

  /**
   * 激活搜索结果
   */
  activateSearchResults(searchResults) {
    const { allNavItems, searchNavItem } = DOMUtils.getSearchElements();
    
    // 激活搜索结果导航项
    allNavItems.forEach(item => {
      item.classList.remove('active');
      // 在搜索模式下隐藏其他导航项
      if (item.getAttribute('data-category') !== '搜索结果') {
        item.style.display = 'none';
      }
    });
    
    if (searchNavItem) {
      searchNavItem.classList.add('active');
      searchNavItem.style.display = '';
    }
    
    // 显示搜索结果内容
    searchResults.style.display = 'block';
  },

  /**
   * 查找并显示匹配的标签
   */
  findAndDisplayMatchingTags(searchTerm, allTags) {
    const { searchTagsContainer } = DOMUtils.getSearchElements();
    
    // 清空搜索结果容器
    searchTagsContainer.innerHTML = '';
    
    // 查找匹配的标签并添加到搜索结果
    let hasResults = false;
    allTags.forEach(tag => {
      const tagText = tag.getAttribute('data-value').toLowerCase();
      if (tagText.includes(searchTerm)) {
        const newTag = this.createSearchResultTag(tag);
        searchTagsContainer.appendChild(newTag);
        hasResults = true;
      }
    });
    
    // 如果没有匹配的标签，显示提示信息
    if (!hasResults) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = '没有找到匹配的标签';
      searchTagsContainer.appendChild(noResults);
    }
  },

  /**
   * 创建搜索结果标签
   */
  createSearchResultTag(originalTag) {
    // 创建新的标签元素而不是克隆（避免事件监听器丢失）
    const newTag = document.createElement('span');
    newTag.className = originalTag.className;
    newTag.setAttribute('data-value', originalTag.getAttribute('data-value'));
    newTag.textContent = originalTag.textContent;
    
    // 为新标签添加点击事件
    newTag.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      // 直接操作原始标签的状态
      const tagValue = this.getAttribute('data-value');
      const isActive = originalTag.classList.contains('active');
      
      if (isActive) {
        // 取消激活
        SearchUtils.deactivateTag(originalTag, this, tagValue);
      } else {
        // 激活
        SearchUtils.activateTag(originalTag, this, tagValue);
      }
      
      // 更新"已添加"标签显示
      const activeCategory = document.querySelector('.tags-category-content.active');
      if (activeCategory && activeCategory.id === '已添加') {
        window.updateActiveTags && window.updateActiveTags();
      }
      
      // 保存更新后的内容
      window.savePromptContent && window.savePromptContent();
    });
    
    return newTag;
  },

  /**
   * 取消激活标签
   */
  deactivateTag(originalTag, searchTag, tagValue) {
    originalTag.classList.remove('active');
    searchTag.classList.remove('active');
    window.activeTags && window.activeTags.delete(tagValue);
    
    // 从提示词中删除标签
    const promptDiv = DOMUtils.getCommonElements().promptDiv;
    if (promptDiv) {
      let content = promptDiv.textContent || '';
      if (content.includes(`, ${tagValue}`)) {
        content = content.replace(`, ${tagValue}`, '');
      } else if (content.startsWith(`${tagValue}, `)) {
        content = content.replace(`${tagValue}, `, '');
      } else if (content.trim() === tagValue) {
        content = '';
      } else {
        content = content.replace(tagValue, '').replace(/,\s*,/g, ',').replace(/^\s*,\s*$/g, '');
      }
      promptDiv.textContent = content;
    }
  },

  /**
   * 激活标签
   */
  activateTag(originalTag, searchTag, tagValue) {
    originalTag.classList.add('active');
    searchTag.classList.add('active');
    window.activeTags && window.activeTags.add(tagValue);
    
    // 添加标签到提示词
    const promptDiv = DOMUtils.getCommonElements().promptDiv;
    if (promptDiv && window.addTagToPrompt) {
      window.addTagToPrompt(promptDiv, tagValue);
    }
  }
};