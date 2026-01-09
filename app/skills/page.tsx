import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Laptop, Languages, Award, ExternalLink } from "lucide-react"
import Image from "next/image"

const categoryIcons = {
  Interpersonal: Users,
  Technical: Laptop,
  Languages: Languages,
}

// Flag images mapping - using flagcdn.com CDN for high-quality flag images
const languageFlags: Record<string, string> = {
  Bengali: "https://flagcdn.com/w320/bd.png",
  Bangla: "https://flagcdn.com/w320/bd.png",
  English: "https://flagcdn.com/w320/gb.png",
  Hindi: "https://flagcdn.com/w320/in.png",
  Urdu: "https://flagcdn.com/w320/pk.png",
  Arabic: "https://flagcdn.com/w320/sa.png",
  Spanish: "https://flagcdn.com/w320/es.png",
  French: "https://flagcdn.com/w320/fr.png",
  German: "https://flagcdn.com/w320/de.png",
  Chinese: "https://flagcdn.com/w320/cn.png",
  Japanese: "https://flagcdn.com/w320/jp.png",
}

export default async function SkillsPage() {
  const supabase = await createClient()

  const { data: skills } = await supabase.from("skills").select("*").order("display_order", { ascending: true })

  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .order("display_order", { ascending: true })

  type Skill = NonNullable<typeof skills>[number]
  
  const groupedSkills = skills?.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="SKILLS & COURSES"
        subtitle="Technical expertise, interpersonal abilities, and continuous learning through professional development and certification programs."
        backgroundType="skills"
      />

      <main className="flex-1 py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="space-y-12">
            {/* Skills Categories */}
            {Object.entries(groupedSkills || {}).map(([category, categorySkills]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons] || Users
              return (
                <section key={category}>
                  <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                    <Icon className="h-6 w-6" />
                    {category}
                  </h2>
                  <div className="grid md:grid-cols-4 gap-4">
                    {(categorySkills as Skill[]).map((skill) => {
                      // For Languages category, show flag image instead of icon
                      const isLanguage = category === "Languages"
                      const flagUrl = isLanguage ? (languageFlags[skill.name] || null) : null
                      const proficiency = skill.proficiency || "Basic"
                      const isHighProficiency =
                        proficiency.toLowerCase().includes("high") ||
                        proficiency.toLowerCase().includes("proficient") ||
                        proficiency.toLowerCase().includes("fluent") ||
                        proficiency.toLowerCase().includes("expert") ||
                        proficiency.toLowerCase().includes("native")
                      
                      return (
                        <Card
                          key={skill.id}
                          className={`border-l-4 border-primary hover:shadow-lg transition-all hover:-translate-y-1 ${
                            isLanguage && isHighProficiency ? "bg-[#d4f1e8] border-[#036445]" : ""
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center gap-2">
                              {isLanguage && flagUrl ? (
                                <div className="relative w-20 h-14 flex items-center justify-center">
                                  <Image
                                    src={flagUrl}
                                    alt={`${skill.name} flag`}
                                    width={80}
                                    height={60}
                                    className="object-contain rounded shadow-sm"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <Icon className="h-8 w-8 text-primary" />
                              )}
                              <h3 className="font-bold text-primary">{skill.name}</h3>
                              {skill.proficiency && (
                                <p className={`text-sm ${isLanguage && isHighProficiency ? "text-primary/80 font-medium" : "text-muted-foreground"}`}>
                                  {skill.proficiency.toLowerCase().includes("native") ? "Native" : skill.proficiency}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </section>
              )
            })}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section className="mt-16">
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Certifications & Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certifications.map((cert) => (
                    <Card key={cert.id} className="border border-gray-200 hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                      <CardContent className="p-0">
                        {/* Certificate Image - Enhanced for Better Visibility */}
                        <div className="relative w-full h-64 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-b border-gray-200">
                          {cert.image ? (
                            <div className="relative w-full h-full p-6">
                              <Image
                                src={cert.image}
                                alt={cert.name}
                                fill
                                className="object-contain drop-shadow-lg"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                              <Award className="h-20 w-20 opacity-20" />
                            </div>
                          )}
                        </div>
                        
                        {/* Certificate Details */}
                        <div className="p-6 space-y-3">
                          <div>
                            <h3 className="text-lg font-bold text-foreground mb-1">{cert.name}</h3>
                            <p className="text-sm text-muted-foreground font-medium">{cert.issuer}</p>
                            <p className="text-sm text-muted-foreground mt-1">{cert.issue_date}</p>
                          </div>
                          
                          {cert.credential_url && (
                            <Button
                              asChild
                              variant="outline"
                              className="w-full border-primary-light text-primary hover:bg-primary-light"
                            >
                              <a
                                href={cert.credential_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Check the Certificate
                              </a>
                            </Button>
                          )}
                        </div>
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
