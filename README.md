# 赵奕鸣 · AI 设计师作品集

以 React、Vite、GSAP 和 ScrollTrigger 实现的桌面优先作品集。页面版心上限 1700px。精选项目包含人物设计与可筛选图集，共 60 张作品，支持键盘方向键翻阅大图。

## 直接预览

双击压缩包里的 `portfolio-preview.html`，用 Edge 或 Chrome 打开。预览页包含构建后的脚本、样式、图片和视频，可以离线打开。

## 修改源码

在项目目录打开终端。使用 Node.js 20.19+ 或 22.12+。

```bash
npm install
npm run dev
```

打开终端打印的本地网址。执行 `npm run build` 生成 `dist/`，再执行 `npm run preview` 预览构建结果。需要重做独立预览文件时，执行 `npm run export-preview`。

- `src/content.js` 管理姓名、简历、联系邮箱和项目内容。
- `src/styles.css` 管理版式、颜色、字体和响应式规则。
- `src/motion.js` 管理开场、逐字标题入场、卡片揭幕和视差动效。系统设置为减少动态效果时，页面直接显示。
- `src/GradientText.jsx` 管理章节标题的流动渐变。标题进入视口后播放，鼠标悬停时暂停。
- `src/headlineLift.js` 实现首页与收尾中文标题的本地 3D 鼠标抬升，跟随指针逐字响应。
- `src/gallery.json` 管理 38 张场景、14 张人物和 8 张道具与载具图。人物及部分场景来自「基地」，其余作品来自「3d 仙侠」。
- `public/media/gallery/` 存放 WebP 作品图。图集每批显示 12 张，网格使用缩略图，打开大图时再读取高清图。

## React Bits Pro 授权

`components.json` 已配置 React Bits Pro 的两个注册源。当前预览使用本地标题交互。安装官方 Rising Ink 前，在与 `package.json` 同级的 `.env.local` 中加入自己的授权码。

```dotenv
REACTBITS_LICENSE_KEY=你的授权码
```

安装项目依赖后，在同一目录运行。

```bash
npx shadcn@latest add @reactbits-starter/rising-ink-tw
```

授权码仅供安装工具读取。网站源码和离线预览不包含授权码。
