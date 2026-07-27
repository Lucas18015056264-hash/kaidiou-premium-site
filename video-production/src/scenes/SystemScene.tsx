import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

import { BRAND } from '../brand-system';
import type { FilmFormat } from '../KdoBrandFilm';
import { SceneFrame } from '../components/SceneFrame';
import { PRODUCTS } from '../timeline-data';

export const SystemScene = ({ format }: { format: FilmFormat }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      background={BRAND.colors.mineral}
      format={format}
      sceneNumber={5}
      padded={false}
    >
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(135deg, #F2F0E8 0%, #E6E5DC 68%, rgba(47,110,79,0.16) 100%)',
        }}
      />
      <div
        style={{
          color: BRAND.colors.graphite,
          left: format === 'vertical' ? 72 : 96,
          position: 'absolute',
          top: format === 'vertical' ? 220 : 92,
          zIndex: 5,
        }}
      >
        <div
          style={{
            color: BRAND.colors.kdoGreen,
            fontFamily: BRAND.fonts.body,
            fontSize: format === 'vertical' ? 21 : 18,
            fontWeight: 700,
            letterSpacing: '0.17em',
          }}
        >
          FLOORING SYSTEMS
        </div>
        <div
          style={{
            fontFamily: BRAND.fonts.display,
            fontSize: format === 'vertical' ? 64 : 70,
            fontWeight: 520,
            letterSpacing: '-0.035em',
            lineHeight: 1.2,
            marginTop: 18,
          }}
        >
          从标线与色彩
          <br />
          到连续地坪系统
        </div>
      </div>
      <div
        style={{
          bottom: format === 'vertical' ? 205 : 82,
          display: 'grid',
          gap: format === 'vertical' ? 16 : 18,
          gridTemplateColumns:
            format === 'vertical' ? 'repeat(2, minmax(0, 1fr))' : 'repeat(5, minmax(0, 1fr))',
          left: format === 'vertical' ? 72 : 96,
          position: 'absolute',
          right: format === 'vertical' ? 72 : 96,
          top: format === 'vertical' ? 560 : 350,
        }}
      >
        {PRODUCTS.map((product, index) => {
          const appear = interpolate(frame, [10 + index * 5, 28 + index * 5], [0, 1], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={product.name}
              style={{
                alignItems: 'center',
                background: 'rgba(255,255,255,0.58)',
                borderBottom: `3px solid ${
                  index === 0
                    ? BRAND.colors.safety
                    : index === 1
                      ? BRAND.colors.kdoGreen
                      : '#B9BBB2'
                }`,
                display: 'flex',
                flexDirection: format === 'vertical' ? 'row' : 'column',
                gridColumn:
                  format === 'vertical' && index === PRODUCTS.length - 1 ? '1 / -1' : undefined,
                justifyContent: 'center',
                opacity: appear,
                padding: format === 'vertical' ? '14px 20px' : '20px 12px 18px',
                transform: `translateY(${(1 - appear) * 24}px)`,
              }}
            >
              <Img
                src={staticFile(product.image)}
                style={{
                  filter: 'drop-shadow(0 15px 18px rgba(17,20,17,0.15))',
                  height: format === 'vertical' ? 150 : 240,
                  objectFit: 'contain',
                  width: format === 'vertical' ? 170 : '100%',
                }}
              />
              <div
                style={{
                  color: BRAND.colors.graphite,
                  fontFamily: BRAND.fonts.body,
                  fontSize: format === 'vertical' ? 21 : 19,
                  fontWeight: 650,
                  lineHeight: 1.35,
                  marginLeft: format === 'vertical' ? 8 : 0,
                  marginTop: format === 'vertical' ? 0 : 10,
                  textAlign: 'center',
                }}
              >
                {product.name}
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
