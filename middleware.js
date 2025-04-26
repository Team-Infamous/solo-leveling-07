// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Block direct access to init routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const initSecret = request.headers.get('x-init-secret');
    if (initSecret !== process.env.OWNER_INIT_SECRET) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }
  return NextResponse.next();
}
