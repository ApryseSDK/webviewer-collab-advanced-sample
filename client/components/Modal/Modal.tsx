import React from 'react';
import { Layer, Box } from 'grommet';
import LoadingSpinner from '../LoadingSpinner';

export default ({ onExit, loading = false, children, width = '400px' }) => {
  return (
    <Layer onClickOutside={() => onExit?.(false)} animation="none">
      {loading && <LoadingSpinner showBackground />}

      <Box width={width} background="light-1" pad="medium">
        {children}
      </Box>
    </Layer>
  );
};
