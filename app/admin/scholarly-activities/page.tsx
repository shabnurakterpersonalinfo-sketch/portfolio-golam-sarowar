import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"

export default async function AdminScholarlyActivities() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: activities } = await supabase
    .from("scholarly_activities")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Scholarly Activities</h1>
          <p className="text-muted-foreground mt-1">Manage your academic conferences and presentations</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href="/admin/scholarly-activities/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {activities?.map((activity) => (
          <Card key={activity.id} className="border-l-4 border-primary">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="text-xs bg-primary-light text-primary px-3 py-1 rounded-full">
                      {activity.type}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{activity.title}</h3>
                      {activity.organization && (
                        <p className="text-sm text-primary font-medium mt-1">{activity.organization}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">{activity.date}</p>
                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-3">{activity.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/scholarly-activities/${activity.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!activities || activities.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No scholarly activities yet. Click &quot;Add Activity&quot; to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
