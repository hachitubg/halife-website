<template>
  <div id="app">
    <router-view />
    <ContactPopup ref="contactPopup" />
    <CartDrawer ref="cartDrawer"/>
  </div>

  <!-- Nút gọi điện thoại cố định với hiệu ứng đẹp -->
  <div class="fixed bottom-6 left-6 z-50">
    <!-- Multiple ripple effects -->
    <div class="phone-ripple-container">
      <span class="phone-ripple phone-ripple-1"></span>
      <span class="phone-ripple phone-ripple-2"></span>
      <span class="phone-ripple phone-ripple-3"></span>
    </div>

    <!-- Main phone button -->
    <a
      href="tel:0866583223"
      class="phone-button group"
    >
      <!-- Icon container -->
      <div class="phone-icon-container">
        <i class="fas fa-phone phone-icon"></i>
      </div>
      
      <!-- Text container -->
      <div class="phone-text-container">
        <span class="phone-label">Hotline</span>
        <span class="phone-number">0866583223</span>
      </div>
      
      <!-- Glow effect -->
      <div class="phone-glow"></div>
    </a>
  </div>

  <!-- Social Media Fixed Bar - Góc dưới bên phải -->
  <div class="fixed bottom-6 right-6 z-40">
    <div class="social-media-stack">
      <!-- Zalo -->
      <a 
        href="https://zalo.me/0866583223" 
        target="_blank"
        class="social-btn zalo-btn"
        title="Chat Zalo - 0866583223"
      >
        <i class="fas fa-comments"></i>
        <span class="social-tooltip">Zalo<br><small>0866583223</small></span>
      </a>

      <!-- TikTok -->
      <a 
        href="https://www.tiktok.com/@bstyhalife8" 
        target="_blank"
        class="social-btn tiktok-btn"
        title="Follow TikTok - 10K+ followers"
      >
        <i class="fab fa-tiktok"></i>
        <span class="social-tooltip">TikTok<br><small>10K+ followers</small></span>
      </a>

      <!-- YouTube -->
      <a 
        href="https://www.youtube.com/@halifevietnam" 
        target="_blank"
        class="social-btn youtube-btn"
        title="Subscribe YouTube - 15K+ subscribers"
      >
        <i class="fab fa-youtube"></i>
        <span class="social-tooltip">YouTube<br><small>15K+ subscribers</small></span>
      </a>

      <!-- Facebook -->
      <a 
        href="https://www.facebook.com/CongTyThuocThuY.Halife" 
        target="_blank"
        class="social-btn facebook-btn"
        title="Follow Facebook - 25K+ followers"
      >
        <i class="fab fa-facebook-f"></i>
        <span class="social-tooltip">Facebook<br><small>25K+ followers</small></span>
      </a>
    </div>
  </div>
</template>

<script>
import ContactPopup from '@/components/ContactPopup.vue'
import CartDrawer from '@/components/CartDrawer.vue'

export default {
  name: 'App',
  components: {
    ContactPopup,
    CartDrawer
  },
  methods: {
    openContactPopup() {
      this.$refs.contactPopup.openPopup()
    }
  }
}
</script>

<style>
/* Global styles cho toàn bộ ứng dụng */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* Global utility classes */
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

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Global transition classes */
.transition-all {
  transition: all 0.3s ease;
}

.transition-colors {
  transition: color 0.3s ease;
}

.transition-transform {
  transition: transform 0.3s ease;
}

/* Global hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
  transition: all 0.3s ease;
}

/* Custom gradient backgrounds */
.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-orange-400 {
  --tw-gradient-from: #fb923c;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(251, 146, 60, 0));
}

.to-red-500 {
  --tw-gradient-to: #ef4444;
}

.from-primary-500 {
  --tw-gradient-from: #002391;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(0, 35, 145, 0));
}

.to-primary-600 {
  --tw-gradient-to: #001f7a;
}

.to-primary-700 {
  --tw-gradient-to: #001b63;
}

.to-cyan-400 {
  --tw-gradient-to: #22d3ee;
}

