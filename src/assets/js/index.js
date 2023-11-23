document.addEventListener('DOMContentLoaded', (event) => {

    const draggables = document.querySelectorAll('.task-item');
    const columns = document.querySelectorAll('.kanban__column');
    //const addButton = document.querySelectorAll('.kanban__plus');


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
            const draggable = document.querySelector('dragging');
            column.querySelector('.kanban__list').appendChild(draggable); //или обращаться к kanban colomn to do и т.п
    
        });
    });

    addButton.forEach(button => {
        button.addEventListener('click', (event) => {
            const column = event.target.closest('.kanban__column');
            const taskList = column.querySelector('kanban__list');
            createNewTask(tasklist);
        });
    });

    
});
