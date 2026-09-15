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
import { Loader2, FileText } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ProfileFormProps {
  profile: any
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState(profile?.profile_image || "")
  const [cvUrl, setCvUrl] = useState(profile?.cv_url || "")
  const [cvFileName, setCvFileName] = useState("")
  const [uploadingCv, setUploadingCv] = useState(false)
  const { toast } = useToast()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("profile-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath)

      setImagePreview(publicUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file for your CV.")
      return
    }

    setUploadingCv(true)
    setError(null)

    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `cv-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("cv-files").upload(filePath, file, {
        contentType: "application/pdf",
        upsert: true,
      })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("cv-files").getPublicUrl(filePath)

      setCvUrl(publicUrl)
      setCvFileName(file.name)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingCv(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const form = e.currentTarget

    const supabase = createClient()

    const formData = new FormData(form)
    const data = {
      full_name: formData.get("full_name") as string,
      title: formData.get("title") as string,
      bio: formData.get("bio") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      profile_image: imagePreview,
      linkedin_url: formData.get("linkedin_url") as string,
      facebook_url: formData.get("facebook_url") as string,
      github_url: formData.get("github_url") as string,
      orcid_url: formData.get("orcid_url") as string,
      twitter_url: formData.get("twitter_url") as string,
      researchgate_url: formData.get("researchgate_url") as string,
      googlescholar_url: formData.get("googlescholar_url") as string,
      youtube_url: formData.get("youtube_url") as string,
      cv_url: cvUrl,
    }

    try {
      if (profile) {
        const { error: updateError } = await supabase.from("profiles").update(data).eq("id", profile.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from("profiles").insert(data)
        if (insertError) throw insertError
      }

      setSuccess(true)
      toast({
        title: "Success!",
        description: "Profile updated successfully.",
      })
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

          {success && (
            <Alert>
              <AlertDescription>Profile updated successfully!</AlertDescription>
            </Alert>
          )}

          {/* Profile Image */}
          <div className="space-y-4">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-6">
              {imagePreview && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="max-w-xs"
                />
                {uploading && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* CV / Resume */}
          <div className="space-y-4">
            <Label>CV / Resume (PDF)</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleCvUpload}
                disabled={uploadingCv}
                className="max-w-xs"
              />
              {uploadingCv && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </p>
              )}
              {!uploadingCv && cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {cvFileName || "View current CV"}
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a PDF to replace the current CV. This is the file visitors get from the “Download CV” button.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile?.full_name}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={profile?.title}
                required
                placeholder="Your professional title"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              defaultValue={profile?.bio}
              required
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={profile?.email} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={profile?.phone} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={profile?.address} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input id="linkedin_url" name="linkedin_url" defaultValue={profile?.linkedin_url} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input id="facebook_url" name="facebook_url" defaultValue={profile?.facebook_url} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input id="github_url" name="github_url" defaultValue={profile?.github_url} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orcid_url">ORCID iD URL</Label>
              <Input
                id="orcid_url"
                name="orcid_url"
                defaultValue={profile?.orcid_url}
                placeholder="https://orcid.org/0000-0000-0000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter / X URL</Label>
              <Input
                id="twitter_url"
                name="twitter_url"
                defaultValue={profile?.twitter_url}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="researchgate_url">ResearchGate URL</Label>
              <Input
                id="researchgate_url"
                name="researchgate_url"
                defaultValue={profile?.researchgate_url}
                placeholder="https://www.researchgate.net/profile/your-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googlescholar_url">Google Scholar URL</Label>
              <Input
                id="googlescholar_url"
                name="googlescholar_url"
                defaultValue={profile?.googlescholar_url}
                placeholder="https://scholar.google.com/citations?user=..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube Channel URL</Label>
              <Input
                id="youtube_url"
                name="youtube_url"
                defaultValue={profile?.youtube_url}
                placeholder="https://www.youtube.com/@yourchannel"
              />
            </div>
          </div>

          <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
