import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, MapPin, ArrowUpRight } from "lucide-react"
import Image from "next/image"

// Force dynamic rendering to prevent caching in production
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: galleryItems } = await supabase
    .from("gallery_items")
    .select("*")
    .order("display_order", { ascending: true })

  const items = galleryItems || []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="GALLERY"
        subtitle="A timeline of moments, milestones, and stories from the journey so far."
        backgroundType="gallery"
      />

      <main className="flex-1 py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No gallery stories available yet.</p>
          ) : (
            <div className="relative">
              {/* Connecting timeline line */}
              <div
                className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-border hidden sm:block"
                aria-hidden="true"
              />

              <div className="space-y-10">
                {items.map((item) => (
                  <div key={item.id} className="relative flex gap-6">
                    {/* Timeline dot */}
                    <div className="hidden sm:flex flex-col items-center flex-shrink-0 w-14 pt-1">
                      <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary-light z-10" />
                    </div>

                    <Card className="flex-1 overflow-hidden border-l-4 border-primary hover:shadow-lg transition-shadow">
                      <div className="md:flex">
                        <div className="relative w-full md:w-64 h-56 md:h-auto bg-muted flex-shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Camera className="h-12 w-12 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-6 flex-1">
                          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
                            {item.event_date}
                          </p>
                          <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>

                          {item.location && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span>{item.location}</span>
                            </div>
                          )}

                          {(item.story || item.summary) && (
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                              {item.story || item.summary}
                            </p>
                          )}

                          {item.external_link && (
                            <a
                              href={item.external_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-4"
                            >
                              View full story <ArrowUpRight className="h-4 w-4" />
                            </a>
                          )}
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
