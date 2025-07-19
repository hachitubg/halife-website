<template>
  <div> 

    <!-- Main Footer -->
    <footer class="bg-gray-100 py-8 md:py-12">
      <div class="container mx-auto px-4">
        <!-- Feature Icons -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8">
          <div class="text-center">
            <div class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <i class="fas fa-check"></i>
            </div>
            <h4 class="font-semibold text-blue-600 text-sm md:text-base">SẢN PHẨM</h4>
            <p class="text-xs md:text-sm text-gray-600">Chất lượng cao</p>
          </div>
          
          <div class="text-center">
            <div class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <h4 class="font-semibold text-blue-600 text-sm md:text-base">CHỦNG LOẠI</h4>
            <p class="text-xs md:text-sm text-gray-600">Phong phú</p>
          </div>
          
          <div class="text-center">
            <div class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <h4 class="font-semibold text-blue-600 text-sm md:text-base">GIÁ CẢ</h4>
            <p class="text-xs md:text-sm text-gray-600">Cạnh tranh</p>
          </div>
          
          <div class="text-center">
            <div class="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <i class="fas fa-truck"></i>
            </div>
            <h4 class="font-semibold text-blue-600 text-sm md:text-base">GIAO HÀNG</h4>
            <p class="text-xs md:text-sm text-gray-600">Nhanh chóng</p>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="border-t border-gray-200 pt-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <!-- Company Info -->
            <div class="lg:col-span-1">
              <div class="flex items-center mb-4">
                <img src="/images/logo_white.png" alt="HALIFE" class="h-10 w-10 mr-3 rounded-full">
                <div>
                  <h4 class="font-bold text-blue-600">HALIFE ANIMALS</h4>
                  <p class="text-sm text-gray-600">Công ty cổ phần thuốc thú y HALIFE Việt Nhật</p>
                </div>
              </div>
              
              <div class="space-y-3 text-sm text-gray-600">
                <div class="flex items-start">
                  <i class="fas fa-map-marker-alt mr-3 mt-1 text-blue-500"></i>
                  <span>82 Võ Chí Công, Phường Nghĩa Đô, Quận Cầu Giấy, Hà Nội</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-envelope mr-3 text-blue-500"></i>
                  <a href="mailto:info@halife.vn" class="hover:text-blue-600">info@halife.vn</a>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-phone mr-3 text-blue-500"></i>
                  <a href="tel:0866583223" class="hover:text-blue-600">0866.583.223</a>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-fax mr-3 text-blue-500"></i>
                  <span>024.3333.4444</span>
                </div>
                <div class="flex items-center">
                  <i class="fas fa-globe mr-3 text-blue-500"></i>
                  <a href="https://halife.vn" class="hover:text-blue-600">halife.vn</a>
                </div>
              </div>

              <!-- Social Media -->
              <div class="mt-6">
                <h5 class="font-semibold text-gray-800 mb-3">Theo dõi chúng tôi</h5>
                <div class="flex space-x-3">
                  <a href="#" class="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <i class="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                    <i class="fab fa-youtube"></i>
                  </a>
                  <a href="#" class="bg-blue-400 text-white p-2 rounded-full hover:bg-blue-500 transition-colors">
                    <i class="fab fa-twitter"></i>
                  </a>
                  <a href="#" class="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors">
                    <i class="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>

            <!-- About Us -->
            <div>
              <h4 class="font-semibold text-gray-800 mb-4">VỀ CHÚNG TÔI</h4>
              <ul class="space-y-2 text-sm text-gray-600">
                <li><a href="#" class="hover:text-blue-600 transition-colors">Giới thiệu công ty</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Tầm nhìn & sứ mệnh</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Lịch sử phát triển</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Đội ngũ chuyên gia</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Chứng nhận & giải thưởng</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Cơ hội nghề nghiệp</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Liên hệ</a></li>
              </ul>
            </div>

            <!-- Customer Support -->
            <div>
              <h4 class="font-semibold text-gray-800 mb-4">HỖ TRỢ KHÁCH HÀNG</h4>
              <ul class="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="tel:0866583223" class="hover:text-blue-600 transition-colors flex items-center">
                    <i class="fas fa-phone mr-2 text-green-500"></i>
                    Hotline: 0866.583.223
                  </a>
                </li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Câu hỏi thường gặp</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Hướng dẫn đặt hàng</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Hướng dẫn thanh toán</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Chính sách vận chuyển</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Chính sách đổi trả</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Bảo hành sản phẩm</a></li>
              </ul>
            </div>

            <!-- Policies & Legal -->
            <div>
              <h4 class="font-semibold text-gray-800 mb-4">CHÍNH SÁCH & PHÁP LÝ</h4>
              <ul class="space-y-2 text-sm text-gray-600">
                <li><a href="#" class="hover:text-blue-600 transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Quy chế hoạt động</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Giải quyết khiếu nại</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">An toàn thông tin</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Chống rửa tiền</a></li>
                <li><a href="#" class="hover:text-blue-600 transition-colors">Sitemap</a></li>
              </ul>

              <!-- Quick Links -->
              <div class="mt-6">
                <h5 class="font-semibold text-gray-800 mb-3">LIÊN KẾT NHANH</h5>
                <ul class="space-y-2 text-sm text-gray-600">
                  <li><a href="#" class="hover:text-blue-600 transition-colors">Sản phẩm khuyến mãi</a></li>
                  <li><a href="#" class="hover:text-blue-600 transition-colors">Sản phẩm mới</a></li>
                  <li><a href="#" class="hover:text-blue-600 transition-colors">Sản phẩm bán chạy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment & Security -->
        <div class="border-t border-gray-200 mt-8 pt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Payment Methods -->
            <div>
              <h5 class="font-semibold text-gray-800 mb-3">PHƯƠNG THỨC THANH TOÁN</h5>
              <div class="flex flex-wrap gap-2">
                <div class="bg-white border rounded px-3 py-2 text-xs font-semibold text-gray-600">VISA</div>
                <div class="bg-white border rounded px-3 py-2 text-xs font-semibold text-gray-600">MASTERCARD</div>
                <div class="bg-white border rounded px-3 py-2 text-xs font-semibold text-gray-600">MOMO</div>
                <div class="bg-white border rounded px-3 py-2 text-xs font-semibold text-gray-600">ZALOPAY</div>
                <div class="bg-white border rounded px-3 py-2 text-xs font-semibold text-gray-600">BANKING</div>
                <div class="bg-white border rounded px-3 py-2 text-xs font-semibold text-gray-600">COD</div>
              </div>
            </div>

            <!-- Certifications -->
            <div>
              <h5 class="font-semibold text-gray-800 mb-3">CHỨNG NHẬN & BẢO MẬT</h5>
              <div class="flex flex-wrap gap-2">
                <div class="bg-green-100 border border-green-300 rounded px-3 py-2 text-xs font-semibold text-green-700">
                  <i class="fas fa-shield-alt mr-1"></i>
                  SSL SECURITY
                </div>
                <div class="bg-blue-100 border border-blue-300 rounded px-3 py-2 text-xs font-semibold text-blue-700">
                  <i class="fas fa-certificate mr-1"></i>
                  ISO 9001
                </div>
                <div class="bg-yellow-100 border border-yellow-300 rounded px-3 py-2 text-xs font-semibold text-yellow-700">
                  <i class="fas fa-award mr-1"></i>
                  GMP
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-200 mt-8 pt-4">
          <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <div class="mb-2 md:mb-0 text-center md:text-left">
              <p>&copy; 2024 HALIFE ANIMALS - CÔNG NGHỆ THÚ Y ĐỘC QUYỀN NHẬT BẢN</p>
              <p class="text-xs mt-1">Giấy phép kinh doanh số: 0123456789 do Sở KH&ĐT TP Hà Nội cấp</p>
            </div>
            <div class="flex items-center space-x-4 text-xs">
              <a href="#" class="hover:text-blue-600">Điều khoản</a>
              <span>|</span>
              <a href="#" class="hover:text-blue-600">Bảo mật</a>
              <span>|</span>
              <a href="#" class="hover:text-blue-600">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    subscribeNewsletter() {
      if (this.email && this.validateEmail(this.email)) {
        // TODO: Implement newsletter subscription
        console.log('Đăng ký newsletter:', this.email)
        alert('Cảm ơn bạn đã đăng ký nhận tin khuyến mãi!')
        this.email = ''
      } else {
        alert('Vui lòng nhập email hợp lệ')
      }
    },
    
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }
  }
}
</script>

<style scoped>
/* Transition effects */
.transition-colors {
  transition: color 0.3s ease;
}

/* Link hover effects */
a:hover {
  transition: all 0.3s ease;
}

/* Social media icons animation */
.social-media a {
  transition: transform 0.3s ease;
}

.social-media a:hover {
  transform: translateY(-2px);
}

/* Newsletter input focus */
input:focus {
  box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>