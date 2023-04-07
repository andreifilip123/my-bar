import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = [
  "/",
  "/api/trpc/example*",
  "/login*",
  "/signup*",
  "/cocktails",
  "/cocktail-of-the-week",
];

const isPublic = (path: string) => {
  return publicPaths.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/|\\.)"))),
  );
};

export default withClerkMiddleware((request: NextRequest) => {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  // if the user is not signed in redirect them to the sign in page.
  const { userId } = getAuth(request);

  if (!userId) {
    // redirect the users to /pages/sign-in/[[...index]].ts

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
});

// Stop Middleware running on static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
    "/",
  ],
};
