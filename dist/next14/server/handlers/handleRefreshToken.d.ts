import { NextRequest, NextResponse } from "next/server";
export declare function handleRefreshToken(req: NextRequest, res: NextResponse): Promise<NextResponse<{
    access_token: any;
    refresh_token: any;
}> | NextResponse<{
    error: string;
}>>;
