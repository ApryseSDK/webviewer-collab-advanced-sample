import React, { useCallback, useState } from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import {} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { useClient } from '../context/client';
import { useUser } from '../context/user';

export default function Home() {
  const { user, loading } = useAuth({ redirect: false });
  const [tempAccountModal, setTempAccountModal] = useState(false);
  const [loadingTempInfo, setLoadingTempInfo] = useState(false);
  const [fakeInfo, setFakeInfo] = useState(null);
  const { setUser } = useUser();
  const client = useClient();

  const createFakeAccount = useCallback(async () => {
    setTempAccountModal(true);
    setLoadingTempInfo(true);

    const resp = await fetch(`${process.env.AUTH_URL}/signup/random`, {
      method: 'post',
    });
    const json = await resp.json();

    const fakeInfo = json.info;
    setFakeInfo(fakeInfo);

    setLoadingTempInfo(false);

    const user = await client.loginWithToken(json.token);
    setUser(user);
  }, [client]);

  return (
    <Box width="100%" background="brand" height="100%" alignContent="center" justify="center">
      {tempAccountModal && (
        <Modal loading={loadingTempInfo} onExit={() => null}>
          {fakeInfo && (
            <Box style={{ borderRadius: '4px' }}>
              <Paragraph size="large" textAlign="center" margin="10px 0 20px 0">
                Your new account information:
              </Paragraph>
              <Box>
                <Paragraph textAlign="center" style={{ fontWeight: 'bold' }} margin="2px 0">
                  Email
                </Paragraph>
              </Box>
              <Paragraph margin="5px 0" textAlign="center">
                {fakeInfo.email}
              </Paragraph>

              <Box>
                <Paragraph textAlign="center" style={{ fontWeight: 'bold' }} margin="6px 0 2px 0">
                  Password
                </Paragraph>
              </Box>
              <Paragraph margin="5px 0" textAlign="center">
                {fakeInfo.password}
              </Paragraph>

              <a href="/view" style={{ margin: '0 auto' }}>
                <Button label="Continue to app" primary margin="20px auto" />
              </a>
            </Box>
          )}
        </Modal>
      )}

      <Box pad="large">
        <Heading textAlign="center" margin="0 auto" size="large">
          WebViewer Collaboration Demo
        </Heading>
        <Heading textAlign="center" margin="0 auto" size="small">
          An{' '}
          <a
            style={{ color: 'white' }}
            target="_blank"
            href="https://github.com/PDFTron/webviewer-collab-advanced-sample"
          >
            open source
          </a>{' '}
          demo showing off the
          <br />{' '}
          <a style={{ color: 'white' }} target="_blank" href="https://collaboration.pdftron.com/">
            WebViewer Collaboration modules
          </a>
        </Heading>

        <Box margin={{ top: '40px' }}>
          <Paragraph textAlign="center" margin="0 auto">
            Note: Database is wiped out once a day
          </Paragraph>
        </Box>

        <Box margin={{ top: '40px' }} style={{ minHeight: '60px' }}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {user ? (
                <a href="/view" style={{ margin: '0 auto' }}>
                  <Button primary label="Go to app" />
                </a>
              ) : (
                <Box>
                  <Box flex direction="row" align="center" justify="center">
                    <a href="/login" style={{ margin: '0 5px' }}>
                      <Button primary label="Login" margin="0 auto" />
                    </a>
                    <a href="/signup" style={{ margin: '0 5px' }}>
                      <Button primary label="Sign up" margin="0 auto" />
                    </a>
                  </Box>

                  <Box
                    pad="small"
                    width="auto"
                    align="center"
                    justify="center"
                    margin={{ top: '20px' }}
                  >
                    <Button
                      label="Create temporary account"
                      primary
                      margin="0 auto"
                      onClick={createFakeAccount}
                    />
                    <Paragraph margin="2px auto" textAlign="center" size={'small'}>
                      Quickly create a temporary account with fake info
                    </Paragraph>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
