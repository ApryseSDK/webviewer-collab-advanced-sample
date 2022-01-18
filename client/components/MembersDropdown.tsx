import React from 'react';
import { Menu, Text } from 'grommet';
import { User } from '@pdftron/collab-client';

export type MembersDropdownProps = {
  members: User[];
};

export default ({ members }: MembersDropdownProps) => {
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
        label: <Text size="small">{member.userName || member.email}</Text>,
      }))}
    />
  );
};
