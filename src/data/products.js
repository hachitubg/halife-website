// src/data/products.js - Updated to use Excel data source

import excelReader from '@/utils/excelReader.js';

// Backup data (fallback khi không đọc được Excel)
const fallbackProducts = [
  {
    id: 1,
    name: 'Thuốc kháng sinh tổng hợp HALIFE-A',
    description: 'Kháng sinh phổ rộng, điều trị nhiễm khuẩn đường hô hấp và tiêu hóa cho gia súc gia cầm',
    price: '90,000',
    originalPrice: '130,000',
    discount: 31,
    category: 'Thuốc kháng sinh',
    isFeatured: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=300&h=300&fit=crop&crop=center'
  },
  {
    id: 2,
    name: 'Vitamin tổng hợp HALIFE-V cho gia cầm',
    description: 'Bổ sung vitamin và khoáng chất thiết yếu, tăng cường sức đề kháng cho gia cầm',
    price: '75,000',
    originalPrice: '95,000',
    discount: 21,
    category: 'Vitamin',
    isFeatured: true,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&crop=center'
  }
];

const fallbackCategories = [
  { name: 'Thuốc thú y', icon: 'fas fa-pills' },
  { name: 'Vitamin & khoáng chất', icon: 'fas fa-prescription-bottle' },
  { name: 'Vaccine', icon: 'fas fa-syringe' },
  { name: 'Chăm sóc sức khỏe', icon: 'fas fa-heart' },
  { name: 'Thiết bị thú y', icon: 'fas fa-microscope' },
  { name: 'Thực phẩm chức năng', icon: 'fas fa-leaf' },
  { name: 'Phụ kiện khác', icon: 'fas fa-box' }
];

// State management cho data
class ProductDataManager {
  constructor() {
    this.isLoaded = false;
    this.isLoading = false;
    this.products = [];
    this.categories = [];
    this.productCategories = [];
    this.sidebarCategories = [];
    this.error = null;
  }

  /**
   * Khởi tạo và load dữ liệu từ Excel
   * @param {string} excelPath - Đường dẫn đến file Excel
   */
  async initialize(excelPath = '/data/halife_products.xlsx') {
    if (this.isLoaded || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      console.log('🔄 Đang tải dữ liệu sản phẩm từ Excel...');
      
      // Đọc dữ liệu từ Excel
      const excelData = await excelReader.readExcelFile(excelPath);
      
      // Process dữ liệu
      this.products = excelData.products;
      this.categories = excelData.categories;
      
      // Tạo danh sách danh mục cho UI
      this.productCategories = this.generateProductCategories();
      this.sidebarCategories = this.generateSidebarCategories();
      
      this.isLoaded = true;
      this.isLoading = false;
      
      console.log('✅ Dữ liệu sản phẩm đã được tải thành công');
      console.log(`📊 ${this.products.length} sản phẩm, ${this.categories.length} danh mục`);
      
      // Dispatch event để các component biết data đã sẵn sàng
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('productsDataLoaded', {
          detail: { 
            products: this.products, 
            categories: this.categories,
            productCategories: this.productCategories,
            sidebarCategories: this.sidebarCategories
          }
        }));
      }
      
    } catch (error) {
      console.warn('⚠️ Không thể tải dữ liệu từ Excel, sử dụng dữ liệu fallback');
      console.error('Chi tiết lỗi:', error);
      
      // Sử dụng dữ liệu fallback
      this.products = this.convertFallbackProducts();
      this.categories = this.convertFallbackCategories();
      this.productCategories = this.generateFallbackProductCategories();
      this.sidebarCategories = fallbackCategories;
      
      this.error = error.message;
      this.isLoaded = true;
      this.isLoading = false;
      
      // Dispatch event với fallback data
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('productsDataLoaded', {
          detail: { 
            products: this.products, 
            categories: this.categories,
            productCategories: this.productCategories,
            sidebarCategories: this.sidebarCategories,
            usingFallback: true
          }
        }));
      }
    }
  }

  /**
   * Tạo danh sách danh mục cho ProductsView
   * @returns {Array} - Danh sách tên danh mục
   */
  generateProductCategories() {
    const uniqueCategories = [...new Set(this.products.map(p => p.category))];
    return ['Tất cả', ...uniqueCategories.sort()];
  }

  /**
   * Tạo danh sách danh mục cho sidebar
   * @returns {Array} - Danh sách danh mục với icon
   */
  generateSidebarCategories() {
    return this.categories
      .filter(cat => cat.is_active)
      .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999))
      .map(cat => ({
        name: cat.name,
        icon: cat.icon
      }));
  }

  /**
   * Convert dữ liệu fallback sang format mới
   * @returns {Array} - Dữ liệu sản phẩm fallback
   */
  convertFallbackProducts() {
    return fallbackProducts.map(product => ({
      ...product,
      originalPrice: product.originalPrice,
      isFeatured: product.isFeatured,
      inStock: product.inStock,
      images: [product.image],
      stockQuantity: 50,
      rating: 4.5,
      reviewCount: 10,
      tags: [],
      functions: [],
      status: 'active',
      fullDescription: product.description,
      usageInstructions: 'Theo hướng dẫn của bác sĩ thú y',
      targetAnimal: 'Gia súc, gia cầm',
      manufacturer: 'HALIFE Việt Nhật',
      originCountry: 'Việt Nam'
    }));
  }

  /**
   * Convert danh mục fallback
   * @returns {Array} - Dữ liệu danh mục fallback
   */
  convertFallbackCategories() {
    return fallbackCategories.map((cat, index) => ({
      id: index + 1,
      name: cat.name,
      icon: cat.icon,
      is_active: true,
      sortOrder: index + 1
    }));
  }

  /**
   * Tạo danh mục fallback cho ProductsView
   * @returns {Array} - Danh sách danh mục fallback
   */
  generateFallbackProductCategories() {
    const uniqueCategories = [...new Set(fallbackProducts.map(p => p.category))];
    return ['Tất cả', ...uniqueCategories.sort()];
  }

  /**
   * Force reload dữ liệu
   */
  async reload(excelPath) {
    this.isLoaded = false;
    this.isLoading = false;
    await this.initialize(excelPath);
  }

  // Getter methods for backward compatibility
  get allProducts() {
    return this.products.filter(p => p.inStock && p.status === 'active');
  }

  get allCategories() {
    return this.productCategories;
  }

  get sidebarItems() {
    return this.sidebarCategories;
  }

  /**
   * Lấy thống kê
   */
  getStats() {
    return {
      totalProducts: this.allProducts.length,
      totalCategories: this.categories.length,
      featuredProducts: this.allProducts.filter(p => p.isFeatured).length,
      inStockProducts: this.allProducts.filter(p => p.inStock).length,
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
      error: this.error,
      lastUpdated: this.products.length > 0 ? 
        Math.max(...this.products.map(p => new Date(p.updatedDate || p.createdDate))) : 
        null
    };
  }
}

