<template>
  <!-- Popup Overlay -->
  <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" @click="closePopup">
    <!-- Popup Content -->
    <div class="bg-white rounded-2xl max-w-5xl w-full flex overflow-hidden shadow-2xl" @click.stop>
      <!-- Left Side - Image/Promotion -->
      <div class="hidden lg:block lg:w-1/2 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 relative overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center p-8">
          <div class="text-center text-white relative z-10">
            <!-- Logo Area -->
            <div class="mb-6">
              <div class="bg-white bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-paw text-4xl text-white"></i>
              </div>
              <h2 class="text-2xl font-bold">HALIFE ANIMALS</h2>
              <p class="text-primary-100 text-sm">Công nghệ thú y Nhật Bản</p>
            </div>
            
            <!-- Badge -->
            <div class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 inline-block shadow-lg transform -rotate-3">
              🎉 ƯU ĐÃI ĐẶC BIỆT
            </div>
            
            <!-- Main offer -->
            <div class="mb-8">
              <div class="text-7xl font-black text-yellow-300 mb-2 drop-shadow-lg">50%</div>
              <div class="text-xl font-bold mb-2">GIẢM GIÁ NGAY HÔM NAY</div>
              <div class="text-lg text-primary-100">Cho 50 khách hàng đầu tiên</div>
              <div class="text-sm text-primary-200 mt-2">Áp dụng cho tất cả sản phẩm</div>
            </div>
            
            <!-- Products illustration -->
            <div class="flex justify-center items-center space-x-3 mb-6">
              <div class="bg-white bg-opacity-90 rounded-lg p-3 text-center min-w-[70px]">
                <i class="fas fa-pills text-primary-600 text-lg mb-1"></i>
                <div class="text-xs text-primary-700 font-semibold">THUỐC<br>THÚ Y</div>
              </div>
              <div class="bg-white bg-opacity-90 rounded-lg p-3 text-center min-w-[70px]">
                <i class="fas fa-award text-orange-600 text-lg mb-1"></i>
                <div class="text-xs text-orange-700 font-semibold">CHẤT<br>LƯỢNG</div>
              </div>
              <div class="bg-white bg-opacity-90 rounded-lg p-3 text-center min-w-[70px]">
                <i class="fas fa-shipping-fast text-green-600 text-lg mb-1"></i>
                <div class="text-xs text-green-700 font-semibold">GIAO<br>NHANH</div>
              </div>
            </div>
            
            <!-- Contact CTA -->
            <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 text-sm shadow-lg">
              <div class="flex items-center justify-center">
                <i class="fas fa-phone-alt mr-2 animate-pulse"></i>
                <span class="font-semibold">LIÊN HỆ NGAY: 0866.583.223</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Decorative elements -->
        <div class="absolute top-8 right-8 w-24 h-24 bg-yellow-300 rounded-full opacity-20 animate-float"></div>
        <div class="absolute bottom-12 left-12 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-float" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 right-4 w-12 h-12 bg-white rounded-full opacity-10 animate-float" style="animation-delay: 2s;"></div>
      </div>
      
      <!-- Right Side - Form -->
      <div class="w-full lg:w-1/2 p-6 md:p-8 lg:p-10 bg-gradient-to-br from-gray-50 to-white">
        <!-- Mobile Header (only show on mobile) -->
        <div class="lg:hidden text-center mb-6 p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white -mx-2 -mt-2">
          <h2 class="text-xl font-bold mb-1">🎉 GIẢM GIÁ 50%</h2>
          <p class="text-sm text-primary-100">Ưu đãi đặc biệt hôm nay!</p>
        </div>
        
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
          
          <!-- Security note -->
          <div class="flex items-center justify-center text-xs text-gray-500 mt-4">
            <i class="fas fa-shield-alt mr-2 text-green-500"></i>
            Thông tin của bạn được bảo mật tuyệt đối
          </div>
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
        
        <!-- Trust indicators -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
          <div class="flex items-center">
            <i class="fas fa-star text-yellow-400 mr-1"></i>
            <span>4.9/5 đánh giá</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-users text-blue-500 mr-1"></i>
            <span>10,000+ khách hàng</span>
          </div>
          <div class="flex items-center">
            <i class="fas fa-shipping-fast text-green-500 mr-1"></i>
            <span>Giao hàng 24h</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactPopup',
  data() {
    return {
      showPopup: false,
      submitting: false,
      showSuccess: false,
      form: {
        name: '',
        phone: '',
        email: '',
        location: ''
      }
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
        // Simulate API call to send email
        await this.sendEmailToAdmin()
        
        // Show success message
        this.showSuccess = true
        
        // Reset form
        this.resetForm()
        
        // Auto close popup after 3 seconds
        setTimeout(() => {
          this.closePopup()
        }, 3000)
        
      } catch (error) {
        console.error('Error submitting form:', error)
        alert('Có lỗi xảy ra, vui lòng thử lại!')
      } finally {
        this.submitting = false
      }
    },
    
    async sendEmailToAdmin() {
      // Import EmailJS
      const emailjs = await import('@emailjs/browser')
      
      // EmailJS configuration
      const serviceId = 'service_dlzpqnu'
      const templateId = 'template_5iugwni'
      const publicKey = 'y2eF1NKDKicGABCFN'
      
      // Email template parameters
      const templateParams = {
        from_name: this.form.name,
        phone: this.form.phone,
        email: this.form.email || 'Không cung cấp',
        location: this.form.location || 'Không chọn',
        timestamp: new Date().toLocaleString('vi-VN'),
        to_email: 'info@halife.vn' // Admin email
      }
      
      try {
        // Send email using EmailJS
        const response = await emailjs.default.send(
          serviceId,
          templateId,
          templateParams,
          publicKey
        )
        
        console.log('Email sent successfully:', response)
        return response
        
      } catch (error) {
        console.error('EmailJS Error:', error)
        throw error
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
  },
  
  mounted() {
    // Show popup after 2 seconds on every page load
    setTimeout(() => {
      this.openPopup()
    }, 2000)
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

.bg-white {
  animation: slideUp 0.5s ease;
}

/* Input focus effects */
input:focus, select:focus {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 35, 145, 0.1);
}

/* Button hover effect */
button[type="submit"]:not(:disabled):hover {
  box-shadow: 0 15px 35px rgba(0, 35, 145, 0.3);
}

/* Mobile responsive */
@media (max-width: 1024px) {
  .bg-white {
    margin: 1rem;
    max-height: 95vh;
    overflow-y: auto;
  }
  
  .lg\:w-1\/2 {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .bg-white {
    margin: 0.5rem;
    border-radius: 1rem;
  }
  
  .p-6 {
    padding: 1.5rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-3xl {
    font-size: 1.75rem;
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