'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {getSessionClient, removeSession} from '../utils-client';
import { SESSION_NAME } from '../../../authConfig';
import { parseJwt } from '../../../shared';
interface AuthContextType {
  userData: User | null;
  checkSession: () => Promise<void>;
  getUserInfo: (userId: string) => Promise<any>;
  loading: boolean;
  getUserByToken: (access_token: string) => Promise<any>
  login: () => String
  logout: () => String
}

interface Session {
  access_token: string | null;
  refresh_token: string | null;
}

interface User {
  id: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode; initialSession?: Session }> = ({ children, initialSession }) => {
  const [session, setSession] = useState<Session>(initialSession || { access_token: null, refresh_token: null });
  const [userData, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshTokens = async (refreshToken: string | null): Promise<Session | null> => {
    if (!refreshToken) return null;

    try {
      const refreshTokenRoute = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/refresh-token`;

      const response = await fetch(refreshTokenRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Tokens refreshed successfully:', data);
        return {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        };
      }

      throw new Error('Failed to refresh tokens');
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return null;
    }
  };

  const checkSession = async () => {
    if (!session.access_token) {
      console.log('No access token available, skipping session check.');
      return;
    }
    const user: any = await getUserByToken(session.access_token);
    console.log('User by token------------>:', user);
    if (!user) {
      await removeSession();
      return;
    }

    console.log('Checking session with access token:', session.access_token);

    const decoded = parseJwt(session.access_token);
    console.log('decodd: ', decoded)
    const expiry = decoded.exp;
    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (expiry < currentTimestamp) {
      console.log('Access token expired, attempting to refresh...');
      const refreshedTokens = await refreshTokens(session.refresh_token);

      if (refreshedTokens) {
        if (
          refreshedTokens.access_token !== session.access_token ||
          refreshedTokens.refresh_token !== session.refresh_token
        ) {
          console.log('New tokens received, updating session.');
          setSession(refreshedTokens);
          setUser({
            accessToken: refreshedTokens.access_token,
            refreshToken: refreshedTokens.refresh_token,
            id: decoded.id
          });
        } else {
          console.log('Tokens remain unchanged.');
        }
      } else {
        console.log('Failed to refresh tokens, redirecting to login.');
        setUser(null);
      }
    } else {
      console.log('Access token is still valid, setting the user.');
      setUser({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
        id: decoded.id
      });
    }

    setLoading(false);
  };

  const getUserInfo = async (userId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/supra-auth-user?user_id=${userId}`, {
      cache: 'no-store',
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  }


  const getUserByToken = async (access_token: string | null): Promise<Session | null> => {
    if (!access_token) return null;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }

      throw new Error('Failed to fetch user by token');
    } catch (error) {
      console.error('Failed to fetch user by token:', error);
      return null;
    }
  };


  const login = () => {
    return '/api/auth/login'
  }

  const logout = () => {
    return '/api/auth/logout'
  }

  useEffect(() => {
    console.log('Initial session check in provider...');
    checkSession();

    if (session.access_token) {
      const interval = setInterval(() => {
        console.log('Performing periodic session check...');
        checkSession();
      }, 60000);

      return () => clearInterval(interval);
    }

    return () => {
      console.log('No access token, clearing interval.');
    };
  }, [session]);

  useEffect(() => {
    async function fetchData() {
      console.log('Fetching data...');
      try {
        // const response = await fetch(`http://localhost:3000/api/auth/getToken`, {
        //   method: 'GET', // or 'POST' depending on the API
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        // const data = await response.json();

        //const decoded = parseJwt(session.access_token);
        const sessionInFetchData = await getSessionClient();
        console.log('Session in fetch data:', sessionInFetchData);
        if (sessionInFetchData && sessionInFetchData.access_token) {
          //const decodedInFetchData = parseJwt(sessionInFetchData.access_token);
          //console.log('Setting user data in fetch data:', decodedInFetchData);
          //setUser(decodedInFetchData);
          console.log('Setting this sessioN:', sessionInFetchData);
          setSession(sessionInFetchData);

        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    console.log('Initial fetch in provider...');
    console.log('Session: ', session);
    console.log('Session access token: ', session.access_token);

    if (session.access_token === null) {
      console.log('No access token available, doing fetch data.');
      fetchData();
    }

  }, []);

  return (
    <AuthContext.Provider value={{ userData, checkSession, getUserInfo, loading, getUserByToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;