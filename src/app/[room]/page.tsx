"use client";

import SearchPage from "@/src/components/search";
import socket from "@/src/api/socketApi";
import Player from "@/src/components/player";
import Userlist from "@/src/components/userList";
import Playlist from "@/src/components/playlist";
import { playerMessage } from "@/src/interfaces/playerMessages";

export default function room({ params }: { params: { room: string } }) {
  let initroom: playerMessage = {
    roomId: params.room,
    currentTimePercentage: -1,
  };
  socket.emit("joinRoom", initroom);
  return (
    <main className="flex flex-col items-center justify-center bg-black">
      <div className="h-80 mt-4">
        <SearchPage />
      </div>
      <div className="flex flex-row justify-center w-full h-full mb-16">
        <div className=" bg-customPinkOpacity03  rounded-s-md shadow-lg w-80 min-h-full max-h-full overflow-auto">
          <Userlist />
        </div>
        <Player room={params.room} className="mb-4 md:mb-0" />
        <div className=" bg-customPinkOpacity03 rounded-e-md shadow-lg w-80 min-h-full max-h-full overflow-auto">
          <Playlist />
        </div>
        {/* <div className="flex flex-row  ml-4 p-6  space-x-4"></div> */}
      </div>
    </main>
  );
}
