// src/utils/bannerAPI.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export class BannerAPI {
  /**
   * Lấy danh sách banner hiện tại
   */
  static async getBanners() {
    try {
      const response = await fetch(`${API_BASE}/api/banners`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Lỗi lấy danh sách banner');
      }
      
      return result.data || [];
    } catch (error) {
      console.error('Error getting banners:', error);
      // Fallback về banner mặc định
      return [
        '/images/cover1.jpg',
        '/images/cover2.jpg', 
        '/images/cover3.jpg'
      ];
    }
  }

  /**
   * Upload banner mới
   */
  static async uploadBanner(file) {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('File phải là hình ảnh');
      }

      const formData = new FormData();
      formData.append('banner', file);

      const response = await fetch(`${API_BASE}/api/banners/upload`, {
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
        message: result.message
      };
    } catch (error) {
      throw new Error(`Lỗi upload banner: ${error.message}`);
    }
  }

  /**
   * Thay thế banner tại vị trí index
   */
  static async replaceBanner(index, file) {
    try {
      const uploadResult = await this.uploadBanner(file);
      
      const response = await fetch(`${API_BASE}/api/banners/${index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: uploadResult.url
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Lỗi thay thế banner');
      }

      return {
        success: true,
        message: result.message,
        banners: result.data
      };
    } catch (error) {
      throw new Error(`Lỗi thay thế banner: ${error.message}`);
    }
  }

  /**
   * Thêm banner mới
   */
  static async addBanner(file) {
    try {
      const uploadResult = await this.uploadBanner(file);
      
      const response = await fetch(`${API_BASE}/api/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: uploadResult.url
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Lỗi thêm banner');
      }

      return {
        success: true,
        message: result.message,
        banners: result.data
      };
    } catch (error) {
      throw new Error(`Lỗi thêm banner: ${error.message}`);
    }
  }

  /**
   * Xóa banner tại vị trí index
   */
  static async deleteBanner(index) {
    try {
      const response = await fetch(`${API_BASE}/api/banners/${index}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Lỗi xóa banner');
      }

      return {
        success: true,
        message: result.message,
        banners: result.data
      };
    } catch (error) {
      throw new Error(`Lỗi xóa banner: ${error.message}`);
    }
  }

  /**
   * Cập nhật thứ tự banner
   */
  static async reorderBanners(banners) {
    try {
      const response = await fetch(`${API_BASE}/api/banners/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ banners })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Lỗi sắp xếp banner');
      }

      return {
        success: true,
        message: result.message,
        banners: result.data
      };
    } catch (error) {
      throw new Error(`Lỗi sắp xếp banner: ${error.message}`);
    }
  }
}