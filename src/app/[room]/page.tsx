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
<main className="flex flex-col items-center justify-center bg-black overflow-x-hidden">
  <SearchPage />
  <div className="flex flex-col md:flex-row w-full p-4"> 
    <Player room={params.room} className="mb-4 md:mb-0 md:mr-4"/>
    <div className="flex flex-row  ml-4 p-6  space-x-4">
      <div className="flex-1 bg-customPinkOpacity05 rounded-xl shadow-lg">
        <Playlist />
      </div>
      <div className="flex-1 bg-customPinkOpacity05 rounded-md shadow-lg">
        <Userlist />
      </div>
    </div>
  </div>
</main>

  );
}
