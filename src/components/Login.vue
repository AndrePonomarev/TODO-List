<template>
    <div class="login-form">
      <h1>Авторизация</h1>
      <form class="form-group" @submit.prevent="login">
        <div class="form-group">
          <label for="username">Login:</label>
          <input class="form-group-input" v-model="formData.username" type="text" id="username" name="username" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input class="form-group-input" v-model="formData.password" type="password" id="password" name="password" required>
        </div>
        <div class="checkbox">
          <input type="checkbox" id="remember" v-model="formData.remember">
          <label for="remember">Запомнить меня</label>
        </div>
        <div class="form-group">
          <button type="submit">Войти</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          username: '',
          password: '',
          //remember: false,
        },
      };
    },
    methods: {
      login() {
        // Ваш код для отправки запроса на авторизацию (используйте Axios или Fetch)
        console.log('Login:', this.formData.username);
        console.log('Password:', this.formData.password);
        //console.log('Remember:', this.formData.remember);
      },
    },
  };
  </script>
  
  <style>
  .login-form {
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    color: rgb(244, 242, 255);
    width: 315px;
    height: 330px;
    top: 205px;
    left: 482px;
  }
  
  .login-form > h1 {
    font-size: 45px;
    margin-right: 10px;
  }
  
  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: white;
    font-size: 14px;
    padding: 0px 0px 0px 10px;
  }
  
  .form-group-input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 10px;
    width: 300px;
    height: 45px;
    background: rgba(213, 204, 255, 1);
  }
  
  .checkbox {
    width: 100%;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
  
  .form-group button {
    background-color: rgb(93, 95, 239);
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
  }
  
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  
  input[type="checkbox"]::before {
    content: "";
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1px solid #999;
    border-radius: 3px;
    margin-right: 2px;
    background-color: #5D5FEF;
  }
  
  input[type="checkbox"]:checked::before {
    background-color: #5D5FEF;
    content: "\2713";
    color: black;
    padding: 0px 0px 3px 3px;
  }
  </style>
  