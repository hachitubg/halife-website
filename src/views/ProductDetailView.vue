<template>
  <div class="product-detail-view">
    <!-- Header Component -->
    <Header 
      @search="handleSearch"
      :categories="categories"
    />

    <!-- Breadcrumb -->
    <div class="bg-gray-50 py-3 md:py-4">
      <div class="container mx-auto px-4">
        <nav class="flex items-center space-x-2 text-sm">
          <router-link to="/" class="text-blue-500 hover:text-blue-700">Trang chủ</router-link>
          <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
          <router-link to="/products" class="text-blue-500 hover:text-blue-700">Sản phẩm</router-link>
          <i class="fas fa-chevron-right text-gray-400 text-xs"></i>
          <span class="text-gray-600">Chi tiết sản phẩm</span>
        </nav>
      </div>
    </div>

    <!-- Product Detail Content -->
    <div class="container mx-auto px-4 py-6 md:py-8">
      <div v-if="product" class="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Product Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="main-image-container" @click="openImageModal">
              <img 
                :src="currentImage" 
                :alt="product.name" 
                class="main-product-image"
                @error="handleMainImageError"
              />
              <!-- Badges trên ảnh chính -->
              <div v-if="product.discount > 0" class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                -{{ product.discount }}%
              </div>
              <div v-if="product.isFeatured" class="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                <i class="fas fa-star mr-1"></i>Nổi bật
              </div>
              <!-- Zoom overlay -->
              <div class="image-zoom-overlay">
                <i class="fas fa-expand text-white text-xl"></i>
              </div>
            </div>
            
            <!-- Thumbnail Images -->
            <div v-if="productImages.length > 1" class="thumbnail-grid">
              <div 
                v-for="(image, index) in productImages" 
                :key="index"
                class="thumbnail-container"
                :class="{ 'active': currentImage === image }"
                @click="currentImage = image"
              >
                <img 
                  :src="image" 
                  :alt="`${product.name} ${index + 1}`" 
                  class="thumbnail-image"
                  @error="handleThumbnailError"
                />
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Product Title -->
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <span>Mã sản phẩm: {{ String(product.id).padStart(3, '0') }}</span>
                <span :class="product.inStock ? 'text-green-600' : 'text-red-600'">
                  <i :class="product.inStock ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="mr-1"></i>
                  {{ product.inStock ? 'Còn hàng' : 'Hết hàng' }}
                </span>
              </div>
            </div>

            <!-- Product Detail -->
            <div v-if="product.description" class="border-l-4 border-blue-500 pl-4">
              <p class="text-gray-700 text-sm leading-relaxed">{{ product.description }}</p>
            </div>

            <!-- Price -->
            <div class="space-y-2">
              <div class="flex items-end space-x-3">
                <span class="text-2xl md:text-3xl font-bold text-red-500">{{ formatPrice(product.price) }}₫</span>
                <span v-if="product.originalPrice !== product.price" class="text-lg text-gray-400 line-through">
                  {{ formatPrice(product.originalPrice) }}₫
                </span>
              </div>
              <div v-if="product.discount > 0" class="text-sm text-green-600 font-medium">
                Tiết kiệm {{ formatPrice(calculateSavings(product.originalPrice, product.price)) }} VNĐ ({{ product.discount }}%)
              </div>
            </div>

            <!-- Weight/Size Selection -->
            <div v-if="weightOptions.length > 1">
              <h3 class="font-semibold text-gray-800 mb-3">Quy cách đóng gói:</h3>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="weight in weightOptions" 
                  :key="weight"
                  class="border-2 rounded-lg py-2 px-3 text-sm font-medium transition-colors"
                  :class="{ 
                    'border-blue-500 bg-blue-50 text-blue-600': selectedWeight === weight,
                    'border-gray-300 hover:border-gray-400': selectedWeight !== weight
                  }"
                  @click="selectedWeight = weight"
                >
                  {{ weight }}
                </button>
              </div>
            </div>

            <!-- Quantity Selection -->
            <div>
              <h3 class="font-semibold text-gray-800 mb-3">Số lượng:</h3>
              <div class="flex items-center space-x-3">
                <div class="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    @click="decreaseQuantity" 
                    :disabled="quantity <= 1"
                    class="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    v-model.number="quantity" 
                    min="1" 
                    :max="product.stockQuantity || 999"
                    class="w-16 text-center border-0 focus:outline-none"
                  />
                  <button 
                    @click="increaseQuantity"
                    :disabled="product.stockQuantity && quantity >= product.stockQuantity"
                    class="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <span v-if="product.stockQuantity" class="text-sm text-gray-600">
                  (Còn {{ product.stockQuantity }} sản phẩm)
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <button 
                @click="addToCart"
                :disabled="!product.inStock"
                class="w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center text-lg"
                :class="product.inStock 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              >
                <i class="fas fa-shopping-cart mr-2"></i>
                {{ product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Product Tabs -->
        <div class="mt-12">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>
          
          <div class="mt-6">
            <div v-if="activeTab === 'description'" class="prose max-w-none">
              <!-- Mô tả ngắn -->
              <p class="text-gray-600 mb-4">{{ product.description }}</p>
              
              <!-- Mô tả chi tiết -->
              <div v-if="product.fullDescription && product.fullDescription !== product.description" class="mb-6">
                <h4 class="font-semibold mb-3">Mô tả chi tiết:</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-700 leading-relaxed">{{ product.fullDescription }}</p>
                </div>
              </div>

              <!-- Công dụng -->
              <div v-if="product.functions && product.functions.length > 0" class="mb-6">
                <h4 class="font-semibold mb-3">Công dụng:</h4>
                <div class="bg-blue-50 p-4 rounded-lg">
                  <ul class="space-y-2">
                    <li v-for="func in product.functions" :key="func" class="flex items-start">
                      <i class="fas fa-check-circle text-blue-500 mr-2 mt-1 flex-shrink-0"></i>
                      <span class="text-gray-700">{{ func }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Thông tin bổ sung -->
              <div class="mt-6">
                <h4 class="font-semibold mb-3">Thông tin bổ sung:</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <ul class="space-y-2 text-sm">
                    <li v-if="product.activeIngredients">
                      <strong>Thành phần hoạt chất:</strong> {{ product.activeIngredients }}
                    </li>
                    <li v-if="product.targetAnimal">
                      <strong>Đối tượng sử dụng:</strong> {{ product.targetAnimal }}
                    </li>
                    <li v-if="product.storageConditions">
                      <strong>Bảo quản:</strong> {{ product.storageConditions }}
                    </li>
                    <li v-if="product.shelfLife">
                      <strong>Hạn sử dụng:</strong> {{ product.shelfLife }}
                    </li>
                    <li v-if="product.withdrawalTime">
                      <strong>Thời gian ngưng thuốc:</strong> {{ product.withdrawalTime }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'specifications'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold mb-3">Thông số kỹ thuật</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between py-1 border-b border-gray-200">
                      <span>Mã sản phẩm:</span>
                      <span>THY{{ String(product.id).padStart(3, '0') }}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-gray-200">
                      <span>Danh mục:</span>
                      <span>{{ product.category }}</span>
                    </div>
                    <div v-if="product.subcategory" class="flex justify-between py-1 border-b border-gray-200">
                      <span>Danh mục con:</span>
                      <span>{{ product.subcategory }}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-gray-200">
                      <span>Quy cách:</span>
                      <span>{{ product.packageSize || selectedWeight }}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-gray-200">
                      <span>Đơn vị:</span>
                      <span>{{ product.unit }}</span>
                    </div>
                    <div v-if="product.originCountry" class="flex justify-between py-1 border-b border-gray-200">
                      <span>Xuất xứ:</span>
                      <span>{{ product.originCountry }}</span>
                    </div>
                    <div v-if="product.manufacturer" class="flex justify-between py-1 border-b border-gray-200">
                      <span>Nhà sản xuất:</span>
                      <span>{{ product.manufacturer }}</span>
                    </div>
                    <div v-if="product.registrationNumber" class="flex justify-between py-1">
                      <span>Số đăng ký:</span>
                      <span>{{ product.registrationNumber }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold mb-3">Hướng dẫn sử dụng</h4>
                  <div class="text-sm space-y-2">
                    <div v-if="product.dosage">
                      <p><strong>Liều dùng:</strong> {{ product.dosage }}</p>
                    </div>
                    <div v-if="product.usageInstructions">
                      <p><strong>Cách dùng:</strong> {{ product.usageInstructions }}</p>
                    </div>
                    <div v-if="product.withdrawalTime">
                      <p><strong>Thời gian ngưng thuốc:</strong> {{ product.withdrawalTime }}</p>
                    </div>
                    <div v-if="product.targetAnimal">
                      <p><strong>Đối tượng sử dụng:</strong> {{ product.targetAnimal }}</p>
                    </div>
                    <div v-if="product.storageConditions" class="pt-2 border-t border-gray-200">
                      <p><strong>Bảo quản:</strong> {{ product.storageConditions }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-12">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
              <i class="fas fa-pills mr-2 text-blue-500"></i>
              SẢN PHẨM TƯƠNG TỰ
            </h2>
            <!-- Desktop navigation -->
            <div class="hidden md:flex items-center space-x-2">
              <button 
                @click="prevRelatedSlide" 
                :disabled="currentRelatedSlide === 0"
                class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="fas fa-chevron-left text-gray-600"></i>
              </button>
              <button 
                @click="nextRelatedSlide"
                :disabled="currentRelatedSlide >= maxRelatedSlide"
                class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i class="fas fa-chevron-right text-gray-600"></i>
              </button>
            </div>
          </div>
          
          <!-- Mobile: Single product slide -->
          <div class="block md:hidden">
            <div 
              class="relative overflow-hidden touch-pan-x"
              @touchstart="handleRelatedTouchStart"
              @touchmove="handleRelatedTouchMove"
              @touchend="handleRelatedTouchEnd"
            >
              <div 
                class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${currentRelatedSlide * 100}%)` }"
              >
                <div 
                  v-for="(relatedProduct, index) in relatedProducts" 
                  :key="relatedProduct.id"
                  class="w-full flex-shrink-0"
                >
                  <div 
                    class="bg-white border rounded-lg p-3 hover:shadow-lg transition-shadow cursor-pointer group mx-auto max-w-xs"
                    @click="viewProduct(relatedProduct.id)"
                  >
                    <div class="relative">
                      <img :src="relatedProduct.image" :alt="relatedProduct.name" class="w-full h-40 object-contain rounded bg-gray-50" />
                      <div v-if="relatedProduct.discount > 0" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        -{{ relatedProduct.discount }}%
                      </div>
                    </div>
                    <div class="mt-3 text-center">
                      <h3 class="font-medium text-sm line-clamp-2 mb-2 group-hover:text-blue-600">{{ relatedProduct.name }}</h3>
                      <div class="flex items-center justify-center space-x-2">
                        <span class="text-red-500 font-bold text-base">{{ formatPrice(relatedProduct.price) }}₫</span>
                        <span v-if="relatedProduct.originalPrice !== relatedProduct.price" class="text-gray-400 text-sm line-through">
                          {{ formatPrice(relatedProduct.originalPrice) }}₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Mobile navigation -->
            <div v-if="relatedProducts.length > 1" class="mt-4 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <button 
                  @click="prevRelatedSlide" 
                  :disabled="currentRelatedSlide === 0"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-left text-gray-600"></i>
                </button>
                <button 
                  @click="nextRelatedSlide"
                  :disabled="currentRelatedSlide >= maxRelatedSlideMobile"
                  class="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-right text-gray-600"></i>
                </button>
              </div>
              
              <!-- Dots navigation -->
              <div class="flex items-center space-x-1">
                <div 
                  v-for="(product, index) in relatedProducts" 
                  :key="index"
                  @click="currentRelatedSlide = index"
                  class="w-2 h-2 rounded-full transition-colors cursor-pointer"
                  :class="currentRelatedSlide === index ? 'bg-blue-500' : 'bg-gray-300'"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- Desktop: Grid layout -->
          <div class="hidden md:block">
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <div 
                v-for="relatedProduct in relatedProducts" 
                :key="relatedProduct.id"
                class="bg-white border rounded-lg p-3 hover:shadow-lg transition-shadow cursor-pointer group"
                @click="viewProduct(relatedProduct.id)"
              >
                <div class="relative">
                  <img :src="relatedProduct.image" :alt="relatedProduct.name" class="w-full h-32 object-contain rounded bg-gray-50" />
                  <div v-if="relatedProduct.discount > 0" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    -{{ relatedProduct.discount }}%
                  </div>
                </div>
                <div class="mt-3">
                  <h3 class="font-medium text-sm line-clamp-2 mb-2 group-hover:text-blue-600">{{ relatedProduct.name }}</h3>
                  <div class="flex items-center space-x-2">
                    <span class="text-red-500 font-bold text-sm">{{ formatPrice(relatedProduct.price) }}₫</span>
                    <span v-if="relatedProduct.originalPrice !== relatedProduct.price" class="text-gray-400 text-xs line-through">
                      {{ formatPrice(relatedProduct.originalPrice) }}₫
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="!product && !productNotFound" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">Đang tải thông tin sản phẩm...</p>
      </div>

      <!-- Product Not Found -->
      <div v-if="productNotFound" class="text-center py-12">
        <i class="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sản phẩm</h3>
        <p class="text-gray-500 mb-4">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa</p>
        <router-link to="/products" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Xem tất cả sản phẩm
        </router-link>
      </div>
    </div>

    <!-- Footer Component -->
    <Footer />

    <!-- Image Modal -->
    <div v-if="showImageModal" 
         class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
         @click="closeImageModal">
      <div class="relative max-w-4xl max-h-full">
        <button 
          @click="closeImageModal"
          class="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
        >
          <i class="fas fa-times"></i>
        </button>
        <img 
          :src="currentImage" 
          :alt="product.name"
          class="max-w-full max-h-full object-contain"
          @click.stop
        />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useCart } from '@/scripts/cartManager.js'

import { 
  sidebarCategories
} from '@/data/products.js'
import { ProductAPI } from '@/utils/productAPI.js'

export default {
  name: 'ProductDetailView',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      categories: sidebarCategories,
      product: null,
      productNotFound: false,
      loading: true,
      currentImage: '',
      selectedWeight: '',
      quantity: 1,
      activeTab: 'description',
      showImageModal: false, // For image modal
      currentRelatedSlide: 0, // ADD THIS LINE
      tabs: [
        { id: 'description', name: 'Mô tả sản phẩm' },
        { id: 'specifications', name: 'Thông số kỹ thuật' }
      ],
      relatedProducts: [],
      weightOptions: [],
      // Touch handling for related products
      relatedTouchStartX: 0, // ADD THIS LINE
      relatedTouchStartY: 0  // ADD THIS LINE
    }
  },
  
  computed: {
    productId() {
      return parseInt(this.$route.params.id)
    },
    
    productImages() {
      if (!this.product) return []
      
      if (this.product.images && this.product.images.length > 0) {
        return this.product.images
      }
      
      return [
        this.product.image,
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=400&fit=crop'
      ].filter(Boolean)
    },
    
    maxRelatedSlide() {
      return Math.max(0, Math.ceil(this.relatedProducts.length / 5) - 1)
    },
    
    maxRelatedSlideMobile() {
      return Math.max(0, this.relatedProducts.length - 1)
    }

  },
  
  methods: {
    openImageModal() {
      this.showImageModal = true
      document.body.style.overflow = 'hidden'
    },

    closeImageModal() {
      this.showImageModal = false
      document.body.style.overflow = 'auto'
    },

    handleMainImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+'
    },
    
    handleThumbnailError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2U8L3RleHQ+PC9zdmc+'
    },

    handleSearch(query) {
      this.$router.push({
        path: '/products',
        query: { search: query }
      })
    },
    
    async loadProduct() {
      try {
        const productId = this.$route.params.id
        this.product = await ProductAPI.getProductById(productId)
        
        if (!this.product) {
          this.productNotFound = true
          return
        }
        
        this.currentImage = this.productImages[0] || this.product.image
        this.setupWeightOptions()
        await this.loadRelatedProducts()
        
      } catch (error) {
        console.error('Error loading product:', error)
        this.productNotFound = true
      }
    },
    
    setupWeightOptions() {
      if (this.product.packageSize) {
        this.weightOptions = [this.product.packageSize]
        this.selectedWeight = this.product.packageSize
      } else {
        this.weightOptions = ['1 lọ/chai', '5 lọ/thùng', '10 lọ/thùng']
        this.selectedWeight = this.weightOptions[0]
      }
    },
    
    async loadRelatedProducts() {
      try {
        const allProducts = await ProductAPI.getAllProducts()
        this.relatedProducts = allProducts
          .filter(p => p.category === this.product.category && p.id !== this.productId)
          .slice(0, 5)
      } catch (error) {
        console.error('Error loading related products:', error)
        this.relatedProducts = []
      }
    },
    
    formatPrice(price) {
      if (typeof price === 'string') {
        return price.replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      return new Intl.NumberFormat('vi-VN').format(price)
    },
    
    calculateSavings(originalPrice, currentPrice) {
      let original = typeof originalPrice === 'string' 
        ? parseInt(originalPrice.replace(/[,đ₫]/g, '')) 
        : originalPrice
      let current = typeof currentPrice === 'string' 
        ? parseInt(currentPrice.replace(/[,đ₫]/g, '')) 
        : currentPrice
      
      if (original < 1000) original = original * 1000
      if (current < 1000) current = current * 1000
      
      return original - current
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--
      }
    },
    
    increaseQuantity() {
      if (!this.product.stockQuantity || this.quantity < this.product.stockQuantity) {
        this.quantity++
      }
    },
    
    addToCart() {
      if (!this.product.inStock) return
      const { addToCart, openCart } = useCart()
      
      addToCart(this.product, this.quantity)
      alert(`Đã thêm ${this.quantity} sản phẩm "${this.product.name}" vào giỏ hàng!`)
      
      setTimeout(() => {
        openCart()
      }, 500)
    },
    
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`)
    },

    nextRelatedSlide() {
      const isMobile = window.innerWidth < 768
      const maxSlide = isMobile ? this.maxRelatedSlideMobile : this.maxRelatedSlide
      
      if (this.currentRelatedSlide < maxSlide) {
        this.currentRelatedSlide++
      }
    },

    prevRelatedSlide() {
      if (this.currentRelatedSlide > 0) {
        this.currentRelatedSlide--
      }
    },

    // Touch handlers for related products - ADD THESE METHODS
    handleRelatedTouchStart(e) {
      this.relatedTouchStartX = e.touches[0].clientX
      this.relatedTouchStartY = e.touches[0].clientY
    },

    handleRelatedTouchMove(e) {
      const diffX = Math.abs(e.touches[0].clientX - this.relatedTouchStartX)
      const diffY = Math.abs(e.touches[0].clientY - this.relatedTouchStartY)
      
      if (diffX > diffY) {
        e.preventDefault()
      }
    },

    handleRelatedTouchEnd(e) {
      const diffX = this.relatedTouchStartX - e.changedTouches[0].clientX
      const diffY = Math.abs(this.relatedTouchStartY - e.changedTouches[0].clientY)
      
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
          this.nextRelatedSlide()
        } else {
          this.prevRelatedSlide()
        }
      }
    }

  },
  
  watch: {
    '$route'() {
      this.product = null
      this.productNotFound = false
      this.loadProduct()
    }
  },
  
  mounted() {
    this.loadProduct()
  },

  beforeUnmount() {
    document.body.style.overflow = 'auto'
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

.transition-all {
  transition: all 0.3s ease;
}

.transition-colors {
  transition: color 0.3s ease;
}

/* Main Image Container - Full width on mobile */
.main-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #f8fafc;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: zoom-in;
  border: 1px solid #e5e7eb;
}

