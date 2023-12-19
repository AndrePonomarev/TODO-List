
import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../components/Login.vue';

const routes = [
  
  {
    path: '/login',
    component: LoginPage,
  },
  // Другие маршруты 
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;