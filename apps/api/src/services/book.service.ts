import { db, books, bookImages, users, reviews, eq, and, desc, asc, sql, count } from '@bookheart/database';
import { Book, CreateBookRequest, UpdateBookRequest, BookSearchParams, BookListingStats } from '@bookheart/shared';
// import { v4 as uuidv4 } from 'uuid';

export class BookService {
  /**
   * Create a new book listing
   */
  static async createBook(sellerId: string, data: CreateBookRequest): Promise<Book> {
    console.log('📚 BookService.createBook: Creating book for seller:', sellerId);
    
    try {
      // Generate slug from title
      const slug = await this.generateSlug(data.title);
      
      const [newBook] = await db
        .insert(books)
        .values({
          sellerId,
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          description: data.description,
          seriesName: data.seriesName,
          seriesNumber: data.seriesNumber,
          tropes: data.tropes,
          spiceLevel: data.spiceLevel,
          condition: data.condition,
          conditionNotes: data.conditionNotes,
          priceCents: data.priceCents,
          shippingPriceCents: data.shippingPriceCents || 0,
          localPickupAvailable: data.localPickupAvailable || false,
          isSpecialEdition: data.isSpecialEdition || false,
          specialEditionDetails: data.specialEditionDetails,
          status: data.status || 'draft',
          slug,
          publishedAt: data.status === 'active' ? new Date() : null,
        })
        .returning();

      console.log('📚 BookService.createBook: Book created with ID:', newBook.id);

      // Return the created book with proper formatting
      return this.formatBook(newBook as any);
    } catch (error: any) {
      console.error('📚 BookService.createBook: Error creating book:', error);
      throw error;
    }
  }

  /**
   * Get book by ID with seller info
   */
  static async getBookById(id: string): Promise<Book | null> {
    try {
      const [book] = await db
        .select({
          book: books,
          seller: {
            id: users.id,
            username: users.username,
            displayName: users.displayName,
            avatarUrl: users.avatarUrl,
            sellerVerified: users.sellerVerified,
            location: users.location,
          }
        })
        .from(books)
        .leftJoin(users, eq(books.sellerId, users.id))
        .where(eq(books.id, id))
        .limit(1);

      if (!book) {
        return null;
      }

      // Get book images
      const bookImagesData = await db
        .select()
        .from(bookImages)
        .where(eq(bookImages.bookId, id))
        .orderBy(asc(bookImages.order));

      return {
        ...this.formatBook(book.book as any),
        seller: book.seller as any || undefined,
        images: bookImagesData.map(img => this.formatBookImage(img as any)),
      };
    } catch (error) {
      console.error('📚 BookService.getBookById: Error fetching book:', error);
      throw error;
    }
  }

