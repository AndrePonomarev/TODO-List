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
        <input class="form-group-input" v-model="formData.password" type="password" id="password" name="password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Подтвердите пароль:</label>
        <input class="form-group-input" v-model="formData.confirmPassword" type="password" id="confirmPassword" name="confirmPassword" required>
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
</template>

<script>
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
        return;
      }

      const formData = {
        formData: {
          name: this.formData.name,
          email: this.formData.email,
          password: this.formData.password,
          confirm_password: this.formData.confirmPassword,
        },
      };

      fetch('https://a430f081804b.vps.myjino.ru/api/v1/auth/signup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(response => {
          // Проверка, успешен ли запрос (статус 200-299)
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          // Преобразование ответа в формат JSON
          return response.json();
        })
        .then(data => {
          // Обработка данных из ответа
          localStorage.setItem('token', data.token);
          // Можно добавить дополнительные действия после успешной регистрации
          this.$router.push('/login');
        })
        .catch(error => {
          // Обработка ошибок
          console.error('Error during registration:', error);
        });
    },
  },
};
</script>

<style>
/* Ваши стили */
</style>
