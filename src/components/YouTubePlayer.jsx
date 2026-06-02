// src/components/common/VideoPlayer.jsx
import { useEffect, useRef, useState, useCallback } from "react";

// ============================================================
// ✅ Helper Functions
// ============================================================

// Extract YouTube video ID from any URL format
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
};

// Extract Vimeo video ID
const getVimeoVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
};

// Auto-detect video type from URL
const detectVideoType = (url) => {
  if (!url) return "";
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("vimeo.com")) return "vimeo";
  if (u.includes("cloudinary.com")) return "cloudinary";
  return "html5";
};

// ============================================================
// ✅ MAIN VIDEO PLAYER COMPONENT
// ============================================================
const VideoPlayer = ({
  src,
  videoType,
  videoUrl,
  poster,
  thumbnailUrl,
  lessonId,
  onProgress,
  onComplete,
  autoPlay = false,
}) => {
  // ✅ Support both prop names: src OR videoUrl
  const url = src || videoUrl;
  const thumb = poster || thumbnailUrl;

  // ✅ Auto-detect type if not provided
  const type = videoType || detectVideoType(url);

  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const lastProgressUpdateRef = useRef(0);
  const completedRef = useRef(false);

  const [isYouTubeReady, setIsYouTubeReady] = useState(false);

  // ============================================================
  // ✅ Reset completion flag when lesson changes
  // ============================================================
  useEffect(() => {
    completedRef.current = false;
    lastProgressUpdateRef.current = 0;
  }, [lessonId]);

  // ============================================================
  // ✅ HTML5/Cloudinary Progress Tracking
  // ============================================================
  useEffect(() => {
    if (type === "youtube" || type === "vimeo") return;
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (!video.duration) return;

      const watchedDuration = Math.floor(video.currentTime);
      const percent = (video.currentTime / video.duration) * 100;

      // Throttle: only send progress every 10 seconds
      if (watchedDuration - lastProgressUpdateRef.current >= 10) {
        lastProgressUpdateRef.current = watchedDuration;
        if (onProgress) {
          onProgress(watchedDuration, percent >= 90);
        }
      }

      // Mark as complete at 90%
      if (percent >= 90 && !completedRef.current) {
        completedRef.current = true;
        if (onProgress) {
          onProgress(watchedDuration, true);
        }
      }
    };

    const handleEnded = () => {
      if (!completedRef.current && onProgress) {
        completedRef.current = true;
        onProgress(Math.floor(video.duration), true);
      }
      if (onComplete) {
        setTimeout(() => onComplete(), 1000);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [type, url, onProgress, onComplete, lessonId]);

  // ============================================================
  // ✅ YouTube IFrame API Setup
  // ============================================================
  useEffect(() => {
    if (type !== "youtube") return;

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsYouTubeReady(true);
      };
    } else if (window.YT && window.YT.Player) {
      setIsYouTubeReady(true);
    }
  }, [type]);

  // ============================================================
  // ✅ YouTube Player Initialization & Progress Tracking
  // ============================================================
  useEffect(() => {
    if (type !== "youtube") return;
    if (!isYouTubeReady) return;
    if (!iframeRef.current) return;

    const videoId = getYouTubeVideoId(url);
    if (!videoId) return;

    // Destroy previous player
    if (youtubePlayerRef.current?.destroy) {
      try {
        youtubePlayerRef.current.destroy();
      } catch (e) {
        console.warn("Failed to destroy previous YT player:", e);
      }
    }

    // Clear interval if exists
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Create new YouTube player
    youtubePlayerRef.current = new window.YT.Player(iframeRef.current, {
      videoId: videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        showinfo: 0,
        controls: 1,
        fs: 1,
        cc_load_policy: 0,
        iv_load_policy: 3,
        autohide: 0,
        playsinline: 1,
        autoplay: autoPlay ? 1 : 0,
      },
      events: {
        onReady: (event) => {
          console.log("YouTube player ready");
        },
        onStateChange: (event) => {
          // PLAYING = 1
          if (event.data === window.YT.PlayerState.PLAYING) {
            // Start tracking progress
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }

            progressIntervalRef.current = setInterval(() => {
              if (!youtubePlayerRef.current?.getCurrentTime) return;

              try {
                const currentTime = youtubePlayerRef.current.getCurrentTime();
                const duration = youtubePlayerRef.current.getDuration();

                if (!duration) return;

                const watchedDuration = Math.floor(currentTime);
                const percent = (currentTime / duration) * 100;

                // Throttle: only send every 10 seconds
                if (watchedDuration - lastProgressUpdateRef.current >= 10) {
                  lastProgressUpdateRef.current = watchedDuration;
                  if (onProgress) {
                    onProgress(watchedDuration, percent >= 90);
                  }
                }

                // Mark as complete at 90%
                if (percent >= 90 && !completedRef.current) {
                  completedRef.current = true;
                  if (onProgress) {
                    onProgress(watchedDuration, true);
                  }
                }
              } catch (err) {
                console.warn("YT progress error:", err);
              }
            }, 1000);
          }

          // ENDED = 0
          if (event.data === window.YT.PlayerState.ENDED) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }

            if (!completedRef.current && onProgress) {
              try {
                const duration = youtubePlayerRef.current.getDuration();
                completedRef.current = true;
                onProgress(Math.floor(duration), true);
              } catch (err) {
                console.warn("YT end error:", err);
              }
            }

            if (onComplete) {
              setTimeout(() => onComplete(), 1000);
            }
          }

          // PAUSED = 2
          if (event.data === window.YT.PlayerState.PAUSED) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
            }
          }
        },
      },
    });

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (youtubePlayerRef.current?.destroy) {
        try {
          youtubePlayerRef.current.destroy();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isYouTubeReady, url, type, lessonId, onProgress, onComplete, autoPlay]);

  // ============================================================
  // ✅ NO VIDEO URL
  // ============================================================
  if (!url) {
    return (
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p className="text-4xl mb-2">🎬</p>
          <p>No video available</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ✅ YOUTUBE PLAYER
  // ============================================================
  if (type === "youtube") {
    const videoId = getYouTubeVideoId(url);

    if (!videoId) {
      return (
        <div className="aspect-video bg-red-900 rounded-lg flex items-center justify-center">
          <p className="text-white">Invalid YouTube URL</p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <div ref={iframeRef} className="w-full h-full" />
      </div>
    );
  }

  // ============================================================
  // ✅ VIMEO PLAYER
  // ============================================================
  if (type === "vimeo") {
    const videoId = getVimeoVideoId(url);

    if (!videoId) {
      return (
        <div className="aspect-video bg-red-900 rounded-lg flex items-center justify-center">
          <p className="text-white">Invalid Vimeo URL</p>
        </div>
      );
    }

    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title="Course video"
          className="w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // ============================================================
  // ✅ HTML5 / CLOUDINARY VIDEO
  // ============================================================
  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        src={url}
        poster={thumb}
        controls
        autoPlay={autoPlay}
        className="w-full h-full"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
};

export default VideoPlayer;