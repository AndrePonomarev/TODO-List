import { createStore } from "vuex";
import axios from 'axios';
export default createStore({
    state: {

        isAuthenticated: false, // пока не авторизован
        user: null // храним юзера и пароль

    },
    getters: {

    },
    mutations: {

        //указываем что авторизованы
        setAuthentication(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated
        },
        //указываем что юзер добавлен
        setUser(state, user) {
            state.user = user
        },

        deleteToken() {
            localStorage.removeItem('token');
            
        }
    },

    actions: {

        
        login({ commit }, credentials) {
            commit('setAuthentication', true)
            commit('setUser', credentials)
        },

        logout({ commit }) {
            commit('setAuthentication', false)
            commit('setUser', null)
            commit('deleteToken')
            
        }
    },
});

