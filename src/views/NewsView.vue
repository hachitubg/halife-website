<template>
  <div class="news-view">
    <!-- Header Component -->
    <Header 
      @navigate="handleNavigate" 
      @search="handleSearch"
      :categories="categories"
    />

    <!-- Breadcrumb -->
    <div class="bg-gray-50 py-3 md:py-4">
      <div class="container mx-auto px-4">
        <nav class="flex items-center space-x-2 text-sm">
          <a href="/" class="text-blue-500 hover:text-blue-700">Trang chủ</a>
          <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
          <span class="text-gray-600">Tin tức</span>
          <span v-if="selectedCategory !== 'Tất cả'" class="text-gray-400">
            <i class="fas fa-chevron-right text-xs mr-2"></i>
            {{ selectedCategory }}
          </span>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-6 md:py-8">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar -->
        <div class="lg:w-80">

          <!-- Filters Content -->
          <div class="lg:block hidden">
            <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-6">
              <!-- Categories Filter -->
              <div>
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="fas fa-list mr-2 text-green-500"></i>
                  Danh mục tin tức
                </h3>
                <div class="space-y-2">
                  <label 
                    v-for="category in newsCategories" 
                    :key="category"
                    class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input 
                      type="radio" 
                      :value="category" 
                      v-model="selectedCategory"
                      class="mr-3 text-green-500"
                    >
                    <span class="text-sm">{{ category }}</span>
                    <span class="ml-auto text-xs text-gray-500">({{ getNewsCountByCategory(category) }})</span>
                  </label>
                </div>
              </div>

              <!-- Date Filter -->
              <div>
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="fas fa-calendar mr-2 text-green-500"></i>
                  Thời gian
                </h3>
                <div class="space-y-2">
                  <label v-for="dateRange in dateRanges" :key="dateRange.label" class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input 
                      type="radio" 
                      :value="dateRange" 
                      v-model="selectedDateRange"
                      class="mr-3 text-green-500"
                    >
                    <span class="text-sm">{{ dateRange.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Author Filter -->
              <div>
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="fas fa-user mr-2 text-green-500"></i>
                  Tác giả
                </h3>
                <div class="space-y-2 max-h-40 overflow-y-auto">
                  <label v-for="author in uniqueAuthors" :key="author" class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input 
                      type="checkbox" 
                      :value="author" 
                      v-model="selectedAuthors"
                      class="mr-3 text-green-500"
                    >
                    <span class="text-sm">{{ author }}</span>
                  </label>
                </div>
              </div>

              <!-- Content Type Filter -->
              <div>
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="fas fa-star mr-2 text-green-500"></i>
                  Loại nội dung
                </h3>
                <div class="space-y-2">
                  <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input 
                      type="checkbox" 
                      v-model="showFeaturedOnly"
                      class="mr-3 text-green-500"
                    >
                    <span class="text-sm">Tin nổi bật</span>
                  </label>
                  <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input 
                      type="checkbox" 
                      v-model="showPopularOnly"
                      class="mr-3 text-green-500"
                    >
                    <span class="text-sm">Tin phổ biến</span>
                  </label>
                </div>
              </div>

              <!-- Clear Filters -->
              <button 
                @click="clearAllFilters"
                class="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i class="fas fa-refresh mr-2"></i>
                Xóa bộ lọc
              </button>
            </div>

            <!-- Popular Articles Widget -->
            <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 mt-6">
              <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-fire mr-2 text-orange-500"></i>
                Tin phổ biến
              </h3>
              <div class="space-y-3">
                <div v-for="(article, index) in popularArticles.slice(0, 5)" :key="article.id" class="flex items-start space-x-3">
                  <span class="bg-orange-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                    {{ index + 1 }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600" @click="readArticle(article)">
                      {{ article.title }}
                    </h4>
                    <p class="text-xs text-gray-500 mt-1">{{ article.views }} lượt xem</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- News Content -->
        <div class="flex-1">
          <!-- Search Results Info -->
          <div v-if="searchResults" class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 class="font-semibold text-green-800 mb-2">
              <i class="fas fa-search mr-2"></i>
              Kết quả tìm kiếm cho "{{ searchQuery }}"
            </h2>
            <p class="text-green-600 text-sm">
              Tìm thấy {{ filteredNews.length }} bài viết
              <button @click="clearSearch" class="ml-2 text-green-800 hover:text-green-900 underline">
                Xóa tìm kiếm
              </button>
            </p>
          </div>

          <!-- News Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {{ selectedCategory === 'Tất cả' ? 'Tất cả tin tức' : selectedCategory }}
              </h1>
              <p class="text-gray-600 text-sm md:text-base">
                Hiển thị {{ filteredNews.length }} bài viết
              </p>
            </div>

            <!-- Sort Options -->
            <div class="mt-4 md:mt-0">
              <select 
                v-model="sortBy" 
                class="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="popular">Phổ biến nhất</option>
                <option value="title-asc">Tiêu đề A-Z</option>
                <option value="title-desc">Tiêu đề Z-A</option>
              </select>
            </div>
          </div>

          <!-- Featured Article (if exists and not searching) -->
          <div v-if="!searchResults && featuredArticle" class="mb-8">
            <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 md:p-6 border">
              <div class="flex flex-col lg:flex-row gap-6">
                <img :src="featuredArticle.image" :alt="featuredArticle.title" class="w-full lg:w-1/3 h-48 md:h-64 object-cover rounded-lg">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-3">
                    <span class="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">{{ featuredArticle.category }}</span>
                    <span class="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      <i class="fas fa-star mr-1"></i>Nổi bật
                    </span>
                  </div>
                  <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-3 cursor-pointer hover:text-blue-600" @click="readArticle(featuredArticle)">
                    {{ featuredArticle.title }}
                  </h2>
                  <p class="text-gray-600 mb-4">{{ featuredArticle.excerpt }}</p>
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div class="flex items-center text-sm text-gray-500 space-x-4">
                      <span>
                        <i class="fas fa-calendar mr-1"></i>
                        {{ featuredArticle.date }}
                      </span>
                      <span>
                        <i class="fas fa-user mr-1"></i>
                        {{ featuredArticle.author }}
                      </span>
                      <span>
                        <i class="fas fa-eye mr-1"></i>
                        {{ featuredArticle.views }} lượt xem
                      </span>
                    </div>
                    <button @click="readArticle(featuredArticle)" class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                      Đọc bài viết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- News Grid -->
          <div v-if="paginatedNews.length > 0">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              <NewsCard
                v-for="article in paginatedNews"
                :key="article.id"
                :article="article"
                :show-social-proof="true"
                @read-more="readArticle"
                @show-comments="showComments"
                @share="shareArticle"
                @like="likeArticle"
              />
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="flex justify-center mt-8">
              <div class="flex items-center space-x-2">
                <button 
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                
                <span 
                  v-for="page in visiblePages" 
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'px-3 py-2 rounded-lg cursor-pointer',
                    page === currentPage ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  ]"
                >
                  {{ page }}
                </span>
                
                <button 
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- No News Found -->
          <div v-else class="text-center py-12">
            <i class="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy bài viết</h3>
            <p class="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button 
              @click="clearAllFilters"
              class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import NewsCard from '@/components/NewsCard.vue'

import { sidebarCategories } from '@/data/products.js'

import { 
  newsCategories, 
  getNewsByCategory,
  getFeaturedNews,
  getPopularNews,
  searchNews,
  newsService 
} from '@/data/news.js'

export default {
  name: 'NewsView',
  components: {
    Header,
    Footer,
    NewsCard
  },
  data() {
    return {
      // Data
      newsCategories: newsCategories,
      news: [],
      newsLoaded: false,
      
      // Filters
      selectedCategory: 'Tất cả',
      selectedDateRange: null,
      selectedAuthors: [],
      showFeaturedOnly: false,
      showPopularOnly: false,
      
      // Search
      searchResults: null,
      searchQuery: '',
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 9,
      
      // Sort
      sortBy: 'newest',
      
      // Date ranges
      dateRanges: [
        { label: 'Tất cả', days: null },
        { label: '7 ngày qua', days: 7 },
        { label: '30 ngày qua', days: 30 }
      ]
    }
  },
  
  computed: {
    uniqueAuthors() {
      const authors = [...new Set(this.news.map(article => article.author).filter(Boolean))]
      return authors.sort()
    },
    
    popularArticles() {
      return getPopularNews(10)
    },
    
    featuredArticle() {
      const featured = getFeaturedNews()
      return featured.length > 0 ? featured[0] : null
    },
    
    filteredNews() {
      let result = this.searchResults || getNewsByCategory(this.selectedCategory)
      
      // Filter by date range
      if (this.selectedDateRange && this.selectedDateRange.days) {
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - this.selectedDateRange.days)
        
        result = result.filter(article => {
          const articleDate = new Date(article.date)
          return articleDate >= cutoffDate
        })
      }
      
      // Filter by authors
      if (this.selectedAuthors.length > 0) {
        result = result.filter(article => this.selectedAuthors.includes(article.author))
      }
      
      // Filter by featured
      if (this.showFeaturedOnly) {
        result = result.filter(article => article.isFeatured)
      }
      
      // Filter by popular (high view count)
      if (this.showPopularOnly) {
        result = result.filter(article => (article.views || 0) > 1000)
      }
      
      // Sort news
      return this.sortNews(result)
    },
    
    paginatedNews() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      let result = this.filteredNews.slice(start, end)
      
      // Exclude featured article from grid if it's the first item and we're showing featured
      if (!this.searchResults && this.featuredArticle && this.currentPage === 1) {
        result = result.filter(article => article.id !== this.featuredArticle.id)
      }
      
      return result
    },
    
    totalPages() {
      let totalItems = this.filteredNews.length
      // Subtract 1 if featured article is shown separately
      if (!this.searchResults && this.featuredArticle) {
        totalItems = Math.max(0, totalItems - 1)
      }
      return Math.ceil(totalItems / this.itemsPerPage)
    },
    
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  
  methods: {
    handleNavigate(view) {
      if (view === 'home') {
        this.$router.push('/')
      } else if (view === 'products') {
        this.$router.push('/products')
      }
    },
    
    handleSearch(query) {
      this.searchQuery = query
      this.searchResults = searchNews(query)
      this.currentPage = 1
    },
    
    clearSearch() {
      this.searchResults = null
      this.searchQuery = ''
      
      // Remove search query from URL
      const query = { ...this.$route.query }
      delete query.search
      this.$router.replace({ path: '/news', query })
    },
    
    getNewsCountByCategory(category) {
      if (category === 'Tất cả') return this.news.filter(article => article.isPublished).length
      return this.news.filter(article => article.category === category && article.isPublished).length
    },
    
    sortNews(articles) {
      const sorted = [...articles]
      
      switch (this.sortBy) {
        case 'newest':
          return sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
        case 'oldest':
          return sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
        case 'popular':
          return sorted.sort((a, b) => (b.views || 0) - (a.views || 0))
        case 'title-asc':
          return sorted.sort((a, b) => a.title.localeCompare(b.title))
        case 'title-desc':
          return sorted.sort((a, b) => b.title.localeCompare(a.title))
        default:
          return sorted
      }
    },
    
    clearAllFilters() {
      this.selectedCategory = 'Tất cả'
      this.selectedDateRange = null
      this.selectedAuthors = []
      this.showFeaturedOnly = false
      this.showPopularOnly = false
      this.currentPage = 1
      this.clearSearch()
    },
    
    // News actions
    readArticle(article) {
      this.$router.push(`/article/${article.id}`)
    },
    
    showComments(article) {
      console.log('Hiển thị bình luận cho:', article.title)
      alert('Tính năng bình luận đang phát triển')
    },
    
    shareArticle(article) {
      console.log('Chia sẻ bài viết:', article.title)
      if (navigator.share) {
        navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        })
      } else {
        alert('Đã copy link bài viết')
      }
    },
    
    likeArticle(data) {
      const { article, isLiked } = data
      console.log(isLiked ? 'Đã thích:' : 'Bỏ thích:', article.title)
      
      const newsItem = this.news.find(item => item.id === article.id)
      if (newsItem) {
        if (isLiked) {
          newsItem.likes = (newsItem.likes || 0) + 1
          newsItem.isLiked = true
        } else {
          newsItem.likes = Math.max((newsItem.likes || 1) - 1, 0)
          newsItem.isLiked = false
        }
      }
    },

    async loadNews() {
      try {
        await newsService.getAllNews()
        this.news = newsService.newsData || []
        this.newsLoaded = true
      } catch (error) {
        console.error('Error loading news:', error)
        this.newsLoaded = true
      }
    }
  },
  
  watch: {
    selectedCategory() {
      this.currentPage = 1
    },
    
    selectedDateRange() {
      this.currentPage = 1
    },
    
    selectedAuthors() {
      this.currentPage = 1
    },
    
    showFeaturedOnly() {
      this.currentPage = 1
    },
    
    showPopularOnly() {
      this.currentPage = 1
    },
    
    sortBy() {
      this.currentPage = 1
    }
  },
  
  async mounted() {
    await this.loadNews() // THÊM DÒNG NÀY
    
    // Set default date range
    this.selectedDateRange = this.dateRanges[0]
    
    // Handle URL query parameters
    const query = this.$route.query
    
    // Handle search query from URL
    if (query.search) {
      this.handleSearch(query.search)
    }
    
    // Handle category filter from URL
    if (query.category && this.newsCategories.includes(query.category)) {
      this.selectedCategory = query.category
    }
  }
}
</script>

<style scoped>
/* Mobile filter animation */
@media (max-width: 1024px) {
  .mobile-filters-enter-active,
  .mobile-filters-leave-active {
    transition: all 0.3s ease;
  }
  
  .mobile-filters-enter-from,
  .mobile-filters-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Ensure consistent grid item heights */
.grid > * {
  height: fit-content;
}

/* Custom checkbox and radio styles */
input[type="checkbox"],
input[type="radio"] {
  width: 16px;
  height: 16px;
}

/* Popular articles widget scrollbar */
.space-y-3 {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #f9fafb;
}

.space-y-3::-webkit-scrollbar {
  width: 4px;
}

.space-y-3::-webkit-scrollbar-track {
  background: #f9fafb;
}

.space-y-3::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}

/* Featured article hover effect */
.featured-article-title:hover {
  color: #2563eb;
  transition: color 0.3s ease;
}

/* Pagination hover effects */
.pagination-item:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>