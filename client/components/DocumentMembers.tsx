import React from 'react';
import { Menu, Text } from 'grommet';
import { User } from '@pdftron/collab-client';
import DocText from './DocText';

export type MembersDropdownProps = {
  members: User[];
};

export default ({ members }: MembersDropdownProps) => {
  return (
    <Menu
      label={
        <DocText link="/api/client/classes/Document.html#getMembers">
          <Text size="small">{members.length} members</Text>
        </DocText>
      }
      size="small"
      dropAlign={{
        right: 'right',
        top: 'top',
      }}
      items={members.map((member) => ({
        label: <Text size="small">{member.userName || member.email}</Text>,
      }))}
    />
  );
};
