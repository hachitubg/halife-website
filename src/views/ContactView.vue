<template>
  <div class="contact-view">
    <!-- Header Component -->
    <Header 
      @search="handleSearch"
      :categories="categories"
    />

    <!-- Page Header -->
    <div class="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16 md:py-24">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div 
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1200&h=600&fit=crop&crop=center')"
      ></div>
      
      <!-- Content -->
      <div class="relative container mx-auto px-4 text-center text-white">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">Trang liên hệ</h1>
        <p class="text-lg md:text-xl opacity-90">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8 md:py-12">
      <!-- Company Info Section -->
      <div class="mb-12">
        <div class="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Company Details -->
            <div class="lg:w-1/2">
              <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                CÔNG TY CỔ PHẦN THUỐC THÚ Y HALIFE VIỆT NHẬT
              </h2>
              
              <div class="space-y-4 text-gray-600">
                <p class="leading-relaxed">
                  Mọi thắc mắc quý khách vui lòng liên hệ tới chúng tôi thông qua thông tin bên 
                  dưới hoặc quý khách có thể điền thông tin ở form bên cạnh. Chúng tôi sẽ liên 
                  hệ giải đáp thắc mắc tới quý khách một cách sớm nhất.
                </p>
              </div>

              <div class="mt-8 space-y-4">
                <!-- Address -->
                <div class="flex items-start">
                  <div class="bg-blue-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <i class="fas fa-map-marker-alt text-blue-600"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800 mb-1">Địa chỉ</h3>
                    <p class="text-gray-600">82 Võ Chí Công, Phường Nghĩa Đô, Quận Cầu Giấy, Hà Nội</p>
                  </div>
                </div>

                <!-- Email -->
                <div class="flex items-start">
                  <div class="bg-green-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <i class="fas fa-envelope text-green-600"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800 mb-1">Email</h3>
                    <a href="mailto:info@halife.vn" class="text-blue-600 hover:text-blue-800">info@halife.vn</a>
                  </div>
                </div>

                <!-- Phone -->
                <div class="flex items-start">
                  <div class="bg-orange-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <i class="fas fa-phone text-orange-600"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800 mb-1">Điện thoại</h3>
                    <a href="tel:0866583223" class="text-blue-600 hover:text-blue-800">0866.583.223</a>
                  </div>
                </div>

                <!-- Business Hours -->
                <div class="flex items-start">
                  <div class="bg-purple-100 p-3 rounded-full mr-4 flex-shrink-0">
                    <i class="fas fa-clock text-purple-600"></i>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-800 mb-1">Giờ làm việc</h3>
                    <p class="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                    <p class="text-gray-600">Thứ 7: 8:00 - 12:00</p>
                    <p class="text-gray-600">Chủ nhật: Nghỉ</p>
                  </div>
                </div>
              </div>

              <!-- Certification Badge -->
              <div class="mt-8">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=80&h=80&fit=crop&crop=center" 
                    alt="Đã thông báo Bộ Công Thương" 
                    class="w-16 h-16 rounded mr-4"
                  >
                  <div>
                    <h4 class="font-semibold text-blue-800">ĐÃ THÔNG BÁO</h4>
                    <p class="text-blue-600 text-sm">BỘ CÔNG THƯƠNG</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="lg:w-1/2">
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h3>
                
                <form @submit.prevent="submitForm" class="space-y-4">
                  <!-- Name -->
                  <div>
                    <input 
                      type="text" 
                      v-model="form.name"
                      placeholder="Họ và tên..." 
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>

                  <!-- Email -->
                  <div>
                    <input 
                      type="email" 
                      v-model="form.email"
                      placeholder="Địa chỉ email..." 
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>

                  <!-- Phone -->
                  <div>
                    <input 
                      type="tel" 
                      v-model="form.phone"
                      placeholder="Số điện thoại..." 
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                  </div>

                  <!-- Subject -->
                  <div>
                    <select 
                      v-model="form.subject"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chọn chủ đề...</option>
                      <option value="product-inquiry">Hỏi về sản phẩm</option>
                      <option value="technical-support">Hỗ trợ kỹ thuật</option>
                      <option value="partnership">Hợp tác kinh doanh</option>
                      <option value="complaint">Khiếu nại</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <!-- Message -->
                  <div>
                    <textarea 
                      v-model="form.message"
                      placeholder="Nhập nội dung liên hệ..." 
                      rows="5"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    ></textarea>
                  </div>

                  <!-- Submit Button -->
                  <button 
                    type="submit"
                    :disabled="submitting"
                    class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <i v-if="submitting" class="fas fa-spinner fa-spin mr-2"></i>
                    <i v-else class="fas fa-paper-plane mr-2"></i>
                    {{ submitting ? 'Đang gửi...' : 'GỬI LIÊN HỆ' }}
                  </button>
                </form>

                <!-- Success Message -->
                <div v-if="showSuccess" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <i class="fas fa-check-circle mr-2"></i>
                  Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <div class="mb-12">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="bg-blue-600 text-white p-4 md:p-6">
            <h2 class="text-xl md:text-2xl font-bold flex items-center">
              <i class="fas fa-map-marked-alt mr-3"></i>
              Vị trí của chúng tôi
            </h2>
            <p class="mt-2 opacity-90">82 Võ Chí Công, Phường Nghĩa Đô, Quận Cầu Giấy, Hà Nội</p>
          </div>
          
          <!-- Google Maps Embed -->
          <div class="relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8639810262687!2d105.79825861493236!3d21.038132985993474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4ba02c6809%3A0x5c23f5e3b3f5e3b3!2zODIgVsO0IENow60gQ8O0bmcsIE5naGnDsSDEkMO0LCBD4bqndSBHaeG6pXksIEjDoCBO4buZaSwgVmlldG5hbQ!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%" 
              height="400" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              class="w-full"
            ></iframe>
            
            <!-- Map Overlay for mobile -->
            <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center md:hidden pointer-events-none">
              <div class="bg-white bg-opacity-90 px-4 py-2 rounded-lg">
                <p class="text-sm font-medium text-gray-800">
                  <i class="fas fa-touch mr-2"></i>
                  Chạm để xem bản đồ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Contact Methods -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Live Chat -->
        <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-comments text-2xl text-green-600"></i>
          </div>
          <h3 class="font-semibold text-lg mb-2">Chat trực tuyến</h3>
          <p class="text-gray-600 text-sm mb-4">Hỗ trợ 24/7 qua chat</p>
          <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            Bắt đầu chat
          </button>
        </div>

        <!-- Hotline -->
        <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-phone text-2xl text-blue-600"></i>
          </div>
          <h3 class="font-semibold text-lg mb-2">Hotline</h3>
          <p class="text-gray-600 text-sm mb-4">Gọi ngay để được hỗ trợ</p>
          <a href="tel:0866583223" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-block">
            0866.583.223
          </a>
        </div>

        <!-- Email Support -->
        <div class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div class="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-envelope text-2xl text-orange-600"></i>
          </div>
          <h3 class="font-semibold text-lg mb-2">Email hỗ trợ</h3>
          <p class="text-gray-600 text-sm mb-4">Gửi email cho chúng tôi</p>
          <a href="mailto:info@halife.vn" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors inline-block">
            Gửi email
          </a>
        </div>
      </div>
    </div>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { sidebarCategories } from '@/data/products.js'

