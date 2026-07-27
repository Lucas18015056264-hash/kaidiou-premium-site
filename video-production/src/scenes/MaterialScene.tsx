import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

import { BRAND } from '../brand-system';
import type { FilmFormat } from '../KdoBrandFilm';
import { MediaPanel } from '../components/MediaPanel';
import { SceneFrame } from '../components/SceneFrame';

const materialWords = ['材料 MATERIAL', '色彩 COLOR', '表面 SURFACE'] as const;

export const MaterialScene = ({ format }: { format: FilmFormat }) => {
  const frame = useCurrentFrame();
  const title = interpolate(frame, [10, 34], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneFrame format={format} sceneNumber={2} padded={false}>
      <MediaPanel
        kind="video"
        overlay={0.32}
        scaleFrom={1.01}
        scaleTo={1.045}
        src="media/video/ai-material-flow.mp4"
      />
      <AbsoluteFill
        style={{
          background:
            format === 'vertical'
              ? 'linear-gradient(180deg, rgba(17,20,17,0.14) 0%, rgba(17,20,17,0.03) 42%, rgba(17,20,17,0.88) 100%)'
              : 'linear-gradient(90deg, rgba(17,20,17,0.82) 0%, rgba(17,20,17,0.18) 54%, rgba(17,20,17,0.06) 100%)',
        }}
      />
      <div
        style={{
          left: format === 'vertical' ? 72 : 96,
          opacity: title,
          position: 'absolute',
          top: format === 'vertical' ? 350 : 220,
          transform: `translateX(${(1 - title) * -28}px)`,
        }}
      >
        <div
          style={{
            color: BRAND.colors.safety,
            fontFamily: BRAND.fonts.body,
            fontSize: format === 'vertical' ? 21 : 19,
            fontWeight: 650,
            letterSpacing: '0.18em',
            marginBottom: 24,
          }}
        >
          MATERIAL / COLOR / SURFACE
        </div>
        <div
          style={{
            color: BRAND.colors.mineral,
            fontFamily: BRAND.fonts.display,
            fontSize: format === 'vertical' ? 80 : 88,
            fontWeight: 500,
            letterSpacing: '-0.035em',
            lineHeight: 1.08,
          }}
        >
          材料、色彩
          <br />
          与表面
        </div>
      </div>
      <div
        style={{
          bottom: format === 'vertical' ? 250 : 78,
          display: 'grid',
          gap: 12,
          gridTemplateColumns:
            format === 'vertical' ? '1fr' : 'repeat(3, minmax(0, 1fr))',
          left: format === 'vertical' ? 72 : 96,
          position: 'absolute',
          right: format === 'vertical' ? 72 : 96,
        }}
      >
        {materialWords.map((word, index) => {
          const item = interpolate(frame, [32 + index * 8, 50 + index * 8], [0, 1], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={word}
              style={{
                backdropFilter: 'blur(12px)',
                background: 'rgba(17,20,17,0.48)',
                borderTop: `2px solid ${
                  [BRAND.colors.kdoGreen, BRAND.colors.safety, BRAND.colors.oxidized][index]
                }`,
                color: BRAND.colors.mineral,
                fontFamily: BRAND.fonts.body,
                fontSize: format === 'vertical' ? 24 : 20,
                letterSpacing: '0.12em',
                opacity: item,
                padding: format === 'vertical' ? '20px 22px' : '17px 20px',
                transform: `translateY(${(1 - item) * 18}px)`,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
      <div
        style={{
          bottom: format === 'vertical' ? 170 : 30,
          color: 'rgba(242,240,232,0.62)',
          fontFamily: BRAND.fonts.body,
          fontSize: format === 'vertical' ? 18 : 15,
          left: format === 'vertical' ? 72 : 96,
          letterSpacing: '0.04em',
          position: 'absolute',
        }}
      >
        AI 概念材料镜头 · 不代表具体产品工艺或检测结果
      </div>
    </SceneFrame>
  );
};
