# 大西瓜提示词 v3.6

首个公开版本（Release v3.6）。

## 新增
- 提示词管理与收藏（`pages/saved-prompts.*`）
- 模版管理器（`pages/template-manager.*`）
- Popup 与主页入口（`pages/index.*`）
- 配置页与状态展示（`pages/config-status.html`, `config/config.js`）
- 后台服务 worker（`background.js`）

## 兼容性
- Chrome Manifest V3（`manifest.json` 中 `manifest_version: 3`，`version: 3.6`）

## 权限
- `permissions`: `storage`
- `host_permissions`: `https://*/*`, `http://*/*`, `http://localhost:*/*`, `http://127.0.0.1:*/*`
- `content_security_policy.extension_pages`: 允许与本地与远程资源连接

## 安装
- 开发者模式：在 Chrome 中打开 `chrome://extensions` → 打开开发者模式 → 选择“加载已解压的扩展程序” → 选择项目根目录。
- 打包安装：使用本次 Release 附带的 `ai-prompt-extension-v3.6.zip` 进行安装。

## 备注
- 图标位于 `images/`，manifest 中的 `icons` 与 `action.default_icon` 指向 `icon16.png`, `icon48.png`, `icon128.png` 路径。
- 本版本为功能起始版本，后续将完善数据源、分析与自动化流程。