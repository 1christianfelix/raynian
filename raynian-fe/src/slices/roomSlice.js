import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  host: {},
  roomId: null,
  chat: [],
  participants: [],
  roomSettings: {},
  public: true,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    // Connect to room
    connectToRoom: (state, action) => {
      state.roomId = action.payload;
    },
    // Added socketId field to user field upon connection to socket server
    updateSocketId: (state, action) => {
      state.user = { ...state.user, socketId: action.payload };
    },

    // Reseting room state back to default
    disconnectFromRoom: (state) => {
      state.user = {
        _id: state.user._id,
        username: state.user.username,
      };
      state.host = {};
      state.roomId = null;
      state.chat = [];
      state.participants = [];
    },

    // Reducer for updating the chat log
    updateChat: (state, action) => {
      state.chat = [...state.chat, action.payload];
    },

    // Reducer for updating the participants
    updateParticipants: (state, action) => {
      // The payload should be an array of participant names
      state.participants = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRoom.fulfilled, (state, action) => {
        console.log(action.payload);
        // Update the state based on the fulfilled action
        state.host = action.payload.host;
        state.roomId = action.payload.roomId;
        state.participants = action.payload.participants;
        state.public = action.payload.public;
        // Other state updates as needed
      })
      .addCase(setRoomUser.fulfilled, (state, action) => {
        state.user = {
          _id: action.payload.user._id,
          username: action.payload.user.username,
        };
      });
  },
});

// more createAsyncThunk parameters https://redux-toolkit.js.org/api/createAsyncThunk#payloadcreator
// accessing redux state with getState
export const setRoomUser = createAsyncThunk(
  "room/initializeUser",
  (_, { getState }) => {
    const userInfo = getState().auth.userInfo;
    return userInfo;
  }
);

export const createRoom = createAsyncThunk("room/createRoom", async (req) => {
  const response = await fetch("http://localhost:4000/api/room/", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  const data = await response.json();
  return data; // This will be the payload of the fulfilled action
});

export const {
  connectToRoom,
  updateChat,
  updateParticipants,
  updateSocketId,
  disconnectFromRoom,
} = roomSlice.actions;
export default roomSlice.reducer;
