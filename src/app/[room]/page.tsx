"use client"
import Player from "@/src/components/player";
export default function room({ params }: { params: { room: string } }) {
  const videoCode = "DLXwnPMbivE"
 
  return (
    <main>
      <h1>room: {params.room}</h1>
      <Player videoCode={videoCode} />
      <div id="player"></div>
    </main>
  );
}
