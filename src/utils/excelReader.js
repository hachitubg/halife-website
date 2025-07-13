// src/utils/excelReader.js
// Utility để đọc file Excel và convert sang format phù hợp cho Vue app

import * as XLSX from 'xlsx';

class ExcelReader {
  constructor() {
    this.products = [];
    this.categories = [];
    this.lastUpdated = null;
    this.isLoaded = false;
    this.error = null;
  }

  /**
   * Đọc file Excel từ đường dẫn
   * @param {string} filePath - Đường dẫn file Excel
   * @returns {Promise<Object>} - Promise chứa data đã được parse
   */
  async readExcelFile(filePath) {
    try {
      console.log('📖 Đang đọc file Excel từ:', filePath);
      
      // Fetch file từ public directory
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Không thể tải file: ${response.status} ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Parse các sheet
      const result = {
        products: this.parseProductsSheet(workbook),
        categories: this.parseCategoriesSheet(workbook),
        metadata: this.parseMetadata(workbook)
      };

      // Cache data
      this.products = result.products;
      this.categories = result.categories;
      this.lastUpdated = new Date();
      this.isLoaded = true;
      this.error = null;

      console.log('✅ Excel file đã được đọc thành công');
      console.log(`📊 ${result.products.length} sản phẩm và ${result.categories.length} danh mục`);

      return result;
      
    } catch (error) {
      console.error('❌ Lỗi đọc file Excel:', error);
      this.error = error.message;
      this.isLoaded = false;
      throw error;
    }
  }

  /**
   * Parse sheet Products
   * @param {Object} workbook - XLSX workbook object
   * @returns {Array} - Mảng sản phẩm đã được format
   */
  parseProductsSheet(workbook) {
    const sheetName = 'Products';
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet) {
      throw new Error(`Sheet "${sheetName}" không tồn tại`);
    }

