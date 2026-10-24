"use client"

import { Children, useCallback, useEffect, useState, type ReactNode } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface HeroSliderProps {
  children: ReactNode
  labels: string[]
  intervalMs?: number
}

// Homepage hero carousel: auto-advances every `intervalMs` (set in the admin Hero
// Slides list) and can be dragged/swiped or moved with the arrows, dots or keyboard.
// Moving to a slide by hand restarts its full interval rather than stopping
// autoplay; only the pause button and a reduced-motion preference stop it.
export function HeroSlider({ children, labels, intervalMs = 5000 }: HeroSliderProps) {
  const slides = Children.toArray(children)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 })
  const [selected, setSelected] = useState(0)
  const [playing, setPlaying] = useState(true)
  // Bumped when the visitor grabs the slider, so the timer restarts from zero.
  const [touched, setTouched] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a browser preference
      setPlaying(false)
    }
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    const onDrag = () => setTouched((n) => n + 1)
    emblaApi.on("select", onSelect)
    emblaApi.on("pointerDown", onDrag)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("pointerDown", onDrag)
    }
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || !playing || slides.length < 2) return
    const timer = setInterval(() => emblaApi.scrollNext(), intervalMs)
    return () => clearInterval(timer)
  }, [emblaApi, playing, intervalMs, slides.length, selected, touched])

  const goTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (slides.length < 2) return <>{slides}</>

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev()
        if (e.key === "ArrowRight") next()
      }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-0 shrink-0 grow-0 basis-full"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}: ${labels[index] ?? ""}`}
              aria-hidden={index !== selected}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setTouched((n) => n + 1)
          prev()
        }}
        aria-label="Previous slide"
        className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-md ring-1 ring-primary/15 hover:bg-primary hover:text-white transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => {
          setTouched((n) => n + 1)
          next()
        }}
        aria-label="Next slide"
        className="hidden xl:flex absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary shadow-md ring-1 ring-primary/15 hover:bg-primary hover:text-white transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-primary/10">
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setTouched((n) => n + 1)
                goTo(index)
              }}
              aria-label={`Go to slide ${index + 1}: ${labels[index] ?? ""}`}
              aria-current={index === selected}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selected ? "w-7 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          className="text-primary hover:text-primary-dark"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}
