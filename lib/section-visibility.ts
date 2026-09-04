// Cheap existence checks (count-only, no rows fetched) for every content table that
// backs a nav link / dedicated page. Used by Navbar and Footer so an empty section
// never shows up as a dead link, and by the homepage so an empty section's block
// (and its tabs) never render either.
export interface SectionVisibility {
  experiences: boolean
  scholarlyActivities: boolean
  publications: boolean
  awards: boolean
  skills: boolean
  volunteering: boolean
  blogs: boolean
  gallery: boolean
}

const EMPTY_VISIBILITY: SectionVisibility = {
  experiences: false,
  scholarlyActivities: false,
  publications: false,
  awards: false,
  skills: false,
  volunteering: false,
  blogs: false,
  gallery: false,
}

// `supabase` is loosely typed (matches the rest of this codebase's convention of
// passing around the Supabase client as `any`) to avoid coupling this helper to a
// specific client type across the server/browser client variants.
export async function getSectionVisibility(supabase: any): Promise<SectionVisibility> {
  try {
    const [experiences, scholarlyActivities, publications, awards, skills, volunteering, blogs, gallery] =
      await Promise.all([
        supabase.from("experiences").select("id", { count: "exact", head: true }),
        supabase.from("scholarly_activities").select("id", { count: "exact", head: true }),
        supabase.from("publications").select("id", { count: "exact", head: true }),
        supabase.from("awards").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("volunteering").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("gallery_items").select("id", { count: "exact", head: true }),
      ])

    return {
      experiences: (experiences.count ?? 0) > 0,
      scholarlyActivities: (scholarlyActivities.count ?? 0) > 0,
      publications: (publications.count ?? 0) > 0,
      awards: (awards.count ?? 0) > 0,
      skills: (skills.count ?? 0) > 0,
      volunteering: (volunteering.count ?? 0) > 0,
      blogs: (blogs.count ?? 0) > 0,
      gallery: (gallery.count ?? 0) > 0,
    }
  } catch {
    // If the visibility check itself fails for any reason, fail open: show every
    // nav link rather than silently hiding real content behind a broken query.
    return {
      experiences: true,
      scholarlyActivities: true,
      publications: true,
      awards: true,
      skills: true,
      volunteering: true,
      blogs: true,
      gallery: true,
    }
  }
}

export { EMPTY_VISIBILITY }
