import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';
import { ImageService } from '../services/image.service';
import { ApiResponse } from '@bookheart/shared';
import multer from 'multer';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Upload single image
router.post('/upload', 
  authenticate, 
  requireRole('seller', 'both'),
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No image file provided',
      });
      return;
    }

    try {
      const result = await ImageService.uploadImage(req.file);
      
      const response: ApiResponse = {
        success: true,
        data: result,
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload image',
      });
    }
  })
);

// Upload multiple images
router.post('/upload-multiple',
  authenticate,
  requireRole('seller', 'both'),
  upload.array('images', 10), // Max 10 images
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      res.status(400).json({
        success: false,
        error: 'No image files provided',
      });
      return;
    }

    try {
      const results = await ImageService.uploadImages(files);
      
      const response: ApiResponse = {
        success: true,
        data: results,
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to upload images',
      });
    }
  })
);

// Delete image
router.delete('/:publicId',
  authenticate,
  requireRole('seller', 'both'),
  asyncHandler(async (req, res) => {
    const { publicId } = req.params;

    try {
      await ImageService.deleteImage(publicId);
      
      const response: ApiResponse = {
        success: true,
        data: { message: 'Image deleted successfully' },
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete image',
      });
    }
  })
);

// Get optimized image URL
router.get('/optimized/:publicId',
  asyncHandler(async (req, res) => {
    const { publicId } = req.params;
    const { width, height, crop, quality, format } = req.query;

    try {
      const url = ImageService.getOptimizedUrl(publicId, {
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
        crop: crop as string,
        quality: quality as string,
        format: format as string,
      });

      const response: ApiResponse = {
        success: true,
        data: { url },
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate image URL',
      });
    }
  })
);

export default router;
