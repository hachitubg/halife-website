// src/utils/bannerAPI.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export class BannerAPI {
  // ===== HOMEPAGE BANNERS =====
  
  /**
   * Lấy danh sách banner trang chủ hiện tại
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

  // ===== POPUP BANNER =====

  /**
   * Lấy popup banner hiện tại
   */
  static async getPopupBanner() {
    try {
      const response = await fetch(`${API_BASE}/api/popup-banner`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Lỗi lấy popup banner');
      }
      
      return result.banner || '/images/popup-banner-default.jpg';
    } catch (error) {
      console.error('Error getting popup banner:', error);
      // Fallback về banner mặc định
      return '/images/popup-banner-default.jpg';
    }
  }

  /**
   * Upload popup banner mới
   */
  static async uploadPopupBanner(file) {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('File phải là hình ảnh');
      }

      const formData = new FormData();
      formData.append('popup-banner', file);

      const response = await fetch(`${API_BASE}/api/popup-banner`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload popup banner failed');
      }

      return {
        success: true,
        banner: result.banner,
        message: result.message
      };
    } catch (error) {
      throw new Error(`Lỗi upload popup banner: ${error.message}`);
    }
  }

  /**
   * Thay thế popup banner
   */
  static async replacePopupBanner(file) {
    try {
      const result = await this.uploadPopupBanner(file);
      
      // Trigger event để notify các component khác
      window.dispatchEvent(new CustomEvent('popupBannerUpdated', { 
        detail: result.banner 
      }));
      
      return result;
    } catch (error) {
      throw new Error(`Lỗi thay thế popup banner: ${error.message}`);
    }
  }

  /**
   * Xóa popup banner
   */
  static async deletePopupBanner() {
    try {
      const response = await fetch(`${API_BASE}/api/popup-banner`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Lỗi xóa popup banner');
      }

      // Trigger event để notify các component khác
      window.dispatchEvent(new CustomEvent('popupBannerUpdated', { 
        detail: null 
      }));

      return {
        success: true,
        message: result.message
      };
    } catch (error) {
      throw new Error(`Lỗi xóa popup banner: ${error.message}`);
    }
  }

  // ===== BANNER MANAGER UTILITIES =====

  /**
   * Load tất cả banner data cho BannerManager
   */
  static async loadAllBannerData() {
    try {
      const [homepageBanners, popupBanner] = await Promise.all([
        this.getBanners(),
        this.getPopupBanner()
      ]);

      return {
        homepageBanners,
        popupBanner
      };
    } catch (error) {
      console.error('Error loading all banner data:', error);
      return {
        homepageBanners: [],
        popupBanner: null
      };
    }
  }

  /**
   * Validate file upload
   */
  static validateFile(file, maxSizeMB = 5) {
    const errors = [];

    if (!file) {
      errors.push('Không có file được chọn');
      return { isValid: false, errors };
    }

    if (!file.type.startsWith('image/')) {
      errors.push('File phải là hình ảnh');
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      errors.push(`File quá lớn. Kích thước tối đa ${maxSizeMB}MB`);
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Định dạng không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, WebP, GIF');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Show message utility
   */
  static showMessage(message, type = 'info') {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    
    // Có thể thay bằng toast notification library
    alert(`${icons[type]} ${message}`);
    
    // Log to console for debugging
    console.log(`[BannerAPI ${type.toUpperCase()}]:`, message);
  }

  // ===== CONTACT POPUP UTILITIES =====

  /**
   * Initialize popup banner cho ContactPopup component
   */
  static async initializePopupBanner(component) {
    try {
      const popupBanner = await this.getPopupBanner();
      
      if (component && typeof component === 'object') {
        component.popupBanner = popupBanner;
      }
      
      return popupBanner;
    } catch (error) {
      console.error('Error initializing popup banner:', error);
      return '/images/popup-banner-default.jpg';
    }
  }

  /**
   * Setup event listener cho popup banner updates
   */
  static setupPopupBannerListener(component) {
    const handleUpdate = (event) => {
      if (component && typeof component === 'object') {
        component.popupBanner = event.detail;
      }
    };

    window.addEventListener('popupBannerUpdated', handleUpdate);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('popupBannerUpdated', handleUpdate);
    };
  }

  // ===== EMAIL INTEGRATION =====

  /**
   * Send contact form email (ContactPopup integration)
   */
  static async sendContactEmail(formData) {
    try {
      // Import EmailJS dynamically
      const emailjs = await import('@emailjs/browser');
      
      // EmailJS configuration
      const serviceId = 'service_dlzpqnu';
      const templateId = 'template_5iugwni';
      const publicKey = 'y2eF1NKDKicGABCFN';
      
      // Email template parameters
      const templateParams = {
        from_name: formData.name,
        phone: formData.phone,
        email: formData.email || 'Không cung cấp',
        location: formData.location || 'Không chọn',
        timestamp: new Date().toLocaleString('vi-VN'),
        to_email: 'info@halife.vn'
      };
      
      // Send email
      const response = await emailjs.default.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );
      
      console.log('Contact email sent successfully:', response);
      return {
        success: true,
        message: 'Email đã được gửi thành công',
        response
      };
      
    } catch (error) {
      console.error('EmailJS Error:', error);
      throw new Error(`Lỗi gửi email: ${error.message}`);
    }
  }

  // ===== STORAGE UTILITIES =====

  /**
   * Cache banner data locally để tăng performance
   */
  static cacheBannerData(key, data, ttlMinutes = 30) {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    };
    
    localStorage.setItem(`banner_cache_${key}`, JSON.stringify(cacheItem));
  }

  /**
   * Get cached banner data
   */
  static getCachedBannerData(key) {
    try {
      const cached = localStorage.getItem(`banner_cache_${key}`);
      if (!cached) return null;

      const cacheItem = JSON.parse(cached);
      const now = Date.now();

      if (now - cacheItem.timestamp > cacheItem.ttl) {
        localStorage.removeItem(`banner_cache_${key}`);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }

  /**
   * Clear all banner cache
   */
  static clearBannerCache() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('banner_cache_'));
    keys.forEach(key => localStorage.removeItem(key));
  }
}