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
            <div class="grid grid-cols-4 gap-2">
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
                <span class="flex items-center">
                  <i class="fas fa-star text-yellow-400 mr-1"></i>
                  4.8 (124 đánh giá)
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
              <div class="flex">
                <span class="font-medium text-gray-700 w-32">Quy cách:</span>
                <span>{{ selectedWeight }}</span>
              </div>
              <div class="flex">
                <span class="font-medium text-gray-700 w-32">Tình trạng:</span>
                <span class="text-green-600">{{ product.inStock ? 'Còn hàng' : 'Hết hàng' }}</span>
              </div>
              <div class="flex">
                <span class="font-medium text-gray-700 w-32">Xuất xứ:</span>
                <span>Nhật Bản - Việt Nam</span>
              </div>
            </div>

            <!-- Promotion Banner (cho sản phẩm nổi bật) -->
            <div v-if="product.isFeatured" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <div class="bg-red-500 text-white rounded-full p-2">
                  <i class="fas fa-gift"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-red-600 mb-2">KHUYẾN MÃI ĐặC BIỆT</h3>
                  <div class="space-y-1 text-sm">
                    <div class="flex items-start">
                      <span class="font-medium text-red-600 mr-2">1.</span>
                      <span>Tặng kèm 1 chai dung dịch sát trùng 100ml</span>
                    </div>
                    <div class="flex items-start">
                      <span class="font-medium text-red-600 mr-2">2.</span>
                      <span>Miễn phí vận chuyển toàn quốc cho đơn hàng trên 500.000₫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Weight/Size Selection -->
            <div>
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
                    class="w-16 text-center border-0 focus:outline-none"
                  />
                  <button 
                    @click="increaseQuantity"
                    class="p-2 hover:bg-gray-100"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <span class="text-sm text-gray-600">(Còn {{ Math.floor(Math.random() * 50) + 20 }} sản phẩm)</span>
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
              <p class="text-gray-600 mb-4">{{ product.description }}</p>
              <div class="mt-6">
                <h4 class="font-semibold mb-3">Thông tin chi tiết:</h4>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <ul class="space-y-2 text-sm">
                    <li><strong>Công nghệ:</strong> Sản xuất theo tiêu chuẩn GMP của Nhật Bản</li>
                    <li><strong>Hiệu quả:</strong> Tác dụng nhanh, an toàn cho gia súc gia cầm</li>
                    <li><strong>Bảo quản:</strong> Nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp</li>
                    <li><strong>Hạn sử dụng:</strong> 36 tháng kể từ ngày sản xuất</li>
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
                    <div class="flex justify-between py-1 border-b border-gray-200">
                      <span>Quy cách:</span>
                      <span>{{ selectedWeight }}</span>
                    </div>
                    <div class="flex justify-between py-1 border-b border-gray-200">
                      <span>Xuất xứ:</span>
                      <span>Nhật Bản - Việt Nam</span>
                    </div>
                    <div class="flex justify-between py-1">
                      <span>Chứng nhận:</span>
                      <span>GMP, ISO 9001</span>
                    </div>
                  </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-semibold mb-3">Hướng dẫn sử dụng</h4>
                  <div class="text-sm space-y-2">
                    <p><strong>Liều dùng:</strong> Theo chỉ định của bác sĩ thú y</p>
                    <p><strong>Cách dùng:</strong> Pha với nước sạch hoặc trộn vào thức ăn</p>
                    <p><strong>Thời gian ngưng thuốc:</strong> 7-14 ngày trước khi xuất chuồng</p>
                    <p><strong>Lưu ý:</strong> Không dùng cho động vật có thai</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="activeTab === 'reviews'">
              <div class="text-center py-8">
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
      <div v-if="!product" class="text-center py-12">
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
      selectedWeight: '1 lọ/chai',
      quantity: 1,
      activeTab: 'description',
      tabs: [
        { id: 'description', name: 'Mô tả sản phẩm' },
        { id: 'specifications', name: 'Thông số kỹ thuật' },
        { id: 'reviews', name: 'Đánh giá' }
      ],
      relatedProducts: [],
      weightOptions: ['1 lọ/chai', '5 lọ/thùng', '10 lọ/thùng', '20 lọ/thùng']
    }
  },
  
  computed: {
    productId() {
      return parseInt(this.$route.params.id)
    },
    
    productImages() {
      // Generate multiple images for product gallery
      return [
        this.product?.image,
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=400&fit=crop'
      ].filter(Boolean)
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
        this.selectedWeight = this.weightOptions[0]
        this.loadRelatedProducts()
        this.productNotFound = false
        
        // Update page title
        document.title = `${this.product.name} - HALIFE Animals`
      } else {
        this.productNotFound = true
        document.title = 'Không tìm thấy sản phẩm - HALIFE Animals'
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
      this.quantity++
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