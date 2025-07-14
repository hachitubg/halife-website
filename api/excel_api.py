# api/excel_api.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import json
import os
from datetime import datetime
from werkzeug.utils import secure_filename
import uuid
import shutil

app = Flask(__name__)
CORS(app)

# Đường dẫn file Excel và thư mục upload
EXCEL_FILE = '../public/data/halife_products.xlsx'
UPLOAD_FOLDER = '../public/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Tạo thư mục upload nếu chưa có
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def safe_str(value, default=''):
    if pd.isna(value) or value is None:
        return default
    return str(value).strip()

def safe_int(value, default=0):
    if pd.isna(value) or value is None:
        return default
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return default

def safe_float(value, default=0.0):
    if pd.isna(value) or value is None:
        return default
    try:
        return float(value)
    except (ValueError, TypeError):
        return default

def safe_bool(value, default=True):
    if pd.isna(value) or value is None:
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() in ['true', '1', 'yes', 'có', 'còn hàng']
    return bool(value)

def safe_split(value, delimiter=';'):
    if pd.isna(value) or value is None or safe_str(value) == '':
        return []
    return [item.strip() for item in safe_str(value).split(delimiter) if item.strip()]

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'HALIFE Excel API is running!',
        'version': '1.0.0'
    })

@app.route('/api/products', methods=['GET'])
def get_all_products():
    """Lấy tất cả sản phẩm từ Excel"""
    try:
        if not os.path.exists(EXCEL_FILE):
            return jsonify({
                'success': False,
                'message': f'File Excel không tồn tại: {EXCEL_FILE}',
                'data': []
            }), 404

        # Kiểm tra các sheet có sẵn
        excel_file = pd.ExcelFile(EXCEL_FILE)
        available_sheets = excel_file.sheet_names
        
        # Thử đọc sheet Products trước, nếu không có thì thử sheet đầu tiên
        sheet_name = 'Products'
        if sheet_name not in available_sheets:
            if available_sheets:
                sheet_name = available_sheets[0]
            else:
                return jsonify({
                    'success': False,
                    'message': 'File Excel không có sheet nào',
                    'data': []
                }), 404

        # Đọc Excel
        df = pd.read_excel(EXCEL_FILE, sheet_name=sheet_name)
        
        if df.empty:
            return jsonify({
                'success': True,
                'message': f'Sheet {sheet_name} không có dữ liệu',
                'data': []
            })

        # Chuyển đổi thành list dict
        products = []
        for index, row in df.iterrows():
            try:
                # Xử lý hình ảnh chính
                main_image = safe_str(row.get('image_url', ''))
                if main_image == 'nan':
                    main_image = ''
                
                # Xử lý hình ảnh phụ
                additional_images = safe_split(row.get('gallery_images', ''))
                additional_images = [img for img in additional_images if img != 'nan' and img != '']
                
                product = {
                    'id': safe_str(row.get('id', f'PRD{index+1:03d}')),
                    'name': safe_str(row.get('name', f'Sản phẩm {index+1}')),
                    'category': safe_str(row.get('category', 'Khác')),
                    'price': safe_int(row.get('price', 0)),
                    'originalPrice': safe_int(row.get('original_price', 0)),
                    'description': safe_str(row.get('description', '')),
                    'fullDescription': safe_str(row.get('full_description', '')),
                    'packageSize': safe_str(row.get('package_size', '')),
                    'stockQuantity': safe_int(row.get('stock_quantity', 0)),
                    'inStock': safe_bool(row.get('in_stock', True)),
                    'isFeatured': safe_bool(row.get('is_featured', False)),
                    'image': main_image,
                    'images': [main_image] + additional_images if main_image else additional_images,
                    'targetAnimal': safe_str(row.get('target_animal', '')),
                    'manufacturer': safe_str(row.get('manufacturer', 'HALIFE Việt Nhật')),
                    'originCountry': safe_str(row.get('origin_country', 'Việt Nam')),
                    'registrationNumber': safe_str(row.get('registration_number', '')),
                    'activeIngredients': safe_str(row.get('active_ingredients', '')),
                    'dosage': safe_str(row.get('dosage', '')),
                    'usageInstructions': safe_str(row.get('usage_instructions', '')),
                    'warnings': safe_str(row.get('warnings', '')),
                    'storageConditions': safe_str(row.get('storage_conditions', '')),
                    'rating': safe_float(row.get('rating', 0)),
                    'reviewCount': safe_int(row.get('review_count', 0)),
                    'tags': safe_split(row.get('tags', ''), ','),
                    'functions': safe_split(row.get('functions', ''))
                }
                products.append(product)
                
            except Exception as e:
                continue

        return jsonify({
            'success': True,
            'message': f'Lấy {len(products)} sản phẩm thành công từ sheet "{sheet_name}"',
            'data': products
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi đọc Excel: {str(e)}',
            'data': []
        }), 500

