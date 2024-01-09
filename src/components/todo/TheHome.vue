<template>
    <TheHeader />
    
    
    <div class="welcomtxt" v-if="isAuthenticated">
        <p>Welcome, {{ user.email }}! <button class="logoutbtn" @click="logout">Logout</button></p>
        
    </div>
    <div v-else>
        <router-link :to="this.$router.push('/login')"><strong>Go to Redirect Page</strong></router-link>
    </div>
    <div class="divbutns">
    <button class="addstat" @click="openModal">Добавить статус </button>
    <button class="backboards" @click="backToBoards">Назад к доскам</button>
    </div>

    <div class="kanban">
        <TheColumn v-for="column in statuses" :key="column.id" :boardId="id" :column="column"
            :tasks="getTasksByColumnId(column.id)" @task-dropped="handleTaskDropped" />
    </div>
    <TheFooter />

    <!-- Добавляем модальное окно -->
    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">

            <input class="inptname" v-model="name" placeholder="Название">

            <div class="modal-buttons">
                <button @click="saveNewStatus">Сохранить</button>
                <button @click="closeModal">Отмена</button>
            </div>
        </div>
    </div>

    

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
import { format } from 'date-fns';

export default {
    components: {
        TheHeader,
        TheFooter,
        TheColumn,
        Login,
        axios,
        RouterLink
    },
    data() {
        return {
           
            auth: '/login',
            statuses: [],
           
            tasks: [],

            isModalOpen: false,
            name: '',
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

    props: ['id'], // Принимаем значение ID через props


    methods: {

        addTaskViaApi(newTask) {
            axios
                .post(`boards/${this.id}/tasks`, newTask)
                .then((response) => {
                    // Обработка успешного ответа, если необходимо
                    console.log('Task added successfully:', response.data);
                    this.getTasks();
                })
                .catch((error) => {
                    // Обработка ошибок
                    console.error('Error adding task:', error.message);
                });
        },

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
                .get(`boards/${this.id}/statuses`)
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
                .get(`boards/${this.id}/tasks`)
                .then((response) => {
                    this.tasks = response.data
                    for (let tasks of response.data) {
                        //console.log(tasks.tasks)
                        for (let task of tasks.tasks) {

                            task.plannedCompletionAt = format(new Date(task.plannedCompletionAt), 'yyyy-MM-dd');
                            this.tasks.push(task)
                        }
                    }
                })
                .catch((error) => {
                    this.errorMessage = 'Произошла ошибка:' + error.message;
                });
        },

        openModal() {
            this.isModalOpen = true;
            console.log(this.id)
        },
        closeModal() {
            this.isModalOpen = false;
            this.name = '';

        },
        saveNewStatus() {
            
            console.log('Сохранение нового статуса:', this.name);
            const newStat = {
                formData: {
                    name: this.name,

                }
            }
            console.log(newStat);

            //axios.post(`boards/${board_id}/statuses`, this.newStatus)
            axios.post(`boards/${this.id}/statuses`, newStat)
                .then(response => {
                    console.log('Успешно сохранено:', response.data);
                    this.isModalOpen = false; // Закрываем модальное окно
                    this.getStatuses();
                    //this.$emit('status-added'); // Вызываем событие для обновления статусов в TheHome.vue
                })
                .catch(error => {
                    console.error('Ошибка сохранения:', error.message);
                });
        },

        backToBoards() {
            this.$router.push('/board');
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

<style>


 
</style>