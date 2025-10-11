import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProfileHeader } from '@/components/seller/profile-header';
import { ProfileTabs } from '@/components/seller/profile-tabs';
import { Header } from '@/components/layout/header';

// Fetch seller profile data server-side
async function getSellerProfile(username: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/users/${username}/profile`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching seller profile:', error);
    return null;
  }
}

// Fetch seller listings
async function getSellerListings(username: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/users/${username}/listings`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    return [];
  }
}

// Fetch seller reviews
async function getSellerReviews(username: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/users/${username}/reviews`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const seller = await getSellerProfile(params.username);

  if (!seller) {
    return {
      title: 'Seller Not Found - BookHeart',
    };
  }

  const displayName = seller.displayName || seller.username;

  return {
    title: `${displayName} - BookHeart Seller Profile`,
    description: `Shop books from ${displayName} on BookHeart. Browse their collection of rare and special edition books.`,
    openGraph: {
      title: `${displayName} - BookHeart Seller`,
      description: `Shop books from ${displayName} on BookHeart.`,
      type: 'profile',
    },
  };
}

export default async function SellerProfilePage({ params }: { params: { username: string } }) {
  const [seller, listings, reviews] = await Promise.all([
    getSellerProfile(params.username),
    getSellerListings(params.username),
    getSellerReviews(params.username),
  ]);

  if (!seller) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader seller={seller} listings={listings} reviews={reviews} />

        {/* Profile Tabs */}
        <div className="mt-8">
          <ProfileTabs 
            username={params.username}
            listings={listings}
            reviews={reviews}
          />
        </div>
      </main>
    </div>
  );
}
