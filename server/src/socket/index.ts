import { Server } from "socket.io";
import { registerHandlers } from "./handlers.js";

export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    registerHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};