export default {
  name: 'ContactView',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      categories: sidebarCategories,
      submitting: false,
      showSuccess: false,
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      }
    }
  },
  methods: {
    handleSearch(query) {
      // Redirect to products page with search query
      this.$router.push({
        path: '/products',
        query: { search: query }
      })
    },

    async submitForm() {
      // Validate form
      if (!this.form.name || !this.form.email || !this.form.message) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }

      this.submitting = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // TODO: Replace with actual API call
        console.log('Contact form submitted:', this.form)
        
        // Show success message
        this.showSuccess = true
        
        // Reset form
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        }

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccess = false
        }, 5000)

      } catch (error) {
        console.error('Error submitting form:', error)
        alert('Có lỗi xảy ra khi gửi form. Vui lòng thử lại sau.')
      } finally {
        this.submitting = false
      }
    }
  },

  mounted() {
    // Set page title
    document.title = 'Liên hệ - HALIFE Animals'
  }
}
</script>

<style scoped>
/* Map responsive */
@media (max-width: 768px) {
  iframe {
    height: 300px;
  }
}

/* Form animations */
.form-group {
  transition: all 0.3s ease;
}

.form-group:focus-within {
  transform: translateY(-2px);
}

/* Contact method cards hover */
.contact-method-card:hover {
  transform: translateY(-5px);
  transition: all 0.3s ease;
}

/* Success message animation */
.success-message {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading button */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Mobile responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .text-3xl {
    font-size: 2rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
}
</style>