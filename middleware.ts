import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { TokenResponse } from './app/lib/auth-api';
import { Role } from './app/common/enums/role.enum';

const i18nMiddleware = createMiddleware({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value;

  if (['/login', '/register'].some((path) => req.nextUrl.pathname.startsWith(path)) && token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.redirect(new URL('/', req.nextUrl.origin));
    } catch {
      // Ignore errors and allow the request to continue.
    }
  }

  if (req.nextUrl.pathname.startsWith('/checkout') && !token) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }

  if (req.nextUrl.pathname.startsWith('/admin-panel')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
    }

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

      const decoded = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

      if (decoded.payload.role !== Role.ADMIN) {
        return NextResponse.redirect(new URL('/403', req.nextUrl.origin));
      }
    } catch (err) {
      if (err instanceof jose.errors.JWTExpired) {
        try {
          const refreshToken = req.cookies.get('refreshToken')?.value;
          const res = await fetch(`${process.env.API_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
          });

          if (!res.ok) throw new Error();

          const data: TokenResponse = await res.json();
          const decoded = await jose.jwtVerify(data.accessToken, new TextEncoder().encode(process.env.JWT_SECRET));

          if (decoded.payload.role !== Role.ADMIN) {
            return NextResponse.redirect(new URL('/403', req.nextUrl.origin));
          }

          const response = NextResponse.redirect(new URL(req.nextUrl.pathname, req.nextUrl.origin));
          response.cookies.set('accessToken', data.accessToken, {
            secure: true,
            sameSite: 'strict',
            path: '/',
          });
          return response;
        } catch (error) {
          return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
        }
      }
      return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
    }
  }

  return i18nMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/admin-panel/:path*'],
};
