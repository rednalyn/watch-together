"use client";

import SearchPage from "@/src/components/search";
import socket from "@/src/api/socketApi";
import Player from "@/src/components/player";
import { playerMessage } from "@/src/interfaces/playerMessages";
import Playlist from "@/src/components/playlist";

export default function room({ params }: { params: { room: string } }) {
  let initroom: playerMessage = {
    roomId:params.room,
    currentTimePercentage: -1
  }
  socket.emit("joinRoom", initroom);
  return (
    <main>
      <SearchPage />
      <Playlist/>
      <Player room={params.room} />
      <div id="player"></div>
    </main>
  );
}