  /**
   * Get books with advanced search and filters
   */
  static async getBooks(params: BookSearchParams = {}): Promise<{
    items: Book[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }> {
    try {
      const {
        query,
        author,
        minPrice,
        maxPrice,
        condition = [],
        isSpecialEdition,
        localPickupAvailable,
        tropes = [],
        spiceLevel = [],
        page = 1,
        pageSize = 20,
        sortBy = 'newest',
        sortOrder = 'desc',
        sellerId,
        subscriptionBox,
        isSigned,
        acceptsOffers,
        paintedEdges,
        firstEdition,
        dustJacket,
        minRating,
      } = params as any;

      const offset = (page - 1) * pageSize;

      // Build where conditions
      const whereConditions = [eq(books.status, 'active')];

      if (query) {
        whereConditions.push(
          sql`(
            ${books.title} ILIKE ${`%${query}%`} OR 
            ${books.author} ILIKE ${`%${query}%`} OR 
            ${books.description} ILIKE ${`%${query}%`} OR
            EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(${books.tropes}) AS trope
              WHERE trope ILIKE ${`%${query}%`}
            )
          )`
        );
      }

      if (author) {
        whereConditions.push(sql`${books.author} ILIKE ${`%${author}%`}`);
      }

      if (minPrice !== undefined) {
        whereConditions.push(sql`${books.priceCents} >= ${minPrice * 100}`);
      }

      if (maxPrice !== undefined) {
        whereConditions.push(sql`${books.priceCents} <= ${maxPrice * 100}`);
      }

      if (condition.length > 0) {
        whereConditions.push(sql`${books.condition} = ANY(ARRAY[${sql.raw(condition.map((c: string) => `'${c}'`).join(','))}]::text[])`);
      }

      if (isSpecialEdition !== undefined) {
        whereConditions.push(eq(books.isSpecialEdition, isSpecialEdition));
      }

      if (localPickupAvailable !== undefined) {
        whereConditions.push(eq(books.localPickupAvailable, localPickupAvailable));
      }

      if (tropes.length > 0) {
        whereConditions.push(sql`${books.tropes} ?| ARRAY[${sql.raw(tropes.map((t: string) => `'${t}'`).join(','))}]`);
      }

      if (spiceLevel.length > 0) {
        whereConditions.push(sql`${books.spiceLevel} = ANY(ARRAY[${sql.raw(spiceLevel.join(','))}])`);
      }

      if (sellerId) {
        whereConditions.push(eq(books.sellerId, sellerId));
      }

      if (subscriptionBox) {
        const boxes = Array.isArray(subscriptionBox) ? subscriptionBox : [subscriptionBox];
        whereConditions.push(sql`${books.subscriptionBox} = ANY(ARRAY[${sql.raw(boxes.map((b: string) => `'${b}'`).join(','))}]::text[])`);
      }

      if (isSigned !== undefined) {
        whereConditions.push(eq(books.isSigned, isSigned));
      }

      if (acceptsOffers !== undefined) {
        whereConditions.push(eq(books.acceptsOffers, acceptsOffers));
      }

      if (paintedEdges !== undefined) {
        whereConditions.push(sql`${books.specialEditionDetails}->>'paintedEdges' = ${paintedEdges ? 'true' : 'false'}`);
      }

      if (firstEdition !== undefined) {
        whereConditions.push(sql`${books.specialEditionDetails}->>'firstEdition' = ${firstEdition ? 'true' : 'false'}`);
      }

      if (dustJacket !== undefined) {
        whereConditions.push(sql`${books.specialEditionDetails}->>'dustJacket' = ${dustJacket ? 'true' : 'false'}`);
      }

      // Build order by
      let orderByClause;
      switch (sortBy) {
        case 'price':
          orderByClause = sortOrder === 'asc' ? asc(books.priceCents) : desc(books.priceCents);
          break;
        case 'title':
          orderByClause = sortOrder === 'asc' ? asc(books.title) : desc(books.title);
          break;
        case 'views':
          orderByClause = desc(books.viewCount);
          break;
        case 'newest':
        default:
          orderByClause = desc(books.publishedAt);
          break;
      }

      // Get total count
      const [totalResult] = await db
        .select({ count: count() })
        .from(books)
        .where(and(...whereConditions));

      const total = totalResult.count;

      // Get books with seller info and rating
      const booksData = await db
        .select({
          book: books,
          seller: {
            id: users.id,
            username: users.username,
            displayName: users.displayName,
            avatarUrl: users.avatarUrl,
            location: users.location,
            sellerVerified: users.sellerVerified,
          },
        })
        .from(books)
        .leftJoin(users, eq(books.sellerId, users.id))
        .where(and(...whereConditions))
        .orderBy(orderByClause)
        .limit(pageSize)
        .offset(offset);

      // Get images and seller ratings for each book
      const booksWithDetails = await Promise.all(
        booksData.map(async ({ book, seller }) => {
          const images = await db
            .select()
            .from(bookImages)
            .where(eq(bookImages.bookId, book.id))
            .orderBy(asc(bookImages.order));

          // Get seller rating
          let sellerRating = null;
          if (seller?.id) {
            const [ratingResult] = await db
              .select({
                avgRating: sql<number>`AVG(${reviews.rating})`,
                totalReviews: count(),
              })
              .from(reviews)
              .where(
                and(
                  eq(reviews.reviewedUserId, seller.id),
                  eq(reviews.reviewType, 'seller')
                )
              );

            if (ratingResult && ratingResult.totalReviews > 0) {
              sellerRating = {
                average: Number(ratingResult.avgRating?.toFixed(1)),
                count: ratingResult.totalReviews,
              };
            }
          }

          // Filter by min rating if specified
          if (minRating && (!sellerRating || sellerRating.average < minRating)) {
            return null;
          }

          return {
            ...this.formatBook(book as any),
            images: images.map(img => this.formatBookImage(img as any)),
            seller: seller ? {
              ...seller,
              rating: sellerRating,
            } : undefined,
          };
        })
      );

      // Filter out nulls (books that didn't meet rating criteria)
      const filteredBooks = booksWithDetails.filter(book => book !== null) as Book[];

      return {
        items: filteredBooks,
        total,
        page,
        pageSize,
        hasMore: offset + pageSize < total,
      };
    } catch (error) {
      console.error('📚 BookService.getBooks: Error fetching books:', error);
      throw error;
    }
  }

  /**
   * Get seller's books
   */
  static async getSellerBooks(sellerId: string, status?: string): Promise<Book[]> {
    try {
      const whereConditions = [eq(books.sellerId, sellerId)];
      
      if (status) {
        whereConditions.push(eq(books.status, status as any));
      }

      const booksData = await db
        .select()
        .from(books)
        .where(and(...whereConditions))
        .orderBy(desc(books.createdAt));

      // Get images for each book
      const booksWithImages = await Promise.all(
        booksData.map(async (book) => {
          const images = await db
            .select()
            .from(bookImages)
            .where(eq(bookImages.bookId, book.id))
            .orderBy(asc(bookImages.order));

          return {
            ...this.formatBook(book as any),
            images: images.map(img => this.formatBookImage(img as any)),
          };
        })
      );

      return booksWithImages;
    } catch (error) {
      console.error('📚 BookService.getSellerBooks: Error fetching seller books:', error);
      throw error;
    }
  }

  /**
   * Update book
   */
  static async updateBook(id: string, sellerId: string, data: UpdateBookRequest): Promise<Book> {
    try {
      // Verify ownership
      const [existingBook] = await db
        .select()
        .from(books)
        .where(and(eq(books.id, id), eq(books.sellerId, sellerId)))
        .limit(1);

      if (!existingBook) {
        throw new Error('Book not found or access denied');
      }

      const updateData: any = { ...data };
      
      // Update publishedAt if status changed to active
      if (data.status === 'active' && existingBook.status !== 'active') {
        updateData.publishedAt = new Date();
      }

      // Update slug if title changed
      if (data.title && data.title !== existingBook.title) {
        updateData.slug = await this.generateSlug(data.title);
      }

      const [updatedBook] = await db
        .update(books)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(books.id, id))
        .returning();

      return this.formatBook(updatedBook as any);
    } catch (error) {
      console.error('📚 BookService.updateBook: Error updating book:', error);
      throw error;
    }
  }

