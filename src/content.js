import galleryFiles from './gallery.json';

const media = (name) => globalThis.portfolioPreviewMedia?.[name]
  ?? globalThis.portfolioPreviewMedia?.[name.replace('gallery/thumb/', 'gallery/full/')]
  ?? `${import.meta.env.BASE_URL}media/${name}`;

export const gallery = galleryFiles.map((item) => ({
  ...item,
  thumb: media(`gallery/thumb/${item.file}`),
  full: media(`gallery/full/${item.file}`),
}));

export const artworkById = new Map(gallery.map((item) => [item.id, item]));
export const characterArt = gallery.filter((item) => item.category === 'character');

export const archiveFilters = [
  { id: 'all', label: '全部' },
  { id: 'scene', label: '场景设定' },
  { id: 'character', label: '人物设计' },
  { id: 'asset', label: '道具与载具' },
];

const frontPage = [114, 11, 129, 14, 118, 122, 5, 10, 64, 126, 1, 134];
export const archive = [
  ...frontPage.map((id) => artworkById.get(id)),
  ...gallery.filter((item) => !frontPage.includes(item.id)),
];

export const profile = {
  name: '赵奕鸣',
  email: '1904458851@qq.com',
  bio: '动画专业本科，约 1 年动画与 3D 设计经验。我参与过漫剧和动态漫画制作，负责 AI 生图、镜头生成与合成，以及封面和视觉资产制作。',
  experience: [
    { period: '2026.04 — 2026.09', title: '动画设计 · 郑州奇想文化', description: '搭建从需求拆解、提示词调试到视频合成的流程，负责漫剧片段的视觉定调。' },
    { period: '2025.06 — 2026.03', title: '3D 设计师 · 郑州奇想文化', description: '独立完成多个场景的建模、灯光与渲染，并协助制作宣传物料。' },
  ],
  stats: [
    { value: '约 1 年', label: '动画与 3D 设计经验' },
    { value: '3 类', label: '独立设定的场景风格' },
    { value: '30+', label: '商业视觉客户' },
  ],
  portrait: media('portrait.jpg'),
  portraitCaption: '仙侠角色视觉 · 素材选图',
};

export const hero = {
  poster: media('hero.jpg'),
  video: media('hero.mp4'),
};

export const projects = [
  {
    title: '神墟',
    category: '环境概念',
    images: [114, 115, 100, 101, 105, 49],
    description: '悬崖、遗迹与天穹漩涡共同建立空间尺度。冷色调和局部天光把视线引向远处，也给同一世界的其他场景留下统一的氛围基准。',
  },
  {
    title: '诸天之城',
    category: '建筑与场景',
    images: [129, 127, 131, 134, 141],
    description: '以中轴广场、层叠屋脊和云海组织城市轮廓。正面视角突出楼阁的尺度，侧面视角展示浮空建筑和广场的层次。',
  },
  {
    title: '神舟',
    category: '载具与资产',
    images: [122, 124, 89, 90, 91, 92],
    description: '把东方楼阁与飞行载具结合，保留清晰的船体轮廓。多角度图展示甲板、楼阁和船首的结构关系。',
  },
];

export const strengths = [
  { theme: 'direction', label: 'ART DIRECTION', title: '视觉风格设定', art: 129, href: '#work', link: '看场景设定',
    description: '独立完成废土、赛博朋克与古风仙侠三类场景设定，统一角色、场景和光影。' },
  { theme: 'production', label: 'AI PRODUCTION', title: 'AI 漫剧制作', art: 118, href: '#production-credits', link: '看代表作与分工',
    description: '从需求拆解、提示词调试到 AI 生图、镜头生成和合成，推进完整片段制作。' },
  { theme: 'asset-design', label: '3D DESIGN', title: '3D 场景与资产', art: 122, href: '#archive', link: '浏览作品图集',
    description: '独立完成场景建模、灯光与渲染，并参与封面、海报和视觉资产设计。' },
];

export const credits = [
  { title: '《全民诡异，开局掌握0元购》', role: '核心片段 AI 生图与镜头合成' },
  { title: '《仙界入殓师，我有一口葬天棺》', role: '场景风格统一与画面渲染优化' },
  { title: '「世界版本更新」', role: '三类场景风格设定与三套制作模板' },
];
