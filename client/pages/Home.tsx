import React, { useCallback } from 'react';
import { Box, Button, Heading, Paragraph } from 'grommet';
import {} from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import { useClient } from '../context/client';
import { useUser } from '../context/user';
import useRouting from '../hooks/useRouting';

export default function Home() {
  const { user, loading } = useAuth({ redirect: false });
  const { setUser } = useUser();
  const client = useClient();
  const router = useRouting();

  const createFakeAccount = useCallback(async () => {
    const resp = await fetch(`${process.env.AUTH_URL}/signup/random`, {
      method: 'post',
    });
    const json = await resp.json();
    const user = await client.loginWithToken(json.token);
    setUser(user);
    router.history.push('/view?n=1');
  }, [client]);

  return (
    <Box width="100%" background="brand" height="100%" alignContent="center" justify="center">
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
                  <Box
                    pad="small"
                    width="auto"
                    align="center"
                    justify="center"
                    margin={{ top: '0px' }}
                  >
                    <Button
                      label="Go to app!"
                      primary
                      margin="0 auto"
                      onClick={createFakeAccount}
                    />
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
