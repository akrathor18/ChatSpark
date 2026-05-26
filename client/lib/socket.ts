"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
    if (!socket) {
        socket = io("https://chatspark-p2ik.onrender.com", {
            withCredentials: true,
        });
    }
    return socket;
};