"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { X } from "lucide-react"

interface PublicationFormProps {
  publication?: any
}

export function PublicationForm({ publication }: PublicationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState(publication?.category || "Academic Publication")
  const [status, setStatus] = useState(publication?.status || "Published")
  const [conferenceImages, setConferenceImages] = useState<string[]>(publication?.conference_images || [])
  const [conferenceVideos, setConferenceVideos] = useState<string[]>(publication?.conference_videos || [])
  const [conferencePdf, setConferencePdf] = useState(publication?.conference_paper_pdf || "")
  const [academicPdf, setAcademicPdf] = useState(publication?.academic_pdf || "")
  const { toast } = useToast()

  useEffect(() => {
    if (publication) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing form fields to the externally-controlled publication prop on edit
      setCategory(publication.category || "Academic Publication")
      setStatus(publication.status || "Published")
      setConferenceImages(publication.conference_images || [])
      setConferenceVideos(publication.conference_videos || [])
      setConferencePdf(publication.conference_paper_pdf || "")
      setAcademicPdf(publication.academic_pdf || "")
    }
  }, [publication])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    const supabase = createClient()
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split(".").pop()
        const fileName = `conference-${Math.random().toString(36).substring(7)}-${i}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage.from("conference-images").upload(filePath, file)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("conference-images").getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      setConferenceImages([...conferenceImages, ...uploadedUrls])
      toast({
        title: "Success!",
        description: `${uploadedUrls.length} image(s) uploaded successfully.`,
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to upload images. " + err.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `conference-paper-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("conference-pdfs").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("conference-pdfs").getPublicUrl(filePath)

      setConferencePdf(publicUrl)
      toast({
        title: "Success!",
        description: "Conference paper PDF uploaded successfully.",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to upload PDF. " + err.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    const supabase = createClient()
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Check file size (30MB = 30 * 1024 * 1024 bytes)
        const maxSize = 30 * 1024 * 1024
        if (file.size > maxSize) {
          throw new Error(`File "${file.name}" exceeds 30MB limit. Please upload a smaller file.`)
        }

        const fileExt = file.name.split(".").pop()
        const fileName = `conference-video-${Math.random().toString(36).substring(7)}-${i}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage.from("conference-videos").upload(filePath, file)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("conference-videos").getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      }

      setConferenceVideos([...conferenceVideos, ...uploadedUrls])
      toast({
        title: "Success!",
        description: `${uploadedUrls.length} video(s) uploaded successfully.`,
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to upload videos. " + err.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setConferenceImages(conferenceImages.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    setConferenceVideos(conferenceVideos.filter((_, i) => i !== index))
  }

  const handleAcademicPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `academic-paper-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("academic-pdfs").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("academic-pdfs").getPublicUrl(filePath)

      setAcademicPdf(publicUrl)
      toast({
        title: "Success!",
        description: "Academic paper PDF uploaded successfully.",
      })
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to upload PDF. " + err.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget

    const supabase = createClient()

    const formData = new FormData(form)
    const keywords = (formData.get("keywords") as string)
      ?.split(",")
      .map((k) => k.trim())
      .filter((k) => k) || []

    const baseData: any = {
      category: category,
      abstract: formData.get("abstract") as string,
      keywords,
    }

    // Add category-specific fields
    if (category === "Conference Publication") {
      // For Conference Publication, use conference_title (paper title) as the main title
      const paperTitle = formData.get("conference_title") as string
      const conferenceName = formData.get("conference_name") as string
      
      // Use paper title as the main title field (required by database)
      baseData.title = paperTitle || publication?.title || publication?.conference_title || ""
      baseData.authors = formData.get("authors") as string || publication?.authors || ""
      baseData.publication_date = formData.get("publication_date") as string || publication?.publication_date || null
      baseData.status = status
      // Store conference name in conference_title field
      baseData.conference_title = conferenceName || publication?.conference_title || ""
      baseData.conference_organizer = formData.get("conference_organizer") as string
      baseData.location = formData.get("location") as string
      baseData.conference_images = conferenceImages
      baseData.conference_videos = conferenceVideos
      baseData.conference_paper_pdf = conferencePdf
      // Clear journal and url for conference publications
      baseData.journal = null
      baseData.url = null
    } else if (category === "Academic Publication") {
      baseData.title = formData.get("title") as string
      baseData.authors = formData.get("authors") as string
      baseData.publication_date = formData.get("publication_date") as string
      baseData.status = status
      baseData.journal = formData.get("journal") as string || null
      baseData.academic_pdf = academicPdf || null
      baseData.citation_count = formData.get("citation_count") ? parseInt(formData.get("citation_count") as string) || 0 : 0
      // Clear URL and conference fields for academic publications
      baseData.url = null
      baseData.conference_title = null
      baseData.conference_organizer = null
      baseData.location = null
      baseData.conference_images = null
      baseData.conference_videos = null
      baseData.conference_paper_pdf = null
    } else if (category === "Non-Academic Publication") {
      baseData.title = formData.get("title") as string
      baseData.authors = formData.get("authors") as string
      baseData.publication_date = formData.get("publication_date") as string
      baseData.status = status
      baseData.journal = formData.get("journal") as string || null
      baseData.url = formData.get("url") as string || null
      // Clear academic PDF and conference fields
      baseData.academic_pdf = null
      baseData.citation_count = null
      baseData.conference_title = null
      baseData.conference_organizer = null
      baseData.location = null
      baseData.conference_images = null
      baseData.conference_videos = null
      baseData.conference_paper_pdf = null
    } else if (category === "Work in Progress") {
      baseData.title = formData.get("title") as string
      baseData.authors = formData.get("authors") as string
      baseData.publication_date = formData.get("publication_date") as string
      baseData.status = status
      baseData.abstract = formData.get("abstract") as string || null
      // Clear all optional fields for work in progress
      baseData.journal = null
      baseData.url = null
      baseData.conference_title = null
      baseData.conference_organizer = null
      baseData.location = null
      baseData.conference_images = null
      baseData.conference_videos = null
      baseData.conference_paper_pdf = null
      baseData.academic_pdf = null
      baseData.citation_count = null
    }

    try {
      if (publication) {
        const { error: updateError } = await supabase.from("publications").update(baseData).eq("id", publication.id)
        if (updateError) throw updateError
        toast({
          title: "Success!",
          description: "Publication updated successfully.",
        })
      } else {
        const { error: insertError } = await supabase.from("publications").insert(baseData)
        if (insertError) throw insertError
        toast({
          title: "Success!",
          description: "Publication created successfully.",
        })
      }

      // Revalidate pages to show updated data
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paths: ["/", "/publications"] }),
        })
      } catch (revalidateError) {
        console.error("Revalidation error:", revalidateError)
      }

      router.push("/admin/publications")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!publication || !confirm("Are you sure you want to delete this publication?")) return

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: deleteError } = await supabase.from("publications").delete().eq("id", publication.id)
      if (deleteError) throw deleteError

      toast({
        title: "Success!",
        description: "Publication deleted successfully.",
      })

      // Revalidate pages to show updated data immediately
      try {
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paths: ["/", "/publications"] }),
        })
      } catch (revalidateError) {
        console.error("Revalidation error:", revalidateError)
      }

      router.push("/admin/publications")
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

          {/* Category Selection - At the Top */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Academic Publication">Academic Publication</SelectItem>
                <SelectItem value="Conference Publication">Conference Publication</SelectItem>
                <SelectItem value="Non-Academic Publication">Non-Academic Publication</SelectItem>
                <SelectItem value="Work in Progress">Work in Progress</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the publication category to show relevant fields
            </p>
          </div>

          <div className="border-t pt-6 space-y-6">
            {/* Common Fields - Always Visible */}
            {category !== "Conference Publication" && (
              <>
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={publication?.title}
                    required
                    placeholder="Publication title"
                  />
                </div>

                {/* Authors */}
                <div className="space-y-2">
                  <Label htmlFor="authors">Authors *</Label>
                  <Input
                    id="authors"
                    name="authors"
                    defaultValue={publication?.authors}
                    required
                    placeholder="Author 1, Author 2, etc."
                  />
                </div>

                {/* Publication Date and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publication_date">Publication Date</Label>
                    <Input
                      id="publication_date"
                      name="publication_date"
                      defaultValue={publication?.publication_date}
                      placeholder="Jun 2025"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="Submitted for Publication">Submitted for Publication</SelectItem>
                        <SelectItem value="In Preparation">In Preparation</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Category-Specific Fields */}
            {category === "Academic Publication" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="journal">Journal</Label>
                  <Input id="journal" name="journal" defaultValue={publication?.journal} placeholder="Journal name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea
                    id="abstract"
                    name="abstract"
                    defaultValue={publication?.abstract}
                    rows={6}
                    placeholder="Publication abstract"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    name="keywords"
                    defaultValue={publication?.keywords?.join(", ")}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academic_pdf">Paper PDF</Label>
                  <Input
                    id="academic_pdf"
                    name="academic_pdf"
                    type="file"
                    accept=".pdf"
                    onChange={handleAcademicPdfUpload}
                    disabled={uploading}
                  />
                  {academicPdf && (
                    <div className="mt-2">
                      <a
                        href={academicPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View uploaded PDF
                      </a>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Upload the academic paper PDF file.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citation_count">Citation Count (Optional)</Label>
                  <Input
                    id="citation_count"
                    name="citation_count"
                    type="number"
                    min="0"
                    defaultValue={publication?.citation_count || 0}
                    placeholder="0"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the number of citations this publication has received.
                  </p>
                </div>
              </>
            )}

            {category === "Conference Publication" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="conference_title">Paper Title *</Label>
                  <Input
                    id="conference_title"
                    name="conference_title"
                    defaultValue={publication?.title || publication?.conference_title}
                    required
                    placeholder="e.g., IoT-Based Smart Contract Framework for Supply Chain Traceability"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used as the main publication title
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authors">Authors *</Label>
                  <Input
                    id="authors"
                    name="authors"
                    defaultValue={publication?.authors}
                    required
                    placeholder="Author 1, Author 2, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publication_date">Publication Date</Label>
                    <Input
                      id="publication_date"
                      name="publication_date"
                      defaultValue={publication?.publication_date}
                      placeholder="Jun 2025"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                        <SelectItem value="Submitted for Publication">Submitted for Publication</SelectItem>
                        <SelectItem value="In Preparation">In Preparation</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conference_name">Conference Name *</Label>
                  <Input
                    id="conference_name"
                    name="conference_name"
                    defaultValue={publication?.conference_title}
                    required
                    placeholder="e.g., Bengal Delta Conference 2025"
                  />
                  <p className="text-xs text-muted-foreground">
                    The name of the conference where this paper was presented
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conference_organizer">Conference Organizer *</Label>
                    <Input
                      id="conference_organizer"
                      name="conference_organizer"
                      defaultValue={publication?.conference_organizer}
                      required
                      placeholder="e.g., University of Chittagong"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      defaultValue={publication?.location}
                      required
                      placeholder="e.g., Hotel InterContinental, Dhaka"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea
                    id="abstract"
                    name="abstract"
                    defaultValue={publication?.abstract}
                    rows={6}
                    placeholder="Paper abstract"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    name="keywords"
                    defaultValue={publication?.keywords?.join(", ")}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conference_images">Conference Photos (Multiple)</Label>
                  <Input
                    id="conference_images"
                    name="conference_images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {conferenceImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {conferenceImages.map((image, index) => (
                        <div key={index} className="relative aspect-video group">
                          <Image
                            src={image}
                            alt={`Conference image ${index + 1}`}
                            fill
                            className="object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Upload multiple photos from the conference. Click on images to remove them.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conference_videos">Conference Videos (Multiple, Max 30MB each)</Label>
                  <Input
                    id="conference_videos"
                    name="conference_videos"
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    disabled={uploading}
                  />
                  {conferenceVideos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {conferenceVideos.map((video, index) => (
                        <div key={index} className="relative group border rounded-lg p-2 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <video
                                src={video}
                                className="w-24 h-16 object-cover rounded border"
                                controls={false}
                                preload="metadata"
                              />
                              <a
                                href={video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline truncate"
                              >
                                Video {index + 1}
                              </a>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="ml-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Upload multiple videos from the conference (max 30MB per file). Click on videos to remove them.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conference_paper_pdf">Conference Paper PDF</Label>
                  <Input
                    id="conference_paper_pdf"
                    name="conference_paper_pdf"
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    disabled={uploading}
                  />
                  {conferencePdf && (
                    <div className="mt-2">
                      <a
                        href={conferencePdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        View uploaded PDF
                      </a>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Upload the conference paper PDF file.
                  </p>
                </div>
              </>
            )}

            {category === "Non-Academic Publication" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="journal">Journal/Publication Source</Label>
                  <Input id="journal" name="journal" defaultValue={publication?.journal} placeholder="Journal or publication name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abstract">Description</Label>
                  <Textarea
                    id="abstract"
                    name="abstract"
                    defaultValue={publication?.abstract}
                    rows={6}
                    placeholder="Publication description or summary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    name="keywords"
                    defaultValue={publication?.keywords?.join(", ")}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input id="url" name="url" type="url" defaultValue={publication?.url} placeholder="Link to publication" />
                </div>
              </>
            )}

            {category === "Work in Progress" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="abstract">Project Details</Label>
                  <Textarea
                    id="abstract"
                    name="abstract"
                    defaultValue={publication?.abstract}
                    rows={8}
                    placeholder="Provide detailed information about your work in progress, including objectives, methodology, expected outcomes, and current progress..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Describe the project scope, research questions, methodology, and current status in detail.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    name="keywords"
                    defaultValue={publication?.keywords?.join(", ")}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Preparation">In Preparation</SelectItem>
                      <SelectItem value="Data Collection">Data Collection</SelectItem>
                      <SelectItem value="Analysis Phase">Analysis Phase</SelectItem>
                      <SelectItem value="Writing Phase">Writing Phase</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Revision Phase">Revision Phase</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Select the current phase of your work in progress.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={loading}>
              {loading ? "Saving..." : publication ? "Update" : "Create"}
            </Button>

            {publication && (
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
