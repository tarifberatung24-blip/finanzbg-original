import { updateSession } from "./lib/supabase/proxy"
import { NextRequest, NextResponse } from "next/server"
import { defaultLocale, isLocale, LOCALE_COOKIE_KEY } from "./lib/i18n/routing"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const segment = pathname.split("/")[1]

  if (isLocale(segment)) {
    request.cookies.set(LOCALE_COOKIE_KEY, segment)
    const internalUrl = request.nextUrl.clone()
    internalUrl.pathname = pathname.slice(segment.length + 1) || "/"
    const sessionResponse = await updateSession(new NextRequest(internalUrl, request))
    if (sessionResponse.headers.get("location")) return sessionResponse
    const rewriteResponse = NextResponse.rewrite(internalUrl)
    sessionResponse.cookies.getAll().forEach((cookie) => rewriteResponse.cookies.set(cookie))
    rewriteResponse.cookies.set(LOCALE_COOKIE_KEY, segment, { path: "/", maxAge: 31536000, sameSite: "lax" })
    return rewriteResponse
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return await updateSession(request)
  }

  const locale = request.cookies.get(LOCALE_COOKIE_KEY)?.value
  const resolvedLocale = isLocale(locale) ? locale : defaultLocale
  const url = request.nextUrl.clone()
  url.pathname = `/${resolvedLocale}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
