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
              <button @click="$router.push('/products')" class="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center">
                Xem tất cả <i class="fas fa-arrow-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
          
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
                    :show-description="true"
                    @add-to-cart="handleAddToCart"
                    @quick-view="showProductQuickView"
                  />
                </div>
              </div>
            </div>
          </div>
          
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
      <div v-if="selectedCategories.length > 0" class="container mx-auto px-4 py-8 md:py-12">
        <div v-for="(category, index) in selectedCategories" :key="category" class="mb-12">
          <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
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
                      :show-description="true"
                      @add-to-cart="handleAddToCart"
                      @quick-view="showProductQuickView"
                    />
                  </div>
                </div>
              </div>
            </div>
            
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

      <!-- Debug Section (temporary) - Xóa sau khi fix -->
      <!-- <div v-if="!dataLoaded" class="container mx-auto px-4 py-8">
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-yellow-800">Đang tải dữ liệu sản phẩm...</p>
        </div>
      </div>

      <div v-else-if="allProducts.length === 0" class="container mx-auto px-4 py-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800">Không có sản phẩm nào được tải. Kiểm tra API hoặc dữ liệu.</p>
        </div>
      </div> -->

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
      categorySlides: {},
      itemsPerSlide: 5,
      dataLoaded: false,
      newsLoaded: false
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

    selectedCategories() {
      if (!this.dataLoaded || !this.allProducts.length) return []
      
      // Lấy các danh mục từ sản phẩm thực tế
      const categorySet = new Set()
      this.allProducts.forEach(product => {
        if (product.category && product.category !== 'Tất cả') {
          categorySet.add(product.category)
        }
      })
      
      const categories = Array.from(categorySet).slice(0, 3)
      console.log('🏷️ Dynamic categories:', categories)
      return categories
    },

    featuredSlides() {
      if (!this.featuredProducts.length) return []
      return Array.from({ length: Math.ceil(this.featuredProducts.length / this.itemsPerSlide) }, (_, i) => i)
    },

    maxFeaturedSlide() {
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
        
        // Dùng ProductAPI giống ProductManager
        const [products, categories] = await Promise.all([
          ProductAPI.getAllProducts(),
          ProductAPI.getAllCategories()
        ]);

        console.log('📦 Products loaded:', products?.length || 0)
        console.log('📂 Categories loaded:', categories?.length || 0)
        console.log('🔍 Sample product:', products?.[0])

        this.allProducts = products || [];
        this.categories = categories || sidebarCategories;
        this.dataLoaded = true;
        this.initializeCategorySlides();
        
        // Debug computed properties
        this.$nextTick(() => {
          console.log('✨ Featured products:', this.featuredProducts.length)
          console.log('📂 Selected categories:', this.selectedCategories)
          console.log('🎯 Featured slides:', this.featuredSlides.length)
        })
        
        if (!this.newsLoaded) {
          await newsService.getAllNews();
          this.newsLoaded = true;
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        // Fallback về static data nếu API fail
        this.allProducts = [];
        this.dataLoaded = true;
        this.newsLoaded = true;
      }
    },

    initializeCategorySlides() {
      this.selectedCategories.forEach((category, index) => {
        this.categorySlides[index] = 0
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
      return this.allProducts.filter(product => 
        category === 'Tất cả' ? true : product.category === category
      ).length
    },

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

    getCategoryProducts(category) {
      if (!this.dataLoaded) return []
      return this.allProducts.filter(product => 
        category === 'Tất cả' ? true : product.category === category
      )
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
        this.categorySlides[index] = this.getCategoryCurrentSlide(index) + 1
      }
    },

    prevCategorySlide(index) {
      if (this.getCategoryCurrentSlide(index) > 0) {
        this.categorySlides[index] = this.getCategoryCurrentSlide(index) - 1
      }
    },

    setCategorySlide(index, slideIndex) {
      this.categorySlides[index] = slideIndex
    },

    showProductQuickView(product) {
      alert(`Xem nhanh: ${product.name}`)
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

.product-card:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
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

.category-item:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  transition: all 0.3s ease;
}

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