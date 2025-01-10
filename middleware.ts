import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { Roles } from './app/common';

const i18nMiddleware = createMiddleware({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  // Block login/register if user is logged in
  if (['/login', '/register'].some((path) => req.nextUrl.pathname.startsWith(path)) && token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.redirect(new URL('/', req.nextUrl.origin));
    } catch {
      // If token is invalid, user can proceed
    }
  }

  // Require admin token for admin-panel
  if (req.nextUrl.pathname.startsWith('/admin-panel')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
    }
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }
      const decoded = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

      //TODO: REFRESH IF TOKEN IS EXPIRED
      if (decoded.payload.role !== Roles.ADMIN) {
        return NextResponse.redirect(new URL('/403', req.nextUrl.origin));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
    }
  }

  return i18nMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/admin-panel/:path*'],
};
