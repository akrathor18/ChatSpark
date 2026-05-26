import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  const sessionToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const apiToken = sessionToken?.backendToken as string | undefined;

  if (!apiToken) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  let isOnboarded = false;

  try {
    // The server auth middleware reads tokens from cookies, not Authorization headers.
    // Send the token as a cookie so the server can authenticate the request.
    const res = await fetch(`${API_URL}/users/me`, {
      headers: {
        Cookie: `token=${apiToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`API responded with ${res.status}`);
    }

    const user = await res.json();
    isOnboarded = Boolean(user?.username?.trim());
  } catch (err) {
    console.error("[sync-token] Failed:", err);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const redirectPath = isOnboarded ? "/chat" : "/onboarding";
  const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || "https://chatspark-dev.vercel.app";
  const finalRedirect = `${frontendUrl}${redirectPath}`;

  const backendCookieUrl = `${API_URL}/auth/set-oauth-cookie?token=${apiToken}&redirect=${encodeURIComponent(finalRedirect)}`;

  const response = NextResponse.redirect(new URL(backendCookieUrl));
  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
}