// src/utils/tamvetProductAPI.js
// API Helper cho quản lý sản phẩm Tâm Vet
// Sử dụng backend API để lưu dữ liệu vào Excel

import * as XLSX from 'xlsx';

// API Base URL - tự động detect từ environment
const API_BASE_URL = (() => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Nếu localhost hoặc 127.0.0.1, dùng port 8000 (Flask API - hoặc 5000)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Thử port 8000 trước (mặc định), nếu không có thì 5000
      return `${protocol}//${hostname}:8000`;
    }
    
    // Production: dùng cùng domain
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }
  return '';
})();

class TamvetProductAPI {
  constructor() {
    this.products = [];
    this.categories = [];
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Lấy tất cả sản phẩm từ backend API
   */
  async getAllProducts() {
    try {
      // Nếu không có API URL, cố gắng lấy từ file Excel local
      if (!this.baseUrl) {
        return await this.getAllProductsFromLocalExcel();
      }

      const response = await fetch(`${this.baseUrl}/api/tamvet-products`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Fallback to local Excel if API fails
        console.warn(`API unavailable (${response.status}). Trying local Excel...`);
        return await this.getAllProductsFromLocalExcel();
      }
      
      const data = await response.json();
      this.products = Array.isArray(data) ? data : (data.products || []);
      return this.products;
    } catch (error) {
      console.warn('API error, falling back to local Excel:', error);
      return await this.getAllProductsFromLocalExcel();
    }
  }

  /**
   * Lấy sản phẩm từ file Excel local (fallback)
   */
  async getAllProductsFromLocalExcel() {
    try {
      const response = await fetch('/data/tamvet_product.xlsx');
      if (!response.ok) {
        console.warn('File Excel không tồn tại. Trả về dữ liệu rỗng.');
        this.products = [];
        return this.products;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('File Excel rỗng');
      }

      let workbook;
      try {
        workbook = XLSX.read(arrayBuffer, { type: 'array' });
      } catch (parseError) {
        console.error('Lỗi đọc file Excel:', parseError);
        throw new Error('File Excel không hợp lệ');
      }
      
      // Tìm sheet Products
      const sheetNames = ['Products', 'products', 'SanPham', 'Tamvet'];
      let worksheet = null;
      
      for (const name of sheetNames) {
        if (workbook.Sheets[name]) {
          worksheet = workbook.Sheets[name];
          break;
        }
      }
      
      if (!worksheet) {
        console.warn(`Không tìm thấy sheet Products`);
        this.products = [];
        return this.products;
      }
      
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: '', blankrows: false });
      
      if (!data || data.length === 0) {
        this.products = [];
        return this.products;
      }

      this.products = data
        .filter(row => row.id && row.name)
        .map(row => this.formatProduct(row));
      
      return this.products;
    } catch (error) {
      console.error('Error loading from local Excel:', error);
      return [];
    }
  }

  /**
   * Lấy tất cả danh mục từ backend hoặc local
   */
  async getAllCategories() {
    try {
      // Nếu không có API URL, tính từ sản phẩm
      if (!this.baseUrl) {
        return this.extractCategoriesFromProducts();
      }

      const response = await fetch(`${this.baseUrl}/api/tamvet-categories`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Fallback: extract từ sản phẩm
        return this.extractCategoriesFromProducts();
      }
      
      const data = await response.json();
      this.categories = Array.isArray(data) ? data : (data.categories || []);
      return this.categories;
    } catch (error) {
      console.warn('Error loading categories from API:', error);
      return this.extractCategoriesFromProducts();
    }
  }

  /**
   * Tính danh mục từ sản phẩm hoặc trả về danh mục mặc định
   */
  extractCategoriesFromProducts() {
    const defaultCategories = this.getDefaultCategories();
    
    // Nếu không có sản phẩm, trả về danh mục mặc định
    if (!this.products || this.products.length === 0) {
      this.categories = defaultCategories;
      return this.categories;
    }
    
    // Tính danh mục từ sản phẩm
    const uniqueCategories = new Set(this.products.map(p => p.category));
    
    // Kết hợp với danh mục mặc định nếu có
    const categoryMap = new Map();
    
    // Thêm danh mục mặc định trước
    defaultCategories.forEach(cat => {
      categoryMap.set(cat.name, cat);
    });
    
    // Thêm danh mục từ sản phẩm
    Array.from(uniqueCategories).forEach((name, id) => {
      if (!categoryMap.has(name)) {
        categoryMap.set(name, { id: defaultCategories.length + id + 1, name });
      }
    });
    
    this.categories = Array.from(categoryMap.values());
    return this.categories;
  }

  /**
   * Lấy thống kê sản phẩm
   */
  async getProductStats() {
    const stats = {
      totalProducts: this.products.length,
      totalCategories: this.categories.length,
      inStockProducts: this.products.filter(p => p.inStock).length,
      featuredProducts: this.products.filter(p => p.isFeatured).length
    };
    return stats;
  }

  /**
   * Format dữ liệu sản phẩm từ Excel
   */
  formatProduct(row) {
    return {
      id: String(row.id || '').trim(),
      name: String(row.name || '').trim(),
      category: String(row.category || 'Khác').trim(),
      price: parseInt(row.price) || 0,
      originalPrice: parseInt(row.originalPrice) || parseInt(row.price) || 0,
      description: String(row.description || '').trim(),
      fullDescription: String(row.fullDescription || row.description || '').trim(),
      image: String(row.image || '').trim(),
      images: row.images ? String(row.images).split(';').filter(i => i.trim()) : [],
      inStock: String(row.inStock || 'true').toLowerCase() !== 'false',
      isFeatured: String(row.featured || 'false').toLowerCase() === 'true',
      packageSize: String(row.packageSize || '').trim(),
      stockQuantity: parseInt(row.stockQuantity) || 0,
      targetAnimal: String(row.targetAnimal || '').trim(),
      manufacturer: String(row.manufacturer || 'Tâm Vet').trim(),
      originCountry: String(row.originCountry || 'Việt Nam').trim(),
      registrationNumber: String(row.registrationNumber || '').trim(),
      activeIngredients: String(row.activeIngredients || '').trim(),
      dosage: String(row.dosage || '').trim(),
      usageInstructions: String(row.usageInstructions || '').trim(),
      warnings: String(row.warnings || '').trim(),
      storageConditions: String(row.storageConditions || '').trim(),
      rating: parseFloat(row.rating) || 0,
      reviewCount: parseInt(row.reviewCount) || 0,
      tags: row.tags ? String(row.tags).split(';').map(t => t.trim()).filter(t => t) : [],
      functions: row.functions ? String(row.functions).split(';').map(f => f.trim()).filter(f => f) : []
    };
  }

  /**
   * Danh mục mặc định
   */
  getDefaultCategories() {
    return [
      { id: 1, name: 'Thuốc Thú Cưng' },
      { id: 2, name: 'Thuốc Gia Súc' },
      { id: 3, name: 'Chế Phẩm Sinh Học' },
      { id: 4, name: 'Vitamin & Thực Phẩm Chức Năng' },
      { id: 5, name: 'Thiết Bị Y Tế' }
    ];
  }

  /**
   * Validate sản phẩm
   */
  validateProduct(product) {
    const errors = [];
    
    if (!product.name || product.name.trim() === '') {
      errors.push('Tên sản phẩm không được để trống');
    }
    
    if (!product.category || product.category === '') {
      errors.push('Danh mục không được để trống');
    }
    
    if (!product.price || parseInt(product.price) < 0) {
      errors.push('Giá bán phải là số dương');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Tải lại dữ liệu từ Excel
   */
  async reloadDataFromExcel() {
    try {
      this.products = [];
      this.categories = [];
      await this.getAllProducts();
      await this.getAllCategories();
      return { message: 'Đã reload dữ liệu thành công' };
    } catch (error) {
      console.error('Error reloading data:', error);
      throw error;
    }
  }

  /**
   * Tạo sản phẩm mới
   */
  async createProduct(productData, imageFile) {
    try {
      if (!this.baseUrl) {
        throw new Error('API Server không khả dụng. Vui lòng khởi động backend API.');
      }

      const formData = new FormData();
      
      // Thêm dữ liệu sản phẩm
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          if (Array.isArray(productData[key])) {
            formData.append(key, JSON.stringify(productData[key]));
          } else {
            formData.append(key, productData[key]);
          }
        }
      });
      
      // Thêm file ảnh nếu có
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`${this.baseUrl}/api/tamvet-products`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Lỗi tạo sản phẩm`);
      }

      const result = await response.json();
      await this.getAllProducts(); // Reload dữ liệu
      
      return {
        message: result.message || 'Thêm sản phẩm thành công',
        product: result.product
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  async updateProduct(productId, productData, imageFile, oldImagePath = null) {
    try {
      if (!this.baseUrl) {
        throw new Error('API Server không khả dụng. Vui lòng khởi động backend API.');
      }

      const formData = new FormData();
      
      // Thêm dữ liệu sản phẩm
      Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
          if (Array.isArray(productData[key])) {
            formData.append(key, JSON.stringify(productData[key]));
          } else {
            formData.append(key, productData[key]);
          }
        }
      });
      
      // Thêm file ảnh mới nếu có
      if (imageFile) {
        formData.append('image', imageFile);
        // Nếu có hình ảnh cũ, gửi đường dẫn để backend xóa
        if (oldImagePath) {
          formData.append('oldImagePath', oldImagePath);
        }
      }

      const response = await fetch(`${this.baseUrl}/api/tamvet-products/${productId}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Lỗi cập nhật sản phẩm`);
      }

      const result = await response.json();
      await this.getAllProducts(); // Reload dữ liệu
      
      return {
        message: result.message || 'Cập nhật sản phẩm thành công',
        product: result.product
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Xóa sản phẩm
   */
  async deleteProduct(productId) {
    try {
      if (!this.baseUrl) {
        throw new Error('API Server không khả dụng. Vui lòng khởi động backend API.');
      }

      const response = await fetch(`${this.baseUrl}/api/tamvet-products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Lỗi xóa sản phẩm`);
      }

      const result = await response.json();
      await this.getAllProducts(); // Reload dữ liệu
      
      return {
        message: result.message || 'Xóa sản phẩm thành công',
        deletedImages: result.deletedImages || [],
        failedDeletes: result.failedDeletes || []
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Upload hình ảnh
   */
  async uploadProductImage(imageFile) {
    // Tạo URL hình ảnh base64 cho demo
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          url: e.target.result,
          filename: imageFile.name
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }

  /**
   * Upload Excel file
   */
  async uploadExcel(file) {
    try {
      if (!this.baseUrl) {
        throw new Error('API Server không khả dụng. Vui lòng khởi động backend API.');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/api/tamvet-products/upload-excel`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Lỗi upload Excel`);
      }

      const result = await response.json();
      await this.getAllProducts(); // Reload dữ liệu
      await this.getAllCategories();
      
      return {
        message: result.message || 'Đã upload file Excel thành công'
      };
    } catch (error) {
      console.error('Error uploading Excel:', error);
      throw error;
    }
  }

  /**
   * Download Excel file
   */
  async downloadExcel() {
    try {
      if (!this.baseUrl) {
        // Fallback: tạo file từ dữ liệu local
        const ws = XLSX.utils.json_to_sheet(this.products);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Products');
        XLSX.writeFile(wb, 'tamvet_products.xlsx');
        
        return {
          message: 'Đã tải xuống file Excel thành công'
        };
      }

      const response = await fetch(`${this.baseUrl}/api/tamvet-products/download-excel`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Lỗi tải xuống Excel`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tamvet_products.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return {
        message: 'Đã tải xuống file Excel thành công'
      };
    } catch (error) {
      console.error('Error downloading Excel:', error);
      throw error;
    }
  }
}

export default new TamvetProductAPI();
