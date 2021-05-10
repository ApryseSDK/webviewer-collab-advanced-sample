import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Box, Text } from 'grommet';
import Uppy from '@uppy/core';
import { DragDrop } from '@uppy/react';
import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import InviteList from '../InviteList';
import Modal from '../Modal';
import useRouting from '../../hooks/useRouting';
import CollabClient from '@pdftron/collab-client';
import { uploadFile } from '../../util/s3';
import { useDispatch, useSelector } from 'react-redux';
import { getClient } from '../../redux/viewer';
import { setCurrentDocument } from '../../redux/documents';

export default ({ onExit }) => {
  const [selectedFile, setSelectedFile] = useState();

  const [loading, setLoading] = useState(false);
  const { setViewPath } = useRouting();
  const client: CollabClient = useSelector(getClient);
  const dispatch = useDispatch();

  const createNewDocument = async (list) => {
    setLoading(true);

    if (selectedFile !== undefined) {
      // @ts-ignore
      const { id } = await uploadFile(selectedFile.data, selectedFile.name);

      // @ts-ignore
      const result = await client.loadDocument(selectedFile.data, {
        documentId: id,
      });

      if (list && list.length) {
        await client.inviteUsersToDocument(id, list);
      }

      if (result) {
        dispatch(setCurrentDocument(result));
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
