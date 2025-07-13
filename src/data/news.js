// data/news.js
export const newsCategories = [
  'Tất cả', 
  'Kiến thức chăm sóc', 
  'Công nghệ mới', 
  'Hướng dẫn sử dụng', 
  'Tin tức ngành',
  'Phòng chống dịch bệnh',
  'Dinh dưỡng',
  'Môi trường chăn nuôi'
]

export const news = [
  {
    id: 1,
    title: 'Hướng Dẫn Chăm Sóc Gia Súc Trong Mùa Khô',
    excerpt: 'Mùa khô là thời điểm gia súc dễ mắc các bệnh về đường hô hấp. Bài viết này sẽ hướng dẫn chi tiết cách chăm sóc và phòng ngừa bệnh hiệu quả cho đàn gia súc của bạn.',
    content: `
    <h2>Những thách thức trong mùa khô</h2>
    <p>Mùa khô mang đến nhiều thách thức cho người chăn nuôi. Thời tiết khô hanh, bụi bặm nhiều tạo điều kiện thuận lợi cho các bệnh về đường hô hấp phát triển.</p>
    
    <h3>Các biện pháp phòng ngừa:</h3>
    <ul>
      <li>Đảm bảo nguồn nước sạch, đủ cho gia súc</li>
      <li>Tăng cường thông gió cho chuồng trại</li>
      <li>Bổ sung vitamin C và các chất chống oxy hóa</li>
      <li>Thường xuyên vệ sinh chuồng trại</li>
    </ul>
    
    <h3>Chế độ dinh dưỡng phù hợp:</h3>
    <p>Trong mùa khô, cần điều chỉnh chế độ ăn cho gia súc với nhiều thức ăn giàu nước, vitamin và khoáng chất.</p>
    `,
    date: '15 Tháng 12, 2024',
    author: 'BS Nguyễn Văn A',
    category: 'Kiến thức chăm sóc',
    isPublished: true,
    isFeatured: true,
    readTime: '5 phút',
    views: 1250,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=250&fit=crop&crop=center'
  },
  {
    id: 2,
    title: 'Kinh Nghiệm Chăm Sóc Gia Cầm Trong Mùa Mưa',
    excerpt: 'Thời tiết ẩm ướt là điều kiện thuận lợi cho vi khuẩn phát triển. Tìm hiểu các biện pháp phòng ngừa hiệu quả cho đàn gia cầm của bạn.',
    content: `
    <h2>Tác hại của độ ẩm cao</h2>
    <p>Độ ẩm cao trong mùa mưa tạo điều kiện cho vi khuẩn, nấm mốc phát triển, gây ra nhiều bệnh nguy hiểm cho gia cầm.</p>
    
    <h3>Các bệnh thường gặp:</h3>
    <ul>
      <li>Bệnh Newcastle</li>
      <li>Bệnh cúm gia cầm</li>
      <li>Các bệnh về đường ruột</li>
      <li>Bệnh nấm đường hô hấp</li>
    </ul>
    
    <h3>Biện pháp phòng ngừa:</h3>
    <p>Cần có kế hoạch phòng ngừa chu đáo, từ việc cải thiện môi trường chuồng trại đến chế độ dinh dưỡng phù hợp.</p>
    `,
    date: '12 Tháng 12, 2024',
    author: 'TS Trần Thị B',
    category: 'Kiến thức chăm sóc',
    isPublished: true,
    isFeatured: false,
    readTime: '7 phút',
    views: 890,
    image: 'https://images.unsplash.com/photo-1609204268916-3c42a0604a91?w=400&h=250&fit=crop&crop=center'
  },
  {
    id: 3,
    title: 'Công Nghệ Thú Y Nhật Bản - Xu Hướng Mới 2024',
    excerpt: 'Tìm hiểu về những tiến bộ mới nhất trong công nghệ thú y từ Nhật Bản và ứng dụng vào chăn nuôi Việt Nam hiện đại.',
    content: `
    <h2>Công nghệ Nano trong thú y</h2>
    <p>Nhật Bản đang dẫn đầu trong việc ứng dụng công nghệ nano vào sản xuất thuốc thú y, mang lại hiệu quả điều trị cao hơn.</p>
    
    <h3>Những ưu điểm vượt trội:</h3>
    <ul>
      <li>Tăng khả năng hấp thu thuốc</li>
      <li>Giảm tác dụng phụ</li>
      <li>Tăng thời gian tác dụng</li>
      <li>Giảm liều lượng sử dụng</li>
    </ul>
    
    <h3>Ứng dụng tại Việt Nam:</h3>
    <p>HALIFE là một trong những công ty tiên phong áp dụng công nghệ Nhật Bản vào sản xuất thuốc thú y tại Việt Nam.</p>
    `,
    date: '10 Tháng 12, 2024',
    author: 'GS Lê Văn C',
    category: 'Công nghệ mới',
    isPublished: true,
    isFeatured: true,
    readTime: '10 phút',
    views: 2150,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop&crop=center'
  },
  {
    id: 4,
    title: 'Cách Sử Dụng Kháng Sinh Đúng Cách Trong Chăn Nuôi',
    excerpt: 'Hướng dẫn sử dụng kháng sinh an toàn và hiệu quả, tránh tình trạng kháng thuốc và đảm bảo an toàn thực phẩm.',
    content: `
    <h2>Nguy cơ từ việc lạm dụng kháng sinh</h2>
    <p>Việc sử dụng kháng sinh không đúng cách có thể dẫn đến tình trạng kháng thuốc, ảnh hưởng đến sức khỏe con người.</p>
    
    <h3>Nguyên tắc sử dụng kháng sinh:</h3>
    <ul>
      <li>Chỉ sử dụng khi cần thiết</li>
      <li>Đúng liều lượng và thời gian</li>
      <li>Tuân thủ thời gian ngưng thuốc</li>
      <li>Không tự ý thay đổi liều</li>
    </ul>
    
    <h3>Lựa chọn kháng sinh phù hợp:</h3>
    <p>Cần dựa vào kết quả xét nghiệm kháng sinh đồ để lựa chọn loại kháng sinh phù hợp.</p>
    `,
    date: '8 Tháng 12, 2024',
    author: 'BS Phạm Văn D',
    category: 'Hướng dẫn sử dụng',
    isPublished: true,
    isFeatured: false,
    readTime: '8 phút',
    views: 1450,
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=250&fit=crop&crop=center'
  },
  {
    id: 5,
    title: 'Thị Trường Thú Y Việt Nam 2024 - Cơ Hội Và Thách Thức',
    excerpt: 'Phân tích tình hình thị trường thuốc thú y Việt Nam năm 2024 và dự báo xu hướng phát triển trong những năm tới.',
    content: `
    <h2>Tình hình thị trường hiện tại</h2>
    <p>Thị trường thú y Việt Nam đang có những bước phát triển mạnh mẽ với quy mô đạt hơn 2 tỷ USD.</p>
    
    <h3>Những cơ hội:</h3>
    <ul>
      <li>Nhu cầu chăn nuôi tăng cao</li>
      <li>Chính sách hỗ trợ của nhà nước</li>
      <li>Công nghệ mới được ứng dụng</li>
      <li>Xuất khẩu sang các nước ASEAN</li>
    </ul>
    
    <h3>Thách thức phải đối mặt:</h3>
    <p>Cạnh tranh gay gắt từ các sản phẩm nhập khẩu và yêu cầu về chất lượng ngày càng cao.</p>
    `,
    date: '5 Tháng 12, 2024',
    author: 'TS Hoàng Thị E',
    category: 'Tin tức ngành',
    isPublished: true,
    isFeatured: false,
    readTime: '12 phút',
    views: 980,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop&crop=center'
  },
  {
    id: 6,
    title: 'Phòng Chống Dịch Bệnh Gia Súc Hiệu Quả',
    excerpt: 'Các biện pháp phòng chống dịch bệnh toàn diện cho trang trại chăn nuôi, từ sinh học an toàn đến vaccination.',
    content: `
    <h2>Tầm quan trọng của sinh học an toàn</h2>
    <p>Sinh học an toàn là yếu tố then chốt trong việc phòng chống dịch bệnh tại các trang trại chăn nuôi.</p>
    
    <h3>Các nguyên tắc cơ bản:</h3>
    <ul>
      <li>Kiểm soát ra vào trang trại</li>
      <li>Khử trùng thường xuyên</li>
      <li>Cách ly động vật mới</li>
      <li>Quản lý chất thải đúng cách</li>
    </ul>
    
    <h3>Chương trình vaccination:</h3>
    <p>Xây dựng lịch tiêm vaccine phù hợp với từng loài và địa phương.</p>
    `,
    date: '3 Tháng 12, 2024',
    author: 'BS Ngô Văn F',
    category: 'Phòng chống dịch bệnh',
    isPublished: true,
    isFeatured: false,
    readTime: '9 phút',
    views: 1120,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=250&fit=crop&crop=center'
  },
  {
    id: 7,
    title: 'Dinh Dưỡng Gia Súc Theo Từng Giai Đoạn Phát Triển',
    excerpt: 'Hướng dẫn chi tiết về chế độ dinh dưỡng phù hợp cho gia súc ở các giai đoạn khác nhau từ con giống đến xuất chuồng.',
    content: `
    <h2>Dinh dưỡng giai đoạn con non</h2>
    <p>Giai đoạn con non là thời kỳ quan trọng nhất, quyết định sự phát triển của gia súc trong suốt cuộc đời.</p>
    
    <h3>Yêu cầu dinh dưỡng:</h3>
    <ul>
      <li>Protein cao chất lượng</li>
      <li>Vitamin và khoáng chất đầy đủ</li>
      <li>Năng lượng dễ tiêu hóa</li>
      <li>Chất tăng cường miễn dịch</li>
    </ul>
    
    <h3>Sản phẩm khuyên dùng:</h3>
    <p>HALIFE-V và HALIFE-I là những sản phẩm lý tưởng cho giai đoạn này.</p>
    `,
    date: '1 Tháng 12, 2024',
    author: 'TS Vũ Thị G',
    category: 'Dinh dưỡng',
    isPublished: true,
    isFeatured: false,
    readTime: '11 phút',
    views: 760,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb55bb?w=400&h=250&fit=crop&crop=center'
  },
  {
    id: 8,
    title: 'Xây Dựng Môi Trường Chăn Nuôi Bền Vững',
    excerpt: 'Hướng dẫn thiết kế và xây dựng hệ thống chăn nuôi thân thiện với môi trường, giảm thiểu tác động tiêu cực.',
    content: `
    <h2>Chăn nuôi bền vững - xu hướng tương lai</h2>
    <p>Chăn nuôi bền vững không chỉ mang lại lợi ích kinh tế mà còn bảo vệ môi trường cho thế hệ tương lai.</p>
    
    <h3>Các yếu tố quan trọng:</h3>
    <ul>
      <li>Xử lý chất thải hiệu quả</li>
      <li>Sử dụng năng lượng tái tạo</li>
      <li>Giảm phát thải khí nhà kính</li>
      <li>Bảo vệ nguồn nước</li>
    </ul>
    
    <h3>Lợi ích kinh tế:</h3>
    <p>Mô hình chăn nuôi bền vững giúp giảm chi phí sản xuất và tăng giá trị sản phẩm.</p>
    `,
    date: '28 Tháng 11, 2024',
    author: 'GS Đinh Văn H',
    category: 'Môi trường chăn nuôi',
    isPublished: true,
    isFeatured: false,
    readTime: '13 phút',
    views: 650,
    image: 'https://images.unsplash.com/photo-1609204268916-3c42a0604a91?w=400&h=250&fit=crop&crop=center'
  }
]

// Helper functions
export const getFeaturedNews = () => {
  return news.filter(article => article.isFeatured && article.isPublished)
}

export const getNewsByCategory = (category) => {
  if (category === 'Tất cả') {
    return news.filter(article => article.isPublished)
  }
  return news.filter(article => article.category === category && article.isPublished)
}

export const getNewsById = (id) => {
  return news.find(article => article.id === id)
}

export const getLatestNews = (limit = 5) => {
  return news
    .filter(article => article.isPublished)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

export const searchNews = (query) => {
  const searchTerm = query.toLowerCase()
  return news.filter(article => 
    article.isPublished && (
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      article.category.toLowerCase().includes(searchTerm) ||
      article.author.toLowerCase().includes(searchTerm)
    )
  )
}

export const getPopularNews = (limit = 5) => {
  return news
    .filter(article => article.isPublished)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

export const getRelatedNews = (currentArticleId, category, limit = 3) => {
  return news
    .filter(article => 
      article.isPublished && 
      article.id !== currentArticleId && 
      article.category === category
    )
    .slice(0, limit)
}