// src/utils/imageHelper.js
export class ImageHelper {
  
  /**
   * Tạo đường dẫn hình ảnh sản phẩm dựa trên tên
   * @param {string} productName - Tên sản phẩm
   * @param {string} imageType - Loại hình: 'main', 'detail-1', 'detail-2', 'package'
   * @returns {string} - Đường dẫn hình ảnh
   */
  static getProductImagePath(productName, imageType = 'main') {
    const slug = productName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    return `/images/products/${slug}/${imageType}.jpg`;
  }
  
  /**
   * Tạo danh sách hình ảnh cho sản phẩm
   * @param {string} productName - Tên sản phẩm
   * @param {number} imageCount - Số lượng hình (mặc định 4)
   * @returns {Array} - Mảng đường dẫn hình ảnh
   */
  static generateProductImages(productName, imageCount = 4) {
    const images = [];
    const slug = productName.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    // Hình chính
    images.push(`/images/products/${slug}/main.jpg`);
    
    // Hình chi tiết
    for (let i = 1; i < imageCount; i++) {
      images.push(`/images/products/${slug}/detail-${i}.jpg`);
    }
    
    return images;
  }
  
  /**
   * Kiểm tra hình ảnh có tồn tại không
   * @param {string} imagePath - Đường dẫn hình ảnh
   * @returns {Promise<boolean>} - True nếu tồn tại
   */
  static async imageExists(imagePath) {
    try {
      const response = await fetch(imagePath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  /**
   * Lấy hình fallback nếu hình gốc không tồn tại
   * @param {string} originalPath - Đường dẫn gốc
   * @param {string} category - Danh mục sản phẩm
   * @returns {Promise<string>} - Đường dẫn hình cuối cùng
   */
  static async getImageWithFallback(originalPath, category) {
    if (await this.imageExists(originalPath)) {
      return originalPath;
    }
    
    // Fallback theo category
    const categoryImage = `/images/categories/${category.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    if (await this.imageExists(categoryImage)) {
      return categoryImage;
    }
    
    // Default fallback
    return '/images/default/product-placeholder.jpg';
  }
  
  /**
   * Tạo srcset cho responsive images
   * @param {string} basePath - Đường dẫn cơ bản
   * @returns {string} - Srcset string
   */
  static generateSrcSet(basePath) {
    const name = basePath.split('.')[0];
    return `${name}-400w.jpg 400w, ${name}-800w.jpg 800w, ${basePath} 1200w`;
  }
}