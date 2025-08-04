import { defineStore } from 'pinia';
import { getDailyChange } from '../services/YahooFinance.js';

let intervalId;

export const useSavedStore = defineStore('saved', {
  state: () => ({
    sidebar: false,
    saved: JSON.parse(localStorage.getItem("savedValues") || '[]'),
    loading: false,
    changes: JSON.parse(localStorage.getItem("savedChanges") || '{}'),
  }),

  actions: {
    async getSavedValues() {
      this.saved = JSON.parse(localStorage.getItem("savedValues") || '[]');
    },

    async toggleSidebar() {
      if (this.sidebar) {
        this.sidebar = false;
        await this.getSavedValues();
      } else {
        this.loading = true;
        await this.getSavedValues();
        this.sidebar = true;
        this.loading = false;
      }
    },

    async saveValue(symbol, shortname) {
      await this.getSavedValues();
      const exists = this.saved.find(v => v.symbol === symbol);
      if (!exists) {
        this.saved.push({ symbol, shortname });
        localStorage.setItem("savedValues", JSON.stringify(this.saved));
        this.sidebar = true;
        await this.fetchChangeForSymbol(symbol);
      }
    },

    async removeValue(symbol) {
      await this.getSavedValues();
      this.saved = this.saved.filter(savedStock => savedStock.symbol !== symbol);
      localStorage.setItem("savedValues", JSON.stringify(this.saved));
      delete this.changes[symbol];
    },

    async fetchAllChanges() {
      this.loading = true;
      const results = {};
      for (const { symbol } of this.saved) {
        try {
          const { change } = await getDailyChange(symbol);
          results[symbol] = change;
        } catch (e) {
          console.error(`Erreur lors de la récupération de ${symbol}`, e);
        }
      }
      this.changes = results;
      localStorage.setItem("savedChanges", JSON.stringify(this.changes));
      this.loading = false;
    },

    async fetchChangeForSymbol(symbol) {
      this.loading = true;
      try {
        const { change } = await getDailyChange(symbol);
        this.changes[symbol] = change;
        localStorage.setItem("savedChanges", JSON.stringify(this.changes));
      } catch (e) {
        console.error(`Erreur lors de la récupération de ${symbol}`, e);
      }
      this.loading = false;
    },

    startAutoRefresh(intervalMs = 5 * 60 * 1000) {
      if (intervalId) clearInterval(intervalId);
      this.fetchAllChanges();
      intervalId = setInterval(() => {
        this.fetchAllChanges();
      }, intervalMs);
    },

    stopAutoRefresh() {
      if (intervalId) clearInterval(intervalId);
    }
  }
});
