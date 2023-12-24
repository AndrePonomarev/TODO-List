import { createStore } from "vuex";
import axios from 'axios';
export default createStore({
    state: {
        count: 0,
        statusses:[]
        //tasks
    },
    getters: {
        squaredCount(state){
            return state.count - 1;
        }
    },
    mutations: {
        getStatuses() {
            axios
                .get('boards/5/statuses')
                .then((response) => {
                    this.statuses = response.data
                    // console.log('this.statuses');
                })
                .catch((error) => {
                    this.errorMessage = 'Произошла ошибка:' + error.message;
                });
        },
    
        decrement(state) {
            state.count--;
        },

    },

    actions: {
        getStatuses: ({ commit }) => commit('getStatuses'),
        decrement: ({ commit }) => commit('decrement'),
    },
});



// const state = {
//     statuses: [],
//     errorMessage: '',
//   };
  
//   const mutations = {
//     SET_STATUSES(state, statuses) {
//       state.statuses = statuses;
//     },
//     SET_ERROR_MESSAGE(state, errorMessage) {
//       state.errorMessage = errorMessage;
//     },
//   };
  
//   const actions = {
//     async getStatuses({ commit }) {
//       try {
//         const response = await axios.get('boards/5/statuses');
//         commit('SET_STATUSES', response.data);
//         commit('SET_ERROR_MESSAGE', null); // Сбрасываем ошибку, если запрос выполнен успешно
//       } catch (error) {
//         commit('SET_STATUSES', []); // Очищаем статусы при ошибке, если это нужно
//         commit('SET_ERROR_MESSAGE', 'Произошла ошибка: ' + error.message);
//       }
//     },
//   };
  
//   export default {
//     state,
//     mutations,
//     actions,
//   };

