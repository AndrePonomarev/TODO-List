<!-- TheTask.vue -->
<template>
    <div class="task-item"
    draggable="true"
    @dragstart="startDrag"
    @dragend="endDrag"
  >
        <h3 class="task-item_title"> {{ task.name }} </h3>
        <p class="task-item_description">{{ task.description }}</p>
        
        <span class="task-item__datetime">{{ task.dueDate }}</span>
        <button class="edit-task-button">
        <img src="../../../src/assets/img/edit-icon.png" alt="Edit">
    </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
    task: {
      type: Object,
      default: {},
    },
  },
    // computed: {
    // task() {
    //   // Найти задачу по идентификатору taskId
    //   return this.tasks.find(task => task.id === this.taskId) || {};
    // }
  // },
    methods: {
      openEditTaskModal() {
       
      },
      startDrag(event) {
      event.dataTransfer.setData("text/plain", this.task.id);
      // Прокидываем информацию о колонке, откуда происходит перетаскивание
      this.$emit("start-drag", this.task.columnId);
    },
    endDrag(event) {
      this.$emit("dragend", event); // Передача события в родительский компонент
    },
    },
  };
  </script>
  
  <style scoped>
  /* Ваши стили для компонента */
  </style>
  