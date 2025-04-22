// lib/supabase/middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function createClient(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          // This is needed to set cookies for the current page
          request.cookies.set({
            name,
            value,
            ...options,
          });
          // This is needed to set cookies for the browser
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          // This is needed to delete cookies from the current page
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          // This is needed to delete cookies from the browser
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  return { supabase, response };
}
