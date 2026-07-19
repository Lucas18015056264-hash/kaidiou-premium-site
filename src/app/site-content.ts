import type { MediaId } from './media-content';

export type Locale = 'zh' | 'en';

export type Evidence = 'verified' | 'company-material';

interface EvidenceRecord {
  readonly evidence: Evidence;
  /** Internal editorial note. Never rendered as a performance or case claim. */
  readonly sourceNote: string;
}

export interface ProductFlagship extends EvidenceRecord {
  readonly kind: 'marking' | 'colorant';
  readonly visual: {
    readonly heading: string;
    readonly description: string;
    readonly src?: string;
    readonly alt?: string;
  };
  readonly guidanceTitle?: string;
  readonly guidanceNotice?: string;
  readonly guidance?: readonly { readonly label: string; readonly detail: string }[];
  readonly applicationTitle?: string;
  readonly applicationSteps?: readonly { readonly title: string; readonly description: string }[];
  readonly paletteTitle?: string;
  readonly palette?: readonly { readonly label: string; readonly tone: 'mineral' | 'mist' | 'sand' | 'clay' }[];
  readonly substrateTitle?: string;
  readonly substrateNotes?: readonly { readonly label: string; readonly detail: string }[];
  readonly comparison?: {
    readonly title: string;
    readonly beforeLabel: string;
    readonly before: string;
    readonly afterLabel: string;
    readonly after: string;
    readonly disclaimer: string;
  };
}

export interface Product extends EvidenceRecord {
  readonly slug: string;
  readonly name: string;
  readonly shortName: string;
  readonly summary: string;
  readonly mediaId: MediaId;
  readonly packageMediaId: MediaId;
  readonly applications: readonly string[];
  readonly characteristics: readonly string[];
  readonly substrates: readonly string[];
  readonly detailSections: readonly { readonly title: string; readonly body: string }[];
  readonly dialoguePrompts: readonly string[];
  readonly purchase: {
    readonly title: string;
    readonly note: string;
    readonly primaryAction: string;
    readonly route: '/contact';
  };
  readonly flagship?: ProductFlagship;
}

export interface Solution extends EvidenceRecord {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly useCases: readonly string[];
  readonly challenge: string;
  readonly recommendedSystem: string;
  readonly implementationFocus: string;
}

export interface Audience {
  readonly id: 'project-owner' | 'distributor' | 'global-buyer';
  readonly title: string;
  readonly description: string;
  readonly callToAction: string;
}

export interface Capability extends EvidenceRecord {
  readonly id: string;
  readonly title: string;
  readonly approvedCopy: string;
}

export interface ProcurementJourney {
  readonly audience: Audience['id'];
  readonly title: string;
  readonly description: string;
  readonly needs: readonly string[];
  readonly deliverables: readonly string[];
  readonly action: string;
}

export interface CompanyProfile {
  readonly identity: {
    readonly brandName: string;
    readonly legalSubject: string;
    readonly publicWebsite: string;
    readonly positioning: string;
  };
  readonly leader: {
    readonly publicName: string | null;
    readonly fallbackCopy: string;
    readonly verificationNote: string;
  };
  readonly proofPrinciples: readonly string[];
}

export interface SiteContent {
  readonly locale: Locale;
  readonly products: readonly Product[];
  readonly solutions: readonly Solution[];
  readonly audiences: readonly Audience[];
  readonly capabilities: readonly Capability[];
  readonly procurement: {
    readonly title: string;
    readonly introduction: string;
    readonly journeys: readonly ProcurementJourney[];
  };
  readonly company: CompanyProfile;
  readonly legalNotices: readonly string[];
  readonly seo: {
    readonly organization: {
      readonly name: string;
      readonly description: string;
    };
    readonly pages: Readonly<Record<'home' | 'products' | 'solutions' | 'about' | 'contact', {
      readonly title: string;
      readonly description: string;
      readonly breadcrumb: string;
    }>>;
    readonly product: {
      readonly titleSuffix: string;
      readonly category: string;
    };
    readonly notFound: {
      readonly title: string;
      readonly description: string;
    };
  };
  readonly notFound: {
    readonly eyebrow: string;
    readonly pageTitle: string;
    readonly pageBody: string;
    readonly productTitle: string;
    readonly productBody: string;
    readonly productsAction: string;
    readonly homeAction: string;
  };
  readonly about: {
    readonly thesis: string;
    readonly introduction: string;
    readonly timeline: readonly { readonly label: string; readonly title: string; readonly description: string }[];
    readonly evidenceNote: string;
  };
}

const companyMaterialZh = '来自用户提供的企业画册与产品折页，作为品牌与产品资料线索使用。';
const companyMaterialEn = 'Based on company brochures and product leaflets provided by the user.';
const verifiedStructureZh = '页面结构、询盘流程与公开表达边界由本项目核验与整理。';
const verifiedStructureEn = 'Information architecture, enquiry flow, and public-claim boundaries prepared in this project.';

