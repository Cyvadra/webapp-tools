# 开发者工具箱

一个基于 Vite + React 构建的在线开发者工具箱，提供常用的编码转换、加解密、格式化、文本处理、时间处理、图像处理和正则相关能力。

当前项目已内置 35 个工具，按 8 个分类组织，并支持独立工具路由、全局搜索和分类浏览。

## 功能特性

- 全局搜索：搜索结果始终覆盖全部工具分类
- 分类浏览：未搜索时可按分类查看工具列表
- 独立工具页：每个工具都有单独路由，便于分享和收藏
- 浏览器内处理：多数操作直接在前端完成，无需服务端
- 响应式界面：适配桌面端与移动端使用
- 基础 SEO：工具详情页会动态更新页面标题和描述

## 技术栈

- React 18
- React Router 7
- Vite 6
- Tailwind CSS 4
- Radix UI
- Lucide React

## 工具分类

### 加密解密

- MD5 加密
- SHA 加密
- Base64 编解码
- AES 加解密
- RSA 加解密

### 编码转换

- URL 编解码
- Unicode 编解码
- UTF-8 编解码
- ASCII 转换
- 十六进制转换

### 代码格式化

- JSON 格式化
- JavaScript 格式化
- HTML 格式化
- CSS 格式化
- XML 格式化
- SQL 格式化

### 代码处理

- JS 代码混淆
- JS 代码压缩
- Escape 转义
- HTML/JS 互转
- HTML 实体转换

### 文本处理

- 字符统计
- 文本对比
- 大小写转换
- 简繁转换
- 去重排序

### 时间工具

- 时间戳转换
- 日期计算
- Cron 表达式生成与解析

### 图像工具

- 二维码生成
- 条形码生成
- 图片 Base64
- 颜色选择器

### 正则工具

- 正则测试
- 正则生成

## 本地开发

### 环境要求

- Node.js 18+
- pnpm

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

默认由 Vite 启动本地开发服务器。

### 生产构建

```bash
pnpm build
```

### 本地预览构建产物

```bash
pnpm exec vite preview
```

## 项目结构

```text
src/
  main.tsx                 应用入口
  app/
    App.tsx                路由定义
    components/            通用组件、工具渲染器、弹窗等
    data/
      tools.ts             工具注册表与分类数据
    pages/
      HomePage.tsx         首页，负责搜索和分类展示
      ToolPage.tsx         工具详情页
  styles/                  全局样式、主题和字体配置
```

## 路由说明

- `/`：工具首页
- `/tools/:toolId`：工具独立页面

## 扩展新工具

新增一个工具通常需要以下几步：

1. 在 `src/app/components/tools/` 下新增对应工具组件。
2. 在 `src/app/components/ToolRenderer.tsx` 中注册组件映射。
3. 在 `src/app/data/tools.ts` 中补充工具元信息，包括 `id`、名称、描述、分类、关键词和组件名。
4. 确认工具可通过 `/tools/:toolId` 正常访问。

## 构建产物

项目使用 Vite 构建，默认输出目录为 `dist/`。