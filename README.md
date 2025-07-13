# HALIFE Website - Veterinary Products Management System

Website quản lý sản phẩm thú y của công ty HALIFE Việt Nhật. Hệ thống bao gồm frontend Vue.js và Python API backend để quản lý dữ liệu Excel.

## 🛠 Tech Stack

- **Frontend**: Vue 3 + Vite + Tailwind CSS
- **Backend**: Python Flask API
- **Database**: Excel files (`.xlsx`)
- **UI**: Responsive design with Font Awesome icons

## 📁 Project Structure
halife-website/
├── public/
│   ├── data/
│   │   └── halife_products.xlsx    # Excel data file
│   └── images/                     # Product images
├── src/
│   ├── components/                 # Vue components
│   ├── views/                      # Vue pages
│   ├── utils/                      # Utilities
│   └── data/                       # Data management
├── api/
│   ├── excel_api.py               # Python Flask API
│   ├── requirements.txt           # Python dependencies
│   └── test_api.py               # API tests
├── package.json
└── README.md

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16+): [Download here](https://nodejs.org/)
- **Python** (v3.8+): [Download here](https://python.org/)
- **npm** hoặc **yarn**

### 1. Clone Repository

```bash
git clone <repository-url>
cd halife-website
2. Setup Frontend (Vue.js)
bash# Install dependencies
npm install

# Start development server
npm run dev
Frontend sẽ chạy tại: http://localhost:5173
3. Setup Backend (Python API)
bash# Navigate to API directory
cd api

# Install Python dependencies
pip install -r requirements.txt
# Hoặc: pip3 install -r requirements.txt

# Start API server
python excel_api.py
# Hoặc: python3 excel_api.py
Backend API sẽ chạy tại: http://localhost:8000
4. Test Setup

Frontend: http://localhost:5173
API Health Check: http://localhost:8000
API Test: http://localhost:8000/api/test

🔧 Development
Frontend Development
bash# Install new dependencies
npm install <package-name>

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
Backend Development
bashcd api

# Install new Python packages
pip install <package-name>

# Add to requirements.txt
pip freeze > requirements.txt

# Run API in debug mode
python excel_api.py
🗂 Key Features

Product Management: CRUD operations for veterinary products
Excel Integration: Read/write product data from Excel files
Image Management: Upload and manage product images
Category Management: Organize products by categories
Responsive Design: Works on desktop and mobile
Real-time Updates: Live data synchronization

📊 API Endpoints
MethodEndpointDescriptionGET/Health checkGET/api/testAPI testGET/api/productsGet all productsPOST/api/productsCreate new productPUT/api/products/<id>Update productDELETE/api/products/<id>Delete productGET/api/categoriesGet all categoriesPOST/api/reloadReload data from Excel
🌐 Deployment
Frontend Deployment (Vercel/Netlify)
bash# Build production files
npm run build

# Upload dist/ folder to hosting service
# Or connect GitHub repo to auto-deploy
Backend Deployment (PythonAnywhere/Heroku)
bash# For Heroku
echo "web: python api/excel_api.py" > Procfile

# Deploy
git add .
git commit -m "Deploy"
git push heroku main
Self-hosted Deployment
bash# Install PM2 for process management
npm install -g pm2

# Start frontend (after build)
npm run build
serve -s dist -l 3000

# Start backend
cd api
pm2 start excel_api.py --name "halife-api"
🔄 Data Management
Excel File Structure
Products Sheet:

ID, Name, Category, Price, Description, Image URL, etc.

Categories Sheet:

ID, Name, Icon, Sort Order, Status

Backup & Restore
bash# Backup current data
cp public/data/halife_products.xlsx backup/halife_products_$(date +%Y%m%d).xlsx

# Restore from backup
cp backup/halife_products_YYYYMMDD.xlsx public/data/halife_products.xlsx
🐛 Troubleshooting
Common Issues

Port 5173 already in use
bash# Kill process using port
lsof -ti:5173 | xargs kill -9

Python API not starting
bash# Check Python version
python --version

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

CORS errors

Ensure Flask-CORS is installed
Check API is running on port 8000


Excel file not found
bash# Check file exists
ls -la public/data/halife_products.xlsx

# Create sample file if missing
python api/create_sample_excel.py


📝 Development Notes
Environment Variables
Create .env file for configuration:
envVITE_API_URL=http://localhost:8000
VITE_UPLOAD_MAX_SIZE=5242880
PYTHON_ENV=development
Code Style

Frontend: ESLint + Prettier
Backend: PEP 8 Python style guide

Testing
bash# Frontend tests
npm run test

# Backend tests
cd api
python test_api.py
🤝 Contributing

Fork the repository
Create feature branch: git checkout -b feature/amazing-feature
Commit changes: git commit -m 'Add amazing feature'
Push to branch: git push origin feature/amazing-feature
Open Pull Request

📞 Support

Technical Issues: Create GitHub issue
Business Inquiries: contact@halife.vn
Documentation: Check /docs folder

📄 License
This project is licensed under the MIT License - see LICENSE file for details.

Version: 1.0.0
Last Updated: $(date +%Y-%m-%d)
Maintained by: HALIFE Development Team