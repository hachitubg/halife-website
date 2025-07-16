<template>
  <div class="news-editor bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold mb-6 flex items-center">
      <i class="fas fa-newspaper mr-2 text-blue-500"></i>
      Quản lý tin tức
    </h2>

    <!-- Tab Navigation -->
    <div class="mb-6 border-b">
      <nav class="flex space-x-8">
        <button 
          @click="activeTab = 'list'"
          :class="activeTab === 'list' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'"
          class="py-2 px-1 border-b-2 font-medium text-sm"
        >
          📋 Danh sách tin tức
        </button>
        <button 
          @click="activeTab = 'create'"
          :class="activeTab === 'create' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'"
          class="py-2 px-1 border-b-2 font-medium text-sm"
        >
          ➕ Thêm tin tức mới
        </button>
      </nav>
    </div>

    <!-- News List Tab -->
    <div v-if="activeTab === 'list'">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div class="mb-4 md:mb-0">
          <h3 class="text-lg font-semibold text-gray-800">Danh sách tin tức</h3>
          <p class="text-sm text-gray-600">Tổng cộng: {{ newsStats.totalNews }} tin tức</p>
        </div>
        
        <div class="flex flex-col md:flex-row gap-3">
          <select v-model="listFilter.category" class="px-3 py-2 border rounded-lg text-sm">
            <option value="">Tất cả danh mục</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
          
          <select v-model="listFilter.status" class="px-3 py-2 border rounded-lg text-sm">
            <option value="">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Nháp</option>
            <option value="featured">Nổi bật</option>
          </select>
          
          <input 
            v-model="listFilter.search" 
            type="text" 
            placeholder="Tìm kiếm tin tức..." 
            class="px-3 py-2 border rounded-lg text-sm"
          >
        </div>
      </div>

      <!-- News Table -->
      <div class="overflow-x-auto">
        <table class="w-full bg-white border rounded-lg">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tin tức</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="news in paginatedNewsList" :key="news.id" class="hover:bg-gray-50">
              <td class="px-4 py-4">
                <div class="flex items-start space-x-3">
                  <img :src="news.image" :alt="news.title" class="w-16 h-12 object-cover rounded">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 line-clamp-2">{{ news.title }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ news.author }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ news.category }}
                </span>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center space-x-2">
                  <span 
                    :class="news.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ news.isPublished ? 'Đã xuất bản' : 'Nháp' }}
                  </span>
                  <span v-if="news.isFeatured" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⭐ Nổi bật
                  </span>
                </div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ formatDate(news.createdAt || news.date) }}
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center space-x-2">
                  <button 
                    @click="editNews(news)"
                    class="text-blue-600 hover:text-blue-800 p-1"
                    title="Chỉnh sửa"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="duplicateNews(news)"
                    class="text-green-600 hover:text-green-800 p-1"
                    title="Nhân bản"
                  >
                    <i class="fas fa-copy"></i>
                  </button>
                  <button 
                    @click="togglePublish(news)"
                    :class="news.isPublished ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                    class="p-1"
                    :title="news.isPublished ? 'Ẩn tin' : 'Xuất bản'"
                  >
                    <i :class="news.isPublished ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                  <button 
                    @click="deleteNews(news)"
                    class="text-red-600 hover:text-red-800 p-1"
                    title="Xóa"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="paginatedNewsList.length === 0" class="text-center py-12">
        <i class="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không có tin tức nào</h3>
        <p class="text-gray-500 mb-4">Hãy tạo tin tức mới</p>
        <button 
          @click="activeTab = 'create'"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Tạo tin tức mới
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between">
        <div class="text-sm text-gray-500">
          Hiển thị {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredNewsList.length) }} 
          trong tổng số {{ filteredNewsList.length }} tin tức
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Trước
          </button>
          <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Form Tab -->
    <div v-if="activeTab === 'create'">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-800">
          {{ editingNews ? 'Chỉnh sửa tin tức' : 'Tạo tin tức mới' }}
        </h3>
        <button 
          v-if="editingNews"
          @click="cancelEdit"
          class="text-gray-600 hover:text-gray-800"
        >
          <i class="fas fa-times mr-1"></i> Hủy chỉnh sửa
        </button>
      </div>

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
            placeholder="Nhập tiêu đề bài viết..."
          >
        </div>

        <!-- Content Editor -->
        <div>
          <label class="block text-sm font-medium mb-2">📝 Nội dung bài viết *</label>
          
          <!-- Editor Toolbar -->
          <div class="border border-gray-300 rounded-t-lg bg-gray-50 p-3 flex flex-wrap items-center gap-2">
            <div class="flex items-center space-x-1">
              <button type="button" @click="formatText('bold')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100">
                <i class="fas fa-bold"></i>
              </button>
              <button type="button" @click="formatText('italic')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100">
                <i class="fas fa-italic"></i>
              </button>
              <button type="button" @click="formatText('underline')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100">
                <i class="fas fa-underline"></i>
              </button>
            </div>
            
            <div class="w-px h-6 bg-gray-300"></div>
            
            <div class="flex items-center space-x-1">
              <button type="button" @click="insertHeading('h2')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm">H2</button>
              <button type="button" @click="insertHeading('h3')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100 text-sm">H3</button>
              <button type="button" @click="insertList('ul')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100">
                <i class="fas fa-list-ul"></i>
              </button>
              <button type="button" @click="insertList('ol')" class="px-3 py-1 bg-white border rounded hover:bg-gray-100">
                <i class="fas fa-list-ol"></i>
              </button>
            </div>
            
            <div class="w-px h-6 bg-gray-300"></div>
            
            <div class="flex items-center space-x-1">
              <button type="button" @click="cleanContent" class="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                <i class="fas fa-broom mr-1"></i> Dọn dẹp
              </button>
              <button type="button" @click="clearContent" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
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
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-gray-600">⏱️ {{ estimatedReadTime }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Settings -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">📂 Danh mục</label>
            <select v-model="newsData.category" class="w-full px-3 py-2 border rounded-lg">
              <option v-for="category in categories" :key="category">{{ category }}</option>
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
              :disabled="!newsData.title || !newsData.content || isLoading"
              class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? '⏳ Đang lưu...' : (editingNews ? '💾 Cập nhật' : '💾 Tạo mới') }}
            </button>
          </div>
        </div>
      </form>
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

    <!-- Success/Error Messages -->
    <div v-if="showMessage" :class="messageType === 'success' ? 'bg-green-500' : 'bg-red-500'" class="fixed top-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg z-50">
      {{ messageText }}
    </div>
  </div>
