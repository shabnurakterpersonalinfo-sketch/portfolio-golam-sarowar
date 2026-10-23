import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/page-hero"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExperienceCard } from "@/components/experience-card"

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
    <ExperienceCard key={exp.id} exp={exp} showDescription />
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
