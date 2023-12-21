
// import { createRouter, createWebHistory } from 'vue-router';

// import LoginPage from '../components/Login.vue';

// const routes = [
  
//   {
//     pimport { createRouter, createWebHistory } from 'vue-router';ath: '/login',
//     component: LoginPage,
//   },
//   // Другие маршруты 
// ];

// const router = createRouter({
//   history: createWebHistory(),
//   routes,
// });

// export default router;


import { createRouter, createWebHistory } from 'vue-router';
//import LoginPage from '../components/Login.vue';
import App from '../App.vue';

 const router = createRouter ({
  history: createWebHistory (''),
  routes: [
    {
      path: '/',
      name: 'home',
      component: App
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue')
    }
  ]
 })

 export default router
