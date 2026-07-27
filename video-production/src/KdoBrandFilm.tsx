import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';

import { BRAND } from './brand-system';
import { CasesScene } from './scenes/CasesScene';
import { CtaScene } from './scenes/CtaScene';
import { FlagshipScene } from './scenes/FlagshipScene';
import { MaterialScene } from './scenes/MaterialScene';
import { OpeningScene } from './scenes/OpeningScene';
import { SystemScene } from './scenes/SystemScene';
import { SCENES } from './timeline-data';

export type FilmFormat = 'vertical' | 'horizontal';

const sceneComponents = {
  opening: OpeningScene,
  material: MaterialScene,
  flagships: FlagshipScene,
  cases: CasesScene,
  system: SystemScene,
  cta: CtaScene,
} as const;

export const KdoBrandFilm = ({ format }: { format: FilmFormat }) => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.colors.graphite }}>
      <Audio src={staticFile('media/video/kdo-ambient-bed.wav')} volume={0.9} />
      {SCENES.map((scene) => {
        const from = cursor;
        cursor += scene.durationInFrames;
        const Scene = sceneComponents[scene.id];

        return (
          <Sequence
            key={scene.id}
            durationInFrames={scene.durationInFrames}
            from={from}
            premountFor={24}
          >
            <Scene format={format} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
