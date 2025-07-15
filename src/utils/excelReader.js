// src/utils/excelReader.js
import * as XLSX from 'xlsx';

class ExcelReader {
  constructor() {
    this.products = [];
    this.categories = [];
    this.lastUpdated = null;
    this.isLoaded = false;
    this.error = null;
  }

  async readExcelFile(filePath) {
    try {
      const correctPath = filePath.replace('public/', '/');
      const response = await fetch(correctPath);
      
      if (!response.ok) {
        throw new Error(`Không thể tải file: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('File Excel rỗng');
      }

      const workbook = XLSX.read(arrayBuffer, { 
        type: 'array',
        raw: false,
        cellDates: true,
        dateNF: 'yyyy-mm-dd'
      });

      const result = {
        products: this.parseProductsSheet(workbook),
        categories: this.parseCategoriesSheet(workbook)
      };

      this.products = result.products;
      this.categories = result.categories;
      this.lastUpdated = new Date();
      this.isLoaded = true;
      this.error = null;

      return result;
      
    } catch (error) {
      this.error = error.message;
      this.isLoaded = false;
      throw error;
    }
  }

  parseProductsSheet(workbook) {
    const possibleSheetNames = ['Products', 'products', 'SanPham'];
    let worksheet = null;

    for (const name of possibleSheetNames) {
      if (workbook.Sheets[name]) {
        worksheet = workbook.Sheets[name];
        break;
      }
    }
    
    if (!worksheet) {
      throw new Error('Không tìm thấy sheet Products');
    }

    const rawData = XLSX.utils.sheet_to_json(worksheet, { 
      defval: "",
      raw: false,
      dateNF: 'yyyy-mm-dd'
    });

    if (rawData.length === 0) {
      throw new Error('Sheet Products không có dữ liệu');
    }

    return rawData
      .filter(row => row.id && row.name)
      .map(row => this.formatProductData(row))
      .filter(product => product.status === 'active');
  }

  parseCategoriesSheet(workbook) {
    const possibleSheetNames = ['Categories', 'categories', 'DanhMuc'];
    let worksheet = null;

    for (const name of possibleSheetNames) {
      if (workbook.Sheets[name]) {
        worksheet = workbook.Sheets[name];
        break;
      }
    }
    
    if (!worksheet) {
      return this.getDefaultCategories();
    }

    const rawData = XLSX.utils.sheet_to_json(worksheet, { 
      defval: "",
      raw: false
    });

    if (rawData.length === 0) {
      return this.getDefaultCategories();
    }

    return rawData
      .filter(row => row.id && row.name)
      .map(row => this.formatCategoryData(row))
      .filter(category => category.is_active);
  }

  formatProductData(row) {
    return {
      id: parseInt(row.id) || 0,
      name: row.name || '',
      description: row.description || '',
      category: row.category || '',
      subcategory: row.subcategory || '',
      
      price: this.formatPrice(row.price),
      originalPrice: this.formatPrice(row.original_price || row.price),
      discount: parseInt(row.discount_percent) || 0,
      
      unit: row.unit || 'chai',
      packageSize: row.package_size || '',
      targetAnimal: row.target_animal || '',
      
      fullDescription: row.full_description || row.description,
      functions: row.functions ? row.functions.split(';').map(f => f.trim()) : [],
      usageInstructions: row.usage_instructions || '',
      activeIngredients: row.active_ingredients || '',
      dosage: row.dosage || '',
      withdrawalTime: row.withdrawal_time || '',
      storageConditions: row.storage_conditions || '',
      shelfLife: row.shelf_life || '',
      
      manufacturer: row.manufacturer || 'HALIFE Việt Nhật',
      originCountry: row.origin_country || 'Việt Nam',
      registrationNumber: row.registration_number || '',
      
      isFeatured: this.parseBoolean(row.is_featured),
      inStock: this.parseBoolean(row.in_stock),
      stockQuantity: parseInt(row.stock_quantity) || 0,
      rating: parseFloat(row.rating) || 0,
      reviewCount: parseInt(row.review_count) || 0,
      
      image: row.image_url || this.getDefaultProductImage(row.category),
      images: this.parseProductImages(row.image_url, row.gallery_images, row.category),
      
      tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
      seoKeywords: row.seo_keywords ? row.seo_keywords.split(',').map(k => k.trim()) : [],
      metaDescription: row.meta_description || '',
      
      createdDate: row.created_date || new Date().toISOString().split('T')[0],
      updatedDate: row.updated_date || new Date().toISOString().split('T')[0],
      status: row.status || 'active'
    };
  }

  parseProductImages(mainImage, galleryImages, category) {
    const images = [];
    
    if (mainImage && mainImage.trim()) {
      images.push(mainImage.trim());
    }
    
    if (galleryImages && galleryImages.trim()) {
      const galleryUrls = galleryImages.split(';')
        .map(url => url.trim())
        .filter(url => url && url !== mainImage);
      images.push(...galleryUrls);
    }
    
    if (images.length === 0) {
      images.push(this.getDefaultProductImage(category));
    }
    
    return images;
  }

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

  formatPrice(value) {
    if (!value) return "0";
    
    if (typeof value === 'string' && value.includes(',')) {
      return value;
    }
    
    const numericValue = parseInt(value.toString().replace(/[^\d]/g, '')) || 0;
    return new Intl.NumberFormat('vi-VN').format(numericValue);
  }

  parseBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      return ['true', '1', 'yes', 'có'].includes(lowerValue);
    }
    return Boolean(value);
  }

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

  getDefaultCategories() {
    return [
      { id: 1, name: 'Thuốc kháng sinh', icon: 'fas fa-pills', is_active: true },
      { id: 2, name: 'Vitamin & khoáng chất', icon: 'fas fa-prescription-bottle', is_active: true },
      { id: 3, name: 'Thức ăn bổ sung', icon: 'fas fa-leaf', is_active: true },
      { id: 4, name: 'Thảo dược', icon: 'fas fa-seedling', is_active: true },
      { id: 5, name: 'Bộ sản phẩm', icon: 'fas fa-box-open', is_active: true }
    ];
  }

  getProductsByCategory(category) {
    if (category === 'Tất cả') {
      return this.products.filter(product => product.inStock);
    }
    return this.products.filter(product => 
      product.category === category && product.inStock
    );
  }

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

  getFeaturedProducts() {
    return this.products.filter(product => 
      product.isFeatured && product.inStock
    );
  }

  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id)) || null;
  }

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

const excelReader = new ExcelReader();
export default excelReader;