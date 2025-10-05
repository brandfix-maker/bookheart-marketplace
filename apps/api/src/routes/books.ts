import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { validate } from '../middleware/validation';
import { BookService } from '../services/book.service';
import { createBookSchema, updateBookSchema, uuidSchema } from '../utils/validation';
import { ApiResponse } from '@bookheart/shared';

const router = Router();

// Get all books (public)
router.get('/', optionalAuth, asyncHandler(async (req, res) => {
  const searchParams = {
    query: req.query.q as string,
    author: req.query.author as string,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    condition: req.query.condition ? (Array.isArray(req.query.condition) ? req.query.condition as string[] : [req.query.condition as string]) : [] as any[],
    isSpecialEdition: req.query.isSpecialEdition === 'true' ? true : req.query.isSpecialEdition === 'false' ? false : undefined,
    localPickupAvailable: req.query.localPickupAvailable === 'true' ? true : req.query.localPickupAvailable === 'false' ? false : undefined,
    tropes: req.query.tropes ? (Array.isArray(req.query.tropes) ? req.query.tropes as string[] : [req.query.tropes as string]) : [],
    spiceLevel: req.query.spiceLevel ? (Array.isArray(req.query.spiceLevel) ? req.query.spiceLevel.map(Number) : [Number(req.query.spiceLevel)]) : [],
    page: req.query.page ? Number(req.query.page) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20,
    sortBy: req.query.sortBy as 'price' | 'newest' | 'title' | 'relevance' | 'views' | 'sellerRating' || 'newest',
    sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc',
    seriesName: req.query.seriesName as string,
    publishedYear: req.query.publishedYear ? Number(req.query.publishedYear) : undefined,
    sellerId: req.query.sellerId as string,
    location: req.query.location as string,
    hasImages: req.query.hasImages === 'true' ? true : req.query.hasImages === 'false' ? false : undefined,
    inStock: req.query.inStock === 'true' ? true : req.query.inStock === 'false' ? false : undefined,
    fuzzyMatch: req.query.fuzzyMatch === 'true' ? true : req.query.fuzzyMatch === 'false' ? false : undefined,
    includeDescription: req.query.includeDescription === 'true' ? true : req.query.includeDescription === 'false' ? false : undefined,
    featured: req.query.featured === 'true' ? true : req.query.featured === 'false' ? false : undefined,
    trending: req.query.trending === 'true' ? true : req.query.trending === 'false' ? false : undefined,
    recentlyAdded: req.query.recentlyAdded === 'true' ? true : req.query.recentlyAdded === 'false' ? false : undefined,
  };

  const result = await BookService.getBooks(searchParams);
  
  const response: ApiResponse = {
    success: true,
    data: result,
  };

  res.json(response);
}));



// Get seller's books (any authenticated user can view their own books)
router.get('/seller/my-books', authenticate, asyncHandler(async (req, res) => {
  const { status } = req.query;
  const sellerId = req.user!.userId;

  const books = await BookService.getSellerBooks(sellerId, status as string);
  
  const response: ApiResponse = {
    success: true,
    data: books,
  };

  res.json(response);
}));

// Get all drafts for seller
router.get('/drafts', authenticate, asyncHandler(async (req, res) => {
  const sellerId = req.user!.userId;

  const drafts = await BookService.getSellerBooks(sellerId, 'draft');
  
  const response: ApiResponse = {
    success: true,
    data: drafts,
  };

  res.json(response);
}));

// Get single draft
router.get('/drafts/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user!.userId;

  const validation = uuidSchema.safeParse(id);
  if (!validation.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid draft ID format',
    });
    return;
  }

  const book = await BookService.getBookById(id);
  
  if (!book || book.sellerId !== sellerId || book.status !== 'draft') {
    res.status(404).json({
      success: false,
      error: 'Draft not found',
    });
    return;
  }

  const response: ApiResponse = {
    success: true,
    data: book,
  };

  res.json(response);
}));

// Save/update draft
router.post('/drafts', authenticate, asyncHandler(async (req, res) => {
  const sellerId = req.user!.userId;
  const bookData = { ...req.body, status: 'draft' };

  // If id exists, update; otherwise create
  if (bookData.id) {
    const book = await BookService.updateBook(bookData.id, sellerId, bookData);
    const response: ApiResponse = {
      success: true,
      data: book,
    };
    res.json(response);
  } else {
    const book = await BookService.createBook(sellerId, bookData);
    const response: ApiResponse = {
      success: true,
      data: book,
    };
    res.status(201).json(response);
  }
}));

// Get seller dashboard stats (any authenticated user can view their stats)
router.get('/seller/stats', authenticate, asyncHandler(async (req, res) => {
  const sellerId = req.user!.userId;

  const stats = await BookService.getSellerStats(sellerId);
  
  const response: ApiResponse = {
    success: true,
    data: stats,
  };

  res.json(response);
}));

// Create new book (any authenticated user can list books)
router.post('/', authenticate, validate(createBookSchema), asyncHandler(async (req, res) => {
  const sellerId = req.user!.userId;
  const bookData = req.body;

  const book = await BookService.createBook(sellerId, bookData);
  
  const response: ApiResponse = {
    success: true,
    data: book,
  };

  res.status(201).json(response);
}));

