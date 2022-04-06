import { Snapshot } from '@pdftron/collab-client';
import { Box, Button, Menu, Text } from 'grommet';
import React, { useCallback } from 'react';
import DocText from './DocText';
import { toast } from 'react-toastify';
import {
  useCurrentDocument,
  useCurrentSnapshot,
  useCurrentUser,
  useSnapshots,
} from '@pdftron/collab-react';

export default function Snapshots() {
  const user = useCurrentUser();
  const currentDocument = useCurrentDocument();
  const { snapshots } = useSnapshots({ initialLoad: 'all' });
  const previewingSnapshot = useCurrentSnapshot();

  const previewSnapshot = useCallback((snapshot: Snapshot) => {
    snapshot.preview();
  }, []);

  const createSnapshot = useCallback(() => {
    currentDocument.createSnapshot(`Snapshot by ${user.userName || user.email}`);
    toast.success(
      'Snapshot created! Try editing some annotations and then previewing the snapshot'
    );
  }, [currentDocument, user]);

  const exitPreview = useCallback(() => {
    if (previewingSnapshot) {
      previewingSnapshot.closePreview();
    }
  }, [previewingSnapshot]);

  const restoreSnapshot = useCallback(async () => {
    if (previewingSnapshot) {
      await previewingSnapshot.restore();
      toast.success('Snapshot restored!');
    }
  }, [previewingSnapshot]);

  return (
    <Box direction="row" align="center">
      {previewingSnapshot ? (
        <>
          <Text size="small">Previewing "{previewingSnapshot.name}"</Text>

          <Button
            label={
              <DocText link="/docs/client/versioning#restoring-a-document-to-a-snapshot">
                Restore snapshot
              </DocText>
            }
            onClick={restoreSnapshot}
            size="small"
            margin={{ left: 'xsmall', vertical: 'xsmall' }}
          />

          <Button
            label="Exit preview"
            onClick={exitPreview}
            size="small"
            margin={{ left: 'xsmall', vertical: 'xsmall' }}
          />
        </>
      ) : (
        <>
          <Menu
            label={
              <DocText link="/docs/client/versioning#getting-snapshots">
                <Text size="small">{snapshots.length} snapshots</Text>
              </DocText>
            }
            size="small"
            dropAlign={{
              right: 'right',
              top: 'top',
            }}
            margin={{ right: 'small' }}
            items={snapshots.map((snapshot) => ({
              label: (
                <DocText link="/docs/client/versioning#previewing-a-snapshot">
                  <Text size="small">Preview "{snapshot.name}"</Text>
                </DocText>
              ),
              onClick: () => previewSnapshot(snapshot),
            }))}
          />

          <Button
            label={
              <>
                <DocText link="/docs/client/versioning#creating-a-snapshot">
                  Create snapshot
                </DocText>
              </>
            }
            onClick={createSnapshot}
            margin={{ vertical: 'xsmall' }}
            size="small"
          />
        </>
      )}
    </Box>
  );
}
