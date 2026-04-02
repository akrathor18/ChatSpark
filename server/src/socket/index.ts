import { Server } from "socket.io";
import { registerHandlers } from "./handlers.js";

export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {

    registerHandlers(io, socket);

    socket.on("disconnect", () => {
    });
  });
};