  /**
   * Delete book
   */
  static async deleteBook(id: string, sellerId: string): Promise<void> {
    try {
      // Verify ownership
      const [existingBook] = await db
        .select()
        .from(books)
        .where(and(eq(books.id, id), eq(books.sellerId, sellerId)))
        .limit(1);

      if (!existingBook) {
        throw new Error('Book not found or access denied');
      }

      // Delete book images first
      await db
        .delete(bookImages)
        .where(eq(bookImages.bookId, id));

      // Delete book
      await db
        .delete(books)
        .where(eq(books.id, id));

      console.log('📚 BookService.deleteBook: Book deleted:', id);
    } catch (error) {
      console.error('📚 BookService.deleteBook: Error deleting book:', error);
      throw error;
    }
  }

  /**
   * Get seller dashboard stats
   */
  static async getSellerStats(sellerId: string): Promise<BookListingStats> {
    try {
      const [stats] = await db
        .select({
          totalListings: sql<number>`COUNT(*)`,
          activeListings: sql<number>`COUNT(CASE WHEN status = 'active' THEN 1 END)`,
          draftListings: sql<number>`COUNT(CASE WHEN status = 'draft' THEN 1 END)`,
          soldListings: sql<number>`COUNT(CASE WHEN status = 'sold' THEN 1 END)`,
          totalViews: sql<number>`COALESCE(SUM(view_count), 0)`,
        })
        .from(books)
        .where(eq(books.sellerId, sellerId));

      return {
        totalListings: stats.totalListings,
        activeListings: stats.activeListings,
        draftListings: stats.draftListings,
        soldListings: stats.soldListings,
        totalViews: stats.totalViews,
        totalRevenue: 0, // TODO: Calculate from transactions
      };
    } catch (error) {
      console.error('📚 BookService.getSellerStats: Error fetching stats:', error);
      throw error;
    }
  }

