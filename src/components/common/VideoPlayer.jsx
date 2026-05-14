// src/components/common/VideoPlayer.jsx
import { useRef, useEffect, useState } from "react";
import {
  FaPlay, FaPause, FaExpand, FaCompress,
  FaVolumeUp, FaVolumeMute,
} from "react-icons/fa";

const VideoPlayer = ({ src, onProgress, onComplete, lessonId }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const progressSentRef = useRef(false);

  // Reset on lesson change
  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setCompleted(false);
    progressSentRef.current = false;
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [lessonId, src]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = Math.floor(videoRef.current.currentTime);
    setCurrentTime(current);

    // Send progress every 30 seconds
    if (current > 0 && current % 30 === 0 && onProgress) {
      onProgress(current, false);
    }

    // Mark complete at 90%
    if (
      duration > 0 &&
      current / duration >= 0.9 &&
      !completed &&
      !progressSentRef.current
    ) {
      setCompleted(true);
      progressSentRef.current = true;
      if (onProgress) onProgress(current, true);
      if (onComplete) onComplete();
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) videoRef.current.volume = vol;
    setMuted(vol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!document.fullscreenElement) {
      container?.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  if (!src) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">No video available</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        className="w-full aspect-video"
        onLoadedMetadata={() => setDuration(Math.floor(videoRef.current.duration))}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          if (!completed && !progressSentRef.current) {
            setCompleted(true);
            progressSentRef.current = true;
            if (onProgress) onProgress(duration, true);
            if (onComplete) onComplete();
          }
        }}
        onClick={togglePlay}
      />

      {/* Completion badge */}
      {completed && (
        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
          ✓ Completed
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-3 relative"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="hover:text-primary-400 transition">
              {playing ? <FaPause size={16} /> : <FaPlay size={16} />}
            </button>

            {/* Volume */}
            <button onClick={toggleMute} className="hover:text-primary-400 transition">
              {muted || volume === 0 ? (
                <FaVolumeMute size={16} />
              ) : (
                <FaVolumeUp size={16} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 accent-primary-500"
            />

            {/* Time */}
            <span className="text-xs text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="hover:text-primary-400 transition">
            {fullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;