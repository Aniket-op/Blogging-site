export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: ContentBlock[]
  coverImage: string
  category: string
  status: 'draft' | 'published'
  author: string
  createdAt: string
  updatedAt: string
}

export type ContentBlock =
  | { id: string; type: 'paragraph'; content: string }
  | { id: string; type: 'heading1'; content: string }
  | { id: string; type: 'heading2'; content: string }
  | { id: string; type: 'heading3'; content: string }
  | { id: string; type: 'image'; src: string; alt: string; caption?: string; align: 'left' | 'center' | 'right' }
  | { id: string; type: 'quote'; content: string; author?: string }
  | { id: string; type: 'divider' }
  | { id: string; type: 'list'; items: string[]; ordered: boolean }
  | { id: string; type: 'code'; content: string; language?: string }

export interface User {
  id: string
  email: string
  name: string
  role: 'admin'
}

export interface Category {
  id?: string
  name: string
  count: number
}
