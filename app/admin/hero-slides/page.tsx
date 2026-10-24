import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Presentation } from "lucide-react"
import Link from "next/link"
import { HeroSlideList, HeroSlideTiming } from "@/components/hero-slide-list"
import { INTRODUCTION_SLIDE, MAX_HERO_SLIDES, getOrderedHeroSlides, heroSlideIntervalMs } from "@/lib/hero-slides"

export default async function AdminHeroSlides() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const slides = await getOrderedHeroSlides(supabase)
  const { data: profile } = await supabase.from("profiles").select("*").maybeSingle()
  const hasTimingColumn = !!profile && "hero_slide_interval_seconds" in profile
  const sectionSlideCount = slides.filter((slide) => slide.slide_type !== INTRODUCTION_SLIDE).length
  const hasIntroduction = slides.length > sectionSlideCount
  const canAdd = sectionSlideCount < MAX_HERO_SLIDES

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Hero Slides</h1>
          <p className="text-muted-foreground mt-1">
            Drag slides to change their order, or use the arrows. Add up to {MAX_HERO_SLIDES} section slides (
            {sectionSlideCount}/{MAX_HERO_SLIDES} used).
          </p>
        </div>
        {canAdd ? (
          <Button asChild className="bg-primary hover:bg-primary-dark">
            <Link href="/admin/hero-slides/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Slide
            </Link>
          </Button>
        ) : (
          <Button disabled className="bg-primary">
            Limit reached
          </Button>
        )}
      </div>

      {!hasIntroduction && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4 text-sm text-amber-900">
            The Introduction slide can&apos;t be moved or hidden yet. Run the
            <code className="mx-1">20261023000000_hero_slides_selection_and_intro.sql</code>
            migration in Supabase to enable it. Until then it always shows first.
          </CardContent>
        </Card>
      )}

      {profile && hasTimingColumn && (
        <HeroSlideTiming profileId={profile.id} initialSeconds={heroSlideIntervalMs(profile) / 1000} />
      )}

      {profile && !hasTimingColumn && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4 text-sm text-amber-900">
            The time per slide can&apos;t be changed yet. Run the
            <code className="mx-1">20261024000000_hero_slider_interval.sql</code>
            migration in Supabase to enable it. Until then each slide shows for 5 seconds.
          </CardContent>
        </Card>
      )}

      {slides.length > 0 ? (
        <HeroSlideList initialSlides={slides} />
      ) : (
        <Card>
          <CardContent className="p-12 text-center space-y-2">
            <Presentation className="h-8 w-8 text-primary mx-auto" />
            <p className="text-muted-foreground">
              No extra slides yet. Click &quot;Add Slide&quot; to highlight a section in the homepage hero.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
