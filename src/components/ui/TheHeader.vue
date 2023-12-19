<template>
  <header class="header">
    <p class="header__title">Kanban Board</p>
    <button class="header__plus">+ </button>
    <router-link to="/login" class="auth__button">А.А</router-link>
    
  </header>
  <router-view />
</template>

<script>
import Login from '../Login.vue'

export default {
  components: {

    
    Login,
  },
}
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
</style>