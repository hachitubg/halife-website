<template>
  <div class="news-editor bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-newspaper mr-2 text-blue-500"></i>
      Advanced News Copy & Edit Tool
    </h2>

    <!-- Quick Add Form -->
    <form @submit.prevent="saveNews" class="space-y-6">
      <!-- Title -->
      <div>
        <label class="block text-sm font-medium mb-2">📰 Tiêu đề bài viết *</label>
        <input 
          v-model="newsData.title" 
          type="text" 
          required
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Copy và paste tiêu đề bài viết vào đây..."
        >
      </div>

      <!-- Content Editor với toolbar -->
      <div>
        <label class="block text-sm font-medium mb-2">📝 Nội dung bài viết *</label>
        
        <!-- Editor Toolbar -->
        <div class="border border-gray-300 rounded-t-lg bg-gray-50 p-3 flex flex-wrap items-center gap-2">
          <div class="flex items-center space-x-1">
            <button type="button" @click="formatText('bold')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Bold">
              <i class="fas fa-bold"></i>
            </button>
            <button type="button" @click="formatText('italic')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Italic">
              <i class="fas fa-italic"></i>
            </button>
            <button type="button" @click="formatText('underline')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Underline">
              <i class="fas fa-underline"></i>
            </button>
          </div>
          
          <div class="w-px h-6 bg-gray-300"></div>
          
          <div class="flex items-center space-x-1">
            <button type="button" @click="insertHeading('h2')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm">H2</button>
            <button type="button" @click="insertHeading('h3')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm">H3</button>
            <button type="button" @click="insertList('ul')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Bullet List">
              <i class="fas fa-list-ul"></i>
            </button>
            <button type="button" @click="insertList('ol')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100" title="Number List">
              <i class="fas fa-list-ol"></i>
            </button>
          </div>
          
          <div class="w-px h-6 bg-gray-300"></div>
          
          <div class="flex items-center space-x-1">
            <button type="button" @click="showImageManager = true" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600" title="Quản lý hình ảnh">
              <i class="fas fa-image mr-1"></i> Hình ảnh
            </button>
            <button type="button" @click="cleanContent" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600" title="Dọn dẹp HTML">
              <i class="fas fa-broom mr-1"></i> Dọn dẹp
            </button>
            <button type="button" @click="clearContent" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" title="Xóa tất cả">
              <i class="fas fa-trash mr-1"></i> Xóa
            </button>
          </div>
        </div>
        
        <!-- Content Editor -->
        <div class="border-l border-r border-b border-gray-300 rounded-b-lg overflow-hidden">
          <div 
            ref="contentEditor"
            @input="updateContent"
            @paste="handlePaste"
            contenteditable="true"
            class="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style="max-height: 600px; overflow-y: auto;"
          ></div>
          
          <!-- Editor Footer -->
          <div class="bg-gray-50 p-2 border-t flex items-center justify-between text-sm">
            <div class="flex items-center space-x-4">
              <span class="text-gray-600">📊 {{ contentStats.words }} từ • {{ contentStats.images }} hình • {{ contentStats.paragraphs }} đoạn</span>
              <span v-if="lastImageError" class="text-red-600">⚠️ {{ lastImageError }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <button type="button" @click="toggleSourceMode" :class="sourceMode ? 'bg-blue-500 text-white' : 'bg-gray-200'" class="px-3 py-1 rounded text-xs">
                {{ sourceMode ? 'Visual' : 'HTML' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Source Code Editor (khi bật source mode) -->
      <div v-if="sourceMode" class="border border-gray-300 rounded-lg">
        <div class="bg-gray-800 text-white p-2 rounded-t-lg flex items-center justify-between">
          <span class="text-sm">🔧 HTML Source Code</span>
          <button type="button" @click="applySourceChanges" class="bg-green-600 px-3 py-1 rounded text-xs hover:bg-green-700">
            Áp dụng thay đổi
          </button>
        </div>
        <textarea 
          v-model="sourceContent"
          class="w-full h-64 p-3 font-mono text-sm border-0 focus:outline-none"
          placeholder="Edit HTML source code here..."
        ></textarea>
      </div>

      <!-- Quick Settings -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium mb-1">📂 Danh mục</label>
          <select v-model="newsData.category" class="w-full px-3 py-2 border rounded-lg">
            <option>Kiến thức chăm sóc</option>
            <option>Công nghệ mới</option>
            <option>Hướng dẫn sử dụng</option>
            <option>Tin tức ngành</option>
            <option>Phòng chống dịch bệnh</option>
            <option>Dinh dưỡng</option>
            <option>Môi trường chăn nuôi</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">👨‍⚕️ Tác giả</label>
          <input 
            v-model="newsData.author" 
            type="text"
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="BS HALIFE"
          >
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">🖼️ Ảnh đại diện</label>
          <input 
            v-model="newsData.featuredImage" 
            type="url"
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="URL ảnh đại diện..."
            @input="validateImageUrl"
          >
        </div>

        <div class="flex items-center space-x-4 pt-6">
          <label class="flex items-center">
            <input type="checkbox" v-model="newsData.isFeatured" class="mr-2">
            <span class="text-sm">⭐ Tin nổi bật</span>
          </label>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-between items-center pt-4 border-t">
        <div class="text-sm text-gray-600">
          📈 Ước tính thời gian đọc: {{ estimatedReadTime }}
        </div>
        <div class="space-x-3">
          <button 
            type="button"
            @click="previewNews"
            class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            👀 Xem trước
          </button>
          <button 
            type="submit"
            :disabled="!newsData.title || !newsData.content"
            class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💾 Tạo code
          </button>
        </div>
      </div>
    </form>

    <!-- Image Manager Modal -->
    <div v-if="showImageManager" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showImageManager = false">
      <div class="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto w-full" @click.stop>
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">🖼️ Quản lý hình ảnh</h3>
          <button @click="showImageManager = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6">
          <!-- Image Detection -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">📋 Hình ảnh trong bài viết ({{ detectedImages.length }})</h4>
            <div v-if="detectedImages.length === 0" class="text-gray-500 text-center py-8">
              <i class="fas fa-image text-4xl mb-3"></i>
              <p>Chưa có hình ảnh nào trong bài viết</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="(img, index) in detectedImages" 
                :key="index"
                class="border rounded-lg p-3"
              >
                <div class="aspect-video bg-gray-100 rounded mb-3 overflow-hidden">
                  <img 
                    :src="img.src" 
                    :alt="img.alt || 'Image'"
                    class="w-full h-full object-cover"
                    @error="handleImageError($event, index)"
                    @load="handleImageLoad($event, index)"
                  >
                </div>
                
                <div class="space-y-2">
                  <div>
                    <label class="block text-xs font-medium mb-1">URL:</label>
                    <input 
                      v-model="img.src"
                      @input="updateImageInContent(index, 'src', $event.target.value)"
                      class="w-full px-2 py-1 text-xs border rounded"
                      placeholder="URL hình ảnh..."
                    >
                  </div>
                  
                  <div>
                    <label class="block text-xs font-medium mb-1">Alt text:</label>
                    <input 
                      v-model="img.alt"
                      @input="updateImageInContent(index, 'alt', $event.target.value)"
                      class="w-full px-2 py-1 text-xs border rounded"
                      placeholder="Mô tả hình ảnh..."
                    >
                  </div>
                  
                  <div class="flex justify-between items-center pt-2">
                    <div class="flex items-center space-x-2">
                      <span :class="img.status === 'loaded' ? 'text-green-600' : img.status === 'error' ? 'text-red-600' : 'text-yellow-600'" class="text-xs">
                        {{ img.status === 'loaded' ? '✅ OK' : img.status === 'error' ? '❌ Lỗi' : '⏳ Đang tải' }}
                      </span>
                    </div>
                    <button 
                      @click="removeImageFromContent(index)"
                      class="text-red-500 hover:text-red-700 text-xs"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add New Image -->
          <div class="border-t pt-6">
            <h4 class="font-medium mb-3">➕ Thêm hình ảnh mới</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input 
                  v-model="newImageUrl"
                  type="url"
                  class="w-full px-3 py-2 border rounded-lg"
                  placeholder="Paste URL hình ảnh..."
                  @keyup.enter="addNewImage"
                >
              </div>
              <div>
                <input 
                  v-model="newImageAlt"
                  type="text"
                  class="w-full px-3 py-2 border rounded-lg"
                  placeholder="Mô tả hình ảnh..."
                  @keyup.enter="addNewImage"
                >
              </div>
              <div>
                <button 
                  @click="addNewImage"
                  :disabled="!newImageUrl"
                  class="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  ➕ Thêm vào bài viết
                </button>
              </div>
            </div>
          </div>
          
          <!-- Quick Image Sources -->
          <div class="border-t pt-6 mt-6">
            <h4 class="font-medium mb-3">🔗 Nguồn hình ảnh miễn phí</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <a href="https://unsplash.com/s/photos/veterinary" target="_blank" class="text-center p-3 border rounded-lg hover:bg-gray-50">
                <div class="text-2xl mb-1">📸</div>
                <div class="text-xs">Unsplash</div>
              </a>
              <a href="https://pixabay.com/images/search/animals/" target="_blank" class="text-center p-3 border rounded-lg hover:bg-gray-50">
                <div class="text-2xl mb-1">🖼️</div>
                <div class="text-xs">Pixabay</div>
              </a>
              <a href="https://www.pexels.com/search/animal/" target="_blank" class="text-center p-3 border rounded-lg hover:bg-gray-50">
                <div class="text-2xl mb-1">📷</div>
                <div class="text-xs">Pexels</div>
              </a>
              <button @click="generatePlaceholderImage" class="text-center p-3 border rounded-lg hover:bg-gray-50">
                <div class="text-2xl mb-1">🎨</div>
                <div class="text-xs">Placeholder</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generated Code -->
    <div v-if="generatedCode" class="mt-8 bg-gray-50 border-2 border-dashed border-blue-300 rounded-lg p-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-semibold text-lg">📋 Code để thêm vào news.js</h3>
        <button 
          @click="copyCode"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          📋 Copy Code
        </button>
      </div>
      
      <div class="bg-white rounded border p-3 text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
        <pre>{{ generatedCode }}</pre>
      </div>
      
      <div class="mt-3 text-sm text-gray-600">
        <p><strong>Hướng dẫn:</strong></p>
        <ol class="list-decimal list-inside space-y-1">
          <li>Copy code trên</li>
          <li>Mở file <code class="bg-gray-200 px-1 rounded">src/data/news.js</code></li>
          <li>Thêm object vào array <code class="bg-gray-200 px-1 rounded">news</code> (ở đầu mảng)</li>
          <li>Save file và refresh trang để thấy tin tức mới</li>
        </ol>
      </div>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="showPreview = false">
      <div class="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto w-full" @click.stop>
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold">👀 Xem trước bài viết</h3>
          <button @click="showPreview = false" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6">
          <!-- Article Preview -->
          <article class="prose max-w-none">
            <h1 class="text-2xl font-bold mb-4">{{ newsData.title }}</h1>
            
            <div class="flex items-center text-sm text-gray-600 mb-6 space-x-4">
              <span>📅 {{ new Date().toLocaleDateString('vi-VN') }}</span>
              <span>👨‍⚕️ {{ newsData.author }}</span>
              <span>📂 {{ newsData.category }}</span>
              <span>⏱️ {{ estimatedReadTime }}</span>
              <span v-if="newsData.isFeatured" class="text-yellow-600">⭐ Nổi bật</span>
            </div>
            
            <div v-if="newsData.featuredImage" class="mb-6">
              <img :src="newsData.featuredImage" alt="Featured image" class="w-full h-64 object-cover rounded-lg">
            </div>
            
            <div class="content-preview" v-html="newsData.content"></div>
          </article>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      ✅ {{ successMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewsEditorView',
  data() {
    return {
      newsData: {
        title: '',
        content: '',
        category: 'Tin tức ngành',
        author: 'Admin HALIFE',
        isFeatured: false,
        featuredImage: ''
      },
      generatedCode: '',
      showPreview: false,
      showSuccess: false,
      successMessage: '',
      showImageManager: false,
      sourceMode: false,
      sourceContent: '',
      detectedImages: [],
      newImageUrl: '',
      newImageAlt: '',
      lastImageError: ''
    }
  },

  computed: {
    contentStats() {
      if (!this.newsData.content) return { words: 0, images: 0, paragraphs: 0 }
      
      const textOnly = this.newsData.content.replace(/<[^>]*>/g, ' ')
      const words = textOnly.trim().split(/\s+/).filter(word => word.length > 0).length
      const images = (this.newsData.content.match(/<img/g) || []).length
      const paragraphs = (this.newsData.content.match(/<p/g) || []).length
      
      return { words, images, paragraphs }
    },

    estimatedReadTime() {
      const words = this.contentStats.words
      const minutes = Math.ceil(words / 200)
      return minutes + ' phút'
    }
  },

  watch: {
    'newsData.content': {
      handler() {
        this.detectImages()
      },
      immediate: true
    },

    showImageManager() {
      if (this.showImageManager) {
        this.detectImages()
      }
    }
  },

  methods: {
    handlePaste(event) {
      // Get clipboard data
      const clipboardData = event.clipboardData || window.clipboardData
      const html = clipboardData.getData('text/html')
      const text = clipboardData.getData('text/plain')

      if (html) {
        // Clean HTML before pasting
        event.preventDefault()
        const cleanedHtml = this.cleanPastedContent(html)
        document.execCommand('insertHTML', false, cleanedHtml)
        setTimeout(() => this.updateContent(), 100)
      }
    },

    cleanPastedContent(html) {
      // Remove scripts, styles, and other unwanted elements
      let cleaned = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<link[^>]*>/gi, '')
        .replace(/<meta[^>]*>/gi, '')
        .replace(/class="[^"]*"/gi, '')
        .replace(/style="[^"]*"/gi, '')
        .replace(/id="[^"]*"/gi, '')
        .replace(/data-[^=]*="[^"]*"/gi, '')
        .replace(/<font[^>]*>/gi, '')
        .replace(/<\/font>/gi, '')
        .replace(/<span[^>]*>/gi, '<span>')
        .replace(/<div[^>]*>/gi, '<div>')

      // Fix image sources - convert relative URLs to absolute
      cleaned = cleaned.replace(/<img([^>]*src=")([^"]*)/gi, (match, prefix, src) => {
        if (src.startsWith('http')) return match
        if (src.startsWith('//')) return prefix + 'https:' + src
        if (src.startsWith('/')) {
          // Try to get domain from current page or provide fallback
          const currentDomain = window.location.origin
          return prefix + currentDomain + src
        }
        return match
      })

      return cleaned
    },

    updateContent() {
      this.newsData.content = this.$refs.contentEditor.innerHTML
      if (this.sourceMode) {
        this.sourceContent = this.newsData.content
      }
    },

    clearContent() {
      if (confirm('Bạn có chắc muốn xóa toàn bộ nội dung?')) {
        this.$refs.contentEditor.innerHTML = ''
        this.newsData.content = ''
        this.detectedImages = []
      }
    },

    cleanContent() {
      const content = this.$refs.contentEditor.innerHTML
      const cleaned = this.cleanPastedContent(content)
      this.$refs.contentEditor.innerHTML = cleaned
      this.updateContent()
      this.showMessage('Đã dọn dẹp nội dung!')
    },

    formatText(command) {
      document.execCommand(command, false, null)
      this.updateContent()
    },

    insertHeading(tag) {
      const selection = window.getSelection()
      if (selection.toString()) {
        document.execCommand('formatBlock', false, tag)
      } else {
        document.execCommand('insertHTML', false, `<${tag}>Tiêu đề</${tag}>`)
      }
      this.updateContent()
    },

    insertList(type) {
      if (type === 'ul') {
        document.execCommand('insertUnorderedList', false, null)
      } else {
        document.execCommand('insertOrderedList', false, null)
      }
      this.updateContent()
    },

    toggleSourceMode() {
      this.sourceMode = !this.sourceMode
      if (this.sourceMode) {
        this.sourceContent = this.newsData.content
      }
    },

    applySourceChanges() {
      this.newsData.content = this.sourceContent
      this.$refs.contentEditor.innerHTML = this.sourceContent
      this.sourceMode = false
      this.showMessage('Đã áp dụng thay đổi từ HTML source!')
    },

    detectImages() {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = this.newsData.content
      const images = tempDiv.querySelectorAll('img')
      
      this.detectedImages = Array.from(images).map(img => ({
        src: img.src || '',
        alt: img.alt || '',
        status: 'loading'
      }))
    },

    handleImageError(event, index) {
      if (this.detectedImages[index]) {
        this.detectedImages[index].status = 'error'
        this.lastImageError = `Hình ${index + 1} không tải được`
      }
    },

    handleImageLoad(event, index) {
      if (this.detectedImages[index]) {
        this.detectedImages[index].status = 'loaded'
        this.lastImageError = ''
      }
    },

    updateImageInContent(index, attribute, value) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = this.newsData.content
      const images = tempDiv.querySelectorAll('img')
      
      if (images[index]) {
        images[index][attribute] = value
        this.newsData.content = tempDiv.innerHTML
        this.$refs.contentEditor.innerHTML = this.newsData.content
      }
    },

    removeImageFromContent(index) {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = this.newsData.content
      const images = tempDiv.querySelectorAll('img')
      
      if (images[index]) {
        images[index].remove()
        this.newsData.content = tempDiv.innerHTML
        this.$refs.contentEditor.innerHTML = this.newsData.content
        this.detectImages()
        this.showMessage('Đã xóa hình ảnh!')
      }
    },

    addNewImage() {
      if (!this.newImageUrl) return
      
      const imageHtml = `<p><img src="${this.newImageUrl}" alt="${this.newImageAlt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;"></p>`
      
      // Insert at cursor position or end of content
      if (this.$refs.contentEditor === document.activeElement) {
        document.execCommand('insertHTML', false, imageHtml)
      } else {
        this.$refs.contentEditor.innerHTML += imageHtml
      }
      
      this.updateContent()
      this.newImageUrl = ''
      this.newImageAlt = ''
      this.showMessage('Đã thêm hình ảnh vào bài viết!')
    },

    generatePlaceholderImage() {
      const width = 600
      const height = 400
      const text = encodeURIComponent('HALIFE Animals')
      const url = `https://via.placeholder.com/${width}x${height}/3B82F6/FFFFFF?text=${text}`
      
      this.newImageUrl = url
      this.newImageAlt = 'HALIFE Animals placeholder image'
    },

    validateImageUrl() {
      // Simple URL validation for featured image
      const url = this.newsData.featuredImage
      if (url && !url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        this.lastImageError = 'URL ảnh đại diện có thể không hợp lệ'
      } else {
        this.lastImageError = ''
      }
    },

    generateExcerpt(content) {
      const textOnly = content.replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      
      return textOnly.length > 200 ? textOnly.substring(0, 200) + '...' : textOnly
    },

    generateTags(title, content) {
      const commonWords = ['và', 'của', 'trong', 'với', 'cho', 'từ', 'về', 'các', 'một', 'có', 'được', 'là', 'sẽ', 'để', 'này', 'đó', 'những', 'như', 'cũng', 'hay', 'việc', 'theo', 'người', 'khi', 'tại', 'sau', 'trước']
      
      const allText = (title + ' ' + content.replace(/<[^>]*>/g, '')).toLowerCase()
      const words = allText.match(/\b[\w]{3,}\b/g) || []
      
      const wordCount = {}
      words.forEach(word => {
        if (!commonWords.includes(word) && word.length > 3) {
          wordCount[word] = (wordCount[word] || 0) + 1
        }
      })

      return Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word)
    },

    extractFirstImage(content) {
      const imgMatch = content.match(/<img[^>]+src="([^"]*)"/)
      return imgMatch ? imgMatch[1] : this.newsData.featuredImage || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop'
    },

    saveNews() {
      if (!this.newsData.title || !this.newsData.content) {
        alert('❌ Vui lòng nhập tiêu đề và nội dung!')
        return
      }

      // Validate images before saving
      if (this.detectedImages.some(img => img.status === 'error')) {
        if (!confirm('⚠️ Có một số hình ảnh bị lỗi. Bạn có muốn tiếp tục không?')) {
          return
        }
      }

      const newsObject = {
        id: Date.now(),
        title: this.newsData.title,
        excerpt: this.generateExcerpt(this.newsData.content),
        content: `\`${this.newsData.content.replace(/`/g, '\\`')}\`,`,
        date: new Date().toLocaleDateString('vi-VN'),
        author: this.newsData.author,
        category: this.newsData.category,
        isPublished: true,
        isFeatured: this.newsData.isFeatured,
        readTime: this.estimatedReadTime,
        views: Math.floor(Math.random() * 500) + 100,
        likes: 0,
        comments: 0,
        shares: 0,
        bookmarks: 0,
        image: this.extractFirstImage(this.newsData.content),
        tags: this.generateTags(this.newsData.title, this.newsData.content)
      }

      // Generate code string
      this.generatedCode = this.formatObjectToCode(newsObject)
      
      // Show success message
      this.showMessage('Đã tạo code thành công! Copy và thêm vào news.js', 'success')

      // Scroll to generated code
      setTimeout(() => {
        const codeElement = document.querySelector('.bg-gray-50.border-2')
        if (codeElement) {
          codeElement.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    },

    formatObjectToCode(obj) {
      let code = '{\n'
      
      Object.entries(obj).forEach(([key, value]) => {
        let formattedValue
        
        if (typeof value === 'string') {
          if (key === 'content') {
            formattedValue = value // Already wrapped and escaped
          } else {
            formattedValue = `'${value.replace(/'/g, "\\'")}'`
          }
        } else if (Array.isArray(value)) {
          formattedValue = `[${value.map(v => `'${v}'`).join(', ')}]`
        } else {
          formattedValue = value
        }
        
        code += `  ${key}: ${formattedValue},\n`
      })
      
      code += '}'
      return code
    },

    previewNews() {
      if (!this.newsData.title || !this.newsData.content) {
        alert('❌ Vui lòng nhập tiêu đề và nội dung để xem trước!')
        return
      }
      this.showPreview = true
    },

    async copyCode() {
      try {
        await navigator.clipboard.writeText(this.generatedCode)
        this.showMessage('Đã copy code vào clipboard!', 'success')
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = this.generatedCode
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        this.showMessage('Đã copy code!', 'success')
      }
    },

    showMessage(message, type = 'info') {
      this.successMessage = message
      this.showSuccess = true
      setTimeout(() => {
        this.showSuccess = false
      }, 3000)
    },

    // Quick content templates
    insertTemplate(type) {
      let template = ''
      
      switch(type) {
        case 'intro':
          template = '<h2>Giới thiệu</h2><p>Trong lĩnh vực chăn nuôi và thú y, việc [chủ đề] là một yếu tố quan trọng...</p>'
          break
        case 'benefits':
          template = '<h3>Lợi ích:</h3><ul><li>Lợi ích 1</li><li>Lợi ích 2</li><li>Lợi ích 3</li></ul>'
          break
        case 'steps':
          template = '<h3>Các bước thực hiện:</h3><ol><li>Bước 1: Chuẩn bị</li><li>Bước 2: Thực hiện</li><li>Bước 3: Đánh giá kết quả</li></ol>'
          break
        case 'conclusion':
          template = '<h2>Kết luận</h2><p>Tóm lại, việc áp dụng những kiến thức này sẽ giúp nâng cao hiệu quả trong chăn nuôi...</p>'
          break
      }
      
      document.execCommand('insertHTML', false, template)
      this.updateContent()
    }
  },

  mounted() {
    // Set initial placeholder
    this.$refs.contentEditor.innerHTML = `
      <div style="color: #9ca3af; font-style: italic; padding: 20px; border: 2px dashed #d1d5db; border-radius: 8px; text-align: center;">
        <h3 style="margin-top: 0;">📰 Hướng dẫn sử dụng Editor</h3>
        <p><strong>Cách 1 - Copy từ website:</strong></p>
        <ol style="text-align: left; max-width: 500px; margin: 0 auto;">
          <li>Vào website có bài viết cần copy</li>
          <li>Bôi đen toàn bộ nội dung (Ctrl+A)</li>
          <li>Copy (Ctrl+C)</li>
          <li>Paste vào đây (Ctrl+V)</li>
          <li>Dùng các tool để chỉnh sửa</li>
        </ol>
        <p><strong>Cách 2 - Viết mới:</strong></p>
        <p>Click vào đây và bắt đầu viết nội dung...</p>
      </div>
    `
    
    // Clear placeholder when user starts typing
    this.$refs.contentEditor.addEventListener('focus', () => {
      if (this.$refs.contentEditor.innerHTML.includes('9ca3af')) {
        this.$refs.contentEditor.innerHTML = ''
      }
    })

    // Auto-save to localStorage (optional)
    setInterval(() => {
      if (this.newsData.title || this.newsData.content) {
        localStorage.setItem('halife-news-draft', JSON.stringify(this.newsData))
      }
    }, 30000) // Save every 30 seconds

    // Load draft if exists
    const draft = localStorage.getItem('halife-news-draft')
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        if (parsed.title || parsed.content) {
          if (confirm('📝 Tìm thấy bản nháp đã lưu. Bạn có muốn khôi phục không?')) {
            this.newsData = { ...this.newsData, ...parsed }
            this.$refs.contentEditor.innerHTML = parsed.content || ''
          }
        }
      } catch (e) {
        console.warn('Could not load draft:', e)
      }
    }
  },

  beforeUnmount() {
    // Save current work before leaving
    if (this.newsData.title || this.newsData.content) {
      localStorage.setItem('halife-news-draft', JSON.stringify(this.newsData))
    }
  }
}
</script>

<style scoped>
.content-preview {
  line-height: 1.7;
}

.content-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
}

.content-preview h1, 
.content-preview h2, 
.content-preview h3 {
  margin: 24px 0 12px 0;
  font-weight: 600;
}

.content-preview h2 {
  font-size: 1.5rem;
  color: #1f2937;
}

.content-preview h3 {
  font-size: 1.25rem;
  color: #374151;
}

.content-preview p {
  margin: 12px 0;
  text-align: justify;
}

.content-preview ul, 
.content-preview ol {
  margin: 12px 0;
  padding-left: 24px;
}

.content-preview li {
  margin: 6px 0;
}

.content-preview blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 16px;
  margin: 16px 0;
  font-style: italic;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 4px;
}

.content-preview strong {
  font-weight: 600;
  color: #1f2937;
}

/* Editor styles */
[contenteditable="true"]:focus {
  outline: none;
}

[contenteditable="true"] img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 8px 0;
  cursor: pointer;
}

[contenteditable="true"] img:hover {
  opacity: 0.8;
  transition: opacity 0.2s;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Toolbar button hover effects */
.toolbar-btn:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Image manager grid responsive */
@media (max-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

/* Loading states */
.loading-image {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Success animation */
.success-message {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>