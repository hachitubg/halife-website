# 📋 Hướng Dẫn Quản Lý Sản Phẩm Tâm Vet

## 🚀 Bắt Đầu Nhanh

1. **Truy cập trang quản lý:** `/admin/tamvet-products`
2. **File Excel đã được tạo tại:** `public/data/tamvet_product.xlsx`
3. **File chứa:**
   - **Sheet "Products"**: 3 sản phẩm mẫu
   - **Sheet "Categories"**: 6 danh mục sản phẩm
   - **Sheet "Hướng dẫn"**: Hướng dẫn chi tiết

---

## 📊 Cấu Trúc File Excel

### Sheet "Products" (Bắt buộc)

| Cột | Kiểu Dữ Liệu | Bắt Buộc | Ghi Chú |
|-----|-------------|---------|--------|
| id | Text | ✅ | Mã sản phẩm duy nhất (VD: TAMVET001) |
| name | Text | ✅ | Tên sản phẩm |
| category | Text | ✅ | Danh mục (phải khớp với Categories sheet) |
| price | Number | ✅ | Giá bán (VND) |
| originalPrice | Number | ❌ | Giá gốc để tính chiết khấu |
| description | Text | ❌ | Mô tả ngắn (1-2 dòng) |
| fullDescription | Text | ❌ | Mô tả chi tiết (dài hơn) |
| image | Text | ❌ | Đường dẫn ảnh (VD: /images/products/xxx.jpg) |
| inStock | TRUE/FALSE | ✅ | TRUE = Còn hàng, FALSE = Hết hàng |
| featured | TRUE/FALSE | ❌ | TRUE = Sản phẩm nổi bật |
| packageSize | Text | ❌ | Kích thước gói (VD: 10 vỉ/hộp) |
| stockQuantity | Number | ❌ | Số lượng tồn kho |
| targetAnimal | Text | ❌ | Đối tượng sử dụng (VD: Chó, Mèo, Gia súc) |
| manufacturer | Text | ❌ | Nhà sản xuất (mặc định: Tâm Vet) |
| originCountry | Text | ❌ | Quốc gia xuất xứ |
| registrationNumber | Text | ❌ | Số đăng ký lưu hành |
| activeIngredients | Text | ❌ | Thành phần hoạt chất |
| dosage | Text | ❌ | Liều dùng |
| usageInstructions | Text | ❌ | Hướng dẫn sử dụng |
| warnings | Text | ❌ | Chống chỉ định & cảnh báo |
| storageConditions | Text | ❌ | Điều kiện bảo quản |
| rating | Number | ❌ | Đánh giá (0-5) |
| reviewCount | Number | ❌ | Số lượng đánh giá |
| tags | Text | ❌ | Tags phân cách bằng dấu ";" |
| functions | Text | ❌ | Chức năng phân cách bằng dấu ";" |

### Sheet "Categories" (Tùy chọn)

| Cột | Kiểu Dữ Liệu | Bắt Buộc | Ghi Chú |
|-----|-------------|---------|--------|
| id | Number | ✅ | ID danh mục (1, 2, 3...) |
| name | Text | ✅ | Tên danh mục |

**Danh mục mẫu:**
- Thuốc Thú Cưng
- Thuốc Gia Súc
- Chế Phẩm Sinh Học
- Vitamin & Thực Phẩm Chức Năng
- Thiết Bị Y Tế
- Gia Cầm

---

## ⚙️ Các Thao Tác Chính

### 1. 🔍 Tìm Kiếm & Lọc
- **Tìm kiếm:** Nhập tên hoặc mã sản phẩm
- **Lọc theo danh mục:** Chọn từ dropdown
- **Lọc theo trạng thái:** Còn hàng / Hết hàng
- **Lọc sản phẩm nổi bật:** ⭐ Sản phẩm nổi bật / Thường

### 2. ➕ Thêm Sản Phẩm Mới
1. Click nút "Thêm sản phẩm"
2. Điền thông tin cơ bản (tab "Cơ bản")
3. Thêm mô tả chi tiết (tab "Chi tiết")
4. Upload hình ảnh bổ sung (tab "Khác")
5. Click "Thêm mới"

