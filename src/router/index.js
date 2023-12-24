
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
import TheHome from '../components/todo/TheHome.vue'
import Register from '../components/Register.vue'

 const router = createRouter ({
  history: createWebHistory (''),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: TheHome
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../components/Login.vue')
    }
  ]
 })

 export default router
