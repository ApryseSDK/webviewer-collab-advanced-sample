import { CollabClient } from '@pdftron/collab-client';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CollabClientProvider } from '@pdftron/collab-react';
export const ClientContext = React.createContext<CollabClient>(null);

/**
 * This component just wraps the app and sets up the collab client
 */
export const WithClient = ({ children }) => {
  const history = useHistory();

  const client = useRef(
    new CollabClient({
      url: process.env.SERVER_URL,
      subscriptionUrl: process.env.SUBSCRIBE_URL,
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
    })
  );

  useEffect(() => {
    client.current.EventManager.subscribe('annotationPermissionError', () => {
      toast.error('You do not have permission to create annotations on this document.');
    });

    client.current.EventManager.subscribe('documentPermissionError', () => {
      toast.error('You do not have permission to view that document');
    });
  }, []);

  return <CollabClientProvider client={client.current}>{children}</CollabClientProvider>;
};
