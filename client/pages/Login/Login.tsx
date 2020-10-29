import React, {  useEffect, useState } from 'react';
import { Box, Heading, Form, FormField, TextInput, Button, Text, Anchor } from 'grommet'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../redux/user';
import { useHistory } from 'react-router-dom';
import { getClient } from '../../redux/viewer';
import CollabClient from '@pdftron/collab-client';
import LoadingSpinner from '../../components/LoadingSpinner';

export default () => {  
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState<string>();
  const client: CollabClient = useSelector(getClient);
  const [canLogin, setCanLogin] = useState(false);

  useEffect(() => {
    const go = async () => {
      const session = await client.getUserSession({ signInIfExists: true });
      if (session) {
        dispatch(setCurrentUser(session));
        history.push('/view');
      } else {
        setCanLogin(true)
      }
    }
    
  if (client) {
    go()
  }
    
  }, [client])

  const submit = async (event) => {
    const { email, password } = event.value;
    const resp = await fetch(`${process.env.AUTH_URL}/login`, {
      method: 'post',
      credentials: 'include',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-Type': "application/json"
      }
    });
    if (resp.status === 200) {
      const json = await resp.json();
      setError(null);
      const { user } = await client.loginWithToken(json.token);
      dispatch(setCurrentUser(user));
      history.push('/view');
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    <div className='Login'>
      <Box align='center' justify='center' height='100%'>
        {
          canLogin ?
            <>
              <Box direction='column' elevation='small' pad='small' width='medium' align='center' round='small'>
                <Heading level='2' margin='none' color='light'>Login</Heading>

                <Form onSubmit={submit} style={{ marginTop: '10px' }}>
                  <FormField htmlFor='email' label='email'>
                    <TextInput id='email' name='email' placeholder='email@address.com' />
                  </FormField>

                  <FormField htmlFor='password' label='password' error={error}>
                    <TextInput id='password' name='password' type='password' />
                  </FormField>

                  <Box align='center' style={{ marginTop: '30px' }}>
                    <Button primary type='submit' label='submit' />
                  </Box>

                </Form>
              </Box>

              <Anchor href='/signup' size='small' margin={{top: 'small'}}>Don't have an account?</Anchor>
            </> :
            <>
              <LoadingSpinner />
            </>
        }
        
      </Box>
    </div>
  )
}
