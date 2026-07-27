import type { PropsWithChildren } from 'react';
import { AbsoluteFill } from 'remotion';

import { BRAND, safeAreaFor } from '../brand-system';
import type { FilmFormat } from '../KdoBrandFilm';
import { FilmGrain } from './FilmGrain';

type SceneFrameProps = PropsWithChildren<{
  format: FilmFormat;
  sceneNumber: number;
  background?: string;
  padded?: boolean;
}>;

export const SceneFrame = ({
  children,
  format,
  sceneNumber,
  background = BRAND.colors.graphite,
  padded = true,
}: SceneFrameProps) => {
  const safeArea = safeAreaFor(format);

  return (
    <AbsoluteFill
      style={{
        background,
        color: BRAND.colors.mineral,
        fontFamily: BRAND.fonts.body,
        overflow: 'hidden',
        padding: padded
          ? `${safeArea.top}px ${safeArea.right}px ${safeArea.bottom}px ${safeArea.left}px`
          : 0,
      }}
    >
      <div
        style={{
          borderTop: `2px solid ${BRAND.colors.safety}`,
          color:
            background === BRAND.colors.mineral
              ? BRAND.colors.graphite
              : BRAND.colors.mist,
          fontSize: format === 'vertical' ? 18 : 16,
          left: padded ? safeArea.left : format === 'vertical' ? 72 : 96,
          letterSpacing: '0.14em',
          paddingTop: 10,
          position: 'absolute',
          top: padded ? 76 : format === 'vertical' ? 76 : 40,
          width: format === 'vertical' ? 120 : 132,
          zIndex: 20,
        }}
      >
        {String(sceneNumber).padStart(2, '0')} / 06
      </div>
      {children}
      <FilmGrain />
    </AbsoluteFill>
  );
};
