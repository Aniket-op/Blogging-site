import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <span className="font-medium">Thoughtful Words</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/category/Lifestyle" className="hover:text-primary transition-colors">
              Lifestyle
            </Link>
            <Link href="/category/Philosophy" className="hover:text-primary transition-colors">
              Philosophy
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Thoughtful Words. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
