import type { ImgHTMLAttributes } from 'react';

import type { Locale } from '../app/site-content';
import { assetPath } from '../app/deployment';
import { getMedia, type MediaId } from '../app/media-content';

type CaptionMode = 'visible' | 'overlay' | 'hidden';

interface MediaFigureProps {
  readonly mediaId: MediaId;
  readonly locale: Locale;
  readonly priority?: boolean;
  readonly className?: string;
  readonly captionMode?: CaptionMode;
}

export function MediaFigure({
  mediaId,
  locale,
  priority = false,
  className,
  captionMode = 'visible',
}: MediaFigureProps) {
  const media = getMedia(mediaId);
  const fetchPriority: ImgHTMLAttributes<HTMLImageElement>['fetchPriority'] = priority ? 'high' : 'auto';

  return (
    <figure
      className={['media-figure', `media-figure--${captionMode}`, className].filter(Boolean).join(' ')}
      data-media-id={mediaId}
    >
      <img
        src={assetPath(media.src)}
        width={media.width}
        height={media.height}
        alt={media.alt[locale]}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={fetchPriority}
        data-media-provenance={media.provenance}
        data-media-role={media.role}
      />
      {captionMode !== 'hidden' ? <figcaption>{media.caption[locale]}</figcaption> : null}
    </figure>
  );
}
