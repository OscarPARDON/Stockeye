import { defineStore } from 'pinia';
import { getStockDetails } from '../services/YahooFinance.js';

export const useDetailsStore = defineStore('details', {
  state: () => ({
    symbol: '',
    results: {},
    loading: false,
  }),
  actions: {
      async getStockData() {
          if(this.symbol !== ''){
           try {
            this.results = await getStockDetails(this.symbol);
            this.results.dailyChange = this.results.dailyChange * 100;
          } catch (e) {
            console.error(`Erreur lors de la récupération de ${this.symbol}`, e);
          }
          }
          else{
              this.results = {"shortname":"Undefined","symbol":"Undefined","currentPrice":0.00,"dailyChange":0.00,"openingPrice":0.00,"previousClosingPrice":0.00,"dailyMax":0.00,"dailyLow":0.00,"dailyVolume":0,"capitalisation":0};
          }
        },
  }
});