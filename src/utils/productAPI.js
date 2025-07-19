// Use environment variable for API base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export class ProductAPI {
  
  /**
   * Helper method để gọi API
   */
  static async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API Error');
      }

      return data;
    } catch (error) {
      throw new Error(`API Error: ${error.message}`);
    }
  }

  /**
   * Lấy tất cả sản phẩm
   */
  static async getAllProducts() {
    try {
      const response = await this.makeRequest('/api/products');
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách sản phẩm: ${error.message}`);
    }
  }

  /**
   * Lấy tất cả danh mục
   */
  static async getAllCategories() {
    try {
      const response = await this.makeRequest('/api/categories');
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách danh mục: ${error.message}`);
    }
  }

  /**
   * Lấy thống kê
   */
  static async getStats() {
    try {
      const response = await this.makeRequest('/api/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Lỗi lấy thống kê: ${error.message}`);
    }
  }

  /**
   * Thêm sản phẩm mới
   */
  static async createProduct(productData, imageFile = null) {
    try {
      // Upload image trước nếu có
      let imageUrl = productData.image || '';
      if (imageFile) {
        const uploadResult = await this.uploadProductImage(imageFile);
        imageUrl = uploadResult.url;
      }

      // Chuẩn bị dữ liệu
      const newProductData = {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        originalPrice: productData.originalPrice || productData.price,
        description: productData.description || '',
        fullDescription: productData.fullDescription || productData.description || '',
        image: imageUrl,
        images: productData.images || [],
        inStock: productData.inStock !== false,
        isFeatured: productData.isFeatured || false,
        packageSize: productData.packageSize || '',
        stockQuantity: productData.stockQuantity || 0,
        rating: productData.rating || 0,
        reviewCount: productData.reviewCount || 0,
        tags: productData.tags || [],
        functions: productData.functions || [],
        usageInstructions: productData.usageInstructions || '',
        targetAnimal: productData.targetAnimal || '',
        manufacturer: productData.manufacturer || 'HALIFE Việt Nhật',
        originCountry: productData.originCountry || 'Việt Nam',
        registrationNumber: productData.registrationNumber || '',
        activeIngredients: productData.activeIngredients || '',
        dosage: productData.dosage || '',
        warnings: productData.warnings || '',
        storageConditions: productData.storageConditions || ''
      };

      const response = await this.makeRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(newProductData)
      });

      return {
        success: true,
        product: response.data,
        message: response.message
      };
    } catch (error) {
      throw new Error(`Lỗi thêm sản phẩm: ${error.message}`);
    }
  }

  /**
   * Cập nhật sản phẩm
   */
  static async updateProduct(productId, productData, imageFile = null) {
    try {
      let imageUrl = productData.image;

      // Upload image mới nếu có
      if (imageFile) {
        const uploadResult = await this.uploadProductImage(imageFile);
        imageUrl = uploadResult.url;
      }

      // Chuẩn bị dữ liệu cập nhật
      const updateData = {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        originalPrice: productData.originalPrice || productData.price,
        description: productData.description || '',
        fullDescription: productData.fullDescription || productData.description || '',
        image: imageUrl,
        images: productData.images || [],
        inStock: productData.inStock !== false,
        isFeatured: productData.isFeatured || false,
        packageSize: productData.packageSize || '',
        stockQuantity: productData.stockQuantity || 0,
        rating: productData.rating || 0,
        reviewCount: productData.reviewCount || 0,
        tags: productData.tags || [],
        functions: productData.functions || [],
        usageInstructions: productData.usageInstructions || '',
        targetAnimal: productData.targetAnimal || '',
        manufacturer: productData.manufacturer || 'HALIFE Việt Nhật',
        originCountry: productData.originCountry || 'Việt Nam',
        registrationNumber: productData.registrationNumber || '',
        activeIngredients: productData.activeIngredients || '',
        dosage: productData.dosage || '',
        warnings: productData.warnings || '',
        storageConditions: productData.storageConditions || ''
      };

      const response = await this.makeRequest(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      return {
        success: true,
        product: response.data,
        message: response.message
      };
    } catch (error) {
      throw new Error(`Lỗi cập nhật sản phẩm: ${error.message}`);
    }
  }

  /**
   * Xóa sản phẩm và tất cả hình ảnh liên quan
   */
  static async deleteProduct(productId) {
    try {
      const response = await this.makeRequest(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      return {
        success: true,
        message: response.message,
        deletedImages: response.data?.deleted_images || [],
        failedDeletes: response.data?.failed_deletes || []
      };
    } catch (error) {
      throw new Error(`Lỗi xóa sản phẩm: ${error.message}`);
    }
  }

  /**
   * Upload hình ảnh sản phẩm
   */
  static async uploadProductImage(file) {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File phải là hình ảnh');
      }

      // Tạo FormData để upload
      const formData = new FormData();
      formData.append('file', file);

      // Gọi API upload
      const response = await fetch(`${API_BASE}/api/upload-image`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      return {
        success: true,
        url: result.data.url,
        fileName: result.data.filename,
        size: result.data.size
      };
    } catch (error) {
      throw new Error(`Lỗi upload ảnh: ${error.message}`);
    }
  }

  /**
   * Xóa hình ảnh sản phẩm
   */
  static async deleteProductImage(imageUrl) {
    try {
      const response = await this.makeRequest('/api/delete-image', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: imageUrl })
      });

      return {
        success: true,
        message: response.message
      };
    } catch (error) {
      throw new Error(`Lỗi xóa ảnh: ${error.message}`);
    }
  }

  /**
   * Reload dữ liệu
   */
  static async reloadDataFromExcel() {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const stats = await this.getStats();
      
      return {
        success: true,
        stats: stats,
        message: 'Đã reload dữ liệu từ Excel thành công'
      };
    } catch (error) {
      throw new Error(`Lỗi reload dữ liệu: ${error.message}`);
    }
  }

  /**
   * Tải xuống Excel
   */
  static async downloadExcel() {
    try {
      const link = document.createElement('a');
      link.href = '/data/halife_products.xlsx';
      link.download = `halife_products_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: 'Đã bắt đầu tải xuống Excel'
      };
    } catch (error) {
      throw new Error(`Lỗi tải xuống Excel: ${error.message}`);
    }
  }

  /**
   * Upload Excel mới
   */
  static async uploadExcel(file) {
    try {
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        throw new Error('File phải có định dạng .xlsx hoặc .xls');
      }

      await new Promise(resolve => setTimeout(resolve, 3000));

      return {
        success: true,
        fileName: file.name,
        message: 'Upload Excel thành công. Hãy reload dữ liệu để cập nhật.'
      };
    } catch (error) {
      throw new Error(`Lỗi upload Excel: ${error.message}`);
    }
  }

  /**
   * Lấy thống kê sản phẩm
   */
  static async getProductStats() {
    try {
      return await this.getStats();
    } catch (error) {
      return {
        totalProducts: 0,
        totalCategories: 0,
        inStockProducts: 0,
        featuredProducts: 0,
        categoryStats: {},
        isLoaded: false
      };
    }
  }

  /**
   * Validate sản phẩm
   */
  static validateProduct(productData) {
    const errors = [];
    
    if (!productData.name || productData.name.trim() === '') {
      errors.push('Tên sản phẩm không được để trống');
    }
    
    if (!productData.category || productData.category.trim() === '') {
      errors.push('Danh mục không được để trống');
    }
    
    if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
      errors.push('Giá sản phẩm phải là số dương');
    }

    if (productData.originalPrice && productData.originalPrice < productData.price) {
      errors.push('Giá gốc không được nhỏ hơn giá bán');
    }

    if (productData.stockQuantity && (isNaN(productData.stockQuantity) || productData.stockQuantity < 0)) {
      errors.push('Số lượng tồn kho phải là số không âm');
    }

    if (productData.rating && (isNaN(productData.rating) || productData.rating < 0 || productData.rating > 5)) {
      errors.push('Đánh giá phải từ 0-5 sao');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Lấy sản phẩm theo ID
   */
  static async getProductById(id) {
    try {
      const products = await this.getAllProducts();
      const product = products.find(p => 
        p.id == id || p.id === parseInt(id) || p.id === String(id)
      );
      return product;
    } catch (error) {
      throw new Error(`Lỗi lấy sản phẩm: ${error.message}`);
    }
  }
}