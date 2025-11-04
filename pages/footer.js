/**
 * Footer组件 - 用于加载页面底部版权信息
 */

class FooterManager {
    constructor() {
        this.footerLoaded = false;
    }

    /**
     * 加载footer到指定容器
     * @param {string} containerId - 容器ID，默认为'footer-container'
     */
    async loadFooter(containerId = 'footer-container') {
        try {
            // 如果已经加载过，直接返回
            if (this.footerLoaded) {
                return;
            }

            // 获取容器元素
            let container = document.getElementById(containerId);
            
            // 如果容器不存在，创建一个并添加到body底部
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                document.body.appendChild(container);
            }

            // 加载footer HTML内容
            const response = await fetch('./footer.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const footerHTML = await response.text();
            container.innerHTML = footerHTML;
            
            this.footerLoaded = true;
          
            
        } catch (error) {
            console.error('Failed to load footer:', error);
            // 如果加载失败，显示默认的版权信息
            this.loadDefaultFooter(containerId);
        }
    }

    /**
     * 加载默认的footer内容（当fetch失败时使用）
     * @param {string} containerId - 容器ID
     */
    loadDefaultFooter(containerId = 'footer-container') {
        let container = document.getElementById(containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);
        }

        container.innerHTML = `
            <footer class="page-footer">
                <div class="footer-content">
                    <p class="copyright">© 2024 大西瓜插件. All rights reserved.</p>
                </div>
            </footer>
        `;
        
        this.footerLoaded = true;
    }

    /**
     * 初始化footer - 自动加载到页面底部
     */

    init() {
        // 等待DOM加载完成后自动加载footer
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.loadFooter();
            });
        } else {
            this.loadFooter();
        }
    }
}

// 创建全局实例
const footerManager = new FooterManager();

// 导出函数供其他页面使用
window.loadFooter = (containerId) => footerManager.loadFooter(containerId);
window.initFooter = () => footerManager.init();

// 如果直接引入此脚本，自动初始化
if (typeof module === 'undefined') {
    footerManager.init();
}