"use client"

interface PageHeroProps {
  title: string
  subtitle: string
  backgroundType:
    | "experience"
    | "scholarly"
    | "publications"
    | "volunteering"
    | "blogs"
    | "contact"
    | "awards"
    | "skills"
    | "gallery"
}

export function PageHero({ title, subtitle, backgroundType }: PageHeroProps) {
  const backgroundImages: Partial<Record<PageHeroProps["backgroundType"], string>> = {
    experience: "/professional-office-workspace-illustration-teal-gr.jpg",
    scholarly: "/academic-research-books-graduation-illustration-te.jpg",
    publications: "/writing-research-papers-books-illustration-teal-gr.jpg",
    volunteering: "/community-service-helping-hands-illustration-teal-.jpg",
    blogs: "/blogging-writing-laptop-illustration-teal-gradient.jpg",
    contact: "/person-working-at-desk-with-plants-office-illustra.jpg",
    awards: "/trophy-awards-achievement-celebration-illustration.jpg",
    skills: "/learning-skills-development-technology-illustratio.jpg",
    // No themed illustration for gallery yet — fall back to the plain gradient
    // below rather than showing an unrelated stock photo.
  }

  const backgroundImage = backgroundImages[backgroundType]

  return (
    <div
      className="relative h-[300px] flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #036445 0%, #05967d 50%, #7dd3c0 100%)",
      }}
    >
      {/* Decorative background image (only rendered when a themed illustration exists) */}
      {backgroundImage && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        <div className="w-24 h-1 bg-white mx-auto mb-4"></div>
        <p className="text-white/90 max-w-3xl mx-auto text-balance text-lg">{subtitle}</p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
    </div>
  )
}
