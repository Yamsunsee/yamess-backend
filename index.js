import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import bodyPaser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server)
const PORT = process.env.PORT

app.use(bodyPaser.json({ limit: "30mb" }))
app.use(bodyPaser.urlencoded({ extended: true, limit: "30mb" }))
app.use(cors())

app.get("/", (req, res) => {
  res.send("Server is running...")
})

io.on("connection", (socket) => {
  console.log("Someone has joint room", socket.id)
  socket.on("message", (data) => {
    socket.broadcast.emit("message-from-server", data)
  })
  socket.on("disconnect", () => {
    console.log(socket.id, "has left")
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`)
})
