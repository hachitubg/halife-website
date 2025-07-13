// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { dataAPI } from '@/data/products.js'

// Import CSS
import './assets/main.css'

// Tạo app instance
const app = createApp(App)

// Use router
app.use(router)

// Thêm loading overlay cho toàn bộ app
function showGlobalLoading() {
  const loadingOverlay = document.createElement('div')
  loadingOverlay.id = 'global-loading'
  loadingOverlay.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="text-align: center;">
        <div style="
          width: 60px;
          height: 60px;
          border: 4px solid #e5e7eb;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        "></div>
        <h3 style="
          margin: 0 0 10px 0;
          color: #1f2937;
          font-size: 18px;
          font-weight: 600;
        ">HALIFE Animals</h3>
        <p style="
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        ">Đang tải dữ liệu sản phẩm...</p>
      </div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `
  document.body.appendChild(loadingOverlay)
}

function hideGlobalLoading() {
  const loadingOverlay = document.getElementById('global-loading')
  if (loadingOverlay) {
    loadingOverlay.remove()
  }
}

// Show loading ngay lập tức
showGlobalLoading()

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
  
  // Hide loading nếu có lỗi
  hideGlobalLoading()
}

// Global warning handler  
app.config.warnHandler = (msg, vm, trace) => {
  console.warn('Vue Warning:', msg)
  console.warn('Trace:', trace)
}

// Khởi tạo dữ liệu từ Excel
async function initializeApp() {
  try {
    console.log('🚀 Khởi động HALIFE Animals...')
    
    // Bước 1: Khởi tạo dữ liệu sản phẩm
    console.log('📖 Đang tải dữ liệu sản phẩm từ Excel...')
    await dataAPI.initialize('public/data/halife_products.xlsx')
    
    // Bước 2: Kiểm tra kết quả
    const stats = dataAPI.getStats()
    console.log('📊 Thống kê dữ liệu:', stats)
    
    if (stats.error) {
      console.warn('⚠️ Có lỗi khi tải Excel, đang sử dụng dữ liệu fallback:', stats.error)
    } else {
      console.log('✅ Tải dữ liệu thành công từ Excel!')
    }
    
    console.log(`🎯 Sẵn sàng: ${stats.totalProducts} sản phẩm, ${stats.totalCategories} danh mục`)
    
    // Bước 3: Mount Vue app
    app.mount('#app')
    console.log('🎉 HALIFE Animals đã sẵn sàng!')
    
    // Bước 4: Hide loading sau khi mount xong
    setTimeout(hideGlobalLoading, 500) // Delay nhỏ để smooth transition
    
  } catch (error) {
    console.error('❌ Lỗi khởi tạo ứng dụng:', error)
    
    // Vẫn mount app nếu có lỗi, sử dụng fallback data
    console.log('🔄 Đang mount app với dữ liệu fallback...')
    app.mount('#app')
    hideGlobalLoading()
    
    // Show error notification
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.alert) {
        alert('Không thể tải dữ liệu từ Excel. Ứng dụng đang sử dụng dữ liệu mẫu.')
      }
    }, 1000)
  }
}

// Listen for data loaded event
dataAPI.onDataLoaded((event) => {
  const { products, categories, usingFallback } = event.detail
  
  console.log('🔄 Dữ liệu đã được cập nhật:', {
    products: products.length,
    categories: categories.length,
    usingFallback: usingFallback || false
  })
  
  // Có thể dispatch custom event cho các component khác
  window.dispatchEvent(new CustomEvent('appDataReady', {
    detail: {
      products,
      categories,
      usingFallback
    }
  }))
})

// Expose data API globally cho debugging
if (typeof window !== 'undefined') {
  window.halifeDataAPI = dataAPI
  
  // Debug helpers
  window.halifeDebug = {
    getStats: () => dataAPI.getStats(),
    reload: () => dataAPI.reload(),
    products: () => dataAPI.isLoaded ? products : 'Data not loaded yet',
    test: () => {
      console.log('🧪 HALIFE Debug Test:')
      console.log('- Data loaded:', dataAPI.isLoaded)
      console.log('- Loading:', dataAPI.isLoading) 
      console.log('- Error:', dataAPI.error)
      console.log('- Stats:', dataAPI.getStats())
      return 'Check console for details'
    }
  }
  
  console.log('🔧 Debug tools available:')
  console.log('- window.halifeDataAPI: API để quản lý dữ liệu')
  console.log('- window.halifeDebug.test(): Kiểm tra trạng thái')
  console.log('- window.halifeDebug.getStats(): Lấy thống kê')
}

// Service Worker registration (optional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ ServiceWorker registered:', registration.scope)
      })
      .catch(error => {
        console.log('❌ ServiceWorker registration failed:', error)
      })
  })
}

// Performance monitoring
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (window.performance && window.performance.navigation) {
        const perfData = window.performance.navigation
        console.log('⚡ Performance Info:')
        console.log('- Navigation type:', perfData.type)
        console.log('- Redirects:', perfData.redirectCount)
        
        if (window.performance.timing) {
          const timing = window.performance.timing
          const loadTime = timing.loadEventEnd - timing.navigationStart
          console.log('- Total load time:', loadTime + 'ms')
        }
      }
    }, 1000)
  })
}

// Khởi chạy ứng dụng
initializeApp()