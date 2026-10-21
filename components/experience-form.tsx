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
import { EntryLogoField, EntryMediaEditor } from "@/components/entry-media-editor"
import { type EntryMediaItem, parseEntryMedia } from "@/lib/entry-media"

interface ExperienceFormProps {
  experience?: any
}

export function ExperienceForm({ experience }: ExperienceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [logoUrl, setLogoUrl] = useState<string>(experience?.logo_url || "")
  const [media, setMedia] = useState<EntryMediaItem[]>(parseEntryMedia(experience?.media))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget

    const supabase = createClient()

    const formData = new FormData(form)
    const responsibilities = (formData.get("responsibilities") as string)
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r)

    const data = {
      position: formData.get("position") as string,
      organization: formData.get("organization") as string,
      project_name: formData.get("project_name") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      location: formData.get("location") as string,
      employment_type: formData.get("employment_type") as string,
      description: formData.get("description") as string,
      responsibilities,
      category: formData.get("category") as string,
      logo_url: logoUrl || null,
      website_url: (formData.get("website_url") as string) || null,
      media: media.filter((item) => item.url),
    }

    try {
      if (experience) {
        const { error: updateError } = await supabase.from("experiences").update(data).eq("id", experience.id)
        if (updateError) throw updateError
        toast({
          title: "Success!",
          description: "Experience updated successfully.",
        })
      } else {
        const { error: insertError } = await supabase.from("experiences").insert(data)
        if (insertError) throw insertError
        toast({
          title: "Success!",
          description: "Experience created successfully.",
        })
      }

      router.push("/admin/experiences")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!experience || !confirm("Are you sure you want to delete this experience?")) return

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: deleteError } = await supabase.from("experiences").delete().eq("id", experience.id)
      if (deleteError) throw deleteError

      toast({
        title: "Success!",
        description: "Experience deleted successfully.",
      })

      router.push("/admin/experiences")
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                defaultValue={experience?.position}
                required
                placeholder="Research Associate"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                name="organization"
                defaultValue={experience?.organization}
                required
                placeholder="Organization name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_name">Project Name (Optional)</Label>
            <Input
              id="project_name"
              name="project_name"
              defaultValue={experience?.project_name}
              placeholder="Project name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                defaultValue={experience?.start_date}
                required
                placeholder="Oct 2025"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input id="end_date" name="end_date" defaultValue={experience?.end_date} placeholder="Present" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={experience?.location} placeholder="Remote" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employment_type">Employment Type</Label>
              <Input
                id="employment_type"
                name="employment_type"
                defaultValue={experience?.employment_type || "Full Time"}
                placeholder="Full Time, Part Time, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                defaultValue={experience?.category || "Research"}
                placeholder="Research, Teaching, Industry, etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={experience?.description}
              rows={3}
              placeholder="Brief description of the role"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
            <Textarea
              id="responsibilities"
              name="responsibilities"
              defaultValue={experience?.responsibilities?.join("\n")}
              rows={6}
              placeholder="• Analyzed panel datasets...&#10;• Estimated difference-in-differences models...&#10;• Designed stakeholder surveys..."
            />
          </div>

          <EntryLogoField
            logoUrl={logoUrl}
            onLogoChange={setLogoUrl}
            websiteUrl={experience?.website_url}
            websiteLabel="Company Website / Portfolio Link"
          />

          <EntryMediaEditor value={media} onChange={setMedia} hint="Workplace photos, training certificates and company or project links, shown under this experience like on LinkedIn." />

          <div className="flex gap-3">
            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={loading}>
              {loading ? "Saving..." : experience ? "Update" : "Create"}
            </Button>

            {experience && (
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
