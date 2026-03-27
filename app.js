const express = require("express")
const connectDB = require("./db")
const Task = require("./models/Task")

const app = express()

app.use(express.json())

connectDB()

app.get("/", (req, res) => {
    res.send("Hello from my first server!")
})

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find()
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.post("/tasks", async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            done: req.body.done
        })
        await task.save()
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.put("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, done: req.body.done },
            { new: true }
        )
        res.json(task)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.delete("/tasks/:id", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id)
        res.json({ message: "Task deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})