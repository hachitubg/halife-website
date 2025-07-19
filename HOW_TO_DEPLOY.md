# HƯỚNG DẪN DOCKER DEPLOY - HALIFE PROJECT

## 🚀 Workflow Deploy

### 1. Code trên local → Push GitHub → Deploy VPS
```bash
# Trên local (Windows)
git add .
git commit -m "Update frontend/backend"
git push origin main

# Trên VPS
cd /var/www/halife-website
git pull origin main
```

### 2. Deploy Frontend (sau khi sửa Vue.js)
```bash
# Stop containers
docker-compose down

# Rebuild frontend
docker-compose build frontend

# Start lại
docker-compose up -d

# Hoặc rebuild tất cả
docker-compose up -d --build
```

### 3. Deploy Backend (sau khi sửa Python)
```bash
# Rebuild backend only
docker-compose build backend
docker-compose up -d
```

---

## 🐳 Các lệnh Docker thường dùng

### Quản lý containers
```bash
# Xem containers đang chạy
docker ps

# Xem logs
docker-compose logs
docker-compose logs frontend
docker-compose logs backend

# Stop tất cả
docker-compose down

# Start tất cả
docker-compose up -d

# Restart service cụ thể
docker-compose restart frontend
```

### Quản lý images
```bash
# Xem images
docker images

# Xóa image cũ (trước khi rebuild)
docker rmi halife-website_frontend
docker rmi halife-website_backend

# Xóa images không dùng
docker image prune -f
```

### Debug
```bash
# Vào container để debug
docker exec -it halife-frontend sh
docker exec -it halife-backend bash

# Test API
curl http://14.225.212.44:8000/api/
curl http://14.225.212.44:3000
```

---

## 📁 Cấu trúc files Docker

```
halife-website/
├── Dockerfile              # Frontend Docker
├── docker-compose.yml      # Orchestration
├── nginx.conf              # Nginx config
├── .dockerignore           # Ignore files
├── api/
│   └── Dockerfile          # Backend Docker
└── .github/workflows/
    └── deploy.yml          # GitHub Actions
```

---

## 🔄 Các tình huống thường gặp

### Sửa frontend (Vue.js)
```bash
git pull origin main
docker-compose build frontend
docker-compose up -d
```

### Sửa backend (Python)
```bash
git pull origin main  
docker-compose build backend
docker-compose up -d
```

### Sửa nginx config
```bash
git pull origin main
docker-compose restart nginx
```

### Sửa docker-compose.yml
```bash
git pull origin main
docker-compose down
docker-compose up -d
```

### Backend bị crash
```bash
# Xem logs
docker-compose logs backend

# Restart
docker-compose restart backend

# Nếu vẫn lỗi, rebuild
docker-compose build --no-cache backend
docker-compose up -d
```

---

## 🚨 Troubleshooting

### Port bị chiếm
```bash
# Kiểm tra process nào dùng port 80
sudo lsof -i :80

# Stop nginx system nếu conflict
sudo systemctl stop nginx
```

### Container không start
```bash
# Xem logs chi tiết
docker-compose logs [service_name]

# Rebuild từ đầu
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Disk đầy
```bash
# Dọn dẹp Docker
docker system prune -a
docker volume prune
```

---

## 🔧 GitHub Actions Auto Deploy

### Setup (chỉ làm 1 lần)
1. Tạo SSH key trên VPS:
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/id_rsa  # Copy private key
```

2. Thêm secrets vào GitHub:
- `HOST`: 14.225.212.44
- `USERNAME`: root  
- `PRIVATE_KEY`: private key từ bước 1

### Auto deploy khi push code
Chỉ cần push code lên GitHub, website sẽ tự động deploy!

---

## 📋 Quick Commands

```bash
# Deploy nhanh (sau khi push GitHub)
cd /var/www/halife-website && git pull origin main && docker-compose up -d --build

# Restart tất cả
docker-compose restart

# Xem website
curl http://14.225.212.44

# Xem status
docker ps && docker-compose logs --tail=5
```

---

---

## 📋 Github

```bash
git reset --hard HEAD
git clean -d -f
```

---

## 🌐 URLs

- **Website**: http://14.225.212.44
- **Frontend direct**: http://14.225.212.44:3000  
- **Backend API**: http://14.225.212.44:8000/api/
- **GitHub**: https://github.com/hachitubg/halife-website

---

**Lưu ý**: Luôn `git pull` trước khi rebuild Docker!