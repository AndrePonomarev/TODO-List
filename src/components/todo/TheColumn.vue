<!-- TheColumn.vue -->
<template>
  <section class="kanban__column" :data-column-id="column.id" @dragover.prevent="allowDrop"
    @dragenter.prevent="highlightDropArea" @dragleave.prevent="unhighlightDropArea" @drop="handleDrop">
    <div class="kanban__title-main">
      <h2 class="kanban__title">
        <img :src="column.icon" style="width: 20px;" />{{ column.name }}
      </h2>
      <button class="kanban__del" @click="deleteColumn">-</button>
      <button class="kanban__plus" @click="openAddTaskModal">+</button>

    </div>
    <div class="kanban__list">
      <TheTask v-for="task in tasks" :key="task.id" :task="task" @open-edit-task-modal="openEditTaskModal"
        @dragstart="startDragColumn" @dragend="endDragColumn" @delete-task="deleteTask" />
    </div>

    <!-- Используйте новый компонент Modal.vue для модального окна -->
    <Modal :is-open="isModalOpen" :close-modal="closeModal">
      <form @submit.prevent="addTask">
        <input type="text" v-model="taskName" id="title-task" name="title" placeholder="Введите заголовок задачи" />
        <textarea v-model="taskDescription" id="description-task" name="description"
          placeholder="Введите описание задачи"></textarea>
        <input type="date" v-model="taskDate" name="date" placeholder="Выберите дату" />
        <button type="submit">Отправить</button>
        <button type="button" class="cancel-button" @click="closeModal">Отмена</button>
      </form>
    </Modal>

    <Modal :is-open="isModalOpenEdit" :close-modal="closeModal">

      <form @submit.prevent="updateTask">
        <input type="text" v-model="taskName" id="title-task" name="title" placeholder="Введите заголовок задачи" />
        <textarea v-model="taskDescription" id="description-task" name="description"
          placeholder="Введите описание задачи"></textarea>
        <input type="date" v-model="taskDate" name="date" placeholder="Выберите дату" />
        <button type="submit">Обновить</button>
        <button type="button" class="cancel-button" @click="closeEditTaskModal">Отмена</button>
      </form>
    </Modal>

  </section>
</template>

<script>
import TheTask from "./TheTask.vue";
import Modal from "./TheModal.vue";
import { format } from 'date-fns';
import axios from '../../utils/axios'

export default {
  props: {
    column: {
      type: Object,
      default: {},
    },
    startDragColumn: Object,
    endDragColumn: Object,
    tasks: {
      type: Array,
      default: {},
    },
    boardId: String
  },
  components: {
    TheTask,
    Modal,
  },
  data() {
    return {
      isModalOpen: false,
      isModalOpenEdit: false,
      taskName: "",
      taskDescription: "",
      taskDate: "",
    };
  },
  methods: {
    openEditTaskModal(task) {
      this.isModalOpenEdit = true;
      this.editedTask = task; // Передаем целиком объект задачи
      this.editedTaskName = task.name;
      this.editedTaskDescription = task.description;
      this.editedTaskDate = task.plannedCompletionAt;
    },

    closeEditTaskModal() {
      this.isModalOpenEdit = false;
      this.editedTask = null;
      this.taskName = "";
      this.taskDescription = "";
      this.taskDate = "";
    },


    updateTask() {

      const updatedTask = {
        formData: {
          statusId: this.editedTask.statusId, // Правильно получаем id из редактируемой задачи
          name: this.taskName,
          description: this.taskDescription,
          plannedCompletionAt: this.taskDate,
        }
      };

      const updateId = this.editedTask.id;
      axios
        .put(`boards/${this.boardId}/tasks/${this.editedTask.id}`, updatedTask)
        .then((response) => {
          // Обработка успешного ответа, если необходимо
          const g = this.getTaskById(updateId)

          g.name = this.taskName
          g.description = this.taskDescription
          g.plannedCompletionAt = this.taskDate

          console.log('Task updated successfully:', response.data);
          this.closeEditTaskModal();
        })
        .catch((error) => {
          // Обработка ошибок
          console.error('Error updating task:', error.message);
        });
    },
    deleteTask(taskId) {
      if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
        axios
          .delete(`boards/${this.boardId}/tasks/${taskId}`)
          .then((response) => {
            // Обработка успешного ответа, если необходимо
            console.log('Task deleted successfully:', response.data);

            // Удалить задачу из массива tasks
            this.$parent.getTasks()
          })
          .catch((error) => {
            // Обработка ошибок
            console.error('Error deleting task:', error.message);
          });
      }
    },

    openAddTaskModal() {
      this.isModalOpen = true;
    },

    getTaskById(taskId) {
      return this.tasks.find((task) => task.id === taskId);
    },

    addTask() {
      const originalDate = this.taskDate;
      const formattedDate = format(new Date(originalDate), 'yyyy-MM-dd');

      const newTask = {
        formData: {
          statusId: this.column.id,
          name: this.taskName,
          description: this.taskDescription,
          plannedCompletionAt: this.taskDate,

        }

      };

      const newId = this.tasks.length + 1;
      const newTaskWithId = {
        ...newTask.formData,
        id: newId,
      };
      this.tasks.push(newTaskWithId);

      this.$emit("addTask", newTask);

      // новый метод для добавления задачи через API
      this.$parent.addTaskViaApi(newTask);


      this.closeModal();
    },
    deleteColumn() {
      if (confirm('Вы уверены, что хотите удалить этот статус?')) {
        axios
          .delete(`boards/${this.boardId}/statuses/${this.column.id}`)
          .then(() => {
            // Удаление успешно, обновите статусы
            this.$parent.getStatuses();
          })
          .catch((error) => {
            console.error('Error deleting column:', error.message);
          });
      }
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
      this.taskName = "";
      this.taskDescription = "";
      this.taskDate = "";
    },
  },
};
</script>

<style scoped>
/* стили для модального окна */
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
