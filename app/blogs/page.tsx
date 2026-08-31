import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageHero } from "@/components/page-hero"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function BlogsPage() {
  const supabase = await createClient()

  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <PageHero
        title="BLOGS"
        subtitle="Thoughts, insights, and perspectives on networking, distributed systems, and emerging technology research."
        backgroundType="blogs"
      />

      <main className="flex-1 py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs?.map((blog) => (
              <Card
                key={blog.id}
                className="border-t-4 border-primary hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  {blog.featured_image && (
                    <div className="w-full h-48 bg-muted">
                      <Image
                        src={blog.featured_image || "/placeholder.svg"}
                        alt={blog.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{blog.published_date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 text-balance">{blog.title}</h3>
                    {blog.excerpt && <p className="text-sm text-muted-foreground mb-4 text-pretty">{blog.excerpt}</p>}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                          <span key={index} className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Button variant="link" className="text-primary p-0 h-auto" asChild>
                      <Link href={`/blogs/${blog.id}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
