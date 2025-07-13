// scripts/generateExcel.mjs
// Script để tạo file Excel mẫu cho HALIFE products (ES Module)

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Để sử dụng __dirname trong ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dữ liệu sản phẩm HALIFE từ catalog
const halifeProducts = [
  {
    id: 1,
    name: "BEST PHAGE",
    category: "Thức ăn bổ sung",
    subcategory: "Khoáng chất & Vi sinh vật",
    description: "Thức ăn bổ sung khoáng chất, vi sinh vật có lợi cho gia súc gia cầm",
    full_description: "Xử lý hoàn toàn các vi khuẩn gây bệnh đặc hiệu như Salmonella spp., Escherichia coli và C.perfringens trên gia súc, gia cầm. Cải thiện sức khỏe đường ruột, sản sinh vi khuẩn có lợi, hấp thu thức ăn triệt để, cải thiện FCR.",
    functions: "Xử lý hoàn toàn các vi khuẩn gây bệnh đặc hiệu;Cải thiện sức khỏe đường ruột;Sản sinh vi khuẩn có lợi;Hấp thu thức ăn triệt để;Cải thiện FCR;Sử dụng ở tất cả các giai đoạn của vật nuôi",
    usage_instructions: "Trộn đều vào thức ăn hoặc nước uống theo liều lượng khuyến cáo",
    price: 489000,
    original_price: 520000,
    discount_percent: 6,
    unit: "bộ",
    package_size: "500ml/hộp 2 lọ",
    target_animal: "Gia súc, gia cầm",
    active_ingredients: "Vi sinh vật có lợi, khoáng chất thiết yếu",
    dosage: "Theo hướng dẫn trên bao bì sản phẩm",
    withdrawal_time: "7 ngày",
    storage_conditions: "Nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp, nhiệt độ dưới 25°C",
    shelf_life: "24 tháng kể từ ngày sản xuất",
    manufacturer: "HALIFE Việt Nhật",
    origin_country: "Việt Nam",
    registration_number: "VN-TCCS-001-2025",
    is_featured: true,
    is_bestseller: true,
    in_stock: true,
    stock_quantity: 150,
    rating: 4.8,
    review_count: 45,
    image_url: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=400&fit=crop",
    gallery_images: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop;https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=400&fit=crop;https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=400&fit=crop",
    tags: "vi sinh vật,khoáng chất,gia súc,gia cầm,tiêu hóa,best phage",
    seo_keywords: "best phage,vi sinh vật có lợi,khoáng chất gia súc,halife",
    meta_description: "BEST PHAGE - Bộ sản phẩm thức ăn bổ sung vi sinh vật có lợi và khoáng chất cho gia súc gia cầm từ HALIFE",
    created_date: "2024-01-15",
    updated_date: "2024-12-15",
    status: "active"
  },
  {
    id: 2,
    name: "BOOST PHAGE",
    category: "Thảo dược",
    subcategory: "Tăng cường miễn dịch",
    description: "Thảo dược tự nhiên xử lý tiêu chảy, E.coli, phân xanh, phân vàng, phân trắng",
    full_description: "Tăng lực, kích thích ăn uống trả lại khả năng tiêu hóa, chống cốc, chống stress. Hỗ trợ điều trị vô sinh, tăng khả năng sinh sản, tăng sản lượng trứng, phòng bệnh bại liệt, co giật.",
    functions: "Tăng lực, kích thích ăn uống;Chống cốc, chống stress;Hỗ trợ điều trị vô sinh;Tăng khả năng sinh sản;Tăng sản lượng trứng;Phòng bệnh bại liệt, co giật;Kích thích thèm ăn, tiêu hóa tốt",
    usage_instructions: "1ml/2 lít nước đối với gia cầm, 1ml/1 lít nước hoặc 500gr thức ăn đối với gia súc",
    price: 95000,
    original_price: 120000,
    discount_percent: 21,
    unit: "chai",
    package_size: "100ml",
    target_animal: "Gia súc, gia cầm",
    active_ingredients: "Thảo dược tự nhiên, chiết xuất thực vật",
    dosage: "1ml/2 lít nước (gia cầm), 1ml/1 lít nước (gia súc)",
    withdrawal_time: "3 ngày",
    storage_conditions: "Nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp",
    shelf_life: "24 tháng kể từ ngày sản xuất",
    manufacturer: "HALIFE Việt Nhật",
    origin_country: "Việt Nam",
    registration_number: "VN-TCCS-002-2025",
    is_featured: true,
    is_bestseller: false,
    in_stock: true,
    stock_quantity: 200,
    rating: 4.6,
    review_count: 32,
    image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
    gallery_images: "https://images.unsplash.com/photo-1585435557343-3b092031d4cc?w=400&h=400&fit=crop;https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    tags: "thảo dược,tiêu chảy,e.coli,miễn dịch,boost phage",
    seo_keywords: "boost phage,thảo dược tự nhiên,chống tiêu chảy,halife",
    meta_description: "BOOST PHAGE - Thảo dược tự nhiên điều trị tiêu chảy và tăng cường miễn dịch cho gia súc gia cầm",
    created_date: "2024-01-20",
    updated_date: "2024-12-15",
    status: "active"
  },
  {
    id: 3,
    name: "GOOD SET",
    category: "Bộ sản phẩm",
    subcategory: "Cử ly tối ưu",
    description: "Cử ly tối ưu hô hấp, viêm phổi",
    full_description: "Phòng và trị bệnh viêm đường hô hấp phức hợp. Phòng và trị bệnh viêm phổi, xuyến, tụ huyết trùng, viêm teo xoang mũi. Phòng các bệnh bội nhiễm và kê phát.",
    functions: "Phòng và trị bệnh viêm đường hô hấp phức hợp;Phòng và trị bệnh viêm phổi, xuyến, tụ huyết trùng;Viêm teo xoang mũi;Phòng các bệnh bội nhiễm và kê phát",
    usage_instructions: "Theo hướng dẫn của bác sĩ thú y hoặc nhãn sản phẩm",
    price: 550000,
    original_price: 650000,
    discount_percent: 15,
    unit: "bộ",
    package_size: "250ml/hộp 2 lọ",
    target_animal: "Heo, gia súc",
    active_ingredients: "Hoạt chất kháng sinh, chống viêm",
    dosage: "Theo chỉ định bác sĩ thú y",
    withdrawal_time: "14 ngày",
    storage_conditions: "Nơi khô ráo, thoáng mát, nhiệt độ dưới 25°C",
    shelf_life: "24 tháng kể từ ngày sản xuất",
    manufacturer: "HALIFE Việt Nhật",
    origin_country: "Việt Nam",
    registration_number: "VN-TCCS-003-2025",
    is_featured: true,
    is_bestseller: true,
    in_stock: true,
    stock_quantity: 80,
    rating: 4.7,
    review_count: 28,
    image_url: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb55bb?w=400&h=400&fit=crop",
    gallery_images: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    tags: "hô hấp,viêm phổi,kháng sinh,good set",
    seo_keywords: "good set,viêm phổi,hô hấp,halife",
    meta_description: "GOOD SET - Bộ sản phẩm cử ly tối ưu điều trị viêm đường hô hấp và viêm phổi cho gia súc",
    created_date: "2024-02-01",
    updated_date: "2024-12-15",
    status: "active"
  },
  {
    id: 4,
    name: "WINFLO LA",
    category: "Thuốc kháng sinh",
    subcategory: "Điều trị nhiễm khuẩn",
    description: "Kháng sinh điều trị viêm phổi, nhiễm khuẩn đường ruột, E.coli, lepto",
    full_description: "Bao trị nhiễm khuẩn đường ruột, phổ thường hạn, E.coli, lepto, viêm phổi hóa mủ, viêm phổi định sướn, hô suyển, tụ huyết trùng, hồng ký, viêm ruột cấp.",
    functions: "Bao trị nhiễm khuẩn đường ruột;Phổ thường hạn, E.coli, lepto;Viêm phổi hóa mủ, định sướn;Hô suyển, tụ huyết trùng;Viêm ruột cấp, viêm vú, viêm tử cung",
    usage_instructions: "1ml/20-35kg thể trọng cho heo. 1ml/45-50kg thể trọng cho trâu bò. 1ml/20kg thể trọng cho gia cầm",
    price: 280000,
    original_price: 320000,
    discount_percent: 13,
    unit: "lọ",
    package_size: "100ml",
    target_animal: "Heo, trâu bò, gia cầm",
    active_ingredients: "Florfenicol, excipients",
    dosage: "1ml/20-35kg (heo), 1ml/45-50kg (trâu bò), 1ml/20kg (gia cầm)",
    withdrawal_time: "14-21 ngày",
    storage_conditions: "Nơi khô ráo, thoáng mát, tránh ánh sáng",
    shelf_life: "24 tháng kể từ ngày sản xuất",
    manufacturer: "HALIFE Việt Nhật",
    origin_country: "Việt Nam",
    registration_number: "VN-TCCS-004-2025",
    is_featured: false,
    is_bestseller: true,
    in_stock: true,
    stock_quantity: 120,
    rating: 4.5,
    review_count: 38,
    image_url: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=400&fit=crop",
    gallery_images: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
    tags: "kháng sinh,florfenicol,nhiễm khuẩn,winflo la",
    seo_keywords: "winflo la,kháng sinh,florfenicol,halife",
    meta_description: "WINFLO LA - Thuốc kháng sinh điều trị nhiễm khuẩn đường ruột và hô hấp cho gia súc gia cầm",
    created_date: "2024-02-05",
    updated_date: "2024-12-15",
    status: "active"
  },
  {
    id: 5,
    name: "ANPHA NEW",
    category: "Thuốc kháng sinh",
    subcategory: "Điều trị nhiễm khuẩn",
    description: "Kháng sinh điều trị nhiễm khuẩn hô hấp, tiêu hóa, sinh dục",
    full_description: "Đặc trị viêm phổi, viêm màng phổi, viêm phổi hóa mủ, phổi định sướn, hô suyển, lepto, tụ huyết trùng trên gia súc, điều trị nhiễm trùng do vi khuẩn nhạy cảm.",
    functions: "Đặc trị viêm phổi, viêm màng phổi;Viêm phổi hóa mủ, định sướn;Hô suyển, lepto, tụ huyết trùng;Điều trị nhiễm trùng do vi khuẩn;CRD ghép E.coli",
    usage_instructions: "Nếu bệnh nặng ngay tiêm 1 lần với liều: 1ml/15-20kg thể trọng",
    price: 190000,
    original_price: 220000,
    discount_percent: 14,
    unit: "lọ",
    package_size: "100ml",
    target_animal: "Gia súc, gia cầm",
    active_ingredients: "Enrofloxacin, excipients",
    dosage: "1ml/15-20kg thể trọng",
    withdrawal_time: "14 ngày",
    storage_conditions: "Nơi khô ráo, thoáng mát, tránh ánh sáng",
    shelf_life: "24 tháng kể từ ngày sản xuất",
    manufacturer: "HALIFE Việt Nhật",
    origin_country: "Việt Nam",
    registration_number: "VN-TCCS-005-2025",
    is_featured: false,
    is_bestseller: false,
    in_stock: true,
    stock_quantity: 95,
    rating: 4.4,
    review_count: 25,
    image_url: "https://images.unsplash.com/photo-1585435557343-3b092031d4cc?w=400&h=400&fit=crop",
    gallery_images: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=400&fit=crop",
    tags: "enrofloxacin,kháng sinh,viêm phổi,anpha new",
    seo_keywords: "anpha new,enrofloxacin,kháng sinh,halife",
    meta_description: "ANPHA NEW - Thuốc kháng sinh chứa Enrofloxacin điều trị nhiễm khuẩn hô hấp và tiêu hóa",
    created_date: "2024-02-10",
    updated_date: "2024-12-15",
    status: "active"
  }
];

