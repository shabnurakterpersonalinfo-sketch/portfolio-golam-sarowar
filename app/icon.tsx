import { ImageResponse } from "next/og"
import { createClient } from "@/lib/supabase/server"

export const size = {
  width: 32,
  height: 32,
}

export const contentType = "image/png"

export default async function Icon() {
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("profile_image").single()

  // If profile image exists, try to fetch it and use it
  // Otherwise, fall back to default icon
  if (profile?.profile_image) {
    try {
      const imageResponse = await fetch(profile.profile_image)
      if (imageResponse.ok) {
        const imageBuffer = await imageResponse.arrayBuffer()
        return new ImageResponse(
          (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                borderRadius: "50%",
              }}
            >
              <img
                src={profile.profile_image}
                alt="Profile"
                width={32}
                height={32}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
          ),
          {
            ...size,
          }
        )
      }
    } catch (error) {
      // Fall through to default
    }
  }

  // Default icon - return a simple colored circle or use existing icon
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#036445",
          borderRadius: "50%",
        }}
      >
        <span style={{ color: "white", fontSize: "20px", fontWeight: "bold" }}>MS</span>
      </div>
    ),
    {
      ...size,
    }
  )
}

