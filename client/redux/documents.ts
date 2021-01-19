import { getClient } from './viewer';

type Document = any; // TODO type this

type State = {
  documents: Record<string, Document>;
  currentDocument: Document;
  isLoadingDocuments: boolean;
};

const initialState: State = {
  documents: {},
  currentDocument: null,
  isLoadingDocuments: true,
};

const Types = {
  SET_CURRENT_DOCUMENT: 'DOCUMENTS/SET_CURRENT_DOCUMENT',
  SET_DOCUMENTS: 'DOCUMENTS/SET_DOCUMENTS',
  ADD_DOCUMENT: 'DOCUMENTS/ADD_DOCUMENT',
  SET_IS_LOADING: 'DOCUMENTS/SET_IS_LOADING',
  REMOVE_DOCUMENT: 'DOCUMENTS/REMOVE_DOCUMENT',
  ADD_ANNOTATION: 'DOCUMENTS/ADD_ANNOTATION',
};

export const reducer = (state = initialState, action): State => {
  const { payload, type } = action;

  switch (type) {
    case Types.SET_CURRENT_DOCUMENT: {
      return {
        ...state,
        currentDocument: payload,
      };
    }
    case Types.SET_DOCUMENTS: {
      return {
        ...state,
        documents: {
          ...state.documents,
          ...payload,
        },
      };
    }
    case Types.ADD_DOCUMENT: {
      const newState = {
        ...state,
        documents: {
          ...state.documents,
          [payload.id]: payload,
        },
      };
      return newState;
    }
    case Types.SET_IS_LOADING: {
      return {
        ...state,
        isLoadingDocuments: payload,
      };
    }
    case Types.REMOVE_DOCUMENT: {
      const oldDocs = { ...state.documents };
      delete oldDocs[payload.id];
      return {
        ...state,
        documents: oldDocs,
      };
    }
    case Types.ADD_ANNOTATION: {
      const { documentId, id } = payload;
      const oldDocument = state.documents[documentId as string] || {};
      const oldAnnots = [...(oldDocument.annotations || [])];
      const index = oldAnnots.findIndex((annot) => annot.id === id);
      if (index > -1) {
        oldAnnots[index] = payload;
      } else {
        oldAnnots.push(payload);
      }

      return {
        ...state,
        documents: {
          ...state.documents,
          [documentId]: {
            ...oldDocument,
            annotations: oldAnnots,
          },
        },
      };
    }
    default:
      return state;
  }
};

export const getCurrentDocument = (state) => state.documents.currentDocument;
export const getAllDocuments = (state): Document[] => Object.values(state.documents.documents);
export const isLoadingDocuments = (state) => state.documents.isLoadingDocuments;

export const setCurrentDocument = (document) => {
  return {
    type: Types.SET_CURRENT_DOCUMENT,
    payload: document,
  };
};

export const addDocument = (doc: Document) => (dispatch, getState) => {
  const currentState = getState();
  const currentDocument = getCurrentDocument(currentState);

  if (currentDocument?.id === doc.id) {
    dispatch({
      type: Types.SET_CURRENT_DOCUMENT,
      payload: doc,
    });
  }

  dispatch({
    type: Types.ADD_DOCUMENT,
    payload: doc,
  });
};

export const addAnnotation = (annotation) => {
  return {
    type: Types.ADD_ANNOTATION,
    payload: annotation,
  };
};

export const removeDocument = (doc: Document) => {
  return {
    type: Types.REMOVE_DOCUMENT,
    payload: doc,
  };
};

export const setDocuments = (docs: Record<string, Document>) => {
  return {
    type: Types.SET_DOCUMENTS,
    payload: docs,
  };
};

export const setIsLoadingDocuments = (isLoading: boolean) => {
  return {
    type: Types.SET_IS_LOADING,
    payload: isLoading,
  };
};
