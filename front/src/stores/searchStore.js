import { defineStore } from 'pinia';
import { searchStock } from '../services/YahooFinance.js';

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
    results: [],
    loading: false,
  }),
  actions: {
    async updateQuery(newQuery) {
      this.query = newQuery;
      if (newQuery.trim() === '') {
        this.results = [];
        return;
      }

      this.loading = true;
      try {
        this.results = await searchStock(newQuery);
      } catch (err) {
        console.error('Erreur de recherche :', err);
        this.results = [];
      } finally {
        this.loading = false;
      }
    }
  }
});
