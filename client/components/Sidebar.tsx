import React, { useState } from 'react';
import { Sidebar, Button, Text, Box } from 'grommet';
import FileUpload from './FileUpload';
import LoadingSpinner from './LoadingSpinner';
import DocumentListItem from './DocumentListItem';
import { useHistory } from 'react-router-dom';
import DocText from './DocText';
import { useClient, useCurrentDocument, useCurrentUser, useDocuments } from '@pdftron/collab-react';

export default () => {
  const [showNewDoc, setShowNewDoc] = useState(false);
  const user = useCurrentUser();
  const currentDocument = useCurrentDocument();
  const { documents, loading: isLoading } = useDocuments({ initialLoad: 50 });
  const client = useClient();
  const history = useHistory();

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
            label={
              <DocText color="white" link="/docs/client/loading-documents#creating-documents">
                New doc
              </DocText>
            }
            primary
            size="small"
            icon={<>+</>}
            margin={{ bottom: 'small' }}
          />
          <Text textAlign="center" size="small" margin={{ bottom: 'small' }}>
            {user?.email}
          </Text>
          <DocText link="/api/client/classes/User.html#logout" style={{ margin: '0 auto' }}>
            <Text size="xsmall" textAlign="center" onClick={logoutUser}>
              Logout
            </Text>
          </DocText>
        </>
      }
    >
      {showNewDoc && <FileUpload onExit={() => setShowNewDoc(false)} />}

      <DocText link="/docs/client/get-documents">
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
      </DocText>

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
