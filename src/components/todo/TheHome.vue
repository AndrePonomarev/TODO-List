<template>
    <TheHeader />
    <div class="kanban">
        <TheColumn v-for="column in statuses" :key="column.id" :column="column" :tasks="getTasksByColumnId(column.id)"
             /> 
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

export default {
    components: {

        TheHeader,
        TheFooter,
        //  TheModal,
        TheColumn,
        Login,
        axios,


    },
    data() {
        return {
            //localcolumns: columns,
            //localTasks: tasks,
            //   isModalOpen: false,
            //   currentColumnId: null,
            //   auth: true,
            statuses: [],
            //boards: [],
            tasks: [],
        };
    },



    methods: {
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