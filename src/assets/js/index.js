document.addEventListener('DOMContentLoaded', (event) => {

    const draggables = document.querySelectorAll('.task-item');
    const columns = document.querySelectorAll('.kanban__column');
    const addButton = document.querySelectorAll('.kanban__plus');


    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', event => {
            event.preventDefault();
            const draggable = document.querySelector('.dragging');
            column.querySelector('.kanban__list').appendChild(draggable);
        });
    });

    addButton.forEach(button => {
        button.addEventListener('click', (event) => {
            const column = event.target.closest('.kanban__column');
            const taskList = column.querySelector('.kanban__list');
            createNewTask(taskList);
        });
    });

});

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

        const complexityClass = getComplexityClass(taskDate);

        taskItem.innerHTML = `
            <h3 class="task-item_title">${taskTitle}</h3>
            <p class="task-item_description">${taskDescription}</p>
            ${complexityClass}
                <span class="task-item__datetime">${taskDate}</span>
            </div>
        `;
        taskList.appendChild(taskItem);
    }
}

function getComplexityClass(taskDate) {
    const currentDate = new Date();
    const dueDate = new Date(taskDate);
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff <=7) {
        return '<div class="task-icon"><img src="./src/assets/img/green.png" style="width: 90px;">';
    } else if (daysDiff <=14) {
        return '<div class="task-icon"><img src="./src/assets/img/yellow.png" style="width: 90px;">';
    } else {
        return '<div class="task-icon"><img src="./src/assets/img/red.png" style="width: 90px;">'
    }

}



