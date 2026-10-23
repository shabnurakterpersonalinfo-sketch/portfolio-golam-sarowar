"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Award, ChevronLeft, ChevronRight, ExternalLink, FileText, Link2, X } from "lucide-react"
import { type EntryMediaItem, entryMediaPreview } from "@/lib/entry-media"

const isPdf = (url: string) => /\.pdf($|\?)/i.test(url)

// LinkedIn-style media strip under an Education/Experience entry. Photos and
// image certificates open in a lightbox; links and PDFs open in a new tab.
export function EntryMedia({ items, entryTitle }: { items: EntryMediaItem[]; entryTitle: string }) {
  const viewable = items.filter((item) => item.type !== "link" && !isPdf(item.url))
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % viewable.length))
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + viewable.length) % viewable.length))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, viewable.length])

  if (items.length === 0) return null

  const current = open !== null ? viewable[open] : null

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
        {items.map((item, index) => {
          const preview = isPdf(item.url) ? null : entryMediaPreview(item)
          const viewIndex = viewable.indexOf(item)
          const Fallback = item.type === "link" ? Link2 : item.type === "certificate" ? Award : FileText
          const tile = (
            <>
              <div className="relative h-24 w-40 overflow-hidden rounded-md bg-primary-light ring-1 ring-border flex items-center justify-center">
                {preview ? (
                  <Image
                    src={preview}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <Fallback className="h-8 w-8 text-primary" />
                )}
                {(item.type === "link" || isPdf(item.url)) && (
                  <span className="absolute right-1.5 top-1.5 rounded bg-white/90 p-1 text-primary shadow-sm">
                    <ExternalLink className="h-3 w-3" />
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm font-medium text-foreground line-clamp-1 text-left">{item.title}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 text-left">{item.description}</p>
              )}
            </>
          )

          return viewIndex >= 0 ? (
            <button
              key={index}
              type="button"
              onClick={() => setOpen(viewIndex)}
              className="group w-40 shrink-0 snap-start flex flex-col items-start"
              aria-label={`View ${item.title}`}
            >
              {tile}
            </button>
          ) : (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-40 shrink-0 snap-start flex flex-col items-start"
            >
              {tile}
            </a>
          )
        })}
      </div>

      {current &&
        open !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${entryTitle}: ${current.title}`}
            onClick={() => setOpen(null)}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            {viewable.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen((open - 1 + viewable.length) % viewable.length)
                  }}
                  className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen((open + 1) % viewable.length)
                  }}
                  className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                  aria-label="Next"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full h-[70vh]">
                <Image src={current.url} alt={current.title} fill className="object-contain" />
              </div>
              <figcaption className="mt-4 text-center text-white">
                <p className="font-semibold">{current.title}</p>
                {current.description && <p className="text-sm text-white/70">{current.description}</p>}
              </figcaption>
            </figure>
          </div>,
          document.body,
        )}
    </>
  )
}
