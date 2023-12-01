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

    // =========================================================================

    addTaskButtons.forEach((button) => {
        button.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    });

    closeModalButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    cancelButton.addEventListener("click", () => {
        modal.style.display = "none";
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

            column.querySelector('.kanban__list').appendChild(draggable);
        });
    });

    document.querySelectorAll('.kanban__plus').forEach(button => {
        button.addEventListener('click', (event) => {
            const column = event.target.closest('.kanban__column');
            const taskList = column.querySelector('.kanban__list');
            createNewTask(taskList);
        });
    });

}

// function createNewTask(taskList) {
//     const taskTitle = prompt('Введите название задачи:');
//     const taskDescription = prompt('Введите описание задачи:');
//     const taskDate = prompt('Введите дату завершения задачи (формат ГГГГ-ММ-ДД):');

//     if (taskTitle && taskDescription && taskDate) {
//         const taskItem = document.createElement('div');
//         taskItem.classList.add('task-item');
//         taskItem.setAttribute('draggable', 'true');

//         taskItem.addEventListener('dragstart', () => {
//             taskItem.classList.add('dragging');
//         });

//         taskItem.addEventListener('dragend', () => {
//             taskItem.classList.remove('dragging');
//         });

//         taskList.addEventListener('dragover', event => {
//             event.preventDefault();
//             const draggable = document.querySelector('.dragging');
//             taskList.appendChild(draggable);
//         });

//         const task = {

//             title: taskTitle,
//             description: taskDescription,
//             dueDate: taskDate

//         }
//         taskList.appendChild(renderTaskElement(task));
//         dragAndDrop()

//     }
// }


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
// function renderTaskElement(task) {
//     const taskElement = document.createElement('div');
//     // taskElement.className = 'list__item'; // Добавляем класс к элементу списка
//     taskElement.innerHTML = `
//     <div class="task-item" draggable="true">
//           <h3 class="task-item_title">${task.title}</h3>
//             <input class="task-item_description" value="${task.description}">
//             ${getComplexityClass(task.dueDate)}
//                 <span class="ttask-item__datetime">${task.dueDate}</span></div>
//         </div>
// `;
//     return taskElement;
// }

// function renderKanban() {
//     const kanbanContainer = document.querySelector(".kanban");

//     columns.forEach((column) => {
//         const columnSection = document.createElement("section");
//         columnSection.className = `kanban__column kanban__column--${column.id}`;
//         columnSection.innerHTML = `
//         <section class="kanban__column kanban__column--to-do">
//         <div class="kanban__title-main">
//         <h2 class="kanban__title"> <img src="./src/assets/img/task1.png" style="width: 20px;">${column.title}</h2>
//         <button class="kanban__plus">+</button>
//       </div>
//         <div class="kanban__list"></div>
//           `;

//         const listContainer = columnSection.querySelector(".kanban__list");
//         column.tasks.forEach((taskId) => {
//             const t = taskId.id;
//             const task = tasks.find((task) => task.id === t);
//             if (task) {
//                 listContainer.appendChild(renderTaskElement(task));
//             }
//         });


//         kanbanContainer.appendChild(columnSection);
//     });
// }

function renderTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.innerHTML = `
    <div class="task-item" draggable="true">
        <h3 class="task-item_title">${task.title}</h3>
        <input class="task-item_description" value="${task.description}">
        ${getComplexityClass(task.dueDate)}
        <span class="ttask-item__datetime">${task.dueDate}</span>
    </div>
    `;

    return taskElement;
}

function renderKanban() {
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