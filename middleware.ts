import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organization(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, orgId, redirectToSignIn } = await auth();

  // ✅ Any logged-in user on "/" → My Organizations
  if (userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/organizations", req.url));
  }

  // ❌ Not logged in but accessing protected route
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // ✅ Allow access to /organizations even without orgId
  if (req.nextUrl.pathname.startsWith("/organizations")) {
    return NextResponse.next();
  }

  // ❌ Logged in but no org → force onboarding (only for other protected routes)
  if (
    userId &&
    !orgId &&
    req.nextUrl.pathname !== "/onboarding" &&
    req.nextUrl.pathname !== "/" &&
    isProtectedRoute(req)
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
