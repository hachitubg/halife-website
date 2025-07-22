<template>
  <div class="home-view">
    <!-- Header Component -->
    <Header 
      @search="handleSearch"
      :categories="categories"
    />

    <!-- Hero Banner Slider -->
    <BannerHero />

    <!-- Main Content -->
    <main>
      <!-- Featured Products -->
      <div id="products" class="container mx-auto px-4 py-8 md:py-12">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
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
              <button @click="$router.push('/products')" class="hidden md:flex text-blue-500 hover:text-blue-700 text-sm font-medium items-center">
                Xem tất cả <i class="fas fa-arrow-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
          
          <!-- Mobile: Single product per slide with swipe -->
          <div class="block md:hidden">
            <div 
              class="relative overflow-hidden touch-pan-x"
              @touchstart="handleFeaturedTouchStart"
              @touchmove="handleFeaturedTouchMove"
              @touchend="handleFeaturedTouchEnd"
            >
              <div 
                class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${currentFeaturedSlide * 100}%)` }"
              >
                <div 
                  v-for="(product, index) in featuredProducts" 
                  :key="product.id"
                  class="w-full flex-shrink-0"
                >
                  <ProductCard
                    :product="product"
                    :show-quick-actions="true"
                    :show-description="true"
                    @add-to-cart="handleAddToCart"
                    @quick-view="showProductQuickView"
                    class="mx-auto product-card-mobile"
                  />
                </div>
              </div>
            </div>
            
            <!-- Mobile pagination dots -->
            <div v-if="featuredProducts.length > 1" class="mt-4 flex items-center justify-center space-x-2">
              <div 
                v-for="(product, index) in featuredProducts" 
                :key="index"
                @click="currentFeaturedSlide = index"
                class="w-2 h-2 rounded-full transition-colors cursor-pointer"
                :class="currentFeaturedSlide === index ? 'bg-blue-500' : 'bg-gray-300'"
              ></div>
            </div>
          </div>
          
          <!-- Desktop: 4 products per slide -->
          <div class="hidden md:block">
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
                  <div class="grid grid-cols-4 gap-4">
                    <ProductCard
                      v-for="product in getFeaturedSlideProducts(slide)"
                      :key="product.id"
                      :product="product"
                      :show-quick-actions="true"
                      :show-description="true"
                      @add-to-cart="handleAddToCart"
                      @quick-view="showProductQuickView"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Products by Categories - All Products with Filter -->
      <div class="container mx-auto px-4 py-8 md:py-12">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center mb-2">
                <div class="bg-blue-100 p-2 rounded-lg mr-3">
                  <i class="fas fa-list text-blue-500"></i>
                </div>
                TẤT CẢ SẢN PHẨM
              </h3>
              <p class="text-gray-600 text-sm">{{ getFilteredProductCount() }} sản phẩm có sẵn</p>
            </div>
            <div class="flex items-center space-x-3">
              <div class="hidden lg:flex items-center space-x-2">
                <button 
                  @click="prevAllProductsSlide" 
                  :disabled="currentAllProductsSlide === 0"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-chevron-left text-gray-600"></i>
                </button>
                <button 
                  @click="nextAllProductsSlide"
                  :disabled="currentAllProductsSlide >= maxAllProductsSlide"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <i class="fas fa-chevron-right text-gray-600"></i>
                </button>
              </div>
              <button @click="$router.push('/products')" class="hidden md:flex text-blue-500 hover:text-blue-700 text-sm font-medium items-center">
                Xem trang sản phẩm <i class="fas fa-arrow-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
          
          <!-- Category Filter Buttons -->
          <div class="mb-6">
            <div class="flex flex-wrap gap-2 justify-center md:justify-start">
              <button 
                v-for="category in availableCategories"
                :key="category"
                @click="selectCategoryFilter(category)"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                :class="selectedCategoryFilter === category 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
          <!-- Mobile: Single product per slide with swipe -->
          <div class="block md:hidden">
            <div 
              class="relative overflow-hidden touch-pan-x"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
            >
              <div 
                class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${currentAllProductsSlide * 100}%)` }"
              >
                <div 
                  v-for="(product, index) in filteredProducts" 
                  :key="product.id"
                  class="w-full flex-shrink-0 px-1"
                >
                  <ProductCard
                    :product="product"
                    :show-quick-actions="true"
                    :show-description="true"
                    @add-to-cart="handleAddToCart"
                    @quick-view="showProductQuickView"
                    class="mx-auto product-card-mobile"
                  />
                </div>
              </div>
            </div>
            
            <!-- Mobile navigation buttons -->
            <div v-if="filteredProducts.length > 1" class="mt-4 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <button 
                  @click="prevAllProductsSlide" 
                  :disabled="currentAllProductsSlide === 0"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-left text-gray-600"></i>
                </button>
                <button 
                  @click="nextAllProductsSlide"
                  :disabled="currentAllProductsSlide >= maxAllProductsSlideMobile"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-right text-gray-600"></i>
                </button>
              </div>
              
              <!-- Mobile pagination dots -->
              <div class="flex items-center space-x-1">
                <div 
                  v-for="(product, index) in filteredProducts.slice(0, 10)" 
                  :key="index"
                  @click="currentAllProductsSlide = index"
                  class="w-2 h-2 rounded-full transition-colors cursor-pointer"
                  :class="currentAllProductsSlide === index ? 'bg-blue-500' : 'bg-gray-300'"
                ></div>
                <div v-if="filteredProducts.length > 10" class="text-xs text-gray-500 ml-2">
                  +{{ filteredProducts.length - 10 }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Desktop: 4 products per slide -->
          <div class="hidden md:block">
            <div class="relative overflow-hidden">
              <div 
                class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${currentAllProductsSlide * 100}%)` }"
              >
                <div 
                  v-for="slide in allProductsSlides" 
                  :key="slide"
                  class="w-full flex-shrink-0"
                >
                  <div class="grid grid-cols-4 gap-4">
                    <ProductCard
                      v-for="product in getAllProductsSlideProducts(slide)"
                      :key="product.id"
                      :product="product"
                      :show-quick-actions="true"
                      :show-description="true"
                      @add-to-cart="handleAddToCart"
                      @quick-view="showProductQuickView"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug Section (temporary) -->
      <div v-if="!dataLoaded" class="container mx-auto px-4 py-8">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-yellow-800">Đang tải dữ liệu sản phẩm...</p>
        </div>
      </div>

      <div v-else-if="allProducts.length === 0" class="container mx-auto px-4 py-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800">Không có sản phẩm nào được tải. Kiểm tra API hoặc dữ liệu.</p>
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
            <button @click="$router.push('/news')" class="hidden md:flex text-blue-500 hover:text-blue-700 text-sm font-medium items-center">
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
import BannerHero from '@/components/BannerHero.vue'
import { useCart } from '@/scripts/cartManager.js'

import { 
  getLatestNews,
  newsService 
} from '@/data/news.js'

import { 
  productCategories, 
  sidebarCategories
} from '@/data/products.js'
import { ProductAPI } from '@/utils/productAPI.js'

export default {
  name: 'HomeView',
  components: {
    Header,
    Footer,
    ProductCard,
    NewsCard,
    BannerHero
  },
  data() {
    return {
      categories: sidebarCategories,
      productCategories: productCategories,
      allProducts: [],
      currentFeaturedSlide: 0,
      currentAllProductsSlide: 0,
      categorySlides: {},
      itemsPerSlide: 4, // Changed from 5 to 4
      dataLoaded: false,
      newsLoaded: false,
      // New data for all products section
      selectedCategoryFilter: 'Tất cả',
      displayLimit: 20,
      displayedProductCount: 20,
      // Touch/swipe handling
      touchStartX: 0,
      touchStartY: 0,
      touchEndX: 0,
      touchEndY: 0,
      // Featured touch handling
      featuredTouchStartX: 0,
      featuredTouchStartY: 0,
      featuredTouchEndX: 0,
      featuredTouchEndY: 0
    }
  },

  computed: {
    featuredProducts() {
      return this.dataLoaded ? this.allProducts.filter(product => product.isFeatured) : []
    },

    latestNews() {
      if (!this.newsLoaded) return []
      return getLatestNews(3)
    },

    availableCategories() {
      if (!this.dataLoaded || !this.allProducts.length) return ['Tất cả']
      
      const categorySet = new Set(['Tất cả'])
      this.allProducts.forEach(product => {
        if (product.category && product.category !== 'Tất cả') {
          categorySet.add(product.category)
        }
      })
      
      return Array.from(categorySet)
    },

    filteredProducts() {
      if (!this.dataLoaded) return []
      
      if (this.selectedCategoryFilter === 'Tất cả') {
        return this.allProducts
      }
      
      return this.allProducts.filter(product => 
        product.category === this.selectedCategoryFilter
      )
    },

    displayedProducts() {
      return this.filteredProducts.slice(0, this.displayedProductCount)
    },

    hasMoreProducts() {
      return this.filteredProducts.length > this.displayedProductCount
    },

    allProductsSlides() {
      if (!this.filteredProducts.length) return []
      return Array.from({ length: Math.ceil(this.filteredProducts.length / this.itemsPerSlide) }, (_, i) => i)
    },

    maxAllProductsSlide() {
      // Desktop: slides based on itemsPerSlide
      return Math.max(0, this.allProductsSlides.length - 1)
    },

    maxAllProductsSlideMobile() {
      // Mobile: one product per slide
      return Math.max(0, this.filteredProducts.length - 1)
    },

    featuredSlides() {
      if (!this.featuredProducts.length) return []
      return Array.from({ length: Math.ceil(this.featuredProducts.length / this.itemsPerSlide) }, (_, i) => i)
    },

    maxFeaturedSlide() {
      // Mobile: one product per slide
      if (window.innerWidth < 768) {
        return Math.max(0, this.featuredProducts.length - 1)
      }
      // Desktop: slides based on itemsPerSlide
      return Math.max(0, this.featuredSlides.length - 1)
    }
  },

  methods: {
    handleAddToCart(product) {
      const { addToCart, openCart } = useCart()
      addToCart(product, 1)
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`)
      setTimeout(() => {
        openCart()
      }, 500)
    },

    async loadData() {
      try {
        console.log('🔄 Loading data...')
        
        const [products, categories] = await Promise.all([
          ProductAPI.getAllProducts(),
          ProductAPI.getAllCategories()
        ]);

        console.log('📦 Products loaded:', products?.length || 0)
        console.log('📂 Categories loaded:', categories?.length || 0)

        this.allProducts = products || [];
        this.categories = categories || sidebarCategories;
        this.dataLoaded = true;
        
        if (!this.newsLoaded) {
          await newsService.getAllNews();
          this.newsLoaded = true;
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        this.allProducts = [];
        this.dataLoaded = true;
        this.newsLoaded = true;
      }
    },

    handleSearch(query) {
      this.$router.push({
        path: '/products',
        query: { search: query }
      })
    },
    
    getFilteredProductCount() {
      return this.filteredProducts.length
    },

    selectCategoryFilter(category) {
      this.selectedCategoryFilter = category
      this.currentAllProductsSlide = 0 // Reset slide when changing category
    },

    loadMoreProducts() {
      this.displayedProductCount += 20
    },

    // Touch/Swipe handlers for mobile (All Products)
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX
      this.touchStartY = e.touches[0].clientY
    },

    handleTouchMove(e) {
      // Prevent default scrolling behavior when swiping horizontally
      const touchMoveX = e.touches[0].clientX
      const touchMoveY = e.touches[0].clientY
      
      const diffX = Math.abs(touchMoveX - this.touchStartX)
      const diffY = Math.abs(touchMoveY - this.touchStartY)
      
      // If horizontal swipe is dominant, prevent vertical scrolling
      if (diffX > diffY) {
        e.preventDefault()
      }
    },

    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].clientX
      this.touchEndY = e.changedTouches[0].clientY
      
      const diffX = this.touchStartX - this.touchEndX
      const diffY = Math.abs(this.touchStartY - this.touchEndY)
      
      // Only process horizontal swipes (ignore vertical ones)
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
          // Swipe left - next slide
          this.nextAllProductsSlide()
        } else {
          // Swipe right - previous slide
          this.prevAllProductsSlide()
        }
      }
    },

    // Touch/Swipe handlers for mobile (Featured Products)
    handleFeaturedTouchStart(e) {
      this.featuredTouchStartX = e.touches[0].clientX
      this.featuredTouchStartY = e.touches[0].clientY
    },

    handleFeaturedTouchMove(e) {
      // Prevent default scrolling behavior when swiping horizontally
      const touchMoveX = e.touches[0].clientX
      const touchMoveY = e.touches[0].clientY
      
      const diffX = Math.abs(touchMoveX - this.featuredTouchStartX)
      const diffY = Math.abs(touchMoveY - this.featuredTouchStartY)
      
      // If horizontal swipe is dominant, prevent vertical scrolling
      if (diffX > diffY) {
        e.preventDefault()
      }
    },

    handleFeaturedTouchEnd(e) {
      this.featuredTouchEndX = e.changedTouches[0].clientX
      this.featuredTouchEndY = e.changedTouches[0].clientY
      
      const diffX = this.featuredTouchStartX - this.featuredTouchEndX
      const diffY = Math.abs(this.featuredTouchStartY - this.featuredTouchEndY)
      
      console.log('Featured touch end - diffX:', diffX, 'diffY:', diffY)
      
      // Only process horizontal swipes (ignore vertical ones)
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
          // Swipe left - next slide
          console.log('Featured swipe left - next slide')
          this.nextFeaturedSlide()
        } else {
          // Swipe right - previous slide
          console.log('Featured swipe right - prev slide')
          this.prevFeaturedSlide()
        }
      }
    },

    // All products slide navigation
    nextAllProductsSlide() {
      const isMobile = window.innerWidth < 768
      const maxSlide = isMobile ? this.maxAllProductsSlideMobile : this.maxAllProductsSlide
      
      if (this.currentAllProductsSlide < maxSlide) {
        this.currentAllProductsSlide++
      }
    },

    prevAllProductsSlide() {
      if (this.currentAllProductsSlide > 0) {
        this.currentAllProductsSlide--
      }
    },

    getAllProductsSlideProducts(slideIndex) {
      const start = slideIndex * this.itemsPerSlide
      const end = start + this.itemsPerSlide
      return this.filteredProducts.slice(start, end)
    },

    getFeaturedSlideProducts(slideIndex) {
      const start = slideIndex * this.itemsPerSlide
      const end = start + this.itemsPerSlide
      return this.featuredProducts.slice(start, end)
    },

    nextFeaturedSlide() {
      const isMobile = window.innerWidth < 768
      const maxSlide = isMobile ? (this.featuredProducts.length - 1) : this.maxFeaturedSlide
      
      if (this.currentFeaturedSlide < maxSlide) {
        this.currentFeaturedSlide++
      }
    },

    prevFeaturedSlide() {
      if (this.currentFeaturedSlide > 0) {
        this.currentFeaturedSlide--
      }
    },

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

    likeArticle(article) {
      console.log('Liked article:', article.title)
    }
  },

  async mounted() {
    await this.loadData()
    window.addEventListener('reloadExcelData', async () => {
      await this.loadData() 
    })
  }
}
</script>

<style scoped>
.home-view {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.hero-element {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.carousel-slide {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-icon {
  transition: all 0.3s ease;
}

.section-icon:hover {
  transform: scale(1.1);
}

.nav-button {
  transition: all 0.3s ease;
}

.nav-button:hover:not(:disabled) {
  transform: scale(1.05);
}

.nav-button:active:not(:disabled) {
  transform: scale(0.95);
}

.slide-indicator {
  transition: all 0.3s ease;
}

.slide-indicator:hover {
  transform: scale(1.2);
}

/* Mobile Product Card Styling */
.product-card-mobile {
  max-width: 300px;
  min-height: 380px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Touch pan for horizontal scrolling only */
.touch-pan-x {
  touch-action: pan-x;
}

/* Swipe container */
.swipe-container {
  position: relative;
  overflow: hidden;
  touch-action: pan-x;
}

/* Mobile responsive */
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
  
  /* Mobile product card adjustments */
  .product-card-mobile {
    max-width: calc(100vw - 3rem);
    margin: 0 0.5rem;
  }
}

.section-spacing {
  padding: 4rem 0;
}

@media (max-width: 768px) {
  .section-spacing {
    padding: 2rem 0;
  }
}

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