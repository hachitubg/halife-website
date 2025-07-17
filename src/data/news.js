// src/data/news.js
// Use environment variable for API base URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Categories data
export const newsCategories = [
  'Tất cả', 
  'Kiến thức chăm sóc', 
  'Công nghệ mới', 
  'Hướng dẫn sử dụng', 
  'Tin tức ngành',
  'Phòng chống dịch bệnh',
  'Dinh dưỡng',
  'Môi trường chăn nuôi'
]

// Cache data trong memory
let newsData = []
let nextId = Date.now()

// ======================
// NEWS API CLASS - Same pattern as ProductAPI
// ======================
export class NewsAPI {
  
  /**
   * Helper method để gọi API - Same as ProductAPI
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
   * Lấy tất cả tin tức
   */
  static async getAllNews() {
    try {
      const response = await this.makeRequest('/api/news');
      newsData = response.data || [];
      return response.data;
    } catch (error) {
      // Fallback to static data if API fails
      console.warn('News API not available, using static data:', error.message);
      newsData = [...staticNewsData];
      return newsData;
    }
  }

  /**
   * Lấy tin tức theo ID
   */
  static async getNewsById(id) {
    try {
      const response = await this.makeRequest(`/api/news/${id}`);
      return response.data;
    } catch (error) {
      // Fallback to local data
      const news = newsData.find(item => item.id === parseInt(id));
      if (news) return news;
      throw new Error(`Lỗi lấy tin tức: ${error.message}`);
    }
  }

  /**
   * Tạo tin tức mới
   */
  static async createNews(newsDataItem) {
    try {
      const response = await this.makeRequest('/api/news', {
        method: 'POST',
        body: JSON.stringify(newsDataItem)
      });

      // Refresh cache
      await this.getAllNews();
      
      return {
        success: true,
        data: response.data,
        message: response.message || 'Tạo tin tức thành công'
      };
    } catch (error) {
      // Fallback: Add to local data
      const newNews = {
        ...newsDataItem,
        id: nextId++,
        date: new Date().toLocaleDateString('vi-VN'),
        views: Math.floor(Math.random() * 100) + 50,
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0
      };
      
      newsData.unshift(newNews);
      
      return {
        success: true,
        data: newNews,
        message: 'Tạo tin tức thành công (local)'
      };
    }
  }

