// src/utils/fileManagerAPI.js
// API utilities cho File Manager (mock cho frontend-only)

export class FileManagerAPI {
  
  /**
   * Lấy danh sách file Excel
   */
  static async getExcelFiles() {
    try {
      // Kiểm tra file Excel mặc định
      const response = await fetch('/data/halife_products.xlsx', { method: 'HEAD' });
      if (response.ok) {
        return [{
          name: 'halife_products.xlsx',
          size: parseInt(response.headers.get('content-length') || '0'),
          lastModified: response.headers.get('last-modified') || new Date().toISOString(),
          url: '/data/halife_products.xlsx'
        }];
      }
      return [];
    } catch (error) {
      console.warn('Không tìm thấy file Excel:', error);
      return [];
    }
  }

  /**
   * Lấy danh sách hình ảnh thực tế từ hệ thống
   */
  static async getImages() {
    try {
      // Sử dụng API để list tất cả file trong thư mục /images/
      // Vì frontend không thể trực tiếp list directory, chúng ta sẽ:
      // 1. Thử fetch một API endpoint để list files
      // 2. Hoặc scan từ một list các extension phổ biến

      const images = [];
      
      // Thử fetch API list files (nếu backend hỗ trợ)
      try {
        const response = await fetch('/api/images/list');
        if (response.ok) {
          const data = await response.json();
          return data.images || [];
        }
      } catch (e) {
        // Nếu không có API, fallback sang phương pháp scan
      }

      // Fallback: Scan các file có thể có bằng cách thử fetch
      // Lấy danh sách từ một nguồn hoặc scan pattern phổ biến
      const commonExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      const commonNames = [
        // Product images
        'best-phage-1', 'best-phage-2', 'best-phage-3',
        'boost-phage-1', 'boost-phage-2', 
        'good-set-1', 'good-set-2',
        'winflo-la-1', 'winflo-la-2', 
        'anpha-new-1', 'anpha-new-2',
        
        // Category images
        'thuoc-khang-sinh', 'vitamin-khoang-chat', 'thuc-an-bo-sung',
        'thao-duoc', 'bo-san-pham',
        
        // Common files
        'product-placeholder', 'logo', 'banner', 'hero',
        'category-default', 'no-image',
        
        // Numbered patterns
        ...Array.from({length: 20}, (_, i) => `product-${i + 1}`),
        ...Array.from({length: 10}, (_, i) => `image-${i + 1}`),
        ...Array.from({length: 10}, (_, i) => `photo-${i + 1}`)
      ];

      // Scan tất cả combination name + extension
      const scanPromises = [];
      
      for (const name of commonNames) {
        for (const ext of commonExtensions) {
          const fileName = `${name}.${ext}`;
          const url = `/images/${fileName}`;
          
          scanPromises.push(
            fetch(url, { method: 'HEAD' })
              .then(response => {
                if (response.ok) {
                  return {
                    name: fileName,
                    url: url,
                    size: parseInt(response.headers.get('content-length') || '0'),
                    lastModified: response.headers.get('last-modified') || new Date().toISOString(),
                    type: this.getImageType(ext)
                  };
                }
                return null;
              })
              .catch(() => null)
          );
        }
      }

      // Chờ tất cả scan hoàn thành
      const results = await Promise.all(scanPromises);
      const foundImages = results.filter(Boolean);

      // Sắp xếp theo tên file
      foundImages.sort((a, b) => a.name.localeCompare(b.name));
      
      return foundImages;

    } catch (error) {
      console.error('Lỗi scan images:', error);
      return [];
    }
  }

  /**
   * Lấy loại hình ảnh từ extension
   */
  static getImageType(extension) {
    const types = {
      'jpg': 'JPEG',
      'jpeg': 'JPEG', 
      'png': 'PNG',
      'gif': 'GIF',
      'webp': 'WebP',
      'svg': 'SVG'
    };
    return types[extension.toLowerCase()] || 'Unknown';
  }

  /**
   * Scan toàn bộ thư mục images với pattern matching
   */
  static async scanImagesDirectory() {
    const foundImages = [];
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    
    // Scan pattern: bất kỳ tên file nào có thể có
    const patterns = [
      // Alphabetic patterns
      ...Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)), // A-Z
      ...Array.from({length: 26}, (_, i) => String.fromCharCode(97 + i)), // a-z
      
