import { Snapshot } from '@pdftron/collab-client';
import { Box, Button, Menu, Text } from 'grommet';
import React, { useCallback, useEffect, useState } from 'react';
import { useClient } from '../context/client';
import { useCurrentDocument } from '../context/document';
import { useUser } from '../context/user';
import DocText from './DocText';
import { toast } from 'react-toastify';

export default function Snapshots() {
  const client = useClient();
  const { user } = useUser();
  const { document: currentDocument } = useCurrentDocument();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [previewingSnapshot, setPreviewingSnapshot] = useState<Snapshot>(null);

  useEffect(() => {
    (async () => {
      if (!currentDocument) {
        setSnapshots([]);
        return;
      }
      const snapshots = await currentDocument.getAllSnapshots();
      setSnapshots(snapshots);
    })();
  }, [currentDocument]);

  useEffect(() => {
    return client.EventManager.subscribe('snapshotAdded', (snapshot) => {
      setSnapshots((old) => [...old, snapshot]);
    });
  }, [client]);

  useEffect(() => {
    return client.EventManager.subscribe('snapshotChanged', (snapshot) => {
      setSnapshots((old) => {
        const next = [...old];
        const index = next.findIndex((s) => s.id === snapshot.id);
        if (index > -1) {
          next[index] = snapshot;
        } else {
          next.push(snapshot);
        }
        return next;
      });
    });
  }, [client]);

  useEffect(() => {
    return client.EventManager.subscribe('snapshotDeleted', (id) => {
      setSnapshots((old) => {
        const next = [...old];
        const index = next.findIndex((s) => s.id === id);
        if (index > -1) {
          next.splice(index, 1);
        }
        return next;
      });
    });
  }, [client]);

  const previewSnapshot = useCallback((snapshot: Snapshot) => {
    snapshot.preview();
    setPreviewingSnapshot(snapshot);
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
      setPreviewingSnapshot(null);
    }
  }, [previewingSnapshot]);

  const restoreSnapshot = useCallback(async () => {
    if (previewingSnapshot) {
      await previewingSnapshot.restore();
      setPreviewingSnapshot(null);
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
