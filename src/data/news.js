// src/data/news.js
import axios from 'axios'

const API_BASE = 'http://localhost:8000'

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

// ======================
// API SERVICE FUNCTIONS
// ======================
const newsService = {
  async getAllNews() {
    try {
      const response = await axios.get(`${API_BASE}/api/news`)
      newsData = response.data.data || []
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      // Fallback to existing static data if API fails
      return { success: false, data: [...staticNewsData] }
    }
  },

  async createNews(newsItem) {
    try {
      const response = await axios.post(`${API_BASE}/api/news`, newsItem)
      if (response.data.success) {
        await this.getAllNews() // Refresh cache
      }
      return response.data
    } catch (error) {
      console.error('Create Error:', error)
      return { success: false, message: 'Lỗi tạo tin tức: ' + error.message }
    }
  },

  async updateNews(id, newsItem) {
    try {
      const response = await axios.put(`${API_BASE}/api/news/${id}`, newsItem)
      if (response.data.success) {
        await this.getAllNews() // Refresh cache
      }
      return response.data
    } catch (error) {
      console.error('Update Error:', error)
      return { success: false, message: 'Lỗi cập nhật tin tức: ' + error.message }
    }
  },

  async deleteNews(id) {
    try {
      const response = await axios.delete(`${API_BASE}/api/news/${id}`)
      if (response.data.success) {
        await this.getAllNews() // Refresh cache
      }
      return response.data
    } catch (error) {
      console.error('Delete Error:', error)
      return { success: false, message: 'Lỗi xóa tin tức: ' + error.message }
    }
  }
}

// ======================
// NEWS EDITOR LOGIC (từ Vue chuyển vào đây)
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

  // Detect images in content
  detectImages(content) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = content
    const images = tempDiv.querySelectorAll('img')
    
    return Array.from(images).map(img => ({
      src: img.src || '',
      alt: img.alt || '',
      status: 'loading'
    }))
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
      const newsObject = await this.createNewsObject(newsData)
      const result = await newsService.createNews(newsObject)
      
      if (result.success) {
        return {
          success: true,
          message: 'Đã lưu tin tức thành công!',
          data: result.data
        }
      } else {
        return {
          success: false,
          message: result.message || 'Lỗi khi lưu tin tức'
        }
      }
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
      const newsObject = await this.createNewsObject(newsData)
      const result = await newsService.updateNews(id, newsObject)
      
      if (result.success) {
        return {
          success: true,
          message: 'Đã cập nhật tin tức thành công!',
          data: result.data
        }
      } else {
        return {
          success: false,
          message: result.message || 'Lỗi khi cập nhật tin tức'
        }
      }
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
      const result = await newsService.deleteNews(id)
      
      if (result.success) {
        return {
          success: true,
          message: 'Đã xóa tin tức thành công!'
        }
      } else {
        return {
          success: false,
          message: result.message || 'Lỗi khi xóa tin tức'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Lỗi hệ thống: ' + error.message
      }
    }
  }
}

// ======================
// EXISTING HELPER FUNCTIONS (giữ nguyên)
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
  return newsData.find(article => article.id === id)
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

// Export service để components khác sử dụng
export { newsService }

// ======================
// STATIC DATA (fallback)
// ======================
const staticNewsData = [
  {
    id: 1752421469619,
    title: 'Best Phage từ Nhật Bản – tiêu diệt 99% bệnh đường ruột – đập tan nỗi lo kháng kháng sinh trong chăn nuôi',
    excerpt: '"Gần 100 ổ dịch và hơn 120.000 gia súc, gia cầm chết mỗi năm nguyên nhân là do vi khuẩn kháng kháng sinh gây ra".&nbsp; &nbsp; Trong bối cảnh các bệnh dịch ngày càng phức tạp và sự lạm dụng kháng sinh...',
    // ... rest of the data
  },
  // ... other static news items
]

// Load initial data
newsService.getAllNews()

// Export để dễ dàng import
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