import { AbsoluteFill, Sequence } from 'remotion';

import { EditorialType } from './components/EditorialType';
import { MediaPanel } from './components/MediaPanel';
import { SceneFrame } from './components/SceneFrame';
import { BRAND } from './brand-system';
import { SCENES } from './timeline-data';

export type FilmFormat = 'vertical' | 'horizontal';

const fallbackMedia = [
  'media/v2/company-factory.webp',
  'media/v2/product-colorant.webp',
  'media/v2/product-marking.webp',
  'media/v3/case-wanda-garage.jpg',
  'media/v2/pack-colored-sand.webp',
  'media/v3/case-wanda-garage.jpg',
] as const;

export const KdoBrandFilm = ({ format }: { format: FilmFormat }) => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.colors.graphite }}>
      {SCENES.map((scene, index) => {
        const from = cursor;
        cursor += scene.durationInFrames;

        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={scene.durationInFrames}
            premountFor={24}
          >
            <SceneFrame format={format} sceneNumber={index + 1} padded={false}>
              <MediaPanel
                src={fallbackMedia[index]}
                fit={index === 4 ? 'contain' : 'cover'}
                overlay={index === 5 ? 0.68 : 0.28}
              />
              <div
                style={{
                  alignItems: format === 'vertical' ? 'flex-end' : 'center',
                  display: 'flex',
                  inset: 0,
                  padding:
                    format === 'vertical'
                      ? '0 72px 240px'
                      : '72px 96px',
                  position: 'absolute',
                  zIndex: 10,
                }}
              >
                <EditorialType
                  eyebrow={scene.eyebrow}
                  format={format}
                  headline={scene.headline}
                  supporting={index === 0 ? '工业地坪材料与低饱和色彩系统' : undefined}
                />
              </div>
            </SceneFrame>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
