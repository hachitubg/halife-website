<template>
  <div class="article-detail-view">
    <!-- Header Component -->
    <Header 
      @search="handleSearch"
      :categories="categories"
    />

    <!-- Article Header Banner -->
    <div class="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16 md:py-24">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div 
        class="absolute inset-0 bg-cover bg-center"
        :style="`background-image: url('${article?.image || 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200&h=600&fit=crop'}')`"
      ></div>
      
      <!-- Content -->
      <div class="relative container mx-auto px-4 text-center text-white">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">Chi tiết tin tức</h1>
        <p class="text-lg md:text-xl opacity-90">Thông tin hữu ích về chăn nuôi và thú y</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8 md:py-12">
      <div v-if="article" class="max-w-4xl mx-auto">
        <!-- Article Title -->
        <div class="text-center mb-8">
          <h1 class="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            {{ article.title }}
          </h1>
          
          <!-- Article Meta -->
          <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 mb-6">
            <span class="flex items-center">
              <i class="fas fa-calendar mr-2 text-blue-500"></i>
              ĐÃ ĐĂNG TRÊN THÁNG TÁM 13, 2022 BỞI ADMIN
            </span>
          </div>
          
          <!-- Article Excerpt -->
          <p class="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {{ article.excerpt }}
          </p>
        </div>

        <!-- Article Image -->
        <div class="mb-8">
          <img 
            :src="article.image" 
            :alt="article.title" 
            class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        <!-- Article Content -->
        <div class="prose prose-lg max-w-none mb-12">
          <div v-html="article.content" class="article-content"></div>
        </div>

        <!-- Social Share Buttons -->
        <div class="flex justify-center mb-12">
          <div class="flex items-center space-x-3">
            <button 
              @click="shareOnFacebook"
              class="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
              title="Chia sẻ trên Facebook"
            >
              <i class="fab fa-facebook-f"></i>
            </button>
            <button 
              @click="shareOnTwitter"
              class="bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full transition-colors"
              title="Chia sẻ trên Twitter"
            >
              <i class="fab fa-twitter"></i>
            </button>
            <button 
              @click="shareViaEmail"
              class="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
              title="Chia sẻ qua Email"
            >
              <i class="fas fa-envelope"></i>
            </button>
            <button 
              @click="copyLink"
              class="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors"
              title="Copy link"
            >
              <i class="fas fa-link"></i>
            </button>
            <button 
              @click="shareOnLinkedIn"
              class="bg-blue-800 hover:bg-blue-900 text-white p-3 rounded-full transition-colors"
              title="Chia sẻ trên LinkedIn"
            >
              <i class="fab fa-linkedin-in"></i>
            </button>
          </div>
        </div>

        <!-- Related Articles -->
        <div v-if="relatedArticles.length > 0" class="mb-12">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Bài viết liên quan</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              v-for="relatedArticle in relatedArticles" 
              :key="relatedArticle.id"
              class="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              @click="viewArticle(relatedArticle.id)"
            >
              <div class="relative">
                <img 
                  :src="relatedArticle.image" 
                  :alt="relatedArticle.title" 
                  class="w-full h-48 object-cover"
                />
                <div class="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  13<br>TH8
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-lg mb-2 line-clamp-2">{{ relatedArticle.title }}</h3>
                <p class="text-gray-600 text-sm line-clamp-3">{{ relatedArticle.excerpt }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-xl font-bold text-gray-800 mb-6">Để lại một bình luận</h3>
          
          <p class="text-sm text-gray-600 mb-4">
            Email của bạn sẽ không được hiển thị công khai. Các trường bắt buộc được đánh dấu 
            <span class="text-red-500">*</span>
          </p>

          <form @submit.prevent="submitComment" class="space-y-4">
            <!-- Comment Text -->
            <div>
              <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
                Bình luận <span class="text-red-500">*</span>
              </label>
              <textarea 
                id="comment"
                v-model="commentForm.comment"
                rows="6"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                placeholder="Nhập bình luận của bạn..."
              ></textarea>
            </div>

            <!-- User Info -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Tên <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="name"
                  v-model="commentForm.name"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Họ và tên"
                />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email <span class="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  id="email"
                  v-model="commentForm.email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
                  Trang web
                </label>
                <input 
                  type="url" 
                  id="website"
                  v-model="commentForm.website"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <!-- Privacy Notice -->
            <div class="flex items-start">
              <input 
                type="checkbox" 
                id="privacy"
                v-model="commentForm.saveInfo"
                class="mt-1 mr-3"
              />
              <label for="privacy" class="text-sm text-gray-600">
                Lưu tên của tôi, email, và trang web trong trình duyệt này cho lần bình luận kế tiếp của tôi.
              </label>
            </div>

            <!-- Submit Button -->
            <div>
              <button 
                type="submit"
                :disabled="submittingComment"
                class="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center"
              >
                <i v-if="submittingComment" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-paper-plane mr-2"></i>
                {{ submittingComment ? 'Đang gửi...' : 'Gửi bình luận' }}
              </button>
            </div>
          </form>

          <!-- Success Message -->
          <div v-if="commentSubmitted" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <i class="fas fa-check-circle mr-2"></i>
            Cảm ơn bạn đã để lại bình luận! Chúng tôi sẽ xem xét và phê duyệt sớm nhất có thể.
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!article && !articleNotFound" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Đang tải bài viết...</p>
      </div>

      <!-- Article Not Found -->
      <div v-if="articleNotFound" class="text-center py-12">
        <i class="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy bài viết</h3>
        <p class="text-gray-500 mb-4">Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa</p>
        <router-link to="/news" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Xem tất cả tin tức
        </router-link>
      </div>
    </div>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { sidebarCategories } from '@/data/products.js'
import { news, getNewsById, getRelatedNews } from '@/data/news.js'

export default {
  name: 'ArticleDetailView',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      categories: sidebarCategories,
      article: null,
      articleNotFound: false,
      relatedArticles: [],
      submittingComment: false,
      commentSubmitted: false,
      commentForm: {
        comment: '',
        name: '',
        email: '',
        website: '',
        saveInfo: false
      }
    }
  },
  
  computed: {
    articleId() {
      return parseInt(this.$route.params.id)
    }
  },
  
  methods: {
    handleSearch(query) {
      this.$router.push({
        path: '/news',
        query: { search: query }
      })
    },
    
    loadArticle() {
      // Load article from news.js data
      this.article = getNewsById(this.articleId)
      
      if (this.article) {
        this.loadRelatedArticles()
        this.articleNotFound = false
        
        // Update page title
        document.title = `${this.article.title} - HALIFE Animals`
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          metaDescription.setAttribute('content', this.article.excerpt)
        }
      } else {
        this.articleNotFound = true
        document.title = 'Không tìm thấy bài viết - HALIFE Animals'
      }
    },
    
    loadRelatedArticles() {
      // Get related articles from the same category
      this.relatedArticles = getRelatedNews(this.articleId, this.article.category, 3)
    },
    
    formatDate(date) {
      // Format date for display
      if (typeof date === 'string' && date.includes('Tháng')) {
        return date
      }
      
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return date
      
      const day = dateObj.getDate()
      const month = dateObj.getMonth() + 1
      const year = dateObj.getFullYear()
      
      return `${day} Tháng ${month}, ${year}`
    },
    
    // Social sharing methods
    shareOnFacebook() {
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(this.article.title)
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400')
    },
    
    shareOnTwitter() {
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(`${this.article.title} - ${this.article.excerpt.substring(0, 200)}...`)
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400')
    },
    
    shareOnLinkedIn() {
      const url = encodeURIComponent(window.location.href)
      const title = encodeURIComponent(this.article.title)
      const summary = encodeURIComponent(this.article.excerpt)
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank', 'width=600,height=400')
    },
    
    shareViaEmail() {
      const subject = encodeURIComponent(`Chia sẻ: ${this.article.title}`)
      const body = encodeURIComponent(`Tôi nghĩ bạn sẽ thích bài viết này:\n\n${this.article.title}\n${this.article.excerpt}\n\nĐọc thêm tại: ${window.location.href}`)
      window.location.href = `mailto:?subject=${subject}&body=${body}`
    },
    
    async copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Đã copy link bài viết vào clipboard!')
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = window.location.href
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('Đã copy link bài viết!')
      }
    },
    
    async submitComment() {
      // Validate form
      if (!this.commentForm.comment.trim() || !this.commentForm.name.trim() || !this.commentForm.email.trim()) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.commentForm.email)) {
        alert('Vui lòng nhập email hợp lệ')
        return
      }
      
      this.submittingComment = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // TODO: Replace with actual API call
        console.log('Comment submitted:', {
          articleId: this.articleId,
          ...this.commentForm
        })
        
        // Show success message
        this.commentSubmitted = true
        
        // Reset form
        this.commentForm = {
          comment: '',
          name: '',
          email: '',
          website: '',
          saveInfo: false
        }
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.commentSubmitted = false
        }, 5000)
        
      } catch (error) {
        console.error('Error submitting comment:', error)
        alert('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại sau.')
      } finally {
        this.submittingComment = false
      }
    },
    
    viewArticle(articleId) {
      // Navigate to another article
      this.$router.push(`/article/${articleId}`)
    }
  },
  
  watch: {
    // Watch for route changes to load new article
    '$route'() {
      this.loadArticle()
      // Reset comment form and states
      this.commentSubmitted = false
      this.commentForm = {
        comment: '',
        name: '',
        email: '',
        website: '',
        saveInfo: false
      }
    }
  },
  
  mounted() {
    this.loadArticle()
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Article content styling */
.article-content {
  font-size: 1.125rem;
  line-height: 1.75;
  color: #374151;
}

.article-content h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 2rem 0 1rem 0;
  color: #1f2937;
}

.article-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem 0;
  color: #1f2937;
}

.article-content p {
  margin: 1rem 0;
  text-align: justify;
}

.article-content ul, .article-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.article-content li {
  margin: 0.5rem 0;
}

.article-content strong {
  font-weight: 600;
  color: #1f2937;
}

/* Transition effects */
.transition-colors {
  transition: color 0.3s ease;
}

.transition-shadow {
  transition: box-shadow 0.3s ease;
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Social sharing buttons */
.social-share-btn {
  transition: all 0.3s ease;
}

.social-share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Form styling */
input:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Comment form animation */
.comment-success {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading animation */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .text-3xl {
    font-size: 2rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
  
  .article-content {
    font-size: 1rem;
  }
}

/* Print styles */
@media print {
  .social-share-btn, 
  .comment-section,
  header,
  footer {
    display: none;
  }
  
  .article-content {
    font-size: 12pt;
    line-height: 1.5;
  }
}
</style>