      // Common file patterns
      'img', 'image', 'photo', 'pic', 'product', 'item',
      'banner', 'hero', 'logo', 'icon', 'thumbnail', 'thumb',
      
      // Product specific
      'best', 'boost', 'good', 'winflo', 'anpha',
      'phage', 'set', 'new',
      
      // Numbers and combinations
      ...Array.from({length: 100}, (_, i) => `${i + 1}`),
      ...Array.from({length: 50}, (_, i) => `img${i + 1}`),
      ...Array.from({length: 50}, (_, i) => `image${i + 1}`),
      ...Array.from({length: 50}, (_, i) => `product${i + 1}`),
    ];

    console.log('🔍 Đang scan thư mục images...');
    
    const scanPromises = [];
    
    for (const pattern of patterns) {
      for (const ext of extensions) {
        const fileName = `${pattern}.${ext}`;
        const url = `/images/${fileName}`;
        
        scanPromises.push(
          fetch(url, { method: 'HEAD' })
            .then(response => response.ok ? {
              name: fileName,
              url: url,
              size: parseInt(response.headers.get('content-length') || '0'),
              lastModified: response.headers.get('last-modified') || new Date().toISOString(),
              type: this.getImageType(ext)
            } : null)
            .catch(() => null)
        );
      }
    }

    // Batch process để tránh quá tải
    const batchSize = 50;
    for (let i = 0; i < scanPromises.length; i += batchSize) {
      const batch = scanPromises.slice(i, i + batchSize);
      const results = await Promise.all(batch);
      foundImages.push(...results.filter(Boolean));
      
      // Progress log
      if (foundImages.length > 0) {
        console.log(`📷 Đã tìm thấy ${foundImages.length} hình ảnh...`);
      }
    }

    console.log(`✅ Scan hoàn thành. Tìm thấy ${foundImages.length} hình ảnh.`);
    
    return foundImages.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Upload file Excel (mock)
   */
  static async uploadExcel(file) {
    return new Promise((resolve, reject) => {
      // Validate file
      if (!file.name.match(/\.(xlsx|xls)$/)) {
        reject(new Error('File phải có định dạng .xlsx hoặc .xls'));
        return;
      }

      // Simulate upload delay
      setTimeout(() => {
        // Trong thực tế, sẽ upload lên server
        console.log('Excel uploaded:', file.name, file.size);
        resolve({
          success: true,
          fileName: file.name,
          message: 'Upload thành công'
        });
      }, 2000);
    });
  }

  /**
   * Upload hình ảnh (mock)
   */
  static async uploadImages(files) {
    return new Promise((resolve, reject) => {
      // Validate files
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      if (validFiles.length === 0) {
        reject(new Error('Không có file hình ảnh hợp lệ'));
        return;
      }

      // Simulate upload delay
      setTimeout(() => {
        const uploadedFiles = validFiles.map(file => ({
          name: file.name,
          size: file.size,
          url: `/images/${file.name}`
        }));

        console.log('Images uploaded:', uploadedFiles);
        resolve({
          success: true,
          files: uploadedFiles,
          message: `Upload ${validFiles.length} hình ảnh thành công`
        });
      }, 2000);
    });
  }

  /**
   * Xóa file Excel (mock)
   */
  static async deleteExcel(fileName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Excel deleted:', fileName);
        resolve({
          success: true,
          message: `Đã xóa file ${fileName}`
        });
      }, 1000);
    });
  }

  /**
   * Xóa hình ảnh (mock)
   */
  static async deleteImage(imageName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Image deleted:', imageName);
        resolve({
          success: true,
          message: `Đã xóa ảnh ${imageName}`
        });
      }, 1000);
    });
  }

  /**
   * Tạo backup dữ liệu
   */
  static async createBackup() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Tạo backup ZIP chứa Excel + Images
        const backupName = `halife-backup-${new Date().toISOString().split('T')[0]}.zip`;
        console.log('Backup created:', backupName);
        
        // Trong thực tế sẽ tạo và download file ZIP
        resolve({
          success: true,
          fileName: backupName,
          message: 'Backup được tạo thành công'
        });
      }, 3000);
    });
  }

  /**
   * Lấy thống kê file
   */
  static async getStats() {
    const [excelFiles, images] = await Promise.all([
      this.getExcelFiles(),
      this.getImages()
    ]);

    return {
      excelCount: excelFiles.length,
      imageCount: images.length,
      totalSize: [...excelFiles, ...images].reduce((sum, file) => sum + file.size, 0)
    };
  }
}