<template>
  <div class="modal"> 
    <div class="modal__container">
      <a href="#" class="close-modal" @click.prevent="closeModal">✖</a> 
      <form @submit.prevent="submitTask">
        <input type="text" v-model="newTask.title" placeholder="Введите заголовок задачи"/>
        <textarea v-model="newTask.description" placeholder="Введите описание задачи"></textarea>
        <input type="date" v-model="newTask.dueDate" placeholder="Выберите дату"/>
        <button type="submit">Отправить</button>
        <button type="button" class="cancel-button" @click="closeModal">Отмена</button> 
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTask: {
        title: '',
        description: '',
        dueDate: ''
      }
    };
  },
  methods: {
    submitTask() {
      this.$emit('add-task', { ...this.newTask });
      this.resetForm();
    },
    closeModal() {
      this.$emit('close-modal');
      this.resetForm();
    },
    resetForm() {
      this.newTask = { title: '', description: '', dueDate: '' };
    }
  }
};
</script>

<style>

</style>
