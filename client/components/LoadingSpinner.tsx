import React, { CSSProperties, useMemo } from 'react';
import { BounceLoader } from 'react-spinners';
import { Box } from 'grommet';

export type LoadingSpinnerProps = {
  showBackground?: boolean;
  style?: CSSProperties;
};

export default ({ showBackground = false, style = {} }: LoadingSpinnerProps) => {
  const inner = useMemo(() => {
    return (
      <Box justify="center" align="center" style={style}>
        <BounceLoader color="#6FFFB0" />
      </Box>
    );
  }, []);

  if (showBackground) {
    return (
      <Box
        justify="center"
        align="center"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.7)',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 999999,
        }}
      >
        {inner}
      </Box>
    );
  }

  return inner;
};