  /**
   * Cập nhật tin tức
   */
  static async updateNews(id, newsDataItem) {
    try {
      const response = await this.makeRequest(`/api/news/${id}`, {
        method: 'PUT',
        body: JSON.stringify(newsDataItem)
      });

      // Refresh cache
      await this.getAllNews();
      
      return {
        success: true,
        data: response.data,
        message: response.message || 'Cập nhật tin tức thành công'
      };
    } catch (error) {
      // Fallback: Update local data
      const index = newsData.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        newsData[index] = { ...newsData[index], ...newsDataItem, id: parseInt(id) };
        return {
          success: true,
          data: newsData[index],
          message: 'Cập nhật tin tức thành công (local)'
        };
      }
      throw new Error(`Lỗi cập nhật tin tức: ${error.message}`);
    }
  }

  /**
   * Xóa tin tức
   */
  static async deleteNews(id) {
    try {
      const response = await this.makeRequest(`/api/news/${id}`, {
        method: 'DELETE'
      });

      // Refresh cache
      await this.getAllNews();
      
      return {
        success: true,
        message: response.message || 'Xóa tin tức thành công'
      };
    } catch (error) {
      // Fallback: Delete from local data
      const index = newsData.findIndex(item => item.id === parseInt(id));
      if (index !== -1) {
        newsData.splice(index, 1);
        return {
          success: true,
          message: 'Xóa tin tức thành công (local)'
        };
      }
      throw new Error(`Lỗi xóa tin tức: ${error.message}`);
    }
  }

  /**
   * Lấy thống kê tin tức
   */
  static async getStats() {
    try {
      const response = await this.makeRequest('/api/news/stats');
      return response.data;
    } catch (error) {
      // Fallback: Calculate from local data
      const totalNews = newsData.length;
      const publishedNews = newsData.filter(item => item.isPublished).length;
      const featuredNews = newsData.filter(item => item.isFeatured).length;
      
      const categoryStats = {};
      newsData.forEach(item => {
        if (item.category) {
          categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
        }
      });

      return {
        totalNews,
        publishedNews,
        featuredNews,
        categoryStats,
        isLoaded: true
      };
    }
  }

  /**
   * Upload hình ảnh cho tin tức - Same pattern as ProductAPI
   */
  static async uploadNewsImage(file) {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File phải là hình ảnh');
      }

      // Tạo FormData để upload
      const formData = new FormData();
      formData.append('file', file);

      // Gọi API upload - same endpoint as ProductAPI
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
   * Xóa hình ảnh tin tức
   */
  static async deleteNewsImage(imageUrl) {
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
   * Validate tin tức
   */
  static validateNews(newsData) {
    const errors = [];
    
    if (!newsData.title || newsData.title.trim() === '') {
      errors.push('Tiêu đề không được để trống');
    }
    
    if (!newsData.content || newsData.content.trim() === '') {
      errors.push('Nội dung không được để trống');
    }
    
    if (!newsData.category || newsData.category.trim() === '') {
      errors.push('Danh mục không được để trống');
    }

    if (!newsData.author || newsData.author.trim() === '') {
      errors.push('Tác giả không được để trống');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Format file size - Same as ProductAPI
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// ======================
// NEWS SERVICE - Wrapper để tương thích với code cũ
// ======================
const newsService = {
  async getAllNews() {
    try {
      const data = await NewsAPI.getAllNews();
      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, data: [...staticNewsData] };
    }
  },

  async createNews(newsItem) {
    try {
      return await NewsAPI.createNews(newsItem);
    } catch (error) {
      console.error('Create Error:', error);
      return { success: false, message: 'Lỗi tạo tin tức: ' + error.message };
    }
  },

  async updateNews(id, newsItem) {
    try {
      return await NewsAPI.updateNews(id, newsItem);
    } catch (error) {
      console.error('Update Error:', error);
      return { success: false, message: 'Lỗi cập nhật tin tức: ' + error.message };
    }
  },

  async deleteNews(id) {
    try {
      return await NewsAPI.deleteNews(id);
    } catch (error) {
      console.error('Delete Error:', error);
      return { success: false, message: 'Lỗi xóa tin tức: ' + error.message };
    }
  }
};

// ======================
// NEWS EDITOR SERVICE - Updated to use NewsAPI
// ======================
export const newsEditorService = {
  // Generate excerpt from content
  generateExcerpt(content) {
    const textOnly = content.replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    return textOnly.length > 200 ? textOnly.substring(0, 200) + '...' : textOnly
  },

  // Generate tags from title and content
  generateTags(title, content) {
    const commonWords = ['và', 'của', 'trong', 'với', 'cho', 'từ', 'về', 'các', 'một', 'có', 'được', 'là', 'sẽ', 'để', 'này', 'đó', 'những', 'như', 'cũng', 'hay', 'việc', 'theo', 'người', 'khi', 'tại', 'sau', 'trước']
    
    const allText = (title + ' ' + content.replace(/<[^>]*>/g, '')).toLowerCase()
    const words = allText.match(/\b[\w]{3,}\b/g) || []
    
    const wordCount = {}
    words.forEach(word => {
      if (!commonWords.includes(word) && word.length > 3) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })

    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word)
  },

  // Extract first image from content
  extractFirstImage(content, featuredImage = '') {
    const imgMatch = content.match(/<img[^>]+src="([^"]*)"/)
    return imgMatch ? imgMatch[1] : featuredImage || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop'
  },

  // Calculate read time
  calculateReadTime(content) {
    if (!content) return '1 phút'
    const textOnly = content.replace(/<[^>]*>/g, ' ')
    const words = textOnly.trim().split(/\s+/).filter(word => word.length > 0).length
    const minutes = Math.ceil(words / 200)
    return minutes + ' phút'
  },

  // Get content stats
  getContentStats(content) {
    if (!content) return { words: 0, images: 0, paragraphs: 0 }
    
    const textOnly = content.replace(/<[^>]*>/g, ' ')
    const words = textOnly.trim().split(/\s+/).filter(word => word.length > 0).length
    const images = (content.match(/<img/g) || []).length
    const paragraphs = (content.match(/<p/g) || []).length
    
    return { words, images, paragraphs }
  },

  // Clean pasted content
  cleanPastedContent(html) {
    let cleaned = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/class="[^"]*"/gi, '')
      .replace(/style="[^"]*"/gi, '')
      .replace(/id="[^"]*"/gi, '')
      .replace(/data-[^=]*="[^"]*"/gi, '')
      .replace(/<font[^>]*>/gi, '')
      .replace(/<\/font>/gi, '')
      .replace(/<span[^>]*>/gi, '<span>')
      .replace(/<div[^>]*>/gi, '<div>')

    // Fix image sources - convert relative URLs to absolute
    cleaned = cleaned.replace(/<img([^>]*src=")([^"]*)/gi, (match, prefix, src) => {
      if (src.startsWith('http')) return match
      if (src.startsWith('//')) return prefix + 'https:' + src
      if (src.startsWith('/')) {
        const currentDomain = window.location.origin
        return prefix + currentDomain + src
      }
      return match
    })

    return cleaned
  },

  // Create news object ready for API
  async createNewsObject(newsData) {
    const newsObject = {
      title: newsData.title,
      excerpt: this.generateExcerpt(newsData.content),
      content: newsData.content,
      date: new Date().toLocaleDateString('vi-VN'),
      author: newsData.author || 'Admin HALIFE',
      category: newsData.category || 'Tin tức ngành',
      isPublished: true,
      isFeatured: newsData.isFeatured || false,
      readTime: this.calculateReadTime(newsData.content),
      views: Math.floor(Math.random() * 500) + 100,
      likes: 0,
      comments: 0,
      shares: 0,
      bookmarks: 0,
      image: this.extractFirstImage(newsData.content, newsData.featuredImage),
      tags: this.generateTags(newsData.title, newsData.content)
    }

    return newsObject
  },

  // Save news via API
  async saveNews(newsData) {
    try {
      const validation = NewsAPI.validateNews(newsData);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        };
      }

      const newsObject = await this.createNewsObject(newsData);
      const result = await NewsAPI.createNews(newsObject);
      
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Lỗi hệ thống: ' + error.message
      }
    }
  },

  // Update existing news
  async updateNews(id, newsData) {
    try {
      const validation = NewsAPI.validateNews(newsData);
      if (!validation.isValid) {
        return {
          success: false,
          message: validation.errors.join(', ')
        };
      }

      const newsObject = await this.createNewsObject(newsData);
      const result = await NewsAPI.updateNews(id, newsObject);
      
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Lỗi hệ thống: ' + error.message
      }
    }
  },

  // Delete news
  async deleteNews(id) {
    try {
      const result = await NewsAPI.deleteNews(id);
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Lỗi hệ thống: ' + error.message
      }
    }
  }
}

