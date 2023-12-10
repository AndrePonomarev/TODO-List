<template>
  <TheHeader />
  <div class="kanban">
    <TheColumn v-for="column in localcolumns" :key="column.id" :column="column" />
  </div>
  <TheFooter />
</template>


<script>
import TheHeader from './components/ui/TheHeader.vue'
import TheFooter from './components/ui/TheFooter.vue'
import TheColumn from './components/todo/TheColumn.vue'
import { columns, tasks } from './utils/list';

export default {
  name: 'App',

  components: {
    TheHeader,
    TheFooter,
    TheColumn,
  },
  
  data() {
    return {
      localcolumns: columns,
      tasks: tasks, // передаем массив задач как пропс
    }
  },
}


</script>


<style scoped></style>
