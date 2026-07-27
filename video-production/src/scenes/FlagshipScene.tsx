import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';

import { BRAND } from '../brand-system';
import type { FilmFormat } from '../KdoBrandFilm';
import { SceneFrame } from '../components/SceneFrame';

const flagships = [
  {
    code: '01 / MARKING',
    name: '纳米硅划线漆',
    use: '面向停车、仓储与交通分区',
    image: 'media/v2/product-marking.webp',
    pack: 'media/v2/pack-marking.webp',
    accent: BRAND.colors.safety,
  },
  {
    code: '02 / COLORANT',
    name: '纳米硅着色剂',
    use: '从样板确认到空间色彩沟通',
    image: 'media/v2/product-colorant.webp',
    pack: 'media/v2/pack-colorant.webp',
    accent: BRAND.colors.kdoGreen,
  },
] as const;

export const FlagshipScene = ({ format }: { format: FilmFormat }) => {
  const frame = useCurrentFrame();

  return (
    <SceneFrame
      background={BRAND.colors.mineral}
      format={format}
      sceneNumber={3}
      padded={false}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 82% 10%, rgba(47,110,79,0.13), transparent 32%), #F2F0E8',
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
          FLAGSHIP MATERIALS
        </div>
        <div
          style={{
            fontFamily: BRAND.fonts.display,
            fontSize: format === 'vertical' ? 68 : 72,
            fontWeight: 520,
            letterSpacing: '-0.035em',
            marginTop: 18,
          }}
        >
          从标线与色彩开始
        </div>
      </div>
      <div
        style={{
          bottom: format === 'vertical' ? 210 : 72,
          display: 'grid',
          gap: format === 'vertical' ? 24 : 28,
          gridTemplateColumns: format === 'vertical' ? '1fr' : 'repeat(2, minmax(0, 1fr))',
          left: format === 'vertical' ? 72 : 96,
          position: 'absolute',
          right: format === 'vertical' ? 72 : 96,
          top: format === 'vertical' ? 470 : 280,
        }}
      >
        {flagships.map((product, index) => {
          const appear = interpolate(frame, [12 + index * 14, 38 + index * 14], [0, 1], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={product.name}
              style={{
                background: BRAND.colors.graphite,
                boxShadow: '0 30px 60px rgba(17,20,17,0.12)',
                minHeight: 0,
                opacity: appear,
                overflow: 'hidden',
                position: 'relative',
                transform: `translateY(${(1 - appear) * 34}px)`,
              }}
            >
              <Img
                src={staticFile(product.image)}
                style={{
                  height: format === 'vertical' ? '61%' : '62%',
                  objectFit: 'cover',
                  opacity: 0.88,
                  width: '100%',
                }}
              />
              <AbsoluteFill
                style={{
                  background:
                    'linear-gradient(180deg, rgba(17,20,17,0) 28%, rgba(17,20,17,0.92) 68%, #111411 100%)',
                }}
              />
              <Img
                src={staticFile(product.pack)}
                style={{
                  filter: 'drop-shadow(0 20px 24px rgba(0,0,0,0.32))',
                  height: format === 'vertical' ? 250 : 235,
                  objectFit: 'contain',
                  position: 'absolute',
                  right: format === 'vertical' ? 18 : 24,
                  top: format === 'vertical' ? 150 : 118,
                  width: format === 'vertical' ? 230 : 230,
                }}
              />
              <div
                style={{
                  bottom: format === 'vertical' ? 40 : 34,
                  left: format === 'vertical' ? 34 : 38,
                  position: 'absolute',
                  right: format === 'vertical' ? 34 : 280,
                  zIndex: 5,
                }}
              >
                <div
                  style={{
                    color: product.accent,
                    fontFamily: BRAND.fonts.body,
                    fontSize: format === 'vertical' ? 18 : 16,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                  }}
                >
                  {product.code}
                </div>
                <div
                  style={{
                    color: BRAND.colors.mineral,
                    fontFamily: BRAND.fonts.display,
                    fontSize: format === 'vertical' ? 48 : 44,
                    fontWeight: 520,
                    marginTop: 12,
                  }}
                >
                  {product.name}
                </div>
                <div
                  style={{
                    color: BRAND.colors.mist,
                    fontFamily: BRAND.fonts.body,
                    fontSize: format === 'vertical' ? 22 : 19,
                    lineHeight: 1.55,
                    marginTop: 11,
                  }}
                >
                  {product.use}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
