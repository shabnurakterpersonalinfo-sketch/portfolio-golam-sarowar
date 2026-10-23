"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, Eye, EyeOff, GripVertical, Pencil, UserRound } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { HERO_SLIDE_TYPES, INTRODUCTION_SLIDE, heroSlideTitle, saveHeroSlideOrder } from "@/lib/hero-slides"

function describe(slide: any) {
  if (slide.slide_type === INTRODUCTION_SLIDE) return "Name, title, bio and photo from your Profile"
  const label = HERO_SLIDE_TYPES[slide.slide_type]?.label ?? slide.slide_type
  if (slide.selection_mode === "selected") {
    const count = slide.item_ids?.length ?? 0
    return `${label} · ${count} chosen ${count === 1 ? "entry" : "entries"}`
  }
  return `${label} · latest ${slide.item_limit} ${slide.item_limit === 1 ? "entry" : "entries"}`
}

// Slides in slider order. Drag a row (or use the arrows) to reorder; the new order
// is saved straight away. The eye button shows or hides a slide on the homepage.
export function HeroSlideList({ initialSlides }: { initialSlides: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [slides, setSlides] = useState(initialSlides)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)

  const persistOrder = async (next: any[]) => {
    const previous = slides
    setSlides(next)
    setSaving(true)
    try {
      await saveHeroSlideOrder(
        createClient(),
        next.map((slide) => slide.id),
      )
      toast({ title: "Order saved", description: "The homepage slider now uses this order." })
      router.refresh()
    } catch (err: any) {
      setSlides(previous)
      toast({ title: "Error", description: "Couldn't save the new order. " + err.message, variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= slides.length || from === to) return
    const next = [...slides]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    persistOrder(next)
  }

  const toggleVisibility = async (index: number) => {
    const slide = slides[index]
    const isActive = !slide.is_active
    setSlides((current) => current.map((s, i) => (i === index ? { ...s, is_active: isActive } : s)))
    const { error } = await createClient().from("hero_slides").update({ is_active: isActive }).eq("id", slide.id)
    if (error) {
      setSlides((current) => current.map((s, i) => (i === index ? { ...s, is_active: !isActive } : s)))
      toast({ title: "Error", description: error.message, variant: "destructive" })
      return
    }
    toast({ title: isActive ? "Slide shown" : "Slide hidden", description: heroSlideTitle(slide) })
    router.refresh()
  }

  return (
    <div className="space-y-3">
      {slides.map((slide, index) => {
        const isIntroduction = slide.slide_type === INTRODUCTION_SLIDE
        return (
          <Card
            key={slide.id}
            draggable={!saving}
            onDragStart={(e) => {
              setDragIndex(index)
              e.dataTransfer.effectAllowed = "move"
            }}
            onDragOver={(e) => {
              e.preventDefault()
              if (overIndex !== index) setOverIndex(index)
            }}
            onDrop={(e) => {
              e.preventDefault()
              if (dragIndex !== null) move(dragIndex, index)
              setDragIndex(null)
              setOverIndex(null)
            }}
            onDragEnd={() => {
              setDragIndex(null)
              setOverIndex(null)
            }}
            className={`py-0 border-l-4 transition-all ${isIntroduction ? "border-primary/50" : "border-primary"} ${
              dragIndex === index ? "opacity-40" : ""
            } ${overIndex === index && dragIndex !== null && dragIndex !== index ? "ring-2 ring-primary/40" : ""} ${
              slide.is_active ? "" : "bg-muted/40"
            }`}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="cursor-grab active:cursor-grabbing text-muted-foreground" aria-hidden="true">
                  <GripVertical className="h-5 w-5" />
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-bold flex items-center gap-2 ${slide.is_active ? "text-foreground" : "text-muted-foreground"}`}>
                    {isIntroduction && <UserRound className="h-4 w-4 text-primary" />}
                    <span className="truncate">{heroSlideTitle(slide)}</span>
                    {!slide.is_active && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Hidden
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{describe(slide)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => move(index, index - 1)}
                    disabled={saving || index === 0}
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => move(index, index + 1)}
                    disabled={saving || index === slides.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleVisibility(index)}
                    aria-label={slide.is_active ? "Hide on homepage" : "Show on homepage"}
                    title={slide.is_active ? "Hide on homepage" : "Show on homepage"}
                  >
                    {slide.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/hero-slides/${slide.id}`}>
                      <Pencil className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
