<template>
  <header class="bg-white shadow-sm">
    <!-- Mobile Header -->
    <div class="md:hidden bg-white px-4 py-4">
      <div class="flex items-center">
        <!-- Mobile Menu Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-2 mr-2">
          <i class="fas fa-bars text-2xl text-gray-700"></i>
        </button>
        
        <!-- Mobile Logo -->
        <router-link to="/" class="flex-1 flex justify-center">
          <img src="/images/logo_header_mobile.png" alt="HALIFE" class="object-contain" style="height: 3rem; max-width: 90vw;">
        </router-link>

        <!-- Spacer để cân bằng layout -->
        <div class="w-12"></div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" @click="mobileMenuOpen = false"></div>

    <!-- Mobile Menu Sidebar -->
    <div v-if="mobileMenuOpen" class="md:hidden fixed top-0 left-0 w-80 h-full bg-white z-50 shadow-xl">
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-800">Menu</h3>
          <button @click="mobileMenuOpen = false" class="p-2">
            <i class="fas fa-times text-xl text-gray-600"></i>
          </button>
        </div>
      </div>
      
      <div class="flex flex-col h-full overflow-y-auto pb-20">
        <!-- Giỏ hàng -->
        <div class="p-4 border-b bg-blue-50">
          <button @click="openCart(); mobileMenuOpen = false" class="w-full flex items-center justify-between p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <div class="flex items-center">
              <i class="fas fa-shopping-cart mr-3"></i>
              <span class="font-medium">Giỏ hàng</span>
            </div>
            <span v-if="cartCount > 0" class="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </button>
        </div>

        <!-- Search Mobile -->
        <div class="p-4 border-b">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="searchQuery"
              @keyup.enter="performSearch"
            >
            <button 
              @click="performSearch"
              class="absolute right-2 top-2 p-1 text-blue-500"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Menu Navigation -->
        <nav class="flex-1 p-4">
          <ul class="space-y-2">
            <li>
              <router-link to="/" @click="mobileMenuOpen = false" 
                class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="fas fa-home mr-3 text-blue-600"></i>
                Trang chủ
              </router-link>
            </li>
            <li>
              <router-link to="/products" @click="mobileMenuOpen = false"
                class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="fas fa-box mr-3 text-blue-600"></i>
                Sản phẩm
              </router-link>
            </li>
            <li>
              <router-link to="/news" @click="mobileMenuOpen = false"
                class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="fas fa-newspaper mr-3 text-blue-600"></i>
                Tin tức
              </router-link>
            </li>
            <li>
              <router-link to="/about" @click="mobileMenuOpen = false"
                class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="fas fa-info-circle mr-3 text-blue-600"></i>
                Giới thiệu
              </router-link>
            </li>
            <li>
              <router-link to="/contact" @click="mobileMenuOpen = false"
                class="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <i class="fas fa-phone mr-3 text-blue-600"></i>
                Liên hệ
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Contact Info -->
        <div class="p-4 border-t bg-gray-50">
          <div class="text-center space-y-2">
            <a href="tel:0866583223" class="block text-green-600 font-bold text-lg">
              <i class="fas fa-phone mr-2"></i>
              0866.583.223
            </a>
            <p class="text-sm text-gray-600">Hotline hỗ trợ 24/7</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Header -->
    <div class="hidden md:block container mx-auto px-4 py-4">
      <div class="flex items-center justify-between gap-4">
        <!-- Logo -->
        <router-link to="/" class="flex items-center hover:opacity-90 transition-opacity">
          <img src="/images/logo_white.png" alt="HALIFE" class="h-12 w-12 mr-3 rounded-full">
          <div>
            <h1 class="text-xl font-bold text-primary-500">HALIFE ANIMAL HEALTH</h1>
            <p class="text-xs text-gray-600">Công ty cổ phần thuốc thú y HALIFE Việt Nhật</p>
          </div>
        </router-link>

        <!-- Search Bar -->
        <div class="flex-1 max-w-md mx-8">
          <div class="relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm, tin tức..." 
              class="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              v-model="searchQuery"
              @keyup.enter="performSearch"
            >
            <button 
              @click="performSearch"
              class="absolute right-0 top-0 h-full px-4 bg-blue-500 text-white rounded-r-lg hover:bg-primary-500 transition-colors"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm text-gray-600">Hỗ trợ khách hàng</p>
            <p class="font-semibold text-primary-500">
              <a href="tel:0866583223" class="hover:text-blue-800">0866.583.223</a>
            </p>
          </div>
          <div class="flex gap-2">
            <button @click="openCart" class="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 text-sm relative transition-colors">
              <i class="fas fa-shopping-cart mr-2"></i>
              GIỎ HÀNG
              <span v-if="cartCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {{ cartCount > 99 ? '99+' : cartCount }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Navigation -->
    <nav class="bg-blue-500 text-white hidden md:block">
      <div class="container mx-auto px-4">
        <div class="flex items-center">
          <!-- Category Dropdown -->
          <div class="relative group">
            <button class="flex items-center px-4 py-3 hover:bg-primary-600 transition-colors">
              <i class="fas fa-bars mr-2"></i>
              Danh mục sản phẩm
              <i class="fas fa-chevron-down ml-2"></i>
            </button>
            
            <!-- Desktop Dropdown Menu -->
            <div class="absolute top-full left-0 bg-white text-gray-800 shadow-lg rounded-b-lg w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
              <div class="py-2">
                <router-link 
                  v-for="category in categories" 
                  :key="category.name"
                  :to="`/products?category=${encodeURIComponent(category.name)}`"
                  class="flex items-center px-4 py-3 hover:bg-blue-50 transition-colors"
                >
                  <i :class="category.icon + ' mr-3 text-primary-500'"></i>
                  <span>{{ category.name }}</span>
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Main Navigation -->
          <div class="flex space-x-8 ml-8">
            <router-link 
              to="/" 
              class="py-3 hover:bg-primary-500 px-4 rounded transition-colors"
              :class="{ 'bg-primary-500': $route.name === 'home' }"
            >
              TRANG CHỦ
            </router-link>
            
            <router-link 
              to="/about" 
              class="py-3 hover:bg-primary-500 px-4 rounded transition-colors"
              :class="{ 'bg-primary-500': $route.name === 'about' }"
            >
              GIỚI THIỆU
            </router-link>
            
            <router-link 
              to="/products" 
              class="py-3 hover:bg-primary-500 px-4 rounded transition-colors"
              :class="{ 'bg-primary-500': $route.name === 'products' }"
            >
              SẢN PHẨM
            </router-link>
            
            <router-link 
              to="/news" 
              class="py-3 hover:bg-primary-500 px-4 rounded transition-colors"
              :class="{ 'bg-primary-500': $route.name === 'news' }"
            >
              TIN TỨC
            </router-link>
            
            <router-link 
              to="/contact" 
              class="py-3 hover:bg-primary-500 px-4 rounded transition-colors"
              :class="{ 'bg-primary-500': $route.name === 'contact' }"
            >
              LIÊN HỆ
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { useCart } from '@/scripts/cartManager.js'

