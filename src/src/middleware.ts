import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const user = req.cookies.get('user')?.value;
    const userRole = user ? JSON.parse(user).roles[0].name : null;
    const { pathname } = req.nextUrl;
    const url = req.nextUrl.clone();

    // If the user is not logged in:
    if (!userRole) {
        // Prevent access to protected routes.
        if (pathname.startsWith('/admin') || 
            pathname.startsWith('/consultant-dashboard') || 
            pathname.startsWith('/receptionist-dashboard')) {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // For admin users: redirect login/register to /admin, allow everywhere.
    if (userRole === 'admin') {
        if (pathname === '/login' || pathname === '/register') {
            url.pathname = '/admin';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // For consultant users: redirect login/register to /consultant-dashboard, allow everywhere.
    if (userRole === 'consultant') {
        if (pathname === '/login' || pathname === '/register') {
            url.pathname = '/consultant-dashboard';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

 // For receptionist users: redirect to /Receptionist, block admin/consultant
// For receptionist users: redirect to /Receptionist, block admin/consultant
if (userRole === 'receptionist') {
    if (pathname.startsWith('/admin') || pathname.startsWith('/consultant-dashboard')) {
        url.pathname = '/Receptionist';  
        return NextResponse.redirect(url);
    }
    if (pathname === '/login' || pathname === '/register') {
        url.pathname = '/Receptionist';  
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}



    // For patient users: block admin/consultant/receptionist, redirect login to home.
    if (userRole === 'patient') {
        if (pathname.startsWith('/admin') || 
            pathname.startsWith('/consultant-dashboard') || 
            pathname.startsWith('/receptionist-dashboard')) {
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
        if (pathname === '/login' || pathname === '/register') {
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // For any other cases, allow the request.
    return NextResponse.next();
}

// Configure the middleware to run on all routes.
export const config = {
    matcher: '/:path*',
};
