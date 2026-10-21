import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HeroSlideForm } from "@/components/hero-slide-form"

export default async function EditHeroSlide({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === "new") {
    redirect("/admin/hero-slides/new")
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: slide } = await supabase.from("hero_slides").select("*").eq("id", id).single()

  if (!slide) {
    redirect("/admin/hero-slides")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Edit Hero Slide</h1>
        <p className="text-muted-foreground mt-1">Update a homepage hero slide</p>
      </div>

      <HeroSlideForm slide={slide} />
    </div>
  )
}
