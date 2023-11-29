document.addEventListener('DOMContentLoaded', (event) => {
    renderKanban()
    dragAndDrop()

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

function createNewTask(taskList) {
    const taskTitle = prompt('Введите название задачи:');
    const taskDescription = prompt('Введите описание задачи:');
    const taskDate = prompt('Введите дату завершения задачи (формат ГГГГ-ММ-ДД):');

    if (taskTitle && taskDescription && taskDate) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.setAttribute('draggable', 'true');

        taskItem.addEventListener('dragstart', () => {
            taskItem.classList.add('dragging');
        });

        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('dragging');
        });

        taskList.addEventListener('dragover', event => {
            event.preventDefault();
            const draggable = document.querySelector('.dragging');
            taskList.appendChild(draggable);
        });

        const task = {

            title: taskTitle,
            description: taskDescription,
            dueDate: taskDate

        }
        taskList.appendChild(renderTaskElement(task));
        dragAndDrop()
        //taskList.appendChild(taskItem);
    }
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
    // taskElement.className = 'list__item'; // Добавляем класс к элементу списка
    taskElement.innerHTML = `
    <div class="task-item" draggable="true">
          <h3 class="task-item_title">${task.title}</h3>
            <input class="task-item_description" value="${task.description}">
              <div class="task-icon"><img src="./src/assets/img/yellow.png" style="width: 90px;">
                <span class="task-item__datetime">${task.dueDate}</span></div>
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
        <section class="kanban__column kanban__column--to-do">
        <div class="kanban__title-main">
        <h2 class="kanban__title"> <img src="./src/assets/img/task1.png" style="width: 20px;">${column.title}</h2>
        <button class="kanban__plus">+</button>
      </div>
        <div class="kanban__list"></div>
          `;

        const listContainer = columnSection.querySelector(".kanban__list");
        column.tasks.forEach((taskId) => {
            const t = taskId.id;
            const task = tasks.find((task) => task.id === t);
            if (task) {
                listContainer.appendChild(renderTaskElement(task));
            }
        });


        kanbanContainer.appendChild(columnSection);
    });
}

