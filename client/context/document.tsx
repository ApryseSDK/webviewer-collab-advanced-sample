import { Document } from '@pdftron/collab-client';
import React, { useMemo, useState } from 'react';

type DocumentContextProps = {
  document: Document | null;
  setDocument: (document: Document | null) => void;
};

export const DocumentContext = React.createContext<DocumentContextProps>(
  {} as DocumentContextProps
);

export const useCurrentDocument = () => {
  return React.useContext(DocumentContext);
};

export const WithDocument = ({ children }) => {
  const [document, setDocument] = useState<Document | null>(null);

  const value = useMemo(
    () => ({
      document,
      setDocument,
    }),
    [document]
  );

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};
