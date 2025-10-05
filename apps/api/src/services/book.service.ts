import { db, books, bookImages, users, eq, and, desc, asc, like, sql, count } from '@bookheart/database';
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
      const slug = this.generateSlug(data.title);
      
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
   * Get books with search and filters
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
        sortOrder = 'desc'
      } = params;

      const offset = (page - 1) * pageSize;

      // Build where conditions
      const whereConditions = [eq(books.status, 'active')];

      if (query) {
        whereConditions.push(
          sql`(${books.title} ILIKE ${`%${query}%`} OR ${books.author} ILIKE ${`%${query}%`} OR ${books.description} ILIKE ${`%${query}%`})`
        );
      }

      if (author) {
        whereConditions.push(like(books.author, `%${author}%`));
      }

      if (minPrice !== undefined) {
        whereConditions.push(sql`${books.priceCents} >= ${minPrice * 100}`);
      }

      if (maxPrice !== undefined) {
        whereConditions.push(sql`${books.priceCents} <= ${maxPrice * 100}`);
      }

      if (condition.length > 0) {
        whereConditions.push(sql`${books.condition} = ANY(${condition})`);
      }

      if (isSpecialEdition !== undefined) {
        whereConditions.push(eq(books.isSpecialEdition, isSpecialEdition));
      }

      if (localPickupAvailable !== undefined) {
        whereConditions.push(eq(books.localPickupAvailable, localPickupAvailable));
      }

      if (tropes.length > 0) {
        whereConditions.push(sql`${books.tropes} && ${tropes}`);
      }

      if (spiceLevel.length > 0) {
        whereConditions.push(sql`${books.spiceLevel} = ANY(${spiceLevel})`);
      }

      // Build order by
      let orderBy;
      switch (sortBy) {
        case 'price':
          orderBy = sortOrder === 'asc' ? asc(books.priceCents) : desc(books.priceCents);
          break;
        case 'title':
          orderBy = sortOrder === 'asc' ? asc(books.title) : desc(books.title);
          break;
        case 'newest':
        default:
          orderBy = sortOrder === 'asc' ? asc(books.publishedAt) : desc(books.publishedAt);
          break;
      }

      // Get total count
      const [totalResult] = await db
        .select({ count: count() })
        .from(books)
        .where(and(...whereConditions));

      const total = totalResult.count;

      // Get books
      const booksData = await db
        .select()
        .from(books)
        .where(and(...whereConditions))
        .orderBy(orderBy)
        .limit(pageSize)
        .offset(offset);

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

      return {
        items: booksWithImages,
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
        updateData.slug = this.generateSlug(data.title);
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
  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
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
      localPickupAvailable: book.localPickupAvailable,
      isSpecialEdition: book.isSpecialEdition,
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
   * Get search suggestions
   */
  static async getSearchSuggestions(_query: string, _limit: number = 10) {
    try {
      // This is a placeholder implementation
      // In a real app, you'd implement proper search suggestions
      return {
        suggestions: [],
        popularSearches: ['romantasy', 'enemies to lovers', 'special edition', 'signed copy'],
        trendingAuthors: ['Sarah J. Maas', 'Rebecca Yarros', 'Jennifer L. Armentrout'],
        trendingSeries: ['ACOTAR', 'Fourth Wing', 'From Blood and Ash'],
        trendingTropes: ['enemies-to-lovers', 'fated-mates', 'magic-system']
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
        .orderBy(desc(books.createdAt))
        .limit(limit);

      return recentBooks.map(book => this.formatBook(book as any));
    } catch (error) {
      console.error('Error getting recently added books:', error);
      throw error;
    }
  }
}
