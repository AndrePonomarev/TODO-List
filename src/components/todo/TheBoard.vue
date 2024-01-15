<!-- TheBoard.vue -->
<template>
    <div>
        <div class="main-text">
            <h1 class="main-h1">Доски пользователя</h1>
            <button @click="openCreateModal" class="create-btn">Создать доску</button>
        </div>
        <!-- Модальное окно -->
        <div v-if="createModalVisible" class="modal">
            <div class="modal-content">
                <h2>Новая доска</h2>
                <label for="boardName">Имя доски:</label>
                <input v-model="newBoard.name" type="text" id="boardName" required>
                <label for="boardDescription">Описание доски:</label>
                <textarea v-model="newBoard.description" id="boardDescription" required></textarea>
                <button class="addbtn" @click="addBoard">Добавить</button>
                <button class="dltbtn" @click="closeCreateModal">Отмена</button>
            </div>
        </div>
        <!-- Модальное окно редактирования доски -->
        <div v-if="editModalVisible" class="modal">
            <div class="modal-content">
                <h2>Редактировать доску</h2>
                <label for="editBoardName">Новое имя:</label>
                <input v-model="editedBoard.name" type="text" id="editBoardName" required>
                <label for="editBoardDescription">Новое описание:</label>
                <textarea v-model="editedBoard.description" id="editBoardDescription" required></textarea>
                <button class="addbtn" @click="updateBoard">Сохранить</button>
                <button class="dltbtn" @click="closeEditModal">Отмена</button>
            </div>
        </div>
        <div v-if="boards.length > 0">
            <div v-for="board in boards" :key="board.id" class="board-container">
                <div class="board-info">
                    <h2 class="brd-name" @click="redirectToHome(board.id)">{{ board.name }}</h2>
                    <p>{{ board.description }}</p>
                    <!-- Кнопка для открытия модального окна -->
                    <div class="brd-admin" @click="openRoleModal(board.id)">Управление ⚙️</div>
                </div>
                <div class="board-actions">
                    <button @click="openEditModal(board.id)" class="edit-btn">Изменить</button>
                    <button @click="deleteBoard(board.id)" class="delete-btn">Удалить</button>
                </div>
            </div>
        </div>
        <div v-else>
            <p>У вас пока нет досок</p>
        </div>

        <div>


            <!-- Модальное окно с поиском и списком пользователей -->
            <div v-if="isRoleModalOpen" class="modal">
                <div class="modal-content">
                    <!-- Input для поиска пользователя по имени -->
                    <input v-model="searchQuery" placeholder="Поиск по имени" />

                    <!-- Список пользователей -->
                    <div v-for="user in filteredUsers" :key="user.id">
                        <div class="user-info">
                            <div>{{ user.email }}</div>
                            <!-- Три точки справа от пользователя -->
                            <div class="user-options" @click="toggleUserOptions(user.id)">...</div>

                            <!-- Аккордеон с ролями -->
                            <div v-if="expandedUserId === user.id" class="user-roles-accordion">
                                <!-- Переключатель для Управление статусами -->
                                <div>
                                    <input type="checkbox" @click="editPermissionUser(user.id, 'delete-board-statuses')"
                                        v-model="userRoles[user.id]['delete-board-statuses']" />
                                    Управление статусами
                                </div>
                                <!-- Переключатель для Управление досками -->
                                <div>
                                    <input type="checkbox" @click="editPermissionUser(user.id, 'manage-board')"
                                        v-model="userRoles[user.id]['manage-board']" />
                                    Управление досками
                                </div>
                                <!-- Переключатель для Управление юзерами -->
                                <div>
                                    <input type="checkbox" @click="editPermissionUser(user.id, 'manage-board-users')"
                                        v-model="userRoles[user.id]['manage-board-users']" />
                                    Управление юзерами
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Кнопка для закрытия модального окна -->
                    <div @click="closeRoleModal">Закрыть</div>
                </div>
            </div>
        </div>

    </div>
</template>
  
