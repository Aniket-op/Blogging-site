'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContentRenderer } from '@/components/blog/content-renderer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getBlogBySlug, getPublishedBlogs } from '@/lib/db/blogs'
import { getAllCategories } from '@/lib/db/categories'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Loader2 } from 'lucide-react'
import type { Blog, Category } from '@/lib/types'

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

export default function BlogPage({ params }: BlogPageProps) {
  const { slug } = use(params)
  const [blog, setBlog] = useState<Blog | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedBlog, fetchedCategories, allBlogs] = await Promise.all([
          getBlogBySlug(slug),
          getAllCategories(),
          getPublishedBlogs()
        ])

        if (!fetchedBlog || fetchedBlog.status !== 'published') {
          setNotFoundState(true)
          return
        }

        setBlog(fetchedBlog)
        setCategories(fetchedCategories)
        setRelatedBlogs(
          allBlogs
            .filter(b => b.id !== fetchedBlog.id && b.category === fetchedBlog.category)
            .slice(0, 3)
        )
      } catch (error) {
        console.error('Error fetching blog:', error)
        setNotFoundState(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (notFoundState) {
    notFound()
  }

  if (loading || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />

      <main className="flex-1">
        <article>
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
            <Image
              src={blog.coverImage || "/placeholder.svg"}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
              <div className="container mx-auto max-w-4xl">
                <Link href={`/category/${blog.category}`}>
                  <Badge className="mb-4 bg-primary hover:bg-primary/90">
                    {blog.category}
                  </Badge>
                </Link>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance leading-tight">
                  {blog.title}
                </h1>
                <div className="flex items-center gap-3 text-white/80">
                  <span className="font-medium">{blog.author}</span>
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto max-w-3xl px-4 py-12">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-8 -ml-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <ContentRenderer blocks={blog.content} />
          </div>
        </article>

        {relatedBlogs.length > 0 && (
          <section className="bg-muted/30 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-xl font-semibold mb-6">More in {blog.category}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedBlogs.map(relatedBlog => (
                  <Link
                    key={relatedBlog.id}
                    href={`/blog/${relatedBlog.slug}`}
                    className="group"
                  >
                    <article className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={relatedBlog.coverImage || "/placeholder.svg"}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {formatDate(relatedBlog.createdAt)}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
