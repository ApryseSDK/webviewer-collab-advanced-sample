import { User } from './../../types/User';

const initUser = null;
const initialState = {
  user: initUser || null,
};

const Types = {
  LOGIN: 'USER/LOGIN',
  LOGOUT: 'USER/LOGOUT',
};

export const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case Types.LOGIN: {
      return {
        ...state,
        user: payload,
      };
    }
    case Types.LOGOUT: {
      return {
        ...state,
        user: null,
      };
    }
    default:
      return state;
  }
};

export const getCurrentUser = (state) => state.user.user;

export const setCurrentUser = (user: User) => {
  return {
    type: Types.LOGIN,
    payload: user,
  };
};

export const logout = () => {
  return {
    type: Types.LOGOUT,
  };
};
