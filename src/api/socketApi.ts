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

export const nextVideo = (sr: searchResult) => {
  if(message.currentVideo != null) {
    message.playlist?.push(sr);
    addToPlaylist(message);
  } else {
    message.currentVideo = sr.id.videoId;
    message.currentTimePercentage = 0;
    message.action = playerAction.Play;
    socket.emit("video-change", message);
  }

};

export const addToPlaylist = (message: playerMessage) => {
  console.log("Adding video to playlist:", message.playlist);
  socket.emit("add-to-playlist", message);
};



socket.onAny((event: any, msg: playerMessage) => {
  console.log(event, msg)
  message = msg;
});
export default socket;