// Danh mục sản phẩm
const categories = [
  {
    id: 1,
    name: "Thuốc kháng sinh",
    slug: "thuoc-khang-sinh",
    description: "Các loại thuốc kháng sinh điều trị nhiễm khuẩn",
    icon: "fas fa-pills",
    parent_id: null,
    sort_order: 1,
    is_active: true,
    created_date: "2024-01-01",
    updated_date: "2024-12-15"
  },
  {
    id: 2,
    name: "Vitamin & khoáng chất",
    slug: "vitamin-khoang-chat",
    description: "Bổ sung vitamin và khoáng chất thiết yếu",
    icon: "fas fa-prescription-bottle",
    parent_id: null,
    sort_order: 2,
    is_active: true,
    created_date: "2024-01-01",
    updated_date: "2024-12-15"
  },
  {
    id: 3,
    name: "Thức ăn bổ sung",
    slug: "thuc-an-bo-sung",
    description: "Các sản phẩm thức ăn bổ sung dinh dưỡng",
    icon: "fas fa-leaf",
    parent_id: null,
    sort_order: 3,
    is_active: true,
    created_date: "2024-01-01",
    updated_date: "2024-12-15"
  },
  {
    id: 4,
    name: "Thảo dược",
    slug: "thao-duoc",
    description: "Sản phẩm từ thảo dược tự nhiên",
    icon: "fas fa-seedling",
    parent_id: null,
    sort_order: 4,
    is_active: true,
    created_date: "2024-01-01",
    updated_date: "2024-12-15"
  },
  {
    id: 5,
    name: "Bộ sản phẩm",
    slug: "bo-san-pham",
    description: "Bộ sản phẩm kết hợp đa công dụng",
    icon: "fas fa-box-open",
    parent_id: null,
    sort_order: 5,
    is_active: true,
    created_date: "2024-01-01",
    updated_date: "2024-12-15"
  }
];

