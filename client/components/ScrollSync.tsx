import { Box, Button, Menu, Text } from 'grommet';
import DocText from './DocText';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollSyncSession } from '@pdftron/collab-client';
import { useClient } from '../context/client';
import { useCurrentDocument } from '../context/document';

export default function ScrollSync() {
  const client = useClient();
  const { document: currentDocument } = useCurrentDocument();

  const [activeScrollSyncSession, setScrollSync] = useState<ScrollSyncSession | null>(null);
  const [scrollSyncSessions, setScrollSyncSessions] = useState<ScrollSyncSession[]>([]);

  const inScrollSync = !!activeScrollSyncSession;
  const canStartScrollSync = client?.ScrollSyncManager.canCreateSession;

  useEffect(() => {
    if (!client || !currentDocument) return;
    let scrollSyncStatusChangedUnsub = null;

    (async () => {
      const sessions = client.ScrollSyncManager.availableSessions;
      setScrollSyncSessions([...sessions]);

      scrollSyncStatusChangedUnsub = client.EventManager.subscribe(
        'scrollSyncSessionsChanged',
        (sessions) => {
          setScrollSyncSessions([...sessions]);
        }
      );
    })();

    return () => {
      setScrollSync(null);
      scrollSyncStatusChangedUnsub && scrollSyncStatusChangedUnsub();
    };
  }, [client, currentDocument]);

  const createScrollSync = useCallback(async () => {
    if (!currentDocument) return;
    const session = await currentDocument.createScrollSyncSession();
    setScrollSync(session);
  }, [currentDocument]);

  const joinScrollSync = useCallback(async (session: ScrollSyncSession) => {
    await session.join();
    setScrollSync(session);
  }, []);

  const leaveScrollSync = useCallback(async () => {
    await activeScrollSyncSession?.exit();
    setScrollSync(null);
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
