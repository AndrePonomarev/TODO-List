<!-- Modal.vue -->
<template>
    <div class="modal" :class="{ 'modal--active': isOpen }">
      <div class="modal__container">
        <a href="#" class="close-modal" @click="closeModal">✖</a>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isOpen: Boolean,
      closeModal: Function,
    },
  };
  </script>
  
  <style scoped>
  /* Стили для модального окна */
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
  