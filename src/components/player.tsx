"use client";
// ts
import React from "react";
import YouTube, {
  YouTubeEvent,
  YouTubePlayer,
  YouTubeProps,
} from "react-youtube";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { playerAction, playerMessages } from "../interfaces/playerMessages";

export default function Player(videoCode: any) {
  let socket: any;
  let playing: boolean = false;
  let playerEvent: YouTubeEvent<any>;
  let volume:number = 10
  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    socket = io();

    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("update-input", (msg: playerMessages) => {
      if (msg.action == playerAction.Pause) {
        playerEvent.target.pauseVideo();
        playerEvent.target.seekTo(msg.currentTime);
        playing = false;
      } else if (msg.action == playerAction.Play) {
        playerEvent.target.playVideo();
        playerEvent.target.seekTo(msg.currentTime);
        playing = true;
      }
    });
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerEvent = event;
    playerEvent.target.pauseVideo();
    playerEvent.target.setVolume(volume)
  };

  const playPause = () => {
    if (playing) {
      socket.emit("input-change", {
        action: playerAction.Pause,
        currentTime: playerEvent.target.getCurrentTime(),
      });
    } else if (!playing) {
      socket.emit("input-change", {
        action: playerAction.Play,
        currentTime: playerEvent.target.getCurrentTime(),
      });
    }
  };
  const onVolumeChange = (e:any) => {
    volume = e.target.value
    playerEvent.target.setVolume(volume);
  }
  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
    <div>
      <YouTube
        videoId={videoCode.videoCode}
        opts={opts}
        onReady={onPlayerReady}
      />
      <button className="" onClick={playPause}>
        play/pause
      </button>
      <label htmlFor="volume-slider">Volume</label>
      <input
        type="range"
        id="volume-slider"
        defaultValue={10}
        onChange={onVolumeChange}
      />
    </div>
  );
}
