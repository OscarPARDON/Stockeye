<template>
  <div class="search-container">
    <div class="search-wrapper">
      <div class="search-input-container">
        <input
            type="text"
            v-model="searchStore.query"
            @input="onInput"
            placeholder="Entrer le ticker de la valeur ..."
            class="search-input"
        />
        <div class="search-icon">
          <svg v-if="!searchStore.loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <div v-else class="loading-spinner"></div>
        </div>
      </div>

      <!-- Search Results Dropdown -->
      <div v-if="searchStore.results && searchStore.results.length > 0" class="search-results">
        <router-link :to="`/details/${result.symbol}`" custom v-slot="{ navigate, href }" v-for="(result, index) in searchStore.results" :key="index">
            <div @click="navigate" class="search-result-item">
          <div>{{ result.shortname }}</div>
          <div>
            <a @click.stop="savedStore.saveValue(result.symbol, result.shortname)" class="save-button">
              <!-- Add to favourite Icon -->
              <svg v-if="!isSaved(result.symbol)" viewBox="0 0 24 24" width="20" fill="none"
                   xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M4 12H20M12 4V20" stroke="#ffffff" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
              <!-- Checkmark Icon -->
              <svg v-else viewBox="0 0 24 24" width="20" fill="none" xmlns="http://www.w3.org/2000/svg"
                   stroke="#00ff88">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M20 6L9 17L4 12" stroke="#00ff88" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"></path>
                </g>
              </svg>
            </a>
          </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useSearchStore} from '../stores/searchStore';
import {useSavedStore} from "../stores/savedStore.js";

const searchStore = useSearchStore();
const savedStore = useSavedStore();


function onInput() {
  searchStore.updateQuery(searchStore.query);
}


function isSaved(symbol) {
  return savedStore.saved.some(item => item.symbol === symbol);
}
</script>

<style scoped>
.search-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-wrapper {
  position: relative;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 1.25rem 3.5rem 1.25rem 1.5rem;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(139, 69, 255, 0.3);
  border-radius: 16px;
  color: #ffffff;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.search-input:focus {
  outline: none;
  border-color: #8b45ff;
  box-shadow: 0 0 0 4px rgba(139, 69, 255, 0.2), 0 8px 32px rgba(139, 69, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.search-icon {
  position: absolute;
  right: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(139, 69, 255, 0.3);
  border-top: 2px solid #8b45ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(15, 15, 35, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 69, 255, 0.3);
  border-radius: 12px;
  margin-top: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  z-index: 999;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.search-result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: rgba(139, 69, 255, 0.2);
  transform: translateX(4px);
}

.save-button {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.save-button:hover {
  transform: scale(1.1);
}

.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb {
  background: rgba(139, 69, 255, 0.5);
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 69, 255, 0.7);
}

@media (max-width: 768px) {
  .search-input {
    padding: 1rem 3rem 1rem 1.25rem;
    font-size: 1rem;
  }

  .search-icon {
    right: 1.25rem;
  }
}
</style>