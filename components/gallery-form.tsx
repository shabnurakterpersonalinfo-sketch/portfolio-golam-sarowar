"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface GalleryFormProps {
  item?: any
}

export function GalleryForm({ item }: GalleryFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState(item?.image || "")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget

    const supabase = createClient()

    const formData = new FormData(form)
    const data = {
      title: formData.get("title") as string,
      event_date: formData.get("event_date") as string,
      location: formData.get("location") as string,
      summary: formData.get("summary") as string,
      story: formData.get("story") as string,
      external_link: formData.get("external_link") as string,
      image: imagePreview,
    }

    try {
      if (item) {
        const { error: updateError } = await supabase.from("gallery_items").update(data).eq("id", item.id)
        if (updateError) throw updateError
        toast({
          title: "Success!",
          description: "Gallery story updated successfully.",
        })
      } else {
        const { error: insertError } = await supabase.from("gallery_items").insert(data)
        if (insertError) throw insertError
        toast({
          title: "Success!",
          description: "Gallery story created successfully.",
        })
      }

      router.push("/admin/gallery")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `gallery-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("gallery-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("gallery-images").getPublicUrl(filePath)

      setImagePreview(publicUrl)
      toast({
        title: "Success!",
        description: "Photo uploaded successfully.",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to upload photo. " + err.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!item || !confirm("Are you sure you want to delete this gallery story?")) return

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: deleteError } = await supabase.from("gallery_items").delete().eq("id", item.id)
      if (deleteError) throw deleteError

      toast({
        title: "Success!",
        description: "Gallery story deleted successfully.",
      })

      router.push("/admin/gallery")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={item?.title}
              required
              placeholder="e.g., Speaking at the Youth Leadership Summit"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event_date">Date</Label>
              <Input
                id="event_date"
                name="event_date"
                defaultValue={item?.event_date}
                required
                placeholder="e.g., Aug 2026"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input id="location" name="location" defaultValue={item?.location} placeholder="City, Country" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Short Summary</Label>
            <Input
              id="summary"
              name="summary"
              defaultValue={item?.summary}
              placeholder="One line shown in the homepage preview list"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story">Full Story</Label>
            <Textarea
              id="story"
              name="story"
              defaultValue={item?.story}
              rows={5}
              placeholder="The longer story shown on the full gallery timeline page"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="external_link">External Link (Optional)</Label>
            <Input
              id="external_link"
              name="external_link"
              type="url"
              defaultValue={item?.external_link}
              placeholder="Link to a full album, post, or article about this moment"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Photo</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {imagePreview && (
              <div className="mt-4 relative w-full h-64 border rounded-lg overflow-hidden bg-gray-50">
                <Image src={imagePreview} alt="Gallery preview" fill className="object-contain" />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              This photo appears in the homepage preview and on the full gallery timeline.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={loading}>
              {loading ? "Saving..." : item ? "Update" : "Create"}
            </Button>

            {item && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
                Delete
              </Button>
            )}

            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
