<template>
  <div class="products-view">
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
          <span class="text-gray-600">Sản phẩm</span>
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
        <!-- Sidebar Filters - Mobile: Hidden by default, show with toggle -->
        <div class="lg:w-80">
          <!-- Mobile Filter Toggle -->
          <button 
            @click="showMobileFilters = !showMobileFilters"
            class="lg:hidden w-full mb-4 bg-blue-500 text-white py-3 px-4 rounded-lg flex items-center justify-between"
          >
            <span>
              <i class="fas fa-filter mr-2"></i>
              Bộ lọc
            </span>
            <i :class="showMobileFilters ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </button>

          <!-- Filters Content -->
          <div :class="['lg:block', showMobileFilters ? 'block' : 'hidden']">
            <div class="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-6">
              <!-- Categories Filter -->
              <div>
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="fas fa-list mr-2 text-blue-500"></i>
                  Danh mục sản phẩm
                </h3>
                <div class="space-y-2">
                  <label 
                    v-for="category in productCategories" 
                    :key="category"
                    class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input 
                      type="radio" 
                      :value="category" 
                      v-model="selectedCategory"
                      class="mr-3 text-blue-500"
                    >
                    <span class="text-sm">{{ category }}</span>
                    <span class="ml-auto text-xs text-gray-500">({{ getProductCountByCategory(category) }})</span>
                  </label>
                </div>
              </div>

              <!-- Price Range Filter -->
              <div>
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="fas fa-dollar-sign mr-2 text-blue-500"></i>
                  Khoảng giá
                </h3>
                <div class="space-y-2">
                  <label v-for="range in priceRanges" :key="range.label" class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input 
                      type="radio" 
                      :value="range" 
                      v-model="selectedPriceRange"
                      class="mr-3 text-blue-500"
                    >
                    <span class="text-sm">{{ range.label }}</span>
                  </label>
                </div>
              </div>

              <!-- Stock Status Filter -->
              <div>
                <h3 class="font-semibold text-gray-800 mb-4 flex items-center">
                  <i class="fas fa-check-circle mr-2 text-blue-500"></i>
                  Tình trạng
                </h3>
                <div class="space-y-2">
                  <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input 
                      type="checkbox" 
                      v-model="showInStockOnly"
                      class="mr-3 text-blue-500"
                    >
                    <span class="text-sm">Chỉ hiển thị còn hàng</span>
                  </label>
                  <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input 
                      type="checkbox" 
                      v-model="showFeaturedOnly"
                      class="mr-3 text-blue-500"
                    >
                    <span class="text-sm">Sản phẩm nổi bật</span>
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
          </div>
        </div>

        <!-- Products Content -->
        <div class="flex-1">
          <!-- Search Results Info -->
          <div v-if="searchResults" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h2 class="font-semibold text-blue-800 mb-2">
              <i class="fas fa-search mr-2"></i>
              Kết quả tìm kiếm cho "{{ searchQuery }}"
            </h2>
            <p class="text-blue-600 text-sm">
              Tìm thấy {{ filteredProducts.length }} sản phẩm
              <button @click="clearSearch" class="ml-2 text-blue-800 hover:text-blue-900 underline">
                Xóa tìm kiếm
              </button>
            </p>
          </div>

          <!-- Products Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {{ selectedCategory === 'Tất cả' ? 'Tất cả sản phẩm' : selectedCategory }}
              </h1>
              <p class="text-gray-600 text-sm md:text-base">
                Hiển thị {{ filteredProducts.length }} sản phẩm
              </p>
            </div>

            <!-- Sort Options -->
            <div class="mt-4 md:mt-0">
              <select 
                v-model="sortBy" 
                class="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="name-desc">Tên Z-A</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="newest">Mới nhất</option>
                <option value="popular">Phổ biến nhất</option>
              </select>
            </div>
          </div>

          <!-- View Toggle (Grid/List) - Desktop only -->
          <div class="hidden md:flex items-center justify-between mb-6">
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Hiển thị:</span>
              <button 
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded',
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                ]"
              >
                <i class="fas fa-th"></i>
              </button>
              <button 
                @click="viewMode = 'list'"
                :class="[
                  'p-2 rounded',
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                ]"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>

            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-600">Hiển thị:</span>
              <select v-model="itemsPerPage" class="bg-white border border-gray-300 rounded px-3 py-1 text-sm">
                <option :value="12">12 sản phẩm</option>
                <option :value="24">24 sản phẩm</option>
                <option :value="48">48 sản phẩm</option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="filteredProducts.length > 0">
            <!-- Grid View -->
            <div 
              v-if="viewMode === 'grid'" 
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
            >
              <ProductCard
                v-for="product in paginatedProducts"
                :key="product.id"
                :product="product"
                :show-description="true"
                :show-add-to-cart="true"
                :show-quick-actions="true"
                @add-to-cart="addToCart"
                @quick-view="showProductQuickView"
              />
            </div>

            <!-- List View (Desktop only) -->
            <div v-else class="hidden md:block space-y-4">
              <div 
                v-for="product in paginatedProducts" 
                :key="product.id"
                class="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div class="flex gap-4">
                  <img :src="product.image" :alt="product.name" class="w-24 h-24 object-cover rounded">
                  <div class="flex-1">
                    <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
                    <p class="text-gray-600 text-sm mb-2">{{ product.description }}</p>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <span class="text-orange-500 font-bold text-lg">{{ product.price }}₫</span>
                        <span v-if="product.originalPrice !== product.price" class="text-gray-400 line-through">{{ product.originalPrice }}₫</span>
                      </div>
                      <button 
                        @click="addToCart(product)"
                        :disabled="!product.inStock"
                        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                      >
                        {{ product.inStock ? 'Thêm vào giỏ' : 'Hết hàng' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
                    page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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

          <!-- No Products Found -->
          <div v-else class="text-center py-12">
            <i class="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sản phẩm</h3>
            <p class="text-gray-500 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button 
              @click="clearAllFilters"
              class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
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
import ProductCard from '@/components/ProductCard.vue'

import { 
  productCategories, 
  sidebarCategories
} from '@/data/products.js'
import { ProductAPI } from '@/utils/productAPI.js'

export default {
  name: 'ProductsView',
  components: {
    Header,
    Footer,
    ProductCard
  },
  data() {
    return {
      // Data
      categories: sidebarCategories,
      productCategories: productCategories,
      products: [],
      dataLoaded: false,
      
      // Filters
      selectedCategory: 'Tất cả',
      selectedPriceRange: null,
      showInStockOnly: false,
      showFeaturedOnly: false,
      
      // Search
      searchResults: null,
      searchQuery: '',
      
      // View options
      viewMode: 'grid', // 'grid' or 'list'
      sortBy: 'default',
      itemsPerPage: 12,
      currentPage: 1,
      
      // Mobile
      showMobileFilters: false,
      
      // Price ranges
      priceRanges: [
        { label: 'Tất cả', min: 0, max: Infinity },
        { label: 'Dưới 50,000₫', min: 0, max: 50000 },
        { label: '50,000₫ - 100,000₫', min: 50000, max: 100000 },
        { label: '100,000₫ - 200,000₫', min: 100000, max: 200000 },
        { label: 'Trên 200,000₫', min: 200000, max: Infinity }
      ]
    }
  },
  
  computed: {
    filteredProducts() {
      let result = this.searchResults || this.products.filter(product => 
        this.selectedCategory === 'Tất cả' ? true : product.category === this.selectedCategory
      )
      
      // Filter by price range
      if (this.selectedPriceRange && this.selectedPriceRange.label !== 'Tất cả') {
        result = result.filter(product => {
          const price = parseInt(product.price.replace(/,/g, ''))
          return price >= this.selectedPriceRange.min && price <= this.selectedPriceRange.max
        })
      }
      
      // Filter by stock status
      if (this.showInStockOnly) {
        result = result.filter(product => product.inStock)
      }
      
      // Filter by featured
      if (this.showFeaturedOnly) {
        result = result.filter(product => product.isFeatured)
      }
      
      // Sort products
      return this.sortProducts(result)
    },
    
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredProducts.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
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
    async loadData() {
      try {
        this.products = await ProductAPI.getAllProducts();
        this.dataLoaded = true;
      } catch (error) {
        console.error('Error loading products:', error);
        this.products = [];
        this.dataLoaded = true;
      }
    },

    handleNavigate(view) {
      if (view === 'home') {
        this.$router.push('/')
      } else if (view === 'news') {
        this.$router.push('/news')
      }
    },
    
    handleSearch(query) {
      this.searchQuery = query
      this.searchResults = searchProducts(query)
      this.currentPage = 1
      
      // Update URL with search query
      this.$router.replace({
        path: '/products',
        query: { ...this.$route.query, search: query }
      })
      
      console.log(`Tìm thấy ${this.searchResults.length} sản phẩm cho từ khóa: "${query}"`)
    },
    
    clearSearch() {
      this.searchResults = null
      this.searchQuery = ''
      
      // Remove search query from URL
      const query = { ...this.$route.query }
      delete query.search
      this.$router.replace({ path: '/products', query })
    },
    
    getProductCountByCategory(category) {
      if (category === 'Tất cả') return this.products.length
      return this.products.filter(product => product.category === category).length
    },
    
    sortProducts(products) {
      const sorted = [...products]
      
      switch (this.sortBy) {
        case 'name-asc':
          return sorted.sort((a, b) => a.name.localeCompare(b.name))
        case 'name-desc':
          return sorted.sort((a, b) => b.name.localeCompare(a.name))
        case 'price-asc':
          return sorted.sort((a, b) => parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, '')))
        case 'price-desc':
          return sorted.sort((a, b) => parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, '')))
        case 'newest':
          return sorted.sort((a, b) => b.id - a.id)
        case 'popular':
          return sorted.sort((a, b) => (b.views || 0) - (a.views || 0))
        default:
          return sorted
      }
    },
    
    clearAllFilters() {
      this.selectedCategory = 'Tất cả'
      this.selectedPriceRange = null
      this.showInStockOnly = false
      this.showFeaturedOnly = false
      this.currentPage = 1
      this.clearSearch()
    },
    
    // Product actions (same as HomeView)
    addToCart(product) {
      console.log('Thêm vào giỏ hàng:', product.name)
      alert(`Đã thêm "${product.name}" vào giỏ hàng`)
    },
    
    showProductQuickView(product) {
      console.log('Xem nhanh sản phẩm:', product.name)
      alert(`Xem nhanh: ${product.name}`)
    }
  },
  
  watch: {
    selectedCategory() {
      this.currentPage = 1
    },
    
    selectedPriceRange() {
      this.currentPage = 1
    },
    
    showInStockOnly() {
      this.currentPage = 1
    },
    
    showFeaturedOnly() {
      this.currentPage = 1
    },
    
    sortBy() {
      this.currentPage = 1
    }
  },
  
  async mounted() {
    await this.loadData();

    // Set default price range
    this.selectedPriceRange = this.priceRanges[0]
    
    // Handle URL query parameters
    const query = this.$route.query
    
    // Handle search query from URL
    if (query.search) {
      this.handleSearch(query.search)
    }
    
    // Handle category filter from URL
    if (query.category && this.productCategories.includes(query.category)) {
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

/* Pagination hover effects */
.pagination-item:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>