require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./db")
const Task = require("./models/Task")
const authRoutes = require("./routes/auth")
const protect = require("./middleware/protect")

const app = express()

app.use(cors({
    origin: "*"
}))

app.use(express.json())

connectDB()

app.use("/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("Hello from my first server!")
})

app.get("/tasks", protect, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId })
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.post("/tasks", protect, async (req, res) => {
    try {
        if (!req.body.title || req.body.title.trim() === "") {
            return res.status(400).json({ message: "Title is required" })
        }
        const task = new Task({
            title: req.body.title,
            done: req.body.done,
            user: req.userId
        })
        await task.save()
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.put("/tasks/:id", protect, async (req, res) => {
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

app.delete("/tasks/:id", protect, async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id)
        res.json({ message: "Task deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

app.listen(process.env.PORT, () => {
    console.log("Server is running on port " + process.env.PORT)
})
```

Replace everything in your `app.js` with this. Save it. Then run:
```
git add .
git commit -m "fixed cors"
git push