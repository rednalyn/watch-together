"use client";
import Player from "@/src/components/player";
import SearchPage from '../../components/search'

export default function room({ params }: { params: { room: string } }) {
  let videoCode = "DLXwnPMbivE";
  return (
    <main>
      <h1>room: {params.room}</h1>
        <SearchPage />
      <button
        onClick={() => {
          videoCode = "EpxrDorr1i8";
        }}
      >
        annnanna videeeo
      </button>
      <Player videoCode={videoCode} />
      <div id="player"></div>
    </main>
  );
}
