<!-- TheColumn.vue -->
<template>
  <section class="kanban__column" :data-column-id="column.id"
  @dragover.prevent="allowDrop"
    @dragenter.prevent="highlightDropArea"
    @dragleave.prevent="unhighlightDropArea"
    @drop="handleDrop"
    >
    
    <div class="kanban__title-main">
      <h2 class="kanban__title">
        <img :src="column.icon" style="width: 20px;" />{{ column.title }}
      </h2>
      <button class="kanban__plus" @click="openAddTaskModal">+</button>
    </div>
    <div class="kanban__list">
      <TheTask
        v-for="taskId in column.tasks"
        :key="taskId"
        :taskId="taskId"
        @openEditTaskModal="openEditTaskModal"
        :task="getTaskById(taskId)"
      />
    </div>

    <!-- Модальное окно -->
    <div class="modal" :class="{ 'modal--active': isModalOpen }">
      <div class="modal__container">
        <a href="#" class="close-modal" @click="closeModal">✖</a>
        <form @submit.prevent="addTask">
          <input type="text" v-model="taskTitle" id="title-task" name="title" placeholder="Введите заголовок задачи" />
          <textarea v-model="taskDescription" id="description-task" name="description" placeholder="Введите описание задачи"></textarea>
          <input type="date" v-model="taskDate" name="date" placeholder="Выберите дату" />
          <button type="submit">Отправить</button>
          <button type="button" class="cancel-button" @click="closeModal">Отмена</button>
        </form>
      </div>
    </div>
    
  </section>
</template>

<script>
import TheTask from "./TheTask.vue";

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
  //tasks: Array,
},
components: {
  TheTask,

},
data() {
  return {
    isModalOpen: false,
    taskTitle: "",
    taskDescription: "",
    taskDate: "",
    localTask: this.tasks,
    localColumns: this.column,
  };
},
methods: {
  openAddTaskModal() {
    this.isModalOpen = true;
  },

  getTaskById(taskId) {
  
    return this.localTask.find((task) => task.id === taskId);
  },
  
  addTask(newTask) {
   newTask = {
   // id: this.column.tasks.length + 1, // Используйте this.column.tasks.length
    title: this.taskTitle,
    description: this.taskDescription,
    //complexity: "medium",
    dueDate: this.taskDate,
    columnId: this.column.id,
  };

    const newId = this.localTask.length + 1;
    const newTaskWithId = {
      ...newTask,
      id: newId,
      columnId: this.currentColumnId,
    };
    this.localTask.push(newTaskWithId);

    this.localColumns.tasks.push(newId);
    this.$emit("addTask", newTask);
 
 
  this.closeModal();
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


  closeModal() {
    this.isModalOpen = false;
    // Сбросить значения полей при закрытии модального окна
    this.taskTitle = "";
    this.taskDescription = "";
    this.taskDate = "";
  },
  openEditTaskModal(taskId) {
    // Здесь обработайте открытие модального окна редактирования задачи
    // Используйте Vuex Store для управления состоянием
    this.$emit("openEditTaskModal", taskId);
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
/* Ваши стили для модального окна */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
}

.modal__container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.modal--active {
  display: flex;
}

/* Дополнительные стили для кнопки "+" */
.kanban__plus {
  cursor: pointer;
}


</style>
