'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Blog, ContentBlock } from './types'
import { getAllBlogs, createBlog as dbCreateBlog, updateBlog as dbUpdateBlog, deleteBlog as dbDeleteBlog } from './db/blogs'

interface BlogStoreContextType {
  blogs: Blog[]
  getBlog: (id: string) => Blog | undefined
  createBlog: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Blog>
  updateBlog: (id: string, updates: Partial<Blog>) => Promise<void>
  deleteBlog: (id: string) => void
  updateBlogContent: (id: string, content: ContentBlock[]) => Promise<void>
}

const BlogStoreContext = createContext<BlogStoreContextType | undefined>(undefined)

export function BlogStoreProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch blogs on mount
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const fetchedBlogs = await getAllBlogs()
        setBlogs(fetchedBlogs)
      } catch (error) {
        console.error("Failed to fetch blogs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const getBlog = useCallback((id: string) => {
    return blogs.find(blog => blog.id === id)
  }, [blogs])

  const createBlog = useCallback(async (blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Promise<Blog> => {
    // Create in Firestore
    const now = new Date().toISOString()
    const dataToSave = {
      ...blogData,
      createdAt: now,
      updatedAt: now,
    }
    const docRef = await dbCreateBlog(dataToSave)

    // Update local state
    const newBlog: Blog = {
      ...dataToSave,
      id: docRef.id,
    }
    setBlogs(prev => [newBlog, ...prev])
    return newBlog
  }, [])

  const updateBlog = useCallback(async (id: string, updates: Partial<Blog>) => {
    // Update in Firestore
    await dbUpdateBlog(id, updates)

    // Update local state
    setBlogs(prev => prev.map(blog =>
      blog.id === id
        ? { ...blog, ...updates, updatedAt: new Date().toISOString() }
        : blog
    ))
  }, [])

  const deleteBlog = useCallback(async (id: string) => {
    await dbDeleteBlog(id)
    setBlogs(prev => prev.filter(blog => blog.id !== id))
  }, [])

  const updateBlogContent = useCallback(async (id: string, content: ContentBlock[]) => {
    await dbUpdateBlog(id, { content, updatedAt: new Date().toISOString() })
    setBlogs(prev => prev.map(blog =>
      blog.id === id
        ? { ...blog, content, updatedAt: new Date().toISOString() }
        : blog
    ))
  }, [])

  return (
    <BlogStoreContext.Provider value={{ blogs, getBlog, createBlog, updateBlog, deleteBlog, updateBlogContent }}>
      {children}
    </BlogStoreContext.Provider>
  )
}

export function useBlogStore() {
  const context = useContext(BlogStoreContext)
  if (context === undefined) {
    throw new Error('useBlogStore must be used within a BlogStoreProvider')
  }
  return context
}
