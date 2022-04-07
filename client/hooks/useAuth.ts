import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useClient, useCurrentUser } from '@pdftron/collab-react';

/**
 * This hook makes sure the user is logged in before viewing a page.
 * If they are not logged in, it redirects them to the login page
 */
export default () => {
  const user = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const client = useClient();
  useEffect(() => {
    if (!client || user) {
      setLoading(false);
      return;
    }
    const fetchToken = async () => {
      const session = await client.getUserSession();
      if (session) {
        setLoading(false);
        return;
      } else {
        history.push('/');
        return;
      }
    };
    fetchToken().then(() => {
      setLoading(false);
    });
  }, [user, client]);

  return { user, loading };
};
