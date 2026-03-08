import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BlogCard } from '@/components/blog/blog-card'
import { getBlogsByCategory } from '@/lib/db/blogs'
import { getAllCategories } from '@/lib/db/categories'

// Force dynamic rendering so Firebase data is fetched on every request
export const dynamic = 'force-dynamic'

interface CategoryPageProps {
  params: Promise<{ name: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params
  const decodedName = decodeURIComponent(name)

  // Fetch categories first to find the correct casing
  const categories = await getAllCategories()

  // Find category case-insensitively
  const category = categories.find(c => c.name.toLowerCase() === decodedName.toLowerCase())

  if (!category) {
    notFound()
  }

  // Fetch blogs using the correct category name from DB
  const blogs = await getBlogsByCategory(category.name)

  return (
    <div className="min-h-screen flex flex-col">
      <Header categories={categories} />

      <main className="flex-1">
        <section className="bg-primary/10 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{decodedName}</h1>
            <p className="text-muted-foreground">
              {blogs.length} {blogs.length === 1 ? 'article' : 'articles'} in this category
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          {blogs.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles in this category yet.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
