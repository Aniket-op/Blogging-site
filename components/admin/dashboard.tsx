'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useBlogStore } from '@/lib/blog-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { BlogEditor } from '@/components/admin/blog-editor'
import { formatDate } from '@/lib/mock-data'
import type { Blog } from '@/lib/types'
import {
  FileText,
  FilePlus,
  Eye,
  FileEdit,
  LogOut,
  MoreVertical,
  Trash2,
  Send,
  Archive,
  Home,
} from 'lucide-react'
import Link from 'next/link'

type View = 'dashboard' | 'editor'

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const { blogs, deleteBlog, updateBlog } = useBlogStore()
  const [view, setView] = useState<View>('dashboard')
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null)

  const publishedCount = blogs.filter(b => b.status === 'published').length
  const draftCount = blogs.filter(b => b.status === 'draft').length

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog)
    setView('editor')
  }

  const handleCreate = () => {
    setEditingBlog(null)
    setView('editor')
  }

  const handleBack = () => {
    setEditingBlog(null)
    setView('dashboard')
  }

  const handleDelete = (blog: Blog) => {
    setBlogToDelete(blog)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (blogToDelete) {
      deleteBlog(blogToDelete.id)
      setBlogToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  const toggleStatus = (blog: Blog) => {
    updateBlog(blog.id, {
      status: blog.status === 'published' ? 'draft' : 'published',
    })
  }

  if (view === 'editor') {
    return <BlogEditor blog={editingBlog} onBack={handleBack} />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span className="font-semibold text-lg">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <Home className="w-4 h-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <Button onClick={handleCreate}>
            <FilePlus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Posts
              </CardTitle>
              <FileText className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{blogs.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{publishedCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Drafts
              </CardTitle>
              <FileEdit className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{draftCount}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {blogs.map(blog => (
                <div
                  key={blog.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{blog.title}</h3>
                      <Badge
                        variant={blog.status === 'published' ? 'default' : 'secondary'}
                        className="flex-shrink-0"
                      >
                        {blog.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {blog.category} • {formatDate(blog.updatedAt)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(blog)}>
                        <FileEdit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(blog)}>
                        {blog.status === 'published' ? (
                          <>
                            <Archive className="w-4 h-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(blog)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{blogToDelete?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
