<!-- App.vue -->
<template>
    <div>
        <div class="main-text">
            <h1>Доски пользователя</h1>
            <button @click="openModal" class="create-btn">Создать доску</button>
        </div>
        <!-- Модальное окно -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h2>Новая доска</h2>
                <label for="boardName">Имя доски:</label>
                <input v-model="newBoard.name" type="text" id="boardName" required>
                <label for="boardDescription">Описание доски:</label>
                <textarea v-model="newBoard.description" id="boardDescription" required></textarea>
                <button class="addbtn" @click="addBoard">Добавить</button>
                <button class="dltbtn" @click="closeModal">Отмена</button>
            </div>
        </div>
        <div v-if="boards.length > 0">
            <div v-for="board in boards" :key="board.id" class="board-container">
                <div class="board-info">
                    <h2>{{ board.name }}</h2>
                    <p>{{ board.description }}</p>
                </div>
                <div class="board-actions">
                    <button @click="editBoard(board.id)" class="edit-btn">Изменить</button>
                    <button @click="deleteBoard(board.id)" class="delete-btn">Удалить</button>
                </div>
            </div>
        </div>
        <div v-else>
            <p>У вас пока нет досок</p>
        </div>

    </div>
</template>
  
<script>
import axios from '../../utils/axios'
export default {
    data() {
        return {
            showModal: false,
            newBoard: {
                name: "",
                description: ""
            },
            boards: [], // массив для хранения досок пользователя
        };
    },
    mounted() {
        this.fetchBoards(); // при монтировании компонента получаем доски пользователя
    },
    methods: {
        openModal() {
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
        fetchBoards() {
            // Запрос на сервер для получения досок пользователя
            const userId = 7; // замените на реальный идентификатор пользователя
            axios.get(`user/${userId}/boards`)
                .then(response => {
                    this.boards = response.data; // сохраняем полученные доски в массив
                })
                .catch(error => {
                    console.error('Ошибка при получении досок', error);
                });
        },
        addBoard() {
            // Здесь можете добавить логику для отправки новой доски на сервер
            const nBoard = {
                formData: {
                    name: this.newBoard.name,
                    description: this.newBoard.description,
                }
            }
            console.log(nBoard)
             
            const userId = 7; // замените на реальный идентификатор пользователя
            axios.post(`user/${userId}/boards`, nBoard)
                .then(response => {
                    // Обработка успешного создания доски
                    console.log('Новая доска успешно создана:', response.data);
                    // Закрытие модального окна после успешного создания
                    this.closeModal();
                    // Перезагрузка списка досок
                    this.fetchBoards();
                })
                .catch(error => {
                    console.error('Ошибка при создании доски', error);
                });
        },
        editBoard(boardId) {
            // Здесь можете добавить логику для редактирования доски
            console.log(`Редактирование доски с ID ${boardId}`);
        },
        deleteBoard(boardId) {
            // Здесь можете добавить логику для удаления доски
            
            axios.delete(`user/7/boards/${boardId}`)
            console.log(`Удаление доски с ID ${boardId}`);
            this.fetchBoards();
        },
    },
};
</script>
  
<style>
.board-container {
    display: flex;
    flex-direction: column;
    /* изменение направления отображения на вертикальное */
    justify-content: space-between;
    border: 1px solid #ccc;
    padding: 10px;
    margin: 15px;
    background-color: rgb(213, 193, 224);
    width: 200px;
    border-radius: 10px;
    /* скругление углов */
}



.board-actions {
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
    /* равномерное распределение кнопок внутри .board-actions */
}

.board-actions button {
    margin-top: 5px;
    /* отступ между кнопками "Изменить" и "Удалить" */
}

.board-actions button:hover {
    background-color: #a38bc4;
    /* изменение цвета при наведении курсора */
    color: #fff;
    /* изменение цвета текста при наведении курсора */
}

/* Стили для кнопки "Изменить" */
.board-actions .edit-btn {
    padding: 5px 10px;
    cursor: pointer;
    background-color: #91a1ac;
    /* Синий цвет */
    color: #fff;
    border-radius: 7px;
    border: none;
}

.board-actions .edit-btn:hover {
    background-color: #2980b9;
}

/* Стили для кнопки "Удалить" */
.board-actions .delete-btn {
    padding: 5px 10px;
    cursor: pointer;
    background-color: #d4996b;
    /* Красный цвет */
    color: #fff;
    border-radius: 7px;
    border: none;
}

.board-actions .delete-btn:hover {
    background-color: #c0392b;
}

/* Стили для кнопки "Создать доску" */
.create-btn {
    padding: 5px 10px;
    cursor: pointer;
    background-color: #2ecc71;
    /* Зеленый цвет */
    color: #fff;
    border-radius: 7px;
    border: none;
}

.create-btn:hover {
    background-color: #27ae60;
}

.board-info {
    color: rgb(119, 45, 159)
}

.main-text {
    margin: 15px;
}

/* Стили для модального окна */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: #ddcaca;
    color: black;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    text-align: center;
}

.modal input,
.modal textarea {
    width: 100%;
    margin-bottom: 10px;
}


.dltbtn {
    background-color: rgb(203, 118, 111);
    border-radius: 5px;
    border: none;
    padding: 5px;
    margin: 2px;
    cursor: pointer;
}

.addbtn {
    background-color: rgb(119, 176, 118);
    border-radius: 5px;
    border: none;
    padding: 5px;
    margin: 2px;
    cursor: pointer;
}
</style>
  