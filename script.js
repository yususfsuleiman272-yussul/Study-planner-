const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const searchInput = document.getElementById("searchInput");
const noResultsMessage = document.getElementById("noResultsMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateSummary() {
totalTasks.textContent = tasks.length;

const completed = tasks.filter(function(task) {
    return task.completed;
}).length;

completedTasks.textContent = completed;
pendingTasks.textContent = tasks.length - completed;

}

function displayTasks() {
taskList.innerHTML = "";

const searchText = searchInput.value.toLowerCase();

const filteredTasks = tasks.filter(function(task) {
    return task.name.toLowerCase().includes(searchText);
});

emptyMessage.style.display =
    tasks.length === 0 ? "block" : "none";

noResultsMessage.style.display =
    tasks.length > 0 && filteredTasks.length === 0
        ? "block"
        : "none";

filteredTasks.forEach(function(task) {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
        li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
        "aria-label",
        "Mark task as completed"
    );

    checkbox.addEventListener("change", function() {
        task.completed = checkbox.checked;

        saveTasks();
        displayTasks();
    });

    const details = document.createElement("div");
    details.className = "task-details";

    const name = document.createElement("span");
    name.className = "task-name";
    name.textContent = task.name;

    details.appendChild(name);

    if (task.date) {
        const date = document.createElement("span");
        date.className = "task-date";

        if (task.date < new Date().toISOString().split("T")[0]
            && !task.completed) {
            date.textContent = "OVERDUE — Due: " + task.date;
            li.classList.add("overdue");
        } else {
            date.textContent = "Due: " + task.date;
        }

        details.appendChild(date);
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";

    deleteButton.addEventListener("click", function() {
        tasks = tasks.filter(function(item) {
            return item.id !== task.id;
        });

        saveTasks();
        displayTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(details);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
});

updateSummary();

}

taskForm.addEventListener("submit", function(event) {
event.preventDefault();

const taskName = taskInput.value.trim();

if (taskName === "") {
    return;
}

const newTask = {
    id: Date.now(),
    name: taskName,
    date: taskDate.value,
    completed: false
};

tasks.push(newTask);

saveTasks();

taskInput.value = "";
taskDate.value = "";

displayTasks();

});

searchInput.addEventListener("input", function() {
displayTasks();
});

displayTasks();