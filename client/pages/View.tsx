import React, { useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import useRouting from '../hooks/useRouting';
import { downloadFile } from '../util/s3';
import useAuth from '../hooks/useAuth';
import WebViewer from '@pdftron/webviewer';
import { useClient } from '../context/client';
import { useInstance } from '../context/instance';
import { useUser } from '../context/user';
import { useCurrentDocument } from '../context/document';
import { useHistory } from 'react-router-dom';
import createSampleDoc from '../util/createSampleDoc';
import Modal from '../components/Modal';

export default (props) => {
  const routerId = props?.match?.params?.id;
  const routerAnnotId = props?.match?.params?.annotId;
  const client = useClient();
  const [welcomeModal, showWelcomeModal] = useState(false);
  const [creatingWelcomeDoc, setCreatingWelcomeDoc] = useState(false);
  const { instance, setInstance } = useInstance();
  const { user } = useUser();
  const { setDocument } = useCurrentDocument();

  const { setViewPath } = useRouting();
  const history = useHistory();

  useAuth();

  useEffect(() => {
    if (user && history.location.search.includes('n=1')) {
      setCreatingWelcomeDoc(true);
      showWelcomeModal(true);
      createSampleDoc(user).then((doc) => {
        setCreatingWelcomeDoc(false);
        history.push(`/view/${doc.id}`);
      });
    }
  }, [history, user]);

  useEffect(() => {
    if (routerId) {
      setViewPath({
        documentId: routerId,
        annotationId: routerAnnotId,
      });
    }
  }, [routerId, routerAnnotId]);

  useEffect(() => {
    if (!client) return;
    const ele = document.getElementById('viewer');
    WebViewer(
      {
        path: '/public/webviewer',
      },
      ele
    ).then(async (instance) => {
      client.setInstance(instance);
      instance.UI.openElements(['notesPanel']);
      setInstance(instance);
    });
  }, [client]);

  // Load a new document when the documentId in the URL is updated
  useEffect(() => {
    const go = async () => {
      if (client && routerId && instance && user) {
        if (routerId === client.currentDocumentId) return;
        const { blob } = await downloadFile(routerId);
        const doc = await user.getDocument(routerId);
        doc.view(blob);
        setDocument(doc);
      }
    };
    go();
  }, [routerId, client, instance, user]);

  // Select the annotation when the annotation in the URL is updated
  useEffect(() => {
    if (instance) {
      const { Core, UI } = instance;
      const annot = Core.annotationManager.getAnnotationById(routerAnnotId);
      if (annot) {
        Core.annotationManager.selectAnnotation(annot);
        UI.openElements(['notesPanel']);
      }
    }
  }, [routerAnnotId, instance]);

  return (
    <Box height="100%">
      {welcomeModal && (
        <Modal loading={creatingWelcomeDoc}>
          <Box height={'300px'}>
            {!creatingWelcomeDoc && (
              <>
                <Text textAlign="center">Welcome to WebViewer Collaboration!</Text>
                <Text size="small" margin={{ top: '20px' }}>
                  We have created a sample document for you to get started. You can upload your own
                  files by clicking the "New doc" button in the side bar.
                </Text>
                <br />
                <Text size="small">
                  Feel free to invite other people to try collaborating, or create an account in a
                  different browser and invite yourself!
                </Text>

                <Button
                  primary
                  margin={{ top: '40px' }}
                  style={{ textAlign: 'center' }}
                  label="Close"
                  onClick={() => showWelcomeModal(false)}
                />
              </>
            )}
          </Box>
        </Modal>
      )}

      <Box direction="row" height="100%">
        <Sidebar />

        <Box width="100%" height="100%">
          <TopNav />
          <div id="viewer" style={{ height: '100%', width: '100%' }}></div>
        </Box>
      </Box>
    </Box>
  );
};
