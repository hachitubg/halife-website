<template>
  <div 
    class="banner-hero relative w-full overflow-hidden"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mouseenter="stopAutoSlide"
    @mouseleave="startAutoSlide"
  >
    <!-- Background Image Slider với hiệu ứng -->
    <div class="absolute inset-0">
      <div 
        v-for="(image, index) in bannerImages" 
        :key="index"
        class="absolute inset-0 transition-all duration-1000 ease-in-out transform"
        :class="{ 
          'opacity-100 scale-100': currentSlide === index, 
          'opacity-0 scale-105': currentSlide !== index 
        }"
      >
        <img 
          :src="image.src" 
          :alt="image.alt" 
          class="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-110"
        />
        <!-- Overlay gradient -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    </div>

    <!-- Desktop Navigation Arrows -->
    <div class="hidden md:flex absolute inset-y-0 left-0 items-center">
      <button
        @click="prevSlide"
        class="ml-4 p-3 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <i class="fas fa-chevron-left text-lg"></i>
      </button>
    </div>
    
    <div class="hidden md:flex absolute inset-y-0 right-0 items-center">
      <button
        @click="nextSlide"
        class="mr-4 p-3 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <i class="fas fa-chevron-right text-lg"></i>
      </button>
    </div>
    
    <!-- Slide Indicators với hiệu ứng -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
      <button
        v-for="(image, index) in bannerImages"
        :key="index"
        @click="goToSlide(index)"
        class="transition-all duration-300 transform hover:scale-125"
        :class="currentSlide === index 
          ? 'w-8 h-2 bg-white rounded-full' 
          : 'w-2 h-2 bg-white/60 rounded-full hover:bg-white/80'"
      ></button>
    </div>


  </div>
</template>

<script>
import { BannerAPI } from '@/utils/bannerAPI.js'

export default {
  name: 'BannerHero',
  data() {
    return {
      currentSlide: 0,
      autoSlideInterval: null,
      bannerImages: [],
      // Touch handling
      touchStartX: 0,
      touchStartY: 0,
      touchEndX: 0,
      touchEndY: 0,
      isTransitioning: false
    }
  },
  async mounted() {
    await this.loadBanners()
    this.startAutoSlide()
    
    // Poll for banner updates every 30 seconds
    setInterval(() => {
      this.loadBanners()
    }, 30000)
  },
  beforeUnmount() {
    this.stopAutoSlide()
  },
  methods: {
    async loadBanners() {
      try {
        const banners = await BannerAPI.getBanners()
        this.bannerImages = banners.map((src, index) => ({
          src: src,
          alt: `HALIFE Banner ${index + 1}`
        }))
      } catch (error) {
        console.error('Error loading banners:', error)
        this.setDefaultBanners()
      }
    },
    
    setDefaultBanners() {
      this.bannerImages = [
        { src: '/images/cover1.jpg', alt: 'HALIFE Cover 1' },
        { src: '/images/cover2.jpg', alt: 'HALIFE Cover 2' },
        { src: '/images/cover3.jpg', alt: 'HALIFE Cover 3' }
      ]
    },

    // Touch/Swipe handlers với hiệu ứng
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX
      this.touchStartY = e.touches[0].clientY
      this.stopAutoSlide()
    },

    handleTouchMove(e) {
      if (this.isTransitioning) return
      
      const touchMoveX = e.touches[0].clientX
      const touchMoveY = e.touches[0].clientY
      
      const diffX = Math.abs(touchMoveX - this.touchStartX)
      const diffY = Math.abs(touchMoveY - this.touchStartY)
      
      // Nhạy hơn: chỉ cần 15px và không cần so sánh với diffY
      if (diffX > 15 && e.cancelable) {
        e.preventDefault()
      }
    },

    handleTouchEnd(e) {
      if (this.isTransitioning) return
      
      this.touchEndX = e.changedTouches[0].clientX
      this.touchEndY = e.changedTouches[0].clientY
      
      const diffX = this.touchStartX - this.touchEndX
      const diffY = Math.abs(this.touchStartY - this.touchEndY)
      
      // NHẠY HƠN: giảm từ 50px xuống 30px
      if (Math.abs(diffX) > 30 && Math.abs(diffX) > diffY * 0.5) {
        this.isTransitioning = true
        
        if (diffX > 0) {
          this.nextSlide()
        } else {
          this.prevSlide()
        }
        
        // Giảm timeout từ 1000ms xuống 500ms
        setTimeout(() => {
          this.isTransitioning = false
          this.startAutoSlide()
        }, 500)
      } else {
        this.startAutoSlide()
      }
    },
    
    startAutoSlide() {
      this.stopAutoSlide()
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide()
      }, 5000)
    },
    
    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval)
        this.autoSlideInterval = null
      }
    },
    
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.bannerImages.length
    },

    prevSlide() {
      this.currentSlide = this.currentSlide === 0 
        ? this.bannerImages.length - 1 
        : this.currentSlide - 1
    },
    
    goToSlide(index) {
      if (this.isTransitioning) return
      this.currentSlide = index
      this.stopAutoSlide()
      this.startAutoSlide()
    }
  }
}
</script>

<style scoped>
.banner-hero {
  height: calc(100vw * 974 / 2560);
  max-height: 974px;
  touch-action: pan-y;
}

@media (max-width: 1024px) {
  .banner-hero {
    height: 350px;
  }
}

@media (max-width: 768px) {
  .banner-hero {
    height: 280px;
  }
}

@media (max-width: 480px) {
  .banner-hero {
    height: 220px;
  }
}

.banner-hero img {
  object-fit: cover;
  object-position: center;
}

/* Hiệu ứng cho slide indicators */
.banner-hero button {
  transition: all 0.3s ease;
}

.banner-hero button:hover {
  transform: scale(1.2);
}

/* Hiệu ứng fade với scale */
.transition-all {
  transition: opacity 1000ms ease-in-out, transform 1000ms ease-in-out;
}

/* Hiệu ứng hover cho navigation */
@media (min-width: 768px) {
  .banner-hero:hover .hidden {
    display: flex;
  }
}
</style>