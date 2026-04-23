# HALIFE Website - Project Rules & Tech Stack

## Thông tin dự án

- **Tên website:** HALIFE ANIMAL HEALTH
- **Tên miền:** halife.vn
- **Lĩnh vực:** Thuốc thú y, thủy sản, sản phẩm chăn nuôi
- **Mục tiêu:** Website giới thiệu doanh nghiệp, trưng bày sản phẩm, đăng tin tức, hỗ trợ quản trị nội dung nội bộ và tối ưu SEO

---

## Tech Stack

> Tài liệu này mô tả định hướng kỹ thuật cần dùng cho dự án này. Không dùng Payload CMS, không lưu dữ liệu bằng Excel/JSON, và không deploy bằng Docker.

| Layer | Công nghệ |
|---|---|
| Frontend | Vue 3 + Vite + Vue Router |
| UI | Tailwind CSS |
| Backend API | Flask + Flask-CORS |
| Database | PostgreSQL |
| Data access | SQLAlchemy hoặc psycopg + query layer rõ ràng |
| Process manager | PM2 |
| Reverse proxy | Nginx |
| Runtime | Node.js 20+ + Python 3 |

### Định hướng backend

- Không dùng CMS nặng như Payload
- Ưu tiên backend nhẹ, dễ bảo trì:
  - `Flask` cho API và admin logic
  - `PostgreSQL` cho dữ liệu chính thức
  - lưu ảnh trong `public/` hoặc thư mục upload riêng trên server
- Admin là **custom admin pages trong frontend**, không phải CMS riêng

---

## Quy tắc chung

- Giữ hướng công nghệ: **Vue 3 + Vite + JavaScript + Tailwind + Flask + PostgreSQL**
- Không chuyển dự án sang Next.js / React / Payload CMS nếu không có quyết định kiến trúc mới
- Frontend hiện theo JavaScript; chỉ migrate sang TypeScript khi có kế hoạch đồng bộ
- Không dùng Excel/JSON làm nguồn dữ liệu chính cho sản phẩm, tin tức, banner
- Không dùng Docker cho flow deploy chính thức
- Nội dung mặc định trên website là **Tiếng Việt**

---

## Kiến trúc dự án

### Frontend

- SPA chạy bằng `Vue 3` và `Vue Router`
- SEO cơ bản xử lý qua router/meta:
  - `document.title`
  - `meta description`
  - `canonical URL`
- Các trang admin là view nội bộ trong frontend:
  - `/admin`
  - `/admin/products`
  - `/admin/news`
  - `/admin/banners`
  - `/admin/tamvet-products`

### Backend

- Backend là `Flask API`
- API phục vụ:
  - CRUD sản phẩm HALIFE
  - CRUD sản phẩm Tâm Vet
  - CRUD tin tức
  - quản lý banner homepage
  - quản lý popup banner
  - upload/xóa ảnh
  - auth admin nếu triển khai
- Toàn bộ dữ liệu nghiệp vụ phải lưu trong `PostgreSQL`

### Database

- Dùng `PostgreSQL` làm nguồn dữ liệu chuẩn
- Ưu tiên tách schema rõ ràng theo domain:
  - `products`
  - `categories`
  - `news`
  - `banners`
  - `popup_banners`
  - `users`
- Có migration rõ ràng nếu thay đổi schema

---

## Cấu trúc thư mục đề xuất

```text
/
├── src/
│   ├── assets/                 # CSS, logo, static assets dùng trong app
│   ├── components/             # Reusable Vue components
│   ├── router/                 # Vue Router config
│   ├── utils/                  # API clients, helpers
│   ├── views/                  # Public views và admin views
│   ├── App.vue
│   └── main.js
├── api/
│   ├── app/                    # Flask app modules
│   │   ├── routes/             # API routes theo domain
│   │   ├── models/             # SQLAlchemy models
│   │   ├── services/           # Business logic
│   │   ├── db/                 # DB connection, session, migrations
│   │   └── utils/              # Helpers
│   ├── uploads/                # Uploaded images/files
│   ├── run.py                  # Entry point backend
│   └── requirements.txt
├── public/
│   └── images/                 # Static public images
├── ecosystem.config.cjs        # PM2 config
├── nginx.conf                  # Nginx reverse proxy config
├── package.json
└── CLAUDE.md
```

---

## Các phần chức năng chính

### Website public

- Trang chủ
- Giới thiệu doanh nghiệp
- Danh sách sản phẩm
- Chi tiết sản phẩm
- Danh sách tin tức
- Chi tiết bài viết
- Trang liên hệ

### Admin nội bộ

- Quản lý sản phẩm HALIFE
- Quản lý sản phẩm Tâm Vet
- Quản lý banner homepage
- Quản lý popup banner
- Quản lý tin tức

> `meta.requiresAuth` hiện mới là mức route meta. Nếu dùng admin thực tế thì phải có auth backend + session/token đầy đủ.

---

## Luồng dữ liệu

### Sản phẩm

```text
Admin/Public View -> src/utils/*API.js -> Flask API -> PostgreSQL
```

### Tin tức

