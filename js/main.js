document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const taskList = document.querySelector(".tasks");
    const itemsLeft = document.getElementById("items-left");
    const allTasksBtn = document.getElementById("all-tasks");
    const activeTasksBtn = document.getElementById("active-tasks");
    const completedTasksBtn = document.getElementById("completed-tasks");
    const clearCompletedBtn = document.getElementById("clearAll");
    const toggleThemeBtn = document.getElementById("toggle");
    const body = document.body;
    const bgImage = document.getElementById("bg-img");
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let currentFilter = "all";

    function renderTasks() {
        taskList.innerHTML = "";
        let countCompletedTasks = 0;
        let filteredTasks = tasks.filter(task => {
            if (currentFilter === "completed") return task.status === "completed";
            if (currentFilter === "active") return task.status === "pending";
            return true;
        });

        tasks.map((e) => {
            if (e.status == "completed") {
                countCompletedTasks++;
            };
        })

        filteredTasks.forEach(task => createTaskElement(task));
        updateItemsLeft();
        updateFilterButtons();
        changeProgressBar(countCompletedTasks);
    }

    function changeProgressBar(countCompletedTasks) {

        let persentage = (countCompletedTasks / tasks.length) * 100;
        if (tasks.length == 0) {
            persentage = 0;
        }
        document.documentElement.style.setProperty('--Progress-Persentage', `${persentage}%`);
    }

    function createTaskElement(task) {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.setAttribute("data-id", task.id);
        if (task.status === "completed") taskElement.classList.add("completed");

        taskElement.innerHTML = `
            <div class="custom-check ${task.status === "completed" ? "check" : ""}" data-id="${task.id}"><span></span></div>
            <span contenteditable="true" data-id="${task.id}">${task.title}</span>
            <button class="remove-task" data-id="${task.id}">X</button>
        `;

        taskList.appendChild(taskElement);
    }

    function updateItemsLeft() {
        const pendingTasks = tasks.filter(task => task.status === "pending").length;
        itemsLeft.textContent = pendingTasks;
    }

    function removeTask(id) {
        tasks = tasks.filter(task => task.id != id);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function addTask(title) {
        if (!title.trim()) return;
        const newTask = { id: Date.now(), title, status: "pending" };
        tasks.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function toggleTaskStatus(id) {
        tasks = tasks.map(task => {
            if (task.id == id) {
                task.status = task.status === "pending" ? "completed" : "pending";
            }
            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function editTaskTitle(id, newTitle) {
        tasks = tasks.map(task => {
            if (task.id == id) task.title = newTitle;
            return task;
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function clearCompletedTasks() {
        tasks = tasks.filter(task => task.status !== "completed");
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
    }

    function updateFilterButtons() {
        allTasksBtn.classList.remove("active");
        activeTasksBtn.classList.remove("active");
        completedTasksBtn.classList.remove("active");

        if (currentFilter === "all") allTasksBtn.classList.add("active");
        if (currentFilter === "active") activeTasksBtn.classList.add("active");
        if (currentFilter === "completed") completedTasksBtn.classList.add("active");
    }

    function updateBackgroundImage() {
        if (body.classList.contains("light")) {
            bgImage.src = "images/bg-desktop-light.jpg";
        } else {
            bgImage.src = "images/bg-desktop-dark.jpg";
        }
    }

    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTask(taskInput.value);
            taskInput.value = "";
        }
    });

    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("custom-check")) {
            const taskId = e.target.dataset.id;
            toggleTaskStatus(taskId);
            const taskElement = document.querySelector(`.task[data-id='${taskId}']`);
            taskElement.classList.toggle("completed");
            e.target.classList.toggle("check");
        } else if (e.target.classList.contains("remove-task")) {
            removeTask(e.target.dataset.id);
        }
    });



    taskList.addEventListener("input", (e) => {
        if (e.target.tagName.toLowerCase() === "span") {
            e.target.addEventListener("blur", () => {
                editTaskTitle(e.target.dataset.id, e.target.textContent);
            });
        }
    });

    allTasksBtn.addEventListener("click", () => {
        currentFilter = "all";
        renderTasks();
    });

    activeTasksBtn.addEventListener("click", () => {
        currentFilter = "active";
        renderTasks();
    });

    completedTasksBtn.addEventListener("click", () => {
        currentFilter = "completed";
        renderTasks();
    });

    clearCompletedBtn.addEventListener("click", clearCompletedTasks);

    toggleThemeBtn.addEventListener("click", () => {
        body.classList.toggle("light");
        localStorage.setItem("theme", body.classList.contains("light") ? "light" : "dark");
        updateBackgroundImage();
    });

    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light");
        updateBackgroundImage();
    }

    renderTasks();
});