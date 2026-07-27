# KDO Brand Video Production Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a 42-second premium KDO brand film in 1080 × 1920 and 1920 × 1080, combining verified company media, official public cases, one restrained Veo 3.1 material shot, editorial motion graphics, and a verified consultation CTA.

**Architecture:** Build the film as two deterministic Remotion compositions sharing one timeline data model and scene components. Store source attribution and public-copy boundaries in typed data, generate only one non-factual material insert with Adobe Firefly/Veo 3.1, synthesize a restrained ambient audio bed locally, and verify rendered MP4 properties with ffprobe plus automated content tests.

**Tech Stack:** React 19, TypeScript, Remotion, Vitest, Adobe Firefly/Veo 3.1, FFmpeg/ffprobe, PowerShell.

## Global Constraints

- Vertical master: 1080 × 1920, 24fps, 42 seconds, H.264 MP4.
- Horizontal master: 1920 × 1080, 24fps, 42 seconds, H.264 MP4.
- Final user files must be copied to `C:\Users\Administrator\Documents\Codex\2026-07-16\company-review\outputs`.
- Do not include a virtual presenter, AI face, fake logo, fake certificate, fake factory, or fake project site.
- AI media is limited to one 6–8 second material-atmosphere insert and must not contain readable text, brand marks, or people.
- Official cases must be labelled `凯迪欧官网公开案例`.
- Do not publish unverified performance numbers, customer endorsements, rankings, lifespan claims, or absolute language.
- Final CTA must include `经销合作 / 工程选材 / 海外采购`, `400-8898-733`, and `www.jsdiou.com`.
- Do not commit final rendered MP4 files or generated working files to Git.

---

### Task 1: Add the deterministic production scaffold and content contract

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `video-production/remotion.config.ts`
- Create: `video-production/src/index.ts`
- Create: `video-production/src/Root.tsx`
- Create: `video-production/src/timeline-data.ts`
- Create: `video-production/src/timeline-data.test.ts`

**Interfaces:**
- Produces: `FILM_FPS`, `FILM_DURATION_SECONDS`, `TOTAL_FRAMES`, `SCENES`, `OFFICIAL_CASES`, `PRODUCTS`, and `CTA`.
- `SCENES` is consumed by both film compositions.
- `Root.tsx` registers `KDO-Vertical` and `KDO-Horizontal`.

- [ ] **Step 1: Write the failing timeline contract test**

