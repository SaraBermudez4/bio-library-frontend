'use client';

import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from '@/lib/constants';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    case 'HYDRATE':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'HYDRATE_EMPTY':
      return { ...initialState, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((user, token) => {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { user, token } });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    dispatch({ type: 'LOGOUT' });
  }, []);

  const hydrate = useCallback(() => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (token && raw) {
      try {
        const user = JSON.parse(raw);
        dispatch({ type: 'HYDRATE', payload: { user, token } });
      } catch {
        dispatch({ type: 'HYDRATE_EMPTY' });
      }
    } else {
      dispatch({ type: 'HYDRATE_EMPTY' });
    }
  }, []);

  const updateUser = useCallback(
    (partial) => {
      const updated = { ...state.user, ...partial };
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
      dispatch({ type: 'UPDATE_USER', payload: partial });
    },
    [state.user]
  );

  const value = useMemo(
    () => ({ ...state, login, logout, hydrate, updateUser }),
    [state, login, logout, hydrate, updateUser],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
