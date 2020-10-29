import React, { useCallback } from 'react';
import Modal from '../Modal';
import InviteList from '../InviteList';
import { useSelector } from 'react-redux';
import { getClient } from '../../redux/viewer';
import { toast } from 'react-toastify';

export default ({
  onExit,
  document
}) => {

  const client = useSelector(getClient);

  const submit = useCallback(async (list) => {
    if (list.length === 0) {
      toast.error('You must invite at least one user')
      onExit();
      return;
    }
    await client.inviteUsersToDocument(document.id, list);
    toast.success('Success!');
    onExit();
  }, [client, document])

  return (
    <Modal onExit={onExit}>
      <InviteList onSubmit={submit} />
    </Modal>
  )

}