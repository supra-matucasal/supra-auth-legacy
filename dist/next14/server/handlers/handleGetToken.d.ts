import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
export declare function handleGetToken(req: NextApiRequest, res: NextApiResponse): Promise<void | NextResponse<{
    error: string;
}>>;
