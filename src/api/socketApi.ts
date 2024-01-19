"use client"
import { io } from "socket.io-client";
import { playerAction, playerMessage } from "@/src/interfaces/playerMessages";
let socket: any;

fetch("http://localhost:3000" + "/api/socket");
socket = io();

export let message: playerMessage = {
  roomId: "",
  currentTimePercentage: 0,
};

export const nextVideo = (videoId: string) => {
  message.currentVideo = videoId;
  message.currentTimePercentage = 0;
  message.action = playerAction.Play;
  socket.emit("video-change", message);
};

socket.onAny((event: any, msg: playerMessage) => {
  message = msg;
});
export default socket;
