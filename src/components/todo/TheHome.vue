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
            :tasks="getTasksByColumnId(column.id)" @task-dropped="handleTaskDropped" @start-drag="startTaskDrag" />
    </div>
    <TheFooter />

    <!-- Добавляем модальное окно -->
    <div v-if="isModalOpen" class="modal">
        <div class="modal-content">
            <p class="modal-stat-text">Добавление нового статуса</p>

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

            axios.post(`boards/${this.id}/statuses`, newStat)
                .then(response => {
                    this.isModalOpen = false;
                    this.name = '';
                    this.getStatuses();
                })
                .catch(error => {
                    console.error('Ошибка сохранения:', error.message);
                });
        },

        backToBoards() {
            this.$router.push('/board');
        },

        handleTaskDropped(taskId, targetColumnId) {
            console.log(this.name);
            // Отправить запрос на сервер для обновления статуса задачи
            const movedTask = this.tasks.find(task => task.id === taskId);
            axios
                .put(`boards/${this.id}/tasks/${taskId}`, {
                    formData: {
                        statusId: targetColumnId,
                        name: movedTask.name,
                        description: movedTask.description,
                        plannedCompletionAt: movedTask.plannedCompletionAt
                    }
                })
                .then(response => {
                    // Обработать успешный ответ, если необходимо
                    console.log(`Task ${taskId} moved successfully.`, response.data);

                    // Обновить массив задач на клиенте
                    const movedTask = this.tasks.find(task => task.id === taskId);
                    movedTask.statusId = targetColumnId;

                    // Обновить статусы и задачи на клиенте
                    this.getStatuses();
                    this.getTasks();
                })
                .catch(error => {
                    // Обработать ошибку
                    console.error('Error moving task:', error.message);
                });
        },

        startTaskDrag(columnId) {
            this.currentDragColumnId = columnId;
        },
    },

    async created() {
        await this.getStatuses();
        await this.getTasks();
    },
}
</script>

<style></style>