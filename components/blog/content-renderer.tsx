import Image from 'next/image'
import type { ContentBlock } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ContentRendererProps {
  blocks: ContentBlock[]
}

export function ContentRenderer({ blocks }: ContentRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  )
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-foreground/90 leading-relaxed mb-4">
          {block.content}
        </p>
      )
    
    case 'heading1':
      return (
        <h1 className="text-3xl font-bold text-foreground mt-8 mb-4">
          {block.content}
        </h1>
      )
    
    case 'heading2':
      return (
        <h2 className="text-2xl font-semibold text-foreground mt-6 mb-3">
          {block.content}
        </h2>
      )
    
    case 'heading3':
      return (
        <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
          {block.content}
        </h3>
      )
    
    case 'image':
      return (
        <figure className={cn(
          'my-6',
          block.align === 'left' && 'text-left',
          block.align === 'center' && 'text-center',
          block.align === 'right' && 'text-right'
        )}>
          <div className={cn(
            'relative inline-block overflow-hidden rounded-lg',
            block.align === 'center' && 'mx-auto'
          )}>
            <Image
              src={block.src || "/placeholder.svg"}
              alt={block.alt}
              width={800}
              height={450}
              className="rounded-lg"
            />
          </div>
          {block.caption && (
            <figcaption className="text-sm text-muted-foreground mt-2 italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    
    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary pl-6 my-6 italic">
          <p className="text-lg text-foreground/80">{block.content}</p>
          {block.author && (
            <cite className="text-sm text-muted-foreground not-italic block mt-2">
              — {block.author}
            </cite>
          )}
        </blockquote>
      )
    
    case 'divider':
      return <hr className="my-8 border-border" />
    
    case 'list':
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag className={cn(
          'my-4 ml-6',
          block.ordered ? 'list-decimal' : 'list-disc'
        )}>
          {block.items.map((item, index) => (
            <li key={index} className="text-foreground/90 mb-2">
              {item}
            </li>
          ))}
        </ListTag>
      )
    
    case 'code':
      return (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
          <code className="text-sm font-mono text-foreground">
            {block.content}
          </code>
        </pre>
      )
    
    default:
      return null
  }
}
