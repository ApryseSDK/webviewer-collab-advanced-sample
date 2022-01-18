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

export default () => {
  const { document: currentDocument, setDocument: setCurrentDocument } = useCurrentDocument();
  const { user: currentUser } = useUser();
  const client = useClient();

  const [showFileEdit, setShowFileEdit] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [scrollSyncAvailable, setScrollSyncAvailable] = useState(false);
  const [activeScrollSyncSession, setScrollSync] = useState<ScrollSyncSession | null>(null);
  const [scrollSyncSessions, setScrollSyncSessions] = useState<ScrollSyncSession[]>([]);
  const [members, setMembers] = useState<User[]>([]);

  const inScrollSync = !!activeScrollSyncSession;

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
      setScrollSyncAvailable(await client.ScrollSyncManager.canJoinSession);
      const sessions = client.ScrollSyncManager.availableSessions;
      setScrollSyncSessions(sessions);

      scrollSyncStatusChangedUnsub = client.EventManager.subscribe(
        'scrollSyncSessionsChanged',
        (sessions) => {
          setScrollSyncSessions(sessions);
        }
      );
    })();

    return () => {
      setScrollSyncAvailable(false);
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
                label={<Text size="small">{scrollSyncSessions.length} Sessions</Text>}
                size="small"
                dropAlign={{
                  right: 'right',
                  top: 'top',
                }}
                margin={{ right: 'small' }}
                items={scrollSyncSessions.map((session) => ({
                  label: (
                    <Text size="small">{session.leader.userName || session.leader.email}</Text>
                  ),
                  onclick: () => joinScrollSync(session),
                }))}
              />

              <Box direction="row" pad={{ vertical: 'xsmall' }}>
                {isMember && (
                  <Button label="Leave document" secondary size="small" onClick={leaveDocument} />
                )}

                {scrollSyncAvailable && inScrollSync && (
                  <Button
                    label="Leave scroll sync"
                    secondary
                    size="small"
                    onClick={leaveScrollSync}
                    margin={{ left: 'xsmall' }}
                  />
                )}

                <Button
                  onClick={() => setShowInviteModal(true)}
                  label="Invite"
                  primary
                  size="small"
                  margin={{ left: 'xsmall' }}
                />

                <Button
                  onClick={() => setShowFileEdit(true)}
                  label="Edit"
                  secondary
                  size="small"
                  margin={{ left: 'xsmall' }}
                />

                <Button
                  label="Mark all as Read"
                  primary
                  size="small"
                  onClick={markAllAnnotationsAsRead}
                  margin={{ left: 'xsmall' }}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </Header>
  );
};
