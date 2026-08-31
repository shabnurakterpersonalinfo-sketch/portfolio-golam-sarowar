import Link from "next/link"
import { Mail, MapPin, Phone, Linkedin, Facebook, Github, Twitter, IdCard } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getSectionVisibility } from "@/lib/section-visibility"

const ALL_QUICK_LINKS: { name: string; href: string; visibilityKey?: string }[] = [
  { name: "Home", href: "/" },
  { name: "Experiences", href: "/experiences", visibilityKey: "experiences" },
  { name: "Scholarly Activities", href: "/scholarly-activities", visibilityKey: "scholarlyActivities" },
  { name: "Publications", href: "/publications", visibilityKey: "publications" },
  { name: "Honors & Awards", href: "/awards", visibilityKey: "awards" },
  { name: "Skills & Courses", href: "/skills", visibilityKey: "skills" },
  { name: "Volunteering", href: "/volunteering", visibilityKey: "volunteering" },
  { name: "Blogs", href: "/blogs", visibilityKey: "blogs" },
  { name: "Contact", href: "/contact" },
]

export async function Footer() {
  const year = new Date().getFullYear()
  const supabase = await createClient()

  const [{ data: profile }, visibility] = await Promise.all([
    supabase.from("profiles").select("*").single(),
    getSectionVisibility(supabase),
  ])

  const navLinks = ALL_QUICK_LINKS.filter(
    (link) => !link.visibilityKey || visibility[link.visibilityKey as keyof typeof visibility],
  )

  const address = profile?.address || "Khilkhet, Dhaka, Bangladesh"
  const email = profile?.email || "mohammad.sarowar06@gmail.com"
  const phone = profile?.phone || "+880 1876473956"
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, "")}`

  const socialLinks = [
    { url: profile?.linkedin_url, label: "LinkedIn", Icon: Linkedin },
    { url: profile?.facebook_url, label: "Facebook", Icon: Facebook },
    { url: profile?.github_url, label: "GitHub", Icon: Github },
    { url: profile?.twitter_url, label: "Twitter", Icon: Twitter },
    { url: profile?.orcid_url, label: "ORCID", Icon: IdCard },
  ].filter((social) => Boolean(social.url))

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary-light transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={phoneHref} className="hover:text-primary-light transition-colors">
                  {phone}
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-primary-light transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a href={`mailto:${email}`} className="hover:text-primary-light transition-colors">
                Send an email
              </a>
              <a href={phoneHref} className="hover:text-primary-light transition-colors">
                Call directly
              </a>
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3 mt-1">
                  {socialLinks.map(({ url, label, Icon }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-dark text-center text-sm">
          <p>© {year} Mohammad Golam Sarowar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
