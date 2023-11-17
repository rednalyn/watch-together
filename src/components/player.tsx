
"use client"
// ts
import React from 'react';
import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';
import { useEffect, useState } from 'react'
import io from 'socket.io-client'
let socket:any;

export default function Player(videoCode:any) {

    const [input, setInput] = useState('')

    useEffect(() => {socketInitializer()}, [])
  
    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io()
  
      socket.on('connect', () => {
        console.log('connected')
      })
  
    //   socket.on('update-input', msg => {
    //     setInput(msg)
    //   })
    // }
  
    // const onChangeHandler = (e:any) => {
    //   setInput(e.target.value)
    //   socket.emit('input-change', e.target.value)
    // }

    socket.on('play', (msg:any) => {
        console.log("msg")
        const element = document.getElementById('movie_player');
        element?.dispatchEvent(new KeyboardEvent('keydown', {'key': 'k'}));
      })

      socket.on('pause', (msg:any) => {
        console.log("msg")
        const element = document.getElementById('movie_player');
        element?.dispatchEvent(new KeyboardEvent('keydown', {'key': 'k'}));
      })

    }


  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  const onPlayerPause: YouTubeProps['onPause'] = (event) => {
    socket.emit('pause', "pause")
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
  const onPlayerPlay: YouTubeProps['onPlay'] = (event) => {
    console.log('onplay')
    socket.emit('play', "play")
    // access to player in all event handlers via event.target
    event.target.playVideo();
  }


  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return <YouTube videoId={videoCode.videoCode} opts={opts} onReady={onPlayerReady} onPlay={onPlayerPlay} onPause={onPlayerPause} />;
}
