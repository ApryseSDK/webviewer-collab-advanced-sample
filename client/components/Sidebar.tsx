import React, { useEffect, useState } from 'react';
import { Sidebar, Button, Text, Box } from 'grommet';
import FileUpload from './FileUpload';
import LoadingSpinner from './LoadingSpinner';
import DocumentListItem from './DocumentListItem';
import { useHistory } from 'react-router-dom';
import { useUser } from '../context/user';
import { useCurrentDocument } from '../context/document';
import { useClient } from '../context/client';
import { Document } from '@pdftron/collab-client';

export default () => {
  const [showNewDoc, setShowNewDoc] = useState(false);
  const { user } = useUser();
  const { document: currentDocument } = useCurrentDocument();
  const [documents, setDocuments] = useState<Document[]>([]);
  const client = useClient();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Initial load
   */
  useEffect(() => {
    if (!client || !user) return;

    setIsLoading(true);

    const go = async () => {
      const paginator = user.getDocumentPaginator({
        limit: 50,
      });

      const docs = await paginator.next();

      setDocuments(docs);
      setIsLoading(false);
    };

    go();
  }, [client, user]);

  useEffect(() => {
    if (!client) return;
    return client.EventManager.subscribe('documentChanged', (document) => {
      setDocuments((old) => {
        const next = [...old];
        const indexOfDoc = next.findIndex((doc) => doc.id === document.id);
        if (indexOfDoc > -1) {
          next[indexOfDoc] = document;
        } else {
          next.push(document);
        }
        return next;
      });
    });
  }, [client]);

  useEffect(() => {
    if (!client) return;
    return client.EventManager.subscribe('inviteReceived', (doc) => {
      setDocuments((old) => {
        const next = [...old, doc];
        return next;
      });
    });
  }, [client]);

  const logoutUser = async () => {
    await fetch(`${process.env.AUTH_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    await user.logout();
    history.push('/');
  };

  return (
    <Sidebar
      background="neutral-2"
      height="100%"
      width="250px"
      footer={
        <>
          {!!currentDocument && <Box direction="row" justify="between"></Box>}

          <Button
            onClick={() => setShowNewDoc(true)}
            label="New doc"
            primary
            size="small"
            icon={<>+</>}
            margin={{ bottom: 'small' }}
          />
          <Text textAlign="center" size="small" margin={{ bottom: 'small' }}>
            {user?.email}
          </Text>
          <Text size="xsmall" textAlign="center" onClick={logoutUser}>
            Logout
          </Text>
        </>
      }
    >
      {showNewDoc && <FileUpload onExit={() => setShowNewDoc(false)} />}

      <Text
        size="small"
        weight="bold"
        margin={{
          bottom: 'small',
          top: 'small',
        }}
      >
        Your documents
      </Text>

      {documents.length === 0 && !isLoading && <Text size="small">You have no documents!</Text>}

      {isLoading && <LoadingSpinner style={{ marginTop: '50px' }} />}

      {client &&
        documents
          .sort((d1, d2) => d2.updatedAt.getTime() - d1.updatedAt.getTime())
          .map((document) => {
            return <DocumentListItem key={document.id} document={document} />;
          })}
    </Sidebar>
  );
};