### 3. ✏️ Sửa Sản Phẩm
1. Click icon "Sửa" (✏️) trên hàng sản phẩm
2. Hoặc click "Xem chi tiết" → "Sửa"
3. Chỉnh sửa thông tin
4. Click "Cập nhật"

### 4. 🗑️ Xóa Sản Phẩm
1. Click icon "Xóa" (🗑️) trên hàng sản phẩm
2. Xác nhận xóa

### 5. 📥 Upload File Excel Mới
1. Click nút "Upload" (📤)
2. Chọn file .xlsx
3. File sẽ được tải lên và dữ liệu được cập nhật

### 6. 📤 Tải Xuống Excel
1. Click nút tải xuống (📥)
2. File Excel sẽ được tải về máy

### 7. 🔄 Reload Dữ Liệu
1. Click nút "Reload Excel"
2. Dữ liệu sẽ được tải lại từ file Excel

---

## 📝 Ví Dụ Dữ Liệu

```
id: TAMVET001
name: Thuốc Kháng Sinh Amoxicillin 500mg
category: Thuốc Thú Cưng
price: 45000
originalPrice: 50000
description: Thuốc kháng sinh hiệu quả điều trị các bệnh nhiễm khuẩn
fullDescription: Amoxicillin 500mg là thuốc kháng sinh beta-lactam có hiệu quả cao...
image: /images/products/amoxicillin.jpg
inStock: TRUE
featured: TRUE
packageSize: 10 vỉ/hộp
stockQuantity: 150
targetAnimal: Chó, Mèo, Gia súc
manufacturer: Tâm Vet
originCountry: Việt Nam
registrationNumber: VN123456
activeIngredients: Amoxicillin trihydrate 500mg
dosage: Chó: 20-40mg/kg, Mèo: 15-25mg/kg
usageInstructions: Uống sau ăn 2-3 lần/ngày
warnings: Không sử dụng với thú có dị ứng penicillin
storageConditions: Bảo quản nơi khô ráo, nhiệt độ 15-25°C
rating: 4.5
reviewCount: 32
tags: kháng sinh;nhiễm khuẩn;chó;mèo
functions: Kháng khuẩn;Diệt vi khuẩn
```

---

## 🔧 Xử Lý Lỗi

### ❌ "Lỗi tải dữ liệu: Không tìm thấy sheet Products"
**Nguyên nhân:** Sheet không tồn tại hoặc tên sai
**Giải pháp:** 
- Đảm bảo sheet được đặt tên chính xác: "Products"
- Kiểm tra cách viết hoa/thường
- Chọn sheet "Hướng dẫn" để xem hướng dẫn

### ❌ "File Excel không hợp lệ"
**Nguyên nhân:** File không phải Excel hoặc bị hỏng
**Giải pháp:**
- Lưu file dưới định dạng .xlsx (Excel 2007+)
- Không lưu dưới .xls hoặc CSV
- Mở file bằng Excel để kiểm tra

### ❌ "Chưa có sản phẩm nào"
**Nguyên nhân:** File Excel rỗng hoặc Sheet chưa có dữ liệu
**Giải pháp:**
- Thêm dữ liệu vào Sheet "Products"
- Click "Reload Excel" để cập nhật
- Hoặc sử dụng nút "Thêm sản phẩm" để thêm thủ công

---

## 💡 Mẹo Hữu Ích

✅ **Giữ file Excel mở:** Bạn có thể chỉnh sửa file Excel lúc đang sử dụng website (không cần đóng tab)

✅ **Tạo backup:** Tải xuống file Excel định kỳ để có bản sao lưu

✅ **Sử dụng Reload:** Sau khi chỉnh sửa file Excel, click "Reload Excel" để cập nhật ngay

✅ **Thêm tags:** Sử dụng dấu ";" để phân cách nhiều tags: `kháng sinh;vitamin;chất lượng`

✅ **Tìm kiếm nhanh:** Nhập mã sản phẩm (ID) để tìm kiếm chính xác

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra file Excel có tồn tại tại `public/data/tamvet_product.xlsx`
2. Xem lại cấu trúc sheet và cột
3. Thử tải lại trang (F5)
4. Kiểm tra console (F12 → Console) để xem thông báo lỗi chi tiết
