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

interface EducationFormProps {
  education?: any
}

export function EducationForm({ education }: EducationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget

    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("You must be logged in to perform this action. Please log in and try again.")
      setLoading(false)
      return
    }

    const formData = new FormData(form)
    const data = {
      institution: formData.get("institution") as string,
      degree: formData.get("degree") as string,
      field_of_study: formData.get("field_of_study") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      cgpa: formData.get("cgpa") as string,
      location: formData.get("location") as string,
      achievements: formData.get("achievements") as string,
      status: formData.get("status") as string,
    }

    try {
      if (education) {
        const { error: updateError } = await supabase.from("education").update(data).eq("id", education.id)
        if (updateError) throw updateError
        toast({
          title: "Success!",
          description: "Education record updated successfully.",
        })
      } else {
        const { error: insertError } = await supabase.from("education").insert(data)
        if (insertError) throw insertError
        toast({
          title: "Success!",
          description: "Education record created successfully.",
        })
      }

      router.push("/admin/education")
      router.refresh()
    } catch (err: any) {
      console.log("[v0] Error submitting form:", err)
      if (err.message.includes("row-level security")) {
        setError("Authentication error: Please log out and log back in, then try again.")
      } else {
        setError(err.message || "An error occurred while saving the education record.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!education || !confirm("Are you sure you want to delete this education record?")) return

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: deleteError } = await supabase.from("education").delete().eq("id", education.id)
      if (deleteError) throw deleteError

      toast({
        title: "Success!",
        description: "Education record deleted successfully.",
      })

      router.push("/admin/education")
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
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                name="institution"
                defaultValue={education?.institution}
                required
                placeholder="University name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input id="degree" name="degree" defaultValue={education?.degree} required placeholder="Degree name" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_of_study">Field of Study</Label>
            <Input
              id="field_of_study"
              name="field_of_study"
              defaultValue={education?.field_of_study}
              placeholder="e.g., Computer Science and Engineering"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                defaultValue={education?.start_date}
                required
                placeholder="Jan 2020"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                defaultValue={education?.end_date}
                placeholder="Dec 2023 or Present"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cgpa">CGPA</Label>
              <Input id="cgpa" name="cgpa" defaultValue={education?.cgpa} placeholder="3.76/4.00" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={education?.location} placeholder="City, Country" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                name="status"
                defaultValue={education?.status || "Completed"}
                placeholder="Completed or In Progress"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements (one per line)</Label>
            <Textarea
              id="achievements"
              name="achievements"
              defaultValue={education?.achievements}
              rows={4}
              placeholder="List your achievements"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={loading}>
              {loading ? "Saving..." : education ? "Update" : "Create"}
            </Button>

            {education && (
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
