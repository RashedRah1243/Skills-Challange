const students = [
    { id: '1', name: 'Amanuel' },
    { id: '2', name: 'Bethel' },
    { id: '3', name: 'Chaltu' },
    { id: '4', name: 'Daniel' },
    { id: '5', name: 'Eden' },
    { id: '6', name: 'Fikadu' },
    { id: '7', name: 'Genet' },
    { id: '8', name: 'Hanna' },
    { id: '9', name: 'Isayas' },
    { id: '10', name: 'Kalkidan' }
];

const statusLists = {
    classList: students,
    Present: [],
    Late: [],
    Absent: []
};

let draggedStudent = null;
let draggedFrom = null;

function renderStudents() {
    ['classList', 'Present', 'Late', 'Absent'].forEach(col => {
        const column = document.querySelector(`.${col}`);
        column.querySelector('ul')?.remove();
        const ul = document.createElement('ul');
        column.appendChild(ul);

        statusLists[col].forEach(student => {
            const li = document.createElement('li');
            li.className = 'student-card';
            li.textContent = student.name;

            // Make draggable
            li.draggable = true;
            li.ondragstart = (e) => {
                draggedStudent = student;
                draggedFrom = col;
                li.classList.add('dragging');
            };
            li.ondragend = (e) => {
                draggedStudent = null;
                draggedFrom = null;
                li.classList.remove('dragging');
            };

            if (col === 'classList') {
                const btnGroup = document.createElement('div');
                btnGroup.style.display = 'flex';
                btnGroup.style.gap = '6px';

                ['Present', 'Late', 'Absent'].forEach(status => {
                    const btn = document.createElement('button');
                    btn.textContent = status;
                    btn.style.padding = '6px 12px';
                    btn.style.borderRadius = '8px';
                    btn.style.border = 'none';
                    btn.style.cursor = 'pointer';
                    btn.style.fontWeight = 'bold';
                    if (status === 'Present') btn.style.background = '#81c784', btn.style.color = '#fff';
                    if (status === 'Late') btn.style.background = '#ffd54f', btn.style.color = '#333';
                    if (status === 'Absent') btn.style.background = '#e57373', btn.style.color = '#fff';

                    btn.onclick = () => moveStudent(student.id, status);
                    btnGroup.appendChild(btn);
                });

                li.appendChild(btnGroup);
            }

            ul.appendChild(li);
        });

        // Make column droppable
        column.ondragover = (e) => {
            e.preventDefault();
            column.style.background = "#e3f2fd";
        };
        column.ondragleave = (e) => {
            column.style.background = "";
        };
        column.ondrop = (e) => {
            column.style.background = "";
            if (draggedStudent && draggedFrom !== col) {
                // Remove from previous
                statusLists[draggedFrom] = statusLists[draggedFrom].filter(s => s.id !== draggedStudent.id);
                // Add to new
                statusLists[col].push(draggedStudent);
                renderStudents();
            }
        };
    });
}

function moveStudent(id, status) {
    const idx = statusLists.classList.findIndex(s => s.id === id);
    if (idx !== -1) {
        const student = statusLists.classList.splice(idx, 1)[0];
        statusLists[status].push(student);
        renderStudents();
    }
}

renderStudents();
