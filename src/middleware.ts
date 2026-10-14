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

  // O Better Auth armazena o token na chave de cookie 'better-auth.session_token'
  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  // Redireciona usuário não autenticado tentando acessar área interna
  if (!isPublicRoute && !sessionCookie) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Redireciona usuário já logado que acessa login ou cadastro
  if ((pathname === '/login' || pathname === '/cadastro') && sessionCookie) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
