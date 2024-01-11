<!-- TheHeader.vue -->
<template>
  <header class="header">
    <p class="header__title">Kanban Board</p>
    <!-- <button class="header__plus" @click="openModal">+ </button> -->
    <nav>
      <router-link class="lgnlink" to="/login">Login</router-link> 
      <router-link class="reglink" to="/register">Register</router-link>
    </nav>
    
    

    
    <!-- <router-link to="/login" class="auth__button">А.А</router-link> -->

  </header>
  <router-view />
</template>

<script>
import Login from '../Login.vue'
import axios from '../../utils/axios';

export default {
  components: {


    Login,
  },

  

  methods: {
    
  },
};
</script>

<style>
header {
  background-color: rgb(44, 0, 97);
  margin: 10px auto;
  justify-content: center;
  width: 1000px;
  border-radius: 5px;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Стили для модального окна */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
  position: relative;
  width: 300px;
  /* Ширина модального окна, можно настроить по своему усмотрению */
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

/* Стили для кнопок */
.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.modal-buttons button {
  padding: 8px 16px;
  cursor: pointer;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 4px;
}

.modal-buttons button:hover {
  background-color: #0056b3;
}

.inptname {
  border: none;
  border-radius: 4px;
  height: 25px;
  padding: 10px;
}
.modal-stat-text{
  margin: 10px;
}

.lgnlink {
  margin: 7px;
  color: grey;
}
.lgnlink:hover {
  color: white;
}

.reglink {
  margin: 7px 14px;
  color: grey;
}

.reglink:hover {
  color: white;
}
</style>