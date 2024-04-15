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

  if (playlist.length === 0) {
    return null; // Or return a placeholder message, etc.
  }

  return (
    <div>
      <p className="text-center">Playlist</p>
      <ul>
        {playlist.map((video, index) => (
          <div key={index}  style={thirdDivStyle} onClick={() => { playFromPlaylist(index) }}>
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              style={imageStyle}
            />
            <FontAwesomeIcon icon={faX} style={iconStyle} onClick={() => { removeVideo(index) }}/>
            <p style={pStyle}>{video.snippet.title}</p>
          </div>
        ))}
      </ul>
    </div>
  );
};

const thirdDivStyle: React.CSSProperties = {
  width: '200px',
  marginRight: '10px',
  marginLeft: '10px',
  cursor: 'pointer',
  position: 'relative',
};

const imageStyle: React.CSSProperties = {
  width: '200px',
  height: '100px',
  borderRadius: '10px',
  border: '1px solid #c76c6c'
};

const pStyle: React.CSSProperties = {
  color: 'white',
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};
const iconStyle: React.CSSProperties = {
  color: 'white',
  fontSize: '15px',
  position: 'absolute', 
  top: '10px', 
  right: '10px', 
  zIndex: 1, 
};