const API_URL = "https://task-manager-api-wr3i.onrender.com"

// Register
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
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            })

            const data = await response.json()

            if (response.ok) {
                message.textContent = "Registered successfully! Redirecting to login..."
                message.className = "message success"
                setTimeout(() => {
                    window.location.href = "login.html"
                }, 2000)
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