<template>
<!-- {{ count }}
{{ statuses }}
   
<button @click = "getStatuses">увеличить</button>
<button @click = "decrement">уменьшить</button>
<button @click = "reset">Сбросить</button> -->
<RouterView/>

</template>


<script>
import TheColumn from './components/todo/TheColumn.vue'
import TheHeader from './components/ui/TheHeader.vue'
import TheFooter from './components/ui/TheFooter.vue'
import { columns, tasks } from './utils/list';
import axios from './utils/axios'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import TheHome from './components/todo/TheHome.vue'

import {mapGetters, mapActions, mapMutations} from 'vuex'

export default {
 

  components: {

    TheHeader,
    TheFooter,
    //  TheModal,
    TheColumn,
   
    Login,
    Register
  },
  data() {
    return {
      //localcolumns: columns,
      //localTasks: tasks,
      isModalOpen: false,
      currentColumnId: null,
     // auth: false,
      statuses: [],
      tasks: [],
    };
  },
  //================================================================
  methods: {

    registration() {
      console.log('login');
      const formData = {
        formData: {
          name: "guest222",
          email: "andrew222@efko.ru",
          password: "qwert",
          confirm_password: "qwert"
        },
      };

      // fetch('https://a430f081804b.vps.myjino.ru/api/v1/auth/signup', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // })


      // //================================================================
      axios
      .post('/auth/signup', formData).then((response) => {
          localStorage.setItem('token', response.data.token)
        })
        .catch((error) => {
          this.errorMessage = 'Произошла ошибка:' + error.message;
        });

    },

    login() {

      const formData = {
        formData: {
          email: 'andrew@efko.ru',
          password: 'qwert',
        },
      };

      axios
        .post('/auth/signin', formData)
        .then((response) => {
          //console.log(response);
          localStorage.setItem('token', response.data.token)
        })
        .catch((error) => {
          this.errorMessage = 'Произошла ошибка:' + error.message;
        });
    },


    // getStatuses() {
    //   axios
    //     .get('boards/5/statuses')
    //     .then((response) => {
    //       this.statuses = response.data
    //       // console.log(this.statuses);
    //     })
    //     .catch((error) => {
    //       this.errorMessage = 'Произошла ошибка:' + error.message;
    //     });
    // },


    // getTasks() {
    //   axios
    //     .get('boards/5/tasks')
    //     .then((response) => {
    //       this.tasks = response.data
    //       for (let tasks of response.data){
    //         //console.log(tasks.tasks)
    //         for (let task of tasks.tasks){
    //           this.tasks.push(task)
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       this.errorMessage = 'Произошла ошибка:' + error.message;
    //     });
    // },


    //================================================================
    getTasksByColumnId(columnId) {
      
      
      return (this.tasks.filter(task => task.statusId === columnId));
      // return this.tasks.filter(task => task.tasks.statusId === columnId);

      // return this.tasks.filter(function(task){
      //   console.log(task.tasks)
      // })
      
      //return this.tasks.filter(task => task.statusId === columnId);
    },
    openModal(columnId) {
      this.currentColumnId = columnId;
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
    },


   
  },

  //================================================================
  // created() {
  //   this.getStatuses(); // Вызовите метод getStatuses при создании компонента
  // },
  async created() {
   // await this.registration();
    //await this.login();
   // await this.getStatuses();
    
   // await this.getTasks();
    
  },
};
//================================================================

</script>


<style scoped></style>
