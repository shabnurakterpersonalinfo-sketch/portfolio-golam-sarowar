import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"

export default async function AdminSkills() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: skills } = await supabase.from("skills").select("*").order("display_order", { ascending: true })

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Skills</h1>
          <p className="text-muted-foreground mt-1">Manage your technical and interpersonal skills</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href="/admin/skills/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Link>
        </Button>
      </div>

      {(Object.entries(groupedSkills ?? {}) as [string, Skill[]][]).map(([category, categorySkills]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-bold text-primary">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorySkills.map((skill) => (
              <Card key={skill.id} className="border-l-4 border-primary">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{skill.name}</h3>
                      <p className="text-sm text-muted-foreground">{skill.proficiency}</p>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/admin/skills/${skill.id}`}>
                        <Pencil className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {(!skills || skills.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No skills yet. Click &quot;Add Skill&quot; to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
