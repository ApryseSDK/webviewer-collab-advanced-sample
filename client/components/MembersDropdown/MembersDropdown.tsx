import React from 'react';
import { Menu, Text } from 'grommet';

export default ({ members }) => {
  return (
    <Menu
      label={<Text size="small">{members.length} members</Text>}
      size="small"
      dropAlign={{
        right: 'right',
        top: 'top',
      }}
      margin={{ right: 'small' }}
      items={members.map((member) => ({
        label: <Text size="small">{member.user.userName || member.user.email}</Text>,
      }))}
    />
  );
};
