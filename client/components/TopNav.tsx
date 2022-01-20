import React, { useCallback, useEffect, useState } from 'react';
import { Header, Text, Button, Box, Menu } from 'grommet';
import InviteModal from './InviteModal';
import FileEdit from './FileEdit';
import DocumentMembers from './DocumentMembers';
import { useHistory } from 'react-router-dom';
import { useCurrentDocument } from '../context/document';
import { useUser } from '../context/user';
import DocText from './DocText';
import Snapshots from './Snapshots';
import ScrollSync from './ScrollSync';

const Divider = () => (
  <Box
    width="1px"
    height="20px"
    background={'white'}
    margin={{ vertical: 'xsmall', horizontal: 'small' }}
  />
);

export default () => {
  const { document: currentDocument, setDocument: setCurrentDocument } = useCurrentDocument();
  const { user: currentUser } = useUser();
  const [showFileEdit, setShowFileEdit] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isMember, setIsMember] = useState(false);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (!currentDocument || !currentUser) return;
      const isMember = await currentDocument.isMember();
      setIsMember(isMember);
    })();
  }, [currentDocument]);

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

  const markAllAnnotationsAsRead = useCallback(() => {
    currentDocument.markAllAnnotationsAsRead();
  }, [currentDocument]);

  return (
    <Header background="brand" pad={{ vertical: '0px', horizontal: 'small' }} direction="row" wrap>
      {currentDocument && <Text size="small">{currentDocument.name}</Text>}

      <Box flex={{ grow: 1 }} />

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
            <>
              <Snapshots />

              <Divider />

              <DocumentMembers />

              <Divider />

              <ScrollSync />

              <Divider />

              <Menu
                label={<Text size="small">Options</Text>}
                // size="small"
                dropAlign={{
                  right: 'right',
                  top: 'top',
                }}
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
            </>
          )}
        </>
      )}
    </Header>
  );
};
