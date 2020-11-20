import React, { useEffect  } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Box } from 'grommet';
import {  getClient, getInstance, setInstance } from '../../redux/viewer';
import Sidebar from '../../components/Sidebar/Sidebar';
import TopNav from '../../components/TopNav';
import useRouting from '../../hooks/useRouting';
import CollabClient from '@pdftron/collab-client';
import { downloadFile } from '../../util/s3';
import { addAnnotation, addDocument, removeDocument, setCurrentDocument } from '../../redux/documents';
import useAuth from '../../hooks/useAuth';
import WebViewer from '@pdftron/webviewer';
import { getCurrentUser } from '../../redux/user';

export default (props) => {
  const routerId = props?.match?.params?.id;
  const routerAnnotId = props?.match?.params?.annotId;
  const client: CollabClient = useSelector(getClient);
  const instance = useSelector(getInstance);
  const { setViewPath } = useRouting();
  const dispatch = useDispatch();
  const user = useSelector(getCurrentUser);
  useAuth();

  useEffect(() => {
    if (routerId) {
      setViewPath({
        documentId: routerId,
        annotationId: routerAnnotId
      })
    }
  }, [routerId, routerAnnotId]);

  useEffect(() => {
    if (!client || !user) return;
    const ele = document.getElementById('viewer');
    WebViewer(
      {
        path: '/public/webviewer',
      },
      ele
    ).then(async (instance) => {
      client.setInstance(instance);
      instance.openElements(['notesPanel']);

      client.subscribe('documentChanged', (docObj, action) => {
        if (action === 'DELETE') {
          dispatch(removeDocument(docObj));
        } else {
          dispatch(addDocument(docObj));
        }
      });

      client.subscribe('annotationChanged', (annot, action) => {
        dispatch(addAnnotation(annot));
      });

      dispatch(setInstance(instance));
    });
  }, [client, user]);

  // Load a new document when the documentId in the URL is updated
  useEffect(() => {
    const go = async () => {
      if (client && routerId && instance) {
        if (routerId === client.currentDocumentId) return;

        // @ts-ignore
        const { blob, name } = await downloadFile(routerId);
       
        const result = await client.loadDocument(blob, {
          // @ts-ignore
          documentId: routerId,
          filename: name
        })
        
        if (result) {
          dispatch(setCurrentDocument(result))
        }
      }
    }
    go();
  }, [routerId, client, instance])

  // Select the annotation when the annotation in the URL is updated
  useEffect(() => {
    if (instance) {
      const annot = instance.annotManager.getAnnotationById(routerAnnotId);
      if (annot) {
        instance.annotManager.selectAnnotation(annot);
        instance.openElements(['notesPanel']);
      }
    }
  }, [routerAnnotId, instance])

  return (
    <Box height='100%'>
      
      <Box direction='row' height='100%'>

        <Sidebar/>

        <Box width='100%' height='100%'>
          <TopNav />
          <div id='viewer' style={{ height: '100%', width: '100%' }}></div>
        </Box>
      </Box>
    </Box>
    
  )
} 