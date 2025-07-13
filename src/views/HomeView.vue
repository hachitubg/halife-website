<template>
  <div class="home-view">
    <!-- Header Component -->
    <Header 
      @search="handleSearch"
      :categories="categories"
    />

    <!-- Mobile Hero Banner (chỉ hiển thị trên mobile) -->
    <div class="md:hidden bg-gradient-to-r from-blue-400 to-cyan-400 p-4">
      <div class="bg-white bg-opacity-20 rounded-lg p-4 text-white text-center">
        <div class="flex items-center justify-center mb-2">
          <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=50&h=50&fit=crop&crop=center" alt="HALIFE" class="h-12 w-12 rounded-full mr-3">
          <div>
            <h2 class="text-xl font-bold">THUỐC THÚ Y</h2>
            <h3 class="text-lg font-bold">CHẤT LƯỢNG CAO</h3>
          </div>
        </div>
        <div class="text-sm mb-2">GIẢM ĐẾN</div>
        <div class="text-4xl font-bold mb-3">30%</div>
        <button @click="$router.push('/products')" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
          MUA NGAY ▶
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main>
      <!-- Desktop Category Sidebar & Hero Banner -->
      <div class="hidden md:block container mx-auto px-4 py-6">
        <div class="flex gap-6">
          <!-- Sidebar -->
          <div class="w-72 bg-white rounded-lg shadow-sm p-4">
            <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
              <i class="fas fa-list mr-2 text-blue-500"></i>
              Danh mục sản phẩm
            </h3>
            <div class="space-y-2">
              <div 
                v-for="category in categories" 
                :key="category.name" 
                @click="navigateToCategory(category.name)"
                class="flex items-center p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors group"
              >
                <i :class="category.icon + ' text-blue-500 mr-3 group-hover:text-blue-600'"></i>
                <span class="group-hover:text-blue-600">{{ category.name }}</span>
                <i class="fas fa-chevron-right ml-auto text-gray-400 group-hover:text-blue-500"></i>
              </div>
            </div>
          </div>

          <!-- Hero Banner -->
          <div class="flex-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg p-8 text-white relative overflow-hidden">
            <div class="relative z-10">
              <h2 class="text-4xl font-bold mb-4">
                <span class="text-blue-100">THUỐC THÚ Y</span><br>
                <span class="text-white">CHẤT LƯỢNG CAO</span>
              </h2>
              <p class="text-xl mb-2">CÔNG NGHỆ NHẬT BẢN</p>
              <p class="text-lg mb-6">GIẢM ĐẾN</p>
              <div class="text-6xl font-bold mb-6">30%</div>
              <div class="flex space-x-4">
                <button @click="$router.push('/products')" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  MUA NGAY ▶
                </button>
                <button @click="scrollToProducts" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  XEM SẢN PHẨM
                </button>
              </div>
            </div>
            <!-- Decorative elements -->
            <div class="absolute top-10 right-10 opacity-20">
              <i class="fas fa-pills text-6xl"></i>
            </div>
            <div class="absolute bottom-10 right-20 opacity-10">
              <i class="fas fa-heartbeat text-8xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Company Features -->
      <div class="bg-gray-50 py-8 md:py-12">
        <div class="container mx-auto px-4">
          <div class="text-center mb-8">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Tại sao chọn HALIFE?
            </h2>
            <p class="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm thuốc thú y chất lượng cao với công nghệ tiên tiến từ Nhật Bản
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-award text-2xl text-blue-600"></i>
              </div>
              <h3 class="font-semibold text-lg mb-2">Chất lượng cao</h3>
              <p class="text-gray-600 text-sm">Sản phẩm được kiểm nghiệm nghiêm ngặt theo tiêu chuẩn quốc tế</p>
            </div>
            
            <div class="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-flask text-2xl text-green-600"></i>
              </div>
              <h3 class="font-semibold text-lg mb-2">Công nghệ Nhật Bản</h3>
              <p class="text-gray-600 text-sm">Ứng dụng công nghệ tiên tiến và quy trình sản xuất hiện đại</p>
            </div>
            
            <div class="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-shipping-fast text-2xl text-orange-600"></i>
              </div>
              <h3 class="font-semibold text-lg mb-2">Giao hàng nhanh</h3>
              <p class="text-gray-600 text-sm">Hệ thống phân phối toàn quốc, giao hàng trong 24h</p>
            </div>
            
            <div class="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-headset text-2xl text-purple-600"></i>
              </div>
              <h3 class="font-semibold text-lg mb-2">Hỗ trợ 24/7</h3>
              <p class="text-gray-600 text-sm">Đội ngũ chuyên gia thú y sẵn sàng tư vấn mọi lúc</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Products -->
      <div id="products" class="container mx-auto px-4 py-8 md:py-12">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-blue-600 flex items-center mb-2">
                <i class="fas fa-fire text-orange-500 mr-2"></i>
                SẢN PHẨM NỔI BẬT
              </h3>
              <p class="text-gray-600 text-sm">Những sản phẩm được tin dùng nhất</p>
            </div>
            <div class="flex items-center space-x-3">
              <button @click="$router.push('/products')" class="text-blue-500 hover:text-blue-700 text-sm font-medium">
                Xem tất cả →
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            <ProductCard
              v-for="product in featuredProducts"
              :key="product.id"
              :product="product"
              :show-quick-actions="true"
              @add-to-cart="addToCart"
              @quick-view="showProductQuickView"
              @add-to-wishlist="addToWishlist"
              @compare="addToCompare"
              @share="shareProduct"
            />
          </div>

          <!-- Debug info cho featured products -->
          <div v-if="debugMode" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <p><strong>Debug - Featured Products:</strong> {{ featuredProducts.length }} sản phẩm</p>
            <p><strong>Total Products:</strong> {{ allProducts.length }} sản phẩm</p>
          </div>
        </div>
      </div>

      <!-- Products by Categories (3 categories only) -->
      <div class="container mx-auto px-4 py-8 md:py-12">
        <div v-for="category in selectedCategories" :key="category" class="mb-12">
          <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center mb-2">
                  <i :class="getCategoryIcon(category) + ' text-blue-500 mr-2'"></i>
                  {{ category }}
                </h3>
                <p class="text-gray-600 text-sm">{{ getProductCountByCategory(category) }} sản phẩm có sẵn</p>
              </div>
              <button @click="navigateToCategory(category)" class="text-blue-500 hover:text-blue-700 text-sm font-medium">
                Xem tất cả →
              </button>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              <ProductCard
                v-for="product in getCategoryProducts(category, 5)"
                :key="product.id"
                :product="product"
                :show-quick-actions="true"
                @add-to-cart="addToCart"
                @quick-view="showProductQuickView"
                @add-to-wishlist="addToWishlist"
                @compare="addToCompare"
                @share="shareProduct"
              />
            </div>

            <!-- Debug info cho từng category -->
            <div v-if="debugMode" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
              <p><strong>Debug - {{ category }}:</strong> {{ getCategoryProducts(category, 5).length }}/{{ getProductCountByCategory(category) }} sản phẩm hiển thị</p>
              <p><strong>Products:</strong> {{ getCategoryProducts(category, 5).map(p => p.name).join(', ') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest News -->
      <div class="container mx-auto px-4 py-8 md:py-12">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-blue-600 flex items-center mb-2">
                <i class="fas fa-newspaper text-green-500 mr-2"></i>
                TIN TỨC & KIẾN THỨC
              </h3>
              <p class="text-gray-600 text-sm">Cập nhật thông tin và kiến thức chuyên môn</p>
            </div>
            <button @click="$router.push('/news')" class="text-blue-500 hover:text-blue-700 text-sm font-medium">
              Xem tất cả →
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <NewsCard
              v-for="article in latestNews"
              :key="article.id"
              :article="article"
              :show-social-proof="false"
              @read-more="readArticle"
              @show-comments="showComments"
              @share="shareArticle"
              @like="likeArticle"
            />
          </div>

          <!-- Debug info cho news -->
          <div v-if="debugMode" class="mt-4 p-3 bg-green-50 border border-green-200 rounded text-sm">
            <p><strong>Debug - Latest News:</strong> {{ latestNews.length }} bài viết</p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 py-12 md:py-16">
        <div class="container mx-auto px-4 text-center text-white">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">
            Cần tư vấn về sản phẩm?
          </h2>
          <p class="text-lg md:text-xl mb-8 opacity-90">
            Đội ngũ chuyên gia thú y của chúng tôi sẵn sàng hỗ trợ bạn 24/7
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0866583223" class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center">
              <i class="fas fa-phone mr-2"></i>
              Gọi ngay: 0866.583.223
            </a>
            <button @click="$router.push('/products')" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Xem sản phẩm
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Component -->
    <Footer />

    <!-- Debug Toggle (chỉ hiện trong development) -->
    <button 
      v-if="isDevelopment"
      @click="debugMode = !debugMode"
      class="fixed bottom-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 z-50"
      title="Toggle Debug Mode"
    >
      <i class="fas fa-bug"></i>
    </button>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProductCard from '@/components/ProductCard.vue'
import NewsCard from '@/components/NewsCard.vue'

// Import data từ các file riêng biệt
import { 
  products, 
  productCategories, 
  sidebarCategories, 
  getFeaturedProducts, 
  getProductsByCategory,
  dataAPI
} from '@/data/products.js'

import { 
  news, 
  getLatestNews 
} from '@/data/news.js'

export default {
  name: 'HomeView',
  components: {
    Header,
    Footer,
    ProductCard,
    NewsCard
  },
  data() {
    return {
      // Data được import từ các file riêng
      categories: sidebarCategories,
      productCategories: productCategories,
      allProducts: [], // Reactive array cho products
      news: news,
      
      // UI state
      currentProductSlide: 0,
      debugMode: false,
      dataLoaded: false
    }
  },

  computed: {
    isDevelopment() {
      return import.meta.env.DEV
    },

    featuredProducts() {
      if (!this.dataLoaded || this.allProducts.length === 0) {
        console.log('🔍 Featured products: No data loaded yet')
        return []
      }
      
      const featured = getFeaturedProducts()
      console.log('🔍 Featured products:', featured.length, 'sản phẩm')
      return featured
    },

    latestNews() {
      const latest = getLatestNews(3)
      console.log('🔍 Latest news:', latest.length, 'bài viết')
      return latest
    },

    // Chọn 3 danh mục đầu tiên (bỏ "Tất cả")
    selectedCategories() {
      if (!this.dataLoaded) return []
      
      // Lấy danh mục từ productCategories (bỏ "Tất cả")
      const categories = this.productCategories.filter(cat => cat !== 'Tất cả').slice(0, 3)
      console.log('🔍 Selected categories:', categories)
      return categories
    }
  },

  methods: {
    async loadData() {
      console.log('🚀 HomeView: Loading data...')
      
      try {
        // Đợi data được load
        if (!dataAPI.isLoaded) {
          console.log('⏳ Waiting for data to load...')
          await this.waitForDataLoad()
        }
        
        // Update reactive data
        this.allProducts = [...products] // Copy để trigger reactivity
        this.dataLoaded = true
        
        console.log('✅ HomeView: Data loaded successfully')
        console.log('📊 Products:', this.allProducts.length)
        console.log('📂 Categories:', this.productCategories.length)
        
      } catch (error) {
        console.error('❌ HomeView: Error loading data:', error)
        // Vẫn set dataLoaded = true để hiển thị UI với fallback data
        this.dataLoaded = true
      }
    },

    async waitForDataLoad() {
      return new Promise((resolve) => {
        const checkData = () => {
          if (dataAPI.isLoaded && products.length > 0) {
            resolve()
          } else {
            setTimeout(checkData, 100)
          }
        }
        checkData()
      })
    },

    handleSearch(query) {
      // Redirect to products page with search query
      this.$router.push({
        path: '/products',
        query: { search: query }
      })
    },
    
    navigateToCategory(category) {
      // Navigate to products page with category filter
      this.$router.push({
        path: '/products',
        query: { category: category }
      })
    },
    
    getProductCountByCategory(category) {
      if (!this.dataLoaded) return 0
      const count = getProductsByCategory(category).length
      console.log(`🔍 ${category}: ${count} sản phẩm`)
      return count
    },

    // Lấy sản phẩm theo danh mục với giới hạn số lượng
    getCategoryProducts(category, limit = 5) {
      if (!this.dataLoaded) return []
      
      const products = getProductsByCategory(category).slice(0, limit)
      console.log(`🔍 ${category} products (${limit}):`, products.length, 'sản phẩm')
      return products
    },

    // Lấy icon cho danh mục
    getCategoryIcon(categoryName) {
      const category = this.categories.find(cat => cat.name === categoryName)
      return category ? category.icon : 'fas fa-pills'
    },
    
    scrollToProducts() {
      const element = document.getElementById('products')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
    
    slideProducts(direction) {
      // TODO: Implement product carousel
      console.log('Slide products:', direction)
    },

    // Product actions
    addToCart(product) {
      console.log('Thêm vào giỏ hàng:', product.name)
      alert(`Đã thêm "${product.name}" vào giỏ hàng`)
    },

    showProductQuickView(product) {
      console.log('Xem nhanh sản phẩm:', product.name)
      alert(`Xem nhanh: ${product.name}`)
    },

    addToWishlist(product) {
      console.log('Thêm vào yêu thích:', product.name)
      alert(`Đã thêm "${product.name}" vào danh sách yêu thích`)
    },

    addToCompare(product) {
      console.log('Thêm vào so sánh:', product.name)
      alert(`Đã thêm "${product.name}" vào danh sách so sánh`)
    },

    shareProduct(product) {
      console.log('Chia sẻ sản phẩm:', product.name)
      if (navigator.share) {
        navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        })
      } else {
        alert('Đã copy link sản phẩm')
      }
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
    }
  },

  async mounted() {
    console.log('🎯 HomeView mounted')
    
    // Load data
    await this.loadData()
    
    // Listen for data updates từ dataAPI
    dataAPI.onDataLoaded(() => {
      console.log('🔄 HomeView: Data updated, reloading...')
      this.loadData()
    })
  },

  beforeUnmount() {
    // Cleanup listeners
    dataAPI.offDataLoaded(this.loadData)
  }
}
</script>

<style scoped>
.home-view {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Hero banner animations */
.hero-element {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Category hover effects */
.category-item:hover {
  transform: translateY(-5px);
  transition: all 0.3s ease;
}

/* Feature card hover effects */
.feature-card:hover {
  transform: translateY(-3px);
  transition: all 0.3s ease;
}

/* CTA button animations */
.cta-button:hover {
  transform: scale(1.05);
  transition: all 0.3s ease;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-6xl {
    font-size: 3rem;
  }
}

/* Section spacing */
.section-spacing {
  padding: 4rem 0;
}

@media (max-width: 768px) {
  .section-spacing {
    padding: 2rem 0;
  }
}
</style>