import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. Set them in .env.local for this client's own Supabase project.",
  )
}

// Non-null: validated by the guard above, which runs once at module load.
const validatedUrl: string = supabaseUrl
const validatedAnonKey: string = supabaseAnonKey

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(validatedUrl, validatedAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Handle refresh token errors gracefully (invalid/expired tokens)
    // These are expected when users aren't logged in or sessions expired
    const isRefreshTokenError =
      error && ((error as any).code === "refresh_token_not_found" || error.message?.includes("Refresh Token"))

    // Protect admin routes only if user check was successful and not a refresh token error
    if (!isRefreshTokenError && request.nextUrl.pathname.startsWith("/admin") && !user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }
  } catch (error: unknown) {
    // Silently handle refresh token errors - they're expected for unauthenticated users
    const isRefreshTokenError =
      error &&
      typeof error === "object" &&
      ((error as any).code === "refresh_token_not_found" ||
        (error as Error)?.message?.includes("Refresh Token") ||
        (error as any).__isAuthError)

    // Only log unexpected errors
    if (!isRefreshTokenError) {
      console.error("Unexpected auth error:", error)
    }
  }

  return supabaseResponse
}
