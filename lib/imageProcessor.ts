/**
 * Image processing utilities for print uploads
 */

export interface ProcessedImage {
  url: string; // Object URL or data URL
  width: number;
  height: number;
  aspectRatio: number;
  file: File;
  thumbnailUrl?: string; // Smaller version for preview
}

/**
 * Supported image formats
 */
const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 2048; // Max width or height

/**
 * Validate uploaded file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Supported: PNG, JPG, WEBP, SVG`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 10MB`,
    };
  }

  return { valid: true };
}

/**
 * Load image from file and get dimensions
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Resize image to fit constraints
 */
function resizeImage(
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    let { width, height } = img;

    // Calculate new dimensions
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio;
      height = height * ratio;
    }

    // Create canvas and resize
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(img);
      return;
    }

    ctx.drawImage(img, 0, 0, width, height);

    // Convert back to image
    const resizedImg = new Image();
    resizedImg.onload = () => resolve(resizedImg);
    resizedImg.src = canvas.toDataURL('image/png');
  });
}

/**
 * Create thumbnail (small preview image)
 */
function createThumbnail(img: HTMLImageElement, maxSize: number = 200): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    let { width, height } = img;

    // Calculate thumbnail dimensions
    if (width > height) {
      height = (height / width) * maxSize;
      width = maxSize;
    } else {
      width = (width / height) * maxSize;
      height = maxSize;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(img.src);
      return;
    }

    ctx.drawImage(img, 0, 0, width, height);
    resolve(canvas.toDataURL('image/png'));
  });
}

/**
 * Process uploaded image file
 * - Validates file
 * - Resizes if needed
 * - Creates object URL
 * - Generates thumbnail
 */
export async function processImageFile(file: File): Promise<ProcessedImage> {
  // Validate file
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Load image
  const img = await loadImageFromFile(file);

  // Resize if needed
  let processedImg = img;
  if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
    processedImg = await resizeImage(img, MAX_DIMENSION, MAX_DIMENSION);
  }

  // Create object URL for the original file
  const url = URL.createObjectURL(file);

  // Create thumbnail
  const thumbnailUrl = await createThumbnail(processedImg);

  return {
    url,
    width: processedImg.width,
    height: processedImg.height,
    aspectRatio: processedImg.width / processedImg.height,
    file,
    thumbnailUrl,
  };
}

/**
 * Revoke object URL to free memory
 */
export function revokeImageUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Process multiple image files
 */
export async function processImageFiles(files: File[]): Promise<ProcessedImage[]> {
  return Promise.all(files.map(processImageFile));
}

