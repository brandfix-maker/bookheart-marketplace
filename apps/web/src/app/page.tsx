'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book, SubscriptionBox } from '@bookheart/shared';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/components/ui/use-toast';
import { 
  Heart, 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Shield, 
  CheckCircle2,
  MapPin,
  Star,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight
} from 'lucide-react';

// Subscription boxes configuration
const SUBSCRIPTION_BOXES: Array<{
  name: SubscriptionBox;
  description: string;
  color: string;
}> = [
  { name: 'FairyLoot', description: 'Young Adult Fantasy', color: 'from-purple-400 to-pink-400' },
  { name: 'OwlCrate', description: 'Young Adult Fiction', color: 'from-amber-400 to-orange-400' },
  { name: 'IllumiCrate', description: 'Fantasy & Sci-Fi', color: 'from-blue-400 to-purple-400' },
  { name: 'Locked Library', description: 'Adult Romance', color: 'from-rose-400 to-pink-400' },
  { name: 'Alluria', description: 'Romantasy Deluxe', color: 'from-pink-400 to-purple-400' },
  { name: 'Acrylipics', description: 'New Adult Romance', color: 'from-red-400 to-pink-400' },
  { name: 'Bookish', description: 'Romance & Fantasy', color: 'from-fuchsia-400 to-purple-400' },
  { name: 'Bookish Darkly', description: 'Dark Romance', color: 'from-gray-600 to-purple-600' },
];

// Book Card Component for Landing Page
interface LandingBookCardProps {
  book: Book;
  onAddToWishlist?: () => void;
  onAddToCart?: () => void;
}

