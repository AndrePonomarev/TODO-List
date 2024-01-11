<!-- TheTask.vue -->
<template>
  <div class="task-item" draggable="true" @dragstart="startDrag" @dragend="endDrag">
    <h3 class="task-item_title"> {{ task.name }}
      <button class="edit-task-button" @click="openEditTaskModal">
      <img src="../../../src/assets/img/edit-icon.png" alt="Edit">
    </button> </h3>
    <p class="task-item_description">{{ task.description }}</p>
    <div class="task-item__complexity complexity">
      <span
        v-for="dot in getComplexityDots(task.plannedCompletionAt)"
        :key="dot.id"
        class="complexity__dot"
        :class="dot.class"
      ></span>
    </div>
    <span class="task-item__datetime">{{ task.plannedCompletionAt }}</span>
    
    <button class="delete-task-button" @click="deleteTask">❌
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
    },

    startDrag(event) {
      event.dataTransfer.setData("text/plain", this.task.id);
      // Прокидываем информацию о колонке, откуда происходит перетаскивание
      this.$emit("start-drag", this.task.columnId);
    },
    endDrag(event) {
      this.$emit("dragend", event); // Передача события в родительский компонент
    },

    getComplexityDots(plannedCompletionAt) {
      const currentDate = new Date();
      const dueDate = new Date(plannedCompletionAt);
      const timeDiff = dueDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const dots = [];
      if (daysDiff <= 7) {
        dots.push({ id: 1, class: 'red-dot' });
      } else if (daysDiff <= 14) {
        dots.push({ id: 2, class: 'yellow-dot' });
      } else {
        dots.push({ id: 3, class: 'green-dot' });
      }

      return dots;
    },
  },
};
</script>
  
<style scoped>

.complexity__dot {
  width: 24px;
    height: 12px;
    flex-shrink: 0;
    background-color: #d9d9d9; 
    border-radius: 0px 10px 10px 24px;
    display: inline-block;
    margin-right: 5px;
}

.green-dot {
  background-color: #2ce49d; 
}

.yellow-dot {
  background-color: #FDE047;
}

.red-dot {
  background-color: #e42c5f; 
}
</style>
  