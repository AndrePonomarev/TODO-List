<template>
  <TheHeader />
  <div class="kanban">
    <TheColumn v-for="column in localcolumns" 
    :key="column.id" 
    :column="column"
    :tasks="getTasksByColumnId(column.id)" 
    @task-dropped="handleTaskDropped"/>
  </div>
  <TheFooter />
</template>


<script>
import TheColumn from './components/todo/TheColumn.vue'
import TheHeader from './components/ui/TheHeader.vue'
import TheFooter from './components/ui/TheFooter.vue'
import { columns, tasks } from './utils/list';

export default {
  components: {
   
    TheHeader,
    TheFooter,
  //  TheModal,
    TheColumn,
  },
  data() {
    return {
      localcolumns: columns,
      localTasks: tasks,
      isModalOpen: false,
      currentColumnId: null,
      auth: true,
    };
  },

  methods: {
    getTasksByColumnId(columnId) {
      return this.localTasks.filter((task) => task.columnId === columnId);
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
};
</script>


<style scoped></style>
