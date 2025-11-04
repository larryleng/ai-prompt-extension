// 主题管理工具模块
export class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.themeToggleBtn = null;
  }

  init() {
    // 应用保存的主题
    this.applyTheme(this.currentTheme);
    
    // 绑定主题切换按钮事件
    this.themeToggleBtn = document.getElementById('themeToggle');
    if (this.themeToggleBtn) {
      this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

// 创建并导出主题管理器实例
export const themeManager = new ThemeManager();