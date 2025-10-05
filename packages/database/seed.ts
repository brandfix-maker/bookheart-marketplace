import { db } from './client';
import { users, books, bookImages } from './schema';

// Sample data for romantasy books
const sampleBooks = [
  {
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    seriesName: "ACOTAR",
    seriesNumber: 1,
    tropes: ["enemies-to-lovers", "fae", "magic-system", "found-family"],
    spiceLevel: 4,
    condition: "like-new" as const,
    conditionNotes: "Minor shelf wear, otherwise perfect",
    priceCents: 1299,
    shippingPriceCents: 399,
    isSpecialEdition: true,
    specialEditionDetails: {
      paintedEdges: true,
      signedCopy: false,
      firstEdition: false,
      exclusiveCover: true,
      details: "Special edition with painted edges and exclusive cover design"
    },
    description: "Feyre hunts in the woods to provide for her family. When she kills a wolf in the forest, a terrifying creature arrives to demand retribution for it."
  },
  {
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    seriesName: "The Empyrean",
    seriesNumber: 1,
    tropes: ["enemies-to-lovers", "dragons", "magic-academy", "war"],
    spiceLevel: 3,
    condition: "new" as const,
    priceCents: 1599,
    shippingPriceCents: 399,
    isSpecialEdition: false,
    description: "Twenty-year-old Violet Sorrengail was supposed to enter the Scribe Quadrant, living a quiet life among books and history."
  },
  {
    title: "From Blood and Ash",
    author: "Jennifer L. Armentrout",
    seriesName: "Blood and Ash",
    seriesNumber: 1,
    tropes: ["enemies-to-lovers", "chosen-one", "magic-system", "prophecy"],
    spiceLevel: 4,
    condition: "very-good" as const,
    conditionNotes: "Some highlighting on pages 50-60",
    priceCents: 1199,
    shippingPriceCents: 399,
    isSpecialEdition: true,
    specialEditionDetails: {
      paintedEdges: true,
      signedCopy: true,
      firstEdition: false,
      details: "Signed copy with painted edges"
    },
    description: "Chosen from birth to usher in a new era, Poppy's life has never been her own."
  },
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    tropes: ["historical-fiction", "lgbtq+", "celebrity", "mystery"],
    spiceLevel: 2,
    condition: "good" as const,
    conditionNotes: "Pages slightly yellowed, cover has minor creases",
    priceCents: 999,
    shippingPriceCents: 399,
    isSpecialEdition: false,
    description: "Reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life."
  },
  {
    title: "It Ends with Us",
    author: "Colleen Hoover",
    tropes: ["contemporary", "romance", "emotional", "family"],
    spiceLevel: 3,
    condition: "acceptable" as const,
    conditionNotes: "Well-loved copy with some wear",
    priceCents: 799,
    shippingPriceCents: 399,
    isSpecialEdition: false,
    description: "Lily hasn't always had it easy, but that's never stopped her from working hard for the life she wants."
  }
];

