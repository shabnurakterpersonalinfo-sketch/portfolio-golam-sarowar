import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"

export default async function AdminEducation() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: education } = await supabase.from("education").select("*").order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Education</h1>
          <p className="text-muted-foreground mt-1">Manage your academic credentials</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href="/admin/education/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Education
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {education?.map((edu) => (
          <Card key={edu.id} className="border-l-4 border-primary">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {edu.institution} • {edu.start_date} - {edu.end_date}
                  </p>
                  {edu.cgpa && <p className="text-sm font-semibold text-primary mt-1">{edu.cgpa}</p>}
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/education/${edu.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!education || education.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No education records yet. Click &quot;Add Education&quot; to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