```ts
import { describe, expect, it } from 'vitest';
import {
  CTA,
  FILM_DURATION_SECONDS,
  FILM_FPS,
  OFFICIAL_CASES,
  PRODUCTS,
  SCENES,
  TOTAL_FRAMES,
} from './timeline-data';

describe('KDO film timeline', () => {
  it('renders a complete 42-second timeline at 24fps', () => {
    expect(FILM_FPS).toBe(24);
    expect(FILM_DURATION_SECONDS).toBe(42);
    expect(TOTAL_FRAMES).toBe(1008);
    expect(SCENES.reduce((sum, scene) => sum + scene.durationInFrames, 0)).toBe(TOTAL_FRAMES);
  });

  it('uses the approved product system and public-case boundary', () => {
    expect(PRODUCTS.map((product) => product.name)).toEqual([
      '纳米硅划线漆',
      '纳米硅着色剂',
      '硅晶自流平',
      '彩砂自流平',
      '水性聚氨酯砂浆',
    ]);
    expect(OFFICIAL_CASES).toHaveLength(3);
    expect(OFFICIAL_CASES.every((item) => item.label === '凯迪欧官网公开案例')).toBe(true);
  });

  it('contains the verified consultation path and no banned claims', () => {
    const publicCopy = JSON.stringify({ SCENES, OFFICIAL_CASES, PRODUCTS, CTA });
    expect(CTA.phone).toBe('400-8898-733');
    expect(CTA.website).toBe('www.jsdiou.com');
    expect(publicCopy).not.toMatch(/行业第一|首创|零问题|永久|绝对|客户推荐/);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run:

```powershell
npx vitest run video-production/src/timeline-data.test.ts
```

Expected: FAIL because `timeline-data.ts` does not exist.

- [ ] **Step 3: Add Remotion dependencies and scripts**

Add these development dependencies:

```json
{
  "@remotion/cli": "^4.0.0",
  "remotion": "^4.0.0"
}
```

Add scripts:

```json
{
  "video:studio": "remotion studio video-production/src/index.ts",
  "video:still:vertical": "remotion still video-production/src/index.ts KDO-Vertical video-production/render/vertical-preview.png --frame=360",
  "video:still:horizontal": "remotion still video-production/src/index.ts KDO-Horizontal video-production/render/horizontal-preview.png --frame=360",
  "video:render:vertical": "remotion render video-production/src/index.ts KDO-Vertical video-production/render/kdo-brand-film-vertical.mp4 --codec=h264 --crf=16",
  "video:render:horizontal": "remotion render video-production/src/index.ts KDO-Horizontal video-production/render/kdo-brand-film-horizontal.mp4 --codec=h264 --crf=16"
}
```

Ignore:

```gitignore
video-production/render/
video-production/generated/
public/media/video/generated/
```

- [ ] **Step 4: Implement the timeline data**

Create exact constants:

```ts
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
  { id: 'opening', durationInFrames: 96, eyebrow: 'KDO / 凯迪欧', headline: '把颜色做进材料，把秩序留在地面' },
  { id: 'material', durationInFrames: 168, eyebrow: 'MATERIAL / COLOR / SURFACE', headline: '材料、色彩与表面' },
  { id: 'flagships', durationInFrames: 216, eyebrow: 'FLAGSHIP MATERIALS', headline: '从标线与色彩开始' },
  { id: 'cases', durationInFrames: 288, eyebrow: 'PUBLIC CASE RECORD', headline: '让材料进入真实空间' },
  { id: 'system', durationInFrames: 144, eyebrow: 'FLOORING SYSTEMS', headline: '从标线与色彩，到连续地坪系统' },
  { id: 'cta', durationInFrames: 96, eyebrow: 'PROJECT DIALOGUE', headline: '经销合作 / 工程选材 / 海外采购' },
];