    // Convert sheet thành JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { 
      defval: "",
      raw: false // Giữ nguyên format text
    });

    if (rawData.length === 0) {
      throw new Error('Sheet Products không có dữ liệu');
    }

    console.log('📋 Đã đọc', rawData.length, 'dòng dữ liệu từ sheet Products');

    return rawData
      .filter(row => row.id && row.name) // Lọc bỏ dòng trống
      .map(row => this.formatProductData(row))
      .filter(product => product.status === 'active'); // Chỉ lấy sản phẩm active
  }

  /**
   * Parse sheet Categories
   * @param {Object} workbook - XLSX workbook object
   * @returns {Array} - Mảng danh mục đã được format
   */
  parseCategoriesSheet(workbook) {
    const sheetName = 'Categories';
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet) {
      console.warn('Sheet Categories không tồn tại, sử dụng danh mục mặc định');
      return this.getDefaultCategories();
    }

    const rawData = XLSX.utils.sheet_to_json(worksheet, { 
      defval: "",
      raw: false
    });

    if (rawData.length === 0) {
      return this.getDefaultCategories();
    }

    console.log('📂 Đã đọc', rawData.length, 'danh mục từ sheet Categories');

    return rawData
      .filter(row => row.id && row.name)
      .map(row => this.formatCategoryData(row))
      .filter(category => category.is_active);
  }

  /**
   * Format dữ liệu sản phẩm từ Excel row
   * @param {Object} row - Dữ liệu dòng từ Excel
   * @returns {Object} - Object sản phẩm đã format
   */
  formatProductData(row) {
    return {
      id: parseInt(row.id) || 0,
      name: row.name || '',
      description: row.description || '',
      category: row.category || '',
      subcategory: row.subcategory || '',
      
      // Giá cả
      price: this.formatPrice(row.price),
      originalPrice: this.formatPrice(row.original_price || row.price),
      discount: parseInt(row.discount_percent) || 0,
      
      // Thông tin cơ bản
      unit: row.unit || 'chai',
      packageSize: row.package_size || '',
      targetAnimal: row.target_animal || '',
      
      // Thông tin chi tiết
      fullDescription: row.full_description || row.description,
      functions: row.functions ? row.functions.split(';').map(f => f.trim()) : [],
      usageInstructions: row.usage_instructions || '',
      activeIngredients: row.active_ingredients || '',
      dosage: row.dosage || '',
      withdrawalTime: row.withdrawal_time || '',
      storageConditions: row.storage_conditions || '',
      shelfLife: row.shelf_life || '',
      
      // Thông tin nhà sản xuất
      manufacturer: row.manufacturer || 'HALIFE Việt Nhật',
      originCountry: row.origin_country || 'Việt Nam',
      registrationNumber: row.registration_number || '',
      
      // Trạng thái và đánh giá
      isFeatured: this.parseBoolean(row.is_featured),
      inStock: this.parseBoolean(row.in_stock),
      stockQuantity: parseInt(row.stock_quantity) || 0,
      rating: parseFloat(row.rating) || 0,
      reviewCount: parseInt(row.review_count) || 0,
      
      // Hình ảnh
      image: row.image_url || this.getDefaultProductImage(row.category),
      images: this.parseProductImages(row.image_url, row.gallery_images, row.category),
      
      // SEO
      tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
      seoKeywords: row.seo_keywords ? row.seo_keywords.split(',').map(k => k.trim()) : [],
      metaDescription: row.meta_description || '',
      
      // Timestamps
      createdDate: row.created_date || new Date().toISOString().split('T')[0],
      updatedDate: row.updated_date || new Date().toISOString().split('T')[0],
      status: row.status || 'active'
    };
  }

  parseProductImages(mainImage, galleryImages, category) {
    const images = [];
    
    // Thêm hình chính
    if (mainImage && mainImage.trim()) {
      images.push(mainImage.trim());
    }
    
    // Thêm gallery images
    if (galleryImages && galleryImages.trim()) {
      const galleryUrls = galleryImages.split(';')
        .map(url => url.trim())
        .filter(url => url && url !== mainImage); // Loại bỏ trùng lặp
      images.push(...galleryUrls);
    }
    
    // Nếu không có hình nào, dùng default
    if (images.length === 0) {
      images.push(this.getDefaultProductImage(category));
    }
    
    return images;
  }

  /**
   * Format dữ liệu danh mục từ Excel row
   * @param {Object} row - Dữ liệu dòng từ Excel
   * @returns {Object} - Object danh mục đã format
   */
  formatCategoryData(row) {
    return {
      id: parseInt(row.id) || 0,
      name: row.name || '',
      slug: row.slug || '',
      description: row.description || '',
      icon: row.icon || 'fas fa-box',
      parentId: parseInt(row.parent_id) || null,
      sortOrder: parseInt(row.sort_order) || 999,
      is_active: this.parseBoolean(row.is_active)
    };
  }

  /**
   * Format giá tiền từ Excel
   * @param {string|number} value - Giá trị giá tiền
   * @returns {string} - Giá đã format
   */
  formatPrice(value) {
    if (!value) return "0";
    
    // Nếu đã là string có dấu phẩy, giữ nguyên
    if (typeof value === 'string' && value.includes(',')) {
      return value;
    }
    
    // Convert number thành string với dấu phẩy
    const numericValue = parseInt(value.toString().replace(/[^\d]/g, '')) || 0;
    return new Intl.NumberFormat('vi-VN').format(numericValue);
  }

  /**
   * Parse boolean từ Excel
   * @param {string|boolean} value - Giá trị boolean
   * @returns {boolean} - Boolean value
   */
  parseBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      return ['true', '1', 'yes', 'có', 'TRUE', 'YES'].includes(lowerValue);
    }
    return Boolean(value);
  }

  /**
   * Lấy hình ảnh mặc định cho sản phẩm theo danh mục
   * @param {string} category - Tên danh mục
   * @returns {string} - URL hình ảnh mặc định
   */
  getDefaultProductImage(category) {
    const defaultImages = {
      'Thuốc kháng sinh': 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=400&fit=crop',
      'Vitamin & khoáng chất': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
      'Thức ăn bổ sung': 'https://images.unsplash.com/photo-1585435557343-3b092031d4cc?w=400&h=400&fit=crop',
      'Thảo dược': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
      'Bộ sản phẩm': 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb55bb?w=400&h=400&fit=crop'
    };

    return defaultImages[category] || 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=400&fit=crop';
  }

  /**
   * Lấy danh mục mặc định nếu sheet Categories không có
   * @returns {Array} - Mảng danh mục mặc định
   */
  getDefaultCategories() {
    return [
      { id: 1, name: 'Thuốc kháng sinh', icon: 'fas fa-pills', is_active: true },
      { id: 2, name: 'Vitamin & khoáng chất', icon: 'fas fa-prescription-bottle', is_active: true },
      { id: 3, name: 'Thức ăn bổ sung', icon: 'fas fa-leaf', is_active: true },
      { id: 4, name: 'Thảo dược', icon: 'fas fa-seedling', is_active: true },
      { id: 5, name: 'Bộ sản phẩm', icon: 'fas fa-box-open', is_active: true }
    ];
  }

  /**
   * Parse metadata từ workbook
   * @param {Object} workbook - XLSX workbook object
   * @returns {Object} - Metadata object
   */
  parseMetadata(workbook) {
    return {
      sheets: Object.keys(workbook.Sheets),
      lastModified: new Date(),
      version: '1.0',
      source: 'HALIFE Excel Catalog'
    };
  }

  /**
   * Lấy sản phẩm theo danh mục
   * @param {string} category - Tên danh mục
   * @returns {Array} - Mảng sản phẩm
   */
  getProductsByCategory(category) {
    if (category === 'Tất cả') {
      return this.products.filter(product => product.inStock);
    }
    return this.products.filter(product => 
      product.category === category && product.inStock
    );
  }

  /**
   * Tìm kiếm sản phẩm
   * @param {string} query - Từ khóa tìm kiếm
   * @returns {Array} - Mảng sản phẩm kết quả
   */
  searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product => 
      product.inStock && (
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      )
    );
  }

  /**
   * Lấy sản phẩm nổi bật
   * @returns {Array} - Mảng sản phẩm nổi bật
   */
  getFeaturedProducts() {
    return this.products.filter(product => 
      product.isFeatured && product.inStock
    );
  }

  /**
   * Lấy sản phẩm theo ID
   * @param {number} id - ID sản phẩm
   * @returns {Object|null} - Sản phẩm hoặc null
   */
  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id)) || null;
  }

  /**
   * Lấy trạng thái
   * @returns {Object} - Object chứa trạng thái
   */
  getStatus() {
    return {
      isLoaded: this.isLoaded,
      error: this.error,
      lastUpdated: this.lastUpdated,
      productCount: this.products.length,
      categoryCount: this.categories.length
    };
  }
}

// Export singleton instance
const excelReader = new ExcelReader();
export default excelReader;