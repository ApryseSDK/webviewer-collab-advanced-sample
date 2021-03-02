import React, { useCallback, useEffect } from 'react';
import Modal from '../Modal';
import InviteList from '../InviteList';
import { useSelector } from 'react-redux';
import { getClient } from '../../redux/viewer';
import { toast } from 'react-toastify';

export default ({ onExit, document }) => {
  const client = useSelector(getClient);
  let success = true;

  useEffect(() => {
    const unsub = client.subscribe('permissionError', (type, action) => {
      if (type === 'Document' && action === 'invite') {
        success = false;
      }
    });
    return () => {
      unsub();
    };
  }, [client, document]);

  const submit = useCallback(
    async (list) => {
      if (list.length === 0) {
        toast.error('You must invite at least one user');
        onExit();
        return;
      }
      await client.inviteUsersToDocument(document.id, list);
      if (success) {
        toast.success('Success!');
      } else {
        toast.error('Error: No permission or user is already invited.');
      }
      onExit();
    },
    [client, document]
  );

  return (
    <Modal onExit={onExit}>
      <InviteList onSubmit={submit} />
    </Modal>
  );
};
