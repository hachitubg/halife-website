<template>
  <div class="banner-hero relative w-full overflow-hidden">
    <!-- Background Image Slider -->
    <div class="absolute inset-0">
      <div 
        v-for="(image, index) in bannerImages" 
        :key="index"
        class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
      >
        <img 
          :src="image.src" 
          :alt="image.alt" 
          class="w-full h-full object-cover object-center"
        />
      </div>
    </div>
    
    <!-- Slide Indicators -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <button
        v-for="(image, index) in bannerImages"
        :key="index"
        @click="goToSlide(index)"
        class="w-2 h-2 rounded-full transition-all duration-300"
        :class="currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BannerHero',
  data() {
    return {
      currentSlide: 0,
      autoSlideInterval: null,
      bannerImages: []
    }
  },
  mounted() {
    this.loadBanners()
    this.startAutoSlide()
    
    // Listen for banner updates
    window.addEventListener('bannersUpdated', this.handleBannersUpdate)
  },
  beforeUnmount() {
    this.stopAutoSlide()
    window.removeEventListener('bannersUpdated', this.handleBannersUpdate)
  },
  methods: {
    loadBanners() {
      const saved = localStorage.getItem('halife-banners')
      if (saved) {
        try {
          const banners = JSON.parse(saved)
          this.bannerImages = banners.map((src, index) => ({
            src: src,
            alt: `HALIFE Banner ${index + 1}`
          }))
        } catch (error) {
          console.error('Error loading banners:', error)
          this.setDefaultBanners()
        }
      } else {
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
    
    handleBannersUpdate(event) {
      const banners = event.detail
      this.bannerImages = banners.map((src, index) => ({
        src: src,
        alt: `HALIFE Banner ${index + 1}`
      }))
      this.currentSlide = 0
    },
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide()
      }, 5000) // 5 giây
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
    
    goToSlide(index) {
      this.currentSlide = index
      // Reset auto slide timer
      this.stopAutoSlide()
      this.startAutoSlide()
    }
  }
}
</script>

<style scoped>
.banner-hero {
  /* Desktop: tỉ lệ 2560x974 */
  height: calc(100vw * 974 / 2560);
  max-height: 974px;
}

@media (max-width: 1024px) {
  .banner-hero {
    /* Tablet: giảm chiều cao */
    height: 350px;
  }
}

@media (max-width: 768px) {
  .banner-hero {
    /* Mobile: chiều cao vừa phải */
    height: 280px;
  }
}

@media (max-width: 480px) {
  .banner-hero {
    /* Mobile nhỏ: chiều cao nhỏ */
    height: 220px;
  }
}

/* Đảm bảo ảnh hiển thị đẹp trên mọi kích thước */
.banner-hero img {
  object-fit: cover;
  object-position: center;
}

/* Style cho slide indicators */
.banner-hero button {
  transition: all 0.3s ease;
}

.banner-hero button:hover {
  transform: scale(1.2);
}
</style>