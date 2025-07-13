// src/utils/productManagerAPI.js
// API utilities cho Product Manager với CRUD operations

import { dataAPI } from '@/data/products.js'

export class ProductManagerAPI {
  
  /**
   * Lấy tất cả sản phẩm từ Excel
   */
  static async getAllProducts() {
    try {
      return dataAPI.getAllProducts();
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách sản phẩm: ${error.message}`);
    }
  }

  /**
   * Lấy tất cả danh mục
   */
  static async getAllCategories() {
    try {
      return dataAPI.getAllCategories();
    } catch (error) {
      throw new Error(`Lỗi lấy danh sách danh mục: ${error.message}`);
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

      // Chuẩn bị dữ liệu sản phẩm đầy đủ
      const newProductData = {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        originalPrice: productData.originalPrice || productData.price,
        description: productData.description || '',
        fullDescription: productData.fullDescription || productData.description || '',
        image: imageUrl,
        images: imageUrl ? [imageUrl] : [],
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

      // Thêm vào dataAPI
      const newProduct = dataAPI.addProduct(newProductData);

      // Simulate Excel update
      await this.updateExcelWithNewProduct(newProduct);

      return {
        success: true,
        product: newProduct,
        message: `Đã thêm sản phẩm "${newProduct.name}" thành công`
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
      const currentProduct = dataAPI.getProductById(productId);
      
      if (!currentProduct) {
        throw new Error('Không tìm thấy sản phẩm');
      }

      let imageUrl = productData.image || currentProduct.image;

      // Upload image mới nếu có
      if (imageFile) {
        // Xóa ảnh cũ nếu có
        if (currentProduct.image) {
          await this.deleteProductImage(currentProduct.image);
        }
        
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
        images: imageUrl ? [imageUrl] : (currentProduct.images || []),
        inStock: productData.inStock !== false,
        isFeatured: productData.isFeatured || false,
        packageSize: productData.packageSize || '',
        stockQuantity: productData.stockQuantity || currentProduct.stockQuantity || 0,
        rating: productData.rating || currentProduct.rating || 0,
        reviewCount: productData.reviewCount || currentProduct.reviewCount || 0,
        tags: productData.tags || currentProduct.tags || [],
        functions: productData.functions || currentProduct.functions || [],
        usageInstructions: productData.usageInstructions || currentProduct.usageInstructions || '',
        targetAnimal: productData.targetAnimal || currentProduct.targetAnimal || '',
        manufacturer: productData.manufacturer || currentProduct.manufacturer || 'HALIFE Việt Nhật',
        originCountry: productData.originCountry || currentProduct.originCountry || 'Việt Nam',
        registrationNumber: productData.registrationNumber || currentProduct.registrationNumber || '',
        activeIngredients: productData.activeIngredients || currentProduct.activeIngredients || '',
        dosage: productData.dosage || currentProduct.dosage || '',
        warnings: productData.warnings || currentProduct.warnings || '',
        storageConditions: productData.storageConditions || currentProduct.storageConditions || ''
      };

      // Cập nhật trong dataAPI
      const updatedProduct = dataAPI.updateProduct(productId, updateData);

      // Simulate Excel update
      await this.updateExcelWithUpdatedProduct(updatedProduct);

      return {
        success: true,
        product: updatedProduct,
        message: `Đã cập nhật sản phẩm "${updatedProduct.name}" thành công`
      };
    } catch (error) {
      throw new Error(`Lỗi cập nhật sản phẩm: ${error.message}`);
    }
  }

  /**
   * Xóa sản phẩm
   */
  static async deleteProduct(productId) {
    try {
      const product = dataAPI.getProductById(productId);
      
      if (!product) {
        throw new Error('Không tìm thấy sản phẩm');
      }

      // Xóa ảnh sản phẩm nếu có
      if (product.image) {
        await this.deleteProductImage(product.image);
      }

      // Xóa khỏi dataAPI
      const deletedProduct = dataAPI.deleteProduct(productId);

      // Simulate Excel update
      await this.updateExcelWithDeletedProduct(productId);

      return {
        success: true,
        message: `Đã xóa sản phẩm "${deletedProduct.name}" thành công`
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

      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('File không được vượt quá 5MB');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = `product-${timestamp}.${extension}`;

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const imageUrl = `/images/${fileName}`;

      return {
        success: true,
        url: imageUrl,
        fileName: fileName,
        size: file.size
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
      // Extract filename from URL
      const fileName = imageUrl.split('/').pop();
      
      // Simulate delete delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        message: `Đã xóa ảnh ${fileName}`
      };
    } catch (error) {
      throw new Error(`Lỗi xóa ảnh: ${error.message}`);
    }
  }

  /**
   * Reload dữ liệu từ Excel
   */
  static async reloadDataFromExcel() {
    try {
      await dataAPI.reload();
      
      // Simulate reload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const stats = dataAPI.getStats();
      
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
   * Tải xuống Excel hiện tại
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

      // Simulate upload delay
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
      const stats = dataAPI.getStats();
      const products = dataAPI.getAllProducts();
      const categories = dataAPI.getAllCategories();

      // Thống kê chi tiết
      const categoryStats = {};
      products.forEach(product => {
        const cat = product.category;
        if (!categoryStats[cat]) {
          categoryStats[cat] = { count: 0, inStock: 0 };
        }
        categoryStats[cat].count++;
        if (product.inStock) categoryStats[cat].inStock++;
      });

      return {
        totalProducts: products.length,
        totalCategories: categories.length,
        inStockProducts: products.filter(p => p.inStock).length,
        featuredProducts: products.filter(p => p.isFeatured).length,
        categoryStats: categoryStats,
        isLoaded: stats.isLoaded
      };
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

  // Private methods for Excel operations (simulated)
  
  static async updateExcelWithNewProduct(product) {
    try {
      // Thông báo cho user biết đang cập nhật Excel
      console.log('📝 Cập nhật Excel với sản phẩm mới:', product.name);
      
      // Thực tế: Ở đây cần gọi API backend để cập nhật Excel
      // Hoặc tạo file Excel mới và replace file cũ
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Tạm thời: Export toàn bộ data thành Excel mới
      await this.exportDataToExcel();
      
      return { success: true };
    } catch (error) {
      throw new Error(`Lỗi cập nhật Excel: ${error.message}`);
    }
  }

  static async updateExcelWithUpdatedProduct(product) {
    try {
      console.log('📝 Cập nhật Excel với thay đổi sản phẩm:', product.name);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.exportDataToExcel();
      return { success: true };
    } catch (error) {
      throw new Error(`Lỗi cập nhật Excel: ${error.message}`);
    }
  }

  static async updateExcelWithDeletedProduct(productId) {
    try {
      console.log('📝 Cập nhật Excel: xóa sản phẩm ID', productId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.exportDataToExcel();
      return { success: true };
    } catch (error) {
      throw new Error(`Lỗi cập nhật Excel: ${error.message}`);
    }
  }

  /**
   * Export dữ liệu hiện tại thành file Excel mới
   */
  static async exportDataToExcel() {
    try {
      const { dataAPI } = await import('@/data/products.js');
      const products = dataAPI.getAllProducts();
      const categories = dataAPI.getAllCategories();

      // Tạo CSV content (có thể mở bằng Excel)
      let csvContent = '\uFEFF'; // BOM for UTF-8
      
      // Headers cho Products sheet
      const productHeaders = [
        'ID', 'Tên sản phẩm', 'Danh mục', 'Giá bán', 'Giá gốc', 'Mô tả ngắn', 'Mô tả đầy đủ',
        'Kích thước gói', 'Số lượng tồn', 'Còn hàng', 'Nổi bật', 'Hình ảnh', 'Hình ảnh khác',
        'Đối tượng', 'Nhà sản xuất', 'Xuất xứ', 'Số đăng ký', 'Thành phần hoạt chất',
        'Liều dùng', 'Hướng dẫn sử dụng', 'Cảnh báo', 'Bảo quản', 'Đánh giá', 'Lượt đánh giá',
        'Tags', 'Chức năng', 'Ngày tạo', 'Ngày cập nhật', 'Trạng thái'
      ];
      
      csvContent += '=== PRODUCTS ===\n';
      csvContent += productHeaders.join(',') + '\n';
      
      // Add products data
      products.forEach(product => {
        const row = [
          product.id || '',
          `"${(product.name || '').replace(/"/g, '""')}"`,
          `"${(product.category || '').replace(/"/g, '""')}"`,
          product.price || 0,
          product.originalPrice || 0,
          `"${(product.description || '').replace(/"/g, '""')}"`,
          `"${(product.fullDescription || '').replace(/"/g, '""')}"`,
          `"${(product.packageSize || '').replace(/"/g, '""')}"`,
          product.stockQuantity || 0,
          product.inStock ? 'TRUE' : 'FALSE',
          product.isFeatured ? 'TRUE' : 'FALSE',
          product.image || '',
          product.images ? product.images.slice(1).join(';') : '',
          `"${(product.targetAnimal || '').replace(/"/g, '""')}"`,
          `"${(product.manufacturer || '').replace(/"/g, '""')}"`,
          `"${(product.originCountry || '').replace(/"/g, '""')}"`,
          `"${(product.registrationNumber || '').replace(/"/g, '""')}"`,
          `"${(product.activeIngredients || '').replace(/"/g, '""')}"`,
          `"${(product.dosage || '').replace(/"/g, '""')}"`,
          `"${(product.usageInstructions || '').replace(/"/g, '""')}"`,
          `"${(product.warnings || '').replace(/"/g, '""')}"`,
          `"${(product.storageConditions || '').replace(/"/g, '""')}"`,
          product.rating || 0,
          product.reviewCount || 0,
          product.tags ? product.tags.join(';') : '',
          product.functions ? product.functions.join(';') : '',
          product.createdDate || new Date().toISOString(),
          product.updatedDate || new Date().toISOString(),
          product.status || 'active'
        ];
        csvContent += row.join(',') + '\n';
      });

      // Add categories section
      csvContent += '\n=== CATEGORIES ===\n';
      csvContent += 'ID,Tên danh mục,Biểu tượng,Thứ tự,Trạng thái\n';
      
      categories.forEach(cat => {
        const row = [
          cat.id || '',
          `"${(cat.name || '').replace(/"/g, '""')}"`,
          cat.icon || '',
          cat.sortOrder || 999,
          cat.is_active ? 'TRUE' : 'FALSE'
        ];
        csvContent += row.join(',') + '\n';
      });

      // Tạo và download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `halife_products_updated_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ Đã xuất dữ liệu cập nhật ra file CSV');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Lỗi export Excel:', error);
      throw error;
    }
  }

  // Utility methods
  
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

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
}