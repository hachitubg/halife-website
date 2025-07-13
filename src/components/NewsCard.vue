<template>
  <article 
    class="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
    @click="viewArticleDetail"
  >
    <!-- News Image -->
    <div class="relative overflow-hidden">
      <img 
        :src="article.image" 
        :alt="article.title" 
        class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
      >
      
      <!-- Category Badge -->
      <div class="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
        {{ article.category }}
      </div>
      
      <!-- Featured Badge -->
      <div v-if="article.isFeatured" class="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
        <i class="fas fa-star mr-1"></i>Nổi bật
      </div>
      
      <!-- Reading Time -->
      <div v-if="article.readTime" class="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
        <i class="fas fa-clock mr-1"></i>{{ article.readTime }}
      </div>
    </div>
    
    <!-- News Content -->
    <div class="p-4">
      <!-- Article Meta -->
      <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div class="flex items-center space-x-3">
          <span class="flex items-center">
            <i class="fas fa-calendar mr-1"></i>
            {{ formatDate(article.date) }}
          </span>
          <span v-if="article.author" class="flex items-center">
            <i class="fas fa-user mr-1"></i>
            {{ article.author }}
          </span>
        </div>
        <div v-if="article.views" class="flex items-center">
          <i class="fas fa-eye mr-1"></i>
          {{ formatViews(article.views) }}
        </div>
      </div>
      
      <!-- Article Title -->
      <h3 
        class="font-semibold text-lg mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors"
        @click.stop="viewArticleDetail"
      >
        {{ article.title }}
      </h3>
      
      <!-- Article Excerpt -->
      <p class="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[4rem]">
        {{ article.excerpt }}
      </p>
      
      <!-- Article Tags -->
      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
        <span 
          v-for="tag in article.tags.slice(0, 3)" 
          :key="tag"
          class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
        >
          #{{ tag }}
        </span>
      </div>
      
      <!-- Article Actions -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <div class="flex items-center space-x-3">
          <!-- Like Button -->
          <button 
            @click.stop="toggleLike"
            class="flex items-center text-gray-500 hover:text-red-500 transition-colors text-sm"
            :class="{ 'text-red-500': isLiked }"
          >
            <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'" class="mr-1"></i>
            {{ article.likes || 0 }}
          </button>
          
          <!-- Comment Button -->
          <button 
            @click.stop="$emit('show-comments', article)"
            class="flex items-center text-gray-500 hover:text-blue-500 transition-colors text-sm"
          >
            <i class="far fa-comment mr-1"></i>
            {{ article.comments || 0 }}
          </button>
          
          <!-- Share Button -->
          <button 
            @click.stop="$emit('share', article)"
            class="flex items-center text-gray-500 hover:text-green-500 transition-colors text-sm"
          >
            <i class="fas fa-share-alt mr-1"></i>
            Chia sẻ
          </button>
        </div>
        
        <!-- Read More Button -->
        <button 
          @click.stop="viewArticleDetail"
          class="text-blue-500 hover:text-blue-700 text-sm font-semibold transition-colors flex items-center group"
        >
          Đọc thêm
          <i class="fas fa-arrow-right ml-1 transition-transform group-hover:translate-x-1"></i>
        </button>
      </div>
      
      <!-- Social Proof -->
      <div v-if="showSocialProof && (article.shares > 0 || article.bookmarks > 0)" class="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
        <span v-if="article.shares > 0">
          <i class="fas fa-share mr-1"></i>
          {{ article.shares }} lượt chia sẻ
        </span>
        <span v-if="article.bookmarks > 0">
          <i class="fas fa-bookmark mr-1"></i>
          {{ article.bookmarks }} lưu
        </span>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'NewsCard',
  props: {
    article: {
      type: Object,
      required: true,
      validator(value) {
        return value && typeof value === 'object' && value.id && value.title && value.excerpt
      }
    },
    showSocialProof: {
      type: Boolean,
      default: false
    }
  },
  emits: ['read-more', 'show-comments', 'share', 'like'],
  data() {
    return {
      isLiked: false
    }
  },
  methods: {
    viewArticleDetail() {
      // Navigate to article detail page
      this.$router.push(`/article/${this.article.id}`)
    },
    
    formatDate(date) {
      if (!date) return ''
      
      // If date is already formatted in Vietnamese, return as is
      if (typeof date === 'string' && date.includes('Tháng')) {
        return date
      }
      
      // Otherwise format the date
      const dateObj = new Date(date)
      if (isNaN(dateObj.getTime())) return date
      
      const day = dateObj.getDate()
      const month = dateObj.getMonth() + 1
      const year = dateObj.getFullYear()
      
      return `${day} Tháng ${month}, ${year}`
    },
    
    formatViews(views) {
      if (views < 1000) return views.toString()
      if (views < 1000000) return (views / 1000).toFixed(1) + 'K'
      return (views / 1000000).toFixed(1) + 'M'
    },
    
    toggleLike() {
      this.isLiked = !this.isLiked
      this.$emit('like', {
        article: this.article,
        isLiked: this.isLiked
      })
    }
  },
  
  mounted() {
    // Check if article is already liked (could be from localStorage or user preferences)
    this.isLiked = this.article.isLiked || false
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-all {
  transition: all 0.3s ease;
}

.transition-colors {
  transition: color 0.3s ease;
}

.transition-transform {
  transition: transform 0.3s ease;
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Ensure consistent card heights */
article {
  height: 100%;
  display: flex;
  flex-direction: column;
}

article > div:last-child {
  flex: 1;
  display: flex;
  flex-direction: column;
}

article > div:last-child > div:last-child {
  margin-top: auto;
}

/* Button hover effects */
button:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Heart animation */
.fa-heart {
  transition: all 0.2s ease;
}

.fa-heart.fas {
  animation: heartBeat 0.3s ease;
}

@keyframes heartBeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Link hover effects */
a:hover {
  text-decoration: none;
}

/* Category badge colors based on category */
.bg-green-600 {
  background-color: #059669;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .min-h-\[3\.5rem\] {
    min-height: 2.5rem;
  }
  
  .min-h-\[4rem\] {
    min-height: 3rem;
  }
}

/* Card hover effect */
.cursor-pointer:hover {
  transform: translateY(-3px);
}
</style>