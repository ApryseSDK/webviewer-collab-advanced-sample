import React, { ReactNode } from 'react';
import { Layer, Box } from 'grommet';
import LoadingSpinner from './LoadingSpinner';

export type ModalProps = {
  onExit?: (b: boolean) => void;
  loading?: boolean;
  children: ReactNode;
  width?: string;
};

export default ({ onExit, loading = false, children, width = '400px' }: ModalProps) => {
  return (
    <Layer onClickOutside={() => onExit?.(false)} animation="none">
      {loading && <LoadingSpinner showBackground />}

      <Box width={width} background="light-1" pad="medium">
        {children}
      </Box>
    </Layer>
  );
};
