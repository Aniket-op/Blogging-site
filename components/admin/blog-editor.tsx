'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useBlogStore } from '@/lib/blog-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { Blog, ContentBlock } from '@/lib/types'
import { categories } from '@/lib/mock-data'
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react'
import { BlockEditorCanvas } from './block-editor-canvas'
import { ImageUpload } from '@/components/admin/image-upload'

interface BlogEditorProps {
  blog: Blog | null
  onBack: () => void
}

export function BlogEditor({ blog, onBack }: BlogEditorProps) {
  const { createBlog, updateBlog, updateBlogContent } = useBlogStore()
  const [title, setTitle] = useState(blog?.title || '')
  const [category, setCategory] = useState(blog?.category || categories[0].name)
  const [coverImage, setCoverImage] = useState(blog?.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=600&fit=crop')
  const [content, setContent] = useState<ContentBlock[]>(
    blog?.content || [{ id: '1', type: 'paragraph', content: '' }]
  )
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const generateExcerpt = (blocks: ContentBlock[]) => {
    const textBlock = blocks.find(b => b.type === 'paragraph' && 'content' in b && b.content)
    if (textBlock && 'content' in textBlock) {
      return textBlock.content.substring(0, 150) + (textBlock.content.length > 150 ? '...' : '')
    }
    return ''
  }

  const savePost = useCallback(async (status: 'draft' | 'published' = 'draft') => {
    if (!title.trim()) return

    setIsSaving(true)

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const blogData = {
      title,
      slug: generateSlug(title),
      excerpt: generateExcerpt(content),
      content,
      coverImage,
      category,
      status,
      author: 'Admin',
    }

    if (blog) {
      updateBlog(blog.id, blogData)
    } else {
      createBlog(blogData)
    }

    setLastSaved(new Date())
    setIsSaving(false)
  }, [blog, title, content, coverImage, category, createBlog, updateBlog])

  // Auto-save effect
  useEffect(() => {
    if (autoSaveTimeout.current) {
      clearTimeout(autoSaveTimeout.current)
    }

    if (title.trim() && content.length > 0) {
      autoSaveTimeout.current = setTimeout(() => {
        savePost(blog?.status || 'draft')
      }, 2000)
    }

    return () => {
      if (autoSaveTimeout.current) {
        clearTimeout(autoSaveTimeout.current)
      }
    }
  }, [title, content, coverImage, category, savePost, blog?.status])

  const handleContentChange = (newContent: ContentBlock[]) => {
    setContent(newContent)
    if (blog) {
      updateBlogContent(blog.id, newContent)
    }
  }

  const handlePublish = () => {
    savePost('published')
    setTimeout(onBack, 500)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              {isSaving && (
                <Badge variant="secondary" className="gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </Badge>
              )}
              {lastSaved && !isSaving && (
                <Badge variant="outline" className="text-muted-foreground">
                  Saved {lastSaved.toLocaleTimeString()}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => savePost('draft')}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handlePublish}>
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter your blog title..."
              className="text-xl font-semibold h-12"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <ImageUpload onUploadComplete={setCoverImage} initialImage={coverImage} />
              </div>
            </div>
          </div>

          {coverImage && (
            <div
              className="w-full h-48 rounded-lg bg-cover bg-center border"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
          )}
        </div>

        <div className="border-t pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Type <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">/</kbd> to insert blocks
          </p>
          <BlockEditorCanvas content={content} onChange={handleContentChange} />
        </div>
      </main>
    </div>
  )
}
