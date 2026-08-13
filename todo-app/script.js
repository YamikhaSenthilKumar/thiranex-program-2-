// ==========================================
// YAMIKHA'S TO-DO LIST
// CRUD + localStorage + Filtering
// ==========================================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filter");


// Store all tasks in this array
let tasks = JSON.parse(localStorage.getItem("yamikhaTasks")) || [];


// Current filter
let currentFilter = "all";


// ==========================================
// SAVE TASKS TO LOCAL STORAGE
// ==========================================

function saveTasks() {
    localStorage.setItem("yamikhaTasks", JSON.stringify(tasks));
}


// ==========================================
// DISPLAY TASKS
// ==========================================

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        li.dataset.id = task.id;


        li.innerHTML = `
            <input
                type="checkbox"
                class="complete-checkbox"
                ${task.completed ? "checked" : ""}
                aria-label="Mark task as completed"
            >

            <span class="task-text">${escapeHTML(task.text)}</span>

            <div class="task-actions">
                <button
                    type="button"
                    class="edit-btn"
                    data-action="edit"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    data-action="delete"
                >
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });


    updateTaskCount();
}


// ==========================================
// ADD TASK - CREATE
// ==========================================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false
    };


    tasks.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = "";

    taskInput.focus();
});


// ==========================================
// EVENT DELEGATION
// ==========================================

taskList.addEventListener("click", function(event) {

    const taskItem = event.target.closest(".task-item");

    if (!taskItem) {
        return;
    }


    const taskId = Number(taskItem.dataset.id);

    const action = event.target.dataset.action;


    // DELETE
    if (action === "delete") {

        tasks = tasks.filter(task => task.id !== taskId);

        saveTasks();

        renderTasks();

        return;
    }


    // EDIT / UPDATE
    if (action === "edit") {

        const task = tasks.find(task => task.id === taskId);

        if (!task) {
            return;
        }


        const updatedText = prompt(
            "Edit your task:",
            task.text
        );


        if (updatedText !== null) {

            const cleanedText = updatedText.trim();

            if (cleanedText !== "") {

                task.text = cleanedText;

                saveTasks();

                renderTasks();
            }
        }
    }
});


// ==========================================
// COMPLETE / UNCOMPLETE TASK
// ==========================================

taskList.addEventListener("change", function(event) {

    if (!event.target.classList.contains("complete-checkbox")) {
        return;
    }


    const taskItem = event.target.closest(".task-item");

    const taskId = Number(taskItem.dataset.id);


    const task = tasks.find(task => task.id === taskId);

    if (!task) {
        return;
    }


    task.completed = event.target.checked;

    saveTasks();

    renderTasks();
});


// ==========================================
// FILTERING
// ALL / ACTIVE / COMPLETED
// ==========================================

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;


        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        renderTasks();
    });
});


// ==========================================
// TASK COUNT
// ==========================================

function updateTaskCount() {

    const activeTasks = tasks.filter(
        task => !task.completed
    ).length;


    if (activeTasks === 1) {

        taskCount.textContent = "1 task remaining";

    } else {

        taskCount.textContent =
            `${activeTasks} tasks remaining`;
    }
}


// ==========================================
// SECURITY
// Prevent HTML entered by users from
// being interpreted as real HTML.
// ==========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ==========================================
// LOAD SAVED TASKS
// ==========================================

renderTasks();