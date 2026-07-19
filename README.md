# KDO / 凯迪欧高端企业站

React、TypeScript 与 Vite 构建的中英双语静态企业站原型。中文路由无前缀，英文使用真实 `/en` 前缀；询盘仅演示前端校验和成功状态，不向服务器发送数据。

## 精确内容体系

五项产品由 `src/app/site-content.ts` 集中维护：

| 中文 | English | slug |
| --- | --- | --- |
| 纳米硅标线涂料 | Nano-Silicon Marking Paint | `nano-silicon-marking-paint` |
| 纳米硅色浆 | Nano-Silicon Colorant | `nano-silicon-colorant` |
| 硅晶自流平 | Silicon-Crystal Self-Leveling | `silicon-crystal-self-leveling` |
| 彩砂自流平 | Colored-Sand Self-Leveling | `colored-sand-self-leveling` |
| 水性聚氨酯砂浆 | Waterborne PU Mortar | `waterborne-pu-mortar` |

六项行业方案为：食品与饮料、医药与洁净空间、新能源与制造、仓储与物流、商业与公共空间、停车场与交通标线。每项均包含挑战、推荐体系、实施关注点和询盘入口，不发布未经核验的性能数字。

每个 `Product`、`Solution` 与旗舰扩展内容都带 `evidence` 和内部 `sourceNote`。旗舰页中的图片、色板、线宽说明和比较模块仅用于沟通，不能改写为检测结果或真实项目案例。

## 环境要求与安装

- Node.js 满足当前 Vite 版本要求
- npm
- Chromium（端到端测试需要）

```bash
npm install
npx playwright install chromium
```

锁文件未变化的 CI 环境建议使用 `npm ci`。

## 开发、测试与构建

```bash
npm run dev
npm test
npm run build
npm run test:e2e
```

## 公开发布

本仓库可通过 GitHub Pages 公开访问。图片、站内导航、SEO 链接与直达产品页均已适配仓库子路径，发布后的地址格式为：

```text
https://<GitHub 账号>.github.io/<仓库名>/
```

本次首发使用 GitHub Pages 静态分支。后续若要每次推送 `main` 自动发布，请在 GitHub CLI 中补充 `workflow` 权限，再将 [github-pages-workflow.template.yml](github-pages-workflow.template.yml) 移到 `.github/workflows/deploy-pages.yml`，并在仓库 **Settings → Pages → Build and deployment** 选择 **GitHub Actions**。

正式对外投放前，请把演示询盘改为真实、经同意的数据收集接口，并发布隐私政策。

- `npm test`：Vitest 单元、组件与静态契约测试。
- `npm run test:e2e`：先构建生产产物，再以同一份 `dist/` 在 Chromium 的桌面 `1440×1000`、平板 `768×1024` 和手机 `390×844` 项目中验收关键路由、菜单、表单、无横向溢出和截图。
- 完整交付检查：`npm test && npm run build && npm run test:e2e`。
- 当前环境只安装并实际执行 Chromium。Firefox 与 WebKit 浏览器包当前不可用，因此未将其写入配置或虚报覆盖；安装并稳定验证后可另行扩展项目。

交付截图位于 `preview/`：`home-desktop.png`、`home-tablet.png`、`home-mobile.png`、`products-desktop.png`、`nano-silicon-marking-paint-desktop.png`。

## 路由与部署

- 中文：首页 `/`，示例详情 `/products/nano-silicon-marking-paint`，联系页 `/contact`。
- 英文：首页 `/en`，示例详情 `/en/products/nano-silicon-marking-paint`，联系页 `/en/contact`。
- 语言切换保持当前页面、查询参数与锚点；直接访问 `/en/...` 不依赖 `localStorage`。
- 部署平台必须把未知前端路由回退到 `/index.html`，由站内通配路由输出可恢复的 noindex 页面。

只有设置有效 `VITE_SITE_URL` 后才会生成 canonical、`og:url`、安全本地图对应的 `og:image`、Schema URL 与 `zh-CN` / `en` / `x-default` alternate。变量必须是无凭据、无路径、无查询、无 hash 的 HTTPS 根域名：

```powershell
$env:VITE_SITE_URL='https://www.example.com'
npm run build
```

域名未确认时不要使用占位 URL。

## 部署层安全头

静态产物本身不能强制响应头。正式托管层应至少配置并按实际接入服务复核：

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

其中 `frame-ancestors` 必须通过响应头发送，不能只依赖页面 meta。若后续接入询盘接口、分析、字体或第三方服务，应先收紧评估再更新 CSP 与 Permissions Policy，不应直接放宽为通配来源。

## 询盘与隐私边界

首页底部使用 compact 询盘表单，联系页使用完整表单。两处在提交前均可见声明“演示版不会发送至服务器；正式上线需补充并确认隐私政策”。正式上线前还需接入真实接口、隐私同意、数据保存与删除机制、滥用防护和监控。

## 目录

- `src/app/site-content.ts`：双语内容、证据等级与旗舰扩展模型。
- `src/app/locale-path.ts`：中英文真实路径转换。
- `src/app/seo.ts`：有效路由 SEO、hreflang 与结构化数据。
- `src/pages/`、`src/components/`：页面与共享组件。
- `public/media/`：筛选后的本地 WebP 素材。
- `tests/e2e/site.spec.ts`：最终浏览器验收。
- `CONTENT-SOURCES.md`：内容、图片来源与上线前补证清单。

## 当前真实限制

- 表单不会连接服务器或发送邮件。
- 未发布检测性能、客户 Logo、客户案例、产能/出口规模或人物故事。
- 图片为企业资料裁切的氛围视觉，不构成项目案例证明。
- 当前自动化浏览器边界为 Chromium 的桌面、平板与手机视口。
