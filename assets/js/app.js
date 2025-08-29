var cl = console.log;

const todoform = document.getElementById("todoform");
const todoitemcontrol = document.getElementById("todoitem");
const todocontainer = document.getElementById("todocontainer");
const todoaddbtn = document.getElementById("todoaddbtn");
const todoupdatebtn = document.getElementById("todoupdatebtn");

const uuid = () => {
    return String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
        .replace(/[xy]/g, (character) => {
            const random = (Math.random() * 16) | 0;
            const value = character === "x" ? random : (random & 0x3) | 0x8;
            return value.toString(16);
        });
};

// DB
let todoarr = [
    { todoitem: "JAVASCRIPT", todoid: '123' },
    { todoitem: "ANGULAR", todoid: '124' }
];

if (localStorage.getItem('todoarr')) {
    todoarr = JSON.parse(localStorage.getItem('todoarr'));
}

// Edit Todo
const onedit = (ele) => {
    let EDIT_ID = ele.closest("li").id;
    let EDIT_obj = todoarr.find(todo => todo.todoid === EDIT_ID);

    localStorage.setItem('EDIT_ID', EDIT_ID);
    todoitemcontrol.value = EDIT_obj.todoitem;

    todoaddbtn.classList.add('d-none');
    todoupdatebtn.classList.remove('d-none');
};

// Remove Todo
const onremove = (ele) => {
    let REMOVE_ID = ele.closest("li").id;
    let todoName = todoarr.find(todo => todo.todoid === REMOVE_ID)?.todoitem;

    Swal.fire({
        title: "Are you sure?",
        text: `Remove "${todoName}"? You won't be able to revert this!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let getIndex = todoarr.findIndex(todo => todo.todoid === REMOVE_ID);
            todoarr.splice(getIndex, 1);

            localStorage.setItem('todoarr', JSON.stringify(todoarr));
            ele.closest('li').remove();

            Swal.fire({
                title: `Todo "${todoName}" removed successfully!`,
                icon: "success",
                timer: 2000
            });
        }
    });
};

// Create Todo List
const createtodolist = (arr) => {
    if (arr.length > 0) {
        let result = '';
        arr.forEach(ele => {
            result += `
                <li class="list-group-item d-flex justify-content-between align-items-center" id="${ele.todoid}">
                    <strong>${ele.todoitem}</strong>
                    <div>
                        <button class="btn btn-sm btn-outline-primary" onclick="onedit(this)">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="onremove(this)">
                            <i class="bi bi-trash"></i> Remove
                        </button>
                    </div>
                </li>`;
        });
        todocontainer.innerHTML = result;
    }
};
createtodolist(todoarr);

// Add Todo
const ontodoadd = (eve) => {
    eve.preventDefault();

    let todoobj = {
        todoitem: todoitemcontrol.value.trim(),
        todoid: uuid(),
    };

    if (!todoobj.todoitem) {
        Swal.fire({ icon: "error", title: "Please enter a todo item" });
        return;
    }

    todoarr.push(todoobj);
    localStorage.setItem('todoarr', JSON.stringify(todoarr));

    let li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.id = todoobj.todoid;
    li.innerHTML = `
        <strong>${todoobj.todoitem}</strong>
        <div>
            <button class="btn btn-sm btn-outline-primary" onclick="onedit(this)">
                <i class="bi bi-pencil"></i> Edit
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="onremove(this)">
                <i class="bi bi-trash"></i> Remove
            </button>
        </div>`;
    todocontainer.append(li);

    Swal.fire({
        title: `${todoobj.todoitem} added successfully!`,
        icon: "success",
        timer: 2000
    });

    todoform.reset();
};

// Update Todo
const ontodoupdatebtn = () => {
    let UPDATE_ID = localStorage.getItem('EDIT_ID');
    let UPDATED_OBJ = {
        todoitem: todoitemcontrol.value.trim(),
        todoid: UPDATE_ID
    };

    let getIndex = todoarr.findIndex(todo => todo.todoid === UPDATE_ID);
    todoarr[getIndex] = UPDATED_OBJ;

    localStorage.setItem('todoarr', JSON.stringify(todoarr));

    let strong = document.getElementById(UPDATE_ID).firstElementChild;
    strong.innerHTML = UPDATED_OBJ.todoitem;

    todoform.reset();
    todoupdatebtn.classList.add('d-none');
    todoaddbtn.classList.remove('d-none');

    Swal.fire({
        title: `${UPDATED_OBJ.todoitem} updated successfully!`,
        icon: "success",
        timer: 2000
    });
};

todoform.addEventListener("submit", ontodoadd);
todoupdatebtn.addEventListener("click", ontodoupdatebtn);
