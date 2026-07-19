import type { MediaId } from './media-content';
import type { Locale } from './site-content';

export interface OfficialCaseStudy {
  readonly id: string;
  readonly title: Readonly<Record<Locale, string>>;
  readonly system: Readonly<Record<Locale, string>>;
  readonly area: Readonly<Record<Locale, string>>;
  readonly mediaId: MediaId;
  readonly sourceUrl: string;
}

// Project titles, listed systems, areas, and imagery are transcribed from KDO's public case pages.
// They are presented as official-company case material, not as third-party independent certification.
export const officialCaseStudies: readonly OfficialCaseStudy[] = [
  {
    id: 'liaocheng-wanda',
    title: {
      zh: '山东聊城万达广场地下车库',
      en: 'Liaocheng Wanda Plaza Underground Garage',
    },
    system: {
      zh: '官网列示工艺：环氧砂浆平涂 + 聚氨酯超耐磨',
      en: 'System listed by KDO: epoxy mortar flat coat + polyurethane super-wear finish',
    },
    area: {
      zh: '官网列示面积：60,000㎡',
      en: 'Area listed by KDO: 60,000 m²',
    },
    mediaId: 'case-wanda-garage',
    sourceUrl: 'https://www.jsdiou.com/nd.jsp?fromColId=107&id=89',
  },
  {
    id: 'jinan-greenland',
    title: {
      zh: '济南绿地中央公馆地下车库',
      en: 'Jinan Greenland Central Mansion Underground Garage',
    },
    system: {
      zh: '官网列示工艺：环氧砂浆平涂 + 聚氨酯超耐磨',
      en: 'System listed by KDO: epoxy mortar flat coat + polyurethane super-wear finish',
    },
    area: {
      zh: '官网列示面积：30,000㎡',
      en: 'Area listed by KDO: 30,000 m²',
    },
    mediaId: 'case-greenland-garage',
    sourceUrl: 'https://www.jsdiou.com/nd.jsp?fromColId=107&id=86',
  },
  {
    id: 'jinan-longfor',
    title: {
      zh: '济南龙湖春江郦城地下车库',
      en: 'Jinan Longfor Chunjiang Licheng Underground Garage',
    },
    system: {
      zh: '官网列示工艺：过道砂浆加超耐磨罩面；车位砂浆加水性聚氨酯罩面',
      en: 'System listed by KDO: mortar with super-wear finish for aisles; mortar with waterborne PU finish for parking bays',
    },
    area: {
      zh: '官网列示面积：100,000㎡',
      en: 'Area listed by KDO: 100,000 m²',
    },
    mediaId: 'case-longfor-garage',
    sourceUrl: 'https://www.jsdiou.com/nd.jsp?fromColId=107&id=85',
  },
];
