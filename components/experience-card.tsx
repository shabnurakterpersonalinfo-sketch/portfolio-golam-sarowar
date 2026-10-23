import { Briefcase, Calendar, ExternalLink, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { EntryLogo, EntryOrgLink } from "@/components/entry-logo"
import { EntryMedia } from "@/components/entry-media"
import { parseEntryMedia } from "@/lib/entry-media"

// One experience entry, LinkedIn-style: logo, role, linked company, dates, details,
// then a strip of workplace photos / training certificates / links.
export function ExperienceCard({ exp, showDescription = false }: { exp: any; showDescription?: boolean }) {
  const media = parseEntryMedia(exp.media)

  return (
    <Card className="border-l-4 border-primary hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
          <EntryLogo src={exp.logo_url} alt={exp.organization} fallbackIcon={Briefcase} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5">{exp.position}</h3>
                <div className="flex items-center gap-2 text-primary font-semibold text-base sm:text-lg mb-1.5">
                  <EntryOrgLink name={exp.organization} url={exp.website_url} />
                  {exp.website_url && <ExternalLink className="h-4 w-4 opacity-70" />}
                </div>
                {exp.project_name && (
                  <p className="text-base text-muted-foreground">
                    <span className="font-semibold text-foreground">Project:</span> {exp.project_name}
                  </p>
                )}
              </div>
              {exp.employment_type && (
                <span className="text-sm font-semibold bg-primary text-white px-4 py-1.5 rounded-full whitespace-nowrap self-start">
                  {exp.employment_type}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-base text-muted-foreground mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">
                  {exp.start_date} - {exp.end_date}
                </span>
              </div>
              {exp.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{exp.location}</span>
                </div>
              )}
            </div>

            {showDescription && exp.description && <p className="text-base text-muted-foreground mb-4">{exp.description}</p>}

            {exp.responsibilities && exp.responsibilities.length > 0 && (
              <ul className="space-y-3">
                {exp.responsibilities.map((responsibility: any, index: number) => (
                  <li key={index} className="flex gap-3 text-base">
                    <span className="text-primary font-bold text-lg">•</span>
                    <span className="text-muted-foreground leading-relaxed">{responsibility}</span>
                  </li>
                ))}
              </ul>
            )}

            {media.length > 0 && (
              <div className="mt-6 pt-5 border-t border-border">
                <EntryMedia items={media} entryTitle={`${exp.position}, ${exp.organization}`} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
