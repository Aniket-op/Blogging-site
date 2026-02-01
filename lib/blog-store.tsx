'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Blog, ContentBlock, Category } from './types'
import { getAllBlogs, createBlog as dbCreateBlog, updateBlog as dbUpdateBlog, deleteBlog as dbDeleteBlog } from './db/blogs'
import { getAllCategories, addCategory as dbAddCategory, deleteCategory as dbDeleteCategory, updateCategoryCount } from './db/categories'

interface BlogStoreContextType {
  blogs: Blog[]
  categories: Category[]
  getBlog: (id: string) => Blog | undefined
  createBlog: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Blog>
  updateBlog: (id: string, updates: Partial<Blog>) => Promise<void>
  deleteBlog: (id: string) => void
  updateBlogContent: (id: string, content: ContentBlock[]) => Promise<void>
  addCategory: (name: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

const BlogStoreContext = createContext<BlogStoreContextType | undefined>(undefined)

export function BlogStoreProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch blogs and categories on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedBlogs, fetchedCategories] = await Promise.all([
          getAllBlogs(),
          getAllCategories()
        ])
        setBlogs(fetchedBlogs)
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
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

    // Update category count if published
    if (dataToSave.status === 'published') {
      await updateCategoryCount(dataToSave.category, 1)
      setCategories(prev => prev.map(c =>
        c.name === dataToSave.category ? { ...c, count: c.count + 1 } : c
      ))
    }

    // Update local state
    const newBlog: Blog = {
      ...dataToSave,
      id: docRef.id,
    }
    setBlogs(prev => [newBlog, ...prev])
    return newBlog
  }, [])

  const updateBlog = useCallback(async (id: string, updates: Partial<Blog>) => {
    const oldBlog = blogs.find(b => b.id === id)
    if (!oldBlog) return

    // Update in Firestore
    await dbUpdateBlog(id, updates)

    // Handle Category Count Updates
    // Case 1: Status changed from draft to published
    if (oldBlog.status === 'draft' && updates.status === 'published') {
      const category = updates.category || oldBlog.category
      await updateCategoryCount(category, 1)
      setCategories(prev => prev.map(c => c.name === category ? { ...c, count: c.count + 1 } : c))
    }
    // Case 2: Status changed from published to draft
    else if (oldBlog.status === 'published' && updates.status === 'draft') {
      const category = updates.category || oldBlog.category
      await updateCategoryCount(category, -1)
      setCategories(prev => prev.map(c => c.name === category ? { ...c, count: Math.max(0, c.count - 1) } : c))
    }
    // Case 3: Category changed while published
    else if (oldBlog.status === 'published' && (updates.status === 'published' || !updates.status) && updates.category && updates.category !== oldBlog.category) {
      // Decrease old category
      await updateCategoryCount(oldBlog.category, -1)
      // Increase new category
      await updateCategoryCount(updates.category, 1)

      setCategories(prev => prev.map(c => {
        if (c.name === oldBlog.category) return { ...c, count: Math.max(0, c.count - 1) }
        if (c.name === updates.category) return { ...c, count: c.count + 1 }
        return c
      }))
    }

    // Update local state
    setBlogs(prev => prev.map(blog =>
      blog.id === id
        ? { ...blog, ...updates, updatedAt: new Date().toISOString() }
        : blog
    ))
  }, [blogs])

  const deleteBlog = useCallback(async (id: string) => {
    const blogToDelete = blogs.find(b => b.id === id)
    await dbDeleteBlog(id)

    // Decrement count if published
    if (blogToDelete && blogToDelete.status === 'published') {
      await updateCategoryCount(blogToDelete.category, -1)
      setCategories(prev => prev.map(c =>
        c.name === blogToDelete.category ? { ...c, count: Math.max(0, c.count - 1) } : c
      ))
    }

    setBlogs(prev => prev.filter(blog => blog.id !== id))
  }, [blogs])

  const updateBlogContent = useCallback(async (id: string, content: ContentBlock[]) => {
    await dbUpdateBlog(id, { content, updatedAt: new Date().toISOString() })
    setBlogs(prev => prev.map(blog =>
      blog.id === id
        ? { ...blog, content, updatedAt: new Date().toISOString() }
        : blog
    ))
  }, [])

  const addCategory = useCallback(async (name: string) => {
    if (categories.length >= 5) {
      throw new Error("Maximum 5 categories allowed")
    }
    const docRef = await dbAddCategory(name)
    const newCategory = { name, count: 0, id: docRef.id }
    setCategories(prev => [...prev, newCategory])
  }, [categories])

  const deleteCategory = useCallback(async (id: string) => {
    await dbDeleteCategory(id)
    setCategories(prev => prev.filter(cat => cat.id !== id))
  }, [])

  return (
    <BlogStoreContext.Provider value={{
      blogs,
      categories,
      getBlog,
      createBlog,
      updateBlog,
      deleteBlog,
      updateBlogContent,
      addCategory,
      deleteCategory
    }}>
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
