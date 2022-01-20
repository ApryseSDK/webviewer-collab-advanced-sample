import { Box, Text, Tip } from 'grommet';
import React, { CSSProperties, PropsWithChildren } from 'react';
import { AiFillInfoCircle } from 'react-icons/ai';

export type DocTextProps = {
  link: string;
  color?: string;
  style?: CSSProperties;
  passThrough?: boolean;
};

export default function DocText({
  children,
  link,
  color,
  style,
  passThrough,
}: PropsWithChildren<DocTextProps>) {
  if (passThrough) return <>{children}</>;
  return (
    <Box direction="row" as={'span'} align="center" style={style}>
      {children}

      <Tip content={<Text size="14px">Click here to see guides for this functionality</Text>}>
        <a
          href={`https://collaboration.pdftron.com${link}`}
          target="__blank"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Box>
            <AiFillInfoCircle color={color || 'white'} style={{ marginLeft: '4px' }} />
          </Box>
        </a>
      </Tip>
    </Box>
  );
}
