import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Route yang boleh diakses tanpa login
const publicRoutes = ["/login", "/api/auth"];

// Route yang harus dilindungi (prefix matching)
const protectedPrefixes = ["/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek apakah ini route publik
  const isPublic = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Cek apakah ini route yang dilindungi
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // Baca JWT session token dari cookie NextAuth (v4)
  // NextAuth v4 menyimpan token di cookie bernama: next-auth.session-token
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  // Jika akses route yang dilindungi tapi belum login → tendang ke /login
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login tapi masih di halaman login / root → redirect ke dashboard
  if (isLoggedIn && (pathname === "/login" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Konfigurasi path yang dijalankan proxy
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf)$).*)",
  ],
};
