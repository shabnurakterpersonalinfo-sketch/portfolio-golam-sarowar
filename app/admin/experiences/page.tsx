import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"

export default async function AdminExperiences() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Experiences</h1>
          <p className="text-muted-foreground mt-1">Manage your professional experience</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href="/admin/experiences/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {experiences?.map((exp) => (
          <Card key={exp.id} className="border-l-4 border-primary">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{exp.position}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{exp.organization}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {exp.start_date} - {exp.end_date} • {exp.location}
                  </p>
                  {exp.project_name && (
                    <p className="text-sm text-muted-foreground mt-2">Project: {exp.project_name}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/experiences/${exp.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!experiences || experiences.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No experiences yet. Click &quot;Add Experience&quot; to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
