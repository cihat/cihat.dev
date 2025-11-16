"use client";

import { useState, useRef, useEffect } from "react";

type VideoSize = "small" | "medium" | "large";

interface VideoProps {
  src: string; // URL or path to video (e.g., "/videos/bouldering/boulder-level-1.mp4" or "https://example.com/video.mp4")
  poster?: string; // Optional poster image
  controls?: boolean; // Show video controls (default: true)
  autoplay?: boolean; // Autoplay video (default: false)
  loop?: boolean; // Loop video (default: false)
  muted?: boolean; // Muted video (default: false)
  size?: VideoSize; // Video size: small, medium, or large (default: "medium")
  width?: string | number; // Video width (overrides size if provided)
  className?: string; // Additional CSS classes
  title?: string; // Video title for accessibility
  alt?: string; // Alternative text for accessibility (used as aria-label)
}

const sizeConfig: Record<VideoSize, { width: string; maxWidth: string }> = {
  small: {
    width: "100%",
    maxWidth: "480px",
  },
  medium: {
    width: "100%",
    maxWidth: "768px",
  },
  large: {
    width: "100%",
    maxWidth: "100%",
  },
};

export function Video({
  src,
  poster,
  controls = true,
  autoplay = false,
  loop = false,
  muted = false,
  size = "medium",
  width,
  className = "",
  title,
  alt,
}: VideoProps) {
  // Use size config if width is not explicitly provided
  const sizeStyles = sizeConfig[size];
  const videoWidth = width || sizeStyles.width;
  const maxWidth = width ? undefined : sizeStyles.maxWidth;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine if src is a URL or a local path
  const isUrl = src.startsWith("http://") || src.startsWith("https://");
  const videoSrc = isUrl ? src : src.startsWith("/") ? src : `/${src}`;

  // Handle video loaded state
  const handleVideoReady = () => {
    setIsLoading(false);
    setHasError(false);
    setErrorMessage("");
  };

  const handleVideoError = () => {
    const video = videoRef.current;
    let errorMsg = "Failed to load video";
    
    if (video?.error) {
      switch (video.error.code) {
        case video.error.MEDIA_ERR_ABORTED:
          errorMsg = "Video loading was aborted";
          break;
        case video.error.MEDIA_ERR_NETWORK:
          errorMsg = "Network error while loading video";
          break;
        case video.error.MEDIA_ERR_DECODE:
          errorMsg = "Video decoding failed";
          break;
        case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMsg = "Video format not supported";
          break;
        default:
          errorMsg = "Unknown error occurred";
      }
    }
    
    setIsLoading(false);
    setHasError(true);
    setErrorMessage(errorMsg);
  };

  // Reset state when src changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");
  }, [videoSrc]);

  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      handleVideoReady();
    };

    const handleCanPlay = () => {
      handleVideoReady();
    };

    const handleError = () => {
      handleVideoError();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("canplaythrough", handleVideoReady);
    video.addEventListener("error", handleError);

    // Check if video is already loaded
    if (video.readyState >= 1) {
      handleVideoReady();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("canplaythrough", handleVideoReady);
      video.removeEventListener("error", handleError);
    };
  }, [videoSrc]);

  return (
    <div className={`my-5 mx-auto ${className}`} style={{ maxWidth }}>
      <div className="relative w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
            <div className="text-gray-500 dark:text-gray-400">
              <svg
                className="animate-spin h-8 w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 z-10">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="mb-2 font-semibold">{errorMessage || "Failed to load video"}</p>
              <p className="text-xs break-all opacity-75">{videoSrc}</p>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          controls={controls}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          width={videoWidth}
          className={`w-full h-auto ${isLoading || hasError ? "opacity-0" : "opacity-100"} transition-opacity`}
          title={title || alt}
          aria-label={alt || title || "Video player"}
          onLoadedMetadata={handleVideoReady}
          onCanPlay={handleVideoReady}
          onCanPlayThrough={handleVideoReady}
          onError={handleVideoError}
          playsInline
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      {alt && (
        <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400 italic">
          {alt}
        </p>
      )}
    </div>
  );
}

