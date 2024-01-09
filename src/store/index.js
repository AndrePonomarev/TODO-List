

import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: false,
    user: null
  },
  mutations: {
    setAuthentication(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    setUser(state, user) {
      state.user = user;
    },
    deleteToken() {
      localStorage.removeItem('token');
    },
    // Новая мутация для восстановления состояния из localStorage
    restoreStateFromLocalStorage(state) {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        const { isAuthenticated, user } = JSON.parse(storedAuth);
        state.isAuthenticated = isAuthenticated;
        state.user = user;
      }
    }
  },
  actions: {
    login({ commit }, credentials) {
      commit('setAuthentication', true);
      commit('setUser', credentials);
      // Сохранение в localStorage
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: true,
        user: credentials
      }));
    },
    logout({ commit }) {
      commit('setAuthentication', false);
      commit('setUser', null);
      commit('deleteToken');
      // Удаление из localStorage
      localStorage.removeItem('auth');
      localStorage.removeItem('userId');
    },
    // Новая action для восстановления состояния при создании хранилища
    restoreState({ commit }) {
      commit('restoreStateFromLocalStorage');
    }
  },
  getters: {
    // Пример геттера, который возвращает состояние авторизации
    isAuthenticated: state => state.isAuthenticated
  },
  modules: {},
  // Хук, вызываемый при создании хранилища
  plugins: [store => store.dispatch('restoreState')]
});
