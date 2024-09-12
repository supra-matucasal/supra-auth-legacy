import { NextApiRequest, NextApiResponse } from 'next';
export declare const getSession: () => {
    access_token: string;
    email: string;
    refresh_token: string;
} | undefined;
export declare const getSessionWithRequest: (req: NextApiRequest, res: NextApiResponse) => {
    access_token: string;
    email: string;
    refresh_token: string;
} | undefined;
export declare const getTempCode: () => string | any;
export declare const generateRandomState: () => string;
export declare const saveSession: (session: {
    access_token: string;
    refresh_token: string;
}) => void;
