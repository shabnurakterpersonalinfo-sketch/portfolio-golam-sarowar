"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Camera, ArrowRight } from "lucide-react"

export interface GalleryTeaserItem {
  id: string
  title: string
  summary: string | null
  image: string | null
  event_date: string
}

interface GalleryTeaserProps {
  items: GalleryTeaserItem[]
}

// Mirrors the "big preview + clickable list" layout the client asked to match:
// clicking an entry in the list swaps the large preview panel, and the list is
// capped to a handful of items with a link through to the full timeline.
export function GalleryTeaser({ items }: GalleryTeaserProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.id)
  const selected = items.find((item) => item.id === selectedId) ?? items[0]

  if (!selected) return null

  return (
    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-10 max-w-6xl mx-auto items-start">
      {/* Large preview */}
      <div>
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border">
          {selected.image ? (
            <Image src={selected.image} alt={selected.title} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Camera className="h-16 w-16 text-muted-foreground/40" />
            </div>
          )}
        </div>
        <p className="text-xs font-bold tracking-widest text-primary uppercase mt-4">{selected.event_date}</p>
        <h3 className="text-xl font-bold text-foreground mt-1">{selected.title}</h3>
        {selected.summary && <p className="text-sm text-muted-foreground mt-1">{selected.summary}</p>}
      </div>

      {/* Clickable list */}
      <div>
        <div className="border-t border-border">
          {items.map((item) => {
            const isActive = item.id === selected.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                aria-pressed={isActive}
                className={`w-full flex items-start gap-4 py-4 px-2 -mx-2 text-left rounded-md border-b border-border transition-colors ${
                  isActive ? "bg-primary-light" : "hover:bg-muted/60"
                }`}
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Camera className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold tracking-widest text-primary uppercase">{item.event_date}</p>
                  <p className="font-bold text-foreground text-sm truncate">{item.title}</p>
                  {item.summary && <p className="text-xs text-muted-foreground line-clamp-1">{item.summary}</p>}
                </div>
              </button>
            )
          })}
        </div>
        <div className="flex justify-end pt-4">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            See full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
