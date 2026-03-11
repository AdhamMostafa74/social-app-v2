// proxy.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.BETTER_AUTH_SECRET;
export async function proxy(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: secret,
    });

    const isLoggedIn = !!token;
    const { pathname } = request.nextUrl;

    // Always allow auth-related routes through
    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // Always allow public pages through
    const publicPages = ["/auth/login", "/auth/register"];
    if (publicPages.includes(pathname)) {
        return NextResponse.next();
    }

    // Redirect to sign in if not authenticated
    if (!isLoggedIn) {
        const signInUrl = new URL("/auth/login", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname); // remember where they were going
        return NextResponse.redirect(signInUrl);
    }

    if (isLoggedIn && publicPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};