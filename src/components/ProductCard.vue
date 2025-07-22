<template>
  <div 
    class="bg-white border-2 border-blue-100 rounded-lg hover:shadow-lg transition-all duration-300 relative group cursor-pointer overflow-hidden"
    @click="viewProductDetail"
  >
    <!-- Product Image - Full top section -->
    <div class="product-image-container">
      <!-- Discount Badge -->
      <div v-if="product.discount > 0" class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
        -{{ product.discount }}%
      </div>
      
      <!-- Stock Status Badge -->
      <div v-if="!product.inStock" class="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
        Hết hàng
      </div>
      
      <!-- Featured Badge -->
      <div v-if="product.isFeatured && product.inStock" class="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
        <i class="fas fa-star mr-1"></i>Hot
      </div>

      <img 
        :src="getImageSrc(product)" 
        :alt="product.name" 
        class="product-image"
        :class="{ 'opacity-60': !product.inStock }"
        loading="lazy"
        @error="handleImageError"
      >
    </div>
    
    <!-- Product Info - Bottom section -->
    <div class="p-3 md:p-4 flex flex-col justify-between h-auto">
      <!-- Product Category -->
      <div class="text-xs font-medium mb-2 uppercase tracking-wide text-center" style="color: #002391;">
        {{ product.category }}
      </div>
      
      <!-- Product Name -->
      <h4 
        class="product-name font-bold text-lg md:text-xl mb-3 line-clamp-2 hover:opacity-80 transition-all leading-tight text-center"
        style="color: #002391;"
        @click.stop="viewProductDetail"
      >
        {{ product.name }}
      </h4>
      
      <!-- Product Description (only for detailed view) -->
      <p v-if="showDescription" class="text-sm md:text-base text-gray-600 mb-3 line-clamp-2 leading-relaxed text-center">
        {{ product.description }}
      </p>
      
      <!-- Price Section -->
      <div class="flex flex-col items-center space-y-1 mb-4">
        <div class="flex items-center justify-center space-x-2">
          <span class="font-bold text-xl md:text-2xl" style="color: #002391;">{{ formatPrice(product.price) }}₫</span>
          <span v-if="product.originalPrice !== product.price" class="text-gray-400 text-sm md:text-base line-through">{{ formatPrice(product.originalPrice) }}₫</span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <button 
        @click.stop="handleAddToCart"
        :disabled="!product.inStock"
        class="w-full py-3 md:py-4 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 text-center"
        :class="product.inStock 
          ? 'text-white hover:shadow-md' 
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'"
        :style="product.inStock ? 'background-color: #002391;' : ''"
        @mouseover="product.inStock ? $event.target.style.backgroundColor = '#001a6b' : null"
        @mouseout="product.inStock ? $event.target.style.backgroundColor = '#002391' : null"
      >
        <i class="fas fa-cart-plus mr-2"></i>
        {{ product.inStock ? 'Thêm vào giỏ' : 'Hết hàng' }}
      </button>
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
        // Sử dụng useCart giống HomeView
        const { addToCart, openCart } = useCart()
        addToCart(this.product, 1)
        
        // Hiển thị thông báo
        alert(`Đã thêm "${this.product.name}" vào giỏ hàng!`)
        
        // Mở giỏ hàng sau 500ms
        setTimeout(() => {
          openCart()
        }, 500)
        
        // Emit event cho parent component (nếu cần)
        this.$emit('add-to-cart', this.product)
      }
    },
    
    viewProductDetail() {
      // Navigate to product detail page
      this.$router.push(`/product/${this.product.id}`)
    },
    
    handleImageError(event) {
      // Fallback image when image fails to load
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2MEgxNDBWMTQwSDYwVjYwWiIgc3Ryb2tlPSIjOUIzOEQ2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSI4MCIgcj0iMTAiIHN0cm9rZT0iIzlCOEQ2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTcwIDExMEwxMDAgODBMMTMwIDExMCIgc3Ryb2tlPSIjOUIzOEQ2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHRleHQgeD0iMTAwIiB5PSIxNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzlCMzNENiI+S2jDdG5nIGPDsyDhuKNuaDwvdGV4dD4KPC9zdmc+'
    },
    
    getImageSrc(product) {
      if (!product.image || product.image.trim() === '' || product.image === 'nan') {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA2MEgxNDBWMTQwSDYwVjYwWiIgc3Ryb2tlPSIjOUIzOEQ2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSI4MCIgcj0iMTAiIHN0cm9rZT0iIzlCOEQ2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTcwIDExMEwxMDAgODBMMTMwIDExMCIgc3Ryb2tlPSIjOUIzOEQ2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHRleHQgeD0iMTAwIiB5PSIxNjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzlCMzNENiI+S2jDtG5nIGPDsyDhuKNuaDwvdGV4dD4KPC9zdmc+'
      }
      return product.image
    },
    
    formatPrice(price) {
      if (!price) return '0'
      
      // Convert string to number if needed
      let numPrice = typeof price === 'string' 
        ? parseInt(price.replace(/[,đ₫]/g, '')) 
        : price
      
      // If price is less than 1000, assume it's in thousands
      if (numPrice < 1000) {
        numPrice = numPrice * 1000
      }
      
      return new Intl.NumberFormat('vi-VN').format(numPrice)
    }
  }
}
</script>

<style scoped>
.bg-white {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background-color: #f8fafc;
  border-radius: 0.5rem 0.5rem 0 0; 
}

@media (min-width: 768px) {
  .product-image-container {
    height: 300px;
  }
}

.product-image {
  width: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  background-color: white;
}

.group:hover .product-image {
  transform: scale(1.05);
}

.product-name {
  text-shadow: 0 1px 3px rgba(0, 35, 145, 0.1);
  font-weight: 700;
  letter-spacing: -0.025em;
}

.product-name:hover {
  text-shadow: 0 2px 4px rgba(0, 35, 145, 0.15);
  transform: translateY(-1px);
}

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

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-all {
  transition: all 0.3s ease;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:disabled {
  transform: none;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
  border-color: #002391;
}

.border-blue-100 {
  border-color: #dbeafe;
}
</style>