let draggedTask = null
let offsetX = 0, offsetY = 0
let delKey, delI

let editTask
let search = ''
let filter = ''
let sort = 'estimatedTime'

let tasks = {
    toDo: [
        {
            id: '1',
            title: 'task 1',
            description: 'jashdjlfh jdjka shfkl saldkjfhkjl sdlkjahfjklhaa sdlkjfhjkalsa sdkljfhljaksas ldkjfhjklashdls kajdfhkhsdfjklha jkhdfjklh.',
            timeEstmate: 30,
            priority: 'low'
        },
        {
            id: '2',
            title: 'task 2',
            description: 'jashdjlfh jdjka shfkl saldkjfhkjl sdlkjahfjklhaa sdlkjfhjkalsa sdkljfhljaksas ldkjfhjklashdls kajdfhkhsdfjklha jkhdfjklh.',
            timeEstmate: 60,
            priority: 'high'

        }
    ],
    inProgress: [
        {
            id: '3',
            title: 'task 3',
            description: 'jashdjlfh jdjka shfkl saldkjfhkjl sdlkjahfjklhaa sdlkjfhjkalsa sdkljfhljaksas ldkjfhjklashdls kajdfhkhsdfjklha jkhdfjklh.',
            timeEstmate: 120,
            priority: 'medium'
        }
    ],
    completed: [

    ]
}

if (localStorage.sc) {
    tasks = JSON.parse(localStorage.sc)
}

const clearDialog = () => {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('timeEs').value = '';

}

const clearTasks = () => {
    document.querySelectorAll('.column').forEach(column => {
        column.innerHTML = ''
        document.getElementById('toDo').innerHTML = `<h1>To Do</h1>`
        document.getElementById('inProgress').innerHTML = `<h1>In Progress</h1>`
        document.getElementById('completed').innerHTML = `<h1>Completed</h1>`
    })
}

const taskPriorityOrder = {
    high: 30,
    medium: 20,
    low: 10,
}

const taskRender = () => {
    clearTasks()
    Object.keys(tasks).forEach(key => {
        if (sort) {
            tasks[key].sort((a, b) => {
                if (sort === 'estimatedTime') {
                    return a.timeEstmate - b.timeEstmate;
                } else if (sort === 'priority') {
                    return taskPriorityOrder[b.priority] - taskPriorityOrder[a.priority]
                } else if (sort === 'actualTime') {
                    return a.timer.totalTime - b.timer.totalTime;
                }
            })
        }

        tasks[key].forEach((task, i) => {
            if (search &&
                !(task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase()))
            ) return;
            if (filter && (task.priority !== filter)) return;


            let timeDiff = task.timeEstmate - task.timer?.totalTime / (1000 * 60)
            const div = document.createElement('div')
            div.classList.add('tasks')
            div.dataset.id = task.id;
            div.innerHTML = `
                <div class="topButtons">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delete"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="edit"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
                </div> 
                <div class='main'>
                    <p class='priority'>${task.priority}</p>
                    <h1>${task.title}</h1>
                    <p>${task.description}</p>
                </div>
                <div class='parent'>
                    <div class='timeES'>
                        <h3>Time Estimate</h3>
                        <div class='timeEstmate'>${task.timeEstmate}Mins</div>
                    </div>

                    <span class='line'></span>
                    
                    <div class='timerContent'>
                        <h3>Timer</h3>
                        <div class='timer'>00:00</div>
                        <div class='buttons'>
                            <button class="start">start</button>
                            <button class="pause">pause</button>
                            <button class="stop">stop</button>
                        </div>
                    </div>

                    <span class='line2'></span>


                    <div class='timeDiff'>
                        <h3>Time Diffrence</h3>
                        <div class='timeDiffrence'>${!task.timer ? 'N/A' : Math.floor(timeDiff / 60).toString().padStart(2, '0') + ':' + Math.floor(timeDiff % 60).toString().padStart(2, '0') + ':' + Math.floor((timeDiff * 60) % 60).toString().padStart(2, '0')}</div>
                    </div>
                    
                </div>
            `



            div.addEventListener('mousedown', event => {
                const bounding = div.getBoundingClientRect();
                offsetX = event.clientX - bounding.left
                offsetY = event.clientY - bounding.top
                div.classList.add('dragged');
                div.style.top = event.clientY - offsetY + 'px';
                div.style.left = event.clientX - offsetX + 'px';
                draggedTask = div

            })

            div.querySelector('.start').addEventListener('mousedown', event => event.stopPropagation())
            div.querySelector('.start').addEventListener('click', event => {
                if (task.timer) {
                    task.timer.isPaused = false
                    task.timer.startAt = Date.now()
                } else {
                    task.timer = {
                        isPaused: false,
                        startAt: Date.now(),
                        totalTime: 0
                    }
                }
                localStorage.sc = JSON.stringify(tasks);

            })

            div.querySelector('.pause').addEventListener('mousedown', event => event.stopPropagation())
            div.querySelector('.pause').addEventListener('click', event => {
                if (task.timer && !task.timer.isPaused) {
                    task.timer.isPaused = true;
                    task.timer.totalTime += Date.now() - task.timer.startAt;
                }
                localStorage.sc = JSON.stringify(tasks);

            })
            div.querySelector('.stop').addEventListener('mousedown', event => event.stopImmediatePropagation())
            div.querySelector('.stop').addEventListener('click', event => {
                if (task.timer) {
                    if (!task.timer.isPaused) {
                        task.timer.isPaused = true;
                        task.timer.totalTime += Date.now() - task.timer.startAt;
                    }
                    tasks.completed.push(task)
                    tasks[key].splice(i, 1)
                    taskRender()

                }
                localStorage.sc = JSON.stringify(tasks);

            })

            div.querySelector('.delete').addEventListener('mousedown', event => event.stopPropagation())
            div.querySelector('.delete').addEventListener('click', event => {
                document.querySelector('.deleteDialog').showModal();
                delI = i
                delKey = key
            })


            div.querySelector('.edit').addEventListener('mousedown', event => event.stopPropagation())
            div.querySelector('.edit').addEventListener('click', event => {
                document.querySelector('.dialogEditTask').showModal();
                document.getElementById('titleEdit').value = task.title;
                document.getElementById('descriptionEdit').value = task.description;
                document.getElementById('timeEsEdit').value = task.timeEstmate;
                document.getElementById('priorityEdit').value = task.priority
                editTask = task
            })

            document.getElementById(key).appendChild(div);


            if (task.priority == 'low') {
                div.querySelector('.priority').style.color = 'green'
                div.style.borderLeft = '10px solid green'
            } else if (task.priority == 'medium') {
                div.querySelector('.priority').style.color = 'yellow'
                div.style.borderLeft = '10px solid yellow'
            } else {
                div.querySelector('.priority').style.color = 'red'
                div.style.borderLeft = '10px solid red'
            }
        });
    });

}