// ======================
// HELPER FUNCTIONS - Giữ nguyên để tương thích
// ======================
export const getFeaturedNews = () => {
  return newsData.filter(article => article.isFeatured && article.isPublished)
}

export const getNewsByCategory = (category) => {
  if (category === 'Tất cả') {
    return newsData.filter(article => article.isPublished)
  }
  return newsData.filter(article => article.category === category && article.isPublished)
}

export const getNewsById = (id) => {
  return newsData.find(article => article.id === parseInt(id))
}

export const getLatestNews = (limit = 5) => {
  return newsData
    .filter(article => article.isPublished)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

export const searchNews = (query) => {
  const searchTerm = query.toLowerCase()
  return newsData.filter(article => 
    article.isPublished && (
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.category.toLowerCase().includes(searchTerm) ||
      article.author.toLowerCase().includes(searchTerm)
    )
  )
}

export const getPopularNews = (limit = 5) => {
  return newsData
    .filter(article => article.isPublished)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

export const getRelatedNews = (currentArticleId, category, limit = 3) => {
  return newsData
    .filter(article => 
      article.isPublished && 
      article.id !== currentArticleId && 
      article.category === category
    )
    .slice(0, limit)
}

// ======================
// STATIC DATA (fallback)
// ======================
const staticNewsData = [
  {
    id: 1752421469619,
    title: 'Best Phage từ Nhật Bản – tiêu diệt 99% bệnh đường ruột – đập tan nỗi lo kháng kháng sinh trong chăn nuôi',
    excerpt: 'Gần 100 ổ dịch và hơn 120.000 gia súc, gia cầm chết mỗi năm nguyên nhân là do vi khuẩn kháng kháng sinh gây ra. Trong bối cảnh các bệnh dịch ngày càng phức tạp và sự lạm dụng kháng sinh...',
    content: `
      <p>Gần 100 ổ dịch và hơn 120.000 gia súc, gia cầm chết mỗi năm nguyên nhân là do vi khuẩn kháng kháng sinh gây ra.</p>
      <p>Trong bối cảnh các bệnh dịch ngày càng phức tạp và sự lạm dụng kháng sinh trong chăn nuôi đang là vấn đề nghiêm trọng, <strong>Best Phage từ Nhật Bản</strong> được coi là giải pháp đột phá, mang lại hiệu quả tiêu diệt 99% vi khuẩn gây bệnh đường ruột.</p>
      <h3>Tại sao phải chọn Best Phage?</h3>
      <ul>
        <li>Tiêu diệt 99% vi khuẩn E.coli, Salmonella, Clostridium</li>
        <li>Không gây kháng thuốc, an toàn tuyệt đối</li>
        <li>Tăng cường miễn dịch tự nhiên</li>
        <li>Cải thiện hệ vi sinh đường ruột</li>
      </ul>
      <p>Sản phẩm đã được nghiên cứu và phát triển bởi các chuyên gia hàng đầu tại Nhật Bản với công nghệ tiên tiến nhất.</p>
    `,
    date: '15/01/2025',
    author: 'Dr. Nguyễn Văn A',
    category: 'Công nghệ mới',
    isPublished: true,
    isFeatured: true,
    readTime: '3 phút',
    views: 1250,
    likes: 45,
    comments: 8,
    shares: 12,
    bookmarks: 23,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
    tags: ['phage', 'công nghệ', 'vi khuẩn', 'chăn nuôi', 'nhật bản']
  },
  {
    id: 1752421469620,
    title: 'Hướng dẫn sử dụng thuốc thú y an toàn và hiệu quả',
    excerpt: 'Việc sử dụng thuốc thú y đúng cách không chỉ đảm bảo hiệu quả điều trị mà còn bảo vệ sức khỏe động vật và con người. Dưới đây là những hướng dẫn chi tiết từ chuyên gia...',
    content: `
      <p>Việc sử dụng thuốc thú y đúng cách không chỉ đảm bảo hiệu quả điều trị mà còn bảo vệ sức khỏe động vật và con người.</p>
      <h3>Nguyên tắc sử dụng thuốc thú y</h3>
      <ol>
        <li><strong>Đọc kỹ hướng dẫn:</strong> Luôn đọc kỹ nhãn và hướng dẫn sử dụng trước khi dùng</li>
        <li><strong>Đúng liều lượng:</strong> Sử dụng đúng liều lượng theo khuyến cáo</li>
        <li><strong>Đúng thời gian:</strong> Tuân thủ thời gian ngừng thuốc trước khi giết mổ</li>
        <li><strong>Bảo quản đúng cách:</strong> Lưu trữ thuốc ở nơi khô ráo, thoáng mát</li>
      </ol>
      <h3>Những lưu ý quan trọng</h3>
      <ul>
        <li>Không tự ý tăng giảm liều lượng</li>
        <li>Không sử dụng thuốc hết hạn</li>
        <li>Tránh xa tầm tay trẻ em</li>
        <li>Xử lý bao bì đúng cách sau khi sử dụng</li>
      </ul>
    `,
    date: '14/01/2025',
    author: 'BS. Trần Thị B',
    category: 'Hướng dẫn sử dụng',
    isPublished: true,
    isFeatured: false,
    readTime: '5 phút',
    views: 890,
    likes: 32,
    comments: 15,
    shares: 8,
    bookmarks: 19,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
    tags: ['thuốc thú y', 'hướng dẫn', 'an toàn', 'sử dụng']
  },
  {
    id: 1752421469621,
    title: 'Phòng chống dịch bệnh trong mùa mưa - Những điều cần biết',
    excerpt: 'Mùa mưa là thời điểm các bệnh dịch dễ bùng phát trong chăn nuôi. Việc phòng chống hiệu quả sẽ giúp người chăn nuôi tránh được những thiệt hại không đáng có...',
    content: `
      <p>Mùa mưa là thời điểm các bệnh dịch dễ bùng phát trong chăn nuôi do điều kiện môi trường ẩm ướt, thuận lợi cho vi khuẩn và virus phát triển.</p>
      <h3>Các bệnh thường gặp trong mùa mưa</h3>
      <ul>
        <li><strong>Bệnh tiêu chảy:</strong> Do E.coli, Salmonella gây ra</li>
        <li><strong>Bệnh hô hấp:</strong> Viêm phổi, cảm lạnh</li>
        <li><strong>Bệnh da:</strong> Nấm, ghẻ, viêm da</li>
        <li><strong>Bệnh gan:</strong> Viêm gan, xơ gan</li>
      </ul>
      <h3>Biện pháp phòng chống</h3>
      <ol>
        <li><strong>Cải thiện điều kiện chuồng nuôi:</strong>
          <ul>
            <li>Đảm bảo khô ráo, thoáng mát</li>
            <li>Vệ sinh chuồng trại thường xuyên</li>
            <li>Tăng cường thông gió</li>
          </ul>
        </li>
        <li><strong>Tăng cường dinh dưỡng:</strong>
          <ul>
            <li>Bổ sung vitamin C, E</li>
            <li>Sử dụng probiotics</li>
            <li>Đảm bảo nước uống sạch</li>
          </ul>
        </li>
        <li><strong>Tiêm phòng đầy đủ:</strong>
          <ul>
            <li>Theo lịch tiêm phòng</li>
            <li>Sử dụng vaccine chất lượng</li>
          </ul>
        </li>
      </ol>
    `,
    date: '13/01/2025',
    author: 'TS. Lê Văn C',
    category: 'Phòng chống dịch bệnh',
    isPublished: true,
    isFeatured: true,
    readTime: '4 phút',
    views: 1450,
    likes: 67,
    comments: 23,
    shares: 18,
    bookmarks: 34,
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=250&fit=crop',
    tags: ['phòng chống', 'dịch bệnh', 'mùa mưa', 'chăn nuôi']
  }
]

// Load initial data
NewsAPI.getAllNews()

// Export để tương thích với code cũ - GIỮ NGUYÊN CẤU TRÚC
export { newsService }

// Export default - GIỮ NGUYÊN để tương thích
export default {
  newsService,
  newsEditorService,
  getFeaturedNews,
  getNewsByCategory,
  getNewsById,
  getLatestNews,
  searchNews,
  getPopularNews,
  getRelatedNews,
  newsCategories
}