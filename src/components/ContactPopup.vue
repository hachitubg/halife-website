<template>
  <!-- Popup Overlay -->
  <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" @click="closePopup">
    <!-- Popup Content -->
    <div class="popup-container" @click.stop>
      <!-- Desktop Layout -->
      <div class="hidden lg:flex bg-white rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl">
        <!-- Left Side - Image Banner -->
        <div class="lg:w-1/2 relative overflow-hidden">
          <img 
            :src="popupBanner" 
            alt="HALIFE Promotion Banner"
            class="w-full h-full object-cover"
          />
        </div>
        
        <!-- Right Side - Form -->
        <div class="w-full lg:w-1/2 p-6 md:p-8 lg:p-10 bg-gradient-to-br from-gray-50 to-white">
          <!-- Close button -->
          <div class="flex justify-between items-start mb-6">
            <div>
              <h3 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-3">
                ĐĂNG KÝ NHẬN ƯU ĐÃI
              </h3>
              <div class="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
              <p class="text-gray-600 text-sm mt-3">Điền thông tin để nhận mã giảm giá ngay!</p>
            </div>
            <button @click="closePopup" class="text-gray-400 hover:text-gray-600 text-3xl p-2 hover:bg-gray-100 rounded-full transition-all">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <!-- Form -->
          <form @submit.prevent="submitForm" class="space-y-5">
            <!-- Name -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-user text-primary-400"></i>
              </div>
              <input 
                v-model="form.name"
                type="text" 
                placeholder="Họ và tên của bạn *" 
                required
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-primary-200 focus:border-primary-500 transition-all bg-white shadow-sm hover:shadow-md"
              >
            </div>
            
            <!-- Phone -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-phone text-primary-400"></i>
              </div>
              <input 
                v-model="form.phone"
                type="tel" 
                placeholder="Số điện thoại *" 
                required
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-primary-200 focus:border-primary-500 transition-all bg-white shadow-sm hover:shadow-md"
              >
            </div>
            
            <!-- Email -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-envelope text-primary-400"></i>
              </div>
              <input 
                v-model="form.email"
                type="email" 
                placeholder="Địa chỉ email" 
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-primary-200 focus:border-primary-500 transition-all bg-white shadow-sm hover:shadow-md"
              >
            </div>
            
            <!-- Location -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i class="fas fa-map-marker-alt text-primary-400"></i>
              </div>
              <select 
                v-model="form.location"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-3 focus:ring-primary-200 focus:border-primary-500 transition-all bg-white shadow-sm hover:shadow-md text-gray-700 appearance-none"
              >
                <option value="">Chọn tỉnh/thành phố</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="haiphong">Hải Phòng</option>
                <option value="cantho">Cần Thơ</option>
                <option value="quangninh">Quảng Ninh</option>
                <option value="nghean">Nghệ An</option>
                <option value="dongthap">Đồng Tháp</option>
                <option value="other">Tỉnh/thành khác</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <i class="fas fa-chevron-down text-primary-400"></i>
              </div>
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="submitting"
              class="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center"
            >
              <i v-if="submitting" class="fas fa-spinner fa-spin mr-3"></i>
              <i v-else class="fas fa-gift mr-3"></i>
              {{ submitting ? 'ĐANG GỬI...' : 'NHẬN MÃ GIẢM GIÁ NGAY' }}
            </button>
          </form>
          
          <!-- Success Message -->
          <div v-if="showSuccess" class="mt-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-md">
            <div class="flex items-center">
              <i class="fas fa-check-circle text-2xl mr-3 text-green-600"></i>
              <div>
                <div class="font-bold">Cảm ơn bạn đã đăng ký!</div>
                <div class="text-sm">Chúng tôi sẽ liên hệ trong vòng 15 phút với mã giảm giá 50%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="lg:hidden bg-white rounded-2xl w-full max-w-md mx-auto overflow-hidden shadow-2xl mobile-popup">
        <!-- Close button - Top right -->
        <div class="absolute top-4 right-4 z-10">
          <button @click="closePopup" class="bg-white bg-opacity-90 text-gray-500 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all">
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>

        <!-- Top Image Banner -->
        <div class="relative h-48 overflow-hidden">
          <img 
            :src="popupBanner" 
            alt="HALIFE Promotion Banner"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Form Section -->
        <div class="p-6 bg-white">
          <!-- Title -->
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
              ĐĂNG KÝ NHẬN MÃ GIẢM 50%
            </h3>
            <div class="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-2"></div>
            <p class="text-gray-600 text-sm">Điền thông tin để được tư vấn</p>
          </div>
          
          <!-- Form -->
          <form @submit.prevent="submitForm" class="space-y-4">
            <!-- Name -->
            <div class="relative">
              <input 
                v-model="form.name"
                type="text" 
                placeholder="Tên của bạn" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-sm"
              >
            </div>
            
            <!-- Phone -->
            <div class="relative">
              <input 
                v-model="form.phone"
                type="tel" 
                placeholder="Số điện thoại" 
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-sm"
              >
            </div>
            
            <!-- Email -->
            <div class="relative">
              <input 
                v-model="form.email"
                type="email" 
                placeholder="Email" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-sm"
              >
            </div>
            
            <!-- Location -->
            <div class="relative">
              <select 
                v-model="form.location"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white text-gray-700 text-sm appearance-none"
              >
                <option value="">—Vui lòng chọn—</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="haiphong">Hải Phòng</option>
                <option value="cantho">Cần Thơ</option>
                <option value="quangninh">Quảng Ninh</option>
                <option value="nghean">Nghệ An</option>
                <option value="dongthap">Đồng Tháp</option>
                <option value="other">Tỉnh/thành khác</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
              </div>
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="submitting"
              class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none flex items-center justify-center"
            >
              <i v-if="submitting" class="fas fa-spinner fa-spin mr-2"></i>
              {{ submitting ? 'ĐANG GỬI...' : 'LẤY MÃ GIẢM GIÁ' }}
            </button>
          </form>
          
          <!-- Success Message -->
          <div v-if="showSuccess" class="mt-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md">
            <div class="flex items-center">
              <i class="fas fa-check-circle text-lg mr-2 text-green-600"></i>
              <div>
                <div class="font-bold text-sm">Cảm ơn bạn đã đăng ký!</div>
                <div class="text-xs">Chúng tôi sẽ liên hệ trong vòng 15 phút</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BannerAPI } from '@/utils/bannerAPI.js'

