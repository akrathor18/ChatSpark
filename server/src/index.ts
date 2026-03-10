import express from "express";
import http from "http";
import { Server } from "socket.io";
import db from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cookieParser from "cookie-parser";

import bodyParser from "body-parser";
const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(bodyParser.json());
import cors from "cors";

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    credentials: true,
  }),
);
app.get("/", (req, res) => {  
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("send_message", (data) => {
    console.log(data)

    io.emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id)
  })
})

server.listen(5000, () => {
  console.log("Server running on port 5000")
})