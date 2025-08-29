# Vue3 登录脚手架

基于 Vite + Vue3 + Pinia + TypeScript + Element Plus 的前端脚手架，包含完整的登录系统和权限管理。

## ✨ 特性

- 🚀 **最新技术栈**: Vite 5 + Vue 3.4 + TypeScript 5 + Pinia
- 🎨 **精美UI**: Element Plus + 现代化登录页面设计
- 🔐 **完整鉴权**: 基于Token的身份认证，状态管理在Pinia中
- 📱 **响应式设计**: 移动端适配，支持多端访问
- 🛠 **开发体验**: ESLint + 自动导入 + 热更新
- 📦 **构建优化**: Gzip压缩 + 代码分割 + Tree Shaking

## 🏗️ 技术栈

### 核心框架
- **Vue 3.4** - 渐进式JavaScript框架
- **TypeScript 5** - 类型安全的JavaScript
- **Vite 5** - 下一代前端构建工具

### 状态管理与路由
- **Pinia** - 新一代状态管理（替代Vuex）
- **Vue Router 4** - 官方路由管理器

### UI框架
- **Element Plus** - 基于Vue 3的组件库
- **Sass** - CSS预处理器
- **Unplugin Icons** - 图标自动导入

### 开发工具
- **ESLint** + **@antfu/eslint-config** - 代码规范
- **Auto Import** - 自动导入API
- **TypeScript** - 类型检查

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8

### 安装依赖
```bash
# 推荐使用 pnpm
npm install -g pnpm
pnpm install
```

### 开发环境
```bash
pnpm dev
```

### 构建生产
```bash
pnpm build
```

### 预览构建结果
```bash
pnpm preview
```

## 📁 项目结构

```
src/
├── api/                 # API接口
│   └── auth.ts         # 认证相关API
├── components/         # 公共组件
├── layout/            # 布局组件
│   └── index.vue      # 主布局
├── router/            # 路由配置
│   └── index.ts       # 路由定义和守卫
├── stores/            # 状态管理
│   └── auth.ts        # 认证状态
├── styles/            # 全局样式
│   ├── index.scss     # 主样式文件
│   └── variables.scss # SCSS变量
├── types/             # 类型定义
│   └── auth.ts        # 认证相关类型
├── utils/             # 工具函数
│   └── request.ts     # HTTP请求封装
├── views/             # 页面组件
│   ├── Login.vue      # 登录页
│   ├── Dashboard.vue  # 仪表盘
│   ├── Profile.vue    # 个人中心
│   └── NotFound.vue   # 404页面
├── App.vue            # 根组件
└── main.ts            # 应用入口
```

## 🔐 认证系统

### Token管理
- ✅ Token存储在Pinia中（避免使用localStorage）
- ✅ 自动在请求头中添加Authorization
- ✅ Token过期自动跳转登录页
- ✅ 路由守卫保护需要认证的页面

### 登录流程
1. 用户输入用户名和密码
2. 前端验证表单数据
3. 调用登录API获取Token
4. 将Token存储在Pinia状态中
5. 根据重定向参数跳转到目标页面

### 权限控制
- 路由级别的权限控制
- 基于角色的访问控制
- 动态菜单生成

## 🎨 登录页面特色

- 🌈 渐变背景 + 浮动动画效果
- 🎯 毛玻璃卡片设计
- 📱 移动端完全适配
- ⚡ 表单验证 + 加载状态
- 🔄 记住密码功能
- 🎪 现代化交互动效

## ⚙️ 环境配置

复制 `.env.example` 为 `.env` 并修改相应配置：

```env
# 应用配置
VITE_APP_TITLE=Vue3 Login Template
VITE_APP_VERSION=1.0.0

# API配置  
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=10000
```

## 🔧 开发规范

### 代码规范
- 使用 ESLint + @antfu/eslint-config
- TypeScript 严格模式
- Vue 3 Composition API

### 提交规范
- 使用 commitlint 规范提交信息
- 支持 conventional commits 格式

### Git Hooks
- pre-commit: 运行 ESLint 检查
- commit-msg: 验证提交信息格式

## 📝 待办事项

- [ ] 添加单元测试
- [ ] 完善权限管理
- [ ] 添加主题切换
- [ ] 国际化支持
- [ ] PWA支持

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [@antfu/eslint-config](https://github.com/antfu/eslint-config) - ESLint配置

---

如果这个项目对你有帮助，请给一个 ⭐️ 支持一下！