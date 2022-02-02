import { CollabClient } from '@pdftron/collab-client';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ClientContext = React.createContext<CollabClient>(null);

export const useClient = function () {
  return React.useContext(ClientContext);
};

/**
 * This component just wraps the app and sets up the collab client
 */
export const WithClient = ({ children }) => {
  const history = useHistory();

  const [client, setClient] = useState<CollabClient>(null);

  useEffect(() => {
    const client = new CollabClient({
      url: process.env.SERVER_URL,
      subscriptionUrl: process.env.SUBSCRIBE_URL,
      logLevel: CollabClient.LogLevels.DEBUG,
      filterLogsByTag: CollabClient.LogTags.USERNAMES,
      notificationHandler: CollabClient.defaultNotificationHandler({
        onClick: (data) => {
          const { type } = data;
          if (type === 'message') {
            history.push(`/view/${data.annotation.documentId}/${data.annotation.id}`);
          } else {
            history.push(`/view/${data.document.id}`);
          }
        },
      }),
    });

    client.EventManager.subscribe('annotationPermissionError', () => {
      toast.error('You do not have permission to create annotations on this document.');
    });

    client.EventManager.subscribe('documentPermissionError', () => {
      toast.error('You do not have permission to view that document');
    });

    setClient(client);
  }, []);

  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
};