// Generate 100 books by repeating and varying the sample data
function generateBooks() {
  const generatedBooks = [];
  const authors = [
    "Sarah J. Maas", "Rebecca Yarros", "Jennifer L. Armentrout", "Taylor Jenkins Reid", 
    "Colleen Hoover", "Holly Black", "Leigh Bardugo", "Cassandra Clare", "Stephanie Meyer",
    "Veronica Roth", "Suzanne Collins", "Marissa Meyer", "Sabaa Tahir", "Renée Ahdieh",
    "Marie Lu", "Victoria Aveyard", "Sarah Dessen", "John Green", "Rainbow Rowell",
    "Nicola Yoon", "Becky Albertalli", "Adam Silvera", "Casey McQuiston", "Talia Hibbert"
  ];
  
  const series = [
    "ACOTAR", "The Empyrean", "Blood and Ash", "Shadow and Bone", "The Mortal Instruments",
    "Twilight", "Divergent", "The Hunger Games", "The Lunar Chronicles", "An Ember in the Ashes",
    "The Wrath and the Dawn", "Legend", "Red Queen", "The Selection", "The Fault in Our Stars",
    "Eleanor & Park", "Everything, Everything", "Simon vs. the Homo Sapiens Agenda",
    "They Both Die at the End", "Red, White & Royal Blue", "Get a Life, Chloe Brown"
  ];
  
  const tropes = [
    "enemies-to-lovers", "fated-mates", "magic-system", "found-family", "chosen-one",
    "dragons", "fae", "vampires", "werewolves", "magic-academy", "war", "prophecy",
    "time-travel", "alternate-universe", "supernatural", "paranormal", "urban-fantasy",
    "high-fantasy", "contemporary", "historical-fiction", "lgbtq+", "celebrity", "mystery",
    "thriller", "romance", "emotional", "family", "friendship", "coming-of-age"
  ];
  
  const conditions = ["new", "like-new", "very-good", "good", "acceptable"] as const;
  
  for (let i = 0; i < 100; i++) {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const seriesName = Math.random() > 0.3 ? series[Math.floor(Math.random() * series.length)] : null;
    const seriesNumber = seriesName ? Math.floor(Math.random() * 5) + 1 : null;
    const bookTropes = tropes.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 2);
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const isSpecialEdition = Math.random() > 0.7;
    
    const book = {
      title: `${sampleBooks[i % sampleBooks.length].title}${i > 4 ? ` ${i}` : ''}`,
      author,
      seriesName,
      seriesNumber,
      tropes: bookTropes,
      spiceLevel: Math.floor(Math.random() * 6),
      condition,
      conditionNotes: condition === "acceptable" ? "Well-loved copy with some wear" : 
                     condition === "good" ? "Pages slightly yellowed, cover has minor creases" :
                     condition === "very-good" ? "Some highlighting on pages 50-60" :
                     condition === "like-new" ? "Minor shelf wear, otherwise perfect" : null,
      priceCents: Math.floor(Math.random() * 2000) + 500, // $5-$25
      shippingPriceCents: Math.random() > 0.5 ? 399 : 599,
      localPickupAvailable: Math.random() > 0.6,
      isSpecialEdition,
      specialEditionDetails: isSpecialEdition ? {
        paintedEdges: Math.random() > 0.5,
        signedCopy: Math.random() > 0.7,
        firstEdition: Math.random() > 0.8,
        exclusiveCover: Math.random() > 0.6,
        details: "Special edition with unique features"
      } : null,
      description: sampleBooks[i % sampleBooks.length].description,
      status: "active" as const,
      viewCount: Math.floor(Math.random() * 1000)
    };
    
    generatedBooks.push(book);
  }
  
  return generatedBooks;
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create a test seller user
    const sellerUser = await db.insert(users).values({
      email: 'seller@bookheart.com',
      username: 'bookseller123',
      passwordHash: '$2b$10$example.hash', // This would be properly hashed in real app
      role: 'seller',
      displayName: 'Book Seller',
      sellerVerified: true,
      emailVerified: true
    }).returning();
    
    console.log('✅ Created seller user');
    
    // Generate 100 books
    const booksToInsert = generateBooks();
    
    // Insert books in batches
    const batchSize = 20;
    for (let i = 0; i < booksToInsert.length; i += batchSize) {
      const batch = booksToInsert.slice(i, i + batchSize);
      const booksWithSellerId = batch.map(book => ({
        ...book,
        sellerId: sellerUser[0].id
      }));
      
      await db.insert(books).values(booksWithSellerId);
      console.log(`📚 Inserted books ${i + 1}-${Math.min(i + batchSize, booksToInsert.length)}`);
    }
    
    // Add sample images for all books using placeholder service
    const insertedBooks = await db.select().from(books);
    
    // Sample book cover images from Unsplash (reliable placeholder service)
    const coverImages = [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop&crop=center'
    ];
    
    for (let i = 0; i < insertedBooks.length; i++) {
      const book = insertedBooks[i];
      const imageIndex = i % coverImages.length;
      
      await db.insert(bookImages).values({
        bookId: book.id,
        cloudinaryUrl: coverImages[imageIndex],
        cloudinaryPublicId: `placeholder-${book.id}`,
        altText: `Cover of ${book.title} by ${book.author}`,
        isPrimary: true,
        order: 0,
        width: 400,
        height: 600
      });
    }
    
    console.log('✅ Added sample book images');
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${booksToInsert.length} books with 1 seller user`);
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding script failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
