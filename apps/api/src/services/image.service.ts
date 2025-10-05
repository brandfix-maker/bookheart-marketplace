import { v2 as cloudinary } from 'cloudinary';
import { ImageUploadResponse } from '@bookheart/shared';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class ImageService {
  /**
   * Upload image to Cloudinary
   */
  static async uploadImage(
    file: Express.Multer.File,
    folder: string = 'bookheart/books'
  ): Promise<ImageUploadResponse> {
    try {
      console.log('📸 ImageService.uploadImage: Uploading image to Cloudinary');
      
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder,
          resource_type: 'image',
          quality: 'auto',
          fetch_format: 'auto',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' }
          ]
        }
      );

      console.log('📸 ImageService.uploadImage: Upload successful:', result.public_id);

      return {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      console.error('📸 ImageService.uploadImage: Upload failed:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Upload multiple images
   */
  static async uploadImages(
    files: Express.Multer.File[],
    folder: string = 'bookheart/books'
  ): Promise<ImageUploadResponse[]> {
    try {
      console.log('📸 ImageService.uploadImages: Uploading', files.length, 'images');
      
      const uploadPromises = files.map(file => this.uploadImage(file, folder));
      const results = await Promise.all(uploadPromises);
      
      console.log('📸 ImageService.uploadImages: All uploads successful');
      return results;
    } catch (error) {
      console.error('📸 ImageService.uploadImages: Upload failed:', error);
      throw new Error('Failed to upload images');
    }
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<void> {
    try {
      console.log('📸 ImageService.deleteImage: Deleting image:', publicId);
      
      await cloudinary.uploader.destroy(publicId);
      
      console.log('📸 ImageService.deleteImage: Image deleted successfully');
    } catch (error) {
      console.error('📸 ImageService.deleteImage: Delete failed:', error);
      throw new Error('Failed to delete image');
    }
  }

  /**
   * Delete multiple images
   */
  static async deleteImages(publicIds: string[]): Promise<void> {
    try {
      console.log('📸 ImageService.deleteImages: Deleting', publicIds.length, 'images');
      
      const deletePromises = publicIds.map(publicId => this.deleteImage(publicId));
      await Promise.all(deletePromises);
      
      console.log('📸 ImageService.deleteImages: All images deleted successfully');
    } catch (error) {
      console.error('📸 ImageService.deleteImages: Delete failed:', error);
      throw new Error('Failed to delete images');
    }
  }

  /**
   * Generate optimized image URL
   */
  static getOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}): string {
    const {
      width = 400,
      height = 600,
      crop = 'fill',
      quality = 'auto',
      format = 'auto'
    } = options;

    return cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      fetch_format: format,
    });
  }

  /**
   * Generate thumbnail URL
   */
  static getThumbnailUrl(publicId: string): string {
    return this.getOptimizedUrl(publicId, {
      width: 200,
      height: 300,
      crop: 'fill',
    });
  }

  /**
   * Generate medium URL
   */
  static getMediumUrl(publicId: string): string {
    return this.getOptimizedUrl(publicId, {
      width: 400,
      height: 600,
      crop: 'limit',
    });
  }

  /**
   * Generate large URL
   */
  static getLargeUrl(publicId: string): string {
    return this.getOptimizedUrl(publicId, {
      width: 800,
      height: 1200,
      crop: 'limit',
    });
  }
}
