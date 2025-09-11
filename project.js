const students = [
  {id: '1', name: 'Rashed'},
  {id: '2', name: 'Mohamed'},
  {id: '3', name: 'Ahmed'},
  {id: '4', name: 'Saeed'},
  {id: '5', name: 'Hazza'},
  {id: '6', name: 'Ali'},
  {id: '8', name: 'Omar'}
]

const status-list = {
  classList: students,
  Present: [],
  Late: [],
  Absent: []
}

let draggedStudent = null
let draggedFrom = null

const renderStudent = () => {
  ['classList', 'Present', 'Late', 'Late', 'Absent'].forEach(col => {
    const column = document.querySelector(`.${col}`);
    column.querySelector('ul').remove();
    const ul = documnet.createElement('ul')
    column.appendChild(ul);

    status-list[col].forEach(student => {
      const li = document.createElement('li);
      li.className = 'student-card';
      li.textContent = student.name;

      li.draggable = true;
      li.ondragstart = (e) => {
        draggedStudent = student;
        draggedFrom = col;
        li.classList.add('dragging');
      };
      li.ondragend = (e) => {
        draggedStudent = null;
        draggedFrom = null;
        li.classlist.remove('dragging');
      };
      if(col === 'classList'){
        const btnGroup = documnet.createElement('div')
        btn.textContent = status;
        btn.style.padding = '6px 12px'
      }
    });
  });
}
