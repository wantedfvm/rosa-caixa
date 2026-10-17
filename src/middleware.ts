import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas liberadas
  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/cadastro' ||
    pathname === '/termos' ||
    pathname === '/privacidade' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.');

  // Detecta o token de sessão do Better Auth de forma flexível (com ou sem prefixo __Secure, chunked, etc)
  const allCookies = request.cookies.getAll();
  const hasSessionCookie = allCookies.some(
    (c) =>
      c.name.includes('session_token') ||
      c.name.includes('better-auth.session')
  );

  // Redireciona usuário não autenticado tentando acessar área interna
  if (!isPublicRoute && !hasSessionCookie) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Permite que /cadastro e /login sejam sempre acessiveis pelo usuario

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
