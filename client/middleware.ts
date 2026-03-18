import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    const protectedRoutes = ["/chat", "/profile"];

    const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtected && !token) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/chat/:path*", "/profile/:path*"],
};