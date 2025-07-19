<template>
  <div class="not-found-view">
    <!-- Header Component -->
    <Header 
      @search="handleSearch"
      :categories="categories"
    />

    <!-- 404 Content -->
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-lg w-full space-y-8 text-center">
        <!-- 404 Illustration -->
        <div class="relative">
          <!-- Animated 404 Number -->
          <div class="text-8xl md:text-9xl font-bold text-blue-500 opacity-20 select-none">
            404
          </div>
          
          <!-- Central Icon -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="bg-white rounded-full p-6 shadow-lg animate-bounce">
              <i class="fas fa-search text-4xl text-blue-500"></i>
            </div>
          </div>
          
          <!-- Floating Elements -->
          <div class="absolute top-4 left-4 text-2xl text-gray-300 animate-float">
            <i class="fas fa-pills"></i>
          </div>
          <div class="absolute top-8 right-8 text-xl text-gray-300 animate-float-delayed">
            <i class="fas fa-heart"></i>
          </div>
          <div class="absolute bottom-8 left-8 text-lg text-gray-300 animate-float">
            <i class="fas fa-paw"></i>
          </div>
          <div class="absolute bottom-4 right-4 text-2xl text-gray-300 animate-float-delayed">
            <i class="fas fa-syringe"></i>
          </div>
        </div>

        <!-- Error Message -->
        <div class="space-y-4">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-800">
            Oops! Trang không tồn tại
          </h1>
          <p class="text-lg text-gray-600">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          </p>
          <p class="text-base text-gray-500">
            Đừng lo lắng, chúng tôi sẽ giúp bạn tìm thấy những gì bạn cần!
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <!-- Primary Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link 
              to="/"
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 flex items-center justify-center"
            >
              <i class="fas fa-home mr-2"></i>
              Về trang chủ
            </router-link>
            
            <router-link 
              to="/products"
              class="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:transform hover:-translate-y-1 flex items-center justify-center"
            >
              <i class="fas fa-pills mr-2"></i>
              Xem sản phẩm
            </router-link>
          </div>

          <!-- Secondary Actions -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center text-sm">
            <router-link 
              to="/news"
              class="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center justify-center"
            >
              <i class="fas fa-newspaper mr-2"></i>
              Tin tức & kiến thức
            </router-link>
            
            <span class="hidden sm:inline text-gray-400">|</span>
            
            <router-link 
              to="/contact"
              class="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center justify-center"
            >
              <i class="fas fa-phone mr-2"></i>
              Liên hệ hỗ trợ
            </router-link>
            
            <span class="hidden sm:inline text-gray-400">|</span>
            
            <button 
              @click="goBack"
              class="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center justify-center"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Quay lại
            </button>
          </div>
        </div>

        <!-- Search Section -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            <i class="fas fa-search mr-2 text-blue-500"></i>
            Tìm kiếm những gì bạn cần
          </h3>
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery"
              @keyup.enter="performSearch"
              placeholder="Tìm kiếm sản phẩm, tin tức..." 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
            <button 
              @click="performSearch"
              class="absolute right-2 top-2 h-8 w-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <i class="fas fa-search text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            <i class="fas fa-link mr-2 text-blue-500"></i>
            Liên kết hữu ích
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <router-link 
              v-for="link in quickLinks" 
              :key="link.name"
              :to="link.path"
              class="text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div class="flex items-center">
                <i :class="link.icon + ' mr-3 text-blue-500 group-hover:text-blue-600'"></i>
                <span class="text-sm font-medium text-gray-700 group-hover:text-gray-900">{{ link.name }}</span>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Popular Products -->
        <div v-if="popularProducts.length > 0" class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            <i class="fas fa-fire mr-2 text-orange-500"></i>
            Sản phẩm phổ biến
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              v-for="product in popularProducts.slice(0, 4)" 
              :key="product.id"
              @click="viewProduct(product.id)"
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <img 
                :src="product.image" 
                :alt="product.name" 
                class="w-12 h-12 object-cover rounded-lg mr-3"
              >
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-800 group-hover:text-blue-600 truncate">
                  {{ product.name }}
                </h4>
                <p class="text-xs text-gray-500">{{ formatPrice(product.price) }}₫</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <h3 class="text-lg font-semibold mb-4">
            <i class="fas fa-headset mr-2"></i>
            Cần hỗ trợ?
          </h3>
          <div class="space-y-3 text-sm">
            <div class="flex items-center justify-center">
              <i class="fas fa-phone mr-2"></i>
              <span>Hotline: </span>
              <a href="tel:0866583223" class="font-semibold ml-1 hover:underline">0866.583.223</a>
            </div>
            <div class="flex items-center justify-center">
              <i class="fas fa-envelope mr-2"></i>
              <span>Email: </span>
              <a href="mailto:info@halife.vn" class="font-semibold ml-1 hover:underline">info@halife.vn</a>
            </div>
            <p class="text-xs opacity-90 text-center">
              Đội ngũ hỗ trợ 24/7 sẵn sàng giúp đỡ bạn
            </p>
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
import { sidebarCategories, products, getFeaturedProducts } from '@/data/products.js'

