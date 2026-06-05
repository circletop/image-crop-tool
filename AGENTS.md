<!-- BEGIN:project-agent-rules -->
# AGENTS.md

本文件用于说明编码代理在本项目中的工作方式和约束。

## 项目概览

`image-crop-tool` 是一个运行在浏览器中的图片裁剪工作台。

主要能力：

- 从本地上传图片。
- 添加并编辑多个裁剪区域。
- 在图片上拖动、缩放裁剪框。
- 对画布进行缩放和平移。
- 生成 PNG 裁剪结果预览。
- 下载单张裁剪结果，或将所有结果打包成 ZIP 下载。

当前用户界面使用中文文案。

## 技术栈

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript
- Tailwind CSS `4`
- `react-rnd`：用于拖拽和缩放裁剪框
- `jszip`：用于生成 ZIP 文件
- `file-saver`：用于浏览器下载
- ESLint `9` 与 `eslint-config-next`

重要说明：本项目使用 Next.js 16。不要假设旧版本 Next.js 的 API、约定或文件行为仍然适用。修改 Next.js 相关代码前，必须先阅读对应文档：

```text
node_modules/next/dist/docs/
```

## 目录结构

```text
.
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── src/
    ├── app/
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── CropWorkspace.tsx
    │   └── HelpDialog.tsx
    └── constants/
        └── help.ts
```

关键文件：

- `src/app/page.tsx`：应用入口页面，渲染裁剪工作台。
- `src/app/layout.tsx`：根布局和页面元信息。
- `src/app/globals.css`：Tailwind 引入和全局 CSS 变量。
- `src/components/CropWorkspace.tsx`：核心客户端组件，包含上传、裁剪框、缩放、平移、预览和下载逻辑。
- `src/constants/help.ts`：帮助文案和版本说明。
- `next.config.ts`：Next.js 配置，目前启用了 `reactCompiler`。

## 常用命令

```bash
npm run dev
```

启动本地开发服务器。

```bash
npm run build
```

生成生产构建。

```bash
npm run start
```

在构建后启动生产服务器。

```bash
npm run lint
```

运行 ESLint 检查。

## 编码规范

- 优先进行小而聚焦的修改。
- 除非需求明确要求重构，否则保持现有应用结构。
- UI 文案保持中文，除非用户另有要求。
- 代码注释使用中文。
- 保持 TypeScript 严格模式。
- 从 `src` 内部导入时优先使用 `@/*` 路径别名。
- 使用 React 函数组件和 hooks。
- 浏览器专属逻辑必须放在带有 `"use client"` 的客户端组件中。
- 不要把服务端假设引入图片编辑、canvas、Blob、object URL 或下载逻辑。
- 新增状态时，让状态尽量靠近拥有它的组件或功能。
- 涉及事件监听、object URL 等浏览器资源时，要在合适时机清理。
- Tailwind class 保持清晰、可读，并尽量延续当前风格。
- 只在能解释非显而易见逻辑时添加注释，避免空泛注释。

## Next.js 16 规则

- 修改 Next.js 专属 API、配置、路由、metadata、字体、图片处理或文件约定前，先阅读 `node_modules/next/dist/docs/` 中对应文档。
- 不要依赖对旧版本 Next.js 的记忆来修改框架相关代码。
- 遵守本地 Next.js 文档和 lint 输出中的废弃提示。
- 除非有明确理由，不要移除 `next.config.ts` 中的 `reactCompiler: true`。

## UI 与交互规范

- 这是一个工作工具，不是营销落地页。优先让用户直接进入图片处理工作流。
- 控件保持紧凑、清晰，并兼顾桌面端和移动端。
- 避免加入会挤占工作区域的装饰性 UI。
- 裁剪区域和参数控制应易于扫描、易于理解。
- 不要在主工作区添加营销式说明文案，除非用户明确要求。

## 测试与验证

完成有意义的代码修改后，优先运行：

```bash
npm run lint
```

对于较大的 UI 或框架相关修改，也应运行：

```bash
npm run build
```

修改交互式画布行为时，需要手动验证：

- 图片上传
- 新增裁剪框
- 选中裁剪框
- 拖动和缩放裁剪框
- Delete / Backspace 删除
- 放大、缩小、重置缩放
- Ctrl + 滚轮缩放
- Space + 拖动画布平移
- 生成裁剪结果
- 单张图片下载
- ZIP 批量下载

## Git 与工作区规则

- 工作区中可能存在用户改动。不要回滚或覆盖无关改动。
- 不要删除未跟踪文件，除非用户明确要求。
- 进行有意义修改前后检查 `git status`。
- 除非用户明确要求，不要提交生成的构建产物。

## 禁止项

- 禁止运行破坏性 Git 命令，例如 `git reset --hard` 或 `git checkout -- <file>`，除非用户明确要求。
- 禁止在未获得明确许可时删除用户文件、上传资源、PDF 或其他未跟踪文件。
- 禁止把应用替换成营销落地页。
- 禁止在没有明确必要性的情况下引入新框架、UI 组件库、状态管理库或裁剪引擎。
- 禁止通过放宽 TypeScript、宽泛禁用 ESLint 规则或随意使用 `any` 来绕过错误。
- 禁止在需求不需要时修改依赖版本或安装新依赖。
- 禁止假设当前环境一定可以访问互联网。

<!-- END:project-agent-rules -->