  /**
   * Add book image
   */
  static async addBookImage(bookId: string, imageData: {
    cloudinaryUrl: string;
    cloudinaryPublicId: string;
    altText?: string;
    isPrimary?: boolean;
    width?: number;
    height?: number;
  }): Promise<any> {
    try {
      // If this is the first image, make it primary
      const existingImages = await db
        .select()
        .from(bookImages)
        .where(eq(bookImages.bookId, bookId));

      const isPrimary = existingImages.length === 0 || imageData.isPrimary;

      // If setting as primary, unset other primary images
      if (isPrimary) {
        await db
          .update(bookImages)
          .set({ isPrimary: false })
          .where(eq(bookImages.bookId, bookId));
      }

      const [newImage] = await db
        .insert(bookImages)
        .values({
          bookId,
          cloudinaryUrl: imageData.cloudinaryUrl,
          cloudinaryPublicId: imageData.cloudinaryPublicId,
          altText: imageData.altText,
          isPrimary,
          order: existingImages.length,
          width: imageData.width,
          height: imageData.height,
        })
        .returning();

      return this.formatBookImage(newImage as any);
    } catch (error) {
      console.error('📚 BookService.addBookImage: Error adding image:', error);
      throw error;
    }
  }

  /**
   * Remove book image
   */
  static async removeBookImage(imageId: string, bookId: string, sellerId: string): Promise<void> {
    try {
      // Verify ownership
      const [book] = await db
        .select()
        .from(books)
        .where(and(eq(books.id, bookId), eq(books.sellerId, sellerId)))
        .limit(1);

      if (!book) {
        throw new Error('Book not found or access denied');
      }

      await db
        .delete(bookImages)
        .where(eq(bookImages.id, imageId));

      console.log('📚 BookService.removeBookImage: Image removed:', imageId);
    } catch (error) {
      console.error('📚 BookService.removeBookImage: Error removing image:', error);
      throw error;
    }
  }

  /**
   * Generate URL-friendly slug from title
   */
  private static async generateSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if slug already exists and add suffix if needed
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existingBook = await db
        .select({ id: books.id })
        .from(books)
        .where(eq(books.slug, slug))
        .limit(1);
      
      if (existingBook.length === 0) {
        break; // Slug is unique
      }
      
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  /**
   * Format book data for API response
   */
  private static formatBook(book: any): Book {
    return {
      id: book.id,
      sellerId: book.sellerId,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description,
      seriesName: book.seriesName,
      seriesNumber: book.seriesNumber,
      tropes: book.tropes || [],
      spiceLevel: book.spiceLevel,
      condition: book.condition,
      conditionNotes: book.conditionNotes,
      priceCents: book.priceCents,
      shippingPriceCents: book.shippingPriceCents,
      acceptsOffers: book.acceptsOffers || false,
      localPickupAvailable: book.localPickupAvailable,
      city: book.city,
      state: book.state,
      zipCode: book.zipCode,
      isSpecialEdition: book.isSpecialEdition,
      subscriptionBox: book.subscriptionBox,
      isSigned: book.isSigned || false,
      signatureType: book.signatureType,
      specialEditionDetails: book.specialEditionDetails,
      status: book.status,
      slug: book.slug,
      viewCount: book.viewCount || 0,
      publishedAt: book.publishedAt?.toISOString(),
      soldAt: book.soldAt?.toISOString(),
      createdAt: book.createdAt.toISOString(),
      updatedAt: book.updatedAt.toISOString(),
      images: [],
    };
  }

  /**
   * Format book image data for API response
   */
  private static formatBookImage(image: any): any {
    return {
      id: image.id,
      bookId: image.bookId,
      cloudinaryUrl: image.cloudinaryUrl,
      cloudinaryPublicId: image.cloudinaryPublicId,
      altText: image.altText,
      isPrimary: image.isPrimary,
      order: image.order,
      width: image.width,
      height: image.height,
      createdAt: image.createdAt.toISOString(),
    };
  }

