"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllBlogs, Blog } from "@/lib/api"
import Image from "next/image"
import { Calendar, Moon, Sun, ArrowLeft } from "lucide-react"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BLOGS_FEATURE !== "true") {
      router.push("/")
      return
    }
    fetchBlogs()
  }, [router])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await getAllBlogs(50, 0)
      const publishedBlogs = response.blogs.filter(blog => blog.status === "published")
      setBlogs(publishedBlogs)
    } catch (error) {
      console.error("Error fetching blogs:", error)
      // Set empty array on error to prevent UI crashes
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 p-0 rounded-full flex items-center justify-center border-slate-300 dark:border-slate-600 bg-white/90 dark:bg-slate-900/90 hover:border-lime-400 hover:text-lime-600 dark:hover:text-lime-400 transition-colors shadow-md"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Portfolio
        </Button>
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                onClick={() => router.push(`/blogs/${blog.slug}`)}
              >
                <div className="flex flex-col sm:flex-row">
                  {blog.featured_image && (
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                      <Image
                        src={blog.featured_image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        priority={blogs.indexOf(blog) < 6}
                      />
                    </div>
                  )}
                  <CardContent className="p-6 flex-1">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start gap-3 mb-2">
                        {blog.category && blog.category.trim() !== "" && (
                          <Badge variant="secondary" className="flex-shrink-0">
                            {blog.category}
                          </Badge>
                        )}
                        <h2 className="text-xl font-semibold line-clamp-2 flex-1">{blog.title}</h2>
                      </div>
                      {blog.excerpt && (
                        <p className="text-muted-foreground mb-4 line-clamp-2 flex-1">{blog.excerpt}</p>
                      )}
                      {blog.published_at && (
                        <div className="flex items-center text-sm text-muted-foreground mt-auto">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(blog.published_at)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
