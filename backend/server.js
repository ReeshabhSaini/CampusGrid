import express from "express"
import cors from "cors"
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"
import studentTimetableRoutes from "./routes/studentTimetableRoutes.js"
import professorTimetableRoutes from "./routes/professorTimetableRoutes.js"
import rescheduleRoutes from "./routes/rescheduleRoutes.js"

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json())
app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/student", studentTimetableRoutes);
app.use("/api/professor", professorTimetableRoutes);
app.use("/api", rescheduleRoutes)

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`)
})
