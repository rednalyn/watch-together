"use client";
// ts
import React from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { playerAction, playerMessage } from "../interfaces/playerMessages";
import { useSearchParams } from "next/navigation";
import socket from "@/src/api/socketApi";
// let socket: any;
let playing: boolean = false;
let volume: number = 10;
let playerEvent: YouTubeEvent<any>;
export default function Player(room: any) {
  const [progressTime, setProgressTime] = useState(Number);
  socket.on("update-playerState", (msg: playerMessage) => {
    if (msg.action == playerAction.Pause) {
      playerEvent.target.pauseVideo();
      playerEvent.target.seekTo(
        getCurrentTime(
          playerEvent.target.getDuration(),
          msg.currentTimePercentage
        )
      );
      playing = false;
      setProgressTime(msg.currentTimePercentage);
    } else if (msg.action == playerAction.Play) {
      playerEvent.target.playVideo();
      playerEvent.target.seekTo(
        getCurrentTime(
          playerEvent.target.getDuration(),
          msg.currentTimePercentage
        )
      );
      playing = true;
      setProgressTime(msg.currentTimePercentage);
      progressTimer();
    }
  });
  socket.on("update-playerProgress", (msg: playerMessage) => {
    playerEvent.target.seekTo(
      getCurrentTime(
        playerEvent.target.getDuration(),
        msg.currentTimePercentage
      )
    );
    setProgressTime(msg.currentTimePercentage);
  });

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerEvent = event;
    playerEvent.target.pauseVideo();
    playerEvent.target.setVolume(volume);
    document.getElementById("playbutton")?.click();
    setTimeout(() => {
      document.getElementById("playbutton")?.click();
    }, 1);
  };

  const playPause = () => {
    let message: playerMessage = {
      roomId: room.room,
      currentTimePercentage: progressTime,
    };
    if (playing) {
      message.action = playerAction.Pause;
      socket.emit("playerState-change", message);
    } else if (!playing) {
      message.action = playerAction.Play;
      socket.emit("playerState-change", message);
    }
  };
  const getCurrentTime = (duration: number, progressPercentage: number) => {
    return duration * (progressPercentage / 100);
  };
  const onVolumeChange = (e: any) => {
    volume = e.target.value;
    playerEvent.target.setVolume(volume);
  };
  const onProgressChange = (e: any) => {
    setProgressTime(e.target.value);
  };
  const progressTimer = () => {
    let interval = setInterval(() => {
      setProgressTime(
        (playerEvent.target.getCurrentTime() /
          playerEvent.target.getDuration()) *
          100
      );
      if (!playing) {
        clearInterval(interval);
      }
    }, 250);
  };
  const onProgressMouseUp = () => {
    let message: playerMessage = {
      roomId: room.room,
      currentTimePercentage: progressTime,
    };
    socket.emit("playerProgress-change", message);
  };
  const onVideoEnd = () => {
    playing = false;
  };
  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      controls: 0,
      disablekb: 1,
    },
  };

  return (
    <div>
      <YouTube
        videoId="DLXwnPMbivE"
        opts={opts}
        onReady={onPlayerReady}
        onEnd={onVideoEnd}
      />
      <button className="" id="playbutton" onClick={playPause}>
        play/pause
      </button>
      <input
        type="range"
        id="progress-slider"
        value={progressTime}
        onChange={onProgressChange}
        onMouseUp={onProgressMouseUp}
      />
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
