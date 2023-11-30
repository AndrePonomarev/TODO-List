const columns = [
  {
    id: "to-do",
    title: "Задачи",
    icon: "./src/assets/img/kanban/kanban__column--to-do.svg",
    tasks: [
      {
        id: 1,
        title: "Задача 1",
        description: "Описание задачи 1",
        complexity: "high",
        dueDate: "2023.11.16",
        columnId: "to-do"
      },
    ]
  },
  {
    id: "in-progress",
    title: "В процессе",
    icon: "./src/assets/img/kanban/kanban__column--in-progress.svg",
    tasks: [
      {
        id: 1,
        title: "Задача 2",
        description: "Описание задачи 2",
        complexity: "high",
        dueDate: "2023.11.29",
        columnId: "to-do"
      },
    ]
  },
  {
    id: "done",
    title: "Выполнено",
    icon: "./src/assets/img/kanban/kanban__column--done.svg",
    tasks: []
  }
];


const tasks = [
  {
    id: 1,
    title: "Задача 1",
    description: "Описание задачи 1",
    complexity: "high",
    dueDate: "2023.11.16",
    columnId: "to-do"
  },
];
