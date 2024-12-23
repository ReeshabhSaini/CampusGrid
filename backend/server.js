import express from "express"
import cors from "cors"
import "dotenv/config"
import authRoutes from "./routes/authRoutes.js"

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json())
app.use(cors())
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`Server Running on http://localhost:${port}`)
})
