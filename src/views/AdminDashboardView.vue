<template>
  <div class="admin-dashboard">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Bảng Điều Khiển Admin</h1>
        <p class="text-gray-600">Chọn một mục dưới đây để bắt đầu quản lý</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Product Manager Card - HALIFE -->
        <router-link 
          to="/admin/products"
          class="admin-card"
        >
          <div class="admin-card-content">
            <div class="admin-card-icon bg-blue-100">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4m8 4l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4M4 7L2.5 5.5"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 mt-4">Quản Lý Sản Phẩm - HALIFE</h2>
            <p class="text-gray-600 mt-2">Thêm, chỉnh sửa hoặc xóa sản phẩm HALIFE. Quản lý danh mục và thông tin chi tiết sản phẩm.</p>
            <div class="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Truy Cập →
            </div>
          </div>
        </router-link>

        <!-- Product Manager Card - TÂM VET -->
        <router-link 
          to="/admin/tamvet-products"
          class="admin-card"
        >
          <div class="admin-card-content">
            <div class="admin-card-icon bg-purple-100">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4m8 4l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4M4 7L2.5 5.5"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 mt-4">Quản Lý Sản Phẩm - Tâm Vet</h2>
            <p class="text-gray-600 mt-2">Quản lý sản phẩm Tâm Vet. Thêm, sửa, xóa và cập nhật thông tin sản phẩm dựa trên file Excel.</p>
            <div class="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
              Truy Cập →
            </div>
          </div>
        </router-link>

        <!-- News Editor Card -->
        <router-link 
          to="/admin/news"
          class="admin-card"
        >
          <div class="admin-card-content">
            <div class="admin-card-icon bg-green-100">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 mt-4">Quản Lý Tin Tức</h2>
            <p class="text-gray-600 mt-2">Thêm, chỉnh sửa hoặc xóa bài viết tin tức. Quản lý nội dung và hình ảnh.</p>
            <div class="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Truy Cập →
            </div>
          </div>
        </router-link>

        <!-- Banner Manager Card -->
        <router-link 
          to="/admin/banners"
          class="admin-card"
        >
          <div class="admin-card-content">
            <div class="admin-card-icon bg-orange-100">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 mt-4">Quản Lý Banner</h2>
            <p class="text-gray-600 mt-2">Quản lý các banner hiển thị trên trang chủ. Thay đổi hình ảnh, liên kết và nội dung.</p>
            <div class="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition">
              Truy Cập →
            </div>
          </div>
        </router-link>
      </div>

      <!-- Quick Links Section -->
      <div class="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 class="text-2xl font-bold text-gray-800 mb-4">Các Tính Năng Nhanh</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex items-center text-gray-700">
            <svg class="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span><strong>HALIFE:</strong> /admin/products</span>
          </div>
          <div class="flex items-center text-gray-700">
            <svg class="w-5 h-5 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span><strong>Tâm Vet:</strong> /admin/tamvet-products</span>
          </div>
          <div class="flex items-center text-gray-700">
            <svg class="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span><strong>Tin tức:</strong> /admin/news</span>
          </div>
          <div class="flex items-center text-gray-700">
            <svg class="w-5 h-5 text-orange-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span><strong>Banner:</strong> /admin/banners</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboardView',
  mounted() {
    document.title = 'Admin Dashboard - HALIFE ANIMAL HEALTH'
  }
}
</script>

<style scoped>
.admin-dashboard {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.admin-card {
  display: block;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  border: 2px solid transparent;
}

.admin-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #f0f0f0;
}

.admin-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-card-content {
  text-align: center;
}

.admin-card-content h2 {
  margin-top: 1rem;
}

.admin-card-content p {
  line-height: 1.6;
}
</style>