```text
Admin/Public View -> Flask API -> PostgreSQL
```

### Banner

```text
Admin View -> Flask API -> PostgreSQL + uploaded images
```

---

## Quy ước code

### Frontend

- Dùng `Vue 3` SFC (`.vue`)
- Router nằm trong `src/router/index.js`
- API client nằm trong `src/utils/`
- Page-level component nằm trong `src/views/`
- Component dùng lại nhiều lần đặt trong `src/components/`
- Alias import: `@` trỏ tới `src/`

### Backend

- Tách module backend theo domain, không dồn toàn bộ vào một file lớn
- Khuyến nghị cấu trúc:
  - route layer
  - service layer
  - repository/query layer
  - model layer
- Không viết SQL rải rác trong route handlers nếu có thể gom vào service/repository
- Dùng migration cho thay đổi schema

### Naming

- JavaScript variables/functions: `camelCase`
- Vue component files: `PascalCase.vue`
- Database tables: `snake_case`
- API endpoints: prefix `/api/...`

---

## Database Rules

- `PostgreSQL` là nguồn dữ liệu duy nhất cho dữ liệu nghiệp vụ
- Không dùng Excel làm database tạm
- Không dùng JSON file để thay cho bảng dữ liệu chính
- Có migration/versioning cho schema
- Có index cho các field tìm kiếm/lọc quan trọng
- Tách quan hệ dữ liệu rõ ràng:
  - product -> category
  - news -> category nếu cần
  - banner -> image asset

### Gợi ý bảng chính

- `categories`
- `products`
- `news`
- `banners`
- `popup_banners`
- `users`
- `media` hoặc `uploads` nếu cần quản lý file chặt hơn

---

## Uploads và media

- File ảnh không lưu trực tiếp trong database dưới dạng binary nếu không cần thiết
- Chỉ lưu trong database:
  - đường dẫn file
  - alt text
  - metadata cần thiết
- File thật lưu trên server trong thư mục upload riêng hoặc public assets

---

## SEO

- SPA nên SEO mặc định chỉ ở mức cơ bản
- Mỗi route cần có:
  - `title`
  - `description`
  - `canonical`
- Nếu SEO trở thành ưu tiên rất cao sau này, có thể đánh giá SSR/SSG riêng, nhưng không đổi stack trong giai đoạn này

---

## Environment Variables

### Frontend

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Backend

```env
DATABASE_URL=postgresql://username:password@127.0.0.1:5432/halife
SECRET_KEY=your-secret-key
UPLOAD_DIR=/var/www/halife-website/uploads
```

---

## Commands hay dùng

### Frontend

```bash
npm install
npm run dev
npm run build
npm run preview
```

### Backend

```bash
cd api
pip install -r requirements.txt
python run.py
```

### PM2

```bash
pm2 start ecosystem.config.cjs
pm2 restart halife-frontend
pm2 restart halife-backend
pm2 logs
pm2 save
pm2 startup
```

### Database

```bash
psql -U postgres
createdb halife
```

---

## Deploy

### Development

- Frontend chạy bằng `Vite dev server`
- Backend chạy bằng `Flask`
- PostgreSQL chạy local hoặc trên server dev
- Frontend gọi API qua `VITE_API_URL`

### Production

- Build frontend ra `dist/`
- Chạy frontend bằng `PM2` với static server hoặc web server phù hợp
- Chạy backend Flask bằng `PM2`
- Dùng `Nginx` reverse proxy:
  - `/` -> frontend
  - `/api/` -> backend
  - `/uploads/` hoặc `/images/` -> static files
- PostgreSQL chạy trực tiếp trên VPS hoặc server database riêng

### PM2 deploy approach

- Một process cho frontend
- Một process cho backend
- `Nginx` làm SSL termination và reverse proxy
- Không dùng Docker Compose cho production flow

---

## Những thứ không nên làm

- Không thêm Payload CMS, Strapi hoặc CMS nặng nếu chưa có yêu cầu rõ ràng
- Không lưu sản phẩm/tin tức/banner bằng Excel hoặc JSON file
- Không hardcode connection string trong source code
- Không viết backend kiểu monolith một file quá lớn
- Không bỏ qua migration khi sửa schema
- Không public admin route ra internet mà không có auth
- Không dùng Docker làm cách deploy chuẩn cho dự án này

---

## Ưu tiên khi phát triển tiếp

1. Chuẩn hóa schema PostgreSQL cho toàn bộ domain chính
2. Tách backend thành module rõ ràng
3. Bổ sung authentication cho admin
4. Chuẩn hóa upload/media handling
5. Viết migration và seed data cơ bản
6. Hoàn thiện PM2 + Nginx deploy flow trên VPS

---

## Kết luận

Đây là dự án website doanh nghiệp/catalog sản phẩm sử dụng:

- **Frontend:** Vue 3 + Vite + Tailwind
- **Backend:** Flask nhẹ, custom API
- **Database:** PostgreSQL
- **Deploy:** PM2 + Nginx trên VPS

Tài liệu này là chuẩn kỹ thuật cần theo cho các thay đổi tiếp theo của dự án.
