

import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import TheHome from '../components/todo/TheHome.vue'
import Register from '../components/Register.vue'
import TheBoard from '../components/todo/TheBoard.vue'

 const router = createRouter ({
  history: createWebHistory (''),
  routes: [
    {
      path: '/',
      redirect: '/login', // При первом заходе на корень, перенаправляем на страницу login
    },
    
    {
      path: '/home/:id',
      name: 'home-id',
      component: TheHome,
      props: true // передача параметров в компонент через props
    },
    {
      path: '/home',
      name: 'home',
      component: TheHome,
      props: true, // передача параметров в компонент через props
      beforeEnter: (to, from, next) => {
        // Ваша логика проверки авторизации
        const isAuthenticated = localStorage.getItem('token');
        if (!isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      }
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
    },
    // {
    //   path: '/board',
    //   name: 'board',
    //   component: TheBoard
    // }
    {
      path: '/board',
      name: 'board',
      component: TheBoard,
      beforeEnter: (to, from, next) => {
        // Ваша логика проверки авторизации
        const isAuthenticated = localStorage.getItem('token');
        if (!isAuthenticated) {
          next('/login');
        } else {
          next();
        }
      }
    }
  ]
 })

 export default router
