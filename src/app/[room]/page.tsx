"use client";
import Player from "@/src/components/player";
import SearchPage from "../../components/search";
import socket from "@/src/api/socketApi";
import { nextVideo } from "@/src/api/socketApi";

export default function room({ params }: { params: { room: string } }) {
  socket.emit("joinRoom", params.room);
  const next = () => {
    nextVideo("uv_bTOEuMRg");
  };
  return (
    <main>
      <button onClick={next}>tesssting</button>
      <SearchPage />
      <Player room={params.room} />
      <div id="player"></div>
    </main>
  );
}
