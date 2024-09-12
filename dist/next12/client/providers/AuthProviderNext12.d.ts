import React, { ReactNode } from 'react';
interface AuthContextType {
    userData: User | null;
    checkSession: () => Promise<void>;
    getUserInfo: (userId: string) => Promise<any>;
    loading: boolean;
    getUserByToken: (access_token: string) => Promise<any>;
    login: () => string;
    logout: () => string;
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
export declare const AuthProviderNext12: React.FC<{
    children: ReactNode;
    initialSession?: Session;
}>;
export declare const useAuthNext12: () => AuthContextType;
export {};
