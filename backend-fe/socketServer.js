const socketStore = require("./socketServerStores/socketStore");
const { Server } = require("socket.io");
const joinRoomHandler = require("./socketHandlers/joinRoomHandler");
const sendRoomMessageHandler = require("./socketHandlers/sendRoomMessageHandler");

const registerSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
    },
  });

  socketStore.setSocketServerInstance(io);

  io.on("connection", (socket) => {
    console.log("User:", socket.id);

    // Joining a room
    socket.on("join-room", (data) => {
      socket.join(data.roomId);
      joinRoomHandler(socket, data);
    });

    // Leaving a room
    socket.on("leave-room", (roomId) => {
      console.log("leaving room");
      socket.leave(roomId);
      // leaveRoomHandler(socket, roomId);
    });

    // Sending chat message
    socket.on("send-room-chat", (data) => {
      console.log(data);
      sendRoomMessageHandler(data);
    });

    // Disconnect from room
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};

module.exports = {
  registerSocketServer,
};
