<template>
    <TheHeader />

    <div v-if="isAuthenticated">
        <p>Welcome, {{ user.email }}!</p>
        <button @click="logout">Logout</button>
    </div>
    <div v-else>
        <router-link :to="this.$router.push('/login')"><strong>Go to Redirect Page</strong></router-link>
    </div>

    <div class="kanban">
        <TheColumn v-for="column in statuses" :key="column.id" :column="column" :tasks="getTasksByColumnId(column.id)"
            @task-dropped="handleTaskDropped" />
    </div>
    <TheFooter />

    <RouterView />
</template>
  
  
<script>
import TheColumn from '../todo/TheColumn.vue'
import TheHeader from '../ui/TheHeader.vue'
import TheFooter from '../ui/TheFooter.vue'
import axios from '../../utils/axios'
import Login from '../Login.vue'
import { mapActions } from 'vuex';
import { RouterLink } from 'vue-router'

export default {
    components: {
    TheHeader,
    TheFooter,
    //  TheModal,
    TheColumn,
    Login,
    axios,
    RouterLink
},
    data() {
        return {
            //localcolumns: columns,
            //localTasks: tasks,
            //   isModalOpen: false,
            //   currentColumnId: null,
            auth: '/login',
            statuses: [],
            //boards: [],
            tasks: [],
        };
    },
    computed: {
        isAuthenticated() {
            return this.$store.state.isAuthenticated
        },
        user() {
            return this.$store.state.user
        }
    },



    methods: {

        logout() {
            this.$store.dispatch('logout')
                .then(() => {
                    this.$router.push('/login');
                })

        },

        
        getTasksByColumnId(columnId) {
            return (this.tasks.filter(task => task.statusId === columnId));

        },
        ...mapActions(['getStatuses']),
        getStatuses() {
            axios
                .get('boards/5/statuses')
                .then((response) => {
                    this.statuses = response.data
                    // console.log(this.statuses);
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
                    for (let tasks of response.data) {
                        //console.log(tasks.tasks)
                        for (let task of tasks.tasks) {
                            this.tasks.push(task)
                        }
                    }
                })
                .catch((error) => {
                    this.errorMessage = 'Произошла ошибка:' + error.message;
                });
        },
        handleTaskDropped(taskId, targetColumnId) {
            console.log('All tasks:', this.tasks);

            const currentTaskIndex = this.tasks.findIndex(task => task.id === taskId);

            if (currentTaskIndex === -1) {
                console.warn(`Task with ID ${taskId} not found.`);
                return;
            }

            const currentTask = this.tasks[currentTaskIndex];

            if (currentTask.columnId === targetColumnId) {
                console.warn(`Task with ID ${taskId} is already in the target column.`);
                return;
            }

            // Обновляем tasks
            const updatedTasks = [...this.tasks];
            updatedTasks[currentTaskIndex] = { ...currentTask, columnId: targetColumnId };
            this.tasks = updatedTasks;

            // Обновляем statuses
            this.statuses = this.statuses.map(column => ({
                ...column,
                tasks:
                    column.id === targetColumnId
                        ? column.tasks.includes(taskId)
                            ? column.tasks
                            : [...(column.tasks || []), taskId]
                        : (column.tasks || []).filter(id => id !== taskId),
            }));
        }






    },

    async created() {
        //this.registration();
        //await this.login();
        await this.getStatuses();
        // await this.getBoards();
        await this.getTasks();
    },
}
</script>

<style></style>