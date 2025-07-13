async refreshImages() {
      await this.loadImages();
    },

    handleImageError(event, image) {
      console.warn('Lỗi load ảnh:', image.name);
      // Có thể thay thế bằng placeholder
      event.target.src = '/images/product-placeholder.jpg';
    },<template>
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
            </div>

            <!-- Current Images -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-medium text-gray-800">Hình ảnh hiện tại:</h3>
                <span class="text-sm text-gray-500">{{ images.length }} ảnh</span>
              </div>
              
              <div v-if="images.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                <div 
                  v-for="image in images" 
                  :key="image.name"
                  class="relative group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img 
                    :src="image.url" 
                    :alt="image.name"
                    class="w-full h-24 object-cover"
                    @click="showImagePreview(image)"
                  />
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 flex space-x-2">
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
                  <div class="p-2">
                    <p class="text-xs text-gray-600 truncate" :title="image.name">{{ image.name }}</p>
                  </div>
                </div>
              </div>
              
              <div v-else class="text-center py-8 text-gray-500">
                <i class="fas fa-images text-4xl mb-3"></i>
                <p>Chưa có hình ảnh nào</p>
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            @click="clearCache"
            class="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <i class="fas fa-broom text-xl mb-2"></i>
            <p class="font-medium">Xóa cache</p>
            <p class="text-sm opacity-90">Làm mới cache dữ liệu</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="selectedImage = null">
      <div class="bg-white rounded-lg p-4 max-w-2xl max-h-[80vh] overflow-auto" @click.stop>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">{{ selectedImage.name }}</h3>
          <button @click="selectedImage = null" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <img :src="selectedImage.url" :alt="selectedImage.name" class="w-full h-auto rounded-lg" />
        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Tên file:</span>
            <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ selectedImage.name }}</code>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Đường dẫn:</span>
            <code class="bg-gray-100 px-2 py-1 rounded text-xs">{{ selectedImage.url }}</code>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="copyImageName(selectedImage.name)"
              class="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              <i class="fas fa-copy mr-2"></i>
              Copy tên file
            </button>
            <button
              @click="copyImagePath(selectedImage.url)"
              class="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              <i class="fas fa-link mr-2"></i>
              Copy đường dẫn
            </button>
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
      selectedImage: null,
      loading: false,
      loadingMessage: '',
      dataStats: {
        isLoaded: false,
        totalProducts: 0,
        totalCategories: 0,
        error: null
      }
    }
  },
  
  methods: {
    async loadExcelFiles() {
      try {
        // Trong thực tế, bạn sẽ cần API để list files
        // Hiện tại chỉ check file mặc định
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

    async loadImages() {
      try {
        // Trong thực tế, bạn sẽ cần API để list images
        // Hiện tại sẽ simulate với một số ảnh mẫu
        const imageNames = [
          'best-phage-1.jpg',
          'best-phage-2.jpg', 
          'boost-phage-1.jpg',
          'good-set-1.jpg',
          'product-placeholder.jpg'
        ];
        
        const imagePromises = imageNames.map(async (name) => {
          const url = `/images/${name}`;
          try {
            const response = await fetch(url, { method: 'HEAD' });
            if (response.ok) {
              return {
                name,
                url,
                size: parseInt(response.headers.get('content-length') || '0')
              };
            }
          } catch (error) {
            return null;
          }
        });

        const results = await Promise.all(imagePromises);
        this.images = results.filter(Boolean);
      } catch (error) {
        console.log('Lỗi load images:', error);
        this.images = [];
      }
    },

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
        // Trong thực tế, bạn sẽ upload lên server
        // Hiện tại chỉ simulate
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

      try {
        // Trong thực tế, bạn sẽ upload lên server
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        alert(`${validFiles.length} hình ảnh đã được upload thành công!`);
        await this.loadImages();
      } catch (error) {
        console.error('Lỗi upload images:', error);
        alert('Có lỗi xảy ra khi upload hình ảnh');
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

    showImagePreview(image) {
      this.selectedImage = image;
    },

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

    copyImagePath(url) {
      navigator.clipboard.writeText(url).then(() => {
        alert('✅ Đã copy đường dẫn ảnh vào clipboard: ' + url);
      }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('✅ Đã copy đường dẫn ảnh: ' + url);
      });
    },

    async deleteExcel(fileName) {
      if (!confirm(`Bạn có chắc muốn xóa file ${fileName}?`)) return;

      this.loading = true;
      this.loadingMessage = 'Đang xóa file Excel...';

      try {
        // Trong thực tế, gọi API xóa file
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

    async deleteImage(imageName) {
      if (!confirm(`Bạn có chắc muốn xóa ảnh ${imageName}?`)) return;

      this.loading = true;
      this.loadingMessage = 'Đang xóa hình ảnh...';

      try {
        // Trong thực tế, gọi API xóa file
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert(`Ảnh ${imageName} đã được xóa!`);
        await this.loadImages();
      } catch (error) {
        console.error('Lỗi xóa ảnh:', error);
        alert('Có lỗi xảy ra khi xóa ảnh');
      } finally {
        this.loading = false;
      }
    },

    downloadExcel(fileName) {
      const link = document.createElement('a');
      link.href = `/data/${fileName}`;
      link.download = fileName;
      link.click();
    },

    async generateSampleExcel() {
      this.loading = true;
      this.loadingMessage = 'Đang tạo file Excel mẫu...';

      try {
        // Trong thực tế, gọi API tạo Excel
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
        // Trong thực tế, gọi API backup
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
        // Clear cache và reload
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
      this.loadImages()
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