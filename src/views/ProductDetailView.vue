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
            <div class="main-image-container">
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
                <i class="fas fa-search-plus text-white text-xl"></i>
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
                <!-- <span v-if="product.rating > 0" class="flex items-center">
                  <i class="fas fa-star text-yellow-400 mr-1"></i>
                  {{ product.rating }} ({{ product.reviewCount || 0 }} đánh giá)
                </span> -->
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

            <!-- Product Details -->
            <!-- <div class="space-y-3">
              <div class="flex">
                <span class="font-medium text-gray-700 w-32">Danh mục:</span>
                <span class="text-blue-600 font-medium">{{ product.category }}</span>
              </div>
              <div v-if="product.subcategory" class="flex">
                <span class="font-medium text-gray-700 w-32">Danh mục con:</span>
                <span>{{ product.subcategory }}</span>
              </div>
              <div class="flex">
                <span class="font-medium text-gray-700 w-32">Quy cách:</span>
                <span>{{ product.packageSize || selectedWeight }}</span>
              </div>
              <div class="flex">
                <span class="font-medium text-gray-700 w-32">Đơn vị:</span>
                <span>{{ product.unit }}</span>
              </div>
              <div class="flex">
                <span class="font-medium text-gray-700 w-32">Tình trạng:</span>
                <span :class="product.inStock ? 'text-green-600' : 'text-red-600'">
                  {{ product.inStock ? 'Còn hàng' : 'Hết hàng' }}
                  <span v-if="product.inStock && product.stockQuantity" class="text-gray-500 text-sm">
                    ({{ product.stockQuantity }} sản phẩm)
                  </span>
                </span>
              </div>
              <div v-if="product.originCountry" class="flex">
                <span class="font-medium text-gray-700 w-32">Xuất xứ:</span>
                <span>{{ product.originCountry }}</span>
              </div>
              <div v-if="product.manufacturer" class="flex">
                <span class="font-medium text-gray-700 w-32">Nhà sản xuất:</span>
                <span>{{ product.manufacturer }}</span>
              </div>
            </div> -->

            <!-- Promotion Banner (cho sản phẩm nổi bật) -->
            <!-- <div v-if="product.isFeatured" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <div class="bg-red-500 text-white rounded-full p-2">
                  <i class="fas fa-gift"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-red-600 mb-2">KHUYẾN MÃI ĐẶC BIỆT</h3>
                  <div class="space-y-1 text-sm">
                    <div class="flex items-start">
                      <span class="font-medium text-red-600 mr-2">1.</span>
                      <span>Giảm {{ product.discount }}% cho sản phẩm này</span>
                    </div>
                    <div class="flex items-start">
                      <span class="font-medium text-red-600 mr-2">2.</span>
                      <span>Miễn phí vận chuyển toàn quốc cho đơn hàng trên 500.000₫</span>
                    </div>
                    <div v-if="product.targetAnimal" class="flex items-start">
                      <span class="font-medium text-red-600 mr-2">3.</span>
                      <span>Phù hợp cho: {{ product.targetAnimal }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->

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
                class="py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                :class="product.inStock 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
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
            
            <div v-if="activeTab === 'reviews'">
              <div v-if="product.reviewCount > 0" class="space-y-6">
                <!-- Review Summary -->
                <div class="bg-gray-50 p-6 rounded-lg">
                  <div class="flex items-center justify-between mb-4">
                    <h4 class="text-lg font-semibold">Đánh giá từ khách hàng</h4>
                    <div class="text-right">
                      <div class="flex items-center justify-end mb-1">
                        <span class="text-2xl font-bold mr-2">{{ product.rating }}</span>
                        <div class="flex text-yellow-400">
                          <i v-for="i in 5" :key="i" :class="i <= product.rating ? 'fas fa-star' : 'far fa-star'"></i>
                        </div>
                      </div>
                      <p class="text-sm text-gray-600">{{ product.reviewCount }} đánh giá</p>
                    </div>
                  </div>
                  
                  <!-- Rating Breakdown -->
                  <div class="space-y-2">
                    <div v-for="star in [5,4,3,2,1]" :key="star" class="flex items-center">
                      <span class="text-sm w-3">{{ star }}</span>
                      <i class="fas fa-star text-yellow-400 mx-2"></i>
                      <div class="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                        <div class="bg-yellow-400 h-2 rounded-full" :style="`width: ${getStarPercentage(star)}%`"></div>
                      </div>
                      <span class="text-sm text-gray-600 w-12">{{ getStarCount(star) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Sample Reviews -->
                <div class="space-y-4">
                  <div v-for="review in sampleReviews" :key="review.id" class="border-b border-gray-200 pb-4">
                    <div class="flex items-start justify-between mb-2">
                      <div>
                        <h5 class="font-medium">{{ review.author }}</h5>
                        <div class="flex text-yellow-400 text-sm">
                          <i v-for="i in 5" :key="i" :class="i <= review.rating ? 'fas fa-star' : 'far fa-star'"></i>
                        </div>
                      </div>
                      <span class="text-sm text-gray-500">{{ review.date }}</span>
                    </div>
                    <p class="text-gray-700">{{ review.comment }}</p>
                  </div>
                </div>
              </div>

              <!-- No Reviews State -->
              <div v-else class="text-center py-8">
                <i class="fas fa-star text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 mb-4">Chưa có đánh giá nào cho sản phẩm này</p>
                <button class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                  Viết đánh giá đầu tiên
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-12">
        <div class="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <i class="fas fa-pills mr-2 text-blue-500"></i>
            SẢN PHẨM TƯƠNG TỰ
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <div 
              v-for="relatedProduct in relatedProducts" 
              :key="relatedProduct.id"
              class="bg-white border rounded-lg p-3 hover:shadow-lg transition-shadow cursor-pointer group"
              @click="viewProduct(relatedProduct.id)"
            >
              <div class="relative">
                <img :src="relatedProduct.image" :alt="relatedProduct.name" class="w-full h-32 object-cover rounded" />
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
      tabs: [
        { id: 'description', name: 'Mô tả sản phẩm' },
        { id: 'specifications', name: 'Thông số kỹ thuật' }
        // { id: 'reviews', name: 'Đánh giá' }
      ],
      relatedProducts: [],
      weightOptions: []
    }
  },
  
  computed: {
    productId() {
      return parseInt(this.$route.params.id)
    },
    
    productImages() {
      if (!this.product) return []
      
      // Use images from product data if available
      if (this.product.images && this.product.images.length > 0) {
        return this.product.images
      }
      
      // Generate multiple images for product gallery using main image and fallbacks
      return [
        this.product.image,
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=400&fit=crop'
      ].filter(Boolean)
    },

    sampleReviews() {
      // Generate sample reviews based on product data
      if (!this.product || this.product.reviewCount === 0) return []
      
      return [
        {
          id: 1,
          author: 'Anh Tuấn - Chăn nuôi Hòa Bình',
          rating: 5,
          date: '2 tuần trước',
          comment: `Sản phẩm ${this.product.name} rất hiệu quả, gia súc khỏe mạnh hơn sau khi sử dụng. Sẽ mua lại.`
        },
        {
          id: 2,
          author: 'Chị Mai - Trang trại Thanh Hóa',
          rating: 4,
          date: '1 tháng trước',
          comment: `Chất lượng tốt, giá cả hợp lý. Giao hàng nhanh chóng. Recommend cho các bạn chăn nuôi.`
        },
        {
          id: 3,
          author: 'Anh Nam - HTX Nông nghiệp',
          rating: 5,
          date: '1 tháng trước',
          comment: 'Sản phẩm chính hãng, hiệu quả rõ rệt. Đội ngũ tư vấn chuyên nghiệp.'
        }
      ]
    }
  },
  
  methods: {
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
        
        // Setup data sau khi load product
        this.currentImage = this.productImages[0] || this.product.image
        this.setupWeightOptions()
        await this.loadRelatedProducts()
        
      } catch (error) {
        console.error('Error loading product:', error)
        this.productNotFound = true
      }
    },
    
    setupWeightOptions() {
      // Set weight options based on product package size or default options
      if (this.product.packageSize) {
        this.weightOptions = [this.product.packageSize]
        this.selectedWeight = this.product.packageSize
      } else {
        // Default weight options for products without specific package size
        this.weightOptions = ['1 lọ/chai', '5 lọ/thùng', '10 lọ/thùng']
        this.selectedWeight = this.weightOptions[0]
      }
    },
    
    async loadRelatedProducts() {
      try {
        // Lấy tất cả sản phẩm từ API thay vì static
        const allProducts = await ProductAPI.getAllProducts()
        
        // Filter sản phẩm cùng category, loại trừ sản phẩm hiện tại
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
      const original = typeof originalPrice === 'string' 
        ? parseInt(originalPrice.replace(/,/g, '')) 
        : originalPrice
      const current = typeof currentPrice === 'string' 
        ? parseInt(currentPrice.replace(/,/g, '')) 
        : currentPrice
      return new Intl.NumberFormat('vi-VN').format(original - current)
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

    getStarPercentage(starLevel) {
      // Calculate percentage for rating breakdown
      if (!this.product.reviewCount) return 0
      
      // Simulate distribution based on average rating
      const distributions = {
        5: { 5: 60, 4: 25, 3: 10, 2: 3, 1: 2 },
        4: { 5: 30, 4: 50, 3: 15, 2: 3, 1: 2 },
        3: { 5: 10, 4: 20, 3: 40, 2: 20, 1: 10 }
      }
      
      const ratingGroup = Math.round(this.product.rating)
      return distributions[ratingGroup]?.[starLevel] || 0
    },

    getStarCount(starLevel) {
      const percentage = this.getStarPercentage(starLevel)
      return Math.round((percentage / 100) * this.product.reviewCount)
    },
    
    addToCart() {
      if (!this.product.inStock) return
      const { addToCart, openCart } = useCart()
      
      // Thêm sản phẩm vào giỏ với số lượng từ biến quantity có sẵn
      addToCart(this.product, this.quantity)
      
      // Hiển thị thông báo
      alert(`Đã thêm ${this.quantity} sản phẩm "${this.product.name}" vào giỏ hàng!`)
      
      // Mở giỏ hàng
      setTimeout(() => {
        openCart()
      }, 500)
    },
    
    viewProduct(productId) {
      // Navigate to another product detail page
      this.$router.push(`/product/${productId}`)
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
    }
  },
  
  watch: {
    // Watch for route changes to load new product
    '$route'() {
      this.product = null
      this.productNotFound = false
      this.loadProduct()
    }
  },
  
  mounted() {
    this.loadProduct()
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

/* Ensure consistent image aspect ratios */
.product-image {
  aspect-ratio: 1 / 1;
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

/* Product gallery hover effects */
.gallery-thumb:hover {
  transform: scale(1.05);
  transition: transform 0.2s ease;
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
}

/* Main Image Container */
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

/* Thumbnail Container */
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

/* Thumbnail Image */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-image-container {
    aspect-ratio: 4 / 3;
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

/* Loading placeholder */
.main-product-image[src=""],
.thumbnail-image[src=""] {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23d1d5db' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 3rem;
}
</style>