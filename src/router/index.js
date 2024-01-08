

import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import TheHome from '../components/todo/TheHome.vue'
import Register from '../components/Register.vue'
import TheBoard from '../components/todo/TheBoard.vue'

 const router = createRouter ({
  history: createWebHistory (''),
  routes: [
    {
      path: '/home/:id',
      name: 'home',
      component: TheHome,
      props: true // передача параметров в компонент через props
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
    {
      path: '/board',
      name: 'board',
      component: TheBoard
    }
  ]
 })

 export default router
