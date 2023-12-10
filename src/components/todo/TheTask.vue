<template>
  <div
    v-if="task"
    class="task-item"
    draggable="true"
    @dragstart="startDrag"
    @dragend="endDrag"
  >
    <h3 class="task-item__title">{{ task.title }}</h3>
    <p class="task-item__description">{{ task.description }}</p>
    <div class="task-item__info">
      <div class="task-item__complexity complexity">
        <span
          v-for="dot in getComplexityDots(task.dueDate)"
          :class="dot.tag"
          :key="dot.id"
          class="complexity__dot"
        ></span>
      </div>
      <div class="task-item__client">{{ task.dueDate }}</div>
    </div>
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
  methods: {
    getComplexityDots(taskDate) {
      const currentDate = new Date();
      const dueDate = new Date(taskDate);
      const timeDiff = dueDate.getTime() - currentDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff <= 7) {
        return [
          { tag: 'complexity__dot--high' },
          { tag: 'complexity__dot--high' },
          { tag: 'complexity__dot--high' },
        ];
      } else if (daysDiff <= 14) {
        return [
          { tag: 'complexity__dot--medium' },
          { tag: 'complexity__dot--medium' },
        ];
      } else {
        return [{ tag: 'complexity__dot--low' }];
      }
    },
    startDrag(event) {
    event.dataTransfer.setData('text/plain', this.task.id);
  },
  },
};
</script>

<style scoped></style>
