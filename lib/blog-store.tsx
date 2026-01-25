'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Blog, ContentBlock } from './types'
import { mockBlogs } from './mock-data'

interface BlogStoreContextType {
  blogs: Blog[]
  getBlog: (id: string) => Blog | undefined
  createBlog: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) => Blog
  updateBlog: (id: string, updates: Partial<Blog>) => void
  deleteBlog: (id: string) => void
  updateBlogContent: (id: string, content: ContentBlock[]) => void
}

const BlogStoreContext = createContext<BlogStoreContextType | undefined>(undefined)

export function BlogStoreProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs)

  const getBlog = useCallback((id: string) => {
    return blogs.find(blog => blog.id === id)
  }, [blogs])

  const createBlog = useCallback((blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>): Blog => {
    const now = new Date().toISOString()
    const newBlog: Blog = {
      ...blogData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: now,
      updatedAt: now,
    }
    setBlogs(prev => [newBlog, ...prev])
    return newBlog
  }, [])

  const updateBlog = useCallback((id: string, updates: Partial<Blog>) => {
    setBlogs(prev => prev.map(blog => 
      blog.id === id 
        ? { ...blog, ...updates, updatedAt: new Date().toISOString() }
        : blog
    ))
  }, [])

  const deleteBlog = useCallback((id: string) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id))
  }, [])

  const updateBlogContent = useCallback((id: string, content: ContentBlock[]) => {
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
