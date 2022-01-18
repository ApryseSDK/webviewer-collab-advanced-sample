import React, { useCallback } from 'react';
import Modal from './Modal';
import InviteList from './InviteList';
import { toast } from 'react-toastify';
import { useCurrentDocument } from '../context/document';

export type InviteModalProps = {
  onExit: () => void;
};

export default ({ onExit }: InviteModalProps) => {
  const { document } = useCurrentDocument();
  const submit = useCallback(
    async (list) => {
      if (list.length === 0) {
        toast.error('You must invite at least one user');
        onExit();
        return;
      }
      try {
        await document.inviteUsers(list);
        toast.success('Success!');
      } catch (e) {
        toast.error('Error: No permission or user is already invited.');
      }
      onExit();
    },
    [document]
  );

  return (
    <Modal onExit={onExit}>
      <InviteList onSubmit={submit} />
    </Modal>
  );
};
