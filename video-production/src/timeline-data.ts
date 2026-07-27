export const FILM_FPS = 24;
export const FILM_DURATION_SECONDS = 42;
export const TOTAL_FRAMES = FILM_FPS * FILM_DURATION_SECONDS;

export type FilmScene = {
  id: 'opening' | 'material' | 'flagships' | 'cases' | 'system' | 'cta';
  durationInFrames: number;
  eyebrow: string;
  headline: string;
};

export const SCENES: FilmScene[] = [
  {
    id: 'opening',
    durationInFrames: 96,
    eyebrow: 'KDO / 凯迪欧',
    headline: '把颜色做进材料，把秩序留在地面',
  },
  {
    id: 'material',
    durationInFrames: 168,
    eyebrow: 'MATERIAL / COLOR / SURFACE',
    headline: '材料、色彩与表面',
  },
  {
    id: 'flagships',
    durationInFrames: 216,
    eyebrow: 'FLAGSHIP MATERIALS',
    headline: '从标线与色彩开始',
  },
  {
    id: 'cases',
    durationInFrames: 288,
    eyebrow: 'PUBLIC CASE RECORD',
    headline: '让材料进入真实空间',
  },
  {
    id: 'system',
    durationInFrames: 144,
    eyebrow: 'FLOORING SYSTEMS',
    headline: '从标线与色彩，到连续地坪系统',
  },
  {
    id: 'cta',
    durationInFrames: 96,
    eyebrow: 'PROJECT DIALOGUE',
    headline: '经销合作 / 工程选材 / 海外采购',
  },
];

export const OFFICIAL_CASES = [
  {
    name: '山东聊城万达广场地下车库',
    area: '60,000 ㎡',
    image: 'media/v3/case-wanda-garage.jpg',
    label: '凯迪欧官网公开案例',
  },
  {
    name: '济南绿地中央公馆地下车库',
    area: '30,000 ㎡',
    image: 'media/v3/case-greenland-garage.jpg',
    label: '凯迪欧官网公开案例',
  },
  {
    name: '济南龙湖春江郦城地下车库',
    area: '100,000 ㎡',
    image: 'media/v3/case-longfor-garage.jpg',
    label: '凯迪欧官网公开案例',
  },
] as const;

export const PRODUCTS = [
  { name: '纳米硅划线漆', image: 'media/v2/pack-marking.webp' },
  { name: '纳米硅着色剂', image: 'media/v2/pack-colorant.webp' },
  { name: '硅晶自流平', image: 'media/v2/pack-silicon-crystal.webp' },
  { name: '彩砂自流平', image: 'media/v2/pack-colored-sand.webp' },
  { name: '水性聚氨酯砂浆', image: 'media/v2/pack-pu-mortar.webp' },
] as const;

export const CTA = {
  audiences: '经销合作 / 工程选材 / 海外采购',
  support: '项目条件 · 技术资料 · 样板沟通',
  phone: '400-8898-733',
  website: 'www.jsdiou.com',
} as const;
