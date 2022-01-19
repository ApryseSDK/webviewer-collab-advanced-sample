import React, { useEffect, useState } from 'react';
import { Box, Heading, Form, FormField, TextInput, Button, Anchor } from 'grommet';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { useClient } from '../context/client';
import { useUser } from '../context/user';
import DocText from '../components/DocText';

export default () => {
  const history = useHistory();
  const [error, setError] = useState<string>();
  const client = useClient();
  const { setUser } = useUser();
  const [canLogin, setCanLogin] = useState(false);

  useEffect(() => {
    const go = async () => {
      const user = await client.getUserSession();
      setUser(user);
      if (user) {
        history.push('/view');
      } else {
        setCanLogin(true);
      }
    };

    if (client) {
      go();
    }
  }, [client]);

  const submit = async (event) => {
    const { email, password } = event.value;
    const resp = await fetch(`${process.env.AUTH_URL}/login`, {
      method: 'post',
      credentials: 'include',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (resp.status === 200) {
      const json = await resp.json();
      setError(null);
      const user = await client.loginWithToken(json.token);
      setUser(user);
      history.push('/view');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="Login">
      <Box align="center" justify="center" height="100%">
        {canLogin ? (
          <>
            <Box
              direction="column"
              elevation="small"
              pad="small"
              width="medium"
              align="center"
              round="small"
            >
              <DocText color="#222222" link="/docs/client/logging-in-users">
                <Heading level="2" margin="none" color="light">
                  Login
                </Heading>
              </DocText>
              <Form onSubmit={submit} style={{ marginTop: '10px' }}>
                <FormField htmlFor="email" label="email">
                  <TextInput id="email" name="email" placeholder="email@address.com" />
                </FormField>

                <FormField htmlFor="password" label="password" error={error}>
                  <TextInput id="password" name="password" type="password" />
                </FormField>

                <Box align="center" style={{ marginTop: '30px' }}>
                  <Button primary type="submit" label="submit" />
                </Box>
              </Form>
            </Box>

            <Anchor href="/signup" size="small" margin={{ top: 'small' }}>
              Don't have an account?
            </Anchor>
          </>
        ) : (
          <>
            <LoadingSpinner />
          </>
        )}
      </Box>
    </div>
  );
};