export default {
  name: 'ContactPopup',
  data() {
    return {
      showPopup: false,
      submitting: false,
      showSuccess: false,
      popupBanner: '/images/popup-banner-default.jpg',
      cleanupListener: null,
      form: {
        name: '',
        phone: '',
        email: '',
        location: ''
      }
    }
  },
  async mounted() {
    try {
      // Load popup banner using BannerAPI
      this.popupBanner = await BannerAPI.initializePopupBanner(this)
      
      // Setup event listener
      this.cleanupListener = BannerAPI.setupPopupBannerListener(this)
      
    } catch (error) {
      console.error('❌ Error initializing ContactPopup:', error)
      this.popupBanner = '/images/popup-banner-default.jpg'
    }
    
    // Show popup after 2 seconds
    setTimeout(() => {
      this.openPopup()
    }, 2000)
  },
  beforeUnmount() {
    if (this.cleanupListener) {
      this.cleanupListener()
    }
  },
  methods: {
    openPopup() {
      this.showPopup = true
    },
    
    closePopup() {
      this.showPopup = false
      this.showSuccess = false
    },
    
    async submitForm() {
      // Validate required fields
      if (!this.form.name.trim() || !this.form.phone.trim()) {
        alert('Vui lòng điền đầy đủ tên và số điện thoại!')
        return
      }
      
      this.submitting = true
      
      try {
        // Send email using BannerAPI
        await BannerAPI.sendContactEmail(this.form)
        
        // Show success message
        this.showSuccess = true
        
        // Reset form
        this.resetForm()
        
        // Auto close popup after 3 seconds
        setTimeout(() => {
          this.closePopup()
        }, 3000)
        
      } catch (error) {
        console.error('❌ Error submitting form:', error)
        alert('Có lỗi xảy ra, vui lòng thử lại!')
      } finally {
        this.submitting = false
      }
    },
    
    resetForm() {
      this.form = {
        name: '',
        phone: '',
        email: '',
        location: ''
      }
    }
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.fixed {
  animation: fadeIn 0.4s ease;
}

.popup-container > div {
  animation: slideUp 0.5s ease;
}

/* Mobile popup specific */
.mobile-popup {
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

/* Input focus effects */
input:focus, select:focus {
  transform: translateY(-1px);
  box-shadow: 0 5px 15px rgba(0, 35, 145, 0.1);
}

/* Button hover effect */
button[type="submit"]:not(:disabled):hover {
  box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
}

/* Desktop specific styles */
@media (min-width: 1024px) {
  input:focus, select:focus {
    box-shadow: 0 10px 25px rgba(0, 35, 145, 0.1);
  }
  
  button[type="submit"]:not(:disabled):hover {
    box-shadow: 0 15px 35px rgba(0, 35, 145, 0.3);
  }
}

/* Mobile responsive adjustments */
@media (max-width: 1023px) {
  .popup-container {
    margin: 1rem;
    max-width: 400px;
  }
}

@media (max-width: 640px) {
  .popup-container {
    margin: 0.5rem;
  }
  
  .mobile-popup {
    border-radius: 1rem;
  }
  
  .p-6 {
    padding: 1.5rem;
  }
}

/* Gradient text support for older browsers */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Custom scrollbar for mobile */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #002391;
  border-radius: 2px;
}

/* Select arrow styling */
select {
  background-image: none;
}

/* Trust indicators responsive */
@media (max-width: 480px) {
  .gap-4 {
    gap: 0.75rem;
  }
  
  .flex-wrap > div {
    font-size: 0.65rem;
  }
}
</style>