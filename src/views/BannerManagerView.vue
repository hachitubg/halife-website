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
            <p class="text-gray-600">Thay đổi hình ảnh banner trang chủ</p>
          </div>
          <button
            @click="openUploadModal"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            <i class="fas fa-plus mr-2"></i>Thêm Banner
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Current Banners -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">Banner hiện tại ({{ banners.length }}/3)</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="(banner, index) in banners" 
            :key="index"
            class="relative group"
          >
            <!-- Banner Preview -->
            <div class="relative overflow-hidden rounded-lg border-2 border-gray-200">
              <img 
                :src="banner" 
                :alt="`Banner ${index + 1}`"
                class="w-full h-32 object-cover"
              />
              
              <!-- Overlay Actions -->
              <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  @click="replaceBanner(index)"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  <i class="fas fa-edit mr-1"></i>Thay thế
                </button>
                <button
                  @click="deleteBanner(index)"
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
            v-if="banners.length < 3"
            @click="openUploadModal"
            class="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div class="text-center">
              <i class="fas fa-plus text-2xl text-gray-400 mb-2"></i>
              <p class="text-gray-500">Thêm Banner</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold mb-4">Xem trước Banner</h3>
        <div class="relative bg-gray-100 rounded-lg overflow-hidden" style="height: 300px;">
          <div 
            v-for="(banner, index) in banners" 
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
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            <button
              v-for="(banner, index) in banners"
              :key="index"
              @click="previewSlide = index"
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="previewSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'"
            ></button>
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
            {{ replaceIndex !== null ? 'Thay thế Banner' : 'Thêm Banner Mới' }}
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
            <p class="text-xs text-gray-500 mt-2">
              Hỗ trợ: JPG, PNG, WebP. Tối đa 5MB
            </p>
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
      banners: [],
      showUploadModal: false,
      selectedFile: null,
      filePreview: null,
      uploading: false,
      loading: false,
      loadingMessage: '',
      previewSlide: 0,
      replaceIndex: null
    }
  },
  async mounted() {
    // Auto preview rotation
    setInterval(() => {
      if (this.banners.length > 1) {
        this.previewSlide = (this.previewSlide + 1) % this.banners.length
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
        this.banners = await BannerAPI.getBanners()
      } catch (error) {
        this.showMessage('Lỗi tải banner: ' + error.message, 'error')
      } finally {
        this.loading = false
      }
    },
    
    saveBanners() {
      // Không cần nữa vì đã lưu trên server
      // Server sẽ tự động broadcast tới tất cả client
    },
    
    openUploadModal() {
      this.showUploadModal = true
      this.replaceIndex = null
    },
    
    closeUploadModal() {
      this.showUploadModal = false
      this.clearFile()
    },
    
    async replaceBanner(index) {
      this.replaceIndex = index
      this.showUploadModal = true
    },
    
    async deleteBanner(index) {
      if (confirm('Bạn có chắc muốn xóa banner này?')) {
        try {
          this.loading = true
          this.loadingMessage = 'Đang xóa banner...'
          
          const result = await BannerAPI.deleteBanner(index)
          this.banners = result.banners
          this.showMessage(result.message, 'success')
        } catch (error) {
          this.showMessage('Lỗi xóa banner: ' + error.message, 'error')
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
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    
    async uploadBanner() {
      if (!this.selectedFile) return
      
      this.uploading = true
      
      try {
        let result
        
        if (this.replaceIndex !== null) {
          // Replace existing banner
          this.loadingMessage = 'Đang thay thế banner...'
          result = await BannerAPI.replaceBanner(this.replaceIndex, this.selectedFile)
          this.showMessage('Đã thay thế banner', 'success')
        } else {
          // Add new banner
          if (this.banners.length >= 3) {
            this.showMessage('Chỉ được phép tối đa 3 banner', 'error')
            return
          }
          this.loadingMessage = 'Đang thêm banner mới...'
          result = await BannerAPI.addBanner(this.selectedFile)
          this.showMessage('Đã thêm banner mới', 'success')
        }
        
        // Update local banners list
        this.banners = result.banners
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
</style>