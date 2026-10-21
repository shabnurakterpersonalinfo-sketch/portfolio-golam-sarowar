// Section types a homepage hero slide can highlight. Shared by the admin slide form
// (the dropdown) and the homepage (which fetches each slide's latest entries).
// Must stay in sync with the CHECK constraint on hero_slides.slide_type.

export const MAX_HERO_SLIDES = 5

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

// Latest entries first (LIFO): the most recently added record leads the slide.
export async function getHeroSlideItems(supabase: any, slideType: string, limit: number) {
  const config = HERO_SLIDE_TYPES[slideType]
  if (!config) return []

  const { data } = await supabase
    .from(config.table)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  return (data || []).map(config.toItem) as HeroSlideItem[]
}
