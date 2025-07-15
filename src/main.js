// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { dataAPI } from '@/data/products.js'
import './assets/main.css'

const app = createApp(App)
app.use(router)

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

showGlobalLoading()

app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err)
  hideGlobalLoading()
}

async function initializeApp() {
  try {
    await dataAPI.initialize('/data/halife_products.xlsx')
    app.mount('#app')
    setTimeout(hideGlobalLoading, 500)
    
  } catch (error) {
    console.error('Lỗi khởi tạo:', error)
    app.mount('#app')
    hideGlobalLoading()
  }
}

// Service Worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

initializeApp()