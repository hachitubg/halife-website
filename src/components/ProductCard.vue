<template>
  <div 
    class="bg-white border rounded-lg p-2 md:p-4 hover:shadow-lg transition-all duration-300 relative group cursor-pointer"
    @click="viewProductDetail"
  >
    <!-- Discount Badge -->
    <div v-if="product.discount > 0" class="absolute top-1 left-1 md:top-2 md:left-2 bg-red-500 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-semibold z-10">
      -{{ product.discount }}%
    </div>
    
    <!-- Stock Status Badge -->
    <div v-if="!product.inStock" class="absolute top-1 right-1 md:top-2 md:right-2 bg-gray-500 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-semibold z-10">
      Hết hàng
    </div>
    
    <!-- Featured Badge -->
    <div v-if="product.isFeatured && product.inStock" class="absolute top-1 right-1 md:top-2 md:right-2 bg-yellow-500 text-white px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs font-semibold z-10">
      <i class="fas fa-star mr-1"></i>Hot
    </div>
    
    <!-- Product Image - FIXED -->
    <div class="product-image-container">
      <img 
        :src="product.image" 
        :alt="product.name" 
        class="product-image"
        :class="{ 'opacity-60': !product.inStock }"
        loading="lazy"
        @error="handleImageError"
      >
      
      <!-- Quick View Overlay -->
      <div class="image-overlay">
        <button 
          @click.stop="viewProductDetail"
          class="quick-view-btn"
        >
          <i class="fas fa-eye mr-1"></i>Xem nhanh
        </button>
      </div>
    </div>
    
    <!-- Product Info -->
    <div class="flex-1">
      <!-- Product Category -->
      <div class="text-xs text-blue-500 font-medium mb-1">
        {{ product.category }}
      </div>
      
      <!-- Product Name -->
      <h4 
        class="font-semibold text-xs md:text-sm lg:text-base mb-1 md:mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] hover:text-blue-600 transition-colors"
        @click.stop="viewProductDetail"
      >
        {{ product.name }}
      </h4>
      
      <!-- Product Description (only for detailed view) -->
      <p v-if="showDescription" class="text-xs md:text-sm text-gray-600 mb-2 md:mb-3 line-clamp-2">
        {{ product.description }}
      </p>
      
      <!-- Rating (if available) -->
      <div v-if="product.rating" class="flex items-center mb-2">
        <div class="flex text-yellow-400 text-xs">
          <i v-for="i in 5" :key="i" :class="i <= product.rating ? 'fas fa-star' : 'far fa-star'"></i>
        </div>
        <span class="text-xs text-gray-500 ml-1">({{ product.reviewCount || 0 }})</span>
      </div>
      
      <!-- Price Section -->
      <div class="flex flex-col space-y-0.5 md:space-y-1 mb-2 md:mb-3">
        <div class="flex items-center space-x-2">
          <span class="text-orange-500 font-bold text-sm md:text-lg">{{ formatPrice(product.price) }}₫</span>
          <span v-if="product.originalPrice !== product.price" class="text-gray-400 text-xs md:text-sm line-through">{{ formatPrice(product.originalPrice) }}₫</span>
        </div>
        <div v-if="product.discount > 0" class="text-xs text-green-600 font-medium">
          Tiết kiệm {{ formatPrice(calculateSavings(product.originalPrice, product.price)) }} VNĐ ({{ product.discount }}%)
        </div>
      </div>
      
      <!-- Stock Indicator -->
      <div class="mb-2">
        <div v-if="product.inStock" class="flex items-center text-xs text-green-600">
          <i class="fas fa-check-circle mr-1"></i>
          Còn hàng
        </div>
        <div v-else class="flex items-center text-xs text-red-600">
          <i class="fas fa-times-circle mr-1"></i>
          Hết hàng
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col space-y-2">
      <!-- Add to Cart Button (only for detailed view) -->
      <button 
        v-if="showAddToCart" 
        @click.stop="handleAddToCart"
        :disabled="!product.inStock"
        class="w-full py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all duration-300"
        :class="product.inStock 
          ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
      >
        <i class="fas fa-cart-plus mr-1 md:mr-2"></i>
        {{ product.inStock ? 'Thêm vào giỏ' : 'Hết hàng' }}
      </button>
      
      <!-- Add to Cart -->
      <div class="mt-2">
        <button 
          @click.stop="handleAddToCart"
          :disabled="!product.inStock"
          class="w-full py-2 md:py-2.5 rounded-lg font-medium text-xs md:text-sm transition-all duration-300"
          :class="product.inStock 
            ? 'bg-primary-500 text-white hover:bg-primary-600 hover:shadow-md' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
        >
          <i class="fas fa-cart-plus mr-1 md:mr-2"></i>
          {{ product.inStock ? 'Thêm vào giỏ' : 'Hết hàng' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCart } from '@/scripts/cartManager.js'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
      validator(value) {
        return value && typeof value === 'object' && value.id && value.name && value.price
      }
    },
    showDescription: {
      type: Boolean,
      default: false
    },
    showAddToCart: {
      type: Boolean,
      default: false
    },
    showQuickActions: {
      type: Boolean,
      default: false
    }
  },
  emits: ['add-to-cart', 'quick-view', 'add-to-wishlist', 'compare', 'share'],
  methods: {
    handleAddToCart() {
      if (this.product.inStock) {
        this.$emit('add-to-cart', this.product)
      }
    },
    
    viewProductDetail() {
      // Navigate to product detail page
      this.$router.push(`/product/${this.product.id}`)
    },
    
    handleImageError(event) {
      // Fallback image when image fails to load
      event.target.src = '/images/placeholder-product.png'
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

    formatPrice(price) {
      let numPrice = typeof price === 'string' 
        ? parseInt(price.replace(/[,đ₫]/g, '')) 
        : price
      
      if (numPrice < 1000) {
        numPrice = numPrice * 1000
      }
      
      return new Intl.NumberFormat('vi-VN').format(numPrice)
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
  }
}
</script>

<style scoped>
/* FIXED: Product Image Container */
.product-image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1; /* Square aspect ratio */
  overflow: hidden;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #f8fafc; /* Light background for loading */
}

