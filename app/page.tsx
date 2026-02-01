import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BlogCard } from '@/components/blog/blog-card'
import { Badge } from '@/components/ui/badge'
import { getPublishedBlogs } from '@/lib/db/blogs'
import { getAllCategories } from '@/lib/db/categories'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function HomePage() {
  const [blogs, categories] = await Promise.all([
    getPublishedBlogs(),
    getAllCategories()
  ])

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center text-muted-foreground">
          <h2 className="text-xl font-semibold mt-10">No posts found</h2>
          <p>Please check your database connection or seed some data.</p>
        </main>
        <Footer />
      </div>
    )
  }

  const featuredBlog = blogs[0]
  const recentBlogs = blogs.slice(1, 4)
  const otherBlogs = blogs.slice(4)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                Featured Post
              </h2>
              <BlogCard blog={featuredBlog} featured />
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                Recent Posts
              </h2>
              <div className="space-y-4">
                {recentBlogs.map(blog => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group block"
                  >
                    <article className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div
                        className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${blog.coverImage})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="text-xs mb-1">
                          {blog.category}
                        </Badge>
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Link key={category.name} href={`/category/${category.name}`}>
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
                  >
                    {category.name}
                    <span className="ml-2 text-muted-foreground">({category.count})</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {otherBlogs.length > 0 && (
          <section className="container mx-auto px-4 py-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-6 uppercase tracking-wider">
              More Posts
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
