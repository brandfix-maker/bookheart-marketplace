import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'
import { CartProvider } from '@/contexts/cart-context'
import { WishlistProvider } from '@/contexts/wishlist-context'
import { MarketplaceNav } from '@/components/layout/marketplace-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BookHeart - Romantasy Book Marketplace',
  description: 'Buy and sell secondhand romantasy books with trust. Special editions, signed copies, and more.',
  keywords: 'romantasy, books, marketplace, special edition, signed books, bookish, booktok',
  authors: [{ name: 'BookHeart' }],
  icons: {
    icon: '/Logo.png',
    shortcut: '/Logo.png',
    apple: '/Logo.png',
  },
  openGraph: {
    title: 'BookHeart - Romantasy Book Marketplace',
    description: 'Buy and sell secondhand romantasy books with trust.',
    url: 'https://bookheart.com',
    siteName: 'BookHeart',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BookHeart Marketplace',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BookHeart - Romantasy Book Marketplace',
    description: 'Buy and sell secondhand romantasy books with trust.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <MarketplaceNav />
              <main className="min-h-[calc(100vh-72px-64px)] lg:min-h-[calc(100vh-72px)]">
                {children}
              </main>
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
