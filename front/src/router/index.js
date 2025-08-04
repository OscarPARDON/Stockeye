import { createRouter, createWebHistory } from 'vue-router';
import MainView from '../views/MainView.vue';
import StockDetailsView from "../views/StockDetailsView.vue";

const routes = [
  { path: '/', component: MainView },
  {path: "/details/:symbol",component: StockDetailsView},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;