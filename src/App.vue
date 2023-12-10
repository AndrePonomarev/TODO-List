<template>
  <the-header />

  <div v-if="auth" class="kanban">
    <kanban-column
      v-for="column in localColumns"
      :key="column.id"
      :column="column"
      :tasks="getTasksByColumnId(column.id)"
      @add-task="openModal(column.id)"
      @task-dropped="handleTaskDropped"
    />
  </div>

  <div v-else>
    <!-- Добавить страницу авторизации -->
    <!-- <auth-page/> -->
  </div>
  <the-footer />

  <the-modal v-if="isModalOpen" @close-modal="closeModal" @add-task="addTask" />

</template>

<script>
import KanbanColumn from './components/todo/TheColumn.vue';
import TheHeader from './components/TheHeader.vue';
import TheFooter from './components/TheFooter.vue';
import TheModal from './components/todo/TheModal.vue';
import { columns, tasks } from './utils/list';

export default {
  components: {
    KanbanColumn,
    TheHeader,
    TheFooter,
    TheModal,
  },
  data() {
    return {
      localColumns: columns,
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
    addTask(newTask) {
      const newId = this.localTasks.length + 1;
      const newTaskWithId = {
        ...newTask,
        id: newId,
        columnId: this.currentColumnId,
      };
      this.localTasks.push(newTaskWithId);

      const columnToUpdate = this.localColumns.find(
        (column) => column.id === this.currentColumnId,
      );
      columnToUpdate.tasks.push(newId);

      this.closeModal();
    },

    handleTaskDropped(taskId, targetColumnId) {
    // Находим текущий columnId задачи
    const currentTask = this.localTasks.find(task => task.id === taskId);
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

    // Обновляем localColumns
    this.localColumns = this.localColumns.map(column => {
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
