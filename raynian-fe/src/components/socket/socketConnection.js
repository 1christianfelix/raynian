import io from "socket.io-client";
import { updateParticipants, updateChat } from "../../slices/roomSlice";
import store from "../../store";

let socket = null;

export const socketServerConnect = () => {
  socket = io.connect("http://localhost:4001");
  console.log("test");

  socket.on("room-participants", (data) => {
    store.dispatch(updateParticipants(data));
    console.log(data, " joined");
  });

  socket.on("room-messages", (messages) => {
    console.log("room-messages");
    store.dispatch(updateChat(messages));
    console.log(messages);
  });
};

/**
 * Joins a room by emitting a socket event.
 *
 * @param {Object} data - The data object containing room and user information.
 * @param {string} data.roomId - The ID of the room to join.
 * @param {Object} data.user - Information about the user joining the room.
 * @param {string} data.user._id - The ID of the user.
 * @param {string} data.user.username - The username of the user.
 * @returns {void}
 */
export const joinRoom = (data) => {
  console.log("joinRoom");
  console.log(data);
  socket.emit("join-room", data);
};

export const sendRoomChat = (data) => {
  console.log(data);
  socket.emit("room-chat", data);
};

export { socket };
