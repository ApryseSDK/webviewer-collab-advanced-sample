import { WebViewerInstance } from '@pdftron/webviewer';
import React, { useMemo, useState } from 'react';

type InstanceContextProps = {
  instance: WebViewerInstance | null;
  setInstance: (instance: WebViewerInstance | null) => void;
};

export const InstanceContext = React.createContext<InstanceContextProps>(
  {} as InstanceContextProps
);

export const useInstance = () => {
  return React.useContext(InstanceContext);
};

export const WithInstance = ({ children }) => {
  const [instance, setInstance] = useState<WebViewerInstance | null>(null);

  const value = useMemo(
    () => ({
      instance,
      setInstance,
    }),
    [instance]
  );

  return <InstanceContext.Provider value={value}>{children}</InstanceContext.Provider>;
};
