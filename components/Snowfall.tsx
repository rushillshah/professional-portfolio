import React from 'react';
import ReactSnowfall from 'react-snowfall';

interface Props {
  density?: number;
  color?: string;
  zIndex?: number;
}

const Snowfall: React.FC<Props> = ({
  density = 160,
  color = '#ffffff',
  zIndex = 2,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
      }}
    >
      <ReactSnowfall
        snowflakeCount={density}
        color={color}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default Snowfall;