export default {
  name: 'NotFoundView',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      categories: sidebarCategories,
      searchQuery: '',
      quickLinks: [
        { name: 'Thuốc kháng sinh', path: '/products?category=Thuốc kháng sinh', icon: 'fas fa-pills' },
        { name: 'Vitamin', path: '/products?category=Vitamin', icon: 'fas fa-vitamins' },
        { name: 'Vaccine', path: '/products?category=Vaccine', icon: 'fas fa-syringe' },
        { name: 'Tin tức', path: '/news', icon: 'fas fa-newspaper' },
        { name: 'Giới thiệu', path: '/about', icon: 'fas fa-info-circle' },
        { name: 'Liên hệ', path: '/contact', icon: 'fas fa-phone' }
      ]
    }
  },
  
  computed: {
    popularProducts() {
      return getFeaturedProducts()
    }
  },
  
  methods: {
    handleSearch(query) {
      this.$router.push({
        path: '/products',
        query: { search: query }
      })
    },
    
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: '/products',
          query: { search: this.searchQuery.trim() }
        })
      }
    },
    
    goBack() {
      // Go back in history, or go to home if no history
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }
    },
    
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },
    
    formatPrice(price) {
      if (typeof price === 'string') {
        return price.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      return new Intl.NumberFormat('vi-VN').format(price)
    }
  },
  
  mounted() {
    // Set page title
    document.title = 'Trang không tồn tại (404) - HALIFE Animals'
    
    // Log 404 error for analytics
    console.log('404 Error - Page not found:', this.$route.fullPath)
    
    // Optional: Send 404 tracking to analytics
    // gtag('event', 'page_not_found', {
    //   'page_path': this.$route.fullPath
    // })
  }
}
</script>

<style scoped>
/* Animation keyframes */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Animation classes */
.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 3s ease-in-out infinite 1.5s;
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

/* Transition effects */
.transition-all {
  transition: all 0.3s ease;
}

.transition-colors {
  transition: color 0.3s ease;
}

/* Hover effects */
.hover\:transform:hover {
  transform: translateY(-2px);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Button hover effects */
button:hover, a:hover {
  transition: all 0.3s ease;
}

/* Card hover effects */
.group:hover {
  transition: all 0.3s ease;
}

/* Search input focus */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Quick links grid responsive */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Responsive text sizes */
@media (max-width: 768px) {
  .text-8xl {
    font-size: 6rem;
  }
  
  .text-9xl {
    font-size: 7rem;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .text-4xl {
    font-size: 2.25rem;
  }
}

/* Print styles */
@media print {
  .not-found-view {
    print-color-adjust: exact
  }
  
  .animate-bounce,
  .animate-float,
  .animate-float-delayed {
    animation: none;
  }
}

/* Accessibility improvements */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.focus\:ring-blue-500:focus {
  --tw-ring-color: rgb(59 130 246);
}

/* Loading states */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>