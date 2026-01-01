"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllBlogs, createBlog, updateBlog, deleteBlog, Blog } from "@/lib/api"
import { Trash2, Loader2, Edit, Eye, EyeOff, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function AdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",
    status: "draft",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("admin_token")
        const adminUserStr = localStorage.getItem("admin_user")
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

        if (!token) {
          router.push("/blogs/dologin")
          return false
        }

        if (!adminUserStr) {
          router.push("/blogs/dologin")
          return false
        }

        try {
          const adminUser = JSON.parse(adminUserStr)
          if (!adminUser.email) {
            router.push("/blogs/dologin")
            return false
          }

          if (adminEmail && adminUser.email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
            router.push("/blogs/dologin")
            return false
          }
        } catch (error) {
          router.push("/blogs/dologin")
          return false
        }

        setIsAuthenticated(true)
        return true
      }
      return false
    }

    if (process.env.NEXT_PUBLIC_BLOGS_FEATURE !== "true") {
      window.location.href = "/"
      return
    }

    const authenticated = checkAuth()
    setCheckingAuth(false)
    
    if (authenticated) {
      fetchBlogs()
    }
  }, [router])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token")
      localStorage.removeItem("admin_user")
      router.push("/blogs/dologin")
    }
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await getAllBlogs(100, 0)
      setBlogs(response.blogs)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      status: "draft",
    })
    setImageFile(null)
    setEditingBlogId(null)
  }

  const handleEdit = (blog: Blog) => {
    setEditingBlogId(blog.id)
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt || "",
      category: blog.category || "",
      tags: blog.tags.join(", "),
      status: blog.status,
    })
    setImageFile(null)
  }

  const handleCancel = () => {
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      if (editingBlogId) {
        const updateData: Partial<Blog> = {
          title: formData.title,
          content: formData.content,
        }

        if (formData.excerpt) {
          updateData.excerpt = formData.excerpt
        }
        if (formData.category) {
          updateData.category = formData.category
        }
        if (formData.tags) {
          updateData.tags = formData.tags.split(",").map(t => t.trim()).filter(t => t.length > 0)
        }
        updateData.status = formData.status

        await updateBlog(editingBlogId, updateData)

        if (imageFile) {
          toast({
            title: "Note",
            description: "Blog updated successfully. Note: Image updates require a separate upload endpoint.",
          })
        } else {
          toast({
            title: "Success",
            description: "Blog updated successfully",
          })
        }
      } else {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("content", formData.content)
      if (formData.excerpt) data.append("excerpt", formData.excerpt)
      if (formData.category) data.append("category", formData.category)
      if (formData.tags) data.append("tags", formData.tags)
      data.append("status", formData.status)
      if (imageFile) data.append("image", imageFile)

      await createBlog(data)
      
      toast({
        title: "Success",
        description: "Blog created successfully",
      })
      }
      
      resetForm()
      fetchBlogs()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || (editingBlogId ? "Failed to update blog" : "Failed to create blog"),
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      await deleteBlog(id)
      toast({
        title: "Success",
        description: "Blog deleted successfully",
      })
      fetchBlogs()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Blog Admin Panel</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{editingBlogId ? "Update Blog" : "Create New Blog"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="content">Content * (Markdown supported)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                      className="h-8"
                    >
                      {showPreview ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide Preview
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Show Preview
                        </>
                      )}
                    </Button>
                  </div>
                  {showPreview ? (
                    <div className="min-h-[300px] p-4 border border-input rounded-md bg-background prose prose-sm dark:prose-invert max-w-none overflow-auto">
                      {formData.content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {formData.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-muted-foreground">Start typing to see preview...</p>
                      )}
                    </div>
                  ) : (
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={12}
                    required
                      placeholder="Write your content in Markdown format..."
                      className="font-mono text-sm"
                  />
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Technology, Design, Travel"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., react, nextjs, tutorial"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="image">Featured Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  />
                </div>

                <div className="flex gap-2">
                  {editingBlogId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={submitting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" disabled={submitting} className={editingBlogId ? "flex-1" : "w-full"}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingBlogId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                      editingBlogId ? "Update" : "Create Blog"
                  )}
                </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Blogs ({blogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
              ) : blogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No blogs yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog) => (
                        <TableRow key={blog.id}>
                          <TableCell className="font-medium">{blog.title}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                blog.status === "published"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {blog.status}
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(blog.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(blog)}
                                className="hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(blog.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

