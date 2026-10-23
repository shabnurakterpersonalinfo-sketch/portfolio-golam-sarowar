import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HeroSlideForm } from "@/components/hero-slide-form"
import { INTRODUCTION_SLIDE, getOrderedHeroSlides, heroSlideTitle } from "@/lib/hero-slides"

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

  const slides = await getOrderedHeroSlides(supabase)
  const position = slides.findIndex((slide) => slide.id === id)

  if (position === -1) {
    redirect("/admin/hero-slides")
  }

  const slide = slides[position]
  const siblings = slides
    .filter((other) => other.id !== id)
    .map((other) => ({ id: other.id as string, title: heroSlideTitle(other) }))
  const isIntroduction = slide.slide_type === INTRODUCTION_SLIDE

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">{isIntroduction ? "Introduction Slide" : "Edit Hero Slide"}</h1>
        <p className="text-muted-foreground mt-1">
          {isIntroduction ? "Show, hide or move your introduction slide" : "Update a homepage hero slide"}
        </p>
      </div>

      <HeroSlideForm slide={{ ...slide, position }} siblings={siblings} />
    </div>
  )
}
