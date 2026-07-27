import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas públicas dentro de /admin (não exigem autenticação)
const publicAdminRoutes = ['/admin/login'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Verifica se é uma rota pública do admin
  if (publicAdminRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Para qualquer outra rota que comece com /admin
  if (path.startsWith('/admin')) {
    const adminAuth = request.cookies.get('admin-auth')?.value;

    if (adminAuth !== 'true') {
      // Redireciona para o login, mantendo a URL original como parâmetro (opcional)
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // Protege todas as sub-rotas de /admin
};