export const OFFICIAL_CASES = [
  { name: '山东聊城万达广场地下车库', area: '60,000 ㎡', image: 'media/v3/case-wanda-garage.jpg', label: '凯迪欧官网公开案例' },
  { name: '济南绿地中央公馆地下车库', area: '30,000 ㎡', image: 'media/v3/case-greenland-garage.jpg', label: '凯迪欧官网公开案例' },
  { name: '济南龙湖春江郦城地下车库', area: '100,000 ㎡', image: 'media/v3/case-longfor-garage.jpg', label: '凯迪欧官网公开案例' },
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
```

- [ ] **Step 5: Register both compositions**

`Root.tsx` must register:

```tsx
<Composition
  id="KDO-Vertical"
  component={KdoBrandFilm}
  durationInFrames={TOTAL_FRAMES}
  fps={FILM_FPS}
  width={1080}
  height={1920}
  defaultProps={{ format: 'vertical' as const }}
/>
<Composition
  id="KDO-Horizontal"
  component={KdoBrandFilm}
  durationInFrames={TOTAL_FRAMES}
  fps={FILM_FPS}
  width={1920}
  height={1080}
  defaultProps={{ format: 'horizontal' as const }}
/>
```

- [ ] **Step 6: Run tests and commit**

Run:

```powershell
npx vitest run video-production/src/timeline-data.test.ts
```

Expected: 3 tests pass.

Commit:

```powershell
git add package.json package-lock.json .gitignore video-production
git commit -m "Build KDO film production scaffold"
```

---

### Task 2: Build the shared editorial scene system

**Files:**
- Create: `video-production/src/KdoBrandFilm.tsx`
- Create: `video-production/src/brand-system.ts`
- Create: `video-production/src/components/SceneFrame.tsx`
- Create: `video-production/src/components/MediaPanel.tsx`
- Create: `video-production/src/components/EditorialType.tsx`
- Create: `video-production/src/components/FilmGrain.tsx`
- Create: `video-production/src/brand-system.test.ts`

**Interfaces:**
- `KdoBrandFilm({format}: {format: 'vertical' | 'horizontal'})` renders the complete timeline.
- `SceneFrame` supplies safe-area padding, background, grain, progress mark, and format-aware layout.
- `MediaPanel` renders still or video media with controlled cover/contain behavior.
- `BRAND` supplies colors, typography, spacing, and subtitle safe areas.

- [ ] **Step 1: Write the failing brand-system test**

```ts
import { describe, expect, it } from 'vitest';
import { BRAND, safeAreaFor } from './brand-system';

describe('KDO film brand system', () => {
  it('uses the restrained industrial palette', () => {
    expect(BRAND.colors).toEqual({
      graphite: '#111411',
      mineral: '#F2F0E8',
      kdoGreen: '#2F6E4F',
      safety: '#D6A443',
      oxidized: '#A95E3F',
      mist: '#AAB2AA',
    });
  });

  it('keeps vertical captions inside platform-safe bounds', () => {
    expect(safeAreaFor('vertical')).toEqual({ top: 156, right: 72, bottom: 220, left: 72 });
    expect(safeAreaFor('horizontal')).toEqual({ top: 72, right: 96, bottom: 72, left: 96 });
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run:

```powershell
npx vitest run video-production/src/brand-system.test.ts
```

Expected: FAIL because `brand-system.ts` does not exist.

- [ ] **Step 3: Implement the brand system and scene primitives**

Use:

```ts
export const BRAND = {
  colors: {
    graphite: '#111411',
    mineral: '#F2F0E8',
    kdoGreen: '#2F6E4F',
    safety: '#D6A443',
    oxidized: '#A95E3F',
    mist: '#AAB2AA',
  },
  fonts: {
    display: '"DengXian", "Microsoft YaHei UI", sans-serif',
    body: '"Microsoft YaHei UI", "Segoe UI", sans-serif',
  },
} as const;

export const safeAreaFor = (format: 'vertical' | 'horizontal') =>
  format === 'vertical'
    ? { top: 156, right: 72, bottom: 220, left: 72 }
    : { top: 72, right: 96, bottom: 72, left: 96 };
```

Motion rules:

- Headline entry: 14-frame opacity fade and 28-pixel rise.
- Media motion: maximum 1.08 scale over a full scene.
- Scene transition: 10-frame mineral-white or graphite crossfade.
- Film grain opacity: 0.035.
- No spring bounce, glow, drop-shadow-heavy typography, or fast zoom.

- [ ] **Step 4: Implement `KdoBrandFilm` with six sequences**

Use `Sequence` boundaries derived from cumulative `SCENES` durations. Each scene must accept `format` and render from the same content data. Use `staticFile()` for all media and `OffthreadVideo` for generated material footage.

- [ ] **Step 5: Run tests, render preview stills, and commit**

Run:

```powershell
npx vitest run video-production/src/brand-system.test.ts video-production/src/timeline-data.test.ts
npm run video:still:vertical
npm run video:still:horizontal
```

Expected:

- 5 tests pass.
- `video-production/render/vertical-preview.png` exists at 1080 × 1920.
- `video-production/render/horizontal-preview.png` exists at 1920 × 1080.

Commit:

```powershell
git add video-production/src
git commit -m "Create KDO editorial film system"
```

---

### Task 3: Generate and validate the single Veo 3.1 material insert

**Files:**
- Create: `public/media/video/ai-material-flow.mp4`
- Create: `video-production/generated/ai-material-flow-prompt.md`
- Create: `video-production/scripts/check-generated-media.ps1`

**Interfaces:**
- Produces: `staticFile('media/video/ai-material-flow.mp4')`.
- The clip must be 6–8 seconds, 16:9, 720p or higher, 24fps, and contain no people or readable text.

- [ ] **Step 1: Record the exact prompt and model settings**

Prompt:

```text
Photorealistic macro cinematography of premium industrial flooring materials. Fine mineral pigment in muted sage green, warm graphite, sandstone and restrained safety ochre moves slowly across a clean laboratory sample slab, then transitions naturally into a seamless matte industrial floor surface. Realistic material scale, physically correct powder and liquid motion, subtle low-angle camera dolly, soft architectural daylight, refined industrial materials brochure photography, quiet and precise, no people, no hands, no machinery, no logos, no packaging, no labels, no readable text, no neon colors, no science-fiction gloss, no exaggerated reflections, no floating particles.
```

Settings:

- Model: Veo 3.1.
- Aspect ratio: 16:9.
- Resolution: 720p.
- Frame rate: 24fps.
- Duration: 8 seconds.
- Audio: off.
- Reference: none for the first candidate.
- Expected credit use: 400 credits for one generation.

- [ ] **Step 2: Generate one candidate and inspect before requesting another**

Generate only one candidate. Download it to:

`public/media/video/ai-material-flow.mp4`

Reject and regenerate only if it contains:

- human anatomy,
- readable or malformed text,
- invented logos,
- physically impossible material motion,
- bright synthetic neon color,
- obvious looping,
- camera warping,
- or a floor surface that looks like glass/plastic.

- [ ] **Step 3: Add deterministic media validation**

`check-generated-media.ps1` must:

```powershell
$clip = Join-Path $PSScriptRoot '..\..\public\media\video\ai-material-flow.mp4'
if (-not (Test-Path -LiteralPath $clip)) { throw 'Generated material clip is missing' }
$probe = ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json $clip | ConvertFrom-Json
$duration = [double]$probe.format.duration
if ($duration -lt 6 -or $duration -gt 8.5) { throw "Unexpected duration: $duration" }
$video = $probe.streams | Where-Object { $_.width }
if ($video.width -lt 1280 -or $video.height -lt 720) { throw "Resolution is below 720p" }
'GENERATED_MEDIA_CHECK=PASS'
```

- [ ] **Step 4: Run validation and commit only metadata/prompt**

Run:

```powershell
powershell -ExecutionPolicy Bypass -File video-production/scripts/check-generated-media.ps1
```

Expected: `GENERATED_MEDIA_CHECK=PASS`.

The generated clip remains ignored by Git. Commit the prompt and validator:

```powershell
git add video-production/generated/ai-material-flow-prompt.md video-production/scripts/check-generated-media.ps1
git commit -m "Document and validate KDO material generation"
```

---

### Task 4: Complete all six scenes with source-backed media

**Files:**
- Modify: `video-production/src/KdoBrandFilm.tsx`
- Create: `video-production/src/scenes/OpeningScene.tsx`
- Create: `video-production/src/scenes/MaterialScene.tsx`
- Create: `video-production/src/scenes/FlagshipScene.tsx`
- Create: `video-production/src/scenes/CasesScene.tsx`
- Create: `video-production/src/scenes/SystemScene.tsx`
- Create: `video-production/src/scenes/CtaScene.tsx`
- Create: `video-production/src/public-copy.test.ts`

**Interfaces:**
- Each scene accepts `{format: 'vertical' | 'horizontal'}`.
- Scene media comes only from `public/media`, `OFFICIAL_CASES`, and `PRODUCTS`.
- Public copy is imported from `timeline-data.ts`, not duplicated.

- [ ] **Step 1: Write the failing public-copy test**

```ts
import { describe, expect, it } from 'vitest';
import { CTA, OFFICIAL_CASES, SCENES } from './timeline-data';

describe('public film copy', () => {
  it('contains the approved core lines', () => {
    expect(SCENES[0].headline).toBe('把颜色做进材料，把秩序留在地面');
    expect(SCENES[5].headline).toBe('经销合作 / 工程选材 / 海外采购');
    expect(CTA.support).toBe('项目条件 · 技术资料 · 样板沟通');
  });

  it('keeps every published project visibly source-bounded', () => {
    for (const item of OFFICIAL_CASES) {
      expect(item.label).toBe('凯迪欧官网公开案例');
      expect(item.area).toMatch(/㎡$/);
    }
  });
});
```

- [ ] **Step 2: Run the test**

Run:

```powershell
npx vitest run video-production/src/public-copy.test.ts
```

Expected: PASS once Task 1 data exists; this becomes a regression contract before scene work.

- [ ] **Step 3: Implement scene media and layout**

Media mapping:

- Opening: `media/v2/company-factory.webp`.
- Material: `media/video/ai-material-flow.mp4`.
- Flagships: `media/v2/pack-marking.webp`, `media/v2/product-marking.webp`, `media/v2/pack-colorant.webp`, `media/v2/product-colorant.webp`.
- Cases: three files under `media/v3/`.
- System: all five `pack-*.webp` files.
- CTA: `media/v3/case-wanda-garage.jpg` darkened to 32% visibility behind the CTA.

Format behavior:

- Vertical: one dominant media panel, captions below or over a controlled graphite band.
- Horizontal: 58/42 editorial split, with text aligned to the left column.
- Case images use slow pan/zoom and retain the official-case label on every frame where the case name is visible.

- [ ] **Step 4: Render six representative stills**

Render frames:

```powershell
npx remotion still video-production/src/index.ts KDO-Vertical video-production/render/vertical-opening.png --frame=48
npx remotion still video-production/src/index.ts KDO-Vertical video-production/render/vertical-flagship.png --frame=360
npx remotion still video-production/src/index.ts KDO-Vertical video-production/render/vertical-case.png --frame=600
npx remotion still video-production/src/index.ts KDO-Horizontal video-production/render/horizontal-opening.png --frame=48
npx remotion still video-production/src/index.ts KDO-Horizontal video-production/render/horizontal-flagship.png --frame=360
npx remotion still video-production/src/index.ts KDO-Horizontal video-production/render/horizontal-case.png --frame=600
```

Expected: six PNG files render without missing-media errors.

- [ ] **Step 5: Run tests and commit**

Run:

```powershell
npx vitest run video-production/src
```

Expected: all video-production tests pass.

Commit:

```powershell
git add video-production/src
git commit -m "Assemble KDO source-backed brand film"
```

---

### Task 5: Build restrained original sound design

**Files:**
- Create: `video-production/scripts/build-audio.ps1`
- Create: `public/media/video/kdo-ambient-bed.wav`

**Interfaces:**
- Produces: `staticFile('media/video/kdo-ambient-bed.wav')`.
- Output: 48kHz stereo PCM WAV, exactly 42 seconds.

- [ ] **Step 1: Implement deterministic audio synthesis**

Use FFmpeg sources:

```powershell
ffmpeg -hide_banner -loglevel error -y `
  -f lavfi -i "sine=frequency=55:sample_rate=48000:duration=42" `
  -f lavfi -i "sine=frequency=82.41:sample_rate=48000:duration=42" `
  -f lavfi -i "anoisesrc=color=brown:sample_rate=48000:duration=42:amplitude=0.035" `
  -filter_complex "[0:a]volume=0.035,lowpass=f=140[a0];[1:a]volume=0.018,lowpass=f=220[a1];[2:a]highpass=f=90,lowpass=f=1800,volume=0.16[a2];[a0][a1][a2]amix=inputs=3:normalize=0,afade=t=in:st=0:d=2,afade=t=out:st=39:d=3,alimiter=limit=0.85,loudnorm=I=-20:LRA=6:TP=-2,pan=stereo|c0=c0|c1=c0[out]" `
  -map "[out]" -ar 48000 -ac 2 -c:a pcm_s16le `
  "public/media/video/kdo-ambient-bed.wav"
```

- [ ] **Step 2: Verify duration and loudness**

Run:

```powershell
powershell -ExecutionPolicy Bypass -File video-production/scripts/build-audio.ps1
ffprobe -v error -show_entries format=duration:stream=sample_rate,channels -of json public/media/video/kdo-ambient-bed.wav
ffmpeg -hide_banner -i public/media/video/kdo-ambient-bed.wav -af loudnorm=I=-20:LRA=6:TP=-2:print_format=summary -f null NUL
```

Expected:

- duration is 42 seconds within ±0.05 seconds,
- sample rate is 48000,
- channels is 2,
- true peak is no higher than -2 dBTP.

- [ ] **Step 3: Add the audio track and commit the script**

Add:

```tsx
<Audio src={staticFile('media/video/kdo-ambient-bed.wav')} volume={0.86} />
```

The WAV stays ignored by Git. Commit:

```powershell
git add video-production/scripts/build-audio.ps1 video-production/src/KdoBrandFilm.tsx
git commit -m "Add restrained KDO film sound design"
```

---

### Task 6: Render, verify, and deliver both masters

**Files:**
- Create: `video-production/scripts/verify-render.ps1`
- Create: `video-production/QA.md`
- Output: `video-production/render/kdo-brand-film-vertical.mp4`
- Output: `video-production/render/kdo-brand-film-horizontal.mp4`

**Interfaces:**
- `verify-render.ps1` accepts `-Vertical` and `-Horizontal` file paths.
- Produces `VIDEO_RENDER_CHECK=PASS`.

- [ ] **Step 1: Implement render verification**

The script must verify:

```powershell
param(
  [Parameter(Mandatory=$true)][string]$Vertical,
  [Parameter(Mandatory=$true)][string]$Horizontal
)

function Test-Render([string]$Path, [int]$Width, [int]$Height) {
  if (-not (Test-Path -LiteralPath $Path)) { throw "Missing render: $Path" }
  $probe = ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json $Path | ConvertFrom-Json
  $video = $probe.streams | Where-Object { $_.width }
  if ($video.codec_name -ne 'h264') { throw "Expected H.264: $Path" }
  if ($video.width -ne $Width -or $video.height -ne $Height) { throw "Unexpected dimensions: $Path" }
  if ($video.r_frame_rate -ne '24/1') { throw "Unexpected frame rate: $Path" }
  $duration = [double]$probe.format.duration
  if ([math]::Abs($duration - 42) -gt 0.15) { throw "Unexpected duration: $Path" }
}

Test-Render -Path $Vertical -Width 1080 -Height 1920
Test-Render -Path $Horizontal -Width 1920 -Height 1080
'VIDEO_RENDER_CHECK=PASS'
```

- [ ] **Step 2: Render both masters**

Run:

```powershell
npm run video:render:vertical
npm run video:render:horizontal
```

Expected: both commands exit 0 and produce the two MP4 files.

- [ ] **Step 3: Run automated render checks**

Run:

```powershell
powershell -ExecutionPolicy Bypass -File video-production/scripts/verify-render.ps1 `
  -Vertical video-production/render/kdo-brand-film-vertical.mp4 `
  -Horizontal video-production/render/kdo-brand-film-horizontal.mp4
```

Expected: `VIDEO_RENDER_CHECK=PASS`.

- [ ] **Step 4: Produce contact sheets and inspect all scenes**

Use FFmpeg to extract a 4 × 3 contact sheet from each master at 3.5-second intervals. Inspect:

- text safe areas,
- missing or stretched media,
- AI artifacts,
- case-source labels,
- CTA readability,
- color and exposure continuity.

Record pass/fail and corrections in `video-production/QA.md`.

- [ ] **Step 5: Copy user-facing deliverables**

Copy to:

```text
C:\Users\Administrator\Documents\Codex\2026-07-16\company-review\outputs\凯迪欧品牌短片_竖版_1080x1920.mp4
C:\Users\Administrator\Documents\Codex\2026-07-16\company-review\outputs\凯迪欧品牌短片_官网横版_1920x1080.mp4
C:\Users\Administrator\Documents\Codex\2026-07-16\company-review\outputs\凯迪欧品牌短片_制作与来源说明.md
```

- [ ] **Step 6: Run final repository and artifact checks**

Run:

```powershell
npm test
npm run build
npx vitest run video-production/src
git diff --check
git status --short
```

Expected:

- all project tests pass,
- the website build exits 0,
- all video tests pass,
- `git diff --check` reports no whitespace errors,
- final MP4 files remain outside Git.

- [ ] **Step 7: Commit production source and QA**

```powershell
git add package.json package-lock.json .gitignore video-production public/media/video
git commit -m "Deliver KDO premium brand film production"
```

