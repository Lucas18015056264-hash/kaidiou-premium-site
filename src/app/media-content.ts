import type { Locale } from './site-content';

export type MediaProvenance = 'company-material' | 'concept-visual' | 'official-case' | 'verified-case';
export type MediaRole =
  | 'atmosphere-not-case'
  | 'company-material-not-independent-verification'
  | 'official-case'
  | 'verified-case';

export type MediaId =
  | 'home-hero'
  | 'product-marking'
  | 'product-colorant'
  | 'product-silicon-crystal'
  | 'product-colored-sand'
  | 'product-pu-mortar'
  | 'company-factory'
  | 'pack-marking'
  | 'pack-colorant'
  | 'pack-silicon-crystal'
  | 'pack-colored-sand'
  | 'pack-pu-mortar'
  | 'case-wanda-garage'
  | 'case-greenland-garage'
  | 'case-longfor-garage';

export interface SiteMedia {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Readonly<Record<Locale, string>>;
  readonly caption: Readonly<Record<Locale, string>>;
  readonly provenance: MediaProvenance;
  readonly role: MediaRole;
}

const conceptCaption = {
  zh: '材料应用概念视觉 · 非项目案例',
  en: 'Material application concept visual · not a project case',
} as const;

const companyCaption = {
  zh: '企业资料视觉 · 非独立核验案例',
  en: 'Company material visual · not independently verified as a project case',
} as const;

const officialCaseCaption = {
  zh: '凯迪欧官网工程案例实拍 · 项目与工艺信息以原案例页面为准',
  en: 'Official KDO case photo · project and system details follow the original KDO case page',
} as const;

export const siteMedia: Readonly<Record<MediaId, SiteMedia>> = {
  'home-hero': {
    src: '/media/v2/home-hero.webp',
    width: 1672,
    height: 941,
    alt: {
      zh: '低饱和工业地坪色彩环境概念图',
      en: 'Color-led industrial flooring environment',
    },
    caption: conceptCaption,
    provenance: 'concept-visual',
    role: 'atmosphere-not-case',
  },
  'product-marking': {
    src: '/media/v2/product-marking.webp',
    width: 1536,
    height: 1024,
    alt: {
      zh: '纳米硅标线涂料应用概念图',
      en: 'Nano-silicon marking paint application concept visual',
    },
    caption: conceptCaption,
    provenance: 'concept-visual',
    role: 'atmosphere-not-case',
  },
  'product-colorant': {
    src: '/media/v2/product-colorant.webp',
    width: 1536,
    height: 1024,
    alt: {
      zh: '纳米硅着色剂矿物色样概念图',
      en: 'Nano-silicon colorant mineral sample concept visual',
    },
    caption: conceptCaption,
    provenance: 'concept-visual',
    role: 'atmosphere-not-case',
  },
  'product-silicon-crystal': {
    src: '/media/v2/product-silicon-crystal.webp',
    width: 1536,
    height: 1024,
    alt: {
      zh: '硅晶自流平连续地坪概念图',
      en: 'Silicon-crystal self-leveling continuous floor concept visual',
    },
    caption: conceptCaption,
    provenance: 'concept-visual',
    role: 'atmosphere-not-case',
  },
  'product-colored-sand': {
    src: '/media/v2/product-colored-sand.webp',
    width: 1536,
    height: 1024,
    alt: {
      zh: '彩砂自流平颗粒质感概念图',
      en: 'Colored-sand self-leveling granular surface concept visual',
    },
    caption: conceptCaption,
    provenance: 'concept-visual',
    role: 'atmosphere-not-case',
  },
  'product-pu-mortar': {
    src: '/media/v2/product-pu-mortar.webp',
    width: 1536,
    height: 1024,
    alt: {
      zh: '水性聚氨酯砂浆洁净车间概念图',
      en: 'Waterborne PU mortar clean production floor concept visual',
    },
    caption: conceptCaption,
    provenance: 'concept-visual',
    role: 'atmosphere-not-case',
  },
  'company-factory': {
    src: '/media/v2/company-factory.webp',
    width: 1600,
    height: 1067,
    alt: {
      zh: '凯迪欧企业资料中的工厂环境图',
      en: 'Factory environment image from KDO company material',
    },
    caption: companyCaption,
    provenance: 'company-material',
    role: 'company-material-not-independent-verification',
  },
  'pack-marking': {
    src: '/media/v2/pack-marking.webp',
    width: 1400,
    height: 933,
    alt: {
      zh: '纳米硅划线漆包装图',
      en: 'Nano-silicon marking paint package image',
    },
    caption: companyCaption,
    provenance: 'company-material',
    role: 'company-material-not-independent-verification',
  },
  'pack-colorant': {
    src: '/media/v2/pack-colorant.webp',
    width: 1400,
    height: 1058,
    alt: {
      zh: '纳米硅着色剂包装图',
      en: 'Nano-silicon colorant package image',
    },
    caption: companyCaption,
    provenance: 'company-material',
    role: 'company-material-not-independent-verification',
  },
  'pack-silicon-crystal': {
    src: '/media/v2/pack-silicon-crystal.webp',
    width: 1400,
    height: 933,
    alt: {
      zh: '硅晶自流平包装图',
      en: 'Silicon-crystal self-leveling package image',
    },
    caption: companyCaption,
    provenance: 'company-material',
    role: 'company-material-not-independent-verification',
  },
  'pack-colored-sand': {
    src: '/media/v2/pack-colored-sand.webp',
    width: 1400,
    height: 933,
    alt: {
      zh: '彩砂自流平包装图',
      en: 'Colored-sand self-leveling package image',
    },
    caption: companyCaption,
    provenance: 'company-material',
    role: 'company-material-not-independent-verification',
  },
  'pack-pu-mortar': {
    src: '/media/v2/pack-pu-mortar.webp',
    width: 1400,
    height: 933,
    alt: {
      zh: '水性聚氨酯砂浆包装图',
      en: 'Waterborne PU mortar package image',
    },
    caption: companyCaption,
    provenance: 'company-material',
    role: 'company-material-not-independent-verification',
  },
  'case-wanda-garage': {
    src: '/media/v3/case-wanda-garage.jpg',
    width: 1440,
    height: 1080,
    alt: {
      zh: '山东聊城万达广场地下车库地坪实拍',
      en: 'Liaocheng Wanda Plaza underground garage floor case photo',
    },
    caption: officialCaseCaption,
    provenance: 'official-case',
    role: 'official-case',
  },
  'case-greenland-garage': {
    src: '/media/v3/case-greenland-garage.jpg',
    width: 1000,
    height: 750,
    alt: {
      zh: '济南绿地中央公馆地下车库地坪实拍',
      en: 'Jinan Greenland Central Mansion underground garage floor case photo',
    },
    caption: officialCaseCaption,
    provenance: 'official-case',
    role: 'official-case',
  },
  'case-longfor-garage': {
    src: '/media/v3/case-longfor-garage.jpg',
    width: 1000,
    height: 1333,
    alt: {
      zh: '济南龙湖春江郦城地下车库地坪实拍',
      en: 'Jinan Longfor Chunjiang Licheng underground garage floor case photo',
    },
    caption: officialCaseCaption,
    provenance: 'official-case',
    role: 'official-case',
  },
};

export function getMedia(mediaId: MediaId): SiteMedia {
  return siteMedia[mediaId];
}