  /**
   * Get search suggestions and autocomplete
   */
  static async getSearchSuggestions(query: string, _limit: number = 10) {
    try {
      const searchTerm = `%${query.toLowerCase()}%`;
      
      // Get matching books
      const matchingBooks = await db
        .select({
          id: books.id,
          title: books.title,
          author: books.author,
          priceCents: books.priceCents,
          coverImage: sql<string>`(
            SELECT ${bookImages.cloudinaryUrl} 
            FROM ${bookImages} 
            WHERE ${bookImages.bookId} = ${books.id} 
            AND ${bookImages.isPrimary} = true 
            LIMIT 1
          )`,
        })
        .from(books)
        .where(
          and(
            eq(books.status, 'active'),
            sql`(LOWER(${books.title}) LIKE ${searchTerm} OR LOWER(${books.author}) LIKE ${searchTerm})`
          )
        )
        .limit(5);

      // Get matching authors
      const matchingAuthors = await db
        .selectDistinct({ author: books.author })
        .from(books)
        .where(
          and(
            eq(books.status, 'active'),
            sql`LOWER(${books.author}) LIKE ${searchTerm}`
          )
        )
        .limit(5);

      // Get matching tropes
      const matchingTropes = await db
        .select({ tropes: books.tropes })
        .from(books)
        .where(
          and(
            eq(books.status, 'active'),
            sql`EXISTS (
              SELECT 1 FROM jsonb_array_elements_text(${books.tropes}) AS trope
              WHERE LOWER(trope) LIKE ${searchTerm}
            )`
          )
        )
        .limit(5);

      return {
        books: matchingBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.priceCents / 100,
          coverImage: book.coverImage,
          type: 'book' as const,
        })),
        authors: matchingAuthors.map(a => ({
          text: a.author,
          type: 'author' as const,
        })),
        tropes: Array.from(
          new Set(
            matchingTropes.flatMap(t => 
              (t.tropes as string[]).filter(trope => 
                trope.toLowerCase().includes(query.toLowerCase())
              )
            )
          )
        ).slice(0, 5).map(trope => ({
          text: trope,
          type: 'trope' as const,
        })),
        popularSearches: ['romantasy', 'enemies to lovers', 'special edition', 'signed copy'],
      };
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      throw error;
    }
  }

  /**
   * Get popular searches
   */
  static async getPopularSearches(_limit: number = 10) {
    try {
      // This is a placeholder implementation
      return ['romantasy', 'enemies to lovers', 'special edition', 'signed copy', 'ACOTAR'];
    } catch (error) {
      console.error('Error getting popular searches:', error);
      throw error;
    }
  }

  /**
   * Get featured books
   */
  static async getFeaturedBooks(limit: number = 10) {
    try {
      const featuredBooks = await db
        .select()
        .from(books)
        .where(eq(books.status, 'active'))
        .orderBy(desc(books.viewCount))
        .limit(limit);

      return featuredBooks.map(book => this.formatBook(book as any));
    } catch (error) {
      console.error('Error getting featured books:', error);
      throw error;
    }
  }

  /**
   * Get trending books
   */
  static async getTrendingBooks(limit: number = 10, _period: string = 'week') {
    try {
      const trendingBooks = await db
        .select()
        .from(books)
        .where(eq(books.status, 'active'))
        .orderBy(desc(books.viewCount))
        .limit(limit);

      return trendingBooks.map(book => this.formatBook(book as any));
    } catch (error) {
      console.error('Error getting trending books:', error);
      throw error;
    }
  }

  /**
   * Get recently added books
   */
  static async getRecentlyAddedBooks(limit: number = 10) {
    try {
      const recentBooks = await db
        .select()
        .from(books)
        .where(eq(books.status, 'active'))
        .orderBy(desc(books.publishedAt))
        .limit(limit);

      // Get images for each book
      const booksWithImages = await Promise.all(
        recentBooks.map(async (book) => {
          const images = await db
            .select()
            .from(bookImages)
            .where(eq(bookImages.bookId, book.id))
            .orderBy(asc(bookImages.order));

          return {
            ...this.formatBook(book as any),
            images: images.map(img => this.formatBookImage(img as any)),
          };
        })
      );

      return booksWithImages;
    } catch (error) {
      console.error('Error getting recently added books:', error);
      throw error;
    }
  }

  /**
   * Get recommended books for user based on their preferences
   */
  static async getRecommendedBooks(userId: string, limit: number = 10) {
    try {
      // Get user's preferences from registration survey
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return [];
      }

      const survey = user.registrationSurvey as any;
      const interests = survey?.interests || [];

      // Get books matching user interests (tropes, genres)
      const recommendedBooks = await db
        .select()
        .from(books)
        .where(
          and(
            eq(books.status, 'active'),
            interests.length > 0
              ? sql`${books.tropes} ?| ARRAY[${sql.raw(interests.map((i: string) => `'${i}'`).join(','))}]`
              : sql`1=1`
          )
        )
        .orderBy(desc(books.viewCount))
        .limit(limit);

      // Get images for each book
      const booksWithImages = await Promise.all(
        recommendedBooks.map(async (book) => {
          const images = await db
            .select()
            .from(bookImages)
            .where(eq(bookImages.bookId, book.id))
            .orderBy(asc(bookImages.order));

          return {
            ...this.formatBook(book as any),
            images: images.map(img => this.formatBookImage(img as any)),
          };
        })
      );

      return booksWithImages;
    } catch (error) {
      console.error('Error getting recommended books:', error);
      throw error;
    }
  }
}
