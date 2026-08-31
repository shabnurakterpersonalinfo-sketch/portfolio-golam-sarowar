# Seed Data Guide

This portfolio is **database-driven**, not file-driven. Almost none of the content you see on the public pages is hardcoded in `.tsx` files — it is stored in Supabase (PostgreSQL) and rendered by Server Components at request time. This guide explains where everything lives, how to seed or update it, and what to watch out for.

There are exactly three places content can come from:

1. **Supabase tables** — profile, education, experience, publications, skills, certifications, awards, volunteering, scholarly activities, blogs. Edit these via the `/admin` panel or SQL.
2. **A handful of static UI strings** — SEO metadata, nav labels, footer boilerplate, contact-form fallback text. Edit these directly in the listed `.tsx`/`.ts` files.
3. **Static assets in `public/`** — the CV PDF, the Open Graph image, placeholder illustrations.

---

## 1. Directory Map

```
├── app/
│   ├── layout.tsx              # Global SEO: <title>, description, OpenGraph, Twitter card, icons
│   ├── sitemap.ts               # Auto-generated sitemap.xml (add routes here if you add pages)
│   ├── robots.ts                # robots.txt (disallows /admin, /auth)
│   ├── icon.tsx                 # Favicon — reads profiles.profile_image, falls back to "MS" monogram
│   ├── page.tsx                 # Homepage — fetches ALL tables, renders every section + fallback strings
│   ├── experiences/page.tsx     # Full experience list (Industry / Research tabs)
│   ├── skills/page.tsx          # Full skills + certifications list
│   ├── publications/page.tsx    # Full publications list (Academic/Conference/Non-Academic/WIP tabs)
│   ├── awards/page.tsx          # Full awards grid
│   ├── volunteering/page.tsx    # Full volunteering list
│   ├── scholarly-activities/page.tsx
│   ├── blogs/page.tsx           # Full blog list (blogs table, is_published = true only)
│   ├── contact/page.tsx         # Contact info + map + contact form
│   ├── api/contact/route.ts     # Sends contact-form submissions via Resend to mohammad.sarowar06@gmail.com
│   └── admin/                   # CRUD UI for every table below (auth-protected)
├── components/
│   ├── navbar.tsx                # Logo text ("M. SAROWAR") + nav links (static)
│   ├── footer.tsx                 # Contact info, quick links, copyright (static)
│   ├── download-cv-button.tsx      # Points at /Mohammad_Golam_Sarowar_CV.pdf (static)
│   └── map-location.tsx            # Default map coordinates (static, overridden by contact/page.tsx)
├── lib/supabase/
│   ├── client.ts / server.ts / proxy.ts   # Supabase connections — REQUIRE env vars, no fallback project
├── scripts/
│   ├── 001_create_tables.sql        # Full schema (10 tables)
│   ├── 003_create_storage_bucket.sql, 006_fix_rls_policies.sql, 007–013_*.sql   # Migrations (images, conference fields, PDFs)
│   └── 014_seed_new_client_data.sql  # ⭐ This client's seed data (profile → scholarly activities)
└── public/
    ├── Mohammad_Golam_Sarowar_CV.pdf   # Downloadable CV (served by the "Download CV" button)
    └── profile-hero.jpg, icon.svg, ...  # Illustrations + OG image
```

---

## 2. CV Section → Code / Table Map

