#!/usr/bin/env python3
# api/test_news_api.py

import requests
import json
import time

API_BASE = 'http://localhost:8000'

def test_api_endpoint(method, endpoint, data=None, expected_status=200):
    """Test một API endpoint"""
    url = f"{API_BASE}{endpoint}"
    
    try:
        if method == 'GET':
            response = requests.get(url)
        elif method == 'POST':
            response = requests.post(url, json=data)
        elif method == 'PUT':
            response = requests.put(url, json=data)
        elif method == 'DELETE':
            response = requests.delete(url)
        
        print(f"\n{'='*60}")
        print(f"🔍 TESTING: {method} {endpoint}")
        print(f"📊 Status: {response.status_code} (Expected: {expected_status})")
        
        if response.status_code == expected_status:
            print("✅ SUCCESS")
        else:
            print("❌ FAILED")
            
        try:
            result = response.json()
            print(f"📝 Response: {json.dumps(result, indent=2, ensure_ascii=False)}")
            return result
        except:
            print(f"📝 Response: {response.text}")
            return None
            
    except requests.exceptions.ConnectionError:
        print(f"❌ CONNECTION ERROR: Không thể kết nối tới {url}")
        print("🔧 Hãy đảm bảo API server đang chạy: python excel_api.py")
        return None
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None

def run_news_api_tests():
    """Chạy tất cả test cases cho News API"""
    
    print("🚀 STARTING NEWS API TESTS...")
    print("=" * 60)
    
    # Test 1: Health check
    print("\n1️⃣ Testing Health Check...")
    test_api_endpoint('GET', '/')
    
    # Test 2: Get all news
    print("\n2️⃣ Testing Get All News...")
    all_news = test_api_endpoint('GET', '/api/news')
    
    # Test 3: Get news categories
    print("\n3️⃣ Testing Get Categories...")
    test_api_endpoint('GET', '/api/news/categories')
    
    # Test 4: Get news stats
    print("\n4️⃣ Testing Get Stats...")
    test_api_endpoint('GET', '/api/news/stats')
    
    # Test 5: Create new news
    print("\n5️⃣ Testing Create News...")
    new_news_data = {
        "title": "Test News - API Test",
        "content": "<p>Đây là nội dung test từ API. Bài viết này được tạo bởi script test.</p><p>Content này có thể có <strong>HTML tags</strong> và <em>formatting</em>.</p>",
        "excerpt": "Đây là excerpt test cho bài viết API test...",
        "author": "API Test Bot",
        "category": "Tin tức ngành",
        "isFeatured": True,
        "image": "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop",
        "tags": ["test", "api", "demo"]
    }
    
    created_news = test_api_endpoint('POST', '/api/news', new_news_data)
    created_id = None
    if created_news and created_news.get('success'):
        created_id = created_news.get('data', {}).get('id')
        print(f"✅ Created news with ID: {created_id}")
    
    # Test 6: Get news by ID
    if created_id:
        print(f"\n6️⃣ Testing Get News by ID ({created_id})...")
        test_api_endpoint('GET', f'/api/news/{created_id}')
    
    # Test 7: Update news
    if created_id:
        print(f"\n7️⃣ Testing Update News ({created_id})...")
        update_data = {
            "title": "Updated Test News - API Test",
            "content": "<p>Nội dung đã được cập nhật bởi API test.</p>",
            "isFeatured": False
        }
        test_api_endpoint('PUT', f'/api/news/{created_id}', update_data)
    
    # Test 8: Search news
    print("\n8️⃣ Testing Search News...")
    test_api_endpoint('GET', '/api/news/search?q=test')
    
    # Test 9: Like news
    if created_id:
        print(f"\n9️⃣ Testing Like News ({created_id})...")
        test_api_endpoint('POST', f'/api/news/{created_id}/like')
    
    # Test 10: Bookmark news
    if created_id:
        print(f"\n🔟 Testing Bookmark News ({created_id})...")
        test_api_endpoint('POST', f'/api/news/{created_id}/bookmark')
    
    # Test 11: Get news with filters
    print("\n1️⃣1️⃣ Testing Get News with Filters...")
    test_api_endpoint('GET', '/api/news?category=Tin tức ngành&featured=true&limit=5')
    
    # Test 12: Backup news
    print("\n1️⃣2️⃣ Testing Backup News...")
    test_api_endpoint('POST', '/api/news/backup')
    
    # Test 13: Delete news (cuối cùng để cleanup)
    if created_id:
        print(f"\n1️⃣3️⃣ Testing Delete News ({created_id})...")
        test_api_endpoint('DELETE', f'/api/news/{created_id}')
    
    print("\n" + "=" * 60)
    print("🎉 ALL TESTS COMPLETED!")
    print("=" * 60)

def test_error_cases():
    """Test các trường hợp lỗi"""
    
    print("\n🔴 TESTING ERROR CASES...")
    print("=" * 60)
    
    # Test 1: Create news without title
    print("\n1️⃣ Testing Create News Without Title...")
    test_api_endpoint('POST', '/api/news', {"content": "Test"}, expected_status=400)
    
    # Test 2: Get non-existent news
    print("\n2️⃣ Testing Get Non-existent News...")
    test_api_endpoint('GET', '/api/news/999999', expected_status=404)
    
    # Test 3: Update non-existent news
    print("\n3️⃣ Testing Update Non-existent News...")
    test_api_endpoint('PUT', '/api/news/999999', {"title": "Test"}, expected_status=404)
    
    # Test 4: Delete non-existent news
    print("\n4️⃣ Testing Delete Non-existent News...")
    test_api_endpoint('DELETE', '/api/news/999999', expected_status=404)
    
    # Test 5: Search without query
    print("\n5️⃣ Testing Search Without Query...")
    test_api_endpoint('GET', '/api/news/search', expected_status=400)
    
    print("\n" + "=" * 60)
    print("🔴 ERROR TESTS COMPLETED!")
    print("=" * 60)

if __name__ == "__main__":
    print("🧪 NEWS API TESTING SUITE")
    print("=" * 60)
    print("🔧 Đảm bảo API server đang chạy: python excel_api.py")
    print("📍 API URL: http://localhost:8000")
    print("⏱️  Bắt đầu test sau 2 giây...")
    
    time.sleep(2)
    
    # Chạy test chính
    run_news_api_tests()
    
    # Chạy test error cases
    test_error_cases()
    
    print("\n✅ TẤT CẢ TEST HOÀN THÀNH!")
    print("📊 Kiểm tra kết quả ở trên để đảm bảo API hoạt động đúng.")