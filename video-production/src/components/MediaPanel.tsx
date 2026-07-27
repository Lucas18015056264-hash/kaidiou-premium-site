import type { CSSProperties } from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type MediaPanelProps = {
  src: string;
  kind?: 'image' | 'video';
  fit?: CSSProperties['objectFit'];
  focalPoint?: string;
  overlay?: number;
  scaleFrom?: number;
  scaleTo?: number;
};

export const MediaPanel = ({
  src,
  kind = 'image',
  fit = 'cover',
  focalPoint = 'center',
  overlay = 0.18,
  scaleFrom = 1.02,
  scaleTo = 1.08,
}: MediaPanelProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [scaleFrom, scaleTo], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const mediaStyle: CSSProperties = {
    height: '100%',
    objectFit: fit,
    objectPosition: focalPoint,
    transform: `scale(${scale})`,
    width: '100%',
  };

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {kind === 'video' ? (
        <OffthreadVideo muted src={staticFile(src)} style={mediaStyle} />
      ) : (
        <Img src={staticFile(src)} style={mediaStyle} />
      )}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(17,20,17,0.02) 0%, rgba(17,20,17,0.2) 58%, rgba(17,20,17,0.82) 100%)',
          opacity: overlay,
        }}
      />
    </AbsoluteFill>
  );
};
