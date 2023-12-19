<template>
  <TheHeader />
  <div class="kanban">
    <TheColumn v-for="column in statuses" :key="column.id" :column="column" :tasks="getTasksByColumnId(column.id)"
      @task-dropped="handleTaskDropped" />
  </div>
  <TheFooter />
</template>


<script>
import TheColumn from './components/todo/TheColumn.vue'
import TheHeader from './components/ui/TheHeader.vue'
import TheFooter from './components/ui/TheFooter.vue'
import { columns, tasks } from './utils/list';
import axios from './utils/axios'
import Auth from './components/Auth.vue'
import Login from './components/Login.vue'

export default {
  components: {

    TheHeader,
    TheFooter,
    //  TheModal,
    TheColumn,
    Auth,
    Login,
  },
  data() {
    return {
      //localcolumns: columns,
      //localTasks: tasks,
      isModalOpen: false,
      currentColumnId: null,
      auth: true,
      statuses: [],
      boards: [],
      tasks: [],
    };
  },
  //================================================================
  methods: {
    registration() {
      console.log('login');
      const formData = {
        formData: {
          name: "guest",
          email: "andrew@efko.ru",
          password: "qwert",
          confirm_password: "qwert"
        },
      };

      fetch('https://a430f081804b.vps.myjino.ru/api/v1/auth/signup', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })


      //================================================================
      // axios
      // .post('/auth/signin', formData).then((response) => {
      //     localStorage.setItem('token', response.data.token)
      //   })
      //   .catch((error) => {
      //     this.errorMessage = 'Произошла ошибка:' + error.message;
      //   });

    },

    login() {

      const formData = {
        formData: {
          email: 'andrew@efko.ru',
          password: 'qwert',
        },
      };

      fetch('https://a430f081804b.vps.myjino.ru/api/v1/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

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


    getStatuses() {
      axios
        .get('boards/5/statuses')
        .then((response) => {
          this.statuses = response.data
           console.log(this.statuses);
        })
        .catch((error) => {
          this.errorMessage = 'Произошла ошибка:' + error.message;
        });
    },

    getBoards() {
      axios
        .get('user/7/boards')
        .then((response) => {
          this.boards = response.data
          //console.log(this.boards);
        })
        .catch((error) => {
          this.errorMessage = 'Произошла ошибка:' + error.message;
        });
    },

    getTasks() {
      axios
        .get('boards/5/tasks')
        .then((response) => {
          this.tasks = response.data
          console.log(this.tasks);
        })
        .catch((error) => {
          this.errorMessage = 'Произошла ошибка:' + error.message;
        });
    },


    //================================================================
    getTasksByColumnId(columnId) {
      //return this.localTasks.filter((task) => task.columnId === columnId);
      //console.log(this.tasks);
      return this.tasks.filter(task => task.statusId === columnId);
    },
    openModal(columnId) {
      this.currentColumnId = columnId;
      this.isModalOpen = true;
    },

    closeModal() {
      this.isModalOpen = false;
    },


    handleTaskDropped(taskId, targetColumnId) {
      // Находим текущий columnId задачи
      const currentTask = this.localTasks.find(task => task.id === taskId);
      console.log(currentTask)
      if (!currentTask || currentTask.columnId === targetColumnId) {
        // Если задача уже в этой колонке или не найдена, ничего не делаем
        return;
      }

      // Обновляем localTasks
      const updatedTasks = this.localTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, columnId: targetColumnId };
        }
        return task;
      });
      this.localTasks = updatedTasks;



      this.localcolumns = this.localcolumns.map(column => {
        if (column.id === targetColumnId) {
          // Добавляем задачу, если её там ещё нет
          if (!column.tasks.includes(taskId)) {
            return { ...column, tasks: [...column.tasks, taskId] };
          }
        } else {
          // Удаляем задачу из текущей колонки
          return { ...column, tasks: column.tasks.filter(id => id !== taskId) };
        }
        return column;
      });
    },
  },

  //================================================================
  async created() {
    //this.registration();
    await this.login();
    await this.getStatuses();
    await this.getBoards();
    await this.getTasks();
  },
};
//================================================================

</script>


<style scoped></style>
