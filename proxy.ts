import { NextRequest, NextResponse } from "next/server";

import { auth } from "./auth";

export default async function proxy(request: NextRequest) {
  const session = await auth();

  if (session) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: ["/setting", "/admin", "/server", "/client"],
};