function LandingBookCard({ book, onAddToWishlist, onAddToCart }: LandingBookCardProps) {
  const formatPrice = (priceCents: number) => `$${(priceCents / 100).toFixed(2)}`;
  const primaryImage = book.images?.find(img => img.isPrimary) || book.images?.[0];
  const imageUrl = primaryImage?.cloudinaryUrl || '/placeholder-book.jpg';

  // Calculate distance if location data is available (placeholder for now)
  const distanceText = book.city && book.state ? `${Math.floor(Math.random() * 50) + 1} miles away` : '';

  return (
    <Card className="group relative flex-shrink-0 w-[280px] bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
        <Image
          src={imageUrl}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="280px"
        />
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          {onAddToWishlist && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onAddToWishlist}
              className="bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
            >
              <Heart className="h-4 w-4" />
            </Button>
          )}
          {onAddToCart && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onAddToCart}
              className="bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Badges */}
        {book.subscriptionBox && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg">
              {book.subscriptionBox}
            </span>
          </div>
        )}
        
        {book.isSpecialEdition && (
          <div className="absolute top-2 right-2">
            <Sparkles className="h-5 w-5 text-yellow-400 drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-2">
        <Link href={`/books/${book.id}`} className="block">
          <h3 
            className="font-serif font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
        </Link>

        {/* Price and Location */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(book.priceCents)}
            </div>
            {book.shippingPriceCents > 0 && (
              <div className="text-xs text-gray-500">
                +{formatPrice(book.shippingPriceCents)} shipping
              </div>
            )}
          </div>
          
          {/* Seller Rating */}
          {book.seller && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          )}
        </div>

        {distanceText && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3 w-3" />
            {distanceText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function LandingPage() {
  const [justListedBooks, setJustListedBooks] = useState<Book[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userState, setUserState] = useState<string>('');
  const [email, setEmail] = useState('');
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  useEffect(() => {
    fetchLandingPageData();
    detectUserLocation();
  }, []);

  const fetchLandingPageData = async () => {
    try {
      setIsLoading(true);
      
      const [justListedResponse, trendingResponse] = await Promise.all([
        apiClient.get('/books/recent?limit=12'),
        apiClient.get('/books/trending?limit=8'),
      ]);

      setJustListedBooks(justListedResponse.data.data || []);
      setTrendingBooks(trendingResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching landing page data:', error);
      // Fail silently for better UX, show empty states
    } finally {
      setIsLoading(false);
    }
  };

  const detectUserLocation = () => {
    // Placeholder for geolocation - would use browser geolocation API
    setUserState('Your Area');
  };

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingNewsletter(true);
    
    try {
      // TODO: Integrate with waitlist table
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Welcome to the inner circle! 💜',
        description: 'Check your email for exclusive updates.',
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'Oops!',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  // Scroll carousel functionality
  const scrollCarousel = (direction: 'left' | 'right', containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-pink-300 animate-gradient-shift">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.2),transparent_50%)]"></div>
          </div>
        </div>

        {/* Animated Book Spines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-64 bg-gradient-to-r from-purple-600 to-purple-700 transform -rotate-12 animate-slide-in-left shadow-2xl">
            <div className="p-2 text-white text-xs font-serif writing-vertical">Fourth Wing</div>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-72 bg-gradient-to-r from-pink-600 to-rose-700 transform rotate-12 animate-slide-in-right shadow-2xl">
            <div className="p-2 text-white text-xs font-serif writing-vertical">A Court of Thorns</div>
          </div>
          <div className="absolute left-20 bottom-20 w-12 h-48 bg-gradient-to-r from-indigo-600 to-purple-700 transform -rotate-6 animate-slide-in-bottom shadow-2xl opacity-70">
            <div className="p-2 text-white text-xs font-serif writing-vertical">Crescent City</div>
          </div>
        </div>

        {/* Floating Hearts */}
        <div className="absolute inset-0 pointer-events-none">
          <Heart className="absolute top-20 left-[15%] h-8 w-8 text-white/30 animate-float" />
          <Heart className="absolute top-40 right-[20%] h-6 w-6 text-white/20 animate-float-delay-1" />
          <Heart className="absolute bottom-32 left-[25%] h-10 w-10 text-white/25 animate-float-delay-2" />
          <Sparkles className="absolute top-32 right-[15%] h-8 w-8 text-white/40 animate-pulse" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="font-dancing text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in-up">
            Where BookTok Finds Its
            <br />
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Next Obsession
            </span>
            </h1>
          
          <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto drop-shadow-lg animate-fade-in-up animation-delay-200">
            Discover rare editions, signed copies, and special releases from romantasy collectors
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <Link href="/marketplace">
                  <Button
                size="lg" 
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold text-lg px-8 py-6 shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
              >
                Browse as Guest
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button 
                size="lg" 
                variant="outline"
                className="glass-morphism border-2 border-white/50 text-white hover:bg-white/20 font-semibold text-lg px-8 py-6 shadow-xl backdrop-blur-md group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Join the Inner Circle
                  <Sparkles className="ml-2 h-5 w-5 group-hover:animate-spin" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 to-pink-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/70 rounded-full animate-scroll"></div>
        </div>
        </div>
      </section>

      {/* JUST LISTED SECTION */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-dancing font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Just Listed
            </h2>
            <Link href="/marketplace" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 group">
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Carousel */}
          <div className="relative">
            <button
              onClick={() => scrollCarousel('left', 'just-listed-carousel')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-purple-600" />
            </button>

            <div
              id="just-listed-carousel"
              className="flex gap-6 overflow-x-auto scrollbar-thin pb-4 scroll-smooth snap-x snap-mandatory"
              style={{ scrollbarWidth: 'thin' }}
            >
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[280px] h-[450px] bg-gray-200 animate-pulse rounded-lg"></div>
                ))
              ) : justListedBooks.length > 0 ? (
                justListedBooks.map((book) => (
                  <LandingBookCard
                    key={book.id}
                    book={book}
                    onAddToWishlist={() => toast({ title: 'Added to wishlist! 💜' })}
                    onAddToCart={() => toast({ title: 'Added to cart! 🛒' })}
                  />
                ))
              ) : (
                <div className="w-full text-center py-12 text-gray-500">
                  No books available yet. Check back soon!
                </div>
              )}
            </div>

            <button
              onClick={() => scrollCarousel('right', 'just-listed-carousel')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-purple-600" />
            </button>
          </div>
          </div>
        </section>

      {/* TRENDING SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-dancing font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Trending in {userState}
            </h2>
            <p className="text-gray-600">Based on recent views and purchases</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-[450px] bg-gray-200 animate-pulse rounded-lg"></div>
              ))
            ) : trendingBooks.length > 0 ? (
              trendingBooks.slice(0, 4).map((book) => (
                <LandingBookCard
                  key={book.id}
                  book={book}
                  onAddToWishlist={() => toast({ title: 'Added to wishlist! 💜' })}
                  onAddToCart={() => toast({ title: 'Added to cart! 🛒' })}
                />
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-gray-500">
                No trending books yet. Check back soon!
              </div>
            )}
          </div>
          </div>
        </section>

      {/* FEATURED SUBSCRIPTION BOXES */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-dancing font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Subscription Box Exclusives
          </h2>
            <p className="text-gray-600">Find special editions from your favorite boxes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SUBSCRIPTION_BOXES.map((box) => (
              <Link key={box.name} href={`/marketplace?subscriptionBox=${box.name}`}>
                <Card className="group glass-morphism hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${box.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Sparkles className="h-10 w-10 text-white" />
                  </div>
                    <h3 className="font-serif font-bold text-lg mb-2 text-gray-900">
                      {box.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{box.description}</p>
                    <div className="text-purple-600 font-semibold group-hover:text-purple-700 flex items-center justify-center gap-2">
                      Shop Exclusives
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS BULLETIN PREVIEW */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl font-dancing font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <Link href="/events" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 group">
              See All Events
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Placeholder for events - will be populated when events table is created */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Virtual Book Club', date: 'Coming Soon', type: 'book-club', location: 'Virtual' },
              { title: 'Author Signing Event', date: 'Coming Soon', type: 'signing', location: 'TBD' },
              { title: 'Release Party', date: 'Coming Soon', type: 'release', location: 'TBD' },
            ].map((event, index) => (
              <Card key={index} className="glass-morphism hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-semibold text-lg mb-1">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{event.date}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {event.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="glass-morphism rounded-2xl p-12">
              <h2 className="text-3xl font-dancing font-bold text-center mb-12 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Shop with Confidence
            </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-serif font-semibold text-xl mb-2">10,000+ Happy Readers</h3>
                  <p className="text-gray-600">Join our growing community of book lovers</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="h-10 w-10 text-white" />
              </div>
                  <h3 className="font-serif font-semibold text-xl mb-2">Secure Payments</h3>
                  <p className="text-gray-600">Your transactions are protected and encrypted</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
                  <h3 className="font-serif font-semibold text-xl mb-2">Authenticated Editions</h3>
                  <p className="text-gray-600">Every special edition verified by our team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-8 w-8 text-pink-400" />
                <span className="text-2xl font-dancing font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  BookHeart
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Where BookTok finds its next obsession. Connecting romantasy readers with rare and special editions.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-serif font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-pink-400 transition-colors">About</Link></li>
                <li><Link href="/how-it-works" className="hover:text-pink-400 transition-colors">How It Works</Link></li>
                <li><Link href="/trust-safety" className="hover:text-pink-400 transition-colors">Trust & Safety</Link></li>
                <li><Link href="/contact" className="hover:text-pink-400 transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-serif font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-pink-400 transition-colors">Cookie Policy</Link></li>
                <li><Link href="/community-guidelines" className="hover:text-pink-400 transition-colors">Community Guidelines</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-serif font-semibold text-lg mb-4">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-4">
                Get exclusive deals and new arrivals in your inbox
              </p>
              <form onSubmit={handleNewsletterSignup} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <Button
                  type="submit"
                  disabled={isSubmittingNewsletter}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  {isSubmittingNewsletter ? 'Subscribing...' : 'Subscribe'}
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 BookHeart. All rights reserved. Made with 💜 for bookish hearts.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}