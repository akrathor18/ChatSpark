import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const jwtToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const backendToken = jwtToken?.backendToken as string | undefined;

  if (!backendToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Fetch user from backend
  let isOnboarded = false;

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/api/user/me`, {
      headers: {
        Authorization: `Bearer ${backendToken}`,
      },
    });

    const user = await res.json();

    isOnboarded = Boolean(user?.username?.trim());
  } catch (err) {
    console.error("[sync-token] Failed to fetch user:", err);
  }


  const redirectPath = isOnboarded ? "/chat" : "/onboarding";
  const response = NextResponse.redirect(new URL(redirectPath, req.url));

  // Fix race condition: prevent browser/middleware from caching the unauthorized state
  response.headers.set('Cache-Control', 'no-store, max-age=0');

 
  response.cookies.set("token", backendToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}