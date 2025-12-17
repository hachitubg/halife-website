// src/utils/tamvetProductAPI.js
// API Helper cho quản lý sản phẩm Tâm Vet
// Sử dụng file Excel: /public/data/tamvet_product.xlsx

import * as XLSX from 'xlsx';

class TamvetProductAPI {
  constructor() {
    this.excelFile = '/data/tamvet_product.xlsx';
    this.products = [];
    this.categories = [];
  }

  /**
   * Lấy tất cả sản phẩm từ Excel
   */
  async getAllProducts() {
    try {
      const response = await fetch(this.excelFile);
      if (!response.ok) {
        // Nếu file không tồn tại, trả về mảng rỗng
        console.warn(`File ${this.excelFile} không tồn tại. Trả về dữ liệu rỗng.`);
        this.products = [];
        return this.products;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Kiểm tra xem có dữ liệu không
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('File Excel rỗng');
      }

      let workbook;
      try {
        workbook = XLSX.read(arrayBuffer, { type: 'array' });
      } catch (parseError) {
        console.error('Lỗi đọc file Excel:', parseError);
        throw new Error('File Excel không hợp lệ. Vui lòng tải lên file Excel đúng định dạng (.xlsx)');
      }
      
      // Tìm sheet Products
      const sheetNames = ['Products', 'products', 'SanPham'];
      let worksheet = null;
      
      for (const name of sheetNames) {
        if (workbook.Sheets[name]) {
          worksheet = workbook.Sheets[name];
          break;
        }
      }
      
      if (!worksheet) {
        console.warn(`Không tìm thấy sheet Products. Sheet có sẵn: ${Object.keys(workbook.Sheets).join(', ')}`);
        throw new Error('Không tìm thấy sheet "Products" trong file Excel. Tên sheet phải là: Products, products, hoặc SanPham');
      }
      
      const data = XLSX.utils.sheet_to_json(worksheet, { defval: '', blankrows: false });
      
      // Kiểm tra xem có dữ liệu không
      if (!data || data.length === 0) {
        console.warn('Sheet Products rỗng');
        this.products = [];
        return this.products;
      }

      // Format dữ liệu
      this.products = data
        .filter(row => row.id && row.name)
        .map(row => this.formatProduct(row));
      
      return this.products;
    } catch (error) {
      console.error('Error loading Tamvet products:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả danh mục từ Excel
   */
  async getAllCategories() {
    try {
      const response = await fetch(this.excelFile);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Tìm sheet Categories
      const sheetNames = ['Categories', 'categories', 'DanhMuc'];
      let worksheet = null;
      
      for (const name of sheetNames) {
        if (workbook.Sheets[name]) {
          worksheet = workbook.Sheets[name];
          break;
        }
      }
      
      if (!worksheet) {
        // Nếu không có sheet Categories, trích xuất từ sản phẩm
        const uniqueCategories = new Set(this.products.map(p => p.category));
        this.categories = Array.from(uniqueCategories).map((name, id) => ({
          id: id + 1,
          name
        }));
      } else {
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        this.categories = data.filter(row => row.id && row.name);
      }
      
      return this.categories;
    } catch (error) {
      console.error('Error loading Tamvet categories:', error);
      return this.getDefaultCategories();
    }
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
    this.products = [];
    this.categories = [];
    await this.getAllProducts();
    await this.getAllCategories();
    return { message: 'Đã reload dữ liệu thành công' };
  }

  /**
   * Tạo sản phẩm mới
   */
  async createProduct(productData, imageFile) {
    // Trong môi trường không có backend, thêm vào danh sách local
    const newProduct = {
      id: `TAMVET-${Date.now()}`,
      ...productData,
      createdAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    return {
      message: 'Thêm sản phẩm thành công',
      product: newProduct
    };
  }

  /**
   * Cập nhật sản phẩm
   */
  async updateProduct(productId, productData, imageFile) {
    const index = this.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...productData,
        updatedAt: new Date().toISOString()
      };
    }
    
    return {
      message: 'Cập nhật sản phẩm thành công',
      product: this.products[index]
    };
  }

  /**
   * Xóa sản phẩm
   */
  async deleteProduct(productId) {
    const index = this.products.findIndex(p => p.id === productId);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
    
    return {
      message: 'Xóa sản phẩm thành công',
      deletedImages: [],
      failedDeletes: []
    };
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
   * Upload Excel
   */
  async uploadExcel(file) {
    // Xử lý upload file Excel
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    await this.getAllProducts();
    await this.getAllCategories();
    
    return {
      message: `Đã upload file Excel thành công. Tải ${this.products.length} sản phẩm`
    };
  }

  /**
   * Tải xuống Excel
   */
  async downloadExcel() {
    const ws = XLSX.utils.json_to_sheet(this.products);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    
    XLSX.writeFile(wb, 'tamvet_products.xlsx');
    
    return {
      message: 'Đã tải xuống file Excel thành công'
    };
  }
}

export default new TamvetProductAPI();
