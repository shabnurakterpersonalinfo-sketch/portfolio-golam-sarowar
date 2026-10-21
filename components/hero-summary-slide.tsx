import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import type { HeroSlideItem } from "@/lib/hero-slides"

interface HeroSummarySlideProps {
  eyebrow: string
  heading: string
  subheading?: string | null
  href: string
  items: HeroSlideItem[]
  fallbackIcon: React.ComponentType<{ className?: string }>
}

// A hero slide that highlights one section: heading on the left, its latest
// entries (newest first) as a stacked list of cards on the right.
export function HeroSummarySlide({ eyebrow, heading, subheading, href, items, fallbackIcon: Icon }: HeroSummarySlideProps) {
  const [latest, ...rest] = items

  return (
    <div className="h-full flex items-center px-4 sm:px-6 lg:px-8 pt-12 pb-24 sm:pt-16 md:pt-20 lg:pt-24">
      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-2 space-y-4 text-center lg:text-left">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
            <Sparkles className="h-4 w-4" />
            {eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary leading-tight">{heading}</h2>
          {subheading && (
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0">{subheading}</p>
          )}
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-5 py-2.5 text-sm sm:text-base font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="lg:col-span-3 space-y-3">
          {latest && (
            <div className="relative rounded-xl bg-white p-5 sm:p-6 shadow-lg ring-1 ring-primary/15">
              <span className="absolute -top-3 left-5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                Latest
              </span>
              <SlideItemRow item={latest} Icon={Icon} large />
            </div>
          )}
          {rest.map((item) => (
            <div key={item.id} className="rounded-xl bg-white/80 p-4 ring-1 ring-border">
              <SlideItemRow item={item} Icon={Icon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SlideItemRow({
  item,
  Icon,
  large = false,
}: {
  item: HeroSlideItem
  Icon: React.ComponentType<{ className?: string }>
  large?: boolean
}) {
  const size = large ? "h-14 w-14 sm:h-16 sm:w-16" : "h-11 w-11"
  return (
    <div className="flex items-start gap-4">
      <div className={`relative ${size} shrink-0 overflow-hidden rounded-lg bg-primary-light ring-1 ring-primary/10 flex items-center justify-center`}>
        {item.image ? (
          <Image src={item.image} alt="" fill className="object-cover" />
        ) : (
          <Icon className={large ? "h-7 w-7 text-primary" : "h-5 w-5 text-primary"} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-semibold text-foreground leading-snug ${large ? "text-lg sm:text-xl" : "text-base"} line-clamp-2`}>
          {item.title}
        </p>
        {item.subtitle && (
          <p className={`text-primary font-medium ${large ? "text-base" : "text-sm"} line-clamp-1`}>{item.subtitle}</p>
        )}
        {item.meta && <p className="text-sm text-muted-foreground mt-0.5">{item.meta}</p>}
      </div>
    </div>
  )
}
