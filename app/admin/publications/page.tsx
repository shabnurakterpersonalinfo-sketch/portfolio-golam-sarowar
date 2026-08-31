import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"

export default async function AdminPublications() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: publications } = await supabase
    .from("publications")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Publications</h1>
          <p className="text-muted-foreground mt-1">Manage your research publications</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary-dark">
          <Link href="/admin/publications/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Publication
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {publications?.map((pub) => (
          <Card key={pub.id} className="border-l-4 border-primary">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{pub.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{pub.authors}</p>
                      <div className="flex gap-3 mt-2 text-sm">
                        {pub.journal && <span className="text-primary font-medium">{pub.journal}</span>}
                        {pub.publication_date && <span className="text-muted-foreground">{pub.publication_date}</span>}
                      </div>
                      <span
                        className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                          pub.status === "Published" ? "bg-primary-light text-primary" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {pub.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/publications/${pub.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!publications || publications.length === 0) && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No publications yet. Click &quot;Add Publication&quot; to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
