import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

import { BRAND } from '../brand-system';
import type { FilmFormat } from '../KdoBrandFilm';
import { MediaPanel } from '../components/MediaPanel';
import { SceneFrame } from '../components/SceneFrame';
import { CTA } from '../timeline-data';

export const CtaScene = ({ format }: { format: FilmFormat }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [4, 24], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneFrame format={format} sceneNumber={6} padded={false}>
      <MediaPanel
        focalPoint="center 58%"
        overlay={0.8}
        scaleFrom={1.02}
        scaleTo={1.055}
        src="media/v3/case-wanda-garage.jpg"
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(135deg, rgba(17,20,17,0.94), rgba(17,20,17,0.68) 70%, rgba(47,110,79,0.56))',
        }}
      />
      <div
        style={{
          color: 'rgba(242,240,232,0.055)',
          fontFamily: BRAND.fonts.display,
          fontSize: format === 'vertical' ? 300 : 360,
          fontWeight: 700,
          letterSpacing: '-0.08em',
          lineHeight: 0.8,
          position: 'absolute',
          right: format === 'vertical' ? -20 : 70,
          top: format === 'vertical' ? 280 : 160,
        }}
      >
        KDO
      </div>
      <div
        style={{
          bottom: format === 'vertical' ? 220 : 76,
          left: format === 'vertical' ? 72 : 96,
          opacity: reveal,
          position: 'absolute',
          right: format === 'vertical' ? 72 : 96,
          top: format === 'vertical' ? 310 : 180,
          transform: `translateY(${(1 - reveal) * 26}px)`,
        }}
      >
        <div
          style={{
            color: BRAND.colors.safety,
            fontFamily: BRAND.fonts.body,
            fontSize: format === 'vertical' ? 21 : 18,
            fontWeight: 700,
            letterSpacing: '0.18em',
          }}
        >
          PROJECT DIALOGUE
        </div>
        <div
          style={{
            color: BRAND.colors.mineral,
            fontFamily: BRAND.fonts.display,
            fontSize: format === 'vertical' ? 66 : 76,
            fontWeight: 520,
            letterSpacing: '-0.035em',
            lineHeight: 1.25,
            marginTop: 25,
            maxWidth: format === 'vertical' ? 900 : 1400,
          }}
        >
          经销合作 / 工程选材 / 海外采购
        </div>
        <div
          style={{
            color: BRAND.colors.mist,
            fontFamily: BRAND.fonts.body,
            fontSize: format === 'vertical' ? 27 : 24,
            letterSpacing: '0.04em',
            marginTop: 24,
          }}
        >
          {CTA.support}
        </div>
        <div
          style={{
            borderTop: '1px solid rgba(242,240,232,0.28)',
            display: 'grid',
            gap: format === 'vertical' ? 32 : 50,
            gridTemplateColumns: format === 'vertical' ? '1fr' : 'repeat(2, max-content)',
            marginTop: format === 'vertical' ? 90 : 70,
            paddingTop: format === 'vertical' ? 40 : 32,
          }}
        >
          {[
            ['全国咨询', CTA.phone],
            ['官方网站', CTA.website],
          ].map(([label, value]) => (
            <div key={label}>
              <div
                style={{
                  color: BRAND.colors.safety,
                  fontFamily: BRAND.fonts.body,
                  fontSize: format === 'vertical' ? 17 : 15,
                  letterSpacing: '0.15em',
                  marginBottom: 10,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  color: BRAND.colors.mineral,
                  fontFamily: BRAND.fonts.display,
                  fontSize: format === 'vertical' ? 45 : 42,
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            bottom: 0,
            color: 'rgba(242,240,232,0.58)',
            fontFamily: BRAND.fonts.body,
            fontSize: format === 'vertical' ? 17 : 14,
            letterSpacing: '0.03em',
            position: 'absolute',
          }}
        >
          项目信息与图片依据凯迪欧公开资料整理 · 具体方案以正式技术沟通为准
        </div>
      </div>
    </SceneFrame>
  );
};
