import { Server } from "socket.io";

export function initSockets(server) {
  const io = new Server(server, {
    cors: { origin: "http://localhost:3000" }
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", (msg) => {
      console.log("Message:", msg);
      io.emit("receiveMessage", `Bot echo: ${msg}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}
