<template>
  <!-- Cart Drawer Overlay -->
  <div v-if="isCartOpen" class="fixed inset-0 z-50 overflow-hidden">
    <!-- Background Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeCart"></div>
    
    <!-- Cart Drawer -->
    <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
      <!-- Header -->
      <div class="bg-primary-500 text-white p-4 flex items-center justify-between">
        <div class="flex items-center">
          <i class="fas fa-shopping-cart text-xl mr-3"></i>
          <div>
            <h3 class="text-lg font-bold">Giỏ hàng</h3>
            <p class="text-primary-100 text-sm">{{ cartCount }} sản phẩm</p>
          </div>
        </div>
        <button @click="closeCart" class="text-white hover:text-primary-200 text-2xl p-1">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Cart Items -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Empty Cart -->
        <div v-if="cartItems.length === 0" class="text-center py-12">
          <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h4 class="text-xl font-semibold text-gray-600 mb-2">Giỏ hàng trống</h4>
          <p class="text-gray-500 mb-6">Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <button 
            @click="closeCart" 
            class="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>

        <!-- Cart Items List -->
        <div v-else class="space-y-4">
          <div 
            v-for="item in cartItems" 
            :key="item.id"
            class="bg-gray-50 rounded-lg p-4 flex items-center space-x-4"
          >
            <!-- Product Image -->
            <div class="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-full h-full object-contain"
                @error="handleImageError"
              >
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">
                {{ item.name }}
              </h4>
              <p class="text-xs text-gray-500 mb-2">{{ item.category }}</p>
              
              <!-- Price -->
              <div class="flex items-center space-x-2">
                <span class="text-orange-500 font-bold text-sm">
                  {{ formatPrice(item.price) }}₫
                </span>
                <span v-if="item.originalPrice && item.originalPrice !== item.price" 
                      class="text-gray-400 text-xs line-through">
                  {{ formatPrice(item.originalPrice) }}₫
                </span>
              </div>
              
              <!-- Discount -->
              <div v-if="item.discount > 0" class="text-xs text-green-600 font-medium">
                Tiết kiệm {{ formatPrice(calculateSavings(item.originalPrice, item.price, item.quantity)) }}₫
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex flex-col items-center space-y-2">
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button 
                  @click="updateQuantity(item.id, item.quantity - 1)"
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                >
                  <i class="fas fa-minus text-xs"></i>
                </button>
                <div class="w-12 h-8 flex items-center justify-center bg-white text-sm font-semibold">
                  {{ item.quantity }}
                </div>
                <button 
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg"
                >
                  <i class="fas fa-plus text-xs"></i>
                </button>
              </div>
              
              <!-- Remove Button -->
              <button 
                @click="removeFromCart(item.id)"
                class="text-red-500 hover:text-red-700 text-xs"
                title="Xóa sản phẩm"
              >
                <i class="fas fa-trash"></i> Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Summary & Actions -->
      <div v-if="cartItems.length > 0" class="border-t bg-white p-4 space-y-4">
        <!-- Summary -->
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Tạm tính:</span>
            <span class="font-semibold">{{ formatPrice(cartSubtotal) }}₫</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">VAT (10%):</span>
            <span class="font-semibold">{{ formatPrice(cartTax) }}₫</span>
          </div>
          <div class="flex justify-between text-lg font-bold border-t pt-2">
            <span>Tổng cộng:</span>
            <span class="text-primary-600">{{ formatPrice(cartGrandTotal) }}₫</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button 
            @click="handleCheckout"
            :disabled="checkingOut"
            class="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
          >
            <i v-if="checkingOut" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-credit-card mr-2"></i>
            {{ checkingOut ? 'Đang xử lý...' : 'Thanh toán' }}
          </button>
          
          <div class="flex space-x-2">
            <button 
              @click="closeCart"
              class="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Tiếp tục mua
            </button>
            <button 
              @click="clearCart"
              class="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        </div>

        <!-- Shipping Notice -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
          <div class="flex items-center text-green-700 text-sm">
            <i class="fas fa-shipping-fast mr-2"></i>
            <span>Miễn phí vận chuyển cho đơn hàng trên 500.000₫</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useCart } from '@/scripts/cartManager.js'

export default {
  name: 'CartDrawer',
  setup() {
    const {
      cartItems,
      isCartOpen,
      cartCount,
      cartSubtotal,
      cartTax,
      cartGrandTotal,
      closeCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
      formatPrice,
      calculateSavings
    } = useCart()

    const checkingOut = ref(false)

    const handleImageError = (event) => {
      event.target.src = '/images/placeholder-product.png'
    }

    const handleCheckout = async () => {
      checkingOut.value = true
      try {
        const order = await checkout()
        console.log('Order completed:', order)
        alert(`Đặt hàng thành công! Mã đơn: ${order.orderId}`)
        closeCart()
      } catch (error) {
        console.error('Checkout error:', error)
        alert('Có lỗi xảy ra khi đặt hàng!')
      } finally {
        checkingOut.value = false
      }
    }

    return {
      cartItems,
      isCartOpen,
      cartCount,
      cartSubtotal,
      cartTax,
      cartGrandTotal,
      checkingOut,
      closeCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      formatPrice,
      calculateSavings,
      handleImageError,
      handleCheckout
    }
  }
}
</script>

<style scoped>
/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth animations */
.transition-colors {
  transition: color 0.2s ease, background-color 0.2s ease;
}

/* Cart drawer slide animation */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.absolute.right-0 {
  animation: slideInRight 0.3s ease-out;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .max-w-md {
    max-width: 100%;
  }
}

/* Button hover effects */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:disabled {
  transform: none;
  cursor: not-allowed;
}
</style>