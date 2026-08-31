import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"

export default async function AdminVolunteering() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: volunteering } = await supabase
    .from("volunteering")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Volunteering</h1>
          <p className="text-muted-foreground mt-1">Manage your community service activities</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href="/admin/volunteering/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Volunteering
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {volunteering?.map((activity) => (
          <Card key={activity.id} className="border-l-4 border-primary">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{activity.role}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{activity.organization}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.start_date} - {activity.end_date}
                  </p>
                  {activity.description && <p className="text-sm text-muted-foreground mt-3">{activity.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/volunteering/${activity.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!volunteering || volunteering.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No volunteering activities yet. Click &quot;Add Volunteering&quot; to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
