// Section types a homepage hero slide can highlight. Shared by the admin slide form
// (the dropdown) and the homepage (which fetches each slide's latest entries).
// Must stay in sync with the CHECK constraint on hero_slides.slide_type.

export const MAX_HERO_SLIDES = 5

// The name/title/bio/photo slide. It is a hero_slides row so it can be hidden or
// moved, but it has no section data and never counts toward MAX_HERO_SLIDES.
export const INTRODUCTION_SLIDE = "introduction"
export const INTRODUCTION_LABEL = "Introduction"

export const MAX_SLIDE_ITEMS = 4

// Seconds each slide stays on screen (profiles.hero_slide_interval_seconds). Used
// until the round-3 migration has run, and the choices in the admin dropdown,
// which must stay within the column's CHECK range (2-30).
export const DEFAULT_HERO_SLIDE_SECONDS = 5
export const HERO_SLIDE_SECONDS_OPTIONS = [3, 4, 5, 6, 8, 10, 12, 15, 20, 30]

export function heroSlideIntervalMs(profile: { hero_slide_interval_seconds?: number | null } | null | undefined) {
  const seconds = Number(profile?.hero_slide_interval_seconds)
  return (Number.isFinite(seconds) && seconds >= 2 ? seconds : DEFAULT_HERO_SLIDE_SECONDS) * 1000
}

export interface HeroSlideItem {
  id: string
  title: string
  subtitle?: string | null
  meta?: string | null
  image?: string | null
}

export interface HeroSlideTypeConfig {
  label: string
  table: string
  defaultHeading: string
  defaultSubheading: string
  href: string
  toItem: (row: any) => HeroSlideItem
}

const dateRange = (start?: string | null, end?: string | null) =>
  [start, end].filter(Boolean).join(" - ") || null

export const HERO_SLIDE_TYPES: Record<string, HeroSlideTypeConfig> = {
  experiences: {
    label: "Professional Experience",
    table: "experiences",
    defaultHeading: "Professional Experience",
    defaultSubheading: "Latest roles across industry and research.",
    href: "/experiences",
    toItem: (row) => ({
      id: row.id,
      title: row.position,
      subtitle: row.organization,
      meta: dateRange(row.start_date, row.end_date),
      image: row.logo_url,
    }),
  },
  education: {
    label: "Education",
    table: "education",
    defaultHeading: "Education",
    defaultSubheading: "Academic journey and qualifications.",
    href: "/#education",
    toItem: (row) => ({
      id: row.id,
      title: row.degree,
      subtitle: row.institution,
      meta: [dateRange(row.start_date, row.end_date), row.cgpa].filter(Boolean).join(" · ") || null,
      image: row.logo_url,
    }),
  },
  publications: {
    label: "Publications",
    table: "publications",
    defaultHeading: "Publications",
    defaultSubheading: "Recent papers and ongoing research.",
    href: "/publications",
    toItem: (row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.conference_title || row.journal,
      meta: [row.status, row.publication_date].filter(Boolean).join(" · ") || null,
      image: row.conference_images?.[0] ?? null,
    }),
  },
  awards: {
    label: "Honors & Awards",
    table: "awards",
    defaultHeading: "Honors & Awards",
    defaultSubheading: "Recognition for academic and professional work.",
    href: "/awards",
    toItem: (row) => ({ id: row.id, title: row.title, subtitle: row.issuer, meta: row.date, image: row.image }),
  },
  scholarly_activities: {
    label: "Scholarly Activities",
    table: "scholarly_activities",
    defaultHeading: "Scholarly Activities",
    defaultSubheading: "Conferences, workshops and academic programs.",
    href: "/scholarly-activities",
    toItem: (row) => ({ id: row.id, title: row.title, subtitle: row.organization || row.type, meta: row.date }),
  },
  certifications: {
    label: "Certifications & Training",
    table: "certifications",
    defaultHeading: "Certifications & Training",
    defaultSubheading: "Professional certifications earned.",
    href: "/skills",
    toItem: (row) => ({ id: row.id, title: row.name, subtitle: row.issuer, meta: row.issue_date, image: row.image }),
  },
  volunteering: {
    label: "Community Service",
    table: "volunteering",
    defaultHeading: "Community Service",
    defaultSubheading: "Volunteering and community engagement.",
    href: "/volunteering",
    toItem: (row) => ({
      id: row.id,
      title: row.role,
      subtitle: row.organization,
      meta: dateRange(row.start_date, row.end_date),
    }),
  },
  gallery: {
    label: "Gallery",
    table: "gallery_items",
    defaultHeading: "Gallery",
    defaultSubheading: "Moments from the journey.",
    href: "/gallery",
    toItem: (row) => ({ id: row.id, title: row.title, subtitle: row.location, meta: row.event_date, image: row.image }),
  },
}

export function heroSlideTitle(slide: { slide_type: string; heading?: string | null }) {
  if (slide.slide_type === INTRODUCTION_SLIDE) return INTRODUCTION_LABEL
  return slide.heading || HERO_SLIDE_TYPES[slide.slide_type]?.defaultHeading || slide.slide_type
}

// "Slide 3, after Experience": a position label the admin can read, given the
// titles of the other slides in their current order.
export function heroSlidePositionLabel(index: number, otherTitles: string[]) {
  const total = otherTitles.length + 1
  if (index === 0) return total === 1 ? "Slide 1 (only slide)" : "Slide 1 (first)"
  const after = `after "${otherTitles[index - 1]}"`
  return index === total - 1 ? `Slide ${index + 1} (last, ${after})` : `Slide ${index + 1} (${after})`
}

// Rewrites display_order as 0..n-1 following the given id order.
export async function saveHeroSlideOrder(supabase: any, orderedIds: string[]) {
  const results = await Promise.all(
    orderedIds.map((id, index) => supabase.from("hero_slides").update({ display_order: index }).eq("id", id)),
  )
  const failed = results.find((result: any) => result.error)
  if (failed) throw failed.error
}

// Entries a slide can be built from, for the admin's "choose specific entries"
// dropdown: newest first, labelled with each entry's heading text.
export async function getHeroSlideOptions(supabase: any, slideType: string) {
  const config = HERO_SLIDE_TYPES[slideType]
  if (!config) return []

  const { data } = await supabase.from(config.table).select("*").order("created_at", { ascending: false })

  return (data || []).map(config.toItem) as HeroSlideItem[]
}

// Hand-picked entries in the order they were picked; otherwise the latest entries
// first (LIFO): the most recently added record leads the slide.
export async function getHeroSlideItems(supabase: any, slideType: string, limit: number, itemIds?: string[] | null) {
  const config = HERO_SLIDE_TYPES[slideType]
  if (!config) return []

  if (itemIds && itemIds.length > 0) {
    const { data } = await supabase.from(config.table).select("*").in("id", itemIds)
    const byId = new Map((data || []).map((row: any) => [row.id, row]))
    return itemIds.filter((id) => byId.has(id)).map((id) => config.toItem(byId.get(id))) as HeroSlideItem[]
  }

  const { data } = await supabase
    .from(config.table)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  return (data || []).map(config.toItem) as HeroSlideItem[]
}

// All hero_slides rows (Introduction included) in slider order.
export async function getOrderedHeroSlides(supabase: any) {
  const { data } = await supabase
    .from("hero_slides")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
  return (data || []) as any[]
}
