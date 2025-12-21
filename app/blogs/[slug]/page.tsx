"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useTheme } from "next-themes"
import { getBlogBySlug, Blog } from "@/lib/api"
import Image from "next/image"
import { Calendar, ArrowLeft, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BLOGS_FEATURE !== "true") {
      router.push("/")
      return
    }
    if (slug) {
      fetchBlog()
    }
  }, [slug, router])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const data = await getBlogBySlug(slug)
      setBlog(data)
    } catch (error) {
      console.error("Error fetching blog:", error)
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
          <p className="mt-4 text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Button onClick={() => router.push("/blogs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
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
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/blogs")}
          className="mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blogs
        </Button>

        <article>
          {blog.featured_image && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={blog.featured_image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {blog.category && (
                <Badge variant="secondary" className="text-sm">
                  {blog.category}
                </Badge>
              )}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            {blog.published_at && ( 
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(blog.published_at)}
              </div>
            )}
          </header>

          {blog.excerpt && (
            <div className="text-xl text-muted-foreground mb-8 border-l-4 border-primary pl-4">
              {blog.excerpt}
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none mt-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {blog.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  )
}