<script>
import axios from '../../utils/axios'
export default {
    data() {
        return {
            createModalVisible: false,
            editModalVisible: false,
            newBoard: {
                name: "",
                description: ""
            },
            editedBoard: {

                name: "",
                description: ""
            },
            boards: [], // массив для хранения досок пользователя
            currentBoardId: null,
            userId: localStorage.getItem('userId'),
            isRoleModalOpen: false,
            searchQuery: "",
            expandedUserId: null,
            users: {},
            roles: {
                'delete-board-statuses': "Управление статусами",
                'manage-board': "Управление досками",
                'manage-board-users': "Управление юзерами"
            },
            userRoles: {}, // Объект для хранения ролей пользователей
            currentBoardId: null,
        };
    },
    computed: {
        filteredUsers() {
            // Применяем фильтрацию по searchQuery
            return this.users.filter((user) =>
                user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
    },
    mounted() {
        this.fetchBoards(); // при монтировании компонента получаем доски пользователя
    },
    methods: {

        async openRoleModal(boardId) {
            this.currentBoardId = boardId; // Установите текущий boardId
            try {
                const usersResponse = await axios.get(`/boards/${boardId}/users`);
                this.users = usersResponse.data;

                for (const user of this.users) {
                    try {
                        const permissionsResponse = await axios.get(`/boards/${boardId}/users/${user.id}/permissions`);
                        this.userRoles[user.id] = {};
                        for (let role in this.roles) {
                            if (permissionsResponse.data.indexOf(role) != -1)
                                this.userRoles[user.id][role] = true;
                            else
                                this.userRoles[user.id][role] = false;
                        }
                    } catch (permissionsError) {
                        console.error('Ошибка при получении разрешений пользователя', permissionsError);
                    }
                }

                this.isRoleModalOpen = true;
            } catch (usersError) {
                console.error('Ошибка при получении пользователей', usersError);
            }
        },
        // ...
        async editPermissionUser(userId, permission) {
            //console.log(this.currentBoardId, userId, permission);
            try {
                const response = await axios.get(`/boards/${this.currentBoardId}/users/${userId}/permissions`);
                if (response.data.indexOf(permission) !== -1) {
                    this.userRoles[userId][permission] = false;

                    await axios.delete(`/boards/${this.currentBoardId}/users/${userId}/permissions/${permission}`);
                } else {
                    this.userRoles[userId][permission] = true;
                    await axios.put(`/boards/${this.currentBoardId}/users/${userId}/permissions/${permission}`);
                }
                console.log(`Изменено разрешение ${permission} для userId: `, userId)
                await axios.get(`/boards/${this.currentBoardId}/users/${userId}/permissions`)
            } catch (error) {
                console.error('Ошибка при обновлении разрешений пользователя', error);
            }
        },


        closeRoleModal() {
            this.isRoleModalOpen = false;
            // Сброс раскрытого пользователя при закрытии модального окна
            this.expandedUserId = null;
        },
        toggleUserOptions(userId) {
            // Переключаем состояние аккордеона
            this.expandedUserId = this.expandedUserId === userId ? null : userId;
        },


        openCreateModal() {
            this.createModalVisible = true;
        },
        closeCreateModal() {
            this.createModalVisible = false;
        },

        openEditModal(boardId) {
            // Сохраняем id текущей доски перед открытием модального окна редактирования
            this.editedBoardId = boardId;
            this.editModalVisible = true;
            console.log(this.editedBoardId)
        },
        closeEditModal() {
            this.editModalVisible = false;
        },

        redirectToHome(boardId) {
            this.$router.push(`/home/${boardId}`);
        },

        fetchBoards() {
            // Запрос на сервер для получения досок пользователя

            axios.get(`user/${this.userId}/boards`)
                .then(response => {

                    this.boards = response.data; // сохраняем полученные доски в массив
                    // console.log(this.boards)
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
            //console.log(nBoard)


            axios.post(`user/${this.userId}/boards`, nBoard)
                .then(response => {
                    // Обработка успешного создания доски
                    console.log('Новая доска успешно создана:', response.data);
                    // Закрытие модального окна после успешного создания
                    this.closeCreateModal();
                    // Перезагрузка списка досок
                    this.fetchBoards();
                    // Очистка данных новой доски
                    this.newBoard = {
                        name: "",
                        description: ""
                    };
                })
                .catch(error => {
                    console.error('Ошибка при создании доски', error);
                });
        },
        updateBoard() {
            const eBoard = {
                formData: {
                    name: this.editedBoard.name,
                    description: this.editedBoard.description,
                }
            }
            console.log(this.editedBoardId)

            const boardId = this.editedBoardId;
            axios.put(`user/${this.userId}/boards/${boardId}`, eBoard)
                .then(response => {
                    // Обработка успешного редактирования доски
                    // обновить список досок после успешного редактирования
                    this.fetchBoards();

                    // Закрытие модального окна после успешного редактирования
                    this.closeEditModal();
                    this.editedBoard = {
                        name: "",
                        description: ""
                    };
                })
                .catch(error => {
                    console.error('Ошибка при редактировании доски', error);
                });
        },
        deleteBoard(boardId) {
            axios.delete(`user/${this.userId}/boards/${boardId}`)
                .then(response => {
                    console.log(`Удаление доски с ID ${boardId}`);
                    this.fetchBoards();
                })
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
    padding: 20px;
    margin: 15px;
    background-color: rgb(213, 193, 224);
    width: 250px;
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
    color: rgb(119, 45, 159);
}


.brd-name{
    cursor: pointer;
}

.brd-name:hover{
    cursor: pointer;
    color: rgb(26, 201, 224);
}

.brd-admin {
    cursor: pointer;
}

.brd-admin:hover {
    cursor: pointer;
    color: rgb(26, 201, 224);
}

.main-text {
    margin: 15px;
}

.main-h1 {
    padding: 10px;
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

/* Стили для модального окна */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
}

.user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.user-options {
    cursor: pointer;
    /* Добавлено для указания, что есть возможность нажатия */
}

.user-roles-accordion {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.user-roles-accordion div {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}
</style>
  