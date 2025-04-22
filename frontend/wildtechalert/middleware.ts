import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabase, response } = await createClient(request);
  const { pathname } = request.nextUrl;

  // Refresh session (important for all routes)
  await supabase.auth.getSession();

  // Get current user (only if needed)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Redirect logged-in users away from auth pages (login/signup)
  if (user && ["/login", "/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 2. Protect only `/admin` routes (if user is not logged in or not approved)
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("status, role")
      .eq("user_id", user.id)
      .single();

    if (profile?.status !== "approved") {
      return NextResponse.redirect(new URL("/auth/pending", request.url));
    } else if (profile?.status === "rejected") {
      return NextResponse.redirect(new URL("/auth/rejected", request.url));
    }
    const adminSettingsProtectedRoutes = [
      "/admin/settings/approvals",
      "/admin/settings/registration",
    ];
    const adminStakeholdersProtectedRoutes = ["/admin/stakeholders"];

    if (
      adminSettingsProtectedRoutes.some((route) => pathname.startsWith(route))
    ) {
      if (profile?.role !== "admin") {
        return NextResponse.redirect(
          new URL("/admin/settings/profile", request.url)
        );
      }
    }

    if (
      adminStakeholdersProtectedRoutes.some((route) =>
        pathname.startsWith(route)
      )
    ) {
      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
