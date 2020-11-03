import CollabClient from '@pdftron/collab-client';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCurrentUser, setCurrentUser } from './../redux/user';
import { useSelector, useDispatch } from 'react-redux';
import getToken from '../util/getToken';
import { getClient } from '../redux/viewer';

/**
 * This hook makes sure the user is logged in before viewing a page.
 * If they are not logged in, it redirects them to the login page
 */
export default () => {
  const user = useSelector(getCurrentUser);
  const history = useHistory();
  const dispatch = useDispatch();
  const client: CollabClient = useSelector(getClient);
  useEffect(() => {
    if (!client) return;
    const fetchToken = async () => {
      const token = user?.token || await getToken();
      if(!token) {
        history.push('/');
        return;
      }
      try {
        const { user: u } = await client.loginWithToken(token);
        if (!user) {
          dispatch(setCurrentUser(u))
        }
      } catch (e) {
        history.push('/');
      }
    };
    fetchToken()
  }, [user, client])
}
