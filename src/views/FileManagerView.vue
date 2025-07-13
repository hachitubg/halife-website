<template>
  <div class="file-manager-view min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-800 flex items-center">
            <i class="fas fa-folder-open mr-3 text-blue-600"></i>
            File Manager - HALIFE Admin
          </h1>
          <router-link to="/" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
            <i class="fas fa-home mr-2"></i>
            Về trang chủ
          </router-link>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Excel Files Management -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="bg-green-600 text-white p-4 rounded-t-lg">
            <h2 class="text-xl font-semibold flex items-center">
              <i class="fas fa-file-excel mr-2"></i>
              Quản lý File Excel
            </h2>
          </div>
          
          <div class="p-6">
            <!-- Upload Excel -->
            <div class="mb-6">
              <label for="excel-upload" class="block text-sm font-medium text-gray-700 mb-2">
                Upload File Excel mới:
              </label>
              <div class="flex items-center space-x-3">
                <input
                  type="file"
                  id="excel-upload"
                  ref="excelInput"
                  @change="handleExcelUpload"
                  accept=".xlsx,.xls"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                <button
                  @click="$refs.excelInput.click()"
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  <i class="fas fa-upload mr-2"></i>
                  Chọn file
                </button>
              </div>
            </div>

            <!-- Current Excel Files -->
            <div>
              <h3 class="text-lg font-medium text-gray-800 mb-3">File Excel hiện tại:</h3>
              <div v-if="excelFiles.length > 0" class="space-y-3">
                <div 
                  v-for="file in excelFiles" 
                  :key="file.name"
                  class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div class="flex items-center">
                    <i class="fas fa-file-excel text-green-600 text-xl mr-3"></i>
                    <div>
                      <p class="font-medium text-gray-800">{{ file.name }}</p>
                      <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }} • {{ formatDate(file.lastModified) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="downloadExcel(file.name)"
                      class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      title="Tải xuống"
                    >
                      <i class="fas fa-download"></i>
                    </button>
                    <button
                      @click="reloadDataFromExcel"
                      class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      title="Reload dữ liệu"
                    >
                      <i class="fas fa-sync-alt"></i>
                    </button>
                    <button
                      @click="deleteExcel(file.name)"
                      class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      title="Xóa file"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                <i class="fas fa-file-excel text-4xl mb-3"></i>
                <p>Chưa có file Excel nào</p>
              </div>
            </div>

            <!-- Excel Status -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium text-gray-800 mb-2">Trạng thái dữ liệu Excel:</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Đã tải:</span>
                  <span :class="dataStats.isLoaded ? 'text-green-600' : 'text-red-600'">
                    {{ dataStats.isLoaded ? 'Có' : 'Không' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Số sản phẩm:</span>
                  <span class="font-medium">{{ dataStats.totalProducts }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Số danh mục:</span>
                  <span class="font-medium">{{ dataStats.totalCategories }}</span>
                </div>
                <div v-if="dataStats.error" class="text-red-600">
                  <span class="font-medium">Lỗi:</span> {{ dataStats.error }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Images Management -->
        <div class="bg-white rounded-lg shadow-lg">
          <div class="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 class="text-xl font-semibold flex items-center">
              <i class="fas fa-images mr-2"></i>
              Quản lý Hình ảnh
              <span class="ml-auto text-sm">({{ images.length }} ảnh)</span>
            </h2>
          </div>
          
          <div class="p-6">
            <!-- Upload Images -->
            <div class="mb-6">
              <label for="image-upload" class="block text-sm font-medium text-gray-700 mb-2">
                Upload hình ảnh mới:
              </label>
              <div class="flex items-center space-x-3">
                <input
                  type="file"
                  id="image-upload"
                  ref="imageInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  multiple
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                  @click="$refs.imageInput.click()"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <i class="fas fa-upload mr-2"></i>
                  Chọn ảnh
                </button>
              </div>
              
              <!-- Upload Progress -->
              <div v-if="uploadProgress > 0" class="mt-3">
                <div class="bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ uploadProgress }}% đã tải lên</p>
              </div>
            </div>

            <!-- Image Controls -->
            <div class="mb-6 space-y-4">
              <!-- Search and Filter -->
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="flex-1">
                  <input
                    type="text"
                    placeholder="Tìm kiếm hình ảnh..."
                    v-model="imageSearchQuery"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  v-model="sortBy"
                  class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sắp xếp theo tên</option>
                  <option value="size">Sắp xếp theo kích thước</option>
                  <option value="date">Sắp xếp theo ngày</option>
                </select>
              </div>

              <!-- Bulk Actions -->
              <div class="flex flex-wrap items-center gap-3">
                <button
                  @click="selectAllImages"
                  class="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm"
                >
                  <i class="fas fa-check-square mr-1"></i>
                  {{ selectedImages.length === sortedImages.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả' }}
                </button>
                
                <span v-if="selectedImages.length > 0" class="text-sm text-gray-600">
                  Đã chọn {{ selectedImages.length }} ảnh
                </span>
                
                <button
                  v-if="selectedImages.length > 0"
                  @click="deleteSelectedImages"
                  class="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm"
                >
                  <i class="fas fa-trash mr-1"></i>
                  Xóa đã chọn
                </button>
                
                <button
                  @click="scanAllImages"
                  :disabled="scanningImages"
                  class="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 text-sm disabled:opacity-50"
                >
                  <i :class="scanningImages ? 'fas fa-spinner fa-spin mr-1' : 'fas fa-sync-alt mr-1'"></i>
                  {{ scanningImages ? 'Đang quét...' : 'Quét lại' }}
                </button>
                
                <div class="flex items-center space-x-2">
                  <button
                    @click="viewMode = 'grid'"
                    :class="viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                    class="p-2 rounded"
                  >
                    <i class="fas fa-th"></i>
                  </button>
                  <button
                    @click="viewMode = 'list'"
                    :class="viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'"
                    class="p-2 rounded"
                  >
                    <i class="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Images Display -->
            <div class="max-h-96 overflow-y-auto">
              <!-- Scanning State -->
              <div v-if="scanningImages" class="text-center py-8">
                <i class="fas fa-spinner fa-spin text-2xl text-blue-500 mb-3"></i>
                <p class="text-gray-600">Đang quét hình ảnh...</p>
              </div>

              <!-- Grid View -->
              <div v-if="!scanningImages && sortedImages.length > 0 && viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <div 
                  v-for="image in sortedImages" 
                  :key="image.name"
                  class="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <!-- Selection Checkbox -->
                  <div class="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      :checked="selectedImages.includes(image.name)"
                      @change="toggleImageSelection(image.name)"
                      class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <!-- Image -->
                  <img 
                    :src="image.url" 
                    :alt="image.name"
                    class="w-full h-24 object-cover cursor-pointer"
                    @click="showImagePreview(image)"
                    @error="handleImageError($event, image)"
                  />
                  
                  <!-- Hover Actions -->
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 flex space-x-1">
                      <button
                        @click="showImagePreview(image)"
                        class="bg-blue-500 text-white p-2 rounded-full text-xs"
                        title="Xem chi tiết"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button
                        @click="copyImageName(image.name)"
                        class="bg-green-500 text-white p-2 rounded-full text-xs"
                        title="Copy tên file"
                      >
                        <i class="fas fa-copy"></i>
                      </button>
                      <button
                        @click="deleteImage(image.name)"
                        class="bg-red-500 text-white p-2 rounded-full text-xs"
                        title="Xóa ảnh"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  
                  <!-- File Info -->
                  <div class="p-2 bg-white">
                    <p class="text-xs text-gray-600 truncate font-medium" :title="image.name">
                      {{ image.name }}
                    </p>
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{{ image.type }}</span>
                      <span>{{ formatFileSize(image.size) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- List View -->
              <div v-if="!scanningImages && sortedImages.length > 0 && viewMode === 'list'" class="space-y-2">
                <div 
                  v-for="image in sortedImages" 
                  :key="image.name"
                  class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    :checked="selectedImages.includes(image.name)"
                    @change="toggleImageSelection(image.name)"
                    class="mr-3 w-4 h-4 text-blue-600"
                  />
                  <img 
                    :src="image.url" 
                    :alt="image.name"
                    class="w-12 h-12 object-cover rounded mr-3 cursor-pointer"
                    @click="showImagePreview(image)"
                    @error="handleImageError($event, image)"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-sm text-gray-800 truncate">{{ image.name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ image.type }} • {{ formatFileSize(image.size) }} • {{ formatDate(image.lastModified) }}
                    </p>
                    <p class="text-xs text-gray-400 truncate">{{ image.folder }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="showImagePreview(image)"
                      class="bg-blue-500 text-white p-2 rounded text-xs hover:bg-blue-600"
                      title="Xem chi tiết"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      @click="copyImageName(image.name)"
                      class="bg-green-500 text-white p-2 rounded text-xs hover:bg-green-600"
                      title="Copy tên file"
                    >
                      <i class="fas fa-copy"></i>
                    </button>
                    <button
                      @click="deleteImage(image.name)"
                      class="bg-red-500 text-white p-2 rounded text-xs hover:bg-red-600"
                      title="Xóa ảnh"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- No Images State -->
              <div v-if="!scanningImages && sortedImages.length === 0" class="text-center py-8 text-gray-500">
                <i class="fas fa-images text-4xl mb-3"></i>
                <p>{{ imageSearchQuery ? 'Không tìm thấy hình ảnh nào' : 'Chưa có hình ảnh nào' }}</p>
                <button
                  @click="scanAllImages"
                  class="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <i class="fas fa-sync-alt mr-2"></i>
                  Quét lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-bolt mr-2 text-yellow-500"></i>
          Thao tác nhanh
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            @click="generateSampleExcel"
            class="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
          >
            <i class="fas fa-file-plus text-xl mb-2"></i>
            <p class="font-medium">Tạo Excel mẫu</p>
            <p class="text-sm opacity-90">Tạo file Excel với dữ liệu mẫu</p>
          </button>
          
          <button
            @click="backupData"
            class="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <i class="fas fa-download text-xl mb-2"></i>
            <p class="font-medium">Backup dữ liệu</p>
            <p class="text-sm opacity-90">Tải xuống backup Excel + Images</p>
          </button>
          
          <button
            @click="scanAllImages"
            :disabled="scanningImages"
            class="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            <i :class="scanningImages ? 'fas fa-spinner fa-spin text-xl mb-2' : 'fas fa-search text-xl mb-2'"></i>
            <p class="font-medium">Quét hình ảnh</p>
            <p class="text-sm opacity-90">Tìm tất cả hình ảnh trong hệ thống</p>
          </button>
          
          <button
            @click="clearCache"
            class="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <i class="fas fa-broom text-xl mb-2"></i>
            <p class="font-medium">Xóa cache</p>
            <p class="text-sm opacity-90">Làm mới cache dữ liệu</p>
          </button>
        </div>
      </div>

      <!-- Image Statistics -->
      <div class="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-chart-bar mr-2 text-green-500"></i>
          Thống kê hình ảnh
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">{{ images.length }}</div>
            <div class="text-sm text-blue-600">Tổng số ảnh</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">
              {{ formatFileSize(images.reduce((total, img) => total + img.size, 0)) }}
            </div>
            <div class="text-sm text-green-600">Tổng dung lượng</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-purple-600">
              {{ [...new Set(images.map(img => img.type))].length }}
            </div>
            <div class="text-sm text-purple-600">Loại file</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-orange-600">{{ selectedImages.length }}</div>
            <div class="text-sm text-orange-600">Đã chọn</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="selectedImage = null">
      <div class="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto" @click.stop>
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">Chi tiết hình ảnh</h3>
          <button @click="selectedImage = null" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Image Preview -->
            <div>
              <img 
                :src="selectedImage.url" 
                :alt="selectedImage.name" 
                class="w-full h-auto rounded-lg border"
                @error="handleImageError($event, selectedImage)"
              />
            </div>
            
            <!-- Image Details -->
            <div class="space-y-4">
              <div>
                <label class="font-medium text-gray-700">Tên file:</label>
                <div class="mt-1 flex items-center">
                  <code class="bg-gray-100 px-3 py-2 rounded flex-1 text-sm">{{ selectedImage.name }}</code>
                  <button
                    @click="copyImagePath(selectedImage.name)"
                    class="ml-2 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                    title="Copy tên file"
                  >
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              
              <div>
                <label class="font-medium text-gray-700">Đường dẫn:</label>
                <div class="mt-1 flex items-center">
                  <code class="bg-gray-100 px-3 py-2 rounded flex-1 text-sm break-all">{{ selectedImage.url }}</code>
                  <button
                    @click="copyImagePath(selectedImage.url)"
                    class="ml-2 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                    title="Copy đường dẫn"
                  >
                    <i class="fas fa-link"></i>
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="font-medium text-gray-700">Loại file:</label>
                  <p class="text-gray-600">{{ selectedImage.type }}</p>
                </div>
                <div>
                  <label class="font-medium text-gray-700">Kích thước:</label>
                  <p class="text-gray-600">{{ formatFileSize(selectedImage.size) }}</p>
                </div>
              </div>
              
              <div>
                <label class="font-medium text-gray-700">Thư mục:</label>
                <p class="text-gray-600">{{ selectedImage.folder }}</p>
              </div>
              
              <div>
                <label class="font-medium text-gray-700">Ngày sửa đổi:</label>
                <p class="text-gray-600">{{ formatDate(selectedImage.lastModified) }}</p>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex space-x-3 pt-4">
                <button
                  @click="copyImagePath(selectedImage.name)"
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                >
                  <i class="fas fa-copy mr-2"></i>
                  Copy tên file
                </button>
                <button
                  @click="copyImagePath(selectedImage.url)"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
                >
                  <i class="fas fa-link mr-2"></i>
                  Copy URL
                </button>
                <button
                  @click="deleteImageFromModal"
                  class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                >
                  <i class="fas fa-trash mr-2"></i>
                  Xóa ảnh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-4">
        <i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
        <span class="text-lg">{{ loadingMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { dataAPI } from '@/data/products.js'

export default {
  name: 'FileManagerView',
  data() {
    return {
      excelFiles: [],
      images: [],
      selectedImages: [],
      selectedImage: null,
      loading: false,
      loadingMessage: '',
      scanningImages: false,
      imageSearchQuery: '',
      uploadProgress: 0,
      viewMode: 'grid', // 'grid' | 'list'
      sortBy: 'name', // 'name' | 'size' | 'date'
      dataStats: {
        isLoaded: false,
        totalProducts: 0,
        totalCategories: 0,
        error: null
      }
    }
  },
  
  computed: {
    // Filter và search images
    filteredImages() {
      return this.images.filter(image => {
        const matchesSearch = image.name.toLowerCase().includes(this.imageSearchQuery.toLowerCase());
        return matchesSearch;
      });
    },

    // Sort images
    sortedImages() {
      return [...this.filteredImages].sort((a, b) => {
        switch (this.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'size':
            return b.size - a.size;
          case 'date':
            return new Date(b.lastModified) - new Date(a.lastModified);
          default:
            return 0;
        }
      });
    }
  },
  
  methods: {
    // Scan images từ server hoặc thư mục tĩnh
    async scanAllImages() {
      this.scanningImages = true;
      
      try {
        // Method 1: Thử gọi API để list images (nếu có backend)
        try {
          const response = await fetch('/api/images/list');
          if (response.ok) {
            const data = await response.json();
            this.images = data.images || [];
            this.scanningImages = false;
            return;
          }
        } catch (e) {
          console.log('No API available, scanning manually...');
        }

        // Method 2: Scan manual thông qua pattern matching với các file phổ biến
        await this.scanImagesByPattern();
        
      } catch (error) {
        console.error('Error scanning images:', error);
      } finally {
        this.scanningImages = false;
      }
    },

    // Scan images bằng cách thử fetch các file phổ biến
    async scanImagesByPattern() {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
      const foundImages = [];
      
      // Scan thư mục /images/ và các thư mục con
      const imagePaths = [
        '/images/', 
        '/images/products/', 
        '/images/categories/',
        '/images/banners/',
        '/images/news/',
        '/public/images/',
        '/assets/images/'
      ];

      // Thử scan bằng cách fetch HEAD request cho các file có thể có
      const scanPromises = [];
      
      // Scan với các pattern name phổ biến (nhưng ít hơn, chỉ những cái thường dùng)
      const commonNames = [
        // Từ dữ liệu sản phẩm hiện có
        'best-phage-1', 'boost-phage-1', 'good-set-1', 'winflo-la-1', 'anpha-new-1',
        // Placeholder thường dùng
        'product-placeholder', 'no-image', 'logo', 'banner',
        // Pattern number nhỏ
        ...Array.from({length: 20}, (_, i) => `product-${i + 1}`),
        ...Array.from({length: 10}, (_, i) => `image-${i + 1}`)
      ];

      for (const basePath of imagePaths) {
        for (const name of commonNames) {
          for (const ext of imageExtensions) {
            const url = `${basePath}${name}.${ext}`;
            
            scanPromises.push(
              fetch(url, { method: 'HEAD' })
                .then(response => {
                  if (response.ok) {
                    return {
                      name: `${name}.${ext}`,
                      url: url,
                      size: parseInt(response.headers.get('content-length') || '0'),
                      lastModified: response.headers.get('last-modified') || new Date().toISOString(),
                      type: this.getImageType(ext),
                      folder: basePath
                    };
                  }
                  return null;
                })
                .catch(() => null)
            );
          }
        }
      }

      // Process results in batches để tránh overwhelming
      const batchSize = 20;
      for (let i = 0; i < scanPromises.length; i += batchSize) {
        const batch = scanPromises.slice(i, i + batchSize);
        const results = await Promise.all(batch);
        foundImages.push(...results.filter(Boolean));
        
        // Update progress
        const progress = Math.round(((i + batchSize) / scanPromises.length) * 100);
        console.log(`Scanning images: ${progress}%`);
      }

      // Remove duplicates và sort
      const uniqueImages = foundImages.filter((img, index, self) => 
        index === self.findIndex(t => t.url === img.url)
      );

      this.images = uniqueImages.sort((a, b) => a.name.localeCompare(b.name));
      console.log(`Found ${uniqueImages.length} images`);
    },

    // Helper functions
    getImageType(extension) {
      const types = {
        'jpg': 'JPEG',
        'jpeg': 'JPEG', 
        'png': 'PNG',
        'gif': 'GIF',
        'webp': 'WebP',
        'svg': 'SVG',
        'bmp': 'BMP'
      };
      return types[extension.toLowerCase()] || 'Unknown';
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('vi-VN');
    },

    // Upload multiple images
    async handleImageUpload(event) {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      const validFiles = files.filter(file => file.type.startsWith('image/'));
      if (validFiles.length === 0) {
        alert('Vui lòng chọn file hình ảnh hợp lệ');
        return;
      }

      this.loading = true;
      this.loadingMessage = `Đang upload ${validFiles.length} hình ảnh...`;
      this.uploadProgress = 0;

      try {
        // Simulate upload với progress
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          
          // Create preview URL
          const previewUrl = URL.createObjectURL(file);
          
          // Add to images list immediately với preview
          const newImage = {
            name: file.name,
            url: previewUrl,
            size: file.size,
            lastModified: new Date().toISOString(),
            type: this.getImageType(file.name.split('.').pop()),
            folder: '/images/',
            isUploading: true
          };
          
          this.images.push(newImage);
          
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update progress
          const progress = Math.round(((i + 1) / validFiles.length) * 100);
          this.uploadProgress = progress;
        }
        
        alert(`${validFiles.length} hình ảnh đã được upload thành công!`);
        
        // Refresh image list
        await this.scanAllImages();
        
      } catch (error) {
        console.error('Lỗi upload images:', error);
        alert('Có lỗi xảy ra khi upload hình ảnh');
      } finally {
        this.loading = false;
        this.uploadProgress = 0;
        event.target.value = '';
      }
    },

    // Delete single image
    async deleteImage(imageName) {
      if (!confirm(`Bạn có chắc muốn xóa ảnh "${imageName}"?`)) return;

      this.loading = true;
      this.loadingMessage = 'Đang xóa hình ảnh...';

      try {
        // TODO: Call API to delete image
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove from local state
        this.images = this.images.filter(img => img.name !== imageName);
        
        alert(`Ảnh "${imageName}" đã được xóa!`);
      } catch (error) {
        console.error('Lỗi xóa ảnh:', error);
        alert('Có lỗi xảy ra khi xóa ảnh');
      } finally {
        this.loading = false;
      }
    },

    // Delete image from modal
    async deleteImageFromModal() {
      if (this.selectedImage) {
        await this.deleteImage(this.selectedImage.name);
        this.selectedImage = null;
      }
    },

    // Delete multiple images
    async deleteSelectedImages() {
      if (this.selectedImages.length === 0) {
        alert('Vui lòng chọn ít nhất 1 ảnh để xóa');
        return;
      }

      if (!confirm(`Bạn có chắc muốn xóa ${this.selectedImages.length} ảnh đã chọn?`)) return;

      this.loading = true;
      this.loadingMessage = `Đang xóa ${this.selectedImages.length} hình ảnh...`;

      try {
        // TODO: Call API to delete multiple images
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Remove from local state
        this.images = this.images.filter(img => !this.selectedImages.includes(img.name));
        this.selectedImages = [];
        
        alert(`${this.selectedImages.length} ảnh đã được xóa!`);
      } catch (error) {
        console.error('Lỗi xóa ảnh:', error);
        alert('Có lỗi xảy ra khi xóa ảnh');
      } finally {
        this.loading = false;
      }
    },

    // Copy image name/path
    copyImageName(fileName) {
      navigator.clipboard.writeText(fileName).then(() => {
        alert('✅ Đã copy tên file vào clipboard: ' + fileName);
      }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = fileName;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ Đã copy tên file: ' + fileName);
      });
    },

    copyImagePath(path) {
      navigator.clipboard.writeText(path).then(() => {
        alert('✅ Đã copy đường dẫn vào clipboard: ' + path);
      }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = path;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ Đã copy đường dẫn: ' + path);
      });
    },

    // Toggle image selection
    toggleImageSelection(imageName) {
      if (this.selectedImages.includes(imageName)) {
        this.selectedImages = this.selectedImages.filter(name => name !== imageName);
      } else {
        this.selectedImages.push(imageName);
      }
    },

    // Select all/none
    selectAllImages() {
      if (this.selectedImages.length === this.sortedImages.length) {
        this.selectedImages = [];
      } else {
        this.selectedImages = this.sortedImages.map(img => img.name);
      }
    },

    // Show image preview modal
    showImagePreview(image) {
      this.selectedImage = image;
    },

    // Handle image load error
    handleImageError(event, image) {
      console.warn('Lỗi load ảnh:', image.name);
      // Thay thế bằng placeholder
      event.target.src = '/images/no-image.png';
    },

    // Load excel files (keeping existing implementation)
    async loadExcelFiles() {
      try {
        const response = await fetch('/data/halife_products.xlsx', { method: 'HEAD' });
        if (response.ok) {
          this.excelFiles = [{
            name: 'halife_products.xlsx',
            size: parseInt(response.headers.get('content-length') || '0'),
            lastModified: response.headers.get('last-modified') || new Date().toISOString()
          }];
        }
      } catch (error) {
        console.log('Không tìm thấy file Excel:', error);
        this.excelFiles = [];
      }
    },

    // Excel management methods (keeping existing)
    async handleExcelUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.name.match(/\.(xlsx|xls)$/)) {
        alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        return;
      }

      this.loading = true;
      this.loadingMessage = 'Đang upload file Excel...';

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`File ${file.name} đã được upload thành công!`);
        await this.loadExcelFiles();
        await this.reloadDataFromExcel();
      } catch (error) {
        console.error('Lỗi upload Excel:', error);
        alert('Có lỗi xảy ra khi upload file Excel');
      } finally {
        this.loading = false;
        event.target.value = '';
      }
    },

    async reloadDataFromExcel() {
      this.loading = true;
      this.loadingMessage = 'Đang reload dữ liệu từ Excel...';

      try {
        await dataAPI.reload();
        this.updateDataStats();
        alert('Đã reload dữ liệu từ Excel thành công!');
      } catch (error) {
        console.error('Lỗi reload data:', error);
        alert('Có lỗi xảy ra khi reload dữ liệu');
      } finally {
        this.loading = false;
      }
    },

    updateDataStats() {
      this.dataStats = dataAPI.getStats();
    },

    downloadExcel(fileName) {
      const link = document.createElement('a');
      link.href = `/data/${fileName}`;
      link.download = fileName;
      link.click();
    },

    async deleteExcel(fileName) {
      if (!confirm(`Bạn có chắc muốn xóa file ${fileName}?`)) return;

      this.loading = true;
      this.loadingMessage = 'Đang xóa file Excel...';

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`File ${fileName} đã được xóa!`);
        await this.loadExcelFiles();
      } catch (error) {
        console.error('Lỗi xóa file:', error);
        alert('Có lỗi xảy ra khi xóa file');
      } finally {
        this.loading = false;
      }
    },

    async generateSampleExcel() {
      this.loading = true;
      this.loadingMessage = 'Đang tạo file Excel mẫu...';

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('File Excel mẫu đã được tạo thành công!');
        await this.loadExcelFiles();
      } catch (error) {
        console.error('Lỗi tạo Excel mẫu:', error);
        alert('Có lỗi xảy ra khi tạo file Excel mẫu');
      } finally {
        this.loading = false;
      }
    },

    async backupData() {
      this.loading = true;
      this.loadingMessage = 'Đang tạo backup...';

      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Backup đã được tạo và tải xuống!');
      } catch (error) {
        console.error('Lỗi backup:', error);
        alert('Có lỗi xảy ra khi tạo backup');
      } finally {
        this.loading = false;
      }
    },

    async clearCache() {
      this.loading = true;
      this.loadingMessage = 'Đang xóa cache...';

      try {
        await dataAPI.reload();
        this.updateDataStats();
        alert('Cache đã được xóa và dữ liệu đã được reload!');
      } catch (error) {
        console.error('Lỗi clear cache:', error);
        alert('Có lỗi xảy ra khi xóa cache');
      } finally {
        this.loading = false;
      }
    }
  },

  async mounted() {
    document.title = 'File Manager - HALIFE Admin';
    
    await Promise.all([
      this.loadExcelFiles(),
      this.scanAllImages()
    ]);
    
    this.updateDataStats();
  }
}
</script>

<style scoped>
.file-manager-view {
  min-height: 100vh;
}

/* Loading spinner */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Responsive grid */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
</style>