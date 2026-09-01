import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/page-hero"
import { MapLocation } from "@/components/map-location"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Mail, Phone, Facebook, Twitter } from "lucide-react"
import { LinkedinIcon, OrcidIcon, GithubIcon } from "@/components/icons/brand-icons"

export default async function ContactPage() {
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").single()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="CONTACT"
        subtitle="I welcome opportunities for collaboration, academic discussions, and professional networking. Feel free to reach out for research inquiries, speaking opportunities, or academic consultation."
        backgroundType="contact"
      />

      <main className="flex-1 py-12 bg-muted">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Contact Information */}
            <div>
              <Card>
                <CardContent className="p-5">
                  <h2 className="text-xl font-bold text-primary mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.address || "Khilkhet, Dhaka, Bangladesh"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{profile?.email || "mohammad.sarowar06@gmail.com"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{profile?.phone || "+880 1876473956"}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4 bg-primary/5">
                <CardContent className="p-5">
                  <h3 className="font-bold text-primary mb-3">Research Collaboration</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    I am open to research collaboration opportunities and welcome engagement in interdisciplinary
                    projects that drive innovation and meaningful impact. I would be glad to connect with researchers,
                    academics, and institutions interested in potential partnerships. Please feel free to reach out if
                    you are exploring avenues for collaboration or have funding opportunities for joint research
                    initiatives.
                  </p>
                </CardContent>
              </Card>

              {(profile?.linkedin_url ||
                profile?.facebook_url ||
                profile?.github_url ||
                profile?.twitter_url ||
                profile?.orcid_url) && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {profile?.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      <LinkedinIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                  )}
                  {profile?.facebook_url && (
                    <a
                      href={profile.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      <Facebook className="h-5 w-5" />
                      <span className="text-sm font-medium">Facebook</span>
                    </a>
                  )}
                  {profile?.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      <GithubIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">GitHub</span>
                    </a>
                  )}
                  {profile?.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                      <span className="text-sm font-medium">Twitter</span>
                    </a>
                  )}
                  {profile?.orcid_url && (
                    <a
                      href={profile.orcid_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      <OrcidIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">ORCID</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Contact Form */}
            <Card className="h-auto">
              <CardContent className="p-4">
                <h2 className="text-xl font-bold text-primary mb-3">Send a Message</h2>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-primary mb-4 text-center">Find Me Here</h2>
            <MapLocation
              latitude={23.8259}
              longitude={90.4249}
              locationName="Khilkhet, Dhaka, Bangladesh"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
