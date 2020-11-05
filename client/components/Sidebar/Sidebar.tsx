import React, { useState } from 'react';
import { Sidebar, Button, Text, Box } from 'grommet';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser, logout } from '../../redux/user';
import { getAllDocuments, isLoadingDocuments, getCurrentDocument } from '../../redux/documents';
import FileUpload from '../FileUpload/FileUpload';
import LoadingSpinner from '../LoadingSpinner';
import { getClient } from '../../redux/viewer';
import DocumentListItem from '../DocumentListItem';
import { useHistory } from 'react-router-dom';

export default () => {
  const [showNewDoc, setShowNewDoc] = useState(false);
  const user = useSelector(getCurrentUser)
  const documents = useSelector(getAllDocuments);
  const isLoading = useSelector(isLoadingDocuments);
  const currentDocument = useSelector(getCurrentDocument);
  const client = useSelector(getClient);
  const history = useHistory();
  const dispatch = useDispatch();

  const logoutUser = async () => {
    await fetch(`${process.env.AUTH_URL}/logout`,
    {
      method: 'POST',
      credentials: 'include'
    });
    dispatch(logout());
    await client.logout();
    history.push('/');
  }

  return (
    <Sidebar
      background='neutral-2'
      height='100%'
      width='250px'
      footer={
        <>
          {
            !!currentDocument &&
            <Box direction='row' justify='between'>
              
            </Box>
          }
          
          <Button
            onClick={() => setShowNewDoc(true)}
            label='New doc'
            primary
            size='small'
            icon={<>+</>}
            margin={{ bottom: 'small' }}
          />
          <Text textAlign='center' size='small' margin={{bottom: 'small'}}>{user?.email}</Text>
          <Text size='xsmall' textAlign='center' onClick={logoutUser}>Logout</Text>
        </>
      }
    >

      {
        showNewDoc &&
        <FileUpload onExit={() => setShowNewDoc(false)}/>
      }

      <Text size='small' weight='bold' margin={{
        bottom: 'small',
        top: 'small'
      }}>Your documents</Text>

      {
        documents.length === 0 && !isLoading &&
        <Text size='small'>You have no documents!</Text>
      }

      {
        isLoading &&
        <LoadingSpinner style={{marginTop: '50px'}} />
      }
      

      {
        client && documents.map(document => {
          return (
            <DocumentListItem document={document} />
          )
        })
      }
    </Sidebar>
  )
}