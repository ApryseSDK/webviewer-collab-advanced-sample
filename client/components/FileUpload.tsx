import React, { useEffect, useState, useMemo } from 'react';
import { Box, Text } from 'grommet';
import Uppy from '@uppy/core';
import { DragDrop } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import InviteList from './InviteList';
import Modal from './Modal';
import useRouting from '../hooks/useRouting';
import { uploadFile } from '../util/s3';
import { useUser } from '../context/user';
import { useCurrentDocument } from '../context/document';

export type FileUploadProps = {
  onExit: () => void;
};

export default ({ onExit }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File & { data: Blob }>();
  const { user } = useUser();
  const { setDocument } = useCurrentDocument();
  const [loading, setLoading] = useState(false);
  const { setViewPath } = useRouting();

  const createNewDocument = async (list: string[]) => {
    setLoading(true);

    if (selectedFile) {
      // @ts-ignore
      const { id } = await uploadFile(selectedFile.data, selectedFile.name);

      const document = await user.createDocument({
        document: selectedFile.data as Blob,
        name: selectedFile.name,
        id,
      });

      if (list && list.length) {
        await document.inviteUsers(list);
      }

      if (document) {
        setDocument(document);
      }

      setViewPath({
        documentId: id,
      });
    }

    setLoading(false);
    onExit();
  };

  const uppy = useMemo(() => {
    return Uppy().on('file-added', (file) => {
      setSelectedFile(file);
    });
  }, []);

  useEffect(() => {
    return () => uppy.close();
  }, []);

  return (
    <Modal onExit={onExit} loading={loading} width="600px">
      <Box width="600px" pad="medium" direction="row">
        <Box width="50%" height="100%">
          <DragDrop
            uppy={uppy}
            height="100%"
            locale={{
              strings: {
                dropHereOr: 'Drop here or %{browse}',
                browse: 'browse',
              },
            }}
          />
          <Text margin={{ top: 'xsmall' }} size="small" textAlign="center">
            {selectedFile
              ? // @ts-ignore
                selectedFile.name
              : 'Please select a file'}
          </Text>
        </Box>
        <Box width="50%" pad={{ top: 'none', left: 'medium', right: 'medium' }}>
          <InviteList onSubmit={createNewDocument} buttonDisabled={!selectedFile} />
        </Box>
      </Box>
    </Modal>
  );
};
