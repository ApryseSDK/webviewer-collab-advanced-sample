import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getToken from '../util/getToken';
import { useClient, useCurrentUser } from '@pdftron/collab-react';

/**
 * This hook makes sure the user is logged in before viewing a page.
 * If they are not logged in, it redirects them to the login page
 */
export default ({ redirect }: { redirect?: boolean } = {}) => {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const client = useClient();
  useEffect(() => {
    if (!client || user) return;
    const fetchToken = async () => {
      const session = await client.getUserSession();
      if (session) {
        setLoading(false);
        return;
      }
      const token = await getToken();
      if (!token) {
        if (redirect) {
          history.push('/login');
        }
        return;
      }
      try {
        await client.loginWithToken(token);
      } catch (e) {
        history.push('/');
      }
    };
    fetchToken().then(() => {
      setLoading(false);
    });
  }, [user, client]);

  return { user, loading };
};
