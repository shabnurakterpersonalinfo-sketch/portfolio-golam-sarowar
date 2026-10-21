"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { HERO_SLIDE_TYPES } from "@/lib/hero-slides"

interface HeroSlideFormProps {
  slide?: any
}

export function HeroSlideForm({ slide }: HeroSlideFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slideType, setSlideType] = useState<string>(slide?.slide_type || "experiences")
  const { toast } = useToast()

  const config = HERO_SLIDE_TYPES[slideType]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      slide_type: slideType,
      heading: (formData.get("heading") as string) || null,
      subheading: (formData.get("subheading") as string) || null,
      item_limit: Number(formData.get("item_limit")) || 3,
      display_order: Number(formData.get("display_order")) || 0,
      is_active: formData.get("is_active") === "on",
    }

    const supabase = createClient()

    try {
      if (slide) {
        const { error: updateError } = await supabase.from("hero_slides").update(data).eq("id", slide.id)
        if (updateError) throw updateError
        toast({ title: "Success!", description: "Hero slide updated successfully." })
      } else {
        const { error: insertError } = await supabase.from("hero_slides").insert(data)
        if (insertError) throw insertError
        toast({ title: "Success!", description: "Hero slide created successfully." })
      }

      router.push("/admin/hero-slides")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!slide || !confirm("Are you sure you want to delete this hero slide?")) return

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: deleteError } = await supabase.from("hero_slides").delete().eq("id", slide.id)
      if (deleteError) throw deleteError
      toast({ title: "Success!", description: "Hero slide deleted successfully." })
      router.push("/admin/hero-slides")
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
            <Label htmlFor="slide_type">Section to highlight</Label>
            <Select value={slideType} onValueChange={setSlideType}>
              <SelectTrigger id="slide_type" className="w-full">
                <SelectValue placeholder="Choose a section" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(HERO_SLIDE_TYPES).map(([value, type]) => (
                  <SelectItem key={value} value={value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              The slide shows the most recently added entries from this section first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heading">Heading (optional)</Label>
              <Input
                id="heading"
                name="heading"
                defaultValue={slide?.heading ?? ""}
                placeholder={config?.defaultHeading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading (optional)</Label>
              <Input
                id="subheading"
                name="subheading"
                defaultValue={slide?.subheading ?? ""}
                placeholder={config?.defaultSubheading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item_limit">Entries to show</Label>
              <Input
                id="item_limit"
                name="item_limit"
                type="number"
                min={1}
                max={4}
                defaultValue={slide?.item_limit ?? 3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Slide order</Label>
              <Input id="display_order" name="display_order" type="number" defaultValue={slide?.display_order ?? 0} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Visibility</Label>
              <label className="flex h-9 items-center gap-2 text-sm">
                <input
                  id="is_active"
                  name="is_active"
                  type="checkbox"
                  defaultChecked={slide?.is_active ?? true}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                Show on the homepage
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={loading}>
              {loading ? "Saving..." : slide ? "Update" : "Create"}
            </Button>

            {slide && (
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
