import { User } from '@pdftron/collab-client';
import React, { useMemo, useState } from 'react';

type UserContextProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = React.createContext<UserContextProps>({} as UserContextProps);

export const useUser = () => {
  return React.useContext(UserContext);
};

export const WithUser = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
