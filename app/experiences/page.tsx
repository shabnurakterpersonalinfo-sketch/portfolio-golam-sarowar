import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, MapPin, Calendar } from "lucide-react"

export default async function ExperiencesPage() {
  const supabase = await createClient()

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("display_order", { ascending: true })

  const researchExperiences = experiences?.filter((exp) => exp.category === "Research") || []
  const industryExperiences = experiences?.filter((exp) => exp.category === "Industry") || []

  // Only show tabs that actually have content, with a tab that has data always
  // ordered ahead of an empty one — an empty tab is never rendered at all.
  const experienceTabs = [
    { key: "industry", label: "Industry", items: industryExperiences },
    { key: "research", label: "Research", items: researchExperiences },
  ].filter((tab) => tab.items.length > 0)
  const gridColsClass: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2" }

  const renderExperienceCard = (exp: (typeof researchExperiences)[number]) => (
    <Card key={exp.id} className="border-l-4 border-primary hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">{exp.position}</h3>
            <div className="flex items-center gap-2 text-primary font-medium mb-2">
              <Briefcase className="h-4 w-4" />
              <span>{exp.organization}</span>
            </div>
            {exp.project_name && (
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-semibold">Project:</span> {exp.project_name}
              </p>
            )}
          </div>
          <span className="text-sm bg-primary text-white px-3 py-1 rounded-full whitespace-nowrap">
            {exp.employment_type}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {exp.start_date} - {exp.end_date}
            </span>
          </div>
          {exp.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{exp.location}</span>
            </div>
          )}
        </div>

        {exp.description && <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>}

        {exp.responsibilities && exp.responsibilities.length > 0 && (
          <ul className="space-y-2">
            {exp.responsibilities.map((responsibility: any, index: number) => (
              <li key={index} className="flex gap-2 text-sm">
                <span className="text-primary font-bold">•</span>
                <span className="text-muted-foreground">{responsibility}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="PROFESSIONAL EXPERIENCE"
        subtitle="A comprehensive overview of my industry, research, and academic experiences that have shaped my professional development and technical expertise."
        backgroundType="experience"
      />

      <main className="flex-1 py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          {experienceTabs.length > 0 ? (
            <Tabs defaultValue={experienceTabs[0].key} className="max-w-5xl mx-auto">
              <TabsList
                className={`grid w-full max-w-md mx-auto ${gridColsClass[experienceTabs.length] || "grid-cols-1"} mb-12 h-auto p-1 bg-white shadow-sm`}
              >
                {experienceTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white py-3 text-base font-semibold"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {industryExperiences.length > 0 && (
                <TabsContent value="industry" className="space-y-6">
                  {industryExperiences.map(renderExperienceCard)}
                </TabsContent>
              )}

              {researchExperiences.length > 0 && (
                <TabsContent value="research" className="space-y-6">
                  {researchExperiences.map(renderExperienceCard)}
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <p className="text-center text-muted-foreground py-12">No experiences available yet.</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
