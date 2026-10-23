import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HeroSlideForm } from "@/components/hero-slide-form"
import { INTRODUCTION_SLIDE, MAX_HERO_SLIDES, getOrderedHeroSlides, heroSlideTitle } from "@/lib/hero-slides"

export default async function NewHeroSlide() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const slides = await getOrderedHeroSlides(supabase)

  if (slides.filter((slide) => slide.slide_type !== INTRODUCTION_SLIDE).length >= MAX_HERO_SLIDES) {
    redirect("/admin/hero-slides")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Add Hero Slide</h1>
        <p className="text-muted-foreground mt-1">Choose a section to highlight in the homepage slider</p>
      </div>

      <HeroSlideForm siblings={slides.map((slide) => ({ id: slide.id as string, title: heroSlideTitle(slide) }))} />
    </div>
  )
}
