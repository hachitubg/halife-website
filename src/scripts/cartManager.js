// src/scripts/cartManager.js
import { ref, computed, watch } from 'vue'

const cartItems = ref([])
const isCartOpen = ref(false)

// Load cart from localStorage on initialization
const loadCart = () => {
  try {
    const saved = localStorage.getItem('halife_cart')
    if (saved) {
      cartItems.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading cart:', error)
    cartItems.value = []
  }
}

// Save cart to localStorage
const saveCart = () => {
  try {
    localStorage.setItem('halife_cart', JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

// Watch for changes and auto-save
watch(cartItems, saveCart, { deep: true })

// Computed properties
const cartCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    let price = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/[,đ₫]/g, '')) 
      : item.price
    
    // Nếu giá quá nhỏ, nhân 1000 để thành VNĐ
    if (price < 1000) {
      price = price * 1000
    }
    
    return total + (price * item.quantity)
  }, 0)
})

const cartSubtotal = computed(() => cartTotal.value)

const cartTax = computed(() => Math.round(cartTotal.value * 0.1)) // 10% VAT

const cartGrandTotal = computed(() => cartSubtotal.value + cartTax.value)

// Cart actions
const addToCart = (product, quantity = 1) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartItems.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      discount: product.discount || 0,
      quantity: quantity,
      addedAt: new Date().toISOString()
    })
  }
  
  // Show success notification
  showNotification(`Đã thêm "${product.name}" vào giỏ hàng`)
}

const removeFromCart = (productId) => {
  const index = cartItems.value.findIndex(item => item.id === productId)
  if (index > -1) {
    const removedItem = cartItems.value[index]
    cartItems.value.splice(index, 1)
    showNotification(`Đã xóa "${removedItem.name}" khỏi giỏ hàng`)
  }
}

const updateQuantity = (productId, newQuantity) => {
  const item = cartItems.value.find(item => item.id === productId)
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = newQuantity
    }
  }
}

const clearCart = () => {
  cartItems.value = []
  showNotification('Đã xóa tất cả sản phẩm khỏi giỏ hàng')
}

const openCart = () => {
  isCartOpen.value = true
}

const closeCart = () => {
  isCartOpen.value = false
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

// Notification system
const notifications = ref([])

const showNotification = (message, type = 'success', duration = 3000) => {
  const id = Date.now()
  const notification = {
    id,
    message,
    type,
    show: true
  }
  
  notifications.value.push(notification)
  
  setTimeout(() => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }, duration)
}

// Utility functions
const formatPrice = (price) => {
  let numPrice = typeof price === 'string' 
    ? parseInt(price.replace(/[,đ₫]/g, '')) 
    : price
  
  // Nếu giá quá nhỏ (< 1000), có thể cần nhân 1000
  if (numPrice < 1000) {
    numPrice = numPrice * 1000
  }
  
  return new Intl.NumberFormat('vi-VN').format(numPrice)
}

const calculateSavings = (originalPrice, currentPrice, quantity = 1) => {
  const original = typeof originalPrice === 'string' 
    ? parseInt(originalPrice.replace(/,/g, '')) 
    : originalPrice
  const current = typeof currentPrice === 'string' 
    ? parseInt(currentPrice.replace(/,/g, '')) 
    : currentPrice
  return (original - current) * quantity
}

// Demo checkout function
const checkout = () => {
  return new Promise((resolve) => {
    // Simulate checkout process
    setTimeout(() => {
      const orderData = {
        items: [...cartItems.value],
        total: cartGrandTotal.value,
        orderDate: new Date().toISOString(),
        orderId: 'HL' + Date.now()
      }
      
      // Save order to localStorage for demo
      const orders = JSON.parse(localStorage.getItem('halife_orders') || '[]')
      orders.push(orderData)
      localStorage.setItem('halife_orders', JSON.stringify(orders))
      
      // Clear cart
      clearCart()
      
      showNotification(`Đặt hàng thành công! Mã đơn: ${orderData.orderId}`, 'success', 5000)
      
      resolve(orderData)
    }, 2000)
  })
}

// Initialize cart on first import
loadCart()

export const useCart = () => {
  return {
    // State
    cartItems: cartItems,
    isCartOpen,
    notifications,
    
    // Computed
    cartCount,
    cartTotal,
    cartSubtotal,
    cartTax,
    cartGrandTotal,
    
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    checkout,
    showNotification,
    
    // Utilities
    formatPrice,
    calculateSavings,
    loadCart,
    saveCart
  }
}