/* Main Product Image */
.main-product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background-color: white;
  transition: transform 0.3s ease;
}

.main-image-container:hover .main-product-image {
  transform: scale(1.05);
}

/* Mobile: Expand image container to use FULL screen width */
@media (max-width: 767px) {
  .main-image-container {
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
    width: 100vw;
    aspect-ratio: 1 / 1; 
    border-radius: 0;
    border-left: none;
    border-right: none;
    min-height: 350px;
  }
  
  .main-product-image {
    object-fit: contain;
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .main-image-container {
    min-height: 320px;
  }
}

/* Zoom Overlay */
.image-zoom-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-image-container:hover .image-zoom-overlay {
  opacity: 1;
}

/* Thumbnail Grid */
.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.thumbnail-container {
  position: relative;
  aspect-ratio: 1 / 1;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f8fafc;
}

.thumbnail-container:hover {
  border-color: #9ca3af;
  transform: scale(1.05);
}

.thumbnail-container.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background-color: white;
  transition: transform 0.2s ease;
}

.thumbnail-container:hover .thumbnail-image {
  transform: scale(1.1);
}

/* Image Modal Styles */
.fixed.inset-0 {
  backdrop-filter: blur(4px);
}

.fixed.inset-0 img {
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:disabled {
  transform: none;
}

/* Quantity input styling */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Tab transition effects */
.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-3xl {
    font-size: 1.75rem;
  }
  
  .thumbnail-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .thumbnail-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.25rem;
  }
}
</style>