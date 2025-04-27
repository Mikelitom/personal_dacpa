import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware( req: NextRequest ) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/dashboard-admin')
  )) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  if (session) {
    const { data: userData } = await supabase
      .from('Usuario')
      .select('rol')
      .eq('correo', session.user.email)
      .single();
  
    const userRole = userData?.rol;

    if (userRole === 'padre' && req.nextUrl.pathname.startsWith('/dashboard-admin')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    if (userRole === 'admin' && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/dashboard-admin', req.url))
    }

    if (req.nextUrl.pathname === '/login') {
      const dashboardUrl = userRole === 'admin' ? '/dashboard-admin' : '/dashboard';
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/dashboard-admin/:path*'
  ]
};