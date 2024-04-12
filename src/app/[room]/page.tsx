"use client";

import SearchPage from "@/src/components/search";
import socket from "@/src/api/socketApi";
import Player from "@/src/components/player";
import Userlist from "@/src/components/userList";
import Playlist from "@/src/components/playlist";
import { playerMessage } from "@/src/interfaces/playerMessages";

export default function room({ params }: { params: { room: string } }) {
  let initroom: playerMessage = {
    roomId:params.room,
    currentTimePercentage: -1
  }
  socket.emit("joinRoom", initroom);
  return (
    <main className="flex flex-col justify-center">
      <SearchPage />
      <div className="flex flex-row">
        <Player room={params.room} className="" />
        <div className="flex flex-col">
          <Playlist/>
          <Userlist className="w-fit" />
        </div>
      
      </div>
      
    </main>
  );
}
