// Script tạo file Excel template cho Tâm Vet
// Chạy script này trong Node.js hoặc copy dữ liệu vào Excel thủ công

const XLSX = require('xlsx');

// Dữ liệu mẫu
const sampleData = [
  {
    id: 'TAMVET001',
    name: 'Thuốc Kháng Sinh Amoxicillin 500mg',
    category: 'Thuốc Thú Cưng',
    price: 45000,
    originalPrice: 50000,
    description: 'Thuốc kháng sinh hiệu quả điều trị các bệnh nhiễm khuẩn',
    fullDescription: 'Amoxicillin 500mg là thuốc kháng sinh beta-lactam có hiệu quả cao trong điều trị các bệnh nhiễm khuẩn ở động vật. Có tác dụng diệt khuẩn và có phạm vi hoạt động rộng.',
    image: '/images/products/amoxicillin.jpg',
    inStock: true,
    featured: true,
    packageSize: '10 vỉ/hộp',
    stockQuantity: 150,
    targetAnimal: 'Chó, Mèo, Gia súc',
    manufacturer: 'Tâm Vet',
    originCountry: 'Việt Nam',
    registrationNumber: 'VN123456',
    activeIngredients: 'Amoxicillin trihydrate 500mg',
    dosage: 'Chó: 20-40mg/kg, Mèo: 15-25mg/kg',
    usageInstructions: 'Uống sau ăn 2-3 lần/ngày',
    warnings: 'Không sử dụng với thú có dị ứng penicillin',
    storageConditions: 'Bảo quản nơi khô ráo, nhiệt độ 15-25°C',
    rating: 4.5,
    reviewCount: 32,
    tags: 'kháng sinh; nhiễm khuẩn; chó; mèo',
    functions: 'Kháng khuẩn; Diệt vi khuẩn'
  },
  {
    id: 'TAMVET002',
    name: 'Vitamin B Complex Cho Gia Súc',
    category: 'Vitamin & Thực Phẩm Chức Năng',
    price: 65000,
    originalPrice: 75000,
    description: 'Bổ sung vitamin B giúp tăng sức đề kháng cho gia súc',
    fullDescription: 'Vitamin B Complex là một sản phẩm bổ sung vitamin nhóm B toàn diện, giúp cải thiện sức khỏe tổng thể, tăng sức đề kháng và hỗ trợ tăng trọng cho gia súc.',
    image: '/images/products/vitamin-b.jpg',
    inStock: true,
    featured: false,
    packageSize: '100ml/chai',
    stockQuantity: 200,
    targetAnimal: 'Gia súc',
    manufacturer: 'Tâm Vet',
    originCountry: 'Việt Nam',
    registrationNumber: 'VN123457',
    activeIngredients: 'Thiamine, Riboflavin, Niacin, Pyridoxine',
    dosage: '5-10ml/ngày/đầu gia súc',
    usageInstructions: 'Trộn vào thức ăn hoặc cho uống trực tiếp',
    warnings: 'Bảo quản trong nơi mát mẻ, tránh ánh sáng',
    storageConditions: 'Bảo quản ở 2-8°C',
    rating: 4.2,
    reviewCount: 18,
    tags: 'vitamin; bổ sung; gia súc',
    functions: 'Tăng sức đề kháng; Cải thiện sức khỏe'
  },
  {
    id: 'TAMVET003',
    name: 'Chế Phẩm Vi Sinh Tăng Tiêu Hóa',
    category: 'Chế Phẩm Sinh Học',
    price: 85000,
    originalPrice: 95000,
    description: 'Chế phẩm vi sinh giúp cân bằng hệ tiêu hóa',
    fullDescription: 'Chế phẩm này chứa các chủng vi sinh lợi ích giúp cân bằng hệ vi sinh đường ruột, cải thiện tiêu hóa và hấp thụ dưỡng chất tốt hơn.',
    image: '/images/products/probiotic.jpg',
    inStock: true,
    featured: true,
    packageSize: '500g/kg',
    stockQuantity: 120,
    targetAnimal: 'Gia cầm, Gia súc, Cá',
    manufacturer: 'Tâm Vet',
    originCountry: 'Việt Nam',
    registrationNumber: 'VN123458',
    activeIngredients: 'Bacillus subtilis, Lactobacillus, Bifidobacterium',
    dosage: '5-10g/tấn thức ăn',
    usageInstructions: 'Trộn đều vào thức ăn tươi',
    warnings: 'Bảo quản ở nhiệt độ thấp, tránh ẩm ướt',
    storageConditions: 'Bảo quản ở 2-8°C hoặc -18°C',
    rating: 4.8,
    reviewCount: 45,
    tags: 'vi sinh; tiêu hóa; chế phẩm',
    functions: 'Tăng tiêu hóa; Cân bằng hệ vi sinh; Tăng trưởng'
  }
];

// Tạo workbook
const wb = XLSX.utils.book_new();

// Thêm sheet Products
const ws = XLSX.utils.json_to_sheet(sampleData);
XLSX.utils.book_append_sheet(wb, ws, 'Products');

// Thêm sheet Categories
const categoriesData = [
  { id: 1, name: 'Thuốc Thú Cưng' },
  { id: 2, name: 'Thuốc Gia Súc' },
  { id: 3, name: 'Chế Phẩm Sinh Học' },
  { id: 4, name: 'Vitamin & Thực Phẩm Chức Năng' },
  { id: 5, name: 'Thiết Bị Y Tế' },
  { id: 6, name: 'Gia Cầm' }
];

const wsCategories = XLSX.utils.json_to_sheet(categoriesData);
XLSX.utils.book_append_sheet(wb, wsCategories, 'Categories');

// Lưu file
XLSX.writeFile(wb, 'tamvet_product_template.xlsx');
console.log('✅ File tamvet_product_template.xlsx đã được tạo!');
console.log('Hãy sao chép file này vào thư mục: public/data/tamvet_product.xlsx');
