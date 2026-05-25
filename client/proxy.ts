import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const nextAuthSession = request.cookies.get("next-auth.session-token")?.value;
    const secureNextAuthSession = request.cookies.get("__Secure-next-auth.session-token")?.value;

    const protectedRoutes = ["/chat", "/profile"];

    const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    const isAuth = !!(token || nextAuthSession || secureNextAuthSession);

    if (isProtected && !isAuth) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const authRoutes = ["/sign-in", "/sign-up"];
    const isAuthRoute = authRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );
    
    if (isAuthRoute && (token)) {
        return NextResponse.redirect(new URL("/chat", request.url));
    }

    return NextResponse.next();
    
}

export const config = {
    matcher: ["/chat/:path*", "/profile/:path*", "/sign-in","/sign-up",],
};