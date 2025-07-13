<template>
  <div class="data-debug-component" v-if="showDebug">
    <div class="debug-panel">
      <div class="debug-header">
        <h3>🔧 HALIFE Data Debug</h3>
        <button @click="toggleDebug" class="close-btn">&times;</button>
      </div>
      
      <div class="debug-content">
        <!-- Status -->
        <div class="debug-section">
          <h4>📊 Trạng thái</h4>
          <div class="status-grid">
            <div class="status-item" :class="{ success: stats.isLoaded, loading: stats.isLoading, error: stats.error }">
              <span class="label">Loaded:</span>
              <span class="value">{{ stats.isLoaded ? '✅' : '❌' }}</span>
            </div>
            <div class="status-item" :class="{ loading: stats.isLoading }">
              <span class="label">Loading:</span>
              <span class="value">{{ stats.isLoading ? '🔄' : '✅' }}</span>
            </div>
            <div class="status-item" :class="{ error: stats.error }">
              <span class="label">Error:</span>
              <span class="value">{{ stats.error || '✅' }}</span>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="debug-section">
          <h4>📈 Thống kê</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ stats.totalProducts }}</div>
              <div class="stat-label">Sản phẩm</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ stats.featuredProducts }}</div>
              <div class="stat-label">Nổi bật</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ stats.totalCategories }}</div>
              <div class="stat-label">Danh mục</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ stats.inStockProducts }}</div>
              <div class="stat-label">Còn hàng</div>
            </div>
          </div>
        </div>

        <!-- Sample Products -->
        <div class="debug-section">
          <h4>🛍️ Sản phẩm mẫu</h4>
          <div class="products-preview">
            <div v-for="product in sampleProducts" :key="product.id" class="product-item">
              <img :src="product.image" :alt="product.name" class="product-image">
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-price">{{ product.price }}₫</div>
                <div class="product-category">{{ product.category }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div class="debug-section">
          <h4>📂 Danh mục</h4>
          <div class="categories-list">
            <div v-for="category in sampleCategories" :key="category.name" class="category-item">
              <i :class="category.icon"></i>
              <span>{{ category.name }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="debug-section">
          <h4>⚡ Hành động</h4>
          <div class="actions-grid">
            <button @click="reloadData" :disabled="isReloading" class="action-btn reload">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': isReloading }"></i>
              {{ isReloading ? 'Đang tải...' : 'Reload Data' }}
            </button>
            <button @click="testSearch" class="action-btn test">
              <i class="fas fa-search"></i>
              Test Search
            </button>
            <button @click="exportStats" class="action-btn export">
              <i class="fas fa-download"></i>
              Export Stats
            </button>
            <button @click="showConsoleInfo" class="action-btn info">
              <i class="fas fa-info-circle"></i>
              Console Info
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { products, productCategories, sidebarCategories, getFeaturedProducts, searchProducts, dataAPI } from '@/data/products.js'

export default {
  name: 'DataDebug',
  setup() {
    const showDebug = ref(false)
    const isReloading = ref(false)

    // Stats tính toán
    const stats = computed(() => dataAPI.getStats())
    
    // Sample data để hiển thị
    const sampleProducts = computed(() => products.slice(0, 3))
    const sampleCategories = computed(() => sidebarCategories.slice(0, 5))

    // Methods
    const toggleDebug = () => {
      showDebug.value = !showDebug.value
    }

    const reloadData = async () => {
      isReloading.value = true
      try {
        await dataAPI.reload()
        console.log('✅ Data reloaded successfully')
      } catch (error) {
        console.error('❌ Error reloading data:', error)
      } finally {
        isReloading.value = false
      }
    }

    const testSearch = () => {
      const results = searchProducts('BEST')
      console.log('🔍 Search results for "BEST":', results)
      alert(`Tìm thấy ${results.length} sản phẩm chứa "BEST"`)
    }

    const exportStats = () => {
      const statsData = {
        ...stats.value,
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          isFeatured: p.isFeatured
        })),
        categories: sidebarCategories,
        timestamp: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(statsData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `halife-stats-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    }

    const showConsoleInfo = () => {
      console.group('🔧 HALIFE Debug Info')
      console.log('📊 Stats:', stats.value)
      console.log('🛍️ Products:', products)
      console.log('📂 Categories:', sidebarCategories)
      console.log('⭐ Featured:', getFeaturedProducts())
      console.log('🔍 Search test:', searchProducts('thuốc'))
      console.groupEnd()
    }

    // Keyboard shortcuts
    const handleKeydown = (event) => {
      // Ctrl/Cmd + Shift + D = Toggle debug
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault()
        toggleDebug()
      }
    }

    // Listen for data updates
    const handleDataLoaded = (event) => {
      console.log('🔄 Debug: Data updated', event.detail)
    }

    onMounted(() => {
      // Auto show debug nếu có error hoặc trong dev mode
      if (stats.value.error || import.meta.env.DEV) {
        setTimeout(() => {
          showDebug.value = true
        }, 2000)
      }

      document.addEventListener('keydown', handleKeydown)
      dataAPI.onDataLoaded(handleDataLoaded)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeydown)
      dataAPI.offDataLoaded(handleDataLoaded)
    })

    return {
      showDebug,
      isReloading,
      stats,
      sampleProducts,
      sampleCategories,
      toggleDebug,
      reloadData,
      testSearch,
      exportStats,
      showConsoleInfo
    }
  }
}
</script>

<style scoped>
.data-debug-component {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.debug-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #3b82f6;
  color: white;
  border-radius: 8px 8px 0 0;
}

.debug-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.debug-content {
  padding: 16px;
}

.debug-section {
  margin-bottom: 20px;
}

.debug-section h4 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  background: #f9fafb;
  border-radius: 4px;
  font-size: 12px;
}

.status-item.success {
  background: #ecfdf5;
  color: #065f46;
}

.status-item.loading {
  background: #dbeafe;
  color: #1e40af;
}

.status-item.error {
  background: #fef2f2;
  color: #991b1b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.stat-card {
  background: #f9fafb;
  padding: 12px;
  border-radius: 6px;
  text-align: center;
}

.stat-number {
  font-size: 18px;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.products-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-item {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  line-height: 1.3;
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 10px;
  color: #dc2626;
  font-weight: 600;
}

.product-category {
  font-size: 9px;
  color: #6b7280;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 10px;
  color: #374151;
}

.category-item i {
  color: #3b82f6;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.action-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.reload {
  background: #3b82f6;
  color: white;
}

.action-btn.reload:hover:not(:disabled) {
  background: #2563eb;
}

.action-btn.test {
  background: #10b981;
  color: white;
}

.action-btn.test:hover {
  background: #059669;
}

.action-btn.export {
  background: #f59e0b;
  color: white;
}

.action-btn.export:hover {
  background: #d97706;
}

.action-btn.info {
  background: #6b7280;
  color: white;
}

.action-btn.info:hover {
  background: #4b5563;
}

/* Responsive */
@media (max-width: 480px) {
  .debug-panel {
    width: calc(100vw - 40px);
    right: 20px;
  }
}
</style>