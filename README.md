# HALIFE ANIMAL HEALTH Website

Website chính thức của công ty HALIFE ANIMAL HEALTH - Nhà cung cấp thuốc thú y và hải sản tươi sống với công nghệ độc quyền từ Nhật Bản.

## Công nghệ sử dụng

- Frontend: Vue 3, TailwindCSS
- Backend API: Python FastAPI 
- Database: Excel files (halife_products.xlsx)

## Tính năng chính

- 🏠 Trang chủ giới thiệu công ty
- 📦 Danh mục & chi tiết sản phẩm
- 📰 Tin tức & bài viết chuyên môn
- 👥 Trang quản trị nội dung
- 📱 Responsive design

## Cài đặt và Chạy

### Frontend
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Backend API
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```

## Cấu trúc Project

### Root Configuration Files
```
├── .gitignore               # Git ignore rules
├── index.html              # Entry HTML file
├── package.json            # NPM dependencies and scripts
├── vite.config.js          # Vite build configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS plugins configuration
└── jsconfig.json           # JavaScript language configuration
```

### Source Code (`/src`)
```
src/
├── App.vue                 # Root Vue component
├── main.js                 # Vue application entry point
├── assets/                 # Static assets (images, fonts, etc.)
├── components/             # Reusable Vue components
│   ├── Footer.vue
│   ├── Header.vue 
│   ├── Navigation.vue
│   └── ui/                # UI components
├── views/                  # Page components
│   ├── HomeView.vue 
│   ├── ProductsView.vue
│   ├── NewsView.vue
│   └── admin/             # Admin views
├── router/                 # Vue Router configuration
│   └── index.js           # Route definitions
├── utils/                  # Helper functions
│   ├── excelReader.js     # Excel data handling
│   └── productAPI.js      # Product API integration
└── data/                   # Static data files
    ├── products.js
    └── news.js
```

### Backend API (`/api`)
```
api/
├── main.py                 # FastAPI main application
├── excel_api.py           # Excel data handling
├── news_api.py            # News endpoints
└── requirements.txt       # Python dependencies
```

### Public Assets (`/public`)
```
public/
├── favicon.ico
├── robots.txt
├── data/
│   └── halife_products.xlsx   # Product database
└── images/
    ├── products/
    └── news/
```

## Configuration Details

### Environment Variables
```env
# .env.development
VITE_API_URL=http://localhost:8000
VITE_SITE_TITLE=HALIFE ANIMAL HEALTH

# .env.production
VITE_API_URL=https://api.halife.vn
VITE_SITE_TITLE=HALIFE ANIMAL HEALTH
```

### Key Dependencies
```json
{
  "dependencies": {
    "vue": "^3.x",
    "vue-router": "^4.x",
    "tailwindcss": "^3.x",
    "axios": "^1.x"
  }
}
```

### Vite Configuration
```javascript
export default {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000
  }
}
```

### TailwindCSS Theme
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1a5f7a',
        secondary: '#2c88b0'
      }
    }
  }
}
```

## Development

1. Clone repository
2. Install dependencies (npm install)
3. Start dev server (npm run dev)
4. Start API server (cd api && uvicorn main:app --reload)

## Build & Deploy

```bash
# Build frontend
npm run build

# Deploy to production
# Copy dist/ folder to web server
# Start production API server
```

## License

Copyright © 2025 HALIFE ANIMAL HEALTH. All rights reserved.