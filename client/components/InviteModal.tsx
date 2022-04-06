import React, { useCallback, useState } from 'react';
import Modal from './Modal';
import InviteList from './InviteList';
import { toast } from 'react-toastify';
import { Box, Button, Text } from 'grommet';
import { useCurrentDocument } from '@pdftron/collab-react';

export type InviteModalProps = {
  onExit: () => void;
};

export default ({ onExit }: InviteModalProps) => {
  const document = useCurrentDocument();
  const [success, setSuccess] = useState(false);
  const submit = useCallback(
    async (list) => {
      if (list.length === 0) {
        toast.error('You must invite at least one user');
        onExit();
        return;
      }
      try {
        await document.inviteUsers(list);
        setSuccess(true);
      } catch (e) {
        toast.error('Error: No permission or user is already invited.');
      }
    },
    [document]
  );

  return (
    <Modal onExit={onExit}>
      {success ? (
        <Box>
          <Text textAlign="center">Success!</Text>
          <Text size="small" margin={{ top: '20px' }}>
            If the user(s) you invited do not have an account, they will be added to this document
            once they create one with the same email.
          </Text>
          <Button primary margin={{ top: '20px' }} label="Close" onClick={onExit} />
        </Box>
      ) : (
        <InviteList onSubmit={submit} />
      )}
    </Modal>
  );
};
