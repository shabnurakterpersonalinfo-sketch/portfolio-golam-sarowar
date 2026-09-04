import { GalleryForm } from "@/components/gallery-form"

export default function NewGalleryItem() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Add Gallery Story</h1>
        <p className="text-muted-foreground mt-1">Add a new moment to the gallery timeline</p>
      </div>

      <GalleryForm />
    </div>
  )
}
