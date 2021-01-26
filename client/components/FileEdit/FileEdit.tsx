import React, { useCallback, useState } from 'react';
import { Box, Form, FormField, TextInput, Button, CheckBox } from 'grommet';
import { useSelector } from 'react-redux';
import { getClient } from '../../redux/viewer';
import Modal from '../Modal';
import CollabClient from '@pdftron/collab-client';

export default ({ onExit, document }) => {
  const client: CollabClient = useSelector(getClient);
  const [loading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(document?.isPublic);

  const onSubmit = useCallback(
    async (event) => {
      setIsLoading(true);
      const { name, isPublic } = event.value;
      await client.editDocument(document.id, {
        name,
        isPublic,
      });
      setIsLoading(false);
      onExit?.(false);
    },
    [document]
  );

  return (
    <Modal onExit={onExit} loading={loading}>
      <Form onSubmit={onSubmit}>
        <FormField htmlFor="file-name" label="Document name">
          <TextInput id="file-name" name="name" defaultValue={document?.name} />
        </FormField>

        <FormField htmlFor="" label="Is Public?">
          <CheckBox
            id="is-public"
            name="isPublic"
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
          />
        </FormField>

        <Button
          type="submit"
          label="Save changes"
          primary
          margin={{ top: 'medium' }}
          style={{ width: '100%' }}
        />
      </Form>
    </Modal>
  );
};
