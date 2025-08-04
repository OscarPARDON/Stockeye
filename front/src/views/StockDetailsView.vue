<script setup>
import { ref, onMounted } from 'vue'
import {useDetailsStore} from "../stores/detailStore.js";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const detailsStore = useDetailsStore();
const isLoading = ref(true);

const formatVolume = (volume) => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`
  }
  return String(volume);
}

const formatCapitalisation = (capitalisation) => {
  const numValue = parseFloat(capitalisation);
  if (isNaN(numValue)) return capitalisation;

  if (numValue >= 1000000000000) {
    return `${(numValue / 1000000000000).toFixed(1)}T`
  } else if (numValue >= 1000000000) {
    return `${(numValue / 1000000000).toFixed(1)}Mrd`
  } else if (numValue >= 1000000) {
    return `${(numValue / 1000000).toFixed(1)}M`
  } else if (numValue >= 1000) {
    return `${(numValue / 1000).toFixed(1)}K`
  }
  return String(numValue);
}

const formatPrice = (price) => {
  return `${price}$`;
}

const goHome = () => {
  router.push('/');
}

onMounted(async () => {
  detailsStore.symbol = route.params.symbol;
  await detailsStore.getStockData();
  isLoading.value = false;
})
</script>

<template>
  <div class="stock-details">
    <div class="background-effects">
      <div class="glow-orb glow-orb-1"></div>
      <div class="glow-orb glow-orb-2"></div>
      <div class="glow-orb glow-orb-3"></div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div class="loading-text">
        <div class="loading-title">Chargement des données</div>
      </div>
    </div>

    <div class="container" v-else>
      <!-- Back to Homepage Button -->
      <div class="back-button-container">
        <button @click="goHome" class="back-button">
          <div class="back-icon">←</div>
          <span>Retour à l'accueil</span>
        </button>
      </div>

      <div class="header-section">
        <h1 class="page-title">Les informations du jour</h1>
        <div class="stock-header">
          <h2 class="stock-name">
            {{ detailsStore.results.shortname }}
            <span class="stock-symbol">({{ detailsStore.results.symbol }})</span>
          </h2>
          <div class="current-price">{{ formatPrice(detailsStore.results.currentPrice) }}</div>
          <div class="price-change" :class="{
            'positive': detailsStore.results.dailyChange >= 0,
            'negative': detailsStore.results.dailyChange < 0
          }">
            {{ detailsStore.results.dailyChange.toFixed(2) }}%
          </div>
        </div>
      </div>

      <!-- Infos section -->
      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">Prix d'ouverture</div>
          <div class="info-value">{{ formatPrice(detailsStore.results.openingPrice) }}</div>
          <div class="info-icon">📈</div>
        </div>

        <div class="info-card">
          <div class="info-label">Prix le plus bas</div>
          <div class="info-value">{{ formatPrice(detailsStore.results.dailyLow) }}</div>
          <div class="info-icon">📉</div>
        </div>

        <div class="info-card">
          <div class="info-label">Prix le plus haut</div>
          <div class="info-value">{{ formatPrice(detailsStore.results.dailyMax) }}</div>
          <div class="info-icon">🚀</div>
        </div>

        <div class="info-card">
          <div class="info-label">Volume</div>
          <div class="info-value">{{ formatVolume(detailsStore.results.dailyVolume) }}</div>
          <div class="info-icon">📦</div>
        </div>

        <div class="info-card">
          <div class="info-label">Clôture précédente</div>
          <div class="info-value">{{ formatPrice(detailsStore.results.previousClosingPrice) }}</div>
          <div class="info-icon">🕐</div>
        </div>

        <div class="info-card">
          <div class="info-label">Capitalisation</div>
          <div class="info-value">{{ formatCapitalisation(detailsStore.results.capitalisation) }}</div>
          <div class="info-icon">🏢</div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.stock-details {
  min-height: 100vh;
  background: linear-gradient(135deg,
  #0f0f23 0%,
  #1a1a2e 25%,
  #16213e 50%,
  #0f3460 75%,
  #533483 100%
  );
  position: relative;
  overflow-x: hidden;
}

.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}

.glow-orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #8b45ff, transparent);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.glow-orb-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #3b82f6, transparent);
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.glow-orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #a855f7, transparent);
  bottom: 20%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.1);
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
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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

@keyframes pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.back-button-container {
  margin-bottom: 2rem;
  animation: fadeIn 0.8s ease-out;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 69, 255, 0.3);
  border-radius: 16px;
  color: #ffffff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.back-button:hover {
  transform: translateY(-2px);
  border-color: rgba(139, 69, 255, 0.5);
  box-shadow: 0 8px 32px rgba(139, 69, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.back-button:active {
  transform: translateY(0);
}

.back-icon {
  font-size: 1.2rem;
  font-weight: bold;
  color: #8b45ff;
  transition: transform 0.3s ease;
}

.back-button:hover .back-icon {
  transform: translateX(-3px);
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeIn 0.8s ease-out;
}

.page-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 2rem;
  text-shadow: 0 0 30px rgba(139, 69, 255, 0.6);
  letter-spacing: -0.02em;
}

.stock-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 69, 255, 0.3);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.stock-name {
  font-family: 'Rajdhani', sans-serif;
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 1rem;
}

.stock-symbol {
  font-family: 'Orbitron', monospace;
  color: #8b45ff;
  font-weight: 700;
}

.current-price {
  font-family: 'Orbitron', monospace;
  font-size: 3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.price-change {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
}

.price-change.positive {
  color: #2ed573;
  text-shadow: 0 0 10px rgba(46, 213, 115, 0.5);
}

.price-change.negative {
  color: #ff4757;
  text-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(139, 69, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #8b45ff, #3b82f6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  border-color: rgba(139, 69, 255, 0.5);
  box-shadow: 0 10px 40px rgba(139, 69, 255, 0.2);
}

.info-card:hover::before {
  opacity: 1;
}

.info-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.info-value {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.info-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  opacity: 0.6;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .current-price {
    font-size: 2.5rem;
  }

  .stock-header {
    padding: 1.5rem;
  }

  .back-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 2rem;
  }

  .stock-name {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 2rem;
  }

  .info-card {
    padding: 1.25rem;
  }

  .back-button {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    gap: 0.5rem;
  }

  .back-icon {
    font-size: 1rem;
  }
}
</style>