// Template cho sản phẩm mới
const templateData = [{
  id: "",
  name: "Tên sản phẩm",
  category: "Danh mục",
  subcategory: "Danh mục con",
  description: "Mô tả ngắn",
  full_description: "Mô tả đầy đủ",
  functions: "Công dụng chi tiết (phân cách bằng ;)",
  usage_instructions: "Hướng dẫn sử dụng",
  price: 0,
  original_price: 0,
  discount_percent: 0,
  unit: "chai/lọ/gói/kg",
  package_size: "Quy cách",
  target_animal: "Đối tượng sử dụng",
  active_ingredients: "Thành phần hoạt chất",
  dosage: "Liều lượng",
  withdrawal_time: "Thời gian ngưng thuốc",
  storage_conditions: "Điều kiện bảo quản",
  shelf_life: "Hạn sử dụng",
  manufacturer: "HALIFE Việt Nhật",
  origin_country: "Việt Nam",
  registration_number: "Số đăng ký",
  is_featured: false,
  is_bestseller: false,
  in_stock: true,
  stock_quantity: 0,
  rating: 0,
  review_count: 0,
  image_url: "URL hình ảnh chính",
  gallery_images: "URL hình ảnh phụ (phân cách bằng ;)",
  tags: "Tags tìm kiếm (phân cách bằng ,)",
  seo_keywords: "Từ khóa SEO",
  meta_description: "Meta description",
  created_date: new Date().toISOString().split('T')[0],
  updated_date: new Date().toISOString().split('T')[0],
  status: "active"
}];

