import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import { api } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCOPE = 'read:user';
const CLIENT_ID = 'cbe8ec51b945f0416f3f';
const USER_STORAGE = '@dowhile:user';
const TOKEN_STORAGE = '@dowhile:token';

interface User {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

interface AuthContextData {
  user: User | null;
  isSigningIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthorizationResponse {
  params: {
    code?: string;
    error?: string;
  };
  type?: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_STORAGE);
      const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

      if (userStorage && tokenStorage) {
        api.defaults.headers.common.authorization = `Bearer ${tokenStorage}`;
        setUser(JSON.parse(userStorage));
      }

      setIsSigningIn(false);
    }

    loadUserStorageData();
  }, []);

  async function signIn() {
    try {
      setIsSigningIn(true);

      const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;

      const authSessionResponse = (await AuthSession.startAsync({
        authUrl,
      })) as AuthorizationResponse;

      if (
        authSessionResponse.type === 'success' &&
        authSessionResponse.params.error !== 'access_denied'
      ) {
        const authResponse = await api.post<AuthResponse>('/authenticate', {
          code: authSessionResponse.params.code,
        });

        const { user, token } = authResponse.data;

        api.defaults.headers.common.authorization = `Bearer ${token}`;
        await AsyncStorage.setItem(TOKEN_STORAGE, token);
        await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));

        setUser(user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSigningIn(false);
    }
  }

  async function signOut() {
    setUser(null);
    await AsyncStorage.removeItem(USER_STORAGE);
    await AsyncStorage.removeItem(TOKEN_STORAGE);
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        user,
        isSigningIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { useAuth, AuthProvider };
