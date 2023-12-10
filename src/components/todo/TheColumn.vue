<template>
  <section
    :class="`kanban__column kanban__column--${column.id}`"
    @dragover.prevent="allowDrop"
    @dragenter.prevent="highlightDropArea"
    @dragleave.prevent="unhighlightDropArea"
    @drop="handleDrop"
  >
    <div class="kanban__header">
      <div class="kanban__header-content">
        <img
          :src="column.icon"
          :alt="`Колонка ${column.title}`"
          class="kanban__icon kanban__icon--column"
        />
        <h2 class="kanban__title">{{ column.title }}</h2>
      </div>
      <img
        v-if="column.id !== 'done'"
        src="../../assets/img/kanban/plus.svg"
        alt="Добавить задачу"
        class="kanban__icon kanban__icon--add"
        @click="$emit('add-task')"
      />
    </div>
    <div class="kanban__list">
      <kanban-task
        v-for="taskId in column.tasks"
        :key="taskId"
        :task="getTaskById(taskId)"
      />
    </div>
  </section>
</template>

<script>
import KanbanTask from './TheTask.vue';

export default {
  props: {
    column: {
      type: Object,
      default: {},
    },
    tasks: {
      type: Object,
      default: {},
    },
  },
  
  components: {
    KanbanTask,
  },

  data(){
    return {
      localTask: this.tasks,
    }
  },

  methods: {
    getTaskById(taskId) {
      return this.localTask.find((task) => task.id === taskId);
    },
    allowDrop(event) {
      event.preventDefault();
    },
    handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    this.$emit('task-dropped', Number(taskId), this.column.id);
  },
    
    
    highlightDropArea(event) {
      event.target.classList.add('highlighted-drop-area');
    },
    unhighlightDropArea(event) {
      event.target.classList.remove('highlighted-drop-area');
    },
  },

  watch: {
    tasks(newTasks) {
      this.localTask = newTasks;
    },
  }
};
</script>

<style scoped>
.highlighted-drop-area {
  border: 2px dashed #333;
}
</style>
