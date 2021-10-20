import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

interface AuthProviderProps {
  children: ReactNode;
}

interface User {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

interface AuthContextData {
  user: User | null;
  signInUrl: string;
  signOut: () => void;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
  };
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider(props: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=aceca48c25a4d9ba501f`;

  const signIn = async (githubCode: string) => {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    });

    const { token, user } = response.data;

    localStorage.setItem('@dowhile:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  };

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem('@dowhile:token');

      console.log(token);

      api.defaults.headers.common.authorization = `Bearer ${token}`;

      if (token) {
        const response = await api.get<User>('profile');

        console.log(response);

        setUser(response.data);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWhithoutCode, githubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWhithoutCode);

      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}
