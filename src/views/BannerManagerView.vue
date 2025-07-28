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
              Banner Trang chủ ({{ homepageBanners.length }}/4)
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
          Banner trang chủ ({{ homepageBanners.length }}/4)
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            v-if="homepageBanners.length < 4"
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
        
        <div v-if="popupBanner" class="relative group max-w-sm">
          <!-- Popup Banner Preview -->
          <div class="relative overflow-hidden rounded-lg border-2 border-gray-200">
            <img 
              :src="popupBanner" 
              alt="Popup Banner"
              class="w-full h-64 object-cover"
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
        </div>
        
        <div v-else>
          <div 
            @click="openUploadModal('popup')"
            class="border-2 border-dashed border-purple-300 rounded-lg h-64 max-w-sm flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            <div class="text-center">
              <i class="fas fa-plus text-2xl text-purple-400 mb-2"></i>
              <p class="text-purple-500">Thêm Banner Popup</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
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
                <p>💾 <strong>Dung lượng:</strong> Tối đa 5MB</p>
                <p>🖼️ <strong>Định dạng:</strong> JPG, PNG, WebP</p>
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
      replaceIndex: null,
      uploadType: 'homepage' // Loại banner đang upload
    }
  },
  async mounted() {
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
        
        // Sử dụng BannerAPI method mới
        const bannerData = await BannerAPI.loadAllBannerData()
        this.homepageBanners = bannerData.homepageBanners
        this.popupBanner = bannerData.popupBanner
        
      } catch (error) {
        BannerAPI.showMessage('Lỗi tải banner: ' + error.message, 'error')
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
          BannerAPI.showMessage(result.message, 'success')
        } catch (error) {
          BannerAPI.showMessage('Lỗi xóa banner: ' + error.message, 'error')
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
          
          await BannerAPI.deletePopupBanner()
          this.popupBanner = null
          BannerAPI.showMessage('Đã xóa banner popup', 'success')
        } catch (error) {
          BannerAPI.showMessage('Lỗi xóa banner popup: ' + error.message, 'error')
        } finally {
          this.loading = false
        }
      }
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (!file) return
      
      // Sử dụng BannerAPI validate
      const validation = BannerAPI.validateFile(file, 5)
      
      if (!validation.isValid) {
        BannerAPI.showMessage(validation.errors.join(', '), 'error')
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
            BannerAPI.showMessage('Đã thay thế banner', 'success')
          } else {
            // Add new banner - THAY ĐỔI: cho phép tối đa 4 banner
            if (this.homepageBanners.length >= 4) {
              BannerAPI.showMessage('Chỉ được phép tối đa 4 banner trang chủ', 'error')
              return
            }
            this.loadingMessage = 'Đang thêm banner mới...'
            result = await BannerAPI.addBanner(this.selectedFile)
            BannerAPI.showMessage('Đã thêm banner mới', 'success')
          }
          
          // Update homepage banners
          this.homepageBanners = result.banners
          
        } else if (this.uploadType === 'popup') {
          // Handle popup banner upload
          this.loadingMessage = 'Đang upload banner popup...'
          
          const result = await BannerAPI.replacePopupBanner(this.selectedFile)
          this.popupBanner = result.banner
          BannerAPI.showMessage('Đã cập nhật banner popup', 'success')
        }
        
        this.closeUploadModal()
        
      } catch (error) {
        BannerAPI.showMessage('Lỗi upload banner: ' + error.message, 'error')
      } finally {
        this.uploading = false
      }
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
  
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .space-x-8 {
    gap: 1rem;
  }
}
</style>