'use client'

import { AuthProvider } from '@/lib/auth-context'
import { BlogStoreProvider } from '@/lib/blog-store'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BlogStoreProvider>
        {children}
      </BlogStoreProvider>
    </AuthProvider>
  )
}
