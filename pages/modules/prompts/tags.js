// 标签管理模块
export const tagsManager = {
  // 存储已激活的标签
  activeTags: new Set(),
  
  // 初始化标签功能
  init(promptDiv, activeTags) {
    this.promptDiv = promptDiv;
    this.activeTags = activeTags || new Set();
    this.initCategoryCollapse();
    this.initTagEvents();
    this.initNavEvents();
  },
  
  // 处理标签点击事件
  handleTagClick(tagElement, promptDiv, activeTags) {
    const tagValue = tagElement.getAttribute('data-value');
    const isActive = tagElement.classList.contains('active');
    
    // 切换标签激活状态
    if (isActive) {
      // 如果标签已激活，则取消激活并从提示词中删除
      tagElement.classList.remove('active');
      activeTags.delete(tagValue);
      this.removeTagFromPrompt(tagValue);
    } else {
      // 如果标签未激活，则激活并添加到提示词
      tagElement.classList.add('active');
      activeTags.add(tagValue);
      this.addTagToPrompt(tagValue);
    }
  },
  
  // 初始化子分类默认缩入
  initCategoryCollapse() {
    const categoryTitles = document.querySelectorAll('.category-title');
    
    // 移除所有现有的事件监听器
    categoryTitles.forEach(title => {
      const newTitle = title.cloneNode(true);
      title.parentNode.replaceChild(newTitle, title);
    });
    
    // 重新获取元素并添加事件监听器
    const refreshedCategoryTitles = document.querySelectorAll('.category-title');
    
    // 设置初始状态
    refreshedCategoryTitles.forEach(title => {
      // 默认添加collapsed类
      title.classList.add('collapsed');
      const container = title.nextElementSibling;
      if (container && container.classList.contains('tags-container')) {
        container.classList.add('collapsed');
      }
    });
    
    refreshedCategoryTitles.forEach(title => {
      // 添加点击事件处理
      title.addEventListener('click', function() {
        // 获取当前点击的标签分类
        const currentCategory = this;
        const currentContainer = this.nextElementSibling;
        
        // 如果当前标签是收起状态，则展开它并收起其他所有标签
        if (currentCategory.classList.contains('collapsed')) {
          // 先收起所有标签
          refreshedCategoryTitles.forEach(otherTitle => {
            if (otherTitle !== currentCategory) {
              otherTitle.classList.add('collapsed');
              const otherContainer = otherTitle.nextElementSibling;
              if (otherContainer && otherContainer.classList.contains('tags-container')) {
                otherContainer.classList.add('collapsed');
              }
            }
          });
          
          // 展开当前标签
          currentCategory.classList.remove('collapsed');
          if (currentContainer && currentContainer.classList.contains('tags-container')) {
            currentContainer.classList.remove('collapsed');
          }
        } else {
          // 如果当前标签是展开状态，则收起它
          currentCategory.classList.add('collapsed');
          if (currentContainer && currentContainer.classList.contains('tags-container')) {
            currentContainer.classList.add('collapsed');
          }
        }
      });
    });
  },
  
  // 初始化标签点击事件
  initTagEvents() {
    const tagContainers = document.querySelectorAll('.tags-container');
    const self = this;
    
    tagContainers.forEach(container => {
      container.addEventListener('click', function(event) {
        if (event.target.classList.contains('tag')) {
          event.preventDefault();
          event.stopPropagation();
          
          const tagValue = event.target.getAttribute('data-value');
          const isActive = event.target.classList.contains('active');
          
          // 切换标签激活状态
          if (isActive) {
            // 如果标签已激活，则取消激活并从提示词中删除
            event.target.classList.remove('active');
            self.activeTags.delete(tagValue);
            self.removeTagFromPrompt(tagValue);
          } else {
            // 如果标签未激活，则激活并添加到提示词
            event.target.classList.add('active');
            self.activeTags.add(tagValue);
            self.addTagToPrompt(tagValue);
          }
          
          // 如果当前显示的是"已添加"分类，则更新显示
          const activeCategory = document.querySelector('.tags-category-content.active');
          if (activeCategory && activeCategory.id === '已添加') {
            self.updateActiveTags();
          }
          
          // 保存更新后的内容
          self.savePromptContent();
        }
      });
    });
  },
  
  // 初始化导航事件
  initNavEvents() {
    const navItems = document.querySelectorAll('.nav-item');
    const categoryContents = document.querySelectorAll('.tags-category-content');
    const self = this;
    
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        // 移除所有导航项的active类
        navItems.forEach(nav => nav.classList.remove('active'));
        // 为当前点击的导航项添加active类
        this.classList.add('active');
        
        // 获取要显示的分类ID
        const categoryId = this.getAttribute('data-category');
        
        // 隐藏所有分类内容
        categoryContents.forEach(content => content.classList.remove('active'));
        
        // 显示对应的分类内容
        document.getElementById(categoryId).classList.add('active');
        
        // 如果是"已添加"分类，则更新显示已激活的标签
        if (categoryId === '已添加') {
          self.updateActiveTags();
        }
      });
    });
  },
  
  // 更新已激活标签的显示
  updateActiveTags(promptDiv, activeTags) {
    const activeTagsContainer = document.getElementById('activeTags');
    if (!activeTagsContainer) return;
    
    activeTagsContainer.innerHTML = '';
    const self = this;
    
    // 如果没有传入activeTags参数，则使用this.activeTags
    const tagsToUse = activeTags || this.activeTags;
    if (!tagsToUse) return;
    
    tagsToUse.forEach(tagValue => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag active';
      tagElement.setAttribute('data-value', tagValue);
      tagElement.textContent = tagValue;
      
      tagElement.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // 从activeTags集合中删除标签
        const tagsToUse = activeTags || self.activeTags;
        if (tagsToUse) {
          tagsToUse.delete(tagValue);
        }
        
        // 从提示词中删除标签内容
        const currentPromptDiv = promptDiv || self.promptDiv;
        if (currentPromptDiv) {
          let content = currentPromptDiv.textContent || '';
          
          // 处理各种可能的标签位置情况
          if (content.includes(`, ${tagValue}`)) {
            // 中间或末尾的标签
            content = content.replace(`, ${tagValue}`, '');
          } else if (content.startsWith(`${tagValue}, `)) {
            // 开头的标签
            content = content.replace(`${tagValue}, `, '');
          } else if (content.trim() === tagValue) {
            // 唯一的标签
            content = '';
          } else {
            // 其他情况，尝试直接替换并清理格式
            content = content.replace(tagValue, '').replace(/,\s*,/g, ',').replace(/^\s*,\s*|\s*,\s*$/g, '');
          }
          
          currentPromptDiv.textContent = content;
        }
        
        // 更新所有相关标签的激活状态
        const originalTags = document.querySelectorAll('.tag');
        originalTags.forEach(tag => {
          if (tag.getAttribute('data-value') === tagValue) {
            tag.classList.remove('active');
          }
        });
        
        // 保存内容
        self.savePromptContent();
        
        // 更新"已添加"页面显示
        self.updateActiveTags(currentPromptDiv, tagsToUse);
      });
      
      activeTagsContainer.appendChild(tagElement);
    });
  },
  
  // 添加标签到提示词
  addTagToPrompt(tagValue) {
    // 使用this.promptDiv而不是重新查询
    if (!this.promptDiv) return;
    
    // 在提示词末尾添加标签
    const currentText = this.promptDiv.innerText;
    const separator = currentText.trim() ? ', ' : '';
    this.promptDiv.innerText = currentText.trim() + separator + tagValue;
  },
  
  // 从提示词中移除标签
  removeTagFromPrompt(tagValue) {
    // 使用this.promptDiv而不是重新查询
    if (!this.promptDiv) return;
    
    // 从提示词中移除标签
    let currentText = this.promptDiv.innerText;
    
    // 处理不同的情况
    if (currentText.includes(', ' + tagValue)) {
      // 如果标签前有逗号和空格
      currentText = currentText.replace(', ' + tagValue, '');
    } else if (currentText.includes(tagValue + ', ')) {
      // 如果标签后有逗号和空格
      currentText = currentText.replace(tagValue + ', ', '');
    } else {
      // 如果只有标签本身
      currentText = currentText.replace(tagValue, '');
    }
    
    this.promptDiv.innerText = currentText;
  },
  
  // 保存提示词内容
  savePromptContent() {
    try {
      if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          'savedPrompt': this.promptDiv.innerText,
          'processedHtml': this.promptDiv.innerText
        });
      }
    } catch (e) {
      
    }
  }
};