taskRender()

document.querySelector('.clear').addEventListener('click', event => {
    let confirmed = confirm('Are you sure?');
    if (confirmed) {
        tasks.toDo = []
        tasks.inProgress = []
        tasks.completed = []
        taskRender()
        localStorage.sc = JSON.stringify(tasks);
    }

})

document.querySelector('.cancelEdit').addEventListener('click', event => {
    document.querySelector('.dialogEditTask').close()
})

document.querySelector('.deleteTask').addEventListener('click', event => {
    tasks[delKey].splice(delI, 1)
    localStorage.sc = JSON.stringify(tasks);
    document.querySelector('.deleteDialog').close();
    taskRender()

})

document.querySelector('.cancelDel').addEventListener('click', event => {
    document.querySelector('.deleteDialog').close();

})

document.querySelector('.dialogEdit').addEventListener('submit', event => {
    event.preventDefault()
    editTask.title = document.getElementById('titleEdit').value;
    editTask.description = document.getElementById('descriptionEdit').value
    editTask.estmatedTime = document.getElementById('timeEsEdit').value
    editTask.priority = document.getElementById('priorityEdit').value;
    taskRender();
    localStorage.sc = JSON.stringify(tasks);
    document.querySelector('.dialogEditTask').close()
})



document.addEventListener('mousemove', event => {
    if (draggedTask) {
        draggedTask.style.top = event.clientY - offsetY + 'px';
        draggedTask.style.left = event.clientX - offsetX + 'px';
    }
})

document.addEventListener('mouseup', (event) => {
    if (draggedTask) {
        draggedTask.classList.remove('dragged');
        draggedTask.style.top = '0px';
        draggedTask.style.left = '0px';
        draggedTask = null;
    }
})

document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('mouseup', event => {
        if (draggedTask) {
            const key = draggedTask.parentElement.id;
            const id = draggedTask.dataset.id;
            const task = tasks[key].find(task => task.id === id);
            tasks[key] = tasks[key].filter(task => task.id !== id);
            tasks[column.id].push(task);
            taskRender();
        }
        localStorage.sc = JSON.stringify(tasks);
    })
});

document.querySelector('.new-task-btn').addEventListener('click', event => {
    document.querySelector('.dialogCreateTask').showModal()
})

document.querySelector('.cancel').addEventListener('click', event => {
    document.querySelector('.dialogCreateTask').close()
})

document.querySelector('.dialogCreateTask').addEventListener('submit', event => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const timeEstmate = document.getElementById('timeEs').value;
    const priority = document.getElementById('priority').value;
    tasks.toDo.push({ id: crypto.randomUUID(), title, description, timeEstmate, priority })
    document.querySelector('.dialogCreateTask').close()
    localStorage.sc = JSON.stringify(tasks);
    clearDialog();
    taskRender();

})

const intervalFn = () => {
    Object.keys(tasks).forEach(key => {
        tasks[key].forEach(task => {
            let diff = task.timer?.totalTime ?? 0;
            if (task.timer && !task.timer.isPaused) {
                diff += Date.now() - task.timer.startAt;
            }
            if (document.querySelector(`[data-id="${task.id}"] .timer`)) {
                document.querySelector(`[data-id="${task.id}"] .timer`).innerHTML =
                    Math.floor(diff / (1000 * 60)).toString().padStart(2, '0') + ':' +
                    Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
            }
        });
    });
}

intervalFn();
setInterval(() => {
    intervalFn();
}, 500);

document.querySelector('.export').addEventListener('click', event => {
    const jsonString = JSON.stringify(tasks, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "dataFile.json";
    link.click()
    link.remove()
})

document.querySelector('.search').addEventListener('keyup', event => {
    search = event.target.value;
    taskRender()
})

document.getElementById('prioritySelect').addEventListener('change', event => {
    filter = event.target.value;
    taskRender();
})

document.getElementById('sort').addEventListener('change', event => {
    sort = event.target.value;
    taskRender()
})