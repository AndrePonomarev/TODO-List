<template>
  <div>
    <h1>Демо взаимодействия с сервером</h1>

    <!-- Форма регистрации -->
    <div v-if="!currentUser">
      <h2>Регистрация</h2>
      <form @submit.prevent="register">
        <label>Имя пользователя:</label>
        <input v-model="registerData.username" required />
        <br />

        <label>Пароль:</label>
        <input type="password" v-model="registerData.password" required />
        <br />

        <label>Email:</label>
        <input type="email" v-model="registerData.email" required />
        <br />

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>

    <!-- Форма авторизации -->
    <div v-if="!currentUser">
      <h2>Авторизация</h2>
      <form @submit.prevent="login">
        <label>Имя пользователя:</label>
        <input v-model="loginData.username" required />
        <br />

        <label>Пароль:</label>
        <input type="password" v-model="loginData.password" required />
        <br />

        <button type="submit">Войти</button>
      </form>
    </div>

    <!-- Информация о досках пользователя -->
    <div v-if="currentUser">
      <h2>Доски пользователя</h2>
      <ul>
        <li v-for="board in userBoards" :key="board.id">
          {{ board.name }} - {{ board.status }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from '../utils/axios'


export default {
  data() {
    return {
      loginData: {
        username: '',
        password: '',
      },
      registerData: {
        username: '',
        password: '',
        email: '',
      },
      currentUser: null,
      userBoards: [],
    };
  },
  methods: {
    async register() {
      try {
        const response = await axios.post('api/v1/auth/signup', this.registerData);
        console.log('Регистрация прошла успешно', response.data);

        // Автоматически выполняем вход после успешной регистрации
        this.login();
      } catch (error) {
        console.error('Ошибка при регистрации', error.response ? error.response.data : error.message);
      }
    },
    async login() {
      try {
        // Загружаем всех пользователей из db.json
        const response = await axios.get('https://a430f081804b.vps.myjino.ru/api/v1/auth/signin');
        

        // Проверяем существование пользователя
        const user = response.data.find(user => user.username === this.loginData.username && user.password === this.loginData.password);

        if (user) {
          console.log('Авторизация прошла успешно', user);
          this.currentUser = user;

          // После успешной авторизации получаем доски пользователя
          this.getUserBoards();
        } else {
          console.error('Ошибка при авторизации', 'Пользователь не найден');
        }
      } catch (error) {
        console.error('Ошибка при авторизации', error.response ? error.response.data : error.message);
      }
    },
    async getUserBoards() {
      try {
        const userId = this.currentUser.id; // Используем ID текущего пользователя
        const response = await axios.get(`http://localhost:3000/boards?userId=${userId}`);
        
        // Проверяем наличие данных в ответе
        if (response.data) {
          console.log('Доски пользователя', response.data);
          this.userBoards = response.data;
        } else {
          console.error('Ошибка при получении досок пользователя', 'Доски не найдены');
        }
      } catch (error) {
        console.error('Ошибка при получении досок пользователя', error.response ? error.response.data : error.message);
      }
    },
  },
};
</script>



<style>
/* Добавьте стили по вашему усмотрению */
</style>
