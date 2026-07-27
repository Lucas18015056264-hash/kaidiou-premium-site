import { AbsoluteFill } from 'remotion';

export type FilmFormat = 'vertical' | 'horizontal';

export const KdoBrandFilm = ({ format }: { format: FilmFormat }) => {
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        backgroundColor: '#111411',
        color: '#F2F0E8',
        display: 'flex',
        fontFamily: '"DengXian", "Microsoft YaHei UI", sans-serif',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: format === 'vertical' ? 54 : 64 }}>KDO / 凯迪欧</div>
    </AbsoluteFill>
  );
};
