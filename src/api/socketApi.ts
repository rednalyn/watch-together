import { io } from "socket.io-client";
import { playerAction, playerMessage } from "../interfaces/playerMessages";
import { searchResult } from "../interfaces/searchResult";
let socket: any;

if (typeof window !== "undefined") {
  fetch(window.origin + "/api/socket");
}

socket = io();

export let message: playerMessage = {
  roomId: "",
  currentTimePercentage: 0,
};

export const playVideoFromPlaylist = (index: number) => {
  if(message.playlist != null) {
    const video = message.playlist![index]
    message.currentVideo = video.id.videoId;
    message.currentTimePercentage = 0;
    socket.emit("video-change",message)
    removeFromPlaylist(index);
  }
}

export const nextVideo = (sr: searchResult) => {
  if (message.currentVideo != null) {
    const videoExists = message.playlist?.some(video => {
      return video.id.videoId === sr.id.videoId;
    });
    if(!videoExists) {
      message.playlist?.push(sr);
      addToPlaylist(message);
    }
  } else {
    message.currentVideo = sr.id.videoId;
    message.currentTimePercentage = 0;
    message.action = playerAction.Play;
    socket.emit("video-change", message);
  }
};

export const addToPlaylist = (message: playerMessage) => {
  console.log("Adding video to playlist:", message.playlist);
  socket.emit("update-playlist", message);
};

export const removeFromPlaylist = (index: number) => {
  message.playlist?.splice(index, 1);
  socket.emit("update-playlist", message);
};

export const checkExistingRoom = (room: String) => {
  return new Promise((resolve) => {
    socket.emit('check-existing-room', room, (exists: boolean) => {
      resolve(exists);
    });
  });
};


socket.onAny((event: any, msg: playerMessage) => {
  // console.log(event, msg)
  message = msg;
});
export default socket;
