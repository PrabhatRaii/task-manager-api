// ── API URL ──────────────────────────────────────────
const API_URL = "https://task-manager-api-wr3i.onrender.com"


// ── REGISTER ─────────────────────────────────────────
const registerBtn = document.getElementById("registerBtn")

if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
        const name = document.getElementById("name").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const message = document.getElementById("message")

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            })
            const data = await response.json()

            if (response.ok) {
                message.textContent = "Registered successfully! Redirecting to login..."
                message.className = "message success"
                setTimeout(() => { window.location.href = "login.html" }, 2000)
            } else {
                message.textContent = data.message
                message.className = "message error"
            }
        } catch (error) {
            message.textContent = "Something went wrong. Try again."
            message.className = "message error"
        }
    })
}


// ── LOGIN ─────────────────────────────────────────────
const loginBtn = document.getElementById("loginBtn")

if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const message = document.getElementById("message")

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()

            if (response.ok) {
                localStorage.setItem("token", data.token)
                message.textContent = "Login successful! Redirecting..."
                message.className = "message success"
                setTimeout(() => { window.location.href = "tasks.html" }, 2000)
            } else {
                message.textContent = data.message
                message.className = "message error"
            }
        } catch (error) {
            message.textContent = "Something went wrong. Try again."
            message.className = "message error"
        }
    })
}


// ── TASKS ─────────────────────────────────────────────
const token = localStorage.getItem("token")
const tasksList = document.getElementById("tasksList")

// Toggle task done/undone — global function
async function toggleDone(id, currentStatus) {
    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            },
            body: JSON.stringify({ done: !currentStatus })
        })
        loadTasks()
    } catch (error) {
        console.log(error)
    }
}

// Delete task — global function
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE",
            headers: { "authorization": token }
        })
        loadTasks()
    } catch (error) {
        console.log(error)
    }
}

// Load all tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: "GET",
            headers: { "authorization": token }
        })
        const tasks = await response.json()

        tasksList.innerHTML = ""

        if (tasks.length === 0) {
            tasksList.innerHTML = "<p style='text-align:center;color:#999'>No tasks yet. Add one above!</p>"
            return
        }

        tasks.forEach(task => {
            const taskItem = document.createElement("div")
            taskItem.className = `task-item ${task.done ? "done" : ""}`
            taskItem.innerHTML = `
                <span class="task-title ${task.done ? "done" : ""}">${task.title}</span>
                <div class="task-actions">
                    <button class="done-btn" onclick="toggleDone('${task._id}', ${task.done})">
                        ${task.done ? "Undo" : "Done"}
                    </button>
                    <button class="delete-btn" onclick="deleteTask('${task._id}')">
                        Delete
                    </button>
                </div>
            `
            tasksList.appendChild(taskItem)
        })

    } catch (error) {
        console.log(error)
    }
}

if (tasksList) {
    // If no token — redirect to login
    if (!token) {
        window.location.href = "login.html"
    }

    // Add new task
    const addTaskBtn = document.getElementById("addTaskBtn")
    addTaskBtn.addEventListener("click", async () => {
        const taskInput = document.getElementById("taskInput")
        const title = taskInput.value
        const message = document.getElementById("message")

        if (!title) {
            message.textContent = "Please enter a task title"
            message.className = "message error"
            return
        }

        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                },
                body: JSON.stringify({ title, done: false })
            })

            if (response.ok) {
                taskInput.value = ""
                message.textContent = ""
                loadTasks()
            }
        } catch (error) {
            console.log(error)
        }
    })

    // Logout
    const logoutBtn = document.getElementById("logoutBtn")
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token")
        window.location.href = "login.html"
    })

    // Load tasks on page open
    loadTasks()
}