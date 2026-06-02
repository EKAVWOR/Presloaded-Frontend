// src/components/SmartVideoPlayer.jsx
import { useEffect, useRef } from "react";

// ✅ Extract YouTube video ID from any URL format
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/
  );
  return match ? match[1] : null;
};

// ✅ Extract Vimeo video ID
const getVimeoVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
};

// ✅ Detect video type from URL
const detectVideoType = (url) => {
  if (!url) return "";
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("vimeo.com")) return "vimeo";
  if (u.includes("cloudinary.com")) return "cloudinary";
  return "html5"; // fallback for direct video URLs
};

const SmartVideoPlayer = ({
  videoUrl,
  videoType,
  thumbnailUrl,
  onProgress,
  onComplete,
  className = "",
}) => {
  const videoRef = useRef(null);

  // ✅ Auto-detect type if not provided
  const type = videoType || detectVideoType(videoUrl);

  // ✅ Track progress for HTML5 videos
  useEffect(() => {
    if (type !== "html5" && type !== "cloudinary") return;
    if (!videoRef.current) return;

    const video = videoRef.current;
    const interval = setInterval(() => {
      if (video.currentTime && video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        if (onProgress) onProgress(percent);

        if (percent >= 95 && onComplete) {
          onComplete();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [type, videoUrl, onProgress, onComplete]);

  // ✅ No video URL
  if (!videoUrl) {
    return (
      <div className={`aspect-video bg-gray-900 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <p className="text-4xl mb-2">🎬</p>
          <p>No video available</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // ✅ YOUTUBE PLAYER (iframe)
  // ============================================================
  if (type === "youtube") {
    const videoId = getYouTubeVideoId(videoUrl);

    if (!videoId) {
      return (
        <div className={`aspect-video bg-red-900 rounded-lg flex items-center justify-center ${className}`}>
          <p className="text-white">Invalid YouTube URL</p>
        </div>
      );
    }

    return (
      <div className={`aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
          title="Course video"
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // ============================================================
  // ✅ VIMEO PLAYER (iframe)
  // ============================================================
  if (type === "vimeo") {
    const videoId = getVimeoVideoId(videoUrl);

    if (!videoId) {
      return (
        <div className={`aspect-video bg-red-900 rounded-lg flex items-center justify-center ${className}`}>
          <p className="text-white">Invalid Vimeo URL</p>
        </div>
      );
    }

    return (
      <div className={`aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
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
  // ✅ HTML5 VIDEO (Cloudinary, direct URLs)
  // ============================================================
  return (
    <div className={`aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        controls
        className="w-full h-full"
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
};

export default SmartVideoPlayer;