</template>

<script>
import { newsCategories, newsEditorService, newsService } from '@/data/news.js'

export default {
  name: 'NewsEditorView',
  data() {
    return {
      activeTab: 'list', // 'list' or 'create'
      
      // News list management
      newsList: [],
      newsStats: {
        totalNews: 0,
        publishedNews: 0,
        featuredNews: 0
      },
      
      // Filters for news list
      listFilter: {
        category: '',
        status: '',
        search: ''
      },
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 10,
      
      // Edit mode
      editingNews: null,
      
      // Form data
      newsData: {
        title: '',
        content: '',
        category: 'Tin tức ngành',
        author: 'Admin HALIFE',
        isFeatured: false,
        featuredImage: ''
      },
      categories: newsCategories,
      showPreview: false,
      showImageManager: false,
      showMessage: false,
      messageText: '',
      messageType: 'success',
      sourceMode: false,
      sourceContent: '',
      detectedImages: [],
      newImageUrl: '',
      newImageAlt: '',
      lastImageError: '',
      isLoading: false
    }
  },

  computed: {
    filteredNewsList() {
      let filtered = [...this.newsList]
      
      // Filter by category
      if (this.listFilter.category) {
        filtered = filtered.filter(news => news.category === this.listFilter.category)
      }
      
      // Filter by status
      if (this.listFilter.status) {
        switch (this.listFilter.status) {
          case 'published':
            filtered = filtered.filter(news => news.isPublished)
            break
          case 'draft':
            filtered = filtered.filter(news => !news.isPublished)
            break
          case 'featured':
            filtered = filtered.filter(news => news.isFeatured)
            break
        }
      }
      
      // Filter by search
      if (this.listFilter.search) {
        const search = this.listFilter.search.toLowerCase()
        filtered = filtered.filter(news => 
          news.title.toLowerCase().includes(search) ||
          news.author.toLowerCase().includes(search) ||
          news.category.toLowerCase().includes(search)
        )
      }
      
      return filtered
    },
    
    paginatedNewsList() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredNewsList.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredNewsList.length / this.itemsPerPage)
    },

    contentStats() {
      return newsEditorService.getContentStats(this.newsData.content)
    },

    estimatedReadTime() {
      return newsEditorService.calculateReadTime(this.newsData.content)
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
    },
    
    listFilter: {
      handler() {
        this.currentPage = 1
      },
      deep: true
    }
  },

  methods: {
    // ============================================
    // NEWS LIST MANAGEMENT
    // ============================================
    async loadNewsList() {
      try {
        const response = await newsService.getAllNews()
        if (response.success) {
          this.newsList = response.data || []
          this.updateStats()
        }
      } catch (error) {
        console.error('Error loading news list:', error)
        this.showErrorMessage('Lỗi tải danh sách tin tức')
      }
    },
    
    updateStats() {
      this.newsStats = {
        totalNews: this.newsList.length,
        publishedNews: this.newsList.filter(n => n.isPublished).length,
        featuredNews: this.newsList.filter(n => n.isFeatured).length
      }
    },
    
    editNews(news) {
      this.editingNews = news
      this.newsData = {
        title: news.title,
        content: news.content,
        category: news.category,
        author: news.author,
        isFeatured: news.isFeatured,
        featuredImage: news.image
      }
      this.activeTab = 'create'
      
      // Đợi DOM update xong rồi mới set innerHTML
      this.$nextTick(() => {
        if (this.$refs.contentEditor) {
          this.$refs.contentEditor.innerHTML = news.content
        }
      })
    },
    
    cancelEdit() {
      this.editingNews = null
      this.resetForm()
    },
    
    async duplicateNews(news) {
      if (!confirm('Bạn có muốn nhân bản tin tức này?')) return
      
      const duplicatedData = {
        title: `[Copy] ${news.title}`,
        content: news.content,
        category: news.category,
        author: news.author,
        isFeatured: false,
        featuredImage: news.image
      }
      
      try {
        const result = await newsEditorService.saveNews(duplicatedData)
        if (result.success) {
          this.showSuccessMessage('Đã nhân bản tin tức thành công!')
          this.loadNewsList()
        } else {
          this.showErrorMessage(result.message)
        }
      } catch (error) {
        this.showErrorMessage('Lỗi nhân bản tin tức')
      }
    },
    
    async togglePublish(news) {
      const action = news.isPublished ? 'ẩn' : 'xuất bản'
      if (!confirm(`Bạn có muốn ${action} tin tức này?`)) return
      
      try {
        const result = await newsEditorService.updateNews(news.id, {
          isPublished: !news.isPublished
        })
        
        if (result.success) {
          this.showSuccessMessage(`Đã ${action} tin tức thành công!`)
          this.loadNewsList()
        } else {
          this.showErrorMessage(result.message)
        }
      } catch (error) {
        this.showErrorMessage(`Lỗi ${action} tin tức`)
      }
    },
    
    async deleteNews(news) {
      if (!confirm(`Bạn có chắc muốn xóa tin tức "${news.title}"?`)) return
      
      try {
        const result = await newsEditorService.deleteNews(news.id)
        if (result.success) {
          this.showSuccessMessage('Đã xóa tin tức thành công!')
          this.loadNewsList()
        } else {
          this.showErrorMessage(result.message)
        }
      } catch (error) {
        this.showErrorMessage('Lỗi xóa tin tức')
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN')
    },
    // ============================================
    // BASIC EDITOR FUNCTIONS
    // ============================================
    updateContent() {
      if (!this.$refs.contentEditor) return
      
      this.newsData.content = this.$refs.contentEditor.innerHTML
      if (this.sourceMode) {
        this.sourceContent = this.newsData.content
      }
    },

    handlePaste(event) {
      const clipboardData = event.clipboardData || window.clipboardData
      const html = clipboardData.getData('text/html')

      if (html) {
        event.preventDefault()
        const cleanedHtml = newsEditorService.cleanPastedContent(html)
        document.execCommand('insertHTML', false, cleanedHtml)
        setTimeout(() => this.updateContent(), 100)
      }
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

    clearContent() {
      if (confirm('Bạn có chắc muốn xóa toàn bộ nội dung?')) {
        this.$refs.contentEditor.innerHTML = ''
        this.newsData.content = ''
        this.detectedImages = []
      }
    },

    cleanContent() {
      const content = this.$refs.contentEditor.innerHTML
      const cleaned = newsEditorService.cleanPastedContent(content)
      this.$refs.contentEditor.innerHTML = cleaned
      this.updateContent()
      this.showSuccessMessage('Đã dọn dẹp nội dung!')
    },

    // ============================================
    // SOURCE MODE FUNCTIONS
    // ============================================
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
      this.showSuccessMessage('Đã áp dụng thay đổi từ HTML source!')
    },

    // ============================================
    // IMAGE MANAGEMENT FUNCTIONS
    // ============================================
    detectImages() {
      this.detectedImages = newsEditorService.detectImages(this.newsData.content)
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
        this.showSuccessMessage('Đã xóa hình ảnh!')
      }
    },

    addNewImage() {
      if (!this.newImageUrl) return
      
      const imageHtml = `<p><img src="${this.newImageUrl}" alt="${this.newImageAlt}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;"></p>`
      
      if (this.$refs.contentEditor === document.activeElement) {
        document.execCommand('insertHTML', false, imageHtml)
      } else {
        this.$refs.contentEditor.innerHTML += imageHtml
      }
      
      this.updateContent()
      this.newImageUrl = ''
      this.newImageAlt = ''
      this.showSuccessMessage('Đã thêm hình ảnh vào bài viết!')
    },

    // ============================================
    // MAIN FUNCTIONS - SAVE/PREVIEW
    // ============================================
    async saveNews() {
      if (!this.newsData.title || !this.newsData.content) {
        this.showErrorMessage('❌ Vui lòng nhập tiêu đề và nội dung!')
        return
      }

      // Validate images before saving
      if (this.detectedImages.some(img => img.status === 'error')) {
        if (!confirm('⚠️ Có một số hình ảnh bị lỗi. Bạn có muốn tiếp tục không?')) {
          return
        }
      }

      this.isLoading = true

      try {
        let result
        if (this.editingNews) {
          // Update existing news
          result = await newsEditorService.updateNews(this.editingNews.id, this.newsData)
        } else {
          // Create new news
          result = await newsEditorService.saveNews(this.newsData)
        }
        
        if (result.success) {
          this.showSuccessMessage(result.message)
          this.resetForm()
          this.activeTab = 'list'
          this.loadNewsList()
        } else {
          this.showErrorMessage(result.message)
        }
      } catch (error) {
        this.showErrorMessage('Lỗi hệ thống: ' + error.message)
      } finally {
        this.isLoading = false
      }
    },

    previewNews() {
      if (!this.newsData.title || !this.newsData.content) {
        this.showErrorMessage('❌ Vui lòng nhập tiêu đề và nội dung để xem trước!')
        return
      }
      this.showPreview = true
    },

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    resetForm() {
      this.editingNews = null
      this.newsData = {
        title: '',
        content: '',
        category: 'Tin tức ngành',
        author: 'Admin HALIFE',
        isFeatured: false,
        featuredImage: ''
      }
      
      // Đợi DOM update
      this.$nextTick(() => {
        if (this.$refs.contentEditor) {
          this.$refs.contentEditor.innerHTML = this.getPlaceholderContent()
        }
      })
      
      this.detectedImages = []
      this.clearDraft()
    },

    showSuccessMessage(message) {
      this.messageText = message
      this.messageType = 'success'
      this.showMessage = true
      setTimeout(() => {
        this.showMessage = false
      }, 3000)
    },

    showErrorMessage(message) {
      this.messageText = message
      this.messageType = 'error'
      this.showMessage = true
      setTimeout(() => {
        this.showMessage = false
      }, 5000)
    },

    getPlaceholderContent() {
      return `
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
    },

    // ============================================
    // AUTO-SAVE DRAFT FUNCTIONS
    // ============================================
    saveDraft() {
      if (this.newsData.title || this.newsData.content) {
        localStorage.setItem('halife-news-draft', JSON.stringify(this.newsData))
      }
    },

    clearDraft() {
      localStorage.removeItem('halife-news-draft')
    },

    initializeEditor() {
      if (!this.$refs.contentEditor) return
      
      this.$refs.contentEditor.innerHTML = this.getPlaceholderContent()
      
      // Clear placeholder when user starts typing
      this.$refs.contentEditor.addEventListener('focus', () => {
        if (this.$refs.contentEditor && this.$refs.contentEditor.innerHTML.includes('9ca3af')) {
          this.$refs.contentEditor.innerHTML = ''
        }
      })
    },
  },

  mounted() {
    // Load news list first
    this.loadNewsList()
    
    // Đợi DOM render xong
    this.$nextTick(() => {
      if (this.$refs.contentEditor) {
        this.$refs.contentEditor.innerHTML = this.getPlaceholderContent()
        
        // Clear placeholder when user starts typing
        this.$refs.contentEditor.addEventListener('focus', () => {
          if (this.$refs.contentEditor.innerHTML.includes('9ca3af')) {
            this.$refs.contentEditor.innerHTML = ''
          }
        })
      }
    })

    // Auto-save draft every 30 seconds
    setInterval(() => {
      this.saveDraft()
    }, 30000)
  },

  beforeUnmount() {
    // Save current work before leaving
    this.saveDraft()
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
</style>