// Tạo instance singleton
const dataManager = new ProductDataManager();

// Export reactive data objects để tương thích với code cũ
export const products = new Proxy([], {
  get(target, prop) {
    const allProducts = dataManager.allProducts;
    
    if (typeof prop === 'string' && !isNaN(prop)) {
      return allProducts[parseInt(prop)];
    }
    if (prop === 'length') {
      return allProducts.length;
    }
    if (prop === 'filter') {
      return allProducts.filter.bind(allProducts);
    }
    if (prop === 'map') {
      return allProducts.map.bind(allProducts);
    }
    if (prop === 'find') {
      return allProducts.find.bind(allProducts);
    }
    if (prop === 'slice') {
      return allProducts.slice.bind(allProducts);
    }
    if (prop === 'forEach') {
      return allProducts.forEach.bind(allProducts);
    }
    if (prop === Symbol.iterator) {
      return allProducts[Symbol.iterator].bind(allProducts);
    }
    return allProducts[prop];
  }
});

export const productCategories = new Proxy([], {
  get(target, prop) {
    const allCategories = dataManager.allCategories;
    
    if (typeof prop === 'string' && !isNaN(prop)) {
      return allCategories[parseInt(prop)];
    }
    if (prop === 'length') {
      return allCategories.length;
    }
    if (prop === 'includes') {
      return allCategories.includes.bind(allCategories);
    }
    if (prop === 'filter') {
      return allCategories.filter.bind(allCategories);
    }
    return allCategories[prop];
  }
});

export const sidebarCategories = new Proxy([], {
  get(target, prop) {
    const sidebarItems = dataManager.sidebarItems;
    
    if (typeof prop === 'string' && !isNaN(prop)) {
      return sidebarItems[parseInt(prop)];
    }
    if (prop === 'length') {
      return sidebarItems.length;
    }
    if (prop === 'map') {
      return sidebarItems.map.bind(sidebarItems);
    }
    if (prop === 'filter') {
      return sidebarItems.filter.bind(sidebarItems);
    }
    return sidebarItems[prop];
  }
});

// Helper functions
export const getFeaturedProducts = () => {
  return dataManager.allProducts.filter(product => product.isFeatured);
};

export const getProductsByCategory = (category) => {
  if (category === 'Tất cả') {
    return dataManager.allProducts;
  }
  return dataManager.allProducts.filter(product => product.category === category);
};

export const getProductById = (id) => {
  return dataManager.allProducts.find(product => product.id === parseInt(id));
};

export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  return dataManager.allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
  );
};

// API để quản lý dữ liệu
export const dataAPI = {
  /**
   * Khởi tạo dữ liệu (gọi trong main.js hoặc App.vue)
   */
  async initialize(excelPath) {
    await dataManager.initialize(excelPath);
  },

  /**
   * Lấy trạng thái loading
   */
  get isLoading() {
    return dataManager.isLoading;
  },

  /**
   * Lấy thông tin lỗi
   */
  get error() {
    return dataManager.error;
  },

  /**
   * Kiểm tra dữ liệu đã được load chưa
   */
  get isLoaded() {
    return dataManager.isLoaded;
  },

  /**
   * Force reload dữ liệu
   */
  async reload(excelPath) {
    await dataManager.reload(excelPath);
  },

  /**
   * Lấy thống kê
   */
  getStats() {
    return dataManager.getStats();
  },

  /**
   * Listen for data changes
   */
  onDataLoaded(callback) {
    if (typeof window !== 'undefined') {
      window.addEventListener('productsDataLoaded', callback);
    }
  },

  /**
   * Remove data change listener
   */
  offDataLoaded(callback) {
    if (typeof window !== 'undefined') {
      window.removeEventListener('productsDataLoaded', callback);
    }
  }
};

// Export data manager instance cho advanced usage
export { dataManager };

// Auto-initialize khi module được import (nếu đang ở browser)
if (typeof window !== 'undefined') {
  // Defer initialization để không block app startup
  setTimeout(() => {
    dataAPI.initialize().catch(err => {
      console.warn('Lỗi khởi tạo dữ liệu sản phẩm:', err.message);
    });
  }, 100);
}