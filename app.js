const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.send("Hello from my first server!")
})
app.post("/tasks", (req, res) => {
    res.json({ message: "Task created successfully" })
})



app.get("/tasks", (req, res) => {
    const tasks = [
        { id: 1, title: "Buy milk", done: false },
        { id: 2, title: "Go to gym", done: true },
        { id: 3, title: "Study Node.js", done: false }
    ]
    res.json(tasks)
})  

app.put("/tasks/:id", (req, res) => {
    res.json({ message: "Task updated successfully" })
})

app.delete("/tasks/:id", (req, res) => {
    res.json({ message: "Task deleted successfully" })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})