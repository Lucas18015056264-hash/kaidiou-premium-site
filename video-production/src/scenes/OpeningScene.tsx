import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

import { BRAND } from '../brand-system';
import type { FilmFormat } from '../KdoBrandFilm';
import { MediaPanel } from '../components/MediaPanel';
import { SceneFrame } from '../components/SceneFrame';

export const OpeningScene = ({ format }: { format: FilmFormat }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [6, 34], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneFrame format={format} sceneNumber={1} padded={false}>
      <MediaPanel
        focalPoint={format === 'vertical' ? '58% center' : 'center 58%'}
        overlay={0.62}
        scaleFrom={1.025}
        scaleTo={1.075}
        src="media/v2/company-factory.webp"
      />
      <AbsoluteFill
        style={{
          background:
            format === 'vertical'
              ? 'linear-gradient(180deg, rgba(17,20,17,0.08) 0%, rgba(17,20,17,0.12) 36%, rgba(17,20,17,0.94) 100%)'
              : 'linear-gradient(90deg, rgba(17,20,17,0.90) 0%, rgba(17,20,17,0.44) 52%, rgba(17,20,17,0.08) 100%)',
        }}
      />
      <div
        style={{
          color: 'rgba(242,240,232,0.08)',
          fontFamily: BRAND.fonts.display,
          fontSize: format === 'vertical' ? 290 : 360,
          fontWeight: 700,
          letterSpacing: '-0.08em',
          lineHeight: 0.8,
          position: 'absolute',
          right: format === 'vertical' ? -18 : 70,
          top: format === 'vertical' ? 260 : 130,
        }}
      >
        KDO
      </div>
      <div
        style={{
          bottom: format === 'vertical' ? 252 : 112,
          left: format === 'vertical' ? 72 : 96,
          maxWidth: format === 'vertical' ? 900 : 1040,
          opacity: reveal,
          position: 'absolute',
          transform: `translateY(${(1 - reveal) * 32}px)`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            color: BRAND.colors.safety,
            fontFamily: BRAND.fonts.body,
            fontSize: format === 'vertical' ? 21 : 19,
            fontWeight: 650,
            letterSpacing: '0.19em',
            marginBottom: 26,
          }}
        >
          KDO · INDUSTRIAL FLOORING MATERIALS
        </div>
        <div
          style={{
            color: BRAND.colors.mineral,
            fontFamily: BRAND.fonts.display,
            fontSize: format === 'vertical' ? 82 : 92,
            fontWeight: 500,
            letterSpacing: '-0.035em',
            lineHeight: 1.12,
          }}
        >
          <div>把颜色做进材料</div>
          <div>把秩序留在地面</div>
        </div>
        <div
          style={{
            borderLeft: `3px solid ${BRAND.colors.kdoGreen}`,
            color: BRAND.colors.mist,
            fontFamily: BRAND.fonts.body,
            fontSize: format === 'vertical' ? 28 : 25,
            letterSpacing: '0.025em',
            lineHeight: 1.6,
            marginTop: 34,
            paddingLeft: 20,
          }}
        >
          工业地坪材料与低饱和色彩系统
        </div>
      </div>
    </SceneFrame>
  );
};
