import React, { useCallback, useState } from 'react';
import { Form, FormField, TextInput, Button, CheckBox } from 'grommet';
import Modal from './Modal';
import { Document } from '@pdftron/collab-client';

export type FileEditProps = {
  document: Document;
  onExit: (TODO: boolean) => void;
};

export default ({ onExit, document }: FileEditProps) => {
  const [loading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(document?.isPublic);

  const onSubmit = useCallback(
    async (event) => {
      setIsLoading(true);
      const { name, isPublic } = event.value;
      await document.edit({
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
