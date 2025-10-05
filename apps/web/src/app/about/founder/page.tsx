import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'

export default function FounderMessagePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-rose-50 to-gold-50 py-20">
        <div className="absolute inset-0 bg-[url('/Patterns/Stars_gradient.png')] opacity-20"></div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-shadow-lg">
              A Message from <span className="gradient-text">Our Founder</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The story behind BookHeart and our vision for the romantasy community
            </p>
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

      {/* Founder Message Content */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                <div className="space-y-8">
                  <p className="text-lg leading-relaxed text-gray-700">
                    Hello, Book Lovelies.
                  </p>
                  
                  <p className="text-lg leading-relaxed text-gray-700">
                    If you're anything like me, you've lost yourself in the spellbinding pull of our favorite romantasy worlds. From binge-worthy series to heart-pounding standalones, you've ridden the waves of joy, rage, heartbreak, and triumph right alongside unforgettable characters. But then… the last page turns.
                  </p>

                  <p className="text-lg leading-relaxed text-gray-700">
                    Do you ever feel the ache of wanting more? The longing for book trophies with special editions, sprayed edges, signed copies that sometimes feels impossible to track down? The dream of stepping into real-life events where those stories come alive? The wish for <strong className="text-rose-600 font-semibold">book besties</strong> to scream with over plot twists, ships, and magic once the final chapter closes?
                  </p>

                  <p className="text-lg leading-relaxed text-gray-700">
                    If your heart whispered, "Yes", then Bookheart is being built with you in mind. Here, you're not just a reader. You're the <strong className="text-purple-600 font-semibold">main character</strong>. And this is your <strong className="text-rose-600 font-semibold">treasure trove</strong> to claim what your story is missing.
                  </p>

                  <p className="text-lg leading-relaxed text-gray-700">
                    Our mission is simple but powerful: to spark community and craft experiences that live far beyond the page. Because books are a powerful art form not just read, but felt, lived, collected, celebrated.
                  </p>

                  <p className="text-lg leading-relaxed text-gray-700">
                    So, prepare yourself. We're stepping into stories, but staying for the magic. The future is glowing, and together, we're about to light it up.
                  </p>

                  <div className="pt-8 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-lg leading-relaxed text-gray-700 italic mb-2">
                        With fire & ink,
                      </p>
                      <div className="founder-signature">
                        <p className="text-3xl font-serif font-bold bg-gradient-to-r from-purple-600 via-rose-500 to-pink-500 bg-clip-text text-transparent">
                          C
                        </p>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Founder, BookHeart
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold text-gray-800">
                  Ready to Start Your Bookish Journey?
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Join our community of book lovers and discover your next favorite read, or share the magic with fellow readers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Button size="lg" variant="gradient" asChild>
                    <Link href="/browse">Browse Books</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/register">Join Our Community</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-rose-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center space-x-8 opacity-30">
              <Image src="/Patterns/Heart_pink.png" alt="" width={60} height={60} className="object-contain" />
              <Image src="/Patterns/ornamental_purple.png" alt="" width={80} height={80} className="object-contain" />
              <Image src="/Patterns/Heart2_purple.png" alt="" width={60} height={60} className="object-contain" />
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
