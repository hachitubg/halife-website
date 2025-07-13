<template>
  <div class="product-manager-view min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-800 flex items-center">
            <i class="fas fa-boxes mr-3 text-blue-600"></i>
            Quản lý Sản phẩm - HALIFE Admin
          </h1>
          <div class="flex items-center space-x-3">
            <button
              @click="reloadData"
              :disabled="loading"
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              <i :class="loading ? 'fas fa-spinner fa-spin mr-2' : 'fas fa-sync-alt mr-2'"></i>
              Reload Excel
            </button>
            <router-link to="/" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              <i class="fas fa-home mr-2"></i>
              Về trang chủ
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Dashboard -->
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <i class="fas fa-box text-blue-600 text-2xl mr-4"></i>
            <div>
              <div class="text-2xl font-bold text-gray-800">{{ stats.totalProducts }}</div>
              <div class="text-sm text-gray-600">Tổng sản phẩm</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <i class="fas fa-layer-group text-green-600 text-2xl mr-4"></i>
            <div>
              <div class="text-2xl font-bold text-gray-800">{{ stats.totalCategories }}</div>
              <div class="text-sm text-gray-600">Danh mục</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-purple-600 text-2xl mr-4"></i>
            <div>
              <div class="text-2xl font-bold text-gray-800">{{ stats.inStockProducts }}</div>
              <div class="text-sm text-gray-600">Còn hàng</div>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <i class="fas fa-star text-orange-600 text-2xl mr-4"></i>
            <div>
              <div class="text-2xl font-bold text-gray-800">{{ stats.featuredProducts }}</div>
              <div class="text-sm text-gray-600">Nổi bật</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <!-- Search and Filter -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                v-model="searchQuery"
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
            
            <select
              v-model="filterCategory"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>

            <select
              v-model="filterStock"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="inStock">Còn hàng</option>
              <option value="outOfStock">Hết hàng</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-3">
            <button
              @click="showCreateModal = true"
              class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            >
              <i class="fas fa-plus mr-2"></i>
              Thêm sản phẩm
            </button>
            
            <button
              @click="downloadExcel"
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              title="Tải xuống Excel"
            >
              <i class="fas fa-download"></i>
            </button>

            <button
              @click="showUploadModal = true"
              class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              title="Upload Excel mới"
            >
              <i class="fas fa-upload"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">
            Danh sách sản phẩm ({{ filteredProducts.length }})
          </h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="text-center">
                <td colspan="5" class="px-6 py-8">
                  <i class="fas fa-spinner fa-spin text-2xl text-blue-500 mb-2"></i>
                  <p class="text-gray-600">Đang tải dữ liệu...</p>
                </td>
              </tr>
              
              <tr v-else-if="filteredProducts.length === 0" class="text-center">
                <td colspan="5" class="px-6 py-8">
                  <i class="fas fa-box-open text-4xl text-gray-400 mb-2"></i>
                  <p class="text-gray-600">{{ searchQuery ? 'Không tìm thấy sản phẩm nào' : 'Chưa có sản phẩm nào' }}</p>
                </td>
              </tr>

              <tr v-else v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img 
                      :src="product.image || '/images/no-image.png'" 
                      :alt="product.name"
                      class="w-12 h-12 rounded-lg object-cover mr-4"
                      @error="handleImageError($event)"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                      <div class="text-sm text-gray-500">ID: {{ product.id }}</div>
                      <div v-if="product.featured" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                        <i class="fas fa-star mr-1"></i>Nổi bật
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ product.category }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatPrice(product.price) }}
                  <div v-if="product.packageSize" class="text-xs text-gray-500">{{ product.packageSize }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    <i :class="product.inStock ? 'fas fa-check mr-1' : 'fas fa-times mr-1'"></i>
                    {{ product.inStock ? 'Còn hàng' : 'Hết hàng' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="viewProduct(product)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Xem chi tiết"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    @click="editProduct(product)"
                    class="text-green-600 hover:text-green-900"
                    title="Sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="deleteProduct(product)"
                    class="text-red-600 hover:text-red-900"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredProducts.length > itemsPerPage" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} 
              trong tổng {{ filteredProducts.length }} sản phẩm
            </div>
            <div class="flex space-x-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Product Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">
            {{ showEditModal ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới' }}
          </h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveProduct" class="p-6">
          <!-- Tab Navigation -->
          <div class="flex border-b mb-6">
            <button
              v-for="tab in formTabs"
              :key="tab.id"
              type="button"
              @click="activeTab = tab.id"
              :class="[
                'px-4 py-2 font-medium text-sm border-b-2 transition-colors',
                activeTab === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              <i :class="tab.icon + ' mr-2'"></i>
              {{ tab.name }}
            </button>
          </div>

          <!-- Tab Content -->
          <div class="space-y-6">
            
            <!-- Tab 1: Thông tin cơ bản -->
            <div v-show="activeTab === 'basic'" class="space-y-6">
              <!-- Product Image -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm</label>
                <div class="flex items-center space-x-4">
                  <div class="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      v-if="form.image || selectedImageFile" 
                      :src="selectedImageFile ? imagePreview : form.image" 
                      alt="Preview"
                      class="w-full h-full object-cover"
                    />
                    <i v-else class="fas fa-image text-gray-400 text-xl"></i>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref="imageInput"
                      @change="handleImageSelect"
                      accept="image/*"
                      class="hidden"
                    />
                    <button
                      type="button"
                      @click="$refs.imageInput.click()"
                      class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      <i class="fas fa-upload mr-2"></i>Chọn ảnh
                    </button>
                    <p class="text-xs text-gray-500 mt-1">JPG, PNG, WebP. Tối đa 5MB</p>
                  </div>
                </div>
              </div>

              <!-- Basic Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
                  <input
                    type="text"
                    v-model="form.name"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Danh mục *</label>
                  <select
                    v-model="form.category"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    <option v-for="category in categories" :key="category.id" :value="category.name">
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Giá bán *</label>
                  <input
                    type="number"
                    v-model="form.price"
                    required
                    min="0"
                    step="any"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Giá gốc</label>
                  <input
                    type="number"
                    v-model="form.originalPrice"
                    min="0"
                    step="any"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Kích thước gói</label>
                  <input
                    type="text"
                    v-model="form.packageSize"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: 30 viên/hộp"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số lượng tồn kho</label>
                  <input
                    type="number"
                    v-model="form.stockQuantity"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
                <textarea
                  v-model="form.description"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả ngắn gọn về sản phẩm..."
                ></textarea>
              </div>

              <!-- Options -->
              <div class="flex items-center space-x-6">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="form.inStock"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Còn hàng</span>
                </label>

                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="form.isFeatured"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700">Sản phẩm nổi bật</span>
                </label>
              </div>
            </div>

            <!-- Tab 2: Thông tin chi tiết -->
            <div v-show="activeTab === 'details'" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả đầy đủ</label>
                <textarea
                  v-model="form.fullDescription"
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả chi tiết về sản phẩm, công dụng, lợi ích..."
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Đối tượng sử dụng</label>
                  <input
                    type="text"
                    v-model="form.targetAnimal"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ví dụ: Gia súc, gia cầm, chó, mèo..."
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nhà sản xuất</label>
                  <input
                    type="text"
                    v-model="form.manufacturer"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tên nhà sản xuất"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Xuất xứ</label>
                  <input
                    type="text"
                    v-model="form.originCountry"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Quốc gia sản xuất"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số đăng ký</label>
                  <input
                    type="text"
                    v-model="form.registrationNumber"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Số đăng ký lưu hành"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tags (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  v-model="form.tagsText"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="kháng sinh, vitamin, bổ sung, chất lượng cao..."
                />
              </div>
            </div>

            <!-- Tab 3: Thông tin y tế -->
            <div v-show="activeTab === 'medical'" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Thành phần hoạt chất</label>
                <textarea
                  v-model="form.activeIngredients"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Liệt kê các thành phần hoạt chất và hàm lượng..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Liều dùng & cách sử dụng</label>
                <textarea
                  v-model="form.dosage"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hướng dẫn liều dùng theo cân nặng, độ tuổi..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hướng dẫn sử dụng</label>
                <textarea
                  v-model="form.usageInstructions"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cách thức sử dụng, thời điểm sử dụng..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Chống chỉ định & cảnh báo</label>
                <textarea
                  v-model="form.warnings"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Các trường hợp không nên sử dụng, tác dụng phụ..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Điều kiện bảo quản</label>
                <textarea
                  v-model="form.storageConditions"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhiệt độ, độ ẩm, điều kiện ánh sáng..."
                ></textarea>
              </div>
            </div>

            <!-- Tab 4: Chức năng & đánh giá -->
            <div v-show="activeTab === 'extra'" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Chức năng (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  v-model="form.functionsText"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Kháng khuẩn, tăng sức đề kháng, bổ sung vitamin..."
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Đánh giá (1-5 sao)</label>
                  <input
                    type="number"
                    v-model="form.rating"
                    min="0"
                    max="5"
                    step="0.1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="4.5"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Số lượt đánh giá</label>
                  <input
                    type="number"
                    v-model="form.reviewCount"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <!-- Additional Images -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hình ảnh bổ sung</label>
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    ref="additionalImagesInput"
                    @change="handleAdditionalImages"
                    accept="image/*"
                    multiple
                    class="hidden"
                  />
                  <div class="text-center">
                    <i class="fas fa-images text-gray-400 text-2xl mb-2"></i>
                    <p class="text-sm text-gray-600 mb-2">Thêm nhiều hình ảnh cho sản phẩm</p>
                    <button
                      type="button"
                      @click="$refs.additionalImagesInput.click()"
                      class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      <i class="fas fa-plus mr-2"></i>Chọn ảnh
                    </button>
                  </div>
                  
                  <!-- Preview additional images -->
                  <div v-if="form.additionalImages && form.additionalImages.length > 0" class="mt-4 grid grid-cols-4 gap-2">
                    <div v-for="(img, index) in form.additionalImages" :key="index" class="relative">
                      <img :src="img" alt="Additional" class="w-full h-16 object-cover rounded border">
                      <button
                        type="button"
                        @click="removeAdditionalImage(index)"
                        class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-between items-center pt-6 border-t mt-8">
            <div class="flex space-x-2">
              <button
                v-for="tab in formTabs"
                :key="tab.id"
                type="button"
                @click="activeTab = tab.id"
                :class="[
                  'px-3 py-1 text-xs rounded border',
                  activeTab === tab.id 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                ]"
              >
                {{ tab.name }}
              </button>
            </div>

            <div class="flex space-x-3">
              <button
                type="button"
                @click="closeModal"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                :disabled="formLoading"
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
              >
                <i v-if="formLoading" class="fas fa-spinner fa-spin mr-2"></i>
                {{ showEditModal ? 'Cập nhật' : 'Thêm mới' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- View Product Modal -->
    <div v-if="showViewModal && selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">Chi tiết sản phẩm</h3>
          <button @click="showViewModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Product Image -->
            <div>
              <img 
                :src="selectedProduct.image || '/images/no-image.png'" 
                :alt="selectedProduct.name"
                class="w-full h-64 object-cover rounded-lg border"
                @error="handleImageError($event)"
              />
            </div>

            <!-- Product Details -->
            <div class="space-y-4">
              <div>
                <h4 class="text-xl font-bold text-gray-900">{{ selectedProduct.name }}</h4>
                <p class="text-sm text-gray-500">ID: {{ selectedProduct.id }}</p>
              </div>

              <div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {{ selectedProduct.category }}
                </span>
                <span v-if="selectedProduct.featured" class="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <i class="fas fa-star mr-1"></i>Nổi bật
                </span>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700">Giá:</label>
                <p class="text-2xl font-bold text-green-600">{{ formatPrice(selectedProduct.price) }}</p>
                <p v-if="selectedProduct.packageSize" class="text-sm text-gray-600">{{ selectedProduct.packageSize }}</p>
              </div>

              <div>
                <label class="text-sm font-medium text-gray-700">Trạng thái:</label>
                <p>
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    selectedProduct.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    <i :class="selectedProduct.inStock ? 'fas fa-check mr-1' : 'fas fa-times mr-1'"></i>
                    {{ selectedProduct.inStock ? 'Còn hàng' : 'Hết hàng' }}
                  </span>
                </p>
              </div>

              <div v-if="selectedProduct.description">
                <label class="text-sm font-medium text-gray-700">Mô tả:</label>
                <p class="text-gray-600 text-sm">{{ selectedProduct.description }}</p>
              </div>

              <!-- Actions -->
              <div class="flex space-x-3 pt-4">
                <button
                  @click="editProduct(selectedProduct)"
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                >
                  <i class="fas fa-edit mr-2"></i>Sửa
                </button>
                <button
                  @click="deleteProduct(selectedProduct)"
                  class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                >
                  <i class="fas fa-trash mr-2"></i>Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Excel Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold">Upload Excel mới</h3>
          <button @click="showUploadModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              ref="excelInput"
              @change="handleExcelUpload"
              accept=".xlsx,.xls"
              class="hidden"
            />
            <i class="fas fa-file-excel text-4xl text-green-500 mb-4"></i>
            <p class="text-lg font-medium mb-2">Chọn file Excel</p>
            <p class="text-gray-600 mb-4">Định dạng: .xlsx, .xls</p>
            <button
              @click="$refs.excelInput.click()"
              class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            >
              <i class="fas fa-upload mr-2"></i>Chọn file
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="globalLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 flex items-center space-x-4">
        <i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
        <span class="text-lg">{{ loadingMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ProductManagerAPI } from '@/utils/productManagerAPI.js'

export default {
  name: 'ProductManagerView',
  data() {
    return {
      // Data
      products: [],
      categories: [],
      stats: {
        totalProducts: 0,
        totalCategories: 0,
        inStockProducts: 0,
        featuredProducts: 0
      },

      // UI State
      loading: false,
      globalLoading: false,
      formLoading: false,
      loadingMessage: '',

      // Filters
      searchQuery: '',
      filterCategory: '',
      filterStock: '',

      // Pagination
      currentPage: 1,
      itemsPerPage: 10,

      // Modals
      showCreateModal: false,
      showEditModal: false,
      showViewModal: false,
      showUploadModal: false,
      selectedProduct: null,

      // Form tabs
      activeTab: 'basic',
      formTabs: [
        { id: 'basic', name: 'Cơ bản', icon: 'fas fa-info-circle' },
        { id: 'details', name: 'Chi tiết', icon: 'fas fa-list-alt' },
        { id: 'medical', name: 'Y tế', icon: 'fas fa-prescription-bottle-alt' },
        { id: 'extra', name: 'Khác', icon: 'fas fa-star' }
      ],

      // Form
      form: {
        name: '',
        category: '',
        price: '',
        originalPrice: '',
        description: '',
        fullDescription: '',
        packageSize: '',
        stockQuantity: 0,
        image: '',
        additionalImages: [],
        inStock: true,
        isFeatured: false,
        targetAnimal: '',
        manufacturer: 'HALIFE Việt Nhật',
        originCountry: 'Việt Nam',
        registrationNumber: '',
        activeIngredients: '',
        dosage: '',
        usageInstructions: '',
        warnings: '',
        storageConditions: '',
        rating: 0,
        reviewCount: 0,
        tagsText: '',
        functionsText: ''
      },
      selectedImageFile: null,
      imagePreview: null
    }
  },

  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        const matchesSearch = !this.searchQuery || 
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.id.includes(this.searchQuery);
        
        const matchesCategory = !this.filterCategory || product.category === this.filterCategory;
        
        const matchesStock = !this.filterStock || 
          (this.filterStock === 'inStock' && product.inStock) ||
          (this.filterStock === 'outOfStock' && !product.inStock);

        return matchesSearch && matchesCategory && matchesStock;
      });
    },

    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    }
  },

  watch: {
    filteredProducts() {
      this.currentPage = 1; // Reset pagination when filter changes
    }
  },

  methods: {
    // Data Loading
    async loadData() {
      this.loading = true;
      try {
        const [products, categories, stats] = await Promise.all([
          ProductManagerAPI.getAllProducts(),
          ProductManagerAPI.getAllCategories(),
          ProductManagerAPI.getProductStats()
        ]);

        this.products = products;
        this.categories = categories;
        this.stats = stats;
      } catch (error) {
        this.showMessage('Lỗi tải dữ liệu: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },

    async reloadData() {
      this.globalLoading = true;
      this.loadingMessage = 'Đang reload dữ liệu từ Excel...';

      try {
        await ProductManagerAPI.reloadDataFromExcel();
        await this.loadData();
        this.showMessage('Đã reload dữ liệu từ Excel thành công!', 'success');
      } catch (error) {
        this.showMessage('Lỗi reload: ' + error.message, 'error');
      } finally {
        this.globalLoading = false;
      }
    },

    // Product Operations
    async saveProduct() {
      const validation = ProductManagerAPI.validateProduct(this.form);
      if (!validation.isValid) {
        this.showMessage('Lỗi: ' + validation.errors.join(', '), 'error');
        return;
      }

      this.formLoading = true;

      try {
        // Chuẩn bị dữ liệu form
        const formData = {
          ...this.form,
          // Convert text inputs to arrays
          tags: this.form.tagsText ? this.form.tagsText.split(',').map(tag => tag.trim()) : [],
          functions: this.form.functionsText ? this.form.functionsText.split(',').map(func => func.trim()) : [],
          // Convert numeric fields
          price: parseInt(this.form.price) || 0,
          originalPrice: parseInt(this.form.originalPrice) || parseInt(this.form.price) || 0,
          stockQuantity: parseInt(this.form.stockQuantity) || 0,
          rating: parseFloat(this.form.rating) || 0,
          reviewCount: parseInt(this.form.reviewCount) || 0
        };

        let result;
        if (this.showEditModal) {
          result = await ProductManagerAPI.updateProduct(
            this.selectedProduct.id, 
            formData, 
            this.selectedImageFile
          );
        } else {
          result = await ProductManagerAPI.createProduct(formData, this.selectedImageFile);
        }

        this.showMessage(result.message, 'success');
        await this.loadData();
        this.closeModal();
      } catch (error) {
        this.showMessage('Lỗi lưu sản phẩm: ' + error.message, 'error');
      } finally {
        this.formLoading = false;
      }
    },

    async deleteProduct(product) {
      if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?\nHành động này không thể hoàn tác.`)) {
        return;
      }

      this.globalLoading = true;
      this.loadingMessage = 'Đang xóa sản phẩm...';

      try {
        const result = await ProductManagerAPI.deleteProduct(product.id);
        this.showMessage(result.message, 'success');
        await this.loadData();
        
        // Close modals if showing deleted product
        if (this.selectedProduct && this.selectedProduct.id === product.id) {
          this.showViewModal = false;
          this.showEditModal = false;
        }
      } catch (error) {
        this.showMessage('Lỗi xóa sản phẩm: ' + error.message, 'error');
      } finally {
        this.globalLoading = false;
      }
    },

    // Modal Operations
    viewProduct(product) {
      this.selectedProduct = product;
      this.showViewModal = true;
    },

    editProduct(product) {
      this.selectedProduct = product;
      this.form = {
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        originalPrice: product.originalPrice || product.price || '',
        description: product.description || '',
        fullDescription: product.fullDescription || product.description || '',
        packageSize: product.packageSize || '',
        stockQuantity: product.stockQuantity || 0,
        image: product.image || '',
        additionalImages: product.images ? product.images.slice(1) : [],
        inStock: product.inStock !== false,
        isFeatured: product.isFeatured || false,
        targetAnimal: product.targetAnimal || '',
        manufacturer: product.manufacturer || 'HALIFE Việt Nhật',
        originCountry: product.originCountry || 'Việt Nam',
        registrationNumber: product.registrationNumber || '',
        activeIngredients: product.activeIngredients || '',
        dosage: product.dosage || '',
        usageInstructions: product.usageInstructions || '',
        warnings: product.warnings || '',
        storageConditions: product.storageConditions || '',
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        tagsText: product.tags ? product.tags.join(', ') : '',
        functionsText: product.functions ? product.functions.join(', ') : ''
      };
      this.selectedImageFile = null;
      this.imagePreview = null;
      this.activeTab = 'basic';
      this.showViewModal = false;
      this.showEditModal = true;
    },

    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.showViewModal = false;
      this.selectedProduct = null;
      this.resetForm();
    },

    resetForm() {
      this.form = {
        name: '',
        category: '',
        price: '',
        originalPrice: '',
        description: '',
        fullDescription: '',
        packageSize: '',
        stockQuantity: 0,
        image: '',
        additionalImages: [],
        inStock: true,
        isFeatured: false,
        targetAnimal: '',
        manufacturer: 'HALIFE Việt Nhật',
        originCountry: 'Việt Nam',
        registrationNumber: '',
        activeIngredients: '',
        dosage: '',
        usageInstructions: '',
        warnings: '',
        storageConditions: '',
        rating: 0,
        reviewCount: 0,
        tagsText: '',
        functionsText: ''
      };
      this.selectedImageFile = null;
      this.imagePreview = null;
      this.activeTab = 'basic';
    },

    // File Operations
    handleImageSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file
      if (!file.type.startsWith('image/')) {
        this.showMessage('Vui lòng chọn file hình ảnh', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('File không được vượt quá 5MB', 'error');
        return;
      }

      this.selectedImageFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async handleExcelUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.globalLoading = true;
      this.loadingMessage = 'Đang upload file Excel...';
      this.showUploadModal = false;

      try {
        const result = await ProductManagerAPI.uploadExcel(file);
        this.showMessage(result.message, 'success');
      } catch (error) {
        this.showMessage('Lỗi upload Excel: ' + error.message, 'error');
      } finally {
        this.globalLoading = false;
        event.target.value = '';
      }
    },

    async downloadExcel() {
      this.globalLoading = true;
      this.loadingMessage = 'Đang tải xuống Excel...';

      try {
        const result = await ProductManagerAPI.downloadExcel();
        this.showMessage(result.message, 'success');
      } catch (error) {
        this.showMessage('Lỗi tải xuống: ' + error.message, 'error');
      } finally {
        this.globalLoading = false;
      }
    },

    // Utilities
    formatPrice(price) {
      if (!price) return '0 VNĐ';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },

    handleImageError(event) {
      event.target.src = '/images/no-image.png';
    },

    // Image handling
    handleAdditionalImages(event) {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      // Validate files
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          this.showMessage(`File ${file.name} không phải là hình ảnh`, 'error');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          this.showMessage(`File ${file.name} quá lớn (>5MB)`, 'error');
          return false;
        }
        return true;
      });

      // Create previews
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.form.additionalImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });

      event.target.value = '';
    },

    removeAdditionalImage(index) {
      this.form.additionalImages.splice(index, 1);
    },

    // Tab navigation helper
    nextTab() {
      const currentIndex = this.formTabs.findIndex(tab => tab.id === this.activeTab);
      if (currentIndex < this.formTabs.length - 1) {
        this.activeTab = this.formTabs[currentIndex + 1].id;
      }
    },

    prevTab() {
      const currentIndex = this.formTabs.findIndex(tab => tab.id === this.activeTab);
      if (currentIndex > 0) {
        this.activeTab = this.formTabs[currentIndex - 1].id;
      }
    },

    // Enhanced table display
    getDiscountPercentage(product) {
      if (!product.originalPrice || !product.price) return 0;
      const original = parseInt(product.originalPrice);
      const current = parseInt(product.price);
      if (original <= current) return 0;
      return Math.round(((original - current) / original) * 100);
    },

    getProductStatus(product) {
      if (!product.inStock) return { text: 'Hết hàng', class: 'bg-red-100 text-red-800' };
      if (product.stockQuantity && product.stockQuantity < 10) return { text: 'Sắp hết', class: 'bg-yellow-100 text-yellow-800' };
      return { text: 'Còn hàng', class: 'bg-green-100 text-green-800' };
    },

    // Export/Import helpers
    async exportToCSV() {
      try {
        const products = await ProductManagerAPI.getAllProducts();
        
        // Create CSV content
        const headers = [
          'ID', 'Tên sản phẩm', 'Danh mục', 'Giá', 'Giá gốc', 'Mô tả', 
          'Kích thước gói', 'Tồn kho', 'Còn hàng', 'Nổi bật', 'Đối tượng',
          'Nhà sản xuất', 'Xuất xứ', 'Số đăng ký', 'Thành phần', 'Liều dùng',
          'Cách dùng', 'Cảnh báo', 'Bảo quản', 'Đánh giá', 'Lượt đánh giá'
        ];
        
        let csvContent = '\uFEFF'; // BOM for UTF-8
        csvContent += headers.join(',') + '\n';
        
        products.forEach(product => {
          const row = [
            product.id || '',
            `"${(product.name || '').replace(/"/g, '""')}"`,
            `"${(product.category || '').replace(/"/g, '""')}"`,
            product.price || '',
            product.originalPrice || '',
            `"${(product.description || '').replace(/"/g, '""')}"`,
            `"${(product.packageSize || '').replace(/"/g, '""')}"`,
            product.stockQuantity || 0,
            product.inStock ? 'Có' : 'Không',
            product.isFeatured ? 'Có' : 'Không',
            `"${(product.targetAnimal || '').replace(/"/g, '""')}"`,
            `"${(product.manufacturer || '').replace(/"/g, '""')}"`,
            `"${(product.originCountry || '').replace(/"/g, '""')}"`,
            `"${(product.registrationNumber || '').replace(/"/g, '""')}"`,
            `"${(product.activeIngredients || '').replace(/"/g, '""')}"`,
            `"${(product.dosage || '').replace(/"/g, '""')}"`,
            `"${(product.usageInstructions || '').replace(/"/g, '""')}"`,
            `"${(product.warnings || '').replace(/"/g, '""')}"`,
            `"${(product.storageConditions || '').replace(/"/g, '""')}"`,
            product.rating || 0,
            product.reviewCount || 0
          ];
          csvContent += row.join(',') + '\n';
        });
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `halife_products_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.showMessage('Đã xuất dữ liệu ra file CSV thành công!', 'success');
      } catch (error) {
        this.showMessage('Lỗi xuất dữ liệu: ' + error.message, 'error');
      }
    },

    showMessage(message, type = 'info') {
      const icons = { success: '✅', error: '❌', info: 'ℹ️' };
      alert(`${icons[type]} ${message}`);
    }
 },

 async mounted() {
   document.title = 'Quản lý Sản phẩm - HALIFE Admin';
   await this.loadData();
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