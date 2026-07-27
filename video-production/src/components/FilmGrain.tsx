import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const FilmGrain = () => {
  const frame = useCurrentFrame();
  const offset = frame % 4;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: [
          'radial-gradient(circle at 18% 27%, rgba(255,255,255,0.2) 0 0.6px, transparent 0.8px)',
          'radial-gradient(circle at 77% 63%, rgba(255,255,255,0.18) 0 0.5px, transparent 0.8px)',
          'radial-gradient(circle at 42% 82%, rgba(0,0,0,0.25) 0 0.7px, transparent 0.9px)',
        ].join(','),
        backgroundPosition: `${offset * 7}px ${offset * -5}px, ${offset * -6}px ${offset * 4}px, 0 0`,
        backgroundSize: '17px 19px, 23px 29px, 31px 37px',
        mixBlendMode: 'soft-light',
        opacity: 0.035,
        pointerEvents: 'none',
      }}
    />
  );
};
