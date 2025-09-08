import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/header'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-rose-50 to-gold-50 py-20">
        <div className="absolute inset-0 bg-[url('/Patterns/Stars_gradient.png')] opacity-20"></div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 text-shadow-lg">
              Where Your <span className="gradient-text">Bookish Dreams</span> Come True
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Buy and sell secondhand romantasy books with trust. Special editions, signed copies, 
              and rare finds—all with our 72-hour inspection guarantee.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="gradient" asChild>
                <Link href="/books">Browse Books</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sell">Start Selling</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 opacity-20">
          <Image src="/Patterns/Heart_purple.png" alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-10 right-10 w-32 h-32 opacity-20">
          <Image src="/Patterns/ornamental_purple.png" alt="" fill className="object-contain" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">
            Trending in <span className="gradient-text">Romantasy</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Placeholder book cards */}
            {[1, 2, 3].map((i) => (
              <Card key={i} className="book-card overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-rose-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">📚</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-serif font-semibold text-lg mb-1">Book Title {i}</h3>
                  <p className="text-sm text-muted-foreground mb-2">Author Name</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">$24.99</span>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                      Special Edition
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Special Editions', icon: '✨', color: 'from-primary-500 to-primary-600' },
              { name: 'Signed Copies', icon: '✍️', color: 'from-rose-500 to-rose-600' },
              { name: 'First Editions', icon: '1️⃣', color: 'from-gold-500 to-gold-600' },
              { name: 'Subscription Boxes', icon: '📦', color: 'from-purple-500 to-purple-600' },
            ].map((category) => (
              <Card 
                key={category.name} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="font-serif font-semibold">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-rose-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold mb-6">
              Shop with <span className="gradient-text">Confidence</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="font-semibold mb-2">72-Hour Inspection</h3>
                <p className="text-sm text-muted-foreground">
                  Every purchase includes a 72-hour inspection period
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">💝</span>
                </div>
                <h3 className="font-semibold mb-2">Verified Sellers</h3>
                <p className="text-sm text-muted-foreground">
                  All sellers are verified with transaction history
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gold-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="font-semibold mb-2">7% Platform Fee</h3>
                <p className="text-sm text-muted-foreground">
                  Simple, transparent pricing for all transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image
                src="/Logo.png"
                alt="BookHeart"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-serif text-xl font-bold">BookHeart</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 BookHeart. Made with 💜 for bookish hearts.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
