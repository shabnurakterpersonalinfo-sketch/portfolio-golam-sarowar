import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Presentation } from "lucide-react"
import Link from "next/link"
import { HERO_SLIDE_TYPES, MAX_HERO_SLIDES } from "@/lib/hero-slides"

export default async function AdminHeroSlides() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: slides } = await supabase
    .from("hero_slides")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })

  const count = slides?.length ?? 0
  const canAdd = count < MAX_HERO_SLIDES

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Hero Slides</h1>
          <p className="text-muted-foreground mt-1">
            Slide 1 is always your introduction. Add up to {MAX_HERO_SLIDES} more slides that highlight a section
            ({count}/{MAX_HERO_SLIDES} used).
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

      <div className="space-y-4">
        <Card className="border-l-4 border-primary/40 bg-muted/30">
          <CardContent className="p-6 flex items-center gap-4">
            <span className="text-sm font-bold text-muted-foreground w-6">1</span>
            <div>
              <h3 className="text-lg font-bold text-foreground">Introduction</h3>
              <p className="text-sm text-muted-foreground">Name, title, bio and photo from your Profile. Always first.</p>
            </div>
          </CardContent>
        </Card>

        {slides?.map((slide, index) => {
          const type = HERO_SLIDE_TYPES[slide.slide_type]
          return (
            <Card key={slide.id} className="border-l-4 border-primary">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-muted-foreground w-6">{index + 2}</span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{slide.heading || type?.defaultHeading}</h3>
                      <p className="text-sm text-primary font-medium mt-1">
                        {type?.label ?? slide.slide_type} · latest {slide.item_limit} entries
                      </p>
                      {!slide.is_active && <p className="text-sm text-muted-foreground mt-1">Hidden</p>}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/hero-slides/${slide.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {count === 0 && (
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
    </div>
  )
}
