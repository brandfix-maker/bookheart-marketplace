import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'

export default function TrustSafetyPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-rose-50 to-gold-50 py-20">
        <div className="absolute inset-0 bg-[url('/Patterns/Stars_gradient.png')] opacity-20"></div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 text-shadow-lg">
              Trust & <span className="gradient-text">Safety</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your security and satisfaction are our top priorities
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

      {/* Coming Soon Content */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <div className="space-y-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-rose-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🛡️</span>
                </div>
                
                <h2 className="text-3xl font-serif font-bold text-gray-800">
                  Coming Soon
                </h2>
                
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We're developing comprehensive trust and safety policies, including our 72-hour inspection 
                  guarantee, seller verification process, and buyer protection measures.
                </p>
                
                <div className="pt-8">
                  <Button size="lg" variant="gradient" asChild>
                    <Link href="/about/founder">Read Our Founder's Message</Link>
                  </Button>
                </div>
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
