import { io } from "socket.io-client";
import { playerMessage } from "../interfaces/playerMessages";
let socket: any;
export let message: playerMessage = {
  roomId: "",
  currentTimePercentage: 0,
};
fetch("/api/socket");
socket = io();

socket.onAny((event: any, msg: playerMessage) => {
  message = msg;
});
export default socket;
