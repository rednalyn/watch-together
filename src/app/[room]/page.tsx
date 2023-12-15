"use client";
import Player from "@/src/components/player";
import SearchPage from "../../components/search";
import socket from "@/src/api/socketApi";

export default function room({ params }: { params: { room: string } }) {
  let videoCode = "DLXwnPMbivE";
  socket.emit('joinRoom', params.room)
  return (
    <main>
      <SearchPage />
      <Player room={params.room} />
      <div id="player"></div>
    </main>
  );
}
