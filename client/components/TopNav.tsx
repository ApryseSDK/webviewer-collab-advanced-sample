import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Header, Text, Button, Box, Menu } from 'grommet';
import InviteModal from './InviteModal';
import FileEdit from './FileEdit';
import MembersDropdown from './MembersDropdown';
import { useHistory } from 'react-router-dom';
import { useCurrentDocument } from '../context/document';
import { useUser } from '../context/user';
import { useClient } from '../context/client';
import { ScrollSyncSession, User } from '@pdftron/collab-client';
import DocText from './DocText';

export default () => {
  const { document: currentDocument, setDocument: setCurrentDocument } = useCurrentDocument();
  const { user: currentUser } = useUser();
  const client = useClient();

  const [showFileEdit, setShowFileEdit] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeScrollSyncSession, setScrollSync] = useState<ScrollSyncSession | null>(null);
  const [scrollSyncSessions, setScrollSyncSessions] = useState<ScrollSyncSession[]>([]);
  const [members, setMembers] = useState<User[]>([]);

  const inScrollSync = !!activeScrollSyncSession;
  const canStartScrollSync = client?.ScrollSyncManager.canCreateSession;

  const history = useHistory();

  const isMember = useMemo(() => {
    if (!currentDocument || !currentUser) return null;
    return members.some((m) => m.id === currentUser.id);
  }, [currentUser, currentDocument, members]);

  useEffect(() => {
    (async () => {
      if (currentDocument) {
        const members = await currentDocument.getMembers();
        setMembers(members);

        return client.EventManager.subscribe('documentChanged', async (document) => {
          if (document.id === currentDocument.id) {
            const members = await currentDocument.getMembers();
            setMembers(members);
          }
        });
      }
    })();
  }, [currentDocument]);

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

  const joinDocument = useCallback(async () => {
    const doc = await currentUser.getDocument(currentDocument.id);
    const canJoin = await doc.canJoin();
    if (canJoin) {
      doc.join();
    }
  }, [currentUser, currentDocument]);

  const leaveDocument = useCallback(async () => {
    await currentDocument.leave();
    history.push('/view');
    setCurrentDocument(null);
  }, [currentDocument, history]);

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

  const markAllAnnotationsAsRead = useCallback(() => {
    currentDocument.markAllAnnotationsAsRead();
  }, [currentDocument]);

  return (
    <Header background="brand" pad={{ vertical: '0px', horizontal: 'small' }} height="44px">
      {currentDocument && <Text size="small">{currentDocument.name}</Text>}

      {currentDocument && currentDocument.isPublic && !isMember && (
        <Button label="Join document" primary size="small" onClick={joinDocument} />
      )}

      {isMember && (
        <>
          {showFileEdit && (
            <FileEdit onExit={() => setShowFileEdit(false)} document={currentDocument} />
          )}

          {showInviteModal && <InviteModal onExit={() => setShowInviteModal(false)} />}

          {currentDocument && (
            <Box direction="row" height="100%">
              <MembersDropdown members={members} />

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
                margin={{ right: 'small' }}
                items={scrollSyncSessions.map((session) => ({
                  label: (
                    <Text size="small">Join {session.leader.userName || session.leader.email}</Text>
                  ),
                  onClick: () => joinScrollSync(session),
                }))}
              />

              {canStartScrollSync && (
                <Button
                  label={
                    <DocText link="/docs/client/scroll-sync">Start scroll sync session</DocText>
                  }
                  secondary
                  size="small"
                  onClick={createScrollSync}
                  margin={{ left: 'xsmall', vertical: 'xsmall' }}
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

              <Menu
                label={<Text size="small">Options</Text>}
                // size="small"
                dropAlign={{
                  right: 'right',
                  top: 'top',
                }}
                margin={{ right: 'small' }}
                items={[
                  isMember
                    ? {
                        label: (
                          <DocText link="/api/client/classes/Document.html#leave">
                            Leave document
                          </DocText>
                        ),
                        onClick: leaveDocument,
                      }
                    : undefined,
                  {
                    label: <DocText link="/docs/client/invites">Invite</DocText>,
                    onClick: () => setShowInviteModal(true),
                  },
                  {
                    label: <DocText link="/docs/client/editing-documents">Edit</DocText>,
                    onClick: () => setShowFileEdit(true),
                  },
                  {
                    label: (
                      <DocText link="/docs/client/annotations#mark-all-annotations-as-read">
                        Mark all as read
                      </DocText>
                    ),
                    onClick: markAllAnnotationsAsRead,
                  },
                ].filter((f) => !!f)}
              />
            </Box>
          )}
        </>
      )}
    </Header>
  );
};
