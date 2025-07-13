# api/excel_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Cho phép frontend gọi API

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'HALIFE Excel API is running!',
        'version': '1.0.0'
    })

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({
        'message': 'API hoạt động tốt!',
        'data': ['sản phẩm 1', 'sản phẩm 2']
    })

if __name__ == '__main__':
    print("🚀 Starting HALIFE Excel API...")
    print("📍 API URL: http://localhost:8000")
    print("🔗 Test: http://localhost:8000/api/test")
    app.run(host='0.0.0.0', port=8000, debug=True)