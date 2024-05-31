import React, { useState, useEffect } from 'react';
import { removeFromPlaylist, playVideoFromPlaylist } from '../api/socketApi';
import socket from '../api/socketApi';
import {searchResult} from '../interfaces/searchResult';
import { playerMessage } from '../interfaces/playerMessages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX  } from '@fortawesome/free-solid-svg-icons';


export default function Playlist() {
  const [playlist, setPlaylist] = useState<searchResult[]>([]);



  useEffect(() => {
    socket.on("playlist-update", (msg: playerMessage) => {
      console.log("message ", msg.playlist)
      setPlaylist(msg.playlist!);
      console.log(playlist)
    });
    return () => {
      socket.off("playlist-update");
    };
  }, []);


  const removeVideo = (index: number) => {
    removeFromPlaylist(index);
  };

  const playFromPlaylist = (searchResult: any) => {
    playVideoFromPlaylist(searchResult);
  };


  return (
    <div className="text-center p-4">
      <p className="mb-4 text-xl text-white">Playlist</p>
        <ul className="flex flex-wrap justify-start w-full">
          {playlist.map((video, index) => (
            <li key={index} className="w-1/3 px-2 box-border">
              <div className="relative cursor-pointer" onClick={() => { playFromPlaylist(index) }}>
                <img
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  className="w-full h-auto rounded-lg border border-red-400"
                />
                <FontAwesomeIcon icon={faX} className="absolute top-2 right-2 text-white text-lg" onClick={(e) => { e.stopPropagation(); removeVideo(index); }}/>
                <p className="mt-2 text-white text-center overflow-hidden text-ellipsis whitespace-nowrap">{video.snippet.title}</p>
              </div>
            </li>
          ))}
        </ul>
    </div>
  );
};

