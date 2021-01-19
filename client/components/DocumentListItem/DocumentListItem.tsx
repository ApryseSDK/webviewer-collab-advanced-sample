import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentDocument } from '../../redux/documents';
import { getClient } from '../../redux/viewer';
import { Text, Box } from 'grommet';
import { Link } from 'react-router-dom';
import CollabClient from '@pdftron/collab-client';

export default ({ document }) => {
  const currentDocument = useSelector(getCurrentDocument);
  const client: CollabClient = useSelector(getClient);
  const active = document.id === currentDocument?.id;
  const unreadCount = client.getUnreadCountForDocument(document) || 0;
  const isUnread = unreadCount > 0;

  return (
    <Box key={document.id} style={{ position: 'relative' }}>
      <Link
        to={`/view/${document.id}`}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        <Box
          background={active ? 'accent-1' : ''}
          direction="row"
          pad="5px"
          style={{ borderRadius: '4px' }}
          margin={{ bottom: 'xsmall' }}
        >
          <Box basis="full" pad={{ right: 'small' }}>
            <Text
              size="small"
              weight={isUnread ? 'bold' : 'normal'}
              color={active ? 'neutral-2' : 'light-1'}
              truncate
            >
              {document.name || document.id}
            </Text>
          </Box>
          <Box
            width="20px"
            height="20px"
            background="accent-4"
            style={{
              borderRadius: '50%',
              minWidth: '20px',
              visibility: isUnread ? 'visible' : 'hidden',
            }}
          >
            <Text size="small" weight="bold" textAlign="center">
              {unreadCount}
            </Text>
          </Box>
        </Box>
      </Link>
    </Box>
  );
};