// Update book (any authenticated user can update their own books)
router.put('/:id', authenticate, validate(updateBookSchema), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user!.userId;
  const updateData = req.body;

  // Validate UUID
  const validation = uuidSchema.safeParse(id);
  if (!validation.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid book ID format',
    });
    return;
  }

  const book = await BookService.updateBook(id, sellerId, updateData);
  
  const response: ApiResponse = {
    success: true,
    data: book,
  };

  res.json(response);
}));

// Delete book (any authenticated user can delete their own books)
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user!.userId;

  // Validate UUID
  const validation = uuidSchema.safeParse(id);
  if (!validation.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid book ID format',
    });
    return;
  }

  await BookService.deleteBook(id, sellerId);
  
  const response: ApiResponse = {
    success: true,
    data: { message: 'Book deleted successfully' },
  };

  res.json(response);
}));

// Add book image (any authenticated user can add images to their books)
router.post('/:id/images', authenticate, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { cloudinaryUrl, cloudinaryPublicId, altText, isPrimary, width, height } = req.body;

  // Validate UUID
  const validation = uuidSchema.safeParse(id);
  if (!validation.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid book ID format',
    });
    return;
  }

  const image = await BookService.addBookImage(id, {
    cloudinaryUrl,
    cloudinaryPublicId,
    altText,
    isPrimary,
    width,
    height,
  });
  
  const response: ApiResponse = {
    success: true,
    data: image,
  };

  res.status(201).json(response);
}));

// Remove book image (any authenticated user can remove images from their books)
router.delete('/:id/images/:imageId', authenticate, asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;
  const sellerId = req.user!.userId;

  // Validate UUIDs
  const bookValidation = uuidSchema.safeParse(id);
  const imageValidation = uuidSchema.safeParse(imageId);
  
  if (!bookValidation.success || !imageValidation.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid ID format',
    });
    return;
  }

  await BookService.removeBookImage(imageId, id, sellerId);
  
  const response: ApiResponse = {
    success: true,
    data: { message: 'Image removed successfully' },
  };

  res.json(response);
}));

// Search suggestions and autocomplete
router.get('/search/suggestions', optionalAuth, asyncHandler(async (req, res) => {
  const { q, limit = '10' } = req.query;
  
  if (!q || typeof q !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Query parameter is required',
    });
    return;
  }

  const suggestions = await BookService.getSearchSuggestions(q, Number(limit));
  
  const response: ApiResponse = {
    success: true,
    data: suggestions,
  };

  res.json(response);
}));

// Popular searches
router.get('/search/popular', optionalAuth, asyncHandler(async (req, res) => {
  const { limit = '10' } = req.query;
  
  const popularSearches = await BookService.getPopularSearches(Number(limit));
  
  const response: ApiResponse = {
    success: true,
    data: popularSearches,
  };

  res.json(response);
}));

// Featured books
router.get('/featured', optionalAuth, asyncHandler(async (req, res) => {
  const { limit = '10' } = req.query;
  
  const featuredBooks = await BookService.getFeaturedBooks(Number(limit));
  
  const response: ApiResponse = {
    success: true,
    data: featuredBooks,
  };

  res.json(response);
}));

// Trending books
router.get('/trending', optionalAuth, asyncHandler(async (req, res) => {
  const { limit = '10', period = 'week' } = req.query;
  
  const trendingBooks = await BookService.getTrendingBooks(Number(limit), period as string);
  
  const response: ApiResponse = {
    success: true,
    data: trendingBooks,
  };

  res.json(response);
}));

// Recently added books
router.get('/recent', optionalAuth, asyncHandler(async (req, res) => {
  const { limit = '10' } = req.query;
  
  const recentBooks = await BookService.getRecentlyAddedBooks(Number(limit));
  
  const response: ApiResponse = {
    success: true,
    data: recentBooks,
  };

  res.json(response);
}));

// Recommended books (authenticated users only)
router.get('/recommended', authenticate, asyncHandler(async (req, res) => {
  const { limit = '10' } = req.query;
  const userId = req.user!.userId;
  
  const recommendedBooks = await BookService.getRecommendedBooks(userId, Number(limit));
  
  const response: ApiResponse = {
    success: true,
    data: recommendedBooks,
  };

  res.json(response);
}));

// Autocomplete for search
router.get('/autocomplete', optionalAuth, asyncHandler(async (req, res) => {
  const { q, limit = '10' } = req.query;
  
  if (!q || typeof q !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Query parameter is required',
    });
    return;
  }

  const autocomplete = await BookService.getSearchSuggestions(q, Number(limit));
  
  const response: ApiResponse = {
    success: true,
    data: autocomplete,
  };

  res.json(response);
}));

// Get single book (public) - MUST be after specific routes
router.get('/:id', optionalAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Validate UUID
  const validation = uuidSchema.safeParse(id);
  if (!validation.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid book ID format',
    });
    return;
  }

  const book = await BookService.getBookById(id);
  
  if (!book) {
    res.status(404).json({
      success: false,
      error: 'Book not found',
    });
    return;
  }

  // Increment view count
  // TODO: Implement view count increment

  const response: ApiResponse = {
    success: true,
    data: book,
  };

  res.json(response);
}));

export default router;
