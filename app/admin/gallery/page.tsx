import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Camera } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function AdminGallery() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: galleryItems } = await supabase
    .from("gallery_items")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gallery</h1>
          <p className="text-muted-foreground mt-1">Manage the photo/story timeline shown on the site</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href="/admin/gallery/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Story
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems?.map((item) => (
          <Card key={item.id} className="border-t-4 border-primary overflow-hidden">
            <div className="relative w-full h-40 bg-muted">
              {item.image ? (
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Camera className="h-10 w-10 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <p className="text-xs font-bold tracking-widest text-primary uppercase">{item.event_date}</p>
              <h3 className="font-bold text-foreground text-balance mt-1">{item.title}</h3>
              {item.summary && <p className="text-sm text-muted-foreground mt-1 mb-4">{item.summary}</p>}
              <Button asChild size="sm" variant="outline" className="w-full bg-transparent mt-2">
                <Link href={`/admin/gallery/${item.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        {(!galleryItems || galleryItems.length === 0) && (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No gallery stories yet. Click &quot;Add Story&quot; to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
