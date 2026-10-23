"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  HERO_SLIDE_TYPES,
  INTRODUCTION_SLIDE,
  MAX_SLIDE_ITEMS,
  type HeroSlideItem,
  getHeroSlideOptions,
  heroSlidePositionLabel,
  saveHeroSlideOrder,
} from "@/lib/hero-slides"

interface HeroSlideFormProps {
  slide?: any
  // Every other slide (Introduction included) in its current order.
  siblings: { id: string; title: string }[]
}

type SelectionMode = "latest" | "selected"

export function HeroSlideForm({ slide, siblings }: HeroSlideFormProps) {
  const router = useRouter()
  const isIntroduction = slide?.slide_type === INTRODUCTION_SLIDE
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [slideType, setSlideType] = useState<string>(slide?.slide_type || "experiences")
  const [mode, setMode] = useState<SelectionMode>(slide?.selection_mode === "selected" ? "selected" : "latest")
  const [itemLimit, setItemLimit] = useState<string>(String(slide?.item_limit ?? 3))
  const [pickedIds, setPickedIds] = useState<string[]>(slide?.item_ids ?? [])
  const [options, setOptions] = useState<HeroSlideItem[]>([])
  const [optionsLoading, setOptionsLoading] = useState(false)
  const [position, setPosition] = useState<string>(() => {
    // An existing slide keeps its place; a new one goes last.
    const current = slide ? (slide.position ?? siblings.length) : siblings.length
    return String(Math.min(current, siblings.length))
  })
  const { toast } = useToast()

  const config = HERO_SLIDE_TYPES[slideType]

  useEffect(() => {
    if (isIntroduction) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the fetch below
    setOptionsLoading(true)
    getHeroSlideOptions(createClient(), slideType).then((items) => {
      if (cancelled) return
      setOptions(items)
      setOptionsLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [slideType, isIntroduction])

  const optionsById = new Map(options.map((item) => [item.id, item]))
  const picked = pickedIds.filter((id) => optionsById.has(id))
  const unpicked = options.filter((item) => !pickedIds.includes(item.id))

  const changeSection = (value: string) => {
    setSlideType(value)
    setPickedIds([])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isIntroduction && mode === "selected" && picked.length === 0) {
      setError("Choose at least one entry, or switch to \"Latest entries\".")
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = isIntroduction
      ? { is_active: formData.get("is_active") === "on" }
      : {
          slide_type: slideType,
          heading: (formData.get("heading") as string) || null,
          subheading: (formData.get("subheading") as string) || null,
          selection_mode: mode,
          item_limit: Number(itemLimit) || 3,
          item_ids: mode === "selected" ? picked : [],
          is_active: formData.get("is_active") === "on",
        }

    const supabase = createClient()

    try {
      let id = slide?.id as string | undefined
      if (slide) {
        const { error: updateError } = await supabase.from("hero_slides").update(data).eq("id", slide.id)
        if (updateError) throw updateError
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("hero_slides")
          .insert({ ...data, display_order: siblings.length })
          .select("id")
          .single()
        if (insertError) throw insertError
        id = inserted.id
      }

      const order = siblings.map((sibling) => sibling.id)
      order.splice(Number(position), 0, id!)
      await saveHeroSlideOrder(supabase, order)

      toast({ title: "Success!", description: slide ? "Hero slide updated successfully." : "Hero slide created successfully." })
      router.push("/admin/hero-slides")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!slide || isIntroduction || !confirm("Are you sure you want to delete this hero slide?")) return

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: deleteError } = await supabase.from("hero_slides").delete().eq("id", slide.id)
      if (deleteError) throw deleteError
      await saveHeroSlideOrder(
        supabase,
        siblings.map((sibling) => sibling.id),
      )
      toast({ title: "Success!", description: "Hero slide deleted successfully." })
      router.push("/admin/hero-slides")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const siblingTitles = siblings.map((sibling) => sibling.title)

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isIntroduction ? (
            <p className="text-sm text-muted-foreground">
              The Introduction shows your name, title, bio and photo from your Profile. You can hide it or change
              where it appears in the slider.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="slide_type">Section to highlight</Label>
                <Select value={slideType} onValueChange={changeSection}>
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
              </div>

              <div className="space-y-3">
                <Label>What to show</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg bg-muted/50 p-1">
                  {(
                    [
                      ["latest", "Latest entries", "Newest entries first, updates automatically"],
                      ["selected", "Choose specific entries", "Pick exactly which entries appear"],
                    ] as const
                  ).map(([value, title, hint]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMode(value)}
                      aria-pressed={mode === value}
                      className={`rounded-md px-4 py-3 text-left transition-colors ${
                        mode === value ? "bg-white shadow-sm ring-1 ring-primary/30" : "hover:bg-white/60"
                      }`}
                    >
                      <span className={`block text-sm font-semibold ${mode === value ? "text-primary" : ""}`}>
                        {title}
                      </span>
                      <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>
                    </button>
                  ))}
                </div>

                {mode === "latest" ? (
                  <div className="space-y-2">
                    <Label htmlFor="item_limit">Number of entries</Label>
                    <Select value={itemLimit} onValueChange={setItemLimit}>
                      <SelectTrigger id="item_limit" className="w-full sm:w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: MAX_SLIDE_ITEMS }, (_, i) => i + 1).map((count) => (
                          <SelectItem key={count} value={String(count)}>
                            {count === 1 ? "Latest entry only" : `Latest ${count} entries`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="pick_entry">
                      Entries ({picked.length} of {MAX_SLIDE_ITEMS})
                    </Label>
                    <Select
                      value=""
                      onValueChange={(id) => setPickedIds((ids) => [...ids.filter((x) => optionsById.has(x)), id])}
                      disabled={optionsLoading || picked.length >= MAX_SLIDE_ITEMS || unpicked.length === 0}
                    >
                      <SelectTrigger id="pick_entry" className="w-full">
                        <SelectValue
                          placeholder={
                            optionsLoading
                              ? "Loading entries..."
                              : options.length === 0
                                ? `No ${config?.label ?? ""} entries yet`
                                : picked.length >= MAX_SLIDE_ITEMS
                                  ? `Maximum of ${MAX_SLIDE_ITEMS} entries chosen`
                                  : unpicked.length === 0
                                    ? "All entries chosen"
                                    : "Add an entry..."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {unpicked.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                            {item.subtitle ? ` · ${item.subtitle}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {picked.length > 0 ? (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {picked.map((id, index) => (
                          <span
                            key={id}
                            className="inline-flex max-w-full items-center gap-2 rounded-full bg-primary-light py-1.5 pl-3 pr-1.5 text-sm font-medium text-primary ring-1 ring-primary/20"
                          >
                            <span className="text-xs opacity-70">{index + 1}.</span>
                            <span className="truncate">{optionsById.get(id)?.title}</span>
                            <button
                              type="button"
                              onClick={() => setPickedIds((ids) => ids.filter((x) => x !== id))}
                              className="rounded-full p-0.5 hover:bg-primary hover:text-white transition-colors"
                              aria-label={`Remove ${optionsById.get(id)?.title}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Nothing chosen yet. Entries appear on the slide in the order you add them.
                      </p>
                    )}
                  </div>
                )}
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
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position in the slider</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id="position" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: siblings.length + 1 }, (_, i) => i).map((index) => (
                    <SelectItem key={index} value={String(index)}>
                      {heroSlidePositionLabel(index, siblingTitles)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            {slide && !isIntroduction && (
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
