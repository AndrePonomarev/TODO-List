<!-- TheTask.vue -->
<template>
    <div class="task-item">
        <h3 class="task-item_title">Задача1</h3>
        <input class="task-item_description" value="">
        
        <span class="task-item__datetime"></span>
        <button class="edit-task-button">
        <img src="./src/assets/img/edit-icon.png" alt="Edit">
    </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      taskId: Number,
    },
    methods: {
      openEditTaskModal() {
        // Здесь вы можете добавить логику для открытия модального окна редактирования задачи
        // Используйте Vuex Store для управления состоянием
      },
    },
  };
  </script>
  
  <style scoped>
  /* Ваши стили для компонента */
  </style>
  