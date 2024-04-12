import { playerMessage } from "@/src/interfaces/playerMessages";
import { Server } from "socket.io";
import { generateUsername } from "unique-username-generator";

let state: playerMessage[] = [];

const saveMessage = async (msg: playerMessage) => {
  let room = state.find((a) => {
    return a.roomId == msg.roomId;
  });
  if (room) {
    if (msg.action) room.action = msg.action;
    if (msg.currentTimePercentage > -1)
      room.currentTimePercentage = msg.currentTimePercentage;
    if (msg.currentVideo) room.currentVideo = msg.currentVideo;
    room.roomId = msg.roomId;
    if (msg.playlist) room.playlist = msg.playlist;
    if (msg.users) room.users = msg.users;
  } else {
    state.push({
      action: msg.action,
      currentTimePercentage: msg.currentTimePercentage,
      currentVideo: msg.currentVideo,
      roomId: msg.roomId,
      playlist: [],
      users: [],
    });
  }
};

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.prependAny(async (event: any, msg: playerMessage) => {
        await saveMessage(msg);
      });
      socket.on("joinRoom", (msg: playerMessage) => {
        console.log("joining room " + msg.roomId);
        socket.join(msg.roomId);
        let room = state.find((a) => {
          return a.roomId == msg.roomId;
        });
        room?.users?.push({ socketId: socket.id, userName: generateUsername() });
        io.to(msg.roomId).emit("userlist-changed", room);
      });
      socket.on("playerState-change", (msg: playerMessage) => {
        io.to(msg.roomId).emit(
          "update-playerState",
          state.find((a) => {
            return a.roomId == msg.roomId;
          })
        );
      });
      socket.on("playerProgress-change", (msg: playerMessage) => {
        io.to(msg.roomId).emit(
          "update-playerProgress",
          state.find((a) => {
            return a.roomId == msg.roomId;
          })
        );
      });
      socket.on("video-change", (msg: playerMessage) => {
        io.to(msg.roomId).emit(
          "update-video",
          state.find((a) => {
            return a.roomId == msg.roomId;
          })
        );
      });
      socket.on("disconnecting", (reason) => {
        socket.rooms.forEach((socketRoom) => {
          if (socketRoom !== socket.id) {
            let room = state.find((a) => {
              return a.roomId == socketRoom;
            });
            room?.users?.forEach((user, index) => {
              if (user.socketId == socket.id) {
                room?.users?.splice(index, 1);
                io.to(socketRoom).emit("userlist-changed", room);
              }
            });
          }
        });
      });
      socket.on("add-to-playlist", (msg: playerMessage) => {
          io.to(msg.roomId).emit("playlist-update", msg);
      });
    });
  }
  res.end();
};

export default SocketHandler;
