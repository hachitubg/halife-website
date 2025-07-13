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
            <div class="relative">
              <img 
                :src="currentImage" 
                :alt="product.name" 
                class="w-full h-80 md:h-96 object-cover rounded-lg"
              />
              <div v-if="product.discount > 0" class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{{ product.discount }}%
              </div>
              <div v-if="product.isFeatured" class="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <i class="fas fa-star mr-1"></i>Nổi bật
              </div>
            </div>
            
            <!-- Thumbnail Images -->
            <div v-if="productImages.length > 1" class="grid grid-cols-4 gap-2">
              <div 
                v-for="(image, index) in productImages" 
                :key="index"
                class="cursor-pointer border-2 rounded-lg overflow-hidden"
                :class="{ 'border-blue-500': currentImage === image, 'border-gray-200': currentImage !== image }"
                @click="currentImage = image"
              >
                <img :src="image" :alt="`${product.name} ${index + 1}`" class="w-full h-20 object-cover" />
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <!-- Product Title -->
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <span>SKU: THY{{ String(product.id).padStart(3, '0') }}</span>
                <span v-if="product.rating > 0" class="flex items-center">
                  <i class="fas fa-star text-yellow-400 mr-1"></i>
                  {{ product.rating }} ({{ product.reviewCount || 0 }} đánh giá)
                </span>
                <span :class="product.inStock ? 'text-green-600' : 'text-red-600'">
                  <i :class="product.inStock ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="mr-1"></i>
                  {{ product.inStock ? 'Còn hàng' : 'Hết hàng' }}
                </span>
              </div>
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
                Tiết kiệm {{ calculateSavings(product.originalPrice, product.price) }}₫ ({{ product.discount }}%)
              </div>
            </div>

            <!-- Product Details -->
            <div class="space-y-3">
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
            </div>

            <!-- Promotion Banner (cho sản phẩm nổi bật) -->
            <div v-if="product.isFeatured" class="bg-red-50 border border-red-200 rounded-lg p-4">
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
            <div v-else-if="product.packageSize" class="text-sm text-gray-600">
              <span class="font-medium">Quy cách:</span> {{ product.packageSize }}
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
                class="w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center"
                :class="product.inStock 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              >
                <i class="fas fa-shopping-cart mr-2"></i>
                {{ product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng' }}
              </button>
              <button 
                @click="buyNow"
                :disabled="!product.inStock"
                class="w-full py-3 px-6 rounded-lg font-semibold transition-colors"
                :class="product.inStock 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
              >
                MUA NGAY
              </button>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  @click="addToWishlist"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <i class="fas fa-heart mr-1"></i>
                  Yêu thích
                </button>
                <button 
                  @click="compareProduct"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <i class="fas fa-balance-scale mr-1"></i>
                  So sánh
                </button>
                <button 
                  @click="shareProduct"
                  class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <i class="fas fa-share-alt mr-1"></i>
                  Chia sẻ
                </button>
              </div>
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
import { sidebarCategories, products, getProductById, getProductsByCategory } from '@/data/products.js'

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
      currentImage: '',
      selectedWeight: '',
      quantity: 1,
      activeTab: 'description',
      tabs: [
        { id: 'description', name: 'Mô tả sản phẩm' },
        { id: 'specifications', name: 'Thông số kỹ thuật' },
        { id: 'reviews', name: 'Đánh giá' }
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
    handleSearch(query) {
      this.$router.push({
        path: '/products',
        query: { search: query }
      })
    },
    
    loadProduct() {
      // Load product from products.js data
      this.product = getProductById(this.productId)
      
      if (this.product) {
        this.currentImage = this.product.image
        
        // Set up weight options based on product data
        this.setupWeightOptions()
        
        this.loadRelatedProducts()
        this.productNotFound = false
        
        // Update page title
        document.title = `${this.product.name} - HALIFE Animals`
        
        // Set meta description
        const metaDescription = document.querySelector('meta[name="description"]')
        if (metaDescription) {
          const description = this.product.metaDescription || this.product.description || this.product.name
          metaDescription.setAttribute('content', description)
        }

        // Set meta keywords if available
        if (this.product.seoKeywords && this.product.seoKeywords.length > 0) {
          let metaKeywords = document.querySelector('meta[name="keywords"]')
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta')
            metaKeywords.setAttribute('name', 'keywords')
            document.head.appendChild(metaKeywords)
          }
          metaKeywords.setAttribute('content', this.product.seoKeywords.join(', '))
        }
      } else {
        this.productNotFound = true
        document.title = 'Không tìm thấy sản phẩm - HALIFE Animals'
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
    
    loadRelatedProducts() {
      // Get related products from the same category
      const categoryProducts = getProductsByCategory(this.product.category)
      this.relatedProducts = categoryProducts
        .filter(p => p.id !== this.productId)
        .slice(0, 5)
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
      
      const cartItem = {
        product: this.product,
        weight: this.selectedWeight,
        quantity: this.quantity
      }
      console.log('Thêm vào giỏ hàng:', cartItem)
      alert(`Đã thêm ${this.quantity} ${this.selectedWeight} "${this.product.name}" vào giỏ hàng`)
    },
    
    buyNow() {
      if (!this.product.inStock) return
      
      console.log('Mua ngay:', {
        product: this.product,
        weight: this.selectedWeight,
        quantity: this.quantity
      })
      alert(`Đang chuyển đến trang thanh toán cho sản phẩm "${this.product.name}"`)
    },
    
    addToWishlist() {
      console.log('Thêm vào yêu thích:', this.product.name)
      alert(`Đã thêm "${this.product.name}" vào danh sách yêu thích`)
    },
    
    compareProduct() {
      console.log('Thêm vào so sánh:', this.product.name)
      alert(`Đã thêm "${this.product.name}" vào danh sách so sánh`)
    },
    
    shareProduct() {
      console.log('Chia sẻ sản phẩm:', this.product.name)
      if (navigator.share) {
        navigator.share({
          title: this.product.name,
          text: this.product.description,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Đã copy link sản phẩm vào clipboard')
        }).catch(() => {
          alert('Không thể chia sẻ. Vui lòng copy link thủ công.')
        })
      }
    },
    
    viewProduct(productId) {
      // Navigate to another product detail page
      this.$router.push(`/product/${productId}`)
    }
  },
  
  watch: {
    // Watch for route changes to load new product
    '$route'() {
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
</style>