/* Button styles */
button:not(:disabled) {
  cursor: pointer;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Link styles */
a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  transition: all 0.3s ease;
}

/* Custom focus styles */
input:focus,
button:focus,
select:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Container max-width */
.container {
  max-width: 1200px;
}

/* IMPORTANT: Responsive utilities - DO NOT OVERRIDE */
@media (max-width: 1024px) {
  .grid-cols-5 {
    grid-template-columns: repeat(3, 1fr) !important;
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .grid-cols-5,
  .grid-cols-4,
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, 1fr) !important;
  }
  
  .w-72 {
    width: 100% !important;
  }
  
  .text-4xl {
    font-size: 2rem !important;
  }
  
  .text-6xl {
    font-size: 3rem !important;
  }
  
  /* Ensure container padding on mobile */
  .container {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}

@media (max-width: 640px) {
  .grid-cols-5,
  .grid-cols-4,
  .grid-cols-3,
  .grid-cols-2 {
    grid-template-columns: repeat(1, 1fr) !important;
  }
  
  .container {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }
}

/* Loading animation */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Fade animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide animations */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Custom colors for HALIFE brand */
:root {
  --halife-blue: #3b82f6;
  --halife-blue-dark: #1d4ed8;
  --halife-blue-light: #93c5fd;
  --halife-green: #10b981;
  --halife-orange: #f97316;
  --halife-red: #ef4444;
  --halife-yellow: #eab308;
  --halife-gray: #6b7280;
  --halife-gray-light: #f3f4f6;
  --primary-color: #002391;
  --primary-light: #003bb5;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  * {
    color: black !important;
    background: white !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border {
    border-width: 2px;
  }
  
  button {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ===== ENHANCED PHONE BUTTON STYLES ===== */

/* Ripple container */
.phone-ripple-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  pointer-events: none;
}

/* Base ripple style */
.phone-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: linear-gradient(135deg, #002391, #0f4c75);
  opacity: 0;
}

/* Multiple ripple animations */
.phone-ripple-1 {
  width: 60px;
  height: 60px;
  animation: phoneRipple1 2.5s ease-out infinite;
}

.phone-ripple-2 {
  width: 70px;
  height: 70px;
  animation: phoneRipple2 2.5s ease-out infinite 0.8s;
}

.phone-ripple-3 {
  width: 80px;
  height: 80px;
  animation: phoneRipple3 2.5s ease-out infinite 1.6s;
}

/* Main phone button với enhanced effects */
.phone-button {
  position: relative;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #002391, #0f4c75, #002391);
  background-size: 200% 200%;
  color: white;
  padding: 12px 20px 12px 16px;
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 
    0 8px 25px rgba(0, 35, 145, 0.4),
    0 4px 12px rgba(0, 35, 145, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  animation: gradientShift 3s ease-in-out infinite, buttonFloat 4s ease-in-out infinite;
  z-index: 10;
}

/* Enhanced hover effects */
.phone-button:hover {
  transform: translateY(-5px) scale(1.08);
  box-shadow: 
    0 20px 40px rgba(0, 35, 145, 0.6),
    0 8px 20px rgba(0, 35, 145, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: gradientShift 1.5s ease-in-out infinite, buttonBounce 0.8s ease-in-out infinite;
}

.phone-button:active {
  transform: translateY(-2px) scale(1.05);
  transition: all 0.1s ease;
}

/* Icon container */
.phone-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  margin-right: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.phone-button:hover .phone-icon-container {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(15deg);
}

/* Phone icon */
.phone-icon {
  font-size: 16px;
  animation: phoneRing 2s ease-in-out infinite;
}

.phone-button:hover .phone-icon {
  animation: phoneRingFast 0.5s ease-in-out infinite;
}

/* Text container với hiệu ứng */
.phone-text-container {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  position: relative;
}

.phone-text-container::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.5), transparent);
  border-radius: 2px;
  opacity: 0;
  animation: textGlow 2s ease-in-out infinite;
}

/* Phone label với hiệu ứng typewriter */
.phone-label {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
  animation: labelBreathe 3s ease-in-out infinite;
}

