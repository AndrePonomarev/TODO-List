<!-- TheTask.vue -->
<template>
  <div class="task-item" draggable="true" @dragstart="startDrag" @dragend="endDrag">
    <h3 class="task-item_title"> {{ task.name }}
      <button class="edit-task-button" @click="openEditTaskModal">
      <img src="../../../src/assets/img/edit-icon.png" alt="Edit">
    </button> </h3>
    <p class="task-item_description">{{ task.description }}</p>

    <span class="task-item__datetime">{{ task.plannedCompletionAt }}</span>
    
    <button class="delete-task-button" @click="deleteTask">❌
    </button>
  </div>

  

</template>
  
<script>
import axios from '../../utils/axios'
import Modal from "./TheModal.vue";
import TheColumn from "./TheColumn.vue";
export default {


  props: {
    task: {
      type: Object,
      default: {},
    },
    
  },
  data() {
    return {
      
      taskName: "",
      taskDescription: "",
      taskDate: "",
    };
  },

  methods: {

    deleteTask() {
      this.$emit("delete-task", this.task.id);
    },
   

    openEditTaskModal(taskId) {
      
      
      this.$emit("open-edit-task-modal", this.task);

      // console.log(taskId)
      // const updatedTask = {
      //   id: this.taskToUpdateId,
      //   name: this.taskName,
      //   description: this.taskDescription,
      //   plannedCompletionAt: this.taskDate,
      // };

      

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
  