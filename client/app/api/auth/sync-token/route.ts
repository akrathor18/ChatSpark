import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // getToken reads the raw JWT from the session cookie — more reliable than getServerSession
  const jwtToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const backendToken = jwtToken?.backendToken as string | undefined;

  // Determine where to redirect after syncing (default: /chat)
  const next = req.nextUrl.searchParams.get("next") || "/chat";

  if (!backendToken) {
    console.warn("[sync-token] No backendToken found in JWT. jwtToken:", jwtToken);
    return NextResponse.redirect(new URL(next, req.url));
  }

  const response = NextResponse.redirect(new URL(next, req.url));

  // Set the backend token as an httpOnly cookie on the BROWSER response
  response.cookies.set("token", backendToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

