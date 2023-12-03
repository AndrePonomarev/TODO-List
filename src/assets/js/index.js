document.addEventListener('DOMContentLoaded', (event) => {

    localStorage.setItem("authToken", 12321321);
    const authToken = localStorage.getItem("authToken");

    renderKanban()
    dragAndDrop()

    const addTaskButtons = document.querySelectorAll(".kanban__plus");
    const modal = document.querySelector(".modal");
    const closeModalButton = document.querySelector(".close-modal");
    const cancelButton = document.querySelector(".cancel-button");
    const form = document.querySelector(".modal form");

    // =========================================================================
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskTitle = document.getElementById("title-task").value;
        const taskDescription = document.getElementById("description-task").value;
        const taskDate = form.elements["date"].value;

        // Получаем информацию о текущей колонке из датасета формы
        const columnId = form.dataset.columnId;

        const newTask = {
            id: tasks.length + 1,
            title: taskTitle,
            description: taskDescription,
            dueDate: taskDate,
            columnId: columnId
        };

        tasks.push(newTask);

        const column = columns.find(column => column.id === columnId);
        column.tasks.push({ id: newTask.id });

        const listContainer = document.querySelector(`.kanban__column--${columnId} .kanban__list`);
        listContainer.appendChild(renderTaskElement(newTask));

        modal.style.display = "none";
        dragAndDrop();
    });

    // =========================================================================

    addTaskButtons.forEach((button) => {
        button.addEventListener("click", () => {
            modal.style.display = "flex";

            // Сохраняем информацию о текущей колонке в датасет формы
            const columnId = button.closest('.kanban__column').dataset.columnId;
            form.dataset.columnId = columnId;
        });
    });

    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    cancelButton.addEventListener("click", () => {
        modal.style.display = "none";
        dragAndDrop()
    });

});


function dragAndDrop() {
    document.querySelectorAll('.task-item').forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    document.querySelectorAll('.kanban__column').forEach(column => {
        column.addEventListener('dragover', event => {
            event.preventDefault();
            const draggable = document.querySelector('.dragging');
            if (draggable) {
                column.querySelector('.kanban__list').appendChild(draggable);
                const taskId = draggable.dataset.taskId;
                const newColumnId = column.dataset.columnId;
                const taskToUpdate = tasks.find(task => task.id == taskId);
                if (taskToUpdate) {
                    taskToUpdate.columnId = newColumnId;
                }
            }
        });
    });

    document.querySelectorAll('.kanban__plus').forEach(button => {
        button.addEventListener('click', (event) => {
            const column = event.target.closest('.kanban__column');
            const taskList = column.querySelector('.kanban__list');
        });
    });

}


function getComplexityClass(taskDate) {
    const currentDate = new Date();
    const dueDate = new Date(taskDate);
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));


    if (daysDiff <= 7) {
        return '<div class="task-icon"><img src="./src/assets/img/green.png" style="width: 90px;">';
    } else if (daysDiff <= 14) {
        return '<div class="task-icon"><img src="./src/assets/img/yellow.png" style="width: 90px;">';
    } else {
        return '<div class="task-icon"><img src="./src/assets/img/red.png" style="width: 90px;">'
    }

}


function renderTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.dataset.taskId = task.id;  // для установки data-task-id
    taskElement.innerHTML = `
        <div class="task-item" draggable="true" data-task-id="${task.id}">
            <h3 class="task-item_title">${task.title}</h3>
            <input class="task-item_description" value="${task.description}">
            ${getComplexityClass(task.dueDate)}
            <span class="task-item__datetime">${task.dueDate}</span>
            <button class="edit-task-button">Edit</button>
        </div>
    `;

    const editButton = taskElement.querySelector('.edit-task-button');
    editButton.addEventListener('click', () => {
        openEditModal(task);
    });

    return taskElement;
}

function openEditModal(task) {
    const editModal = document.querySelector(".edit-modal");

    if (!editModal) {
        console.error("Edit modal not found");
        return;
    }

    const editForm = editModal.querySelector("form");

    if (!editForm) {
        console.error("Edit form not found");
        return;
    }

    const titleInput = editForm.querySelector("#edit-title-task");
    const descriptionInput = editForm.querySelector("#edit-description-task");
    const dateInput = editForm.querySelector('input[name="date"]');
    const saveButton = editForm.querySelector("button[type='submit']");
    const cancelButton = editForm.querySelector(".cancel-button");

    if (!titleInput || !descriptionInput || !dateInput || !saveButton || !cancelButton) {
        console.error("One or more form elements not found");
        return;
    }

    titleInput.value = task.title;
    descriptionInput.value = task.description;
    dateInput.value = task.dueDate;

    // Добавьте информацию о задаче в data-атрибут кнопки сохранения
    saveButton.dataset.taskId = task.id;

    // Добавьте слушатель для редактирования задачи
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Получите информацию о задаче из data-атрибута кнопки сохранения
        const taskId = saveButton.dataset.taskId;
        const taskToUpdate = tasks.find(task => task.id === parseInt(taskId, 10));

        if (taskToUpdate) {
            // Обновите свойства задачи
            taskToUpdate.title = titleInput.value;
            taskToUpdate.description = descriptionInput.value;
            taskToUpdate.dueDate = dateInput.value;

            // Обновите отображение задачи
            const taskItem = document.querySelector(`.task-item[data-task-id="${taskToUpdate.id}"]`);

            const taskTitle = taskItem.querySelector(".task-item_title");
            const taskDescription = taskItem.querySelector(".task-item_description");
            const taskDate = taskItem.querySelector(".task-item__datetime");

            taskTitle.textContent = taskToUpdate.title;
            taskDescription.value = taskToUpdate.description;
            taskDate.textContent = taskToUpdate.dueDate;

            // Закройте модальное окно
            editModal.style.display = "none";
        }
    });

    // Добавьте слушатель для кнопки "Отмена"
    cancelButton.addEventListener("click", () => {
        // Закройте модальное окно
        editModal.style.display = "none";
    });

    // Отобразите модальное окно редактирования
    editModal.style.display = "flex";
}


function renderKanban() { //создание и отображение Kanban-доски в DOM
    const kanbanContainer = document.querySelector(".kanban");

    columns.forEach((column) => {
        const columnSection = document.createElement("section");
        columnSection.className = `kanban__column kanban__column--${column.id}`;
        columnSection.innerHTML = `
        <section class="kanban__column" data-column-id="${column.id}">
            <div class="kanban__title-main">
                <h2 class="kanban__title">
                    <img src="${column.icon}" style="width: 20px;">${column.title}
                </h2>
                <button class="kanban__plus">+</button>
            </div>
            <div class="kanban__list"></div>
        </section>
        `;

        const listContainer = columnSection.querySelector(".kanban__list");
        column.tasks.forEach((taskId) => {
            const task = tasks.find((task) => task.id === taskId.id);
            if (task) {
                listContainer.appendChild(renderTaskElement(task));
            }
        });

        kanbanContainer.appendChild(columnSection);
    });
}
