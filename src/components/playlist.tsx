import React, { useState, useEffect } from 'react';
import { removeFromPlaylist } from '../api/socketApi';
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

  return (
    <div>
      <h2>Playlist</h2>
      <ul>
        {playlist.map((video, index) => (
          <div key={index} onClick={() => { removeVideo(index) }} style={thirdDivStyle}>
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              style={imageStyle}
            />
            <FontAwesomeIcon icon={faX} style={iconStyle} />
            <p style={pStyle}>{video.snippet.title}</p>
          </div>
        ))}
      </ul>
    </div>
  );
};

const thirdDivStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '300px',
  marginRight: '10px',
  cursor: 'pointer',
  position: 'relative',
};

const imageStyle: React.CSSProperties = {
  width: '300px',
  height: '150px',
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
  fontSize: '28px',
  position: 'absolute', 
  top: '10px', 
  right: '10px', 
  zIndex: 1, 
};