@media (min-width: 768px) {
  .product-image-container {
    margin-bottom: 0.75rem;
  }
}

/* FIXED: Product Image */
.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Hiển thị toàn bộ ảnh trong container */
  object-position: center;
  transition: transform 0.3s ease;
  background-color: white;
}

/* Alternative: Use cover for crop effect */
.product-image.cover-mode {
  object-fit: cover; /* Cắt ảnh để fill container */
}

/* Hover effect */
.group:hover .product-image {
  transform: scale(1.05);
}

/* Image Overlay */
.image-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group:hover .image-overlay {
  opacity: 1;
}

/* Quick View Button */
.quick-view-btn {
  background-color: white;
  color: #374151;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.quick-view-btn:hover {
  background-color: #f3f4f6;
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .product-image-container {
    aspect-ratio: 4 / 3; /* Slightly wider on mobile */
  }
}

/* Text utilities */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-all {
  transition: all 0.3s ease;
}

/* Ensure consistent card heights */
.min-h-card {
  min-height: 320px;
}

@media (min-width: 768px) {
  .min-h-card {
    min-height: 380px;
  }
}

@media (min-width: 1024px) {
  .min-h-card {
    min-height: 420px;
  }
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:disabled {
  transform: none;
}

/* Star rating animation */
.fa-star {
  transition: color 0.2s ease;
}

/* Card hover effect */
.cursor-pointer:hover {
  transform: translateY(-2px);
}

/* Loading state for images */
.product-image[src=""] {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath stroke='%23d1d5db' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 2rem;
}
</style>