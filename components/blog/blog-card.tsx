import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Blog } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface BlogCardProps {
  blog: Blog
  featured?: boolean
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <Link href={`/blog/${blog.slug}`}>
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={blog.coverImage || "/placeholder.svg"}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <Badge className="mb-3 bg-primary hover:bg-primary/90">{blog.category}</Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance leading-tight">
                {blog.title}
              </h2>
              <p className="text-white/80 mb-3 line-clamp-2">{blog.excerpt}</p>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>{blog.author}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="group h-full overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={blog.coverImage || "/placeholder.svg"}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2 text-xs">
            {blog.category}
          </Badge>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors text-balance">
            {blog.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {blog.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDate(blog.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
