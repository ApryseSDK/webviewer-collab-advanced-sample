import React, { useCallback, useMemo, useState } from 'react';
import { Header, Text, Button, Box } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentDocument, setCurrentDocument } from '../../redux/documents';
import InviteModal from '../InviteModal';
import FileEdit from '../FileEdit';
import MembersDropdown from '../MembersDropdown';
import { getCurrentUser } from '../../redux/user';
import { getClient } from '../../redux/viewer';
import CollabClient from '@pdftron/collab-client';
import { useHistory } from 'react-router-dom';

export default () => {

  const currentDocument = useSelector(getCurrentDocument);
  const currentUser = useSelector(getCurrentUser);
  const [showFileEdit, setShowFileEdit] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const client: CollabClient = useSelector(getClient);
  const history = useHistory();
  const dispatch = useDispatch();

  const isMember = useMemo(() => {
    if (!currentDocument || !currentUser) return null;
    return currentDocument.members.some(member => member.user.id === currentUser.id);
  }, [currentUser, currentDocument])

  const joinDocument = useCallback(() => {
    client.joinDocument(currentDocument.id);
  }, [client, currentDocument]);

  const leaveDocument = useCallback(() => {
    client.leaveDocument(currentDocument.id);
    history.push('/view');
    dispatch(setCurrentDocument(null));
  }, [client, currentDocument, history]);

  return (
    <Header background='brand' pad={{ vertical: '0px', horizontal: 'small' }} height='44px'>
      {
        currentDocument &&
        <Text size='small'>{currentDocument.name}</Text>
      }

      {
        currentDocument && currentDocument.isPublic && !isMember &&
        <Button
          label='Join document'
          primary
          size='small'
          onClick={joinDocument}
        />
      }

      

      {
        showFileEdit &&
        <FileEdit
          onExit={() => setShowFileEdit(false)}
          document={currentDocument}
        />
      }

      {
        showInviteModal &&
        <InviteModal
          onExit={() => setShowInviteModal(false)}
          document={currentDocument}
        />
      }
      {
        currentDocument &&
        <Box direction='row' height='100%'>

          <MembersDropdown members={currentDocument.members} />

          <Box direction='row' pad={{ vertical: 'xsmall' }}>

            {
              isMember &&
              <Button
                label='Leave document'
                secondary
                size='small'
                onClick={leaveDocument}
              />
            }

            <Button
              onClick={() => setShowInviteModal(true)}
              label='Invite'
              primary
              size='small'
              margin={{left: 'xsmall'}}
            />

            <Button
              onClick={() => setShowFileEdit(true)}
              label='Edit'
              secondary
              size='small'
              margin={{left: 'xsmall'}}
            />
          </Box>

          
        </Box>
      }


    </Header>
  )
}