import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Trang chủ - HALIFE Animals',
      description: 'HALIFE ANIMALS - Công nghệ thú y độc quyền Nhật Bản. Cung cấp thuốc thú y chất lượng cao và hải sản tươi sống.'
    }
  },
  {
    path: '/admin/products',
    name: 'product-manage',
    component: () => import('../views/ProductManagerView.vue'),
    meta: {
      title: 'Product Manager - HALIFE Admin',
      description: 'Quản lý sản phẩm cho HALIFE Animals',
      requiresAuth: true
    }
  },
  {
    path: '/admin/news',
    name: 'news-editor',
    component: () => import('../views/NewsEditorView.vue'),
    meta: {
      title: 'News Editor - HALIFE Admin',
      description: 'Thêm và chỉnh sửa tin tức cho HALIFE Animals',
      requiresAuth: true // Có thể thêm authentication sau
    }
  },
  {
    path: '/admin/banners',
    name: 'banner-manager',
    component: () => import('../views/BannerManagerView.vue'),
    meta: {
      title: 'Banner Editor - HALIFE Admin',
      description: 'Thêm và chỉnh sửa banner cho HALIFE Animals',
      requiresAuth: true // Có thể thêm authentication sau
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: 'Giới thiệu - HALIFE Animals',
      description: 'Công ty cổ phần thuốc thú y HALIFE Việt Nhật - Công nghệ thú y độc quyền Nhật Bản, cung cấp sản phẩm chất lượng cao.'
    }
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/ProductsView.vue'),
    meta: {
      title: 'Sản phẩm - HALIFE Animals',
      description: 'Danh sách sản phẩm thuốc thú y và hải sản tươi sống chất lượng cao từ HALIFE Animals.'
    }
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: {
      title: 'Chi tiết sản phẩm - HALIFE Animals',
      description: 'Thông tin chi tiết sản phẩm thuốc thú y chất lượng cao từ HALIFE Animals.'
    },
    props: true
  },
  {
    path: '/news',
    name: 'news',
    component: () => import('../views/NewsView.vue'),
    meta: {
      title: 'Tin tức - HALIFE Animals',
      description: 'Tin tức và kiến thức chuyên môn về thú y, chăn nuôi và hải sản từ HALIFE Animals.'
    }
  },
  {
    path: '/article/:id',
    name: 'article-detail',
    component: () => import('../views/ArticleDetailView.vue'),
    meta: {
      title: 'Chi tiết bài viết - HALIFE Animals',
      description: 'Đọc bài viết chi tiết về kiến thức chuyên môn thú y và chăn nuôi từ HALIFE Animals.'
    },
    props: true
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue'),
    meta: {
      title: 'Liên hệ - HALIFE Animals',
      description: 'Thông tin liên hệ và hỗ trợ khách hàng HALIFE Animals. Hotline: 0866.583.223'
    }
  },
  // Redirect old routes for SEO
  {
    path: '/gioi-thieu',
    redirect: '/about'
  },
  {
    path: '/san-pham',
    redirect: '/products'
  },
  {
    path: '/tin-tuc',
    redirect: '/news'
  },
  {
    path: '/lien-he',
    redirect: '/contact'
  },
  // Admin routes - có thể thêm authentication guard sau
  {
    path: '/admin',
    redirect: '/file-manager'
  },
  // 404 Not Found - must be last
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: {
      title: 'Trang không tồn tại (404) - HALIFE Animals',
      description: 'Trang bạn tìm kiếm không tồn tại. Quay lại trang chủ HALIFE Animals.'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when changing routes, except when using back button
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      // Scroll to anchor if hash is present
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { 
        top: 0,
        behavior: 'smooth'
      }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Set meta description
  if (to.meta.description) {
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', to.meta.description)
  }
  
  // Set canonical URL
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalLink)
  }
  canonicalLink.setAttribute('href', `https://halife.vn${to.path}`)
  
  // Handle query parameters for specific pages
  if (to.name === 'products' && (to.query.search || to.query.category)) {
    // Pass query parameters to component via meta
    to.meta.searchQuery = to.query.search
    to.meta.categoryFilter = to.query.category
  }
  
  // Basic auth check for admin routes (có thể mở rộng sau)
  if (to.meta.requiresAuth) {
    // TODO: Add proper authentication check here
    // For now, just warn in console
    console.log('⚠️ Admin route accessed:', to.path)
  }
  
  // Analytics tracking (uncomment when ready to use)
  // if (typeof gtag !== 'undefined') {
  //   gtag('config', 'GA_MEASUREMENT_ID', {
  //     page_path: to.path
  //   })
  // }
  
  // Log navigation for debugging
  console.log(`Navigating from ${from.path} to ${to.path}`)
  
  next()
})

// Error handling
router.onError((error) => {
  console.error('Router error:', error)
  
  // Optionally redirect to error page or home
  if (error.message.includes('Loading chunk')) {
    // Handle dynamic import errors (usually caused by code splitting)
    window.location.reload()
  }
})

// Add route change loading indicator
router.beforeResolve((to, from, next) => {
  // Show loading indicator
  if (to.name && from.name) {
    document.body.classList.add('loading')
  }
  next()
})

router.afterEach(() => {
  // Hide loading indicator
  document.body.classList.remove('loading')
})

export default router