| CV Section | Where it lives | How to update |
|---|---|---|
| Name, title, bio, contact info, social links | `profiles` table (1 row) | `/admin/profile`, or `scripts/014_seed_new_client_data.sql` |
| Education history | `education` table | `/admin/education`, or the seed script |
| Work experience (Industry + Research) | `experiences` table, `category` = `'Industry'` \| `'Research'` | `/admin/experiences` |
| Publications (academic / conference / non-academic / in progress) | `publications` table, `category` field | `/admin/publications` |
| Technical / Interpersonal / Language skills | `skills` table, `category` field | `/admin/skills` |
| Professional certifications (CCNA, MTCRE, …) | `certifications` table | `/admin/certifications` |
| Honors & awards | `awards` table | `/admin/awards` |
| Volunteering | `volunteering` table | `/admin/volunteering` |
| Scholarly activities (conferences, workshops, presentations) | `scholarly_activities` table | `/admin/scholarly-activities` |
| Blog posts | `blogs` table | `/admin/blogs` route is not built yet — insert via SQL or Supabase Studio for now |
| CV PDF download | `public/Mohammad_Golam_Sarowar_CV.pdf` | Replace the file, keep the filename or update `components/download-cv-button.tsx` |
| Site title / meta description / OG image | `app/layout.tsx` | Edit `siteName`, `siteDescription`, `/profile-hero.jpg` |
| Footer address/phone/email, nav brand | `components/footer.tsx`, `components/navbar.tsx` | Edit directly (kept static since they render before any DB fetch) |
| Contact form recipient | `app/api/contact/route.ts` (`to:` field) | Edit directly, plus `RESEND_API_KEY` in `.env.local` |

---

## 3. Running the Seed Script

`scripts/014_seed_new_client_data.sql` contains this client's full profile, mapped from the CV you supplied. **It was intentionally not executed automatically against any live database during this refactor** — running `DELETE FROM ...` against the wrong Supabase project is irreversible, and this copy of the project still points at whatever Supabase project was configured in `.env.local` when it was handed over. Before running it:

