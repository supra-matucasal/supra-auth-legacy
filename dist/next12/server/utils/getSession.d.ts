import { NextApiRequest, NextApiResponse } from "next";
export declare const getSessionWithRequest: (req: NextApiRequest, res: NextApiResponse) => {
    access_token: string;
    email: string;
    refresh_token: string;
} | undefined;
