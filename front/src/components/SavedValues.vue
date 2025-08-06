<template>
  <div
    class="sidebar"
    :class="{ 'sidebar-open': savedStore.sidebar }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Toggle Sidebar button -->
    <button @click="savedStore.toggleSidebar()" class="sidebar-toggle">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path v-if="!savedStore.sidebar" d="M3 12h18M3 6h18M3 18h18"></path>
        <path v-else d="M18 6L6 18M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Loading Spinner -->
    <div v-if="savedStore.loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div class="loading-text">
        <div class="loading-title">Chargement des données</div>
      </div>
    </div>

    <!-- Sidebar content -->
    <div v-else class="sidebar-content">
      <div class="sidebar-header">
        <h2 class="sidebar-title">Valeurs sauvegardées</h2>
        <div class="stock-count">{{ savedStore.saved.length }} valeur{{ savedStore.saved.length !== 1 ? 's' : '' }}</div>
      </div>

      <div class="stocks-list">
        <div v-if="savedStore.saved.length === 0" class="empty-state">
          <div class="empty-icon">📈</div>
          <p>Aucune valeur sauvegardée</p>
          <small>Recherchez et ajoutez des valeurs pour les suivre</small>
        </div>

        <router-link v-for="stock in savedStore.saved" :key="stock.symbol" :to="`details/${stock.symbol}`" custom v-slot="{ navigate, href }">
        <div @click="navigate" class="stock-item">
          <div class="stock-header">
            <div class="stock-symbol">{{ stock.shortname }}</div>
            <button @click.stop="savedStore.removeValue(stock.symbol)" class="remove-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="stock-name">{{ stock.symbol }}</div>
          <div v-if="savedStore.changes[stock.symbol] !== undefined" class="stock-change" :class="{
            'positive': savedStore.changes[stock.symbol].toFixed(2) >= 0,
            'negative': savedStore.changes[stock.symbol].toFixed(2) < 0
          }">
            {{ savedStore.changes[stock.symbol].toFixed(2) }}%
          </div>
        </div>
        </router-link>
      </div>
    </div>

    <!-- Mobile -->
    <div v-if="savedStore.sidebar" @click="savedStore.toggleSidebar()" class="sidebar-backdrop"></div>
  </div>
</template>
<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import { useSavedStore } from '../stores/savedStore.js';

const savedStore = useSavedStore();

// Variables pour la gestion du swipe
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchEndX = ref(0);
const touchEndY = ref(0);
const minSwipeDistance = 50; // Distance minimale pour considérer un swipe
const maxVerticalDistance = 100; // Distance verticale maximale pour un swipe horizontal

// Gestion du début du touch
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX;
  touchStartY.value = e.touches[0].clientY;
};

// Gestion du mouvement du touch
const handleTouchMove = (e) => {
  // Empêcher le scroll par défaut pendant le swipe
  if (savedStore.sidebar) {
    e.preventDefault();
  }
};

// Gestion de la fin du touch
const handleTouchEnd = (e) => {
  touchEndX.value = e.changedTouches[0].clientX;
  touchEndY.value = e.changedTouches[0].clientY;

  handleSwipe();
};

const handleSwipe = () => {
  const deltaX = touchStartX.value - touchEndX.value;
  const deltaY = Math.abs(touchStartY.value - touchEndY.value);

  if (
    deltaX > minSwipeDistance &&
    deltaY < maxVerticalDistance &&
    savedStore.sidebar
  ) {
    savedStore.toggleSidebar();
  }
};

onMounted(() => {
  savedStore.startAutoRefresh();
});

onUnmounted(() => {
  savedStore.stopAutoRefresh();
});
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 350px;
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(139, 69, 255, 0.3);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar-open {
  transform: translateX(0);
}

.sidebar-toggle {
  position: absolute;
  top: 2rem;
  right: -15%;
  width: 50px;
  height: 50px;
  background: rgba(139, 69, 255, 0.9);
  border: none;
  border-radius: 0 12px 12px 0;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.sidebar-toggle:hover {
  background: rgba(139, 69, 255, 1);
  transform: scale(1.05);
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
}

.sidebar-header {
  margin-bottom: 2rem;
}

.sidebar-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(139, 69, 255, 0.5);
}

.stock-count {
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  font-weight: 400;
}

.stocks-list {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.6);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state p {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.empty-state small {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  opacity: 0.7;
}

.stock-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(139, 69, 255, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.stock-item:hover {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(139, 69, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(139, 69, 255, 0.2);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stock-symbol {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  color: #8b45ff;
  font-size: 1.1rem;
}

.remove-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
}

.stock-name {
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  font-weight: 400;
}

.stock-change {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
}

.stock-change.positive {
  color: #2ed573;
}

.stock-change.negative {
  color: #ff4757;
}

.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
}

.stocks-list::-webkit-scrollbar {
  width: 6px;
}

.stocks-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.stocks-list::-webkit-scrollbar-thumb {
  background: rgba(139, 69, 255, 0.5);
  border-radius: 3px;
}

.stocks-list::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 69, 255, 0.7);
}

@media (max-width: 768px) {
  .sidebar {
    width: 100vw;
  }

  .sidebar-toggle {
    right: -70px;
    width: 60px;
    height: 60px;
  }
}
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: #8b45ff;
  animation-duration: 2s;
}

.spinner-ring:nth-child(2) {
  border-right-color: #3b82f6;
  animation-duration: 1.5s;
  animation-direction: reverse;
  width: 80%;
  height: 80%;
  top: 10%;
  left: 10%;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: #a855f7;
  animation-duration: 1s;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

.loading-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(139, 69, 255, 0.6);
}
</style>