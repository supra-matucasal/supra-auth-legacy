import { cookies } from "next/headers";

//const cookieDomain = process.env.SESSION_COOKIE_DOMAIN || 'localhost';

export const setCookie = (cookieName: any, value: string, sameSite?: 'lax' | 'strict', cookieMaxAge: string = '3600') => {
  cookies().set({
    name: cookieName,
    value: value,
    httpOnly: process.env.APP_ENV !== 'development',
    secure: process.env.APP_ENV !== 'development',
    sameSite: sameSite || 'strict',
    path: '/',
    //domain: cookieDomain,
    maxAge: +cookieMaxAge
  });
};

export const getCookie = (cookieName: string | any): string => {
  return cookies().get(cookieName)?.value || '' as string;
};


export const removeCookie = (cookieName: string | any) => {
  cookies().delete(cookieName);
}

