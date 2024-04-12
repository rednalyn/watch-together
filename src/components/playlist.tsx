import React, { useState, useEffect } from 'react';
import { subscribeToPlaylistUpdates } from '../api/socketApi';
import socket from '../api/socketApi';
import searchResult from '../interfaces/searchResult';

const Playlist = () => {
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToPlaylistUpdates((updatedPlaylist: searchResult) => {
      console.log("Received playlist update:", updatedPlaylist);
      setPlaylist(updatedPlaylist);
    });
  
    return () => {
      console.log("Unsubscribing from playlist updates");
      unsubscribe();
    };
  }, []);

  // const removeFromPlaylist = (videoId) => {
  //   console.log("Removing video from playlist:", videoId);
  //   socket.emit('remove-from-playlist', videoId);
  // };

  return (
    <div>
      <h2>Playlist</h2>
      <ul>
        {playlist.map((video, index) => (
          <p key={index}>{video}</p>
))}
      </ul>
    </div>
  );
};

export default Playlist;
