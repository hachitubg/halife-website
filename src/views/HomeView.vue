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
          <img src="/public/images/logo_black.png" alt="HALIFE" class="h-12 w-12 rounded-full mr-3">
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
      <!-- <div class="bg-gray-50 py-8 md:py-12">
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
      </div> -->

      <!-- Featured Products -->
      <div id="products" class="container mx-auto px-4 py-8 md:py-12">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center mb-2">
                <div class="bg-yellow-100 p-2 rounded-lg mr-3">
                  <i class="fas fa-star text-yellow-500"></i>
                </div>
                SẢN PHẨM NỔI BẬT
              </h3>
              <p class="text-gray-600 text-sm">Những sản phẩm được tin dùng nhất</p>
            </div>
            <div class="flex items-center space-x-3">
              <!-- Navigation for large screens -->
              <div class="hidden lg:flex items-center space-x-2">
                <button 
                  @click="prevFeaturedSlide" 
                  :disabled="currentFeaturedSlide === 0"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-chevron-left text-gray-600"></i>
                </button>
                <button 
                  @click="nextFeaturedSlide"
                  :disabled="currentFeaturedSlide >= maxFeaturedSlide"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-chevron-right text-gray-600"></i>
                </button>
              </div>
              <button @click="$router.push('/products')" class="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                Xem tất cả <i class="fas fa-arrow-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
          
          <!-- Products Carousel -->
          <div class="relative overflow-hidden">
            <div 
              class="flex transition-transform duration-300 ease-in-out"
              :style="{ transform: `translateX(-${currentFeaturedSlide * 100}%)` }"
            >
              <div 
                v-for="slide in featuredSlides" 
                :key="slide"
                class="w-full flex-shrink-0"
              >
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  <ProductCard
                    v-for="product in getFeaturedSlideProducts(slide)"
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
              </div>
            </div>
          </div>
          
          <!-- Mobile navigation và indicators -->
          <div v-if="featuredSlides.length > 1" class="lg:hidden mt-6 flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <button 
                @click="prevFeaturedSlide" 
                :disabled="currentFeaturedSlide === 0"
                class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-chevron-left text-gray-600"></i>
              </button>
              <button 
                @click="nextFeaturedSlide"
                :disabled="currentFeaturedSlide >= maxFeaturedSlide"
                class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-chevron-right text-gray-600"></i>
              </button>
            </div>
            
            <!-- Slide indicators -->
            <div class="flex items-center space-x-1">
              <div 
                v-for="n in featuredSlides.length" 
                :key="n"
                @click="currentFeaturedSlide = n - 1"
                class="w-2 h-2 rounded-full transition-colors cursor-pointer"
                :class="currentFeaturedSlide === n - 1 ? 'bg-blue-500' : 'bg-gray-300'"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products by Categories -->
      <div class="container mx-auto px-4 py-8 md:py-12">
        <div v-for="(category, index) in selectedCategories" :key="category" class="mb-12">
          <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <!-- Category Header -->
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center mb-2">
                  <div class="bg-blue-100 p-2 rounded-lg mr-3">
                    <i :class="getCategoryIcon(category) + ' text-blue-500'"></i>
                  </div>
                  {{ category }}
                </h3>
                <p class="text-gray-600 text-sm">{{ getProductCountByCategory(category) }} sản phẩm có sẵn</p>
              </div>
              <div class="flex items-center space-x-3">
                <!-- Navigation buttons -->
                <div class="hidden lg:flex items-center space-x-2">
                  <button 
                    @click="prevCategorySlide(index)" 
                    :disabled="getCategoryCurrentSlide(index) === 0"
                    class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <i class="fas fa-chevron-left text-gray-600"></i>
                  </button>
                  <button 
                    @click="nextCategorySlide(index)"
                    :disabled="getCategoryCurrentSlide(index) >= getCategoryMaxSlide(category)"
                    class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <i class="fas fa-chevron-right text-gray-600"></i>
                  </button>
                </div>
                <button @click="navigateToCategory(category)" class="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                  Xem tất cả <i class="fas fa-arrow-right ml-1 text-xs"></i>
                </button>
              </div>
            </div>
            
            <!-- Category Products Carousel -->
            <div class="relative overflow-hidden">
              <div 
                class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${getCategoryCurrentSlide(index) * 100}%)` }"
              >
                <div 
                  v-for="slide in getCategorySlides(category)" 
                  :key="slide"
                  class="w-full flex-shrink-0"
                >
                  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    <ProductCard
                      v-for="product in getCategorySlideProducts(category, slide)"
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
                </div>
              </div>
            </div>
            
            <!-- Mobile navigation cho category -->
            <div v-if="getCategorySlides(category).length > 1" class="lg:hidden mt-6 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <button 
                  @click="prevCategorySlide(index)" 
                  :disabled="getCategoryCurrentSlide(index) === 0"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-left text-gray-600"></i>
                </button>
                <button 
                  @click="nextCategorySlide(index)"
                  :disabled="getCategoryCurrentSlide(index) >= getCategoryMaxSlide(category)"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-right text-gray-600"></i>
                </button>
              </div>
              
              <!-- Slide indicators cho category -->
              <div class="flex items-center space-x-1">
                <div 
                  v-for="n in getCategorySlides(category).length" 
                  :key="n"
                  @click="setCategorySlide(index, n - 1)"
                  class="w-2 h-2 rounded-full transition-colors cursor-pointer"
                  :class="getCategoryCurrentSlide(index) === n - 1 ? 'bg-blue-500' : 'bg-gray-300'"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest News -->
      <div class="container mx-auto px-4 py-8 md:py-12">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center mb-2">
                <div class="bg-green-100 p-2 rounded-lg mr-3">
                  <i class="fas fa-newspaper text-green-500"></i>
                </div>
                TIN TỨC & KIẾN THỨC
              </h3>
              <p class="text-gray-600 text-sm">Cập nhật thông tin và kiến thức chuyên môn</p>
            </div>
            <button @click="$router.push('/news')" class="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
              Xem tất cả <i class="fas fa-arrow-right ml-1 text-xs"></i>
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
      
      // Carousel state
      currentFeaturedSlide: 0,
      categorySlides: {}, // Track slides for each category
      itemsPerSlide: 5, // Số sản phẩm mỗi slide
      dataLoaded: false
    }
  },

  computed: {
    featuredProducts() {
      if (!this.dataLoaded || this.allProducts.length === 0) {
        return []
      }
      
      const featured = getFeaturedProducts()
      return featured
    },

    latestNews() {
      const latest = getLatestNews(3)
      return latest
    },

    // Chọn 3 danh mục đầu tiên (bỏ "Tất cả")
    selectedCategories() {
      if (!this.dataLoaded) return []
      
      // Lấy danh mục từ productCategories (bỏ "Tất cả")
      const categories = this.productCategories.filter(cat => cat !== 'Tất cả').slice(0, 3)
      return categories
    },

    // Featured products carousel
    featuredSlides() {
      if (!this.featuredProducts.length) return []
      return Array.from({ length: Math.ceil(this.featuredProducts.length / this.itemsPerSlide) }, (_, i) => i)
    },

    maxFeaturedSlide() {
      return Math.max(0, this.featuredSlides.length - 1)
    }
  },

  methods: {
    async loadData() {
      try {
        // Đợi data được load
        if (!dataAPI.isLoaded) {
          await this.waitForDataLoad()
        }
        
        // Update reactive data
        this.allProducts = [...products]
        this.dataLoaded = true
        
        // Initialize category slides
        this.initializeCategorySlides()
        
      } catch (error) {
        console.error('❌ HomeView: Error loading data:', error)
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

    initializeCategorySlides() {
      this.selectedCategories.forEach((category, index) => {
        this.$set(this.categorySlides, index, 0)
      })
    },

    handleSearch(query) {
      this.$router.push({
        path: '/products',
        query: { search: query }
      })
    },
    
    navigateToCategory(category) {
      this.$router.push({
        path: '/products',
        query: { category: category }
      })
    },
    
    getProductCountByCategory(category) {
      if (!this.dataLoaded) return 0
      const count = getProductsByCategory(category).length
      return count
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

    // Featured products carousel methods
    getFeaturedSlideProducts(slideIndex) {
      const start = slideIndex * this.itemsPerSlide
      const end = start + this.itemsPerSlide
      return this.featuredProducts.slice(start, end)
    },

    nextFeaturedSlide() {
      if (this.currentFeaturedSlide < this.maxFeaturedSlide) {
        this.currentFeaturedSlide++
      }
    },

    prevFeaturedSlide() {
      if (this.currentFeaturedSlide > 0) {
        this.currentFeaturedSlide--
      }
    },

    // Category carousel methods
    getCategoryProducts(category) {
      if (!this.dataLoaded) return []
      return getProductsByCategory(category)
    },

    getCategorySlides(category) {
      const products = this.getCategoryProducts(category)
      if (!products.length) return []
      return Array.from({ length: Math.ceil(products.length / this.itemsPerSlide) }, (_, i) => i)
    },

    getCategorySlideProducts(category, slideIndex) {
      const products = this.getCategoryProducts(category)
      const start = slideIndex * this.itemsPerSlide
      const end = start + this.itemsPerSlide
      return products.slice(start, end)
    },

    getCategoryCurrentSlide(index) {
      return this.categorySlides[index] || 0
    },

    getCategoryMaxSlide(category) {
      return Math.max(0, this.getCategorySlides(category).length - 1)
    },

    nextCategorySlide(index) {
      const maxSlide = this.getCategoryMaxSlide(this.selectedCategories[index])
      if (this.getCategoryCurrentSlide(index) < maxSlide) {
        this.$set(this.categorySlides, index, this.getCategoryCurrentSlide(index) + 1)
      }
    },

    prevCategorySlide(index) {
      if (this.getCategoryCurrentSlide(index) > 0) {
        this.$set(this.categorySlides, index, this.getCategoryCurrentSlide(index) - 1)
      }
    },

    setCategorySlide(index, slideIndex) {
      this.$set(this.categorySlides, index, slideIndex)
    },

    // Product actions
    addToCart(product) {
      alert(`Đã thêm "${product.name}" vào giỏ hàng`)
    },

    showProductQuickView(product) {
      alert(`Xem nhanh: ${product.name}`)
    },

    addToWishlist(product) {
      alert(`Đã thêm "${product.name}" vào danh sách yêu thích`)
    },

    addToCompare(product) {
      alert(`Đã thêm "${product.name}" vào danh sách so sánh`)
    },

    shareProduct(product) {
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
      alert('Tính năng bình luận đang phát triển')
    },

    shareArticle(article) {
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
    // Load data
    await this.loadData()
    
    // Listen for data updates từ dataAPI
    dataAPI.onDataLoaded(() => {
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

/* Carousel transitions */
.carousel-slide {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Product card hover effects */
.product-card:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Section headers with icon backgrounds */
.section-icon {
  transition: all 0.3s ease;
}

.section-icon:hover {
  transform: scale(1.1);
}

/* Navigation button effects */
.nav-button {
  transition: all 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  transform: scale(1.05);
}

.nav-button:active:not(:disabled) {
  transform: scale(0.95);
}

/* Slide indicators */
.slide-indicator {
  transition: all 0.3s ease;
}

.slide-indicator:hover {
  transform: scale(1.2);
}

/* Category hover effects */
.category-item:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Feature card hover effects */
.feature-card:hover {
  transform: translateY(-3px);
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

/* Loading animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideInUp 0.6s ease-out;
}
</style>