@app.route('/api/categories', methods=['GET'])
def get_all_categories():
    """Lấy tất cả danh mục từ Excel"""
    try:
        if not os.path.exists(EXCEL_FILE):
            return jsonify({
                'success': False,
                'message': f'File Excel không tồn tại: {EXCEL_FILE}',
                'data': []
            }), 404

        # Kiểm tra sheet Categories
        excel_file = pd.ExcelFile(EXCEL_FILE)
        available_sheets = excel_file.sheet_names
        
        sheet_name = 'Categories'
        if sheet_name not in available_sheets:
            # Tạo danh mục từ dữ liệu Products
            products_sheet = 'Products' if 'Products' in available_sheets else available_sheets[0]
            df_products = pd.read_excel(EXCEL_FILE, sheet_name=products_sheet)
            
            if 'category' in df_products.columns:
                unique_categories = df_products['category'].dropna().unique()
                categories = []
                for i, cat_name in enumerate(unique_categories):
                    if pd.notna(cat_name) and str(cat_name).strip():
                        categories.append({
                            'id': f'CAT{i+1:03d}',
                            'name': str(cat_name).strip(),
                            'icon': 'fas fa-box',
                            'sortOrder': i + 1,
                            'is_active': True
                        })
                
                return jsonify({
                    'success': True,
                    'message': f'Tạo {len(categories)} danh mục từ dữ liệu Products',
                    'data': categories
                })
            else:
                return jsonify({
                    'success': True,
                    'message': 'Không tìm thấy cột category',
                    'data': []
                })

        # Đọc sheet Categories
        df = pd.read_excel(EXCEL_FILE, sheet_name=sheet_name)
        
        categories = []
        for _, row in df.iterrows():
            category = {
                'id': safe_str(row.get('id', '')),
                'name': safe_str(row.get('name', '')),
                'icon': safe_str(row.get('icon', 'fas fa-box')),
                'sortOrder': safe_int(row.get('sort_order', 999)),
                'is_active': safe_bool(row.get('is_active', True))
            }
            if category['name']:
                categories.append(category)

        return jsonify({
            'success': True,
            'message': f'Lấy {len(categories)} danh mục thành công',
            'data': categories
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi đọc danh mục: {str(e)}',
            'data': []
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Lấy thống kê sản phẩm"""
    try:
        products_response = get_all_products()
        categories_response = get_all_categories()
        
        if products_response.status_code != 200:
            return jsonify({
                'success': False,
                'message': 'Không thể lấy thống kê',
                'data': {
                    'totalProducts': 0,
                    'totalCategories': 0,
                    'inStockProducts': 0,
                    'featuredProducts': 0,
                    'isLoaded': False
                }
            })

        products = products_response.get_json()['data']
        categories = categories_response.get_json()['data'] if categories_response.status_code == 200 else []
        
        stats = {
            'totalProducts': len(products),
            'totalCategories': len(categories),
            'inStockProducts': len([p for p in products if p.get('inStock', False)]),
            'featuredProducts': len([p for p in products if p.get('isFeatured', False)]),
            'isLoaded': True
        }

        return jsonify({
            'success': True,
            'message': 'Lấy thống kê thành công',
            'data': stats
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi lấy thống kê: {str(e)}',
            'data': {
                'totalProducts': 0,
                'totalCategories': 0,
                'inStockProducts': 0,
                'featuredProducts': 0,
                'isLoaded': False
            }
        }), 500

@app.route('/api/products', methods=['POST'])
def create_product():
    """Thêm sản phẩm mới"""
    try:
        data = request.get_json()
        
        # Validate dữ liệu
        if not data.get('name') or not data.get('category') or not data.get('price'):
            return jsonify({
                'success': False,
                'message': 'Thiếu thông tin bắt buộc: tên, danh mục, giá'
            }), 400

        if not os.path.exists(EXCEL_FILE):
            return jsonify({
                'success': False,
                'message': f'File Excel không tồn tại: {EXCEL_FILE}'
            }), 404

        df = pd.read_excel(EXCEL_FILE, sheet_name='Products')
        
        # Tạo ID mới
        max_id = 0
        if not df.empty and 'id' in df.columns:
            try:
                existing_ids = df['id'].dropna().astype(str)
                numeric_ids = []
                for id_val in existing_ids:
                    try:
                        if str(id_val).isdigit():
                            numeric_ids.append(int(id_val))
                        elif str(id_val).startswith('PRD'):
                            num_part = str(id_val).replace('PRD', '')
                            if num_part.isdigit():
                                numeric_ids.append(int(num_part))
                    except:
                        continue
                
                if numeric_ids:
                    max_id = max(numeric_ids)
                else:
                    max_id = len(df)
            except:
                max_id = len(df)
        
        new_id = max_id + 1
        
        # Tạo dòng mới
        new_row = {
            'id': new_id,
            'name': data.get('name', ''),
            'category': data.get('category', ''),
            'subcategory': data.get('subcategory', ''),
            'description': data.get('description', ''),
            'full_description': data.get('fullDescription', ''),
            'functions': ';'.join(data.get('functions', [])) if data.get('functions') else '',
            'usage_instructions': data.get('usageInstructions', ''),
            'price': int(data.get('price', 0)),
            'original_price': int(data.get('originalPrice', data.get('price', 0))),
            'discount_percent': 0,
            'unit': data.get('unit', 'hộp'),
            'package_size': data.get('packageSize', ''),
            'target_animal': data.get('targetAnimal', ''),
            'active_ingredients': data.get('activeIngredients', ''),
            'dosage': data.get('dosage', ''),
            'withdrawal_time': data.get('withdrawalTime', ''),
            'storage_conditions': data.get('storageConditions', ''),
            'shelf_life': data.get('shelfLife', '24 tháng'),
            'manufacturer': data.get('manufacturer', 'HALIFE Việt Nhật'),
            'origin_country': data.get('originCountry', 'Việt Nam'),
            'registration_number': data.get('registrationNumber', ''),
            'is_featured': bool(data.get('isFeatured', False)),
            'is_bestseller': bool(data.get('isBestseller', False)),
            'in_stock': bool(data.get('inStock', True)),
            'stock_quantity': int(data.get('stockQuantity', 0)),
            'rating': float(data.get('rating', 0)),
            'review_count': int(data.get('reviewCount', 0)),
            'image_url': data.get('image', ''),
            'gallery_images': ';'.join(data.get('images', [])) if data.get('images') else '',
            'tags': ','.join(data.get('tags', [])) if data.get('tags') else '',
            'seo_keywords': data.get('seoKeywords', ''),
            'meta_description': data.get('metaDescription', ''),
            'created_date': datetime.now().strftime('%Y-%m-%d'),
            'updated_date': datetime.now().strftime('%Y-%m-%d'),
            'status': 'active'
        }
        
        # Thêm vào DataFrame
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        
        # Ghi lại Excel
        try:
            # Backup Excel trước khi ghi
            backup_file = EXCEL_FILE + '.backup'
            if os.path.exists(EXCEL_FILE):
                shutil.copy2(EXCEL_FILE, backup_file)
            
            # Đọc tất cả sheets hiện có trước khi ghi
            existing_sheets = {}
            if os.path.exists(EXCEL_FILE):
                excel_file = pd.ExcelFile(EXCEL_FILE)
                for sheet_name in excel_file.sheet_names:
                    if sheet_name != 'Products':
                        existing_sheets[sheet_name] = pd.read_excel(EXCEL_FILE, sheet_name=sheet_name)
                excel_file.close()
            
            # Ghi lại Excel với tất cả sheets
            with pd.ExcelWriter(EXCEL_FILE, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='Products', index=False)
                for sheet_name, sheet_data in existing_sheets.items():
                    sheet_data.to_excel(writer, sheet_name=sheet_name, index=False)
            
        except Exception as write_error:
            if os.path.exists(backup_file):
                shutil.copy2(backup_file, EXCEL_FILE)
            raise write_error
        
        return jsonify({
            'success': True,
            'message': f'Đã thêm sản phẩm "{data.get("name")}" thành công',
            'data': {
                'id': new_id,
                'name': data.get('name')
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi thêm sản phẩm: {str(e)}'
        }), 500

@app.route('/api/products/<product_id>', methods=['PUT'])
def update_product(product_id):
    """Cập nhật sản phẩm"""
    try:
        data = request.get_json()
        
        if not os.path.exists(EXCEL_FILE):
            return jsonify({
                'success': False,
                'message': f'File Excel không tồn tại: {EXCEL_FILE}'
            }), 404

        df = pd.read_excel(EXCEL_FILE, sheet_name='Products')
        
        # Tìm sản phẩm
        try:
            if str(product_id).isdigit():
                search_id = int(product_id)
            else:
                search_id = product_id
        except:
            search_id = product_id
            
        product_index = df[
            (df['id'] == search_id) | 
            (df['id'] == str(search_id)) |
            (df['id'].astype(str) == str(search_id))
        ].index
        
        if len(product_index) == 0:
            return jsonify({
                'success': False,
                'message': f'Không tìm thấy sản phẩm ID: {product_id}'
            }), 404
        
        idx = product_index[0]
        
        # Cập nhật dữ liệu
        if 'name' in data:
            df.at[idx, 'name'] = data['name']
        if 'category' in data:
            df.at[idx, 'category'] = data['category']
        if 'price' in data:
            df.at[idx, 'price'] = int(data['price'])
        if 'originalPrice' in data:
            df.at[idx, 'original_price'] = int(data['originalPrice'])
        if 'description' in data:
            df.at[idx, 'description'] = data['description']
        if 'fullDescription' in data:
            df.at[idx, 'full_description'] = data['fullDescription']
        if 'packageSize' in data:
            df.at[idx, 'package_size'] = data['packageSize']
        if 'stockQuantity' in data:
            df.at[idx, 'stock_quantity'] = int(data['stockQuantity'])
        if 'inStock' in data:
            df.at[idx, 'in_stock'] = bool(data['inStock'])
        if 'isFeatured' in data:
            df.at[idx, 'is_featured'] = bool(data['isFeatured'])
        if 'image' in data:
            df.at[idx, 'image_url'] = data['image']
        if 'images' in data:
            gallery_images_str = ';'.join(data['images']) if data['images'] else ''
            df.at[idx, 'gallery_images'] = gallery_images_str
        if 'targetAnimal' in data:
            df.at[idx, 'target_animal'] = data['targetAnimal']
        if 'manufacturer' in data:
            df.at[idx, 'manufacturer'] = data['manufacturer']
        if 'originCountry' in data:
            df.at[idx, 'origin_country'] = data['originCountry']
        if 'registrationNumber' in data:
            df.at[idx, 'registration_number'] = data['registrationNumber']
        if 'activeIngredients' in data:
            df.at[idx, 'active_ingredients'] = data['activeIngredients']
        if 'dosage' in data:
            df.at[idx, 'dosage'] = data['dosage']
        if 'usageInstructions' in data:
            df.at[idx, 'usage_instructions'] = data['usageInstructions']
        if 'storageConditions' in data:
            df.at[idx, 'storage_conditions'] = data['storageConditions']
        if 'rating' in data:
            df.at[idx, 'rating'] = float(data['rating'])
        if 'reviewCount' in data:
            df.at[idx, 'review_count'] = int(data['reviewCount'])
        if 'tags' in data:
            df.at[idx, 'tags'] = ','.join(data['tags']) if data['tags'] else ''
        if 'functions' in data:
            df.at[idx, 'functions'] = ';'.join(data['functions']) if data['functions'] else ''
        
        # Cập nhật thời gian
        df.at[idx, 'updated_date'] = datetime.now().strftime('%Y-%m-%d')
        
        # Ghi lại Excel
        try:
            backup_file = EXCEL_FILE + '.backup'
            if os.path.exists(EXCEL_FILE):
                shutil.copy2(EXCEL_FILE, backup_file)
            
            existing_sheets = {}
            if os.path.exists(EXCEL_FILE):
                excel_file = pd.ExcelFile(EXCEL_FILE)
                for sheet_name in excel_file.sheet_names:
                    if sheet_name != 'Products':
                        existing_sheets[sheet_name] = pd.read_excel(EXCEL_FILE, sheet_name=sheet_name)
                excel_file.close()
            
            with pd.ExcelWriter(EXCEL_FILE, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='Products', index=False)
                for sheet_name, sheet_data in existing_sheets.items():
                    sheet_data.to_excel(writer, sheet_name=sheet_name, index=False)
                
        except Exception as write_error:
            if os.path.exists(backup_file):
                shutil.copy2(backup_file, EXCEL_FILE)
            raise write_error
        
        return jsonify({
            'success': True,
            'message': f'Đã cập nhật sản phẩm "{df.at[idx, "name"]}" thành công',
            'data': {
                'id': product_id,
                'name': df.at[idx, 'name']
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi cập nhật sản phẩm: {str(e)}'
        }), 500

@app.route('/api/products/<product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Xóa sản phẩm và tất cả hình ảnh liên quan"""
    try:
        if not os.path.exists(EXCEL_FILE):
            return jsonify({
                'success': False,
                'message': f'File Excel không tồn tại: {EXCEL_FILE}'
            }), 404

        df = pd.read_excel(EXCEL_FILE, sheet_name='Products')
        
        # Tìm sản phẩm
        try:
            if str(product_id).isdigit():
                search_id = int(product_id)
            else:
                search_id = product_id
        except:
            search_id = product_id
            
        product_row = df[
            (df['id'] == search_id) | 
            (df['id'] == str(search_id)) |
            (df['id'].astype(str) == str(search_id))
        ]
        
        if len(product_row) == 0:
            return jsonify({
                'success': False,
                'message': f'Không tìm thấy sản phẩm ID: {product_id}'
            }), 404
        
        product_data = product_row.iloc[0]
        product_name = product_data['name']
        
        # Thu thập tất cả hình ảnh cần xóa
        images_to_delete = []
        
        # Hình ảnh chính
        main_image = str(product_data.get('image_url', ''))
        if main_image and main_image != 'nan' and main_image.startswith('/images/'):
            images_to_delete.append(main_image)
        
        # Hình ảnh phụ từ gallery_images
        gallery_images_str = str(product_data.get('gallery_images', ''))
        if gallery_images_str and gallery_images_str != 'nan':
            gallery_images = [img.strip() for img in gallery_images_str.split(';') if img.strip()]
            for img in gallery_images:
                if img.startswith('/images/'):
                    images_to_delete.append(img)
        
        # Xóa tất cả hình ảnh khỏi server
        deleted_images = []
        failed_deletes = []
        
        for image_url in images_to_delete:
            try:
                filename = image_url.replace('/images/', '')
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                
                if os.path.exists(file_path):
                    os.remove(file_path)
                    deleted_images.append(image_url)
                    
            except Exception as img_error:
                failed_deletes.append(image_url)
        
        # Xóa sản phẩm khỏi DataFrame
        df = df[
            ~((df['id'] == search_id) | 
              (df['id'] == str(search_id)) |
              (df['id'].astype(str) == str(search_id)))
        ]
        
        # Ghi lại Excel
        try:
            backup_file = EXCEL_FILE + '.backup'
            if os.path.exists(EXCEL_FILE):
                shutil.copy2(EXCEL_FILE, backup_file)
            
            existing_sheets = {}
            if os.path.exists(EXCEL_FILE):
                excel_file = pd.ExcelFile(EXCEL_FILE)
                for sheet_name in excel_file.sheet_names:
                    if sheet_name != 'Products':
                        existing_sheets[sheet_name] = pd.read_excel(EXCEL_FILE, sheet_name=sheet_name)
                excel_file.close()
            
            with pd.ExcelWriter(EXCEL_FILE, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='Products', index=False)
                for sheet_name, sheet_data in existing_sheets.items():
                    sheet_data.to_excel(writer, sheet_name=sheet_name, index=False)
                    
        except Exception as write_error:
            if os.path.exists(backup_file):
                shutil.copy2(backup_file, EXCEL_FILE)
            raise write_error
        
        # Tạo response message
        message = f'Đã xóa sản phẩm "{product_name}" thành công'
        if deleted_images:
            message += f' và {len(deleted_images)} hình ảnh'
        if failed_deletes:
            message += f' (Không thể xóa {len(failed_deletes)} hình ảnh)'
        
        return jsonify({
            'success': True,
            'message': message,
            'data': {
                'id': product_id,
                'name': product_name,
                'deleted_images': deleted_images,
                'failed_deletes': failed_deletes
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi xóa sản phẩm: {str(e)}'
        }), 500

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    """Upload hình ảnh sản phẩm"""
    try:
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'message': 'Không có file được gửi'
            }), 400

        file = request.files['file']
        
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'Không có file được chọn'
            }), 400

        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'message': 'Định dạng file không được hỗ trợ. Chỉ chấp nhận: png, jpg, jpeg, gif, webp'
            }), 400

        # Kiểm tra kích thước file (5MB)
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > 5 * 1024 * 1024:
            return jsonify({
                'success': False,
                'message': 'File quá lớn. Kích thước tối đa: 5MB'
            }), 400

        # Tạo tên file unique
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"product-{uuid.uuid4().hex[:8]}-{int(datetime.now().timestamp())}.{file_extension}"
        
        # Đường dẫn lưu file
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        
        # Lưu file
        file.save(file_path)
        
        # URL để truy cập ảnh
        image_url = f"/images/{unique_filename}"
        
        return jsonify({
            'success': True,
            'message': 'Upload ảnh thành công',
            'data': {
                'url': image_url,
                'filename': unique_filename,
                'size': file_size
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi upload ảnh: {str(e)}'
        }), 500

@app.route('/api/delete-image', methods=['POST'])
def delete_image():
    """Xóa hình ảnh sản phẩm"""
    try:
        data = request.get_json()
        image_url = data.get('imageUrl', '')
        
        if not image_url:
            return jsonify({
                'success': False,
                'message': 'Không có URL ảnh'
            }), 400
        
        if image_url.startswith('/images/'):
            filename = image_url.replace('/images/', '')
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            
            if os.path.exists(file_path):
                os.remove(file_path)
                return jsonify({
                    'success': True,
                    'message': f'Đã xóa ảnh {filename}'
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'File ảnh không tồn tại'
                }), 404
        else:
            return jsonify({
                'success': False,
                'message': 'URL ảnh không hợp lệ'
            }), 400

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Lỗi xóa ảnh: {str(e)}'
        }), 500

@app.route('/images/<filename>')
def uploaded_file(filename):
    """Serve uploaded images"""
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    print("🚀 Starting HALIFE Excel API...")
    print("📍 API URL: http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True)