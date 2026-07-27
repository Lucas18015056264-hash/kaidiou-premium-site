import type { CSSProperties } from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';

import { BRAND } from '../brand-system';
import type { FilmFormat } from '../KdoBrandFilm';

type EditorialTypeProps = {
  eyebrow: string;
  headline: string;
  supporting?: string;
  format: FilmFormat;
  align?: CSSProperties['textAlign'];
  inverse?: boolean;
};

export const EditorialType = ({
  eyebrow,
  headline,
  supporting,
  format,
  align = 'left',
  inverse = true,
}: EditorialTypeProps) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 14], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, 18], [28, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const foreground = inverse ? BRAND.colors.mineral : BRAND.colors.graphite;

  return (
    <div
      style={{
        color: foreground,
        opacity,
        textAlign: align,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          color: inverse ? BRAND.colors.safety : BRAND.colors.kdoGreen,
          fontFamily: BRAND.fonts.body,
          fontSize: format === 'vertical' ? 22 : 20,
          fontWeight: 600,
          letterSpacing: '0.16em',
          lineHeight: 1.2,
          marginBottom: format === 'vertical' ? 24 : 20,
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontFamily: BRAND.fonts.display,
          fontSize: format === 'vertical' ? 70 : 78,
          fontWeight: 500,
          letterSpacing: '-0.025em',
          lineHeight: 1.12,
          maxWidth: format === 'vertical' ? 860 : 790,
          textWrap: 'balance',
        }}
      >
        {headline}
      </div>
      {supporting ? (
        <div
          style={{
            color: inverse ? BRAND.colors.mist : '#4E554F',
            fontFamily: BRAND.fonts.body,
            fontSize: format === 'vertical' ? 28 : 26,
            letterSpacing: '0.01em',
            lineHeight: 1.55,
            marginTop: format === 'vertical' ? 28 : 24,
            maxWidth: format === 'vertical' ? 810 : 720,
          }}
        >
          {supporting}
        </div>
      ) : null}
    </div>
  );
};
