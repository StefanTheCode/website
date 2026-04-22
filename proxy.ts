import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "thecodeman.net";

function isLocalHost(host: string) {
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export function proxy(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = (forwardedHost ?? request.headers.get("host") ?? "").toLowerCase();

  if (!host || isLocalHost(host)) {
    return NextResponse.next();
  }

  const hostWithoutPort = host.split(":")[0];
  const isDomainHost =
    hostWithoutPort === CANONICAL_HOST || hostWithoutPort === `www.${CANONICAL_HOST}`;

  if (!isDomainHost) {
    return NextResponse.next();
  }

  const proto = (request.headers.get("x-forwarded-proto") ?? "https").toLowerCase();
  const mustRedirect = hostWithoutPort !== CANONICAL_HOST || proto !== "https";

  if (!mustRedirect) {
    return NextResponse.next();
  }

  const canonicalUrl = `https://${CANONICAL_HOST}${request.nextUrl.pathname}${request.nextUrl.search}`;

  return NextResponse.redirect(canonicalUrl, 308);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
