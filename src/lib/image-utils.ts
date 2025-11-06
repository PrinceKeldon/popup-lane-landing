/**
 * Extract all images from a product, prioritizing image_urls array
 */
export function getProductImages(product: any): string[] {
  const images: string[] = [];
  
  // Primary: use image_urls array
  if (product?.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    images.push(...product.image_urls.filter((url: string) => url));
  }
  // Fallback: use single image_url if image_urls is empty
  else if (product?.image_url) {
    images.push(product.image_url);
  }
  
  return images;
}

/**
 * Get all images from multiple products
 */
export function getProductImagesFromMultiple(products: any[]): string[] {
  const allImages: string[] = [];
  
  products.forEach(product => {
    allImages.push(...getProductImages(product));
  });
  
  return allImages;
}
