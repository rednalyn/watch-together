"use client";
// ts
import React from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { useState, useEffect } from "react";
import socket from "../api/socketApi";
import { playerAction, playerMessage } from "../interfaces/playerMessages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";
let playing: boolean = false;
let volume: number = 10;
let playerEvent: YouTubeEvent<any>;
export default function Player(room: any) {
  const [progressTime, setProgressTime] = useState(Number);
  useEffect(() => {
    socket.on("update-playerState", (msg: playerMessage) => {
      console.log("update-playerState")
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
    return () => {
      socket.off("update-playerState");
    };
  }, []);
  useEffect(() => {
    socket.on("update-playerProgress", (msg: playerMessage) => {
      playerEvent.target.seekTo(
        getCurrentTime(
          playerEvent.target.getDuration(),
          msg.currentTimePercentage
        )
      );
      setProgressTime(msg.currentTimePercentage);
    });
    return () => {
      socket.off("update-playerProgress");
    };
  }, []);

  useEffect(() => {
    socket.on("update-video", (msg: playerMessage) => {
      playerEvent.target.loadVideoById(msg.currentVideo);
      playerEvent.target.seekTo(
        getCurrentTime(
          playerEvent.target.getDuration(),
          msg.currentTimePercentage
        )
      );
      playerEvent.target.playVideo();
      playing = true;
      setProgressTime(msg.currentTimePercentage);
      progressTimer();
    });
    return () => {
      socket.off("update-video");
    };
  }, []);

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
    playing = false;
    playerEvent.target.pauseVideo();
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
      action: playerAction.Play,
    };
    socket.emit("playerState-change", message);
    socket.emit("playerProgress-change", message);
  };
  const onVideoEnd = () => {
    playing = false;
  };
  const opts: YouTubeProps["opts"] = {
    height: "548",
    width: "900",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      controls: 0,
      disablekb: 1,
    },
  };

  return (
    <div className="w-900 h-548">
      <YouTube
        videoId="DLXwnPMbivE"
        opts={opts}
        onReady={onPlayerReady}
        onEnd={onVideoEnd}
      />
      <div className="flex flex-row p-4 justify-between gap-4">
        <button className="" id="playbutton" onClick={playPause}>
          {playing && <FontAwesomeIcon icon={faPause} />}
          {!playing && <FontAwesomeIcon icon={faPlay} />}
        </button>
        <input
          className="w-640"
          type="range"
          id="progress-slider"
          value={progressTime}
          onChange={onProgressChange}
          onMouseUp={onProgressMouseUp}
        />
        <div className="flex flex-row gap-2">
          {volume == 0 && (
            <FontAwesomeIcon icon={faVolumeOff} className="align-middle" />
          )}
          {volume > 0 && volume < 50 && (
            <FontAwesomeIcon icon={faVolumeLow} className="align-middle" />
          )}
          {volume > 50 && (
            <FontAwesomeIcon icon={faVolumeHigh} className="align-middle" />
          )}
          <input
            type="range"
            id="volume-slider"
            defaultValue={10}
            onChange={onVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}
