import { createClient } from "@/lib/supabase/server"
import { getSectionVisibility } from "@/lib/section-visibility"
import { NavbarClient, type NavItem } from "@/components/navbar-client"

const ALL_NAV_ITEMS: (NavItem & { visibilityKey?: keyof Awaited<ReturnType<typeof getSectionVisibility>> })[] = [
  { name: "Home", href: "/", scrollTo: "home" },
  { name: "Experiences", href: "/experiences", scrollTo: "experiences", visibilityKey: "experiences" },
  {
    name: "Scholarly Activities",
    href: "/scholarly-activities",
    scrollTo: "scholarly-activities",
    visibilityKey: "scholarlyActivities",
  },
  { name: "Publications", href: "/publications", scrollTo: "publications", visibilityKey: "publications" },
  { name: "Honors & Awards", href: "/awards", scrollTo: "awards", visibilityKey: "awards" },
  { name: "Skills & Courses", href: "/skills", scrollTo: "skills", visibilityKey: "skills" },
  { name: "Volunteering", href: "/volunteering", scrollTo: "volunteering", visibilityKey: "volunteering" },
  { name: "Blogs", href: "/blogs", scrollTo: "blogs", visibilityKey: "blogs" },
  { name: "Contact", href: "/contact", scrollTo: "contact" },
]

// Server Component wrapper: fetches which sections actually have content and hides
// the corresponding nav link (and mobile menu entry) for any that are empty, before
// handing the rest off to the interactive client component.
export async function Navbar() {
  const supabase = await createClient()
  const visibility = await getSectionVisibility(supabase)

  const navItems = ALL_NAV_ITEMS.filter((item) => !item.visibilityKey || visibility[item.visibilityKey])

  return <NavbarClient navItems={navItems} />
}
