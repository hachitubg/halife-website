<template>
  <div class="about-view">
    <!-- Header Component -->
    <Header 
      @search="handleSearch"
      :categories="categories"
    />

    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-500 to-primary-700 py-16 md:py-24">
      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div 
        class="absolute inset-0 bg-cover bg-center"
        style="background-color: #515151;"
      ></div>
      
      <!-- Content -->
      <div class="relative container mx-auto px-4 text-center text-white">
        <h1 class="text-3xl md:text-5xl font-bold mb-4">Trang giới thiệu</h1>
        <p class="text-lg md:text-xl opacity-90">HALIFE ANIMALS - CÔNG NGHỆ THÚ Y ĐỘC QUYỀN NHẬT BẢN</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8 md:py-12">
      <!-- Company Introduction -->
      <div class="max-w-4xl mx-auto mb-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Công ty cổ phần thuốc thú y HALIFE Việt Nhật
          </h2>
          <div class="w-24 h-1 bg-primary-500 mx-auto mb-6"></div>
          <p class="text-lg text-gray-600 leading-relaxed">
            Công ty Cổ phần Thuốc Thú y HALIFE Việt Nhật (HALIFE Animal Health) là đơn vị tiên phong trong việc phát triển và ứng dụng giải pháp thú y công nghệ cao, mang tầm quốc tế, được chuyển giao trực tiếp từ Nhật Bản. Chúng tôi tập trung nghiên cứu, sản xuất và phân phối các sản phẩm sinh học – đặc biệt là dòng Best Phage độc quyền – nhằm thay thế kháng sinh truyền thống, hướng tới chăn nuôi an toàn, sạch và bền vững
          </p>
        </div>

        <!-- Featured Image -->
        <div class="mb-12">
          <img 
            src="/public/images/Halife_anh_bia.jpg" 
            alt="HALIFE" 
            class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        <!-- Company Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div class="text-center">
            <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-calendar-alt text-2xl text-primary-500"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">15+</h3>
            <p class="text-gray-600">Năm kinh nghiệm</p>
          </div>
          
          <div class="text-center">
            <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-users text-2xl text-green-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">10,000+</h3>
            <p class="text-gray-600">Khách hàng tin tựa</p>
          </div>
          
          <div class="text-center">
            <div class="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-fish text-2xl text-orange-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">200+</h3>
            <p class="text-gray-600">Sản phẩm chất lượng</p>
          </div>
          
          <div class="text-center">
            <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-shipping-fast text-2xl text-purple-600"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">24/7</h3>
            <p class="text-gray-600">Hỗ trợ khách hàng</p>
          </div>
        </div>
      </div>

      <!-- Vision & Mission -->
      <div class="bg-gray-50 rounded-lg p-8 md:p-12 mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Vision -->
          <div>
            <div class="flex items-center mb-6">
              <div class="bg-primary-500 rounded-full p-3 mr-4">
                <i class="fas fa-eye text-white text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-800">Tầm nhìn</h3>
            </div>
            <p class="text-gray-600 leading-relaxed">
              Trở thành thương hiệu dẫn đầu về thuốc thú y sinh học, tiên phong thay thế kháng sinh bằng công nghệ an toàn và bền vững cho ngành chăn nuôi.
            </p>
          </div>

          <!-- Mission -->
          <div>
            <div class="flex items-center mb-6">
              <div class="bg-green-500 rounded-full p-3 mr-4">
                <i class="fas fa-heart text-white text-xl"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-800">Sứ mệnh</h3>
            </div>
            <p class="text-gray-600 leading-relaxed">
              Mang đến giải pháp thú y sinh học an toàn, không kháng sinh – giúp vật nuôi khỏe mạnh, người chăn nuôi yên tâm và cộng đồng được bảo vệ trước nguy cơ kháng kháng sinh.
            </p>
          </div>
        </div>
      </div>

      <!-- Core Values -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Giá trị cốt lõi</h2>
          <div class="w-24 h-1 bg-primary-500 mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-award text-2xl text-primary-500"></i>
            </div>
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Chất lượng</h4>
            <p class="text-gray-600 text-sm">
              Cam kết cung cấp sản phẩm đạt tiêu chuẩn chất lượng cao nhất
            </p>
          </div>

          <div class="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-leaf text-2xl text-green-600"></i>
            </div>
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Tự nhiên</h4>
            <p class="text-gray-600 text-sm">
              Ưu tiên sản phẩm tự nhiên, an toàn cho sức khỏe con người
            </p>
          </div>

          <div class="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-handshake text-2xl text-orange-600"></i>
            </div>
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Uy tín</h4>
            <p class="text-gray-600 text-sm">
              Xây dựng mối quan hệ lâu dài dựa trên sự tin tưởng
            </p>
          </div>

          <div class="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div class="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <i class="fas fa-rocket text-2xl text-purple-600"></i>
            </div>
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Đổi mới</h4>
            <p class="text-gray-600 text-sm">
              Không ngừng nghiên cứu và ứng dụng công nghệ tiên tiến
            </p>
          </div>
        </div>
      </div>

      <!-- Technology Partnership -->
      <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-8 md:p-12 mb-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Công nghệ thú y độc quyền Nhật Bản
            </h3>
            <div class="space-y-4 text-gray-600">
              <div class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                <p>Ứng dụng công nghệ nano trong sản xuất thuốc thú y</p>
              </div>
              <div class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                <p>Quy trình sản xuất theo tiêu chuẩn GMP quốc tế</p>
              </div>
              <div class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                <p>Nghiên cứu và phát triển liên tục với đối tác Nhật Bản</p>
              </div>
              <div class="flex items-start">
                <i class="fas fa-check-circle text-green-500 mr-3 mt-1"></i>
                <p>Chuyển giao công nghệ hiện đại và bền vững</p>
              </div>
            </div>
          </div>
          
          <div class="text-center">
            <img 
              src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop" 
              alt="Công nghệ Nhật Bản" 
              class="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <div class="text-center mb-8">
          <h3 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>
          <div class="w-24 h-1 bg-primary-500 mx-auto"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Company Info -->
          <div class="space-y-6">
            <div class="flex items-center">
              <div class="bg-blue-100 rounded-full p-3 mr-4">
                <i class="fas fa-building text-primary-500"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-800">Tên công ty</h4>
                <p class="text-gray-600">Công ty cổ phần thuốc thú y HALIFE Việt Nhật</p>
              </div>
            </div>

            <div class="flex items-center">
              <div class="bg-green-100 rounded-full p-3 mr-4">
                <i class="fas fa-map-marker-alt text-green-600"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-800">Địa chỉ</h4>
                <p class="text-gray-600">82 Võ Chí Công, Phường Nghĩa Đô, Quận Cầu Giấy, Hà Nội</p>
              </div>
            </div>

            <div class="flex items-center">
              <div class="bg-orange-100 rounded-full p-3 mr-4">
                <i class="fas fa-phone text-orange-600"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-800">Hotline</h4>
                <p class="text-gray-600">
                  <a href="tel:0866583223" class="text-primary-500 hover:text-blue-800">0866.583.223</a>
                </p>
              </div>
            </div>

            <div class="flex items-center">
              <div class="bg-purple-100 rounded-full p-3 mr-4">
                <i class="fas fa-globe text-purple-600"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-800">Website</h4>
                <p class="text-gray-600">
                  <a href="https://halife.vn" target="_blank" class="text-primary-500 hover:text-blue-800">halife.vn</a>
                </p>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="space-y-4">
            <div class="bg-blue-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-800 mb-4">Liên hệ nhanh</h4>
              <div class="space-y-3">
                <a href="tel:0866583223" class="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <i class="fas fa-phone text-green-500 mr-3"></i>
                  <span class="font-medium">Gọi điện ngay</span>
                </a>
                
                <router-link to="/contact" class="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <i class="fas fa-envelope text-blue-500 mr-3"></i>
                  <span class="font-medium">Gửi tin nhắn</span>
                </router-link>
                
                <router-link to="/products" class="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <i class="fas fa-shopping-cart text-orange-500 mr-3"></i>
                  <span class="font-medium">Xem sản phẩm</span>
                </router-link>
              </div>
            </div>

            <!-- Business Hours -->
            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="font-semibold text-gray-800 mb-4">Giờ làm việc</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Thứ 2 - Thứ 6:</span>
                  <span class="font-medium">8:00 - 17:30</span>
                </div>
                <div class="flex justify-between">
                  <span>Thứ 7:</span>
                  <span class="font-medium">8:00 - 12:00</span>
                </div>
                <div class="flex justify-between">
                  <span>Chủ nhật:</span>
                  <span class="font-medium text-red-500">Nghỉ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg text-white p-8 md:p-12 mt-16 text-center">
        <h3 class="text-2xl md:text-3xl font-bold mb-4">
          Sẵn sàng trải nghiệm sản phẩm chất lượng?
        </h3>
        <p class="text-lg opacity-90 mb-8">
          Liên hệ với chúng tôi ngay hôm nay để được tư vấn và hỗ trợ tốt nhất
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="tel:0866583223" class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            <i class="fas fa-phone mr-2"></i>
            Gọi ngay: 0866.583.223
          </a>
          <router-link to="/products" class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            <i class="fas fa-shopping-cart mr-2"></i>
            Xem sản phẩm
          </router-link>
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
  name: 'AboutView',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      categories: sidebarCategories
    }
  },
  methods: {
    handleSearch(query) {
      this.$router.push({
        path: '/products',
        query: { search: query }
      })
    }
  },
  mounted() {
    // Set page title
    document.title = 'Giới thiệu - HALIFE Animals'
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Công ty cổ phần thuốc thú y HALIFE Việt Nhật - Công nghệ thú y độc quyền Nhật Bản, cung cấp sản phẩm chất lượng cao cho ngành chăn nuôi.')
    }
  }
}
</script>

<style scoped>
/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Transition effects */
.transition-shadow {
  transition: box-shadow 0.3s ease;
}

.transition-colors {
  transition: color 0.3s ease;
}

/* Hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Button animations */
a:hover, button:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Card hover effects */
.bg-white:hover {
  transition: all 0.3s ease;
}

/* Counter animation */
@keyframes countUp {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-count {
  animation: countUp 0.6s ease-out;
}

/* Background patterns */
.bg-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0);
  background-size: 20px 20px;
}

/* Section spacing */
.section-spacing {
  padding: 4rem 0;
}

@media (max-width: 768px) {
  .section-spacing {
    padding: 2rem 0;
  }
}

/* Responsive text sizes */
@media (max-width: 768px) {
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .text-4xl {
    font-size: 2.25rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
}

/* Loading animation for images */
img {
  transition: opacity 0.3s ease;
}

img:not([src]) {
  opacity: 0;
}

/* Print styles */
@media print {
  .about-view {
    color-adjust: exact;
  }
  
  .bg-gradient-to-r {
    background: #2563eb !important;
    color: white !important;
  }
  
  .shadow-lg, .shadow-md {
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
  }
}

/* Accessibility improvements */
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>