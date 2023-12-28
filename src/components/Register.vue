<template>
  <div class="login-form">
    <h1>Регистрация</h1>
    <form class="form-group" @submit.prevent="register">
      <div class="form-group">
        <label for="name">Имя:</label>
        <input class="form-group-input" v-model="formData.name" type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input class="form-group-input" v-model="formData.email" type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input class="form-group-input" v-model="formData.password" type="password" id="password" name="password"
          required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Подтвердите пароль:</label>
        <input class="form-group-input" v-model="formData.confirmPassword" type="password" id="confirmPassword"
          name="confirmPassword" required>
      </div>
      <div class="checkbox">
        <input type="checkbox" id="agreeTerms" v-model="formData.agreeTerms" required>
        <label for="agreeTerms">Я согласен с условиями использования</label>
      </div>
      <div class="form-group">
        <button type="submit">Зарегистрироваться</button>
      </div>
    </form>
  </div>
  <!-- Отображение сообщений об успехе или ошибке -->
  <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
  <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
</template>

<script>
import axios from '../utils/axios';

export default {
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
      },
      successMessage: '', // Добавлено состояние для отображения сообщения об успехе
      errorMessage: '',
    };
  },
  methods: {
    register() {
      if (!this.formData.name || !this.formData.email || !this.formData.password || !this.formData.confirmPassword || !this.formData.agreeTerms) {
        // Вывести сообщение об ошибке или предпринять другие действия в случае отсутствия данных
        return;
      }

      if (this.formData.password !== this.formData.confirmPassword) {
        // Вывести сообщение об ошибке, если пароли не совпадают
        alert('Пароли не сопадают!')
        return;
      }

  
      axios.put('/auth/signup', {
        formData: {
          name: this.formData.name,
          email: this.formData.email,
          password: this.formData.password,
          confirm_password: this.formData.confirmPassword,
        },
      })

        .then(data => {
          
          // Можно добавить дополнительные действия после успешной регистрации
          this.successMessage = 'Регистрация успешна! Перенаправляю на страницу авторизации...';
          // Задержка в 2 секунды перед перенаправлением
          
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        })
        .catch(error => {
          // Обработка ошибок
          this.errorMessage = 'Произошла ошибка во время регистрации.';
          console.error('Error during registration:', error);
        });
    },
  },
};
</script>

<style>
/* Ваши стили */
</style>
