<template>
  <div id="app">
    <!-- Router View - Hiển thị các trang như HomeView, AboutView, etc. -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
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

.from-blue-400 {
  --tw-gradient-from: #60a5fa;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(96, 165, 250, 0));
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

/* Responsive utilities */
@media (max-width: 1024px) {
  .grid-cols-5 {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-cols-5,
  .grid-cols-4,
  .grid-cols-3 {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .w-72 {
    width: 100%;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
  
  .text-6xl {
    font-size: 3rem;
  }
}

@media (max-width: 640px) {
  .grid-cols-5,
  .grid-cols-4,
  .grid-cols-3,
  .grid-cols-2 {
    grid-template-columns: repeat(1, 1fr);
  }
  
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
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
</style>