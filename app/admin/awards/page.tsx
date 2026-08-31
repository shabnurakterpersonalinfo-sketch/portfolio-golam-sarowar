import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"

export default async function AdminAwards() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: awards } = await supabase.from("awards").select("*").order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Awards & Honors</h1>
          <p className="text-muted-foreground mt-1">Manage your achievements and recognitions</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href="/admin/awards/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Award
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards?.map((award) => (
          <Card key={award.id} className="border-t-4 border-primary">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-balance">{award.title}</h3>
                  <p className="text-sm text-primary font-medium mt-1">{award.issuer}</p>
                  <p className="text-sm text-muted-foreground mt-1">{award.date}</p>
                </div>
              </div>
              {award.description && <p className="text-sm text-muted-foreground mb-4">{award.description}</p>}
              <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                <Link href={`/admin/awards/${award.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        {(!awards || awards.length === 0) && (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No awards yet. Click &quot;Add Award&quot; to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
