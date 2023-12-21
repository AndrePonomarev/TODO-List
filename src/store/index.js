import { createStore } from "vuex";

export default createStore({
    state: {
        count: 0
        //statusses
        //tasks
    },
    getters: {
        squaredCount(state){
            return state.count - 1;
        }
    },
    mutations: {
        increment(state) {
            state.count++;
        },
    
        decrement(state) {
            state.count--;
        },

    },

    //     //
    // },

    actions: {
        increment: ({ commit }) => commit('increment'),
        decrement: ({ commit }) => commit('decrement'),
    },
});