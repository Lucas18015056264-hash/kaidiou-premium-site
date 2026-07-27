import { Composition } from 'remotion';

import { KdoBrandFilm } from './KdoBrandFilm';
import { FILM_FPS, TOTAL_FRAMES } from './timeline-data';

export const RemotionRoot = () => {
  return (
    <>
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
    </>
  );
};