// Function tạo file Excel
function generateExcelFile() {
  try {
    console.log('🔄 Đang tạo file Excel...');
    
    // Tạo workbook mới
    const workbook = XLSX.utils.book_new();
    
    // Sheet 1: Products
    const productsSheet = XLSX.utils.json_to_sheet(halifeProducts);
    XLSX.utils.book_append_sheet(workbook, productsSheet, "Products");
    
    // Sheet 2: Categories
    const categoriesSheet = XLSX.utils.json_to_sheet(categories);
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, "Categories");
    
    // Sheet 3: Template
    const templateSheet = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(workbook, templateSheet, "Template");
    
    // Tạo thư mục public/data nếu chưa có
    const outputDir = path.join(__dirname, '../public/data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log('📁 Đã tạo thư mục public/data');
    }
    
    // Ghi file
    const outputPath = path.join(outputDir, 'halife_products.xlsx');
    XLSX.writeFile(workbook, outputPath);
    
    console.log('✅ File Excel đã được tạo thành công tại:', outputPath);
    console.log('📊 Nội dung file:');
    console.log(`   - ${halifeProducts.length} sản phẩm`);
    console.log(`   - ${categories.length} danh mục`);
    console.log('   - 1 template để thêm sản phẩm mới');
    console.log('');
    console.log('🎯 Bước tiếp theo:');
    console.log('   1. Kiểm tra file tại: public/data/halife_products.xlsx');
    console.log('   2. Chỉnh sửa dữ liệu trong Excel nếu cần');
    console.log('   3. Chạy ứng dụng để test: npm run dev');
    
  } catch (error) {
    console.error('❌ Lỗi tạo file Excel:', error);
    process.exit(1);
  }
}

// Chạy function
generateExcelFile();