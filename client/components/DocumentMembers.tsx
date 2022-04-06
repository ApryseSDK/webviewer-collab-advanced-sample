import React, { useEffect, useState } from 'react';
import { Menu, Text } from 'grommet';
import { User } from '@pdftron/collab-client';
import DocText from './DocText';
import { useClient, useCurrentDocument } from '@pdftron/collab-react';

export default () => {
  const [members, setMembers] = useState<User[]>([]);
  const currentDocument = useCurrentDocument();
  const client = useClient();

  useEffect(() => {
    (async () => {
      if (currentDocument) {
        const members = await currentDocument.getMembers();
        setMembers(members);
      }
    })();
  }, [currentDocument]);

  useEffect(() => {
    return client.EventManager.subscribe('documentChanged', async (document) => {
      if (document.id === currentDocument.id) {
        const members = await currentDocument.getMembers();
        setMembers(members);
      }
    });
  }, []);

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
