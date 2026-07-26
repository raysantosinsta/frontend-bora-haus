// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Permite acesso à página de login sem autenticação
  if (path === '/admin/login') {
    return NextResponse.next();
  }

  // Para rotas /admin/* (exceto /admin/login), verifica autenticação
  if (path.startsWith('/admin/products')) {
    // Verifica se existe o cookie de autenticação admin
    const adminAuth = request.cookies.get('admin-auth')?.value;

    if (adminAuth !== 'true') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*', // aplica apenas em rotas /admin
};