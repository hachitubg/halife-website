// src/data/products.js
import excelReader from '@/utils/excelReader.js';

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

  async initialize(excelPath = '/data/halife_products.xlsx') {
    if (this.isLoaded || this.isLoading) return;

    this.isLoading = true;
    this.error = null;

    try {
      const excelData = await excelReader.readExcelFile(excelPath);
      
      this.products = excelData.products;
      this.categories = excelData.categories;
      this.productCategories = this.generateProductCategories();
      this.sidebarCategories = this.generateSidebarCategories();
      
      this.isLoaded = true;
      this.isLoading = false;
      
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
      this.products = this.convertFallbackProducts();
      this.categories = this.convertFallbackCategories();
      this.productCategories = this.generateFallbackProductCategories();
      this.sidebarCategories = fallbackCategories;
      
      this.error = error.message;
      this.isLoaded = true;
      this.isLoading = false;
      
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

  generateProductCategories() {
    const uniqueCategories = [...new Set(this.products.map(p => p.category))];
    return ['Tất cả', ...uniqueCategories.sort()];
  }

  generateSidebarCategories() {
    return this.categories
      .filter(cat => cat.is_active)
      .sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999))
      .map(cat => ({
        name: cat.name,
        icon: cat.icon
      }));
  }

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

  convertFallbackCategories() {
    return fallbackCategories.map((cat, index) => ({
      id: index + 1,
      name: cat.name,
      icon: cat.icon,
      is_active: true,
      sortOrder: index + 1
    }));
  }

  generateFallbackProductCategories() {
    const uniqueCategories = [...new Set(fallbackProducts.map(p => p.category))];
    return ['Tất cả', ...uniqueCategories.sort()];
  }

  async reload(excelPath) {
    this.isLoaded = false;
    this.isLoading = false;
    await this.initialize(excelPath);
  }

  get allProducts() {
    return this.products.filter(p => p.inStock && p.status === 'active');
  }

  get allCategories() {
    return this.productCategories;
  }

  get sidebarItems() {
    return this.sidebarCategories;
  }

  getStats() {
    return {
      totalProducts: this.allProducts.length,
      totalCategories: this.categories.length,
      featuredProducts: this.allProducts.filter(p => p.isFeatured).length,
      inStockProducts: this.allProducts.filter(p => p.inStock).length,
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
      error: this.error
    };
  }
}

const dataManager = new ProductDataManager();

// Proxy exports
export const products = new Proxy([], {
  get(target, prop) {
    const allProducts = dataManager.allProducts;
    
    if (typeof prop === 'string' && !isNaN(prop)) {
      return allProducts[parseInt(prop)];
    }
    if (prop === 'length') return allProducts.length;
    if (typeof allProducts[prop] === 'function') {
      return allProducts[prop].bind(allProducts);
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
    if (prop === 'length') return allCategories.length;
    if (typeof allCategories[prop] === 'function') {
      return allCategories[prop].bind(allCategories);
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
    if (prop === 'length') return sidebarItems.length;
    if (typeof sidebarItems[prop] === 'function') {
      return sidebarItems[prop].bind(sidebarItems);
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

// Data API
export const dataAPI = {
  async initialize(excelPath) {
    await dataManager.initialize(excelPath);
  },

  getAllProducts() {
    return dataManager.products;
  },

  getAllCategories() {
    return dataManager.categories;
  },

  getProductById(id) {
    return dataManager.products.find(p => p.id === parseInt(id));
  },

  addProduct(productData) {
    const newProduct = {
      ...productData,
      id: Math.max(...dataManager.products.map(p => p.id || 0), 0) + 1,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      status: 'active'
    };
    dataManager.products.push(newProduct);
    return newProduct;
  },

  updateProduct(id, productData) {
    const index = dataManager.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;

    dataManager.products[index] = {
      ...dataManager.products[index],
      ...productData,
      id: parseInt(id),
      updatedDate: new Date().toISOString()
    };
    return dataManager.products[index];
  },

  deleteProduct(id) {
    const index = dataManager.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;

    const deletedProduct = dataManager.products[index];
    dataManager.products.splice(index, 1);
    return deletedProduct;
  },

  get isLoading() {
    return dataManager.isLoading;
  },

  get error() {
    return dataManager.error;
  },

  get isLoaded() {
    return dataManager.isLoaded;
  },

  async reload(excelPath) {
    await dataManager.reload(excelPath);
  },

  getStats() {
    return dataManager.getStats();
  },

  onDataLoaded(callback) {
    if (typeof window !== 'undefined') {
      window.addEventListener('productsDataLoaded', callback);
    }
  },

  offDataLoaded(callback) {
    if (typeof window !== 'undefined') {
      window.removeEventListener('productsDataLoaded', callback);
    }
  }
};

export { dataManager };