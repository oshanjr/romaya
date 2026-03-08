import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAdmin = (req.auth?.user as any)?.role === "ADMIN";
    const { pathname } = req.nextUrl;

    // ── Protected: /admin/* — ADMIN only
    if (pathname.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login?callbackUrl=/admin", req.url));
        }
        if (!isAdmin) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // ── Protected: /account/* — any authenticated user
    if (pathname.startsWith("/account")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(
                new URL(`/login?callbackUrl=${pathname}`, req.url)
            );
        }
    }

    // ── Protected: /checkout — any authenticated user
    // (Guest checkout is still allowed — the redirect only hits if we want to lock it)

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*", "/account/:path*"],
};
