import React, { useMemo } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { useState, useEffect } from "react";
import socket from "../api/socketApi";
import { playVideoFromPlaylist } from "../api/socketApi";
import { playerAction, playerMessage } from "../interfaces/playerMessages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faL,
  faMinimize,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";

let playerEvent: YouTubeEvent<any>;
export default function Player(room: any) {
  const height = screen.height * 0.6;
  const width = screen.width * 0.6;

  const [progressTime, setProgressTime] = useState(Number);
  const [playing, setPlaying] = useState(Boolean);
  const [volume, setVolume] = useState(10);
  const [playerHeight, setPlayerHeight] = useState(height);
  const [playerWidth, setPlayerWidth] = useState(width);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  // const [playerWithControls, setPlayerWithControls] = useState()

  let playerWithControls: any;

  useEffect(() => {
    if (document) {
      playerWithControls = document.getElementById("player-with-controls");
      playerWithControls?.addEventListener(
        "fullscreenchange",
        fullscreenchanged
      );
      playerWithControls?.addEventListener(
        "mozfullscreenchange",
        fullscreenchanged
      );
      playerWithControls?.addEventListener(
        "MSFullscreenChange",
        fullscreenchanged
      );
      playerWithControls?.addEventListener(
        "webkitfullscreenchange",
        fullscreenchanged
      );
    }
  });
  useEffect(() => {
    socket.on("joined-room", async (msg: playerMessage) => {
      let waiting = true;
      while (waiting) {
        if (playerEvent) {
          playerEvent.target.loadVideoById(msg.currentVideo);
          playerEvent.target.seekTo(
            getCurrentTime(
              playerEvent.target.getDuration(),
              msg.currentTimePercentage
            )
          );
          playerEvent.target.playVideo();
          setPlaying(true);
          setProgressTime(msg.currentTimePercentage);
          progressTimer();
          waiting = false;
        } else {
          await new Promise((resolve: any) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });
        }
      }
    });
    return () => {
      socket.off("joined-room");
    };
  }, []);

  useEffect(() => {
    socket.on("update-playerState", (msg: playerMessage) => {
      if (playerEvent.target.getVideoData().title != "") {
        if (msg.action == playerAction.Pause) {
          playerEvent.target.pauseVideo();
          playerEvent.target.seekTo(
            getCurrentTime(
              playerEvent.target.getDuration(),
              msg.currentTimePercentage
            )
          );
          setPlaying(false);
          setProgressTime(msg.currentTimePercentage);
        } else if (msg.action == playerAction.Play) {
          playerEvent.target.playVideo();
          playerEvent.target.seekTo(
            getCurrentTime(
              playerEvent.target.getDuration(),
              msg.currentTimePercentage
            )
          );
          setPlaying(true);
          setProgressTime(msg.currentTimePercentage);
          progressTimer();
        }
      }
      playerEvent.target.setVolume(volume);
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
      setPlaying(true);
      setProgressTime(msg.currentTimePercentage);
      progressTimer();
    });
    return () => {
      socket.off("update-video");
    };
  }, []);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerEvent = event;
    playerEvent.target.setVolume(volume);
    document.getElementById("playbutton")?.click();
    setTimeout(() => {
      document.getElementById("playbutton")?.click();
    }, 1);
  };

  const fullscreenchanged = (e: any) => {
    if (fullscreen) {
      setPlayerHeight(height);
      setPlayerWidth(width);
      setFullscreen(false);
    } else {
      setPlayerHeight(screen.height);
      setPlayerWidth(screen.width);
      setFullscreen(true);
    }
  };
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }
  };

  const requestFullScreen = () => {
    if (playerWithControls?.requestFullscreen) {
      playerWithControls.requestFullscreen();
    } else if (playerWithControls?.webkitRequestFullscreen) {
      /* Safari */
      playerWithControls.webkitRequestFullscreen();
    } else if (playerWithControls?.msRequestFullscreen) {
      /* IE11 */
      playerWithControls.msRequestFullscreen();
    }
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
    setVolume(e.target.value);
    if (e.target.value < 2) {
      setVolume(0);
    }
    playerEvent.target.setVolume(volume);
  };
  const onProgressChange = (e: any) => {
    setPlaying(false);
    playerEvent.target.pauseVideo();
    setProgressTime(e.target.value);
  };
  const progressTimer = () => {
    let interval = setInterval(() => {
      // console.log("timer")
      setProgressTime(
        (playerEvent.target.getCurrentTime() /
          playerEvent.target.getDuration()) *
          100
      );

      // if (!playing) {
      //   console.log("!playing")
      //   clearInterval(interval);
      // }
    }, 500);
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
    setPlaying(false);
    playVideoFromPlaylist(0);
  };
  const opts: YouTubeProps["opts"] = {
    height: playerHeight,
    width: playerWidth,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      controls: 0,
      disablekb: 1,
    },
  };

  return (
    <div className="" id="player-with-controls">
      <YouTube
        opts={opts}
        onReady={onPlayerReady}
        onEnd={onVideoEnd}
        className="pointer-events-none"
      />

      <div
        className={`h-14 relative ${fullscreen ? " -mt-14 " : ""}`}
        onMouseEnter={() => {
          if (fullscreen) setShowControls(true);
        }}
        onMouseLeave={() => {
          if (fullscreen) setShowControls(false);
        }}
      >
        {showControls || !fullscreen ? (
          <div className="flex flex-row px-4 justify-between gap-4 bg-customPinkOpacity03  border-x border-black">
            {playing ? (
              <button className="p-4" id="playbutton" onClick={playPause}>
                <FontAwesomeIcon icon={faPause} />
              </button>
            ) : (
              <button className="p-4" id="playbutton" onClick={playPause}>
                {" "}
                <FontAwesomeIcon icon={faPlay} />
              </button>
            )}
            <input
              className="w-full"
              type="range"
              id="progress-slider"
              value={progressTime}
              onChange={onProgressChange}
              onMouseUp={onProgressMouseUp}
            />
            <div className="flex flex-row gap-4 self-center">
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
                className=" w-full"
                id="volume-slider"
                defaultValue={10}
                onChange={onVolumeChange}
                onMouseUp={onVolumeChange}
              />
            </div>
            {fullscreen ? (
              <button onClick={exitFullscreen}>
                <FontAwesomeIcon icon={faMinimize} className="align-middle" />
              </button>
            ) : (
              <button onClick={requestFullScreen}>
                <FontAwesomeIcon icon={faExpand} className="align-middle" />
              </button>
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
