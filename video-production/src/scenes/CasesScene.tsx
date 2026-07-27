import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from 'remotion';

import { BRAND } from '../brand-system';
import type { FilmFormat } from '../KdoBrandFilm';
import { MediaPanel } from '../components/MediaPanel';
import { SceneFrame } from '../components/SceneFrame';
import { OFFICIAL_CASES } from '../timeline-data';

const CaseShot = ({
  format,
  index,
}: {
  format: FilmFormat;
  index: number;
}) => {
  const frame = useCurrentFrame();
  const item = OFFICIAL_CASES[index];
  const reveal = interpolate(frame, [4, 22], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <MediaPanel
        focalPoint={format === 'vertical' ? 'center center' : 'center 56%'}
        overlay={0.38}
        scaleFrom={1.025}
        scaleTo={1.075}
        src={item.image}
      />
      <AbsoluteFill
        style={{
          background:
            format === 'vertical'
              ? 'linear-gradient(180deg, rgba(17,20,17,0.06), rgba(17,20,17,0.08) 45%, rgba(17,20,17,0.92) 100%)'
              : 'linear-gradient(90deg, rgba(17,20,17,0.84), rgba(17,20,17,0.28) 60%, rgba(17,20,17,0.05))',
        }}
      />
      <div
        style={{
          bottom: format === 'vertical' ? 250 : 102,
          left: format === 'vertical' ? 72 : 96,
          opacity: reveal,
          position: 'absolute',
          transform: `translateY(${(1 - reveal) * 24}px)`,
          width: format === 'vertical' ? 900 : 900,
          zIndex: 5,
        }}
      >
        <div
          style={{
            color: BRAND.colors.safety,
            fontFamily: BRAND.fonts.body,
            fontSize: format === 'vertical' ? 19 : 17,
            fontWeight: 700,
            letterSpacing: '0.16em',
            marginBottom: 19,
          }}
        >
          PUBLIC CASE RECORD · {String(index + 1).padStart(2, '0')} / 03
        </div>
        <div
          style={{
            color: BRAND.colors.mineral,
            fontFamily: BRAND.fonts.display,
            fontSize: format === 'vertical' ? 58 : 64,
            fontWeight: 520,
            letterSpacing: '-0.025em',
            lineHeight: 1.18,
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: 18,
            marginTop: 24,
          }}
        >
          <span
            style={{
              color: BRAND.colors.mineral,
              fontFamily: BRAND.fonts.display,
              fontSize: format === 'vertical' ? 34 : 32,
              fontWeight: 600,
            }}
          >
            {item.area}
          </span>
          <span
            style={{
              background: 'rgba(47,110,79,0.80)',
              color: BRAND.colors.mineral,
              fontFamily: BRAND.fonts.body,
              fontSize: format === 'vertical' ? 17 : 15,
              letterSpacing: '0.08em',
              padding: '9px 13px',
            }}
          >
            {item.label}
          </span>
        </div>
      </div>
      <div
        style={{
          bottom: format === 'vertical' ? 176 : 52,
          display: 'flex',
          gap: 8,
          left: format === 'vertical' ? 72 : 96,
          position: 'absolute',
        }}
      >
        {OFFICIAL_CASES.map((caseItem, caseIndex) => (
          <div
            key={caseItem.name}
            style={{
              background:
                caseIndex === index ? BRAND.colors.safety : 'rgba(242,240,232,0.32)',
              height: 4,
              width: caseIndex === index ? 82 : 34,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const CasesScene = ({ format }: { format: FilmFormat }) => (
  <SceneFrame format={format} sceneNumber={4} padded={false}>
    {OFFICIAL_CASES.map((caseItem, index) => (
      <Sequence
        key={caseItem.name}
        durationInFrames={96}
        from={index * 96}
        premountFor={12}
      >
        <CaseShot format={format} index={index} />
      </Sequence>
    ))}
  </SceneFrame>
);