export const contentByLocale: Readonly<Record<Locale, SiteContent>> = {
  zh: {
    locale: 'zh',
    products: [
      {
        slug: 'nano-silicon-marking-paint',
        name: '纳米硅标线涂料',
        shortName: '纳米硅标线',
        summary: '用于停车、仓储、园区通行和作业分区的地坪标识材料，重点呈现清晰、克制、低饱和的地面秩序。',
        mediaId: 'product-marking',
        packageMediaId: 'pack-marking',
        applications: ['停车场分区', '仓储通道', '园区交通标识'],
        characteristics: ['适合把车辆、人行、设备边界和安全提示组织成统一视觉语言。', '颜色、线宽和旧线处理需要结合现场照明、基面状态与施工窗口确认。'],
        substrates: ['经清理和确认的混凝土或既有地坪表面', '需要更新标识或重新分区的使用场地'],
        detailSections: [
          { title: '视觉重点', body: '标线不是简单“画线”，它决定了空间的读法。页面建议以低饱和矿物色、清晰边缘和真实现场尺度来展示产品价值。' },
          { title: '沟通重点', body: '询盘时优先确认现有线条、基面附着、通行组织、颜色要求、开放时间和样板确认方式。' },
          { title: '采购资料', body: '适合向经销商或工程甲方提供产品折页、色样方向、包装图、施工条件清单和样板确认建议。' },
        ],
        dialoguePrompts: ['现有标线与基面的清洁、完整情况', '通行组织、施工窗口、颜色与线宽要求'],
        purchase: {
          title: '索取标线材料与色样建议',
          note: '适合停车场、仓库、厂区更新和新项目标识规划。',
          primaryAction: '提交标线询盘',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
        flagship: {
          kind: 'marking',
          evidence: 'company-material',
          sourceNote: '企业折页中出现该产品名称与停车标线场景，页面概念图不作为案例证明。',
          visual: {
            heading: '让地面先变得可读',
            description: '用低饱和标线把停车、通行、装卸和安全边界处理得更清楚，也更像一个被认真管理的空间。',
            src: '/media/v2/product-marking.webp',
            alt: '纳米硅标线涂料应用概念图',
          },
          guidanceTitle: '颜色与线宽选择',
          guidanceNotice: '颜色与线宽均需结合现场样板确认。',
          guidance: [
            { label: '颜色选择', detail: '结合照明、使用人群、旧地坪颜色和安全识别要求，优先做实物样板。' },
            { label: '线宽选择', detail: '结合车行、人行、设备边界和观察距离，先放样再确认。' },
          ],
          applicationTitle: '实施沟通顺序',
          applicationSteps: [
            { title: '确认范围', description: '先确定旧线、基面、分区和开放时间。' },
            { title: '清理遮蔽', description: '明确需要保护的边界、墙脚、设备和相邻区域。' },
            { title: '样板确认', description: '在真实光线下确认颜色、线宽和视觉识别。' },
            { title: '分区交付', description: '按通行与停产安排逐区完成并保留交接信息。' },
          ],
        },
      },
      {
        slug: 'nano-silicon-colorant',
        name: '纳米硅着色剂',
        shortName: '纳米硅色彩',
        summary: '用于地坪配色、标线配色和项目样板沟通的着色材料，突出低饱和、矿物感和空间协调。',
        mediaId: 'product-colorant',
        packageMediaId: 'pack-colorant',
        applications: ['地坪配色', '标线配色', '项目样板'],
        characteristics: ['适合把色彩沟通从屏幕颜色转向实物样板和现场光线。', '颜色呈现需与涂料体系、基面吸收差异和施工方式共同确认。'],
        substrates: ['待确认的涂料体系', '需要做色样或修补比较的项目基面'],
        detailSections: [
          { title: '色彩重点', body: '用雾绿、砂岩、陶土、石墨等低饱和色系建立高级感，避免过亮、过塑料的工业默认色。' },
          { title: '样板重点', body: '把实物样板放到现场光线下观察，并记录旧地坪、修补区和不同吸收面的差异。' },
          { title: '采购资料', body: '适合随产品资料一起提供色样方向、打样需求、目标空间照片和确认流程。' },
        ],
        dialoguePrompts: ['目标颜色、现场光线与已有色样', '基面差异、样板范围与确认方式'],
        purchase: {
          title: '索取色样与配色建议',
          note: '适合需要统一品牌色、区域识别或低饱和地坪色彩的项目。',
          primaryAction: '提交配色需求',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
        flagship: {
          kind: 'colorant',
          evidence: 'company-material',
          sourceNote: '企业资料中出现该产品方向，色板与比较模块为沟通示意。',
          visual: {
            heading: '低饱和色彩沟通',
            description: '从实物样板和现场光线出发，而不是让屏幕颜色替代真实材料判断。',
          },
          paletteTitle: '矿物低饱和色板',
          palette: [
            { label: '矿物灰', tone: 'mineral' },
            { label: '雾绿', tone: 'mist' },
            { label: '砂岩', tone: 'sand' },
            { label: '陶土', tone: 'clay' },
          ],
          substrateTitle: '基面差异',
          substrateNotes: [
            { label: '致密基面', detail: '先确认表面处理和样板观察方式。' },
            { label: '吸收差异', detail: '通过局部样板观察颜色与质感差异。' },
            { label: '既有表面', detail: '先核对旧层、污染和修补区域对样板的影响。' },
          ],
          comparison: {
            title: '样板沟通比较',
            beforeLabel: '基面原貌',
            before: '记录现有色调、修补和吸收差异。',
            afterLabel: '着色样板',
            after: '在同一观察条件下讨论目标色调与表面质感。',
            disclaimer: '沟通示意，非项目结果。',
          },
        },
      },
      {
        slug: 'silicon-crystal-self-leveling',
        name: '硅晶自流平',
        shortName: '硅晶自流平',
        summary: '面向连续、平整、洁净视觉的自流平体系，适合把地面做成空间气质的一部分。',
        mediaId: 'product-silicon-crystal',
        packageMediaId: 'pack-silicon-crystal',
        applications: ['洁净空间', '制造空间', '商业与公共区域'],
        characteristics: ['强调连续表面、平整观感和后期维护沟通。', '具体体系需结合基面、使用强度和现场条件确认。'],
        substrates: ['经检查的混凝土基面', '完成修补与处理沟通的既有地坪'],
        detailSections: [
          { title: '表面重点', body: '硅晶自流平适合在视觉上减少碎片感，让空间呈现更完整、更克制的材料表情。' },
          { title: '现场重点', body: '重点确认基面平整、接缝、边角收口、开放时间和清洁维护方式。' },
          { title: '采购资料', body: '适合提供产品折页、包装图、样板建议、基面检查清单和交付沟通要点。' },
        ],
        dialoguePrompts: ['空间用途、基面平整与既有表面状况', '施工衔接、样板与后续维护方式'],
        purchase: {
          title: '索取自流平方案资料',
          note: '适合洁净、商业公共、制造空间的连续地面表达。',
          primaryAction: '提交自流平询盘',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
      },
      {
        slug: 'colored-sand-self-leveling',
        name: '彩砂自流平',
        shortName: '彩砂自流平',
        summary: '兼顾颗粒质感、低饱和配色和整体表面表达的自流平体系。',
        mediaId: 'product-colored-sand',
        packageMediaId: 'pack-colored-sand',
        applications: ['商业空间', '公共空间', '展示与制造区域'],
        characteristics: ['适合通过颗粒质感和色彩层次建立更有识别度的地面表情。', '最终呈现应以实物样板和现场基面确认为准。'],
        substrates: ['经现场确认的混凝土基面', '适合进行样板沟通的既有地坪'],
        detailSections: [
          { title: '质感重点', body: '彩砂的价值在于细颗粒带来的真实材料感，适合高级商业、公共空间和需要柔和识别的区域。' },
          { title: '配色重点', body: '建议围绕砂岩、石墨、雾绿和陶土等低饱和方向做样板，避免过强对比。' },
          { title: '采购资料', body: '适合提供彩砂样板、色系建议、空间照片、维护方式和施工边界说明。' },
        ],
        dialoguePrompts: ['颗粒与颜色方向、空间光线和清洁方式', '基面差异、分区衔接与样板确认人'],
        purchase: {
          title: '索取彩砂样板资料',
          note: '适合希望地面有细腻颗粒质感和空间识别度的项目。',
          primaryAction: '提交彩砂询盘',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
      },
      {
        slug: 'waterborne-pu-mortar',
        name: '水性聚氨酯砂浆',
        shortName: '水性聚氨酯砂浆',
        summary: '面向食品、洁净、制造等生产环境沟通的地坪砂浆体系，重点关注清洁、排水、停产窗口和基面条件。',
        mediaId: 'product-pu-mortar',
        packageMediaId: 'pack-pu-mortar',
        applications: ['食品与饮料空间', '医药与洁净空间', '制造与新能源区域'],
        characteristics: ['从环境负荷、清洁方式和生产节奏进入体系沟通。', '不以未经核验的性能数字替代现场确认。'],
        substrates: ['经检查并确认处理方式的混凝土基面', '需要结合生产窗口评估的既有地坪'],
        detailSections: [
          { title: '场景重点', body: '这类空间更关心连续生产、清洁方式、排水节点和边角处理，页面需要表现可信、洁净和工程感。' },
          { title: '交付重点', body: '沟通时优先确认停产窗口、设备边界、排水坡向、基层潮湿情况和恢复使用要求。' },
          { title: '采购资料', body: '适合提供产品资料、包装图、基面检查清单、施工窗口建议和节点沟通要点。' },
        ],
        dialoguePrompts: ['清洁方式、作业环境与停产窗口', '基面状态、排水节点和交接要求'],
        purchase: {
          title: '索取砂浆体系资料',
          note: '适合食品、洁净、制造等需要稳妥沟通施工窗口的项目。',
          primaryAction: '提交砂浆询盘',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
      },
    ],
    solutions: [
      {
        id: 'food-and-beverage',
        name: '食品与饮料',
        description: '从清洁、生产节奏、排水和边角节点进入材料体系沟通。',
        useCases: ['加工区域', '包装区域', '后勤与清洁通道'],
        challenge: '清洁方式、生产连续性、排水节点和不同作业区域需要被共同梳理。',
        recommendedSystem: '从水性聚氨酯砂浆开始讨论，并结合分区条件评估标线与局部衔接材料。',
        implementationFocus: '确认基面、排水与边角节点，协调清洁、停产和分区交接安排。',
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
      },
      {
        id: 'pharma-and-clean-spaces',
        name: '医药与洁净空间',
        description: '围绕洁净管理、表面连续性与施工隔离讨论材料方向。',
        useCases: ['洁净作业区', '实验与辅助空间', '受控通道'],
        challenge: '洁净管理、空间开放节奏和基面完整性会共同影响实施顺序。',
        recommendedSystem: '根据使用与清洁条件讨论水性聚氨酯砂浆或硅晶自流平，并保留样板确认环节。',
        implementationFocus: '对齐洁净隔离、基面处理、节点收口与恢复使用前的交接要求。',
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
      },
      {
        id: 'new-energy-and-manufacturing',
        name: '新能源与制造',
        description: '从生产动线、设备区域与维护窗口组织地面材料信息。',
        useCases: ['制造车间', '设备周边', '装配与周转区域'],
        challenge: '设备、物流、人行和维护安排在同一空间交叉，需要清晰划分实施边界。',
        recommendedSystem: '结合基面与作业方式讨论水性聚氨酯砂浆、自流平体系和纳米硅标线涂料。',
        implementationFocus: '先核对设备边界、通行替代路线、施工隔离与分区恢复顺序。',
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
      },
      {
        id: 'warehousing-and-logistics',
        name: '仓储与物流',
        description: '以库内通行、装卸与作业分区作为材料选择入口。',
        useCases: ['库内通道', '装卸区域', '拣选与作业分区'],
        challenge: '高频通行、作业切换与临时绕行要求分区和维护计划保持清晰。',
        recommendedSystem: '从自流平或水性聚氨酯砂浆的地面方向切入，并用纳米硅标线涂料组织通行识别。',
        implementationFocus: '确认基面、路线、施工窗口、临时绕行和标线样板的交接顺序。',
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
      },
      {
        id: 'commercial-and-public-spaces',
        name: '商业与公共空间',
        description: '把空间表达、开放时段与日常维护放在同一材料讨论中。',
        useCases: ['商业空间', '公共区域', '导视与展示区域'],
        challenge: '视觉一致性、开放安排、客流与日常清洁共同影响样板和实施。',
        recommendedSystem: '从硅晶自流平、彩砂自流平与纳米硅着色剂进入表面与配色沟通。',
        implementationFocus: '在现场光线下确认样板，并协调分区开放、收口与后续清洁方式。',
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
      },
      {
        id: 'parking-and-traffic-marking',
        name: '停车场与交通标线',
        description: '围绕停车、车行、人行与安全分区组织标线和地面沟通。',
        useCases: ['停车分区', '车行与人行路线', '园区交通标识'],
        challenge: '既有标线、通行组织、照明与分段施工会共同影响识别和实施。',
        recommendedSystem: '以纳米硅标线涂料和纳米硅着色剂为入口，结合地面体系与现场样板确认方向。',
        implementationFocus: '核对基面与旧线，确认颜色、线宽、放样、交通导改和分区开放顺序。',
        evidence: 'company-material',
        sourceNote: companyMaterialZh,
      },
    ],
    audiences: [
      { id: 'project-owner', title: '工程甲方', description: '从项目场景、颜色、使用要求和交付窗口开始沟通。', callToAction: '查看项目方案' },
      { id: 'distributor', title: '经销商伙伴', description: '了解产品资料、样品沟通、区域合作和销售支持。', callToAction: '了解合作方式' },
      { id: 'global-buyer', title: '海外采购商', description: '获取适合跨境沟通的产品、包装和询盘资料。', callToAction: '索取采购资料' },
    ],
    capabilities: [
      { id: 'application-dialogue', title: '应用沟通', approvedCopy: '可根据项目需求提供已整理的产品资料与应用沟通支持。', evidence: 'company-material', sourceNote: companyMaterialZh },
      { id: 'color-sample-support', title: '配色与样品', approvedCopy: '可围绕项目配色需求沟通颜色样本与相关信息。', evidence: 'company-material', sourceNote: companyMaterialZh },
      { id: 'information-preparation', title: '资料准备', approvedCopy: '可按现有资料范围协助准备产品与采购沟通信息。', evidence: 'verified', sourceNote: verifiedStructureZh },
    ],
    procurement: {
      title: '购买与合作方式',
      introduction: '网站建议把购买入口做成询盘式流程：先收集项目条件，再匹配资料、样板、渠道合作或跨境采购沟通。',
      journeys: [
        {
          audience: 'project-owner',
          title: '工程甲方询盘',
          description: '适合工厂、园区、商业公共空间和停车场项目。',
          needs: ['项目用途', '基面状态', '期望颜色', '施工窗口'],
          deliverables: ['产品资料', '样板建议', '施工沟通清单'],
          action: '提交项目需求',
        },
        {
          audience: 'distributor',
          title: '经销商合作',
          description: '适合希望了解产品体系、样品资料和区域合作支持的渠道伙伴。',
          needs: ['所在区域', '客户类型', '主推场景', '样品需求'],
          deliverables: ['产品卖点资料', '包装图', '样品沟通建议'],
          action: '申请渠道沟通',
        },
        {
          audience: 'global-buyer',
          title: '海外采购',
          description: '适合需要英文资料、包装信息和采购沟通材料的海外客户。',
          needs: ['目标市场', '使用场景', '采购规格', '交付沟通方式'],
          deliverables: ['英文资料', '包装信息', '询盘回复要点'],
          action: 'Request sourcing info',
        },
      ],
    },
    company: {
      identity: {
        brandName: '凯迪欧地坪漆',
        legalSubject: '官方资料显示，江苏迪欧化工科技有限公司为联系/运营主体，湖北凯欧新材料有限公司为生产工厂。',
        publicWebsite: 'https://www.jsdiou.com',
        positioning: '工业地坪材料与项目沟通资料入口',
      },
      leader: {
        publicName: null,
        fallbackCopy: '目前未在已整理的官方资料中发现可直接公开引用的负责人姓名与肖像。公开网站建议先呈现“管理团队与项目服务理念”，待企业确认后再替换为真实负责人介绍。',
        verificationNote: '负责人姓名、照片、职务和授权文案需要企业提供或指向官方发布页。',
      },
      proofPrinciples: ['凯迪欧作为品牌呈现，法律主体按官方资料说明', '不展示未经授权客户标识', '不使用未经核验的排名与规模数字', '概念图明确标注为非项目案例'],
    },
    legalNotices: [],
    seo: {
      organization: { name: 'KDO / 凯迪欧', description: '工业地坪材料体系的项目沟通入口。' },
      pages: {
        home: { title: '凯迪欧地坪漆 | 工业地坪材料与色彩系统', description: '面向工程甲方、经销商和海外采购商的工业地坪材料网站。', breadcrumb: '首页' },
        products: { title: '产品中心 | 凯迪欧地坪漆', description: '纳米硅、着色剂、自流平与水性聚氨酯砂浆产品资料。', breadcrumb: '产品中心' },
        solutions: { title: '行业应用 | 凯迪欧地坪漆', description: '按食品、洁净、制造、仓储、商业与停车标线场景组织材料沟通。', breadcrumb: '行业应用' },
        about: { title: '关于凯迪欧', description: '凯迪欧地坪漆公开资料、品牌表达和项目服务边界。', breadcrumb: '关于' },
        contact: { title: '咨询与购买 | 凯迪欧地坪漆', description: '提交项目、渠道或海外采购需求，获取产品资料与样品沟通。', breadcrumb: '咨询' },
      },
      product: { titleSuffix: ' | KDO', category: '工业地坪材料' },
      notFound: { title: '页面未找到 | 凯迪欧', description: '该路径不存在，请返回首页或产品中心。' },
    },
    notFound: {
      eyebrow: '路径提示 / NOT FOUND',
      pageTitle: '404 | 页面未找到',
      pageBody: '该路径不存在，或当前公开站点中未收录。',
      productTitle: '404 | 未找到该材料',
      productBody: '该材料条目不存在，或当前公开资料中未收录。',
      productsAction: '返回产品中心',
      homeAction: '返回首页',
    },
    about: {
      thesis: '把地坪材料沟通放回项目现场',
      introduction: '凯迪欧地坪漆围绕实际使用场景整理材料、配色与项目沟通信息。公开表达优先呈现可核验资料、产品体系和询盘路径。',
      timeline: [
        { label: '材料', title: '从应用问题开始', description: '以食品、洁净、制造、物流与公共空间中的具体问题组织材料信息。' },
        { label: '样板', title: '让样板进入决策', description: '围绕颜色、基面与施工条件准备可核对的样品和说明。' },
        { label: '交付', title: '为后续维护留下依据', description: '将已确认资料和实施关注点保留在项目沟通中，方便后续衔接。' },
      ],
      evidenceNote: '内容证据说明：公开页面仅使用已整理的企业资料与可核验信息；未呈现客户标识、项目背书、未经授权的品牌元素或未经核验的性能与规模数据。',
    },
  },
  en: {
    locale: 'en',
    products: [
      {
        slug: 'nano-silicon-marking-paint',
        name: 'Nano-Silicon Marking Paint',
        shortName: 'Nano Marking',
        summary: 'A floor-marking material for parking, warehousing, campus traffic, and work-zone organization.',
        mediaId: 'product-marking',
        packageMediaId: 'pack-marking',
        applications: ['Parking zones', 'Warehouse routes', 'Campus traffic marking'],
        characteristics: ['Organizes vehicle, pedestrian, equipment, and safety boundaries into one visual language.', 'Color, line width, and old-line treatment should be confirmed against site lighting, substrate condition, and work windows.'],
        substrates: ['Cleaned and confirmed concrete or existing flooring surfaces', 'Sites requiring marking renewal or new zoning'],
        detailSections: [
          { title: 'Visual role', body: 'Marking is spatial reading, not only paint on the floor. Low-saturation color, crisp edges, and real site scale make the value visible.' },
          { title: 'Site dialogue', body: 'Confirm existing lines, adhesion, traffic flow, color direction, opening schedule, and sample approval method.' },
          { title: 'Purchasing material', body: 'Useful materials include the leaflet, color direction, packaging image, site-condition checklist, and sample notes.' },
        ],
        dialoguePrompts: ['Cleanliness and integrity of current markings and substrate', 'Traffic plan, work window, color, and line-width requirements'],
        purchase: {
          title: 'Request marking material and color notes',
          note: 'For parking, warehouse, plant renewal, and new traffic-marking projects.',
          primaryAction: 'Submit marking enquiry',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
        flagship: {
          kind: 'marking',
          evidence: 'company-material',
          sourceNote: 'The product appears in company leaflet material. Concept visual is not case evidence.',
          visual: {
            heading: 'Make the floor readable first',
            description: 'Low-saturation marking can clarify parking, traffic, loading, and safety boundaries while keeping the space visually refined.',
            src: '/media/v2/product-marking.webp',
            alt: 'Nano-silicon marking paint application concept visual',
          },
          guidanceTitle: 'Color and line-width choices',
          guidanceNotice: 'Color and line width require physical sample confirmation on site.',
          guidance: [
            { label: 'Color choice', detail: 'Review lighting, users, existing floor color, and safety recognition before approving a sample.' },
            { label: 'Line-width choice', detail: 'Confirm against vehicle routes, pedestrian areas, equipment boundaries, and viewing distance.' },
          ],
          applicationTitle: 'Implementation dialogue',
          applicationSteps: [
            { title: 'Confirm scope', description: 'Review old lines, substrate, zoning, and reopening schedule.' },
            { title: 'Clean and mask', description: 'Identify edges, walls, equipment, and neighboring areas that need protection.' },
            { title: 'Approve sample', description: 'Confirm color, line width, and recognition under real lighting.' },
            { title: 'Hand over by zone', description: 'Work through the agreed traffic plan and retain handover notes.' },
          ],
        },
      },
      {
        slug: 'nano-silicon-colorant',
        name: 'Nano-Silicon Colorant',
        shortName: 'Nano Colorant',
        summary: 'A colorant for floor color, marking color, and project sample dialogue, focused on restrained mineral tones.',
        mediaId: 'product-colorant',
        packageMediaId: 'pack-colorant',
        applications: ['Floor color', 'Marking color', 'Project samples'],
        characteristics: ['Moves color approval from screen color to physical sample and site light.', 'Appearance should be confirmed with the coating system, substrate absorption, and application method.'],
        substrates: ['Coating systems to be confirmed', 'Project substrates requiring color sample or repair comparison'],
        detailSections: [
          { title: 'Color role', body: 'Mist green, sandstone, clay, graphite, and related muted tones create a quieter industrial color language.' },
          { title: 'Sample role', body: 'Review physical samples under site light and note old floor, repaired areas, and substrate differences.' },
          { title: 'Purchasing material', body: 'Useful materials include color direction, sampling needs, target-space photos, and approval flow.' },
        ],
        dialoguePrompts: ['Target color, site lighting, and available samples', 'Substrate differences, sample area, and approval method'],
        purchase: {
          title: 'Request color sample guidance',
          note: 'For projects that need brand color, zoning, or low-saturation floor color.',
          primaryAction: 'Submit color request',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
        flagship: {
          kind: 'colorant',
          evidence: 'company-material',
          sourceNote: 'Company material covers the product direction. Palette and comparison modules are communication illustrations.',
          visual: {
            heading: 'Low-saturation color dialogue',
            description: 'Begin with physical samples and site lighting instead of treating screen color as material truth.',
          },
          paletteTitle: 'Muted mineral palette',
          palette: [
            { label: 'Mineral grey', tone: 'mineral' },
            { label: 'Mist green', tone: 'mist' },
            { label: 'Sandstone', tone: 'sand' },
            { label: 'Clay', tone: 'clay' },
          ],
          substrateTitle: 'Substrate differences',
          substrateNotes: [
            { label: 'Dense substrate', detail: 'Confirm preparation and sample-viewing method first.' },
            { label: 'Variable absorption', detail: 'Use a local sample to observe color and texture differences.' },
            { label: 'Existing surface', detail: 'Review old layers, contamination, and repairs before sampling.' },
          ],
          comparison: {
            title: 'Sample dialogue comparison',
            beforeLabel: 'Existing substrate',
            before: 'Record current tone, repairs, and absorption differences.',
            afterLabel: 'Color sample',
            after: 'Discuss target tone and surface character under the same viewing conditions.',
            disclaimer: 'Communication illustration, not a project result.',
          },
        },
      },
      {
        slug: 'silicon-crystal-self-leveling',
        name: 'Silicon-Crystal Self-Leveling',
        shortName: 'Silicon-Crystal',
        summary: 'A self-leveling system for continuous, even, clean floor expression.',
        mediaId: 'product-silicon-crystal',
        packageMediaId: 'pack-silicon-crystal',
        applications: ['Clean spaces', 'Manufacturing spaces', 'Commercial and public areas'],
        characteristics: ['Emphasizes continuous surface expression, evenness, and maintenance dialogue.', 'The system should be confirmed against substrate, use intensity, and site conditions.'],
        substrates: ['Inspected concrete substrates', 'Existing floors with agreed repair and preparation'],
        detailSections: [
          { title: 'Surface role', body: 'Silicon-crystal self-leveling reduces visual fragmentation and makes the floor feel more complete and disciplined.' },
          { title: 'Site role', body: 'Confirm flatness, joints, edge details, opening schedule, and cleaning method.' },
          { title: 'Purchasing material', body: 'Useful materials include product leaflet, packaging image, sample notes, substrate checklist, and handover points.' },
        ],
        dialoguePrompts: ['Space use, substrate evenness, and existing surface condition', 'Work coordination, samples, and future maintenance'],
        purchase: {
          title: 'Request self-leveling material',
          note: 'For clean, commercial-public, and manufacturing spaces requiring continuous floor expression.',
          primaryAction: 'Submit self-leveling enquiry',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
      },
      {
        slug: 'colored-sand-self-leveling',
        name: 'Colored-Sand Self-Leveling',
        shortName: 'Colored-Sand',
        summary: 'A self-leveling system for granular texture, muted color, and whole-surface expression.',
        mediaId: 'product-colored-sand',
        packageMediaId: 'pack-colored-sand',
        applications: ['Commercial spaces', 'Public spaces', 'Display and manufacturing areas'],
        characteristics: ['Uses fine aggregate texture and color depth to create a more recognizable floor surface.', 'Final expression should follow physical samples and confirmed substrate conditions.'],
        substrates: ['Concrete substrates confirmed on site', 'Existing floors suitable for sample dialogue'],
        detailSections: [
          { title: 'Texture role', body: 'Colored sand gives the surface a real material grain, useful for refined commercial, public, and display spaces.' },
          { title: 'Color role', body: 'Muted sandstone, graphite, mist green, and clay directions help avoid harsh contrast.' },
          { title: 'Purchasing material', body: 'Useful materials include colored-sand samples, color direction, space photos, maintenance notes, and construction boundaries.' },
        ],
        dialoguePrompts: ['Granular and color direction, lighting, and cleaning method', 'Substrate differences, zone transitions, and sample approver'],
        purchase: {
          title: 'Request colored-sand samples',
          note: 'For projects seeking fine granular texture and spatial identity.',
          primaryAction: 'Submit colored-sand enquiry',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
      },
      {
        slug: 'waterborne-pu-mortar',
        name: 'Waterborne PU Mortar',
        shortName: 'PU Mortar',
        summary: 'A flooring mortar system for food, clean, and manufacturing environments, focused on cleaning, drainage, work windows, and substrate conditions.',
        mediaId: 'product-pu-mortar',
        packageMediaId: 'pack-pu-mortar',
        applications: ['Food and beverage spaces', 'Pharma and clean spaces', 'Manufacturing and new-energy zones'],
        characteristics: ['Begins with environmental load, cleaning method, and production rhythm.', 'Unverified performance numbers should not replace site confirmation.'],
        substrates: ['Concrete substrates inspected with an agreed preparation method', 'Existing floors that need production-window assessment'],
        detailSections: [
          { title: 'Setting role', body: 'These spaces care about production continuity, cleaning, drainage, and edge details. The page should feel credible, clean, and engineered.' },
          { title: 'Handover role', body: 'Confirm shutdown window, equipment boundaries, drainage, substrate moisture, and reopening requirements.' },
          { title: 'Purchasing material', body: 'Useful materials include product information, packaging image, substrate checklist, work-window notes, and detail discussion points.' },
        ],
        dialoguePrompts: ['Cleaning method, operating environment, and shutdown window', 'Substrate condition, drainage details, and handover needs'],
        purchase: {
          title: 'Request mortar system material',
          note: 'For food, clean, and manufacturing projects that need careful work-window dialogue.',
          primaryAction: 'Submit mortar enquiry',
          route: '/contact',
        },
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
      },
    ],
    solutions: [
      {
        id: 'food-and-beverage',
        name: 'Food & Beverage',
        description: 'Begin material dialogue with cleaning, production rhythm, drainage, and edge details.',
        useCases: ['Processing areas', 'Packing areas', 'Service and cleaning routes'],
        challenge: 'Cleaning methods, production continuity, drainage details, and varied work zones must be reviewed together.',
        recommendedSystem: 'Begin with waterborne PU mortar, then assess marking and local transition materials against each zone.',
        implementationFocus: 'Confirm substrate, drainage, and edge details while coordinating cleaning, shutdown, and zoned handover.',
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
      },
      {
        id: 'pharma-and-clean-spaces',
        name: 'Pharma & Clean Spaces',
        description: 'Discuss material direction around clean management, surface continuity, and work isolation.',
        useCases: ['Clean work zones', 'Laboratory and support spaces', 'Controlled routes'],
        challenge: 'Clean management, access timing, and substrate integrity shape the implementation sequence.',
        recommendedSystem: 'Discuss waterborne PU mortar or silicon-crystal self-leveling against use and cleaning conditions, retaining a sample step.',
        implementationFocus: 'Align clean isolation, substrate preparation, detail finishing, and handover before reopening.',
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
      },
      {
        id: 'new-energy-and-manufacturing',
        name: 'New Energy & Manufacturing',
        description: 'Organize flooring information around production flow, equipment zones, and maintenance windows.',
        useCases: ['Manufacturing floors', 'Equipment zones', 'Assembly and transfer areas'],
        challenge: 'Equipment, logistics, people, and maintenance overlap, so implementation boundaries must remain clear.',
        recommendedSystem: 'Discuss waterborne PU mortar, self-leveling systems, and nano-silicon marking paint against substrate and operations.',
        implementationFocus: 'Review equipment boundaries, alternative routes, work isolation, and zoned reopening first.',
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
      },
      {
        id: 'warehousing-and-logistics',
        name: 'Warehousing & Logistics',
        description: 'Use internal traffic, loading, and work zones as the entry to material choice.',
        useCases: ['Warehouse routes', 'Loading areas', 'Picking and work zones'],
        challenge: 'Frequent movement, changing operations, and temporary diversions demand a clear zoning and maintenance plan.',
        recommendedSystem: 'Begin with a self-leveling or waterborne PU mortar direction, then organize routes with nano-silicon marking paint.',
        implementationFocus: 'Confirm substrate, routes, work windows, temporary diversions, and marking-sample handover.',
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
      },
      {
        id: 'commercial-and-public-spaces',
        name: 'Commercial & Public Spaces',
        description: 'Keep spatial expression, opening hours, and routine maintenance in one material conversation.',
        useCases: ['Commercial spaces', 'Public areas', 'Wayfinding and display areas'],
        challenge: 'Visual consistency, access, footfall, and cleaning all shape sampling and implementation.',
        recommendedSystem: 'Use silicon-crystal self-leveling, colored-sand self-leveling, and nano-silicon colorant for surface and color dialogue.',
        implementationFocus: 'Review samples under site lighting and coordinate zoned access, finishing details, and cleaning.',
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
      },
      {
        id: 'parking-and-traffic-marking',
        name: 'Parking & Traffic Marking',
        description: 'Organize marking and flooring dialogue around parking, vehicles, pedestrians, and safety zones.',
        useCases: ['Parking zones', 'Vehicle and pedestrian routes', 'Campus traffic identification'],
        challenge: 'Existing markings, traffic, lighting, and phased work all affect recognition and implementation.',
        recommendedSystem: 'Begin with nano-silicon marking paint and nano-silicon colorant, confirming direction against the floor and a site sample.',
        implementationFocus: 'Review substrate and old lines, then confirm color, line width, setting out, diversions, and zoned reopening.',
        evidence: 'company-material',
        sourceNote: companyMaterialEn,
      },
    ],
    audiences: [
      { id: 'project-owner', title: 'Project Owners', description: 'Begin with the project setting, color, use requirements, and delivery window.', callToAction: 'Explore project solutions' },
      { id: 'distributor', title: 'Distribution Partners', description: 'Review product material, sample support, regional cooperation, and sales enablement.', callToAction: 'Explore partnership' },
      { id: 'global-buyer', title: 'Global Buyers', description: 'Request English material, packaging information, and sourcing support.', callToAction: 'Request sourcing material' },
    ],
    capabilities: [
      { id: 'application-dialogue', title: 'Application Dialogue', approvedCopy: 'Prepared product information and application support can be discussed around project needs.', evidence: 'company-material', sourceNote: companyMaterialEn },
      { id: 'color-sample-support', title: 'Color and Samples', approvedCopy: 'Color samples and related information can be discussed around project color needs.', evidence: 'company-material', sourceNote: companyMaterialEn },
      { id: 'information-preparation', title: 'Information Preparation', approvedCopy: 'Product and sourcing discussion information can be prepared within the available material scope.', evidence: 'verified', sourceNote: verifiedStructureEn },
    ],
    procurement: {
      title: 'Buying and Partnership',
      introduction: 'The public site should use an enquiry-first purchasing path: gather project conditions, then match product material, samples, channel cooperation, or overseas sourcing support.',
      journeys: [
        {
          audience: 'project-owner',
          title: 'Project enquiry',
          description: 'For factories, campuses, commercial-public spaces, and parking projects.',
          needs: ['Project use', 'Substrate condition', 'Color direction', 'Work window'],
          deliverables: ['Product material', 'Sample notes', 'Construction dialogue checklist'],
          action: 'Submit project need',
        },
        {
          audience: 'distributor',
          title: 'Distributor partnership',
          description: 'For channel partners reviewing product systems, samples, and regional support.',
          needs: ['Region', 'Customer type', 'Priority scenarios', 'Sample needs'],
          deliverables: ['Product selling material', 'Packaging images', 'Sample dialogue notes'],
          action: 'Request partnership talk',
        },
        {
          audience: 'global-buyer',
          title: 'Global sourcing',
          description: 'For buyers needing English material, packaging information, and sourcing dialogue.',
          needs: ['Target market', 'Use scenario', 'Sourcing requirements', 'Communication method'],
          deliverables: ['English material', 'Packaging information', 'Enquiry response points'],
          action: 'Request sourcing info',
        },
      ],
    },
    company: {
      identity: {
        brandName: 'KDO Flooring Paint',
        legalSubject: 'Official material lists Jiangsu Diou Chemical Technology Co., Ltd. as the contact/operating subject and Hubei Kaiou New Materials Co., Ltd. as the production factory.',
        publicWebsite: 'https://www.jsdiou.com',
        positioning: 'Industrial flooring material and project-dialogue entry point',
      },
      leader: {
        publicName: null,
        fallbackCopy: 'No official-source leader name or portrait has been found in the organized material. The public site should present management-team and service philosophy copy until the company confirms a name, portrait, title, and authorized wording.',
        verificationNote: 'Leader name, portrait, title, and quote require company confirmation or an official publication page.',
      },
      proofPrinciples: ['Present KDO as a brand and state legal subjects according to official material', 'Do not show unauthorized client marks', 'Do not use unverified ranking or scale figures', 'Label concept visuals as non-case imagery'],
    },
    legalNotices: [],
    seo: {
      organization: { name: 'KDO', description: 'A project-dialogue entry point for industrial flooring material systems.' },
      pages: {
        home: { title: 'KDO Flooring Paint | Industrial Floor Materials and Color Systems', description: 'An industrial flooring material website for project owners, distribution partners, and global buyers.', breadcrumb: 'Home' },
        products: { title: 'Products | KDO Flooring Paint', description: 'Nano-silicon, colorant, self-leveling, and waterborne PU mortar product material.', breadcrumb: 'Products' },
        solutions: { title: 'Industry Applications | KDO Flooring Paint', description: 'Material dialogue for food, clean, manufacturing, logistics, commercial, and traffic-marking settings.', breadcrumb: 'Applications' },
        about: { title: 'About KDO', description: 'Public material, brand expression, and project-service boundaries for KDO Flooring Paint.', breadcrumb: 'About' },
        contact: { title: 'Enquiry and Buying | KDO Flooring Paint', description: 'Submit project, channel, or global sourcing needs to request product material and samples.', breadcrumb: 'Enquiry' },
      },
      product: { titleSuffix: ' | KDO', category: 'Industrial flooring material' },
      notFound: { title: 'Page not found | KDO', description: 'This path is not available. Return home or browse products.' },
    },
    notFound: {
      eyebrow: 'ROUTE NOTE / NOT FOUND',
      pageTitle: '404 | Page not found',
      pageBody: 'This path does not exist or is not included in the current public site.',
      productTitle: '404 | Material not found',
      productBody: 'This material entry does not exist or is not included in the available public material.',
      productsAction: 'Browse products',
      homeAction: 'Return home',
    },
    about: {
      thesis: 'Put material dialogue back in the project setting.',
      introduction: 'KDO Flooring Paint organizes material, color, and project dialogue around how a space is actually used. Public copy prioritizes verifiable material, product systems, and enquiry paths.',
      timeline: [
        { label: 'Materials', title: 'Begin with the application question', description: 'Organize material information around concrete questions in food, clean, manufacturing, logistics, and public spaces.' },
        { label: 'Samples', title: 'Bring samples into the decision', description: 'Prepare samples and notes that can be checked against color, substrate, and working conditions.' },
        { label: 'Handover', title: 'Leave a basis for future maintenance', description: 'Keep confirmed information and implementation considerations connected to the project conversation.' },
      ],
      evidenceNote: 'Content evidence note: public pages use organized company material and verifiable information only. They do not present client marks, project endorsements, unlicensed brand elements, or unverified performance and scale figures.',
    },
  },
};
