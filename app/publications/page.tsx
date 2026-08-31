import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, ExternalLink, Users, FileText, Quote } from "lucide-react"
import { ConferencePublicationCard } from "@/components/conference-publication-card"
import { LinkPreview } from "@/components/link-preview"

// Force dynamic rendering to prevent caching in production
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PublicationsPage() {
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").single()
  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .order("display_order", { ascending: true })

  const academicPublications = publications?.filter((pub) => pub.category === "Academic Publication") || []
  const nonAcademicPublications = publications?.filter((pub) => pub.category === "Non-Academic Publication") || []
  const workInProgress = publications?.filter((pub) => pub.category === "Work in Progress") || []
  const conferencePublications = publications?.filter((pub) => pub.category === "Conference Publication") || []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="PUBLICATIONS"
        subtitle="A collection of my academic contributions, including peer-reviewed articles, conference presentations, and ongoing research projects."
        backgroundType="publications"
      />

      <main className="flex-1 py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-12">
            {/* Academic Publications */}
            {academicPublications.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Academic Publications
              </h2>
              <div className="space-y-6">
                {academicPublications.map((pub) => (
                  <Card key={pub.id} className="border-l-4 border-primary hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-foreground flex-1 text-balance">{pub.title}</h3>
                        <span
                          className={`text-xs px-3 py-1 rounded-full whitespace-nowrap ml-4 ${
                            pub.status === "Published"
                              ? "bg-primary-light text-primary"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {pub.status}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 flex-shrink-0" />
                          <span>{pub.authors}</span>
                        </div>
                        {pub.journal && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium">{pub.journal}</span>
                          </div>
                        )}
                        {pub.publication_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>{pub.publication_date}</span>
                          </div>
                        )}
                      </div>

                      {pub.abstract && (
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{pub.abstract}</p>
                      )}

                      {pub.keywords && pub.keywords.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-foreground mb-2">Keywords:</p>
                          <p className="text-xs text-muted-foreground">{pub.keywords.join(", ")}</p>
                        </div>
                      )}

                      {pub.citation_count !== null && pub.citation_count !== undefined && (
                        <div className="mb-4 flex items-center gap-2">
                          <Quote className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">
                            Citations: <span className="text-primary">{pub.citation_count}</span>
                          </span>
                        </div>
                      )}

                      {pub.academic_pdf && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-primary text-primary bg-transparent"
                        >
                          <a href={pub.academic_pdf} target="_blank" rel="noopener noreferrer">
                            <FileText className="mr-2 h-4 w-4" />
                            View PDF <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            )}

            {/* Non-Academic Publications */}
            {nonAcademicPublications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Non-Academic Publications
                </h2>
                <div className="space-y-4">
                  {nonAcademicPublications.map((pub) => (
                    <Card key={pub.id} className="border-l-4 border-primary hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-foreground mb-3">{pub.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          {pub.journal && <span className="font-medium">{pub.journal}</span>}
                          {pub.publication_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {pub.publication_date}
                            </span>
                          )}
                        </div>
                        {pub.url && (
                          <div className="mt-4">
                            <LinkPreview url={pub.url} title={pub.title} profileImage={profile?.profile_image} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Conference Publications */}
            {conferencePublications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Conference Publications
                </h2>
                <div className="space-y-6">
                  {conferencePublications.map((pub) => (
                    <ConferencePublicationCard key={pub.id} publication={pub} />
                  ))}
                </div>
              </section>
            )}

            {/* Work in Progress */}
            {workInProgress.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Work in Progress
                </h2>
                <div className="space-y-6">
                  {workInProgress.map((pub) => (
                    <Card key={pub.id} className="border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                          <h3 className="text-lg font-bold text-foreground flex-1">{pub.title}</h3>
                          {pub.status && (
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap self-start ${
                                pub.status === "Under Review"
                                  ? "bg-blue-100 text-blue-800"
                                  : pub.status === "Revision Phase"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {pub.status}
                            </span>
                          )}
                        </div>

                        {pub.authors && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Users className="h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{pub.authors}</span>
                          </div>
                        )}

                        {pub.abstract && (
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                              {pub.abstract}
                            </p>
                          </div>
                        )}

                        {pub.keywords && pub.keywords.length > 0 && (
                          <div className="pt-4 border-t border-border">
                            <p className="text-xs font-semibold text-foreground mb-2">Keywords:</p>
                            <div className="flex flex-wrap gap-2">
                              {pub.keywords.map((keyword: any, idx: number) => (
                                <span key={idx} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
