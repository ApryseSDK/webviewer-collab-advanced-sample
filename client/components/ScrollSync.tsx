import { Box, Button, Menu, Text } from 'grommet';
import DocText from './DocText';
import React, { useCallback } from 'react';
import { ScrollSyncSession } from '@pdftron/collab-client';
import {
  useClient,
  useCurrentDocument,
  useCurrentScrollSyncSession,
  useScrollSync,
} from '@pdftron/collab-react';

export default function ScrollSync() {
  const client = useClient();
  const currentDocument = useCurrentDocument();

  const scrollSyncSessions = useScrollSync();
  const activeScrollSyncSession = useCurrentScrollSyncSession();

  const inScrollSync = !!activeScrollSyncSession;
  const canStartScrollSync = client?.ScrollSyncManager.canCreateSession;

  const createScrollSync = useCallback(async () => {
    if (!currentDocument) return;
    await currentDocument.createScrollSyncSession();
  }, [currentDocument]);

  const joinScrollSync = useCallback(async (session: ScrollSyncSession) => {
    await session.join();
  }, []);

  const leaveScrollSync = useCallback(async () => {
    await activeScrollSyncSession?.exit();
  }, [activeScrollSyncSession]);

  return (
    <Box direction="row" align="center">
      <Menu
        label={
          <DocText link="/docs/client/scroll-sync#getting-available-scroll-sync-sessions">
            <Text size="small">{scrollSyncSessions.length} scroll sync sessions</Text>
          </DocText>
        }
        key={`scroll-${scrollSyncSessions.length}`}
        size="small"
        disabled={inScrollSync}
        dropAlign={{
          right: 'right',
          top: 'top',
        }}
        items={scrollSyncSessions.map((session) => ({
          label: <Text size="small">Join {session.leader.userName || session.leader.email}</Text>,
          onClick: () => joinScrollSync(session),
        }))}
      />

      {canStartScrollSync && (
        <Button
          label={<DocText link="/docs/client/scroll-sync">Start scroll sync session</DocText>}
          secondary
          size="small"
          onClick={createScrollSync}
          margin={{ vertical: 'xsmall' }}
        />
      )}

      {inScrollSync && (
        <Button
          label="Leave scroll sync"
          secondary
          size="small"
          onClick={leaveScrollSync}
          margin={{ left: 'xsmall', vertical: 'xsmall' }}
        />
      )}
    </Box>
  );
}
