// ===== REFERENCIAS AL DOM =====
const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task-button");
const taskList = document.getElementById("task-list");
const statsText = document.getElementById("stats-text");
const emptyState = document.getElementById("empty-state");
const clearCompletedBtn = document.getElementById("clear-completed");

// ===== CARGAR TAREAS DEL LOCAL STORAGE =====
// Si hay tareas guardadas las cargamos, si no, comenzamos con un array vacío
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===== GUARDAR TAREAS EN LOCAL STORAGE =====
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== ACTUALIZAR ESTADÍSTICAS =====
function updateStats() {
    const pending = tasks.filter(task => !task.completed).length;
    const total = tasks.length;

    if (total === 0) {
        statsText.textContent = "0 tareas pendientes";
    } else if (pending === 0) {
        statsText.textContent = `✦ ¡Todo completado! (${total} tareas)`;
    } else {
        statsText.textContent = `${pending} tarea${pending !== 1 ? 's' : ''} pendiente${pending !== 1 ? 's' : ''}`;
    }
}

// ===== MOSTRAR / OCULTAR EMPTY STATE =====
function toggleEmptyState() {
    if (tasks.length === 0) {
        emptyState.classList.add("visible");
    } else {
        emptyState.classList.remove("visible");
    }
}

// ===== RENDERIZAR TODAS LAS TAREAS =====
function renderTasks() {
    // Limpiamos la lista antes de volver a pintarla
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        // Creamos el elemento <li>
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        // Checkbox visual
        const checkDiv = document.createElement("div");
        checkDiv.className = "task-check";
        checkDiv.textContent = task.completed ? "✓" : "";

        // Texto de la tarea
        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        // Botón eliminar
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "✕";
        deleteBtn.title = "Eliminar tarea";

        // ===== EVENTO: marcar como completada =====
        li.addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // ===== EVENTO: eliminar tarea =====
        deleteBtn.addEventListener("click", (e) => {
            // Detenemos que el click llegue al <li> (evita marcar como completado al borrar)
            e.stopPropagation();

            // Animación de salida antes de borrar
            li.style.transition = "opacity 0.2s, transform 0.2s";
            li.style.opacity = "0";
            li.style.transform = "translateX(20px)";

            setTimeout(() => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }, 200);
        });

        // Ensamblamos el elemento
        li.appendChild(checkDiv);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateStats();
    toggleEmptyState();
}

// ===== AGREGAR NUEVA TAREA =====
function addTask() {
    const text = taskInput.value.trim();

    // Validamos que el campo no esté vacío
    if (!text) {
        // Pequeña animación de error en el input
        taskInput.style.borderColor = "#ff6b6b";
        taskInput.style.boxShadow = "0 0 0 3px rgba(255, 107, 107, 0.15)";
        setTimeout(() => {
            taskInput.style.borderColor = "";
            taskInput.style.boxShadow = "";
        }, 800);
        return;
    }

    // Creamos el objeto de la tarea
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = "";
    saveTasks();
    renderTasks();

    // Hacemos scroll al final de la lista
    taskList.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ===== LIMPIAR TAREAS COMPLETADAS =====
clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
});

// ===== EVENTOS =====
// Al hacer clic en el botón "Agregar"
addTaskButton.addEventListener("click", addTask);

// Al presionar Enter en el input
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

// ===== INICIALIZAR LA APP =====
renderTasks();