1. Confirm `NEXT_PUBLIC_SUPABASE_URL` in `.env.local` (or in Supabase Studio's project settings) points at a project **dedicated to this client** — not one shared with a previous client's live site.
2. If this is a brand-new Supabase project, run `001_create_tables.sql`, `003_create_storage_bucket.sql`, `006_fix_rls_policies.sql`, then `007` through `013` in order first (they add the `image`, `conference_*`, and `academic_pdf`/`citation_count` columns the UI expects).
3. Open the Supabase SQL Editor (or `psql "$POSTGRES_URL" -f scripts/014_seed_new_client_data.sql`) and run `014_seed_new_client_data.sql`.
4. Log in at `/auth/login` and visit `/admin/profile` to add a profile photo and LinkedIn/GitHub links (none were listed on the CV, so they're left blank).

---

## 4. Schemas for Adding Content Later

Use these when adding a new project, job, publication, etc. by hand (via SQL, Supabase Studio, or building a request for the `/admin` forms, which already implement these shapes).

### Experience (job / project)

```typescript
interface Experience {
  id: string                    // uuid, auto-generated
  position: string               // required
  organization: string            // required
  project_name: string | null
  start_date: string              // required, free text e.g. "Jul 2023"
  end_date: string | null         // free text, e.g. "Present"
  location: string | null
  employment_type: string         // e.g. "Full Time", "Part Time", "Voluntary", "Academic Project"
  description: string | null
  responsibilities: string[] | null   // bullet points
  category: "Research" | "Industry"    // controls which tab it appears under
  display_order: number            // lower = shown first
}
```

```json
{
  "position": "Network Engineer",
  "organization": "Example ISP Ltd.",
  "project_name": null,
  "start_date": "Jan 2027",
  "end_date": "Present",
  "location": "Dhaka, Bangladesh",
  "employment_type": "Full Time",
  "description": "Optional one-line summary.",
  "responsibilities": ["Bullet one", "Bullet two"],
  "category": "Industry",
  "display_order": 3
}
```

### Publication

```typescript
interface Publication {
  id: string
  title: string
  authors: string
  journal: string | null
  publication_date: string | null
  status: string                  // "Published" | "Ongoing" | "Accepted for Publication" | "Under Review" | ...
  category: "Academic Publication" | "Conference Publication" | "Non-Academic Publication" | "Work in Progress"
  citations: number | null
  keywords: string[] | null
  abstract: string | null
  url: string | null
  display_order: number
  // Added by migrations 009–012 (optional, conference/academic extras):
  conference_title?: string | null
  conference_organizer?: string | null
  location?: string | null
  conference_images?: string[] | null
  conference_paper_pdf?: string | null
  conference_videos?: string[] | null
  academic_pdf?: string | null
  citation_count?: number | null
}
```

### Skill

```typescript
interface Skill {
  id: string
  name: string
  category: "Technical" | "Interpersonal" | "Languages"   // other strings work but only these 3 get homepage tabs
  proficiency: string | null   // e.g. "Advanced", "Native", "Basic"
  icon: string | null
  display_order: number
}
```

### Award

```typescript
interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description: string | null
  certificate_url: string | null
  image: string | null   // added by migration 013 — public Supabase Storage URL
  display_order: number
}
```

### Education

```typescript
interface Education {
  id: string
  institution: string
  degree: string
  field_of_study: string | null
  start_date: string
  end_date: string | null
  cgpa: string | null
  location: string | null
  achievements: string | null
  status: string   // "Completed" | "Ongoing"
  display_order: number
}
```

### Volunteering / Scholarly Activity / Certification

```typescript
interface Volunteering {
  id: string
  role: string
  organization: string
  start_date: string
  end_date: string | null
  description: string | null
  display_order: number
}

interface ScholarlyActivity {
  id: string
  title: string
  type: string   // e.g. "Conference Presentation", "Workshop"
  organization: string | null
  date: string
  description: string | null
  display_order: number
}

interface Certification {
  id: string
  name: string
  issuer: string
  issue_date: string
  credential_url: string | null
  image: string | null   // added by migration 007
  display_order: number
}
```

---

## 5. Edge-Case Checklist

- [ ] **Empty tables render gracefully.** Every public page already has an empty-state message (e.g. "No research experiences available.") — you do not need placeholder rows just to avoid a crash.
- [ ] **`display_order` controls ordering, not creation order.** Always set it explicitly; ties are broken arbitrarily by Postgres.
- [ ] **Adding a certification/award image:** upload the file via `/admin/certifications` or `/admin/awards` (they use the `certificate-images` / `award-images` Supabase Storage buckets created by migrations 007/013), or insert the public Storage URL directly into the `image` column.
- [ ] **Homepage vs. full pages truncate differently.** The homepage shows up to 3–8 items per section with a "View All" link; the dedicated pages (`/experiences`, `/skills`, etc.) show everything. If content looks missing, check the dedicated page before assuming a data problem.
- [ ] **Skill/experience categories are case-sensitive strings**, not enums. `"Industry"` ≠ `"industry"` — a typo silently drops the row into no tab.
- [ ] **`responsibilities` and `keywords` are Postgres text arrays** (`ARRAY[...]` in SQL, `string[]` from the admin forms) — a single string will render as one very long bullet, not multiple bullets.
- [ ] **Blank optional fields should be `NULL`, not `""`.** The UI checks `{field && <p>...}` — an empty string is truthy-ish in some of these checks (`""` is falsy in JS, so it's actually safe either way, but `NULL` is the DB-idiomatic choice and matches what the admin forms send).
- [ ] **The CV PDF filename is hardcoded** in `components/download-cv-button.tsx`. If you replace `public/Mohammad_Golam_Sarowar_CV.pdf` with a differently-named file, update that component too.
- [ ] **LinkedIn/Facebook icons only render when a URL is set** on the `profiles` row (both `app/page.tsx` and `app/contact/page.tsx` already guard on this) — no need to leave a placeholder `"#"` link.
- [ ] **`.env.local` must point at this client's own Supabase project.** `lib/supabase/{client,server,proxy}.ts` throw an explicit error at startup if `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing — there is no silent fallback to any other project.
- [ ] **Blog publishing:** the `/admin` panel does not yet have a Blogs CRUD screen (only the schema and public listing exist). Insert rows via Supabase Studio or SQL, and set `is_published = true` for it to appear.
