import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/books/image-gallery';
import { BookInfoSection } from '@/components/books/book-info-section';
import { SellerInfoCard } from '@/components/books/seller-info-card';
import { AuctionDisplay } from '@/components/books/auction-display';
import { BookTabs } from '@/components/books/book-tabs';
import { SimilarBooks } from '@/components/books/similar-books';

// Fetch book data server-side
async function getBook(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/books/${id}`, {
      cache: 'no-store', // Always fetch fresh data for book views
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
}

// Fetch auction data if book has an auction
async function getAuction(bookId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/books/${bookId}/auction`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Error fetching auction:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const book = await getBook(params.id);

  if (!book) {
    return {
      title: 'Book Not Found - BookHeart',
    };
  }

  const description = book.description
    ? book.description.substring(0, 160)
    : `${book.title} by ${book.author} - ${book.condition} condition`;

  return {
    title: `${book.title} by ${book.author} - ${book.condition} - BookHeart`,
    description,
    openGraph: {
      title: book.title,
      description,
      images: book.images?.[0]?.cloudinaryUrl ? [book.images[0].cloudinaryUrl] : [],
      type: 'book',
    },
    twitter: {
      card: 'summary_large_image',
      title: book.title,
      description,
      images: book.images?.[0]?.cloudinaryUrl ? [book.images[0].cloudinaryUrl] : [],
    },
  };
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);

  if (!book) {
    notFound();
  }

  // Check if book has an active auction
  const auction = book.status === 'pending' ? await getAuction(params.id) : null;

  return (
    <div className="min-h-screen bg-gray-800">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column: Image Gallery */}
          <div>
            <ImageGallery images={book.images || []} bookTitle={book.title} />
          </div>

          {/* Right column: Book Info */}
          <div className="space-y-6">
            <BookInfoSection book={book} auction={auction} />
            <SellerInfoCard seller={book.seller} bookId={book.id} />
            {auction && <AuctionDisplay auction={auction} />}
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="mt-12">
          <BookTabs book={book} />
        </div>

        {/* Similar Books Section */}
        <SimilarBooks bookId={book.id} />
      </main>
    </div>
  );
}
