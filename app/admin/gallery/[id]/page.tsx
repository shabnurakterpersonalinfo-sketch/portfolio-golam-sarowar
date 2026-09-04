import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { GalleryForm } from "@/components/gallery-form"

export default async function EditGalleryItem({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === "new") {
    redirect("/admin/gallery/new")
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: item } = await supabase.from("gallery_items").select("*").eq("id", id).single()

  if (!item) {
    redirect("/admin/gallery")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Edit Gallery Story</h1>
        <p className="text-muted-foreground mt-1">Update this moment in the gallery timeline</p>
      </div>

      <GalleryForm item={item} />
    </div>
  )
}
