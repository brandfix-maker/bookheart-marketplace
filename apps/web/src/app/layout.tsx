import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'

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
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
