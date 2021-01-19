import { CollabClient } from '@pdftron/collab-client';
import { WebViewerInstance } from '@pdftron/webviewer';

type State = {
  instance: WebViewerInstance;
  client: CollabClient;
};

const initialState: State = {
  instance: null,
  client: null,
};

const Types = {
  SET_INSTANCE: 'VIEWER/SET_INSTANCE',
  SET_CLIENT: 'VIEWER/SET_CLIENT',
};

export const reducer = (state: State = initialState, action): State => {
  const { payload, type } = action;

  switch (type) {
    case Types.SET_INSTANCE: {
      return {
        ...state,
        instance: payload,
      };
    }
    case Types.SET_CLIENT: {
      return {
        ...state,
        client: payload,
      };
    }
    default:
      return state;
  }
};

export const setInstance = (instance: WebViewerInstance) => ({
  type: Types.SET_INSTANCE,
  payload: instance,
});

export const setClient = (client: CollabClient) => ({
  type: Types.SET_CLIENT,
  payload: client,
});

export const getInstance = (state): WebViewerInstance => state.viewer.instance;
export const getClient = (state): CollabClient => state.viewer.client;
