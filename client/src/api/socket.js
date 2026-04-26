import { io } from "socket.io-client";
let socket;
export function getSocket() {
  if (socket) return socket;
  socket = io("/", { auth: { token: localStorage.getItem("token") }, autoConnect: true });
  return socket;
}
export function disconnectSocket() { if (socket) { socket.disconnect(); socket = null; } }