/* Phone number với hiệu ứng nhấp nháy */
.phone-number {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  position: relative;
  animation: numberPulse 2s ease-in-out infinite;
}

.phone-number::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent);
  animation: underlineSlide 2s ease-in-out infinite;
}

/* Glow effect */
.phone-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  border-radius: 50px;
  transition: opacity 0.4s ease;
}

.phone-button:hover .phone-glow {
  opacity: 1;
  animation: shimmer 1.5s ease-in-out infinite;
}

/* ===== KEYFRAME ANIMATIONS ===== */

/* Ripple animations */
@keyframes phoneRipple1 {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0.8;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.4);
    opacity: 0;
  }
}

@keyframes phoneRipple2 {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0.6;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.08;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
}

@keyframes phoneRipple3 {
  0% {
    transform: translate(-50%, -50%) scale(0.3);
    opacity: 0.4;
  }
  70% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.05;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

/* Phone icon ring animation */
@keyframes phoneRing {
  0%, 100% { 
    transform: rotate(0deg); 
  }
  10%, 30% { 
    transform: rotate(-10deg); 
  }
  20%, 40% { 
    transform: rotate(10deg); 
  }
}

@keyframes phoneRingHover {
  0%, 100% { 
    transform: rotate(0deg) scale(1); 
  }
  50% { 
    transform: rotate(5deg) scale(1.1); 
  }
}

/* Faster ring animation on hover */
@keyframes phoneRingFast {
  0%, 100% { 
    transform: rotate(0deg); 
  }
  25% { 
    transform: rotate(-15deg); 
  }
  75% { 
    transform: rotate(15deg); 
  }
}

/* Text glow effect */
@keyframes textGlow {
  0%, 100% {
    opacity: 0;
    transform: scaleY(0.3);
  }
  50% {
    opacity: 0.8;
    transform: scaleY(1);
  }
}

/* Label breathing effect */
@keyframes labelBreathe {
  0%, 100% {
    opacity: 0.9;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

/* Number pulse effect */
@keyframes numberPulse {
  0%, 100% {
    text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.6), 0 0 15px rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
}

/* Underline slide effect */
@keyframes underlineSlide {
  0%, 100% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Gradient shift animation */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Shimmer effect */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Button floating animation */
@keyframes buttonFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* Button bounce on hover */
@keyframes buttonBounce {
  0%, 100% {
    transform: translateY(-5px) scale(1.08);
  }
  50% {
    transform: translateY(-7px) scale(1.1);
  }
}

/* ===== RESPONSIVE DESIGN ===== */

@media (max-width: 768px) {
  .phone-button {
    padding: 10px 16px 10px 12px;
  }
  
  .phone-icon-container {
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }
  
  .phone-icon {
    font-size: 14px;
  }
  
  .phone-label {
    font-size: 10px;
  }
  
  .phone-number {
    font-size: 13px;
  }
  
  .phone-ripple-container {
    width: 70px;
    height: 70px;
  }
  
  .phone-ripple-1 {
    width: 50px;
    height: 50px;
  }
  
  .phone-ripple-2 {
    width: 60px;
    height: 60px;
  }
  
  .phone-ripple-3 {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .fixed.bottom-6.left-6 {
    bottom: 1rem;
    left: 1rem;
  }
}

/* Accessibility improvements */
.phone-button:focus {
  outline: 3px solid rgba(0, 35, 145, 0.5);
  outline-offset: 2px;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .phone-ripple-1,
  .phone-ripple-2,
  .phone-ripple-3,
  .phone-icon,
  .phone-glow {
    animation: none;
  }
  
  .phone-button {
    background: #002391;
  }
}

/* ===== SOCIAL MEDIA STACK - SIMPLE & EFFECTIVE ===== */

/* Social stack container */
.social-media-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

/* Individual social button */
.social-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: white;
  text-decoration: none;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: visible;
  z-index: 1;
}

.social-btn:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.social-btn i {
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.social-btn:hover i {
  transform: rotate(15deg);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Social tooltip */
.social-tooltip {
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  line-height: 1.3;
}

.social-tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.9);
}

.social-btn:hover .social-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(-8px);
}

.social-tooltip small {
  font-size: 10px;
  opacity: 0.8;
}

/* Zalo styles */
.zalo-btn {
  background: linear-gradient(135deg, #0068ff, #0052cc);
  animation: zaloPulse 3s ease-in-out infinite;
}

.zalo-btn::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #0068ff, #0052cc, #0068ff);
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.zalo-btn:hover::before {
  opacity: 0.7;
  animation: rotate 2s linear infinite;
}

/* Facebook styles */
.facebook-btn {
  background: linear-gradient(135deg, #1877f2, #0d65d9);
  animation: facebookPulse 3s ease-in-out infinite;
}

.facebook-btn::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #1877f2, #0d65d9, #1877f2);
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.facebook-btn:hover::before {
  opacity: 0.7;
  animation: rotate 2s linear infinite;
}

/* YouTube styles */
.youtube-btn {
  background: linear-gradient(135deg, #ff0000, #cc0000);
  animation: youtubePulse 3s ease-in-out infinite 1s;
}

.youtube-btn::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #ff0000, #cc0000, #ff0000);
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.youtube-btn:hover::before {
  opacity: 0.7;
  animation: rotate 2s linear infinite;
}

/* TikTok styles */
.tiktok-btn {
  background: linear-gradient(135deg, #000000, #25f4ee, #fe2c55);
  animation: tiktokPulse 3s ease-in-out infinite 2s;
}

.tiktok-btn::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #25f4ee, #fe2c55, #000000, #25f4ee);
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tiktok-btn:hover::before {
  opacity: 0.8;
  animation: rotate 1.5s linear infinite;
}

/* ===== SOCIAL ANIMATIONS ===== */

/* Pulse animations */
@keyframes zaloPulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(0, 104, 255, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(0, 104, 255, 0.6), 0 0 30px rgba(0, 104, 255, 0.3);
  }
}

@keyframes facebookPulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(24, 119, 242, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(24, 119, 242, 0.6), 0 0 30px rgba(24, 119, 242, 0.3);
  }
}

@keyframes youtubePulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(255, 0, 0, 0.6), 0 0 30px rgba(255, 0, 0, 0.3);
  }
}

@keyframes tiktokPulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(37, 244, 238, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(37, 244, 238, 0.6), 0 0 30px rgba(254, 44, 85, 0.3);
  }
}

/* Rotate animation */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ===== SOCIAL RESPONSIVE DESIGN ===== */

@media (max-width: 768px) {
  .social-media-stack {
    gap: 6px;
  }
  
  .social-btn {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }
  
  .social-tooltip {
    display: none; /* Hide tooltips on mobile */
  }
  
  /* Hide all except Zalo on mobile */
  .facebook-btn,
  .youtube-btn,
  .tiktok-btn {
    display: none;
  }
  
  .zalo-btn {
    display: flex;
  }
  
  /* Adjust position on mobile */
  .fixed.bottom-6.right-6 {
    bottom: 1rem;
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .social-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  
  .social-media-stack {
    gap: 5px;
  }
  
  /* Keep only Zalo visible */
  .facebook-btn,
  .youtube-btn,
  .tiktok-btn {
    display: none !important;
  }
  
  .zalo-btn {
    display: flex !important;
  }
}

/* Ensure tooltips don't interfere with phone button */
@media (max-width: 640px) {
  .social-tooltip {
    display: none; /* Hide tooltips on small screens */
  }
  
  /* Mobile: Only show Zalo */
  .facebook-btn,
  .youtube-btn,
  .tiktok-btn {
    display: none;
  }
}

/* Force enable animations and ensure visibility */
.social-btn {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: transform, box-shadow;
}

/* Ensure z-index doesn't conflict with phone button */
.social-media-stack {
  z-index: 45; /* Lower than phone button (50) */
}

/* ===== END SOCIAL MEDIA STYLES ===== */
</style>