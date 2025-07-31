import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const protectedRoutes = ['/'] // Only logged-in users can access this
const authRoutes = ['/signup'] // Logged-in users can't access this

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  const { pathname } = request.nextUrl

  // Redirect to /signup if not logged in and trying to access protected routes
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/signup', request.url))
  }

  // Redirect to / if logged in and trying to access auth routes
  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/signup'],
}