export default {
  name: 'Header',
  emits: ['search'],
  props: {
    categories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchQuery: '',
      mobileMenuOpen: false,
      showBanner: true
    }
  },
  computed: {
    cartCount() {
      const { cartCount } = useCart()
      return cartCount.value || 0 
    }
  },
  methods: {
    openCart() {
      const { openCart } = useCart()
      openCart()
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$emit('search', this.searchQuery.trim())
        this.mobileMenuOpen = false
        
        // Navigate to products page with search query
        this.$router.push({
          path: '/products',
          query: { search: this.searchQuery.trim() }
        })
      }
    },
    
    closeBanner() {
      this.showBanner = false
    },
    
    // Close mobile menu when clicking outside
    handleClickOutside(event) {
      if (this.mobileMenuOpen && !event.target.closest('.mobile-menu')) {
        this.mobileMenuOpen = false
      }
    }
  },
  
  mounted() {
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.mobileMenuOpen) {
        this.mobileMenuOpen = false
      }
    })
    
    // Load cart count from localStorage or API
    this.cartCount = parseInt(localStorage.getItem('cartCount') || '0')
  },
  
  watch: {
    // Close mobile menu when route changes
    '$route'() {
      this.mobileMenuOpen = false
    }
  }
}
</script>

<style scoped>
/* Animation for mobile menu */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .bg-white,
.mobile-menu-leave-to .bg-white {
  transform: translateX(-100%);
}

/* Dropdown hover effect */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:visible {
  visibility: visible;
}

/* Mobile menu slide animation */
@media (max-width: 768px) {
  .fixed.inset-0 {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .w-80 {
    animation: slideInLeft 0.3s ease-in-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Transition effects */
.transition-colors {
  transition: color 0.3s ease, background-color 0.3s ease;
}

.transition-opacity {
  transition: opacity 0.3s ease;
}

/* Loading state */
.loading {
  position: relative;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 999;
}

/* Search input focus */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Cart badge animation */
.cart-badge {
  animation: pulse 2s infinite;
}

header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Animation cho notification badge */
.bg-red-500 {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Smooth transition */
.transition-colors {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-blue-500 {
    background-color: #1e40af;
  }
  
  .text-primary-500 {
    color: #1d4ed8;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
}
</style>