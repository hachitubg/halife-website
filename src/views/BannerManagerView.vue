<template>
  <div class="banner-manager">
    <!-- Header -->
    <Header 
      @search="handleSearch"
      :categories="categories"
    />

    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Quản lý Banner</h1>
            <p class="text-gray-600">Thay đổi hình ảnh banner trang chủ và popup</p>
          </div>
          <button
            @click="openUploadModal('homepage')"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            <i class="fas fa-plus mr-2"></i>Thêm Banner
          </button>
        </div>
        
        <!-- Size Guidelines -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Banner Size Info -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <i class="fas fa-image text-blue-500 text-lg mr-2"></i>
              <h3 class="font-semibold text-blue-800">Kích thước Banner chuẩn</h3>
            </div>
            <div class="space-y-2 text-sm text-blue-700">
              <div class="flex justify-between">
                <span>Desktop:</span>
                <span class="font-mono font-semibold">2560 x 974 px</span>
              </div>
              <div class="flex justify-between">
                <span>Tablet:</span>
                <span class="font-mono font-semibold">1024 x 400 px</span>
              </div>
              <div class="flex justify-between">
                <span>Mobile:</span>
                <span class="font-mono font-semibold">768 x 300 px</span>
              </div>
              <div class="mt-3 pt-2 border-t border-blue-200">
                <p class="text-xs text-blue-600">
                  <i class="fas fa-info-circle mr-1"></i>
                  Tỉ lệ khung hình: 2.63:1 (chiều rộng : chiều cao)
                </p>
              </div>
            </div>
          </div>
          
          <!-- Product Image Size Info -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <i class="fas fa-box text-green-500 text-lg mr-2"></i>
              <h3 class="font-semibold text-green-800">Kích thước ảnh sản phẩm chuẩn</h3>
            </div>
            <div class="space-y-2 text-sm text-green-700">
              <div class="flex justify-between">
                <span>Ảnh chính:</span>
                <span class="font-mono font-semibold">800 x 800 px</span>
              </div>
              <div class="flex justify-between">
                <span>Ảnh phụ:</span>
                <span class="font-mono font-semibold">600 x 600 px</span>
              </div>
              <div class="flex justify-between">
                <span>Thumbnail:</span>
                <span class="font-mono font-semibold">300 x 300 px</span>
              </div>
              <div class="mt-3 pt-2 border-t border-green-200">
                <p class="text-xs text-green-600">
                  <i class="fas fa-info-circle mr-1"></i>
                  Tỉ lệ khung hình: 1:1 (hình vuông), định dạng PNG/JPG
                </p>
              </div>
            </div>
          </div>

          <!-- Popup Banner Size Info -->
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div class="flex items-center mb-3">
              <i class="fas fa-window-restore text-purple-500 text-lg mr-2"></i>
              <h3 class="font-semibold text-purple-800">Kích thước Banner Popup chuẩn</h3>
            </div>
            <div class="space-y-2 text-sm text-purple-700">
              <div class="flex justify-between">
                <span>Desktop:</span>
                <span class="font-mono font-semibold">600 x 800 px</span>
              </div>
              <div class="flex justify-between">
                <span>Tablet:</span>
                <span class="font-mono font-semibold">500 x 700 px</span>
              </div>
              <div class="flex justify-between">
                <span>Mobile:</span>
                <span class="font-mono font-semibold">400 x 600 px</span>
              </div>
              <div class="mt-3 pt-2 border-t border-purple-200">
                <p class="text-xs text-purple-600">
                  <i class="fas fa-info-circle mr-1"></i>
                  Tỉ lệ khung hình: 3:4 (chiều rộng : chiều cao)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Guidelines -->
        <div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-start">
            <i class="fas fa-lightbulb text-yellow-500 text-lg mr-3 mt-0.5"></i>
            <div>
              <h4 class="font-semibold text-yellow-800 mb-2">Hướng dẫn tối ưu hóa hình ảnh</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-yellow-700">
                <div>
                  <strong>Banner:</strong>
                  <ul class="mt-1 space-y-1">
                    <li>• Kích thước tối đa: 5MB</li>
                    <li>• Định dạng: JPG, PNG, WebP</li>
                    <li>• DPI: 72-150</li>
                  </ul>
                </div>
                <div>
                  <strong>Sản phẩm:</strong>
                  <ul class="mt-1 space-y-1">
                    <li>• Kích thước tối đa: 2MB</li>
                    <li>• Nền: Trong suốt hoặc trắng</li>
                    <li>• Chất lượng: 80-90%</li>
                  </ul>
                </div>
                <div>
                  <strong>Khuyến nghị:</strong>
                  <ul class="mt-1 space-y-1">
                    <li>• Sử dụng TinyPNG để nén</li>
                    <li>• Tránh text nhỏ trên banner</li>
                    <li>• Kiểm tra trên nhiều thiết bị</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Banner Type Tabs -->
        <div class="mt-6 border-b border-gray-200">
          <nav class="flex space-x-8">
            <button
              @click="activeBannerType = 'homepage'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeBannerType === 'homepage' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <i class="fas fa-home mr-2"></i>
              Banner Trang chủ ({{ homepageBanners.length }}/3)
            </button>
            <button
              @click="activeBannerType = 'popup'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeBannerType === 'popup' 
                  ? 'border-purple-500 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <i class="fas fa-window-restore mr-2"></i>
              Banner Popup ({{ popupBanner ? '1/1' : '0/1' }})
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Homepage Banners -->
      <div v-if="activeBannerType === 'homepage'" class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <i class="fas fa-home text-blue-500 mr-2"></i>
          Banner trang chủ ({{ homepageBanners.length }}/3)
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(banner, index) in homepageBanners" 
            :key="index"
            class="relative group"
          >
            <!-- Banner Preview -->
            <div class="relative overflow-hidden rounded-lg border-2 border-gray-200">
              <img 
                :src="banner" 
                :alt="`Homepage Banner ${index + 1}`"
                class="w-full h-32 object-cover"
              />
              
              <!-- Overlay Actions -->
              <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  @click="replaceHomepageBanner(index)"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  <i class="fas fa-edit mr-1"></i>Thay thế
                </button>
                <button
                  @click="deleteHomepageBanner(index)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  <i class="fas fa-trash mr-1"></i>Xóa
                </button>
              </div>
            </div>
            
            <!-- Banner Info -->
            <div class="mt-2 text-center">
              <p class="text-sm text-gray-600">Banner {{ index + 1 }}</p>
            </div>
          </div>
          
          <!-- Add New Slot -->
          <div 
            v-if="homepageBanners.length < 3"
            @click="openUploadModal('homepage')"
            class="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div class="text-center">
              <i class="fas fa-plus text-2xl text-gray-400 mb-2"></i>
              <p class="text-gray-500">Thêm Banner</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Popup Banner -->
      <div v-if="activeBannerType === 'popup'" class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <i class="fas fa-window-restore text-purple-500 mr-2"></i>
          Banner Popup ({{ popupBanner ? '1/1' : '0/1' }})
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Current Popup Banner -->
          <div v-if="popupBanner" class="relative group">
            <div class="relative overflow-hidden rounded-lg border-2 border-purple-200">
              <img 
                :src="popupBanner" 
                alt="Popup Banner"
                class="w-full h-48 object-cover"
              />
              
              <!-- Overlay Actions -->
              <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  @click="replacePopupBanner()"
                  class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                >
                  <i class="fas fa-edit mr-1"></i>Thay thế
                </button>
                <button
                  @click="deletePopupBanner()"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  <i class="fas fa-trash mr-1"></i>Xóa
                </button>
              </div>
            </div>
            
            <div class="mt-2 text-center">
              <p class="text-sm text-purple-600 font-medium">Banner Popup</p>
            </div>
          </div>
          
          <!-- Add Popup Banner -->
          <div 
            v-if="!popupBanner"
            @click="openUploadModal('popup')"
            class="border-2 border-dashed border-purple-300 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            <div class="text-center">
              <i class="fas fa-plus text-2xl text-purple-400 mb-2"></i>
              <p class="text-purple-500">Thêm Banner Popup</p>
            </div>
          </div>
          
          <!-- Info Card -->
          <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 class="font-semibold text-purple-800 mb-2">
              <i class="fas fa-info-circle mr-2"></i>
              Thông tin Banner Popup
            </h4>
            <ul class="text-sm text-purple-700 space-y-1">
              <li>• Hiển thị sau 2 giây khi load trang</li>
              <li>• Kích thước khuyến nghị: 600x800px</li>
              <li>• Dùng cho form đăng ký ưu đãi</li>
              <li>• Chỉ hiển thị trên desktop</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">Xem trước Banner</h3>
        
        <!-- Homepage Preview -->
        <div v-if="activeBannerType === 'homepage'" class="relative bg-gray-100 rounded-lg overflow-hidden" style="height: 300px;">
          <div v-if="homepageBanners.length === 0" class="absolute inset-0 flex items-center justify-center text-gray-500">
            <div class="text-center">
              <i class="fas fa-image text-4xl mb-4"></i>
              <p>Chưa có banner để xem trước</p>
            </div>
          </div>
          
          <div 
            v-for="(banner, index) in homepageBanners" 
            :key="index"
            class="absolute inset-0 transition-opacity duration-1000"
            :class="{ 'opacity-100': previewSlide === index, 'opacity-0': previewSlide !== index }"
          >
            <img 
              :src="banner" 
              :alt="`Preview ${index + 1}`"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Preview Controls -->
          <div v-if="homepageBanners.length > 1" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button
              v-for="(banner, index) in homepageBanners"
              :key="index"
              @click="previewSlide = index"
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="previewSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'"
            ></button>
          </div>
        </div>
        
        <!-- Popup Preview -->
        <div v-if="activeBannerType === 'popup'" class="relative bg-gray-100 rounded-lg overflow-hidden" style="height: 400px;">
          <div v-if="!popupBanner" class="absolute inset-0 flex items-center justify-center text-gray-500">
            <div class="text-center">
              <i class="fas fa-image text-4xl mb-4"></i>
              <p>Chưa có banner popup để xem trước</p>
            </div>
          </div>
          
          <div v-if="popupBanner" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden shadow-2xl">
              <div class="flex">
                <!-- Mini popup preview - chỉ ảnh -->
                <div class="w-1/2">
                  <img 
                    :src="popupBanner" 
                    alt="Popup Preview"
                    class="w-full h-48 object-cover"
                  />
                </div>
                <div class="w-1/2 p-3 text-xs">
                  <h4 class="font-bold mb-2">ĐĂNG KÝ ƯU ĐÃI</h4>
                  <div class="space-y-2">
                    <div class="bg-gray-100 h-6 rounded"></div>
                    <div class="bg-gray-100 h-6 rounded"></div>
                    <div class="bg-blue-500 h-8 rounded text-white flex items-center justify-center text-xs">
                      NHẬN MÃ GIẢM GIÁ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div 
      v-if="showUploadModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeUploadModal"
    >
      <div 
        class="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">
            {{ uploadType === 'popup' ? 'Thêm Banner Popup' : (replaceIndex !== null ? 'Thay thế Banner' : 'Thêm Banner Mới') }}
          </h3>
          <button @click="closeUploadModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <!-- Upload Area -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            class="hidden"
          />
          
          <div v-if="!selectedFile">
            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
            <p class="text-gray-600 mb-2">Chọn hình ảnh banner</p>
            <button
              @click="$refs.fileInput.click()"
              class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Chọn file
            </button>
            
            <!-- Size Requirements -->
            <div class="mt-4 bg-gray-50 rounded-lg p-3">
              <p class="text-xs text-gray-600 font-semibold mb-2">Yêu cầu kỹ thuật:</p>
              <div class="text-xs text-gray-500 space-y-1">
                <p v-if="uploadType === 'homepage'">📏 <strong>Kích thước khuyến nghị:</strong> 2560 x 974 px</p>
                <p v-if="uploadType === 'popup'">📏 <strong>Kích thước khuyến nghị:</strong> 600 x 800 px</p>
                <p>📊 <strong>Tỉ lệ khung hình:</strong> {{ uploadType === 'homepage' ? '2.63:1' : '3:4' }}</p>
                <p>💾 <strong>Dung lượng:</strong> Tối đa 5MB</p>
                <p>🖼️ <strong>Định dạng:</strong> JPG, PNG, WebP</p>
                <p v-if="uploadType === 'popup'" class="text-purple-600">🎯 <strong>Mục đích:</strong> Hiển thị trong popup form đăng ký</p>
              </div>
            </div>
          </div>
          
          <div v-else class="space-y-4">
            <img 
              :src="filePreview" 
              alt="Preview" 
              class="w-full h-32 object-cover rounded-lg"
            />
            <div class="flex space-x-2">
              <button
                @click="uploadBanner"
                :disabled="uploading"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                <i class="fas fa-check mr-2"></i>
                {{ uploading ? 'Đang lưu...' : 'Lưu Banner' }}
              </button>
              <button
                @click="clearFile"
                class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                <i class="fas fa-times mr-2"></i>Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6">
        <div class="flex items-center space-x-3">
          <i class="fas fa-spinner fa-spin text-blue-500"></i>
          <span>{{ loadingMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import { sidebarCategories } from '@/data/products.js'
import { BannerAPI } from '@/utils/bannerAPI.js'

export default {
  name: 'BannerManagerView',
  components: {
    Header
  },
  data() {
    return {
      categories: sidebarCategories,
      activeBannerType: 'homepage', // 'homepage' hoặc 'popup'
      homepageBanners: [],
      popupBanner: null,
      showUploadModal: false,
      selectedFile: null,
      filePreview: null,
      uploading: false,
      loading: false,
      loadingMessage: '',
      previewSlide: 0,
      replaceIndex: null,
      uploadType: 'homepage' // Loại banner đang upload
    }
  },
  async mounted() {
    // Auto preview rotation
    setInterval(() => {
      if (this.activeBannerType === 'homepage' && this.homepageBanners.length > 1) {
        this.previewSlide = (this.previewSlide + 1) % this.homepageBanners.length
      }
    }, 3000)
    
    // Load banners from server
    await this.loadBanners()
  },
  methods: {
    handleSearch(query) {
      this.$router.push({
        path: '/products',
        query: { search: query }
      })
    },
    
    async loadBanners() {
      try {
        this.loading = true
        this.loadingMessage = 'Đang tải banner...'
        
        // Load homepage banners
        this.homepageBanners = await BannerAPI.getBanners()
        
        // Load popup banner
        try {
          const popupResponse = await fetch('/api/popup-banner')
          if (popupResponse.ok) {
            const data = await popupResponse.json()
            this.popupBanner = data.banner
          }
        } catch (error) {
          console.log('No popup banner found')
        }
      } catch (error) {
        this.showMessage('Lỗi tải banner: ' + error.message, 'error')
      } finally {
        this.loading = false
      }
    },
    
    openUploadModal(type = 'homepage') {
      this.uploadType = type
      this.showUploadModal = true
      this.replaceIndex = null
    },
    
    closeUploadModal() {
      this.showUploadModal = false
      this.clearFile()
    },
    
    replaceHomepageBanner(index) {
      this.replaceIndex = index
      this.uploadType = 'homepage'
      this.showUploadModal = true
    },
    
    async deleteHomepageBanner(index) {
      if (confirm('Bạn có chắc muốn xóa banner này?')) {
        try {
          this.loading = true
          this.loadingMessage = 'Đang xóa banner...'
          
          const result = await BannerAPI.deleteBanner(index)
          this.homepageBanners = result.banners
          this.showMessage(result.message, 'success')
        } catch (error) {
          this.showMessage('Lỗi xóa banner: ' + error.message, 'error')
        } finally {
          this.loading = false
        }
      }
    },
    
    replacePopupBanner() {
      this.uploadType = 'popup'
      this.showUploadModal = true
    },
    
    async deletePopupBanner() {
      if (confirm('Bạn có chắc muốn xóa banner popup?')) {
        try {
          this.loading = true
          this.loadingMessage = 'Đang xóa banner popup...'
          
          // Call API to delete popup banner
          const response = await fetch('/api/popup-banner', { method: 'DELETE' })
          if (response.ok) {
            this.popupBanner = null
            this.showMessage('Đã xóa banner popup', 'success')
          }
        } catch (error) {
          this.showMessage('Lỗi xóa banner popup: ' + error.message, 'error')
        } finally {
          this.loading = false
        }
      }
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) return
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showMessage('Vui lòng chọn file hình ảnh', 'error')
        return
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('File quá lớn. Vui lòng chọn file dưới 5MB', 'error')
        return
      }
      
      this.selectedFile = file
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        this.filePreview = e.target.result
      }
      reader.readAsDataURL(file)
    },
    
    clearFile() {
      this.selectedFile = null
      this.filePreview = null
      this.replaceIndex = null
      this.uploadType = 'homepage'
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    
    async uploadBanner() {
      if (!this.selectedFile) return
      
      this.uploading = true
      
      try {
        if (this.uploadType === 'homepage') {
          // Handle homepage banner upload
          let result
          
          if (this.replaceIndex !== null) {
            // Replace existing banner
            this.loadingMessage = 'Đang thay thế banner...'
            result = await BannerAPI.replaceBanner(this.replaceIndex, this.selectedFile)
            this.showMessage('Đã thay thế banner', 'success')
          } else {
            // Add new banner
            if (this.homepageBanners.length >= 3) {
              this.showMessage('Chỉ được phép tối đa 3 banner trang chủ', 'error')
              return
            }
            this.loadingMessage = 'Đang thêm banner mới...'
            result = await BannerAPI.addBanner(this.selectedFile)
            this.showMessage('Đã thêm banner mới', 'success')
          }
          
          // Update homepage banners
          this.homepageBanners = result.banners
          
        } else if (this.uploadType === 'popup') {
          // Handle popup banner upload
          this.loadingMessage = 'Đang upload banner popup...'
          
          // Upload to server
          const formData = new FormData()
          formData.append('popup-banner', this.selectedFile)
          
          const response = await fetch('/api/popup-banner', {
            method: 'POST',
            body: formData
          })
          
          if (response.ok) {
            const data = await response.json()
            this.popupBanner = data.banner || URL.createObjectURL(this.selectedFile)
            this.showMessage('Đã cập nhật banner popup', 'success')
          } else {
            // Fallback: use local URL
            this.popupBanner = URL.createObjectURL(this.selectedFile)
            this.showMessage('Đã cập nhật banner popup (local)', 'success')
          }
        }
        
        this.closeUploadModal()
        
      } catch (error) {
        this.showMessage('Lỗi upload banner: ' + error.message, 'error')
      } finally {
        this.uploading = false
      }
    },
    
    showMessage(message, type = 'info') {
      const icons = { success: '✅', error: '❌', info: 'ℹ️' }
      alert(`${icons[type]} ${message}`)
    }
  }
}
</script>

<style scoped>
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Smooth transitions */
.transition-opacity {
  transition: opacity 0.3s ease;
}

.transition-colors {
  transition: all 0.3s ease;
}

/* Hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Tab styling */
.border-b-2 {
  transition: all 0.2s ease;
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

button:active {
  transform: translateY(0);
}

/* Card hover effects */
.cursor-pointer:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* Modal animation */
.fixed.inset-0 {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .space-x-8 {
    gap: 1rem;
  }
}

/* Preview animation */
.duration-1000 {
  transition-duration: 1s;
}

/* Upload area styling */
.border-dashed:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

/* Success/Error message colors */
.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

.bg-red-50 {
  background-color: #fef2f2;
}
</style>