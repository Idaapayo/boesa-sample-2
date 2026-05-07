import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "boesa_invite";

export function proxy(req: NextRequest) {
  const token = process.env.INVITE_TOKEN!;
  const query = req.nextUrl.searchParams.get("invite");
  const cookie = req.cookies.get(COOKIE)?.value;

  if (query === token) {
    const res = NextResponse.redirect(new URL("/upload", req.url));
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  if (cookie === token) return NextResponse.next();

  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/upload/:path*"],
};
