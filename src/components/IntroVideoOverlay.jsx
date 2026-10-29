import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward } from 'lucide-react';

/**
 * IntroVideoOverlay
 * Plays a full-screen teaser video with AUDIO when user opens the website.
 * - Responsive 16:9 widescreen presentation: Uses object-contain so mobile screens
 *   never expand, crop, or zoom-in the video.
 * - Attempts to play with full audio immediately.
 * - If browser autoplay policy blocks unmuted audio, it starts video smoothly
 *   and provides a 1-tap screen unmute (clicking anywhere turns sound ON).
 * - FastStart streamable MP4 support with loading spinner while buffering.
 * - Mobile-friendly controls positioned within safe touch zones.
 * - Prominent Skip button available anytime.
 * - Automatically fades out to website when video ends.
 */
export default function IntroVideoOverlay({ 
  videoSrc = '/intro.mp4',
  onFinished
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false); // default attempt with sound
  const [showUnmuteHint, setShowUnmuteHint] = useState(false);
  const videoRef = useRef(null);

  // Support replaying intro on demand or from console
  useEffect(() => {
    window.replayIntroVideo = () => {
      sessionStorage.removeItem('vexoris_intro_seen');
      setIsFading(false);
      setIsVisible(true);
    };
  }, []);

  // Check if already viewed in this browser session
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('vexoris_intro_seen');
    if (hasSeen) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = (markSeen = true) => {
    if (isFading) return;
    setIsFading(true);
    if (markSeen) {
      sessionStorage.setItem('vexoris_intro_seen', 'true');
    }
    setTimeout(() => {
      setIsVisible(false);
      if (onFinished) onFinished();
    }, 700); // Matches CSS transition duration
  };

  const toggleSound = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted) setShowUnmuteHint(false);
  };

  // Unmute on any user interaction with the screen
  const handleScreenClick = (e) => {
    if (e.target.closest('button')) return; // let buttons handle their own clicks
    if (isMuted && videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setShowUnmuteHint(false);
    }
  };

  // Attempt to play with sound first, fallback to muted if browser blocks it
  useEffect(() => {
    if (!isVisible || !videoRef.current) return;

    const vid = videoRef.current;
    vid.volume = 1.0;
    vid.muted = false;

    vid.play()
      .then(() => {
        // Success! Browser allowed unmuted autoplay
        setIsMuted(false);
        setShowUnmuteHint(false);
      })
      .catch((err) => {
        // Browser blocked unmuted autoplay (standard browser security restriction)
        // Fallback to muted playback and prompt user to tap anywhere for sound
        console.warn('Browser requires user interaction for audio. Starting muted:', err);
        vid.muted = true;
        setIsMuted(true);
        setShowUnmuteHint(true);
        vid.play().catch(() => {});
      });
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      onClick={handleScreenClick}
      className={`fixed inset-0 z-[9999] bg-[#07090D] flex items-center justify-center transition-opacity duration-700 select-none cursor-pointer overflow-hidden ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Video Stream: object-contain preserves natural 16:9 widescreen ratio without cropping/expansion on mobile */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        playsInline
        preload="auto"
        muted={isMuted}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onEnded={() => handleDismiss(true)}
        onError={(e) => {
          console.warn('Video stream error, revealing website:', e);
          handleDismiss(false);
        }}
        className="w-full h-full max-h-[100dvh] object-contain select-none"
      />

      {/* Atmospheric Cinematic Gradients */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07090D] via-transparent to-black/75" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.85)]" />

      {/* Loading Spinner while buffering */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cyan border-t-transparent animate-spin mb-3 shadow-[0_0_25px_rgba(70,199,222,0.6)]" />
          <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.25em] text-cyan font-bold drop-shadow">
            LOADING TEASER...
          </span>
        </div>
      )}

      {/* Floating Control Buttons: Positioned safely for mobile screens */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 flex items-center gap-2 sm:gap-3 pointer-events-auto">
        {/* Sound Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border text-[11px] sm:text-xs font-mono font-bold flex items-center gap-1.5 sm:gap-2 backdrop-blur-md transition-all shadow-lg cursor-pointer ${
            isMuted 
              ? 'bg-[#E5385D]/25 border-[#E5385D]/70 text-white animate-pulse' 
              : 'bg-black/70 hover:bg-black/90 border-white/20 text-cyan'
          }`}
          title={isMuted ? "Click to unmute sound" : "Click to mute"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5385D]" />
              <span>UNMUTE</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan" />
              <span>AUDIO ON</span>
            </>
          )}
        </button>

        {/* Skip Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss(true);
          }}
          className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#E5385D] hover:bg-[#F43F68] text-white text-[11px] sm:text-xs font-heading font-black tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 backdrop-blur-md transition-all shadow-[0_0_25px_rgba(229,56,93,0.45)] cursor-pointer"
        >
          <span>SKIP INTRO</span>
          <SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Center Unmute Callout (Shows if browser initially muted the video) */}
      {showUnmuteHint && isMuted && !isLoading && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            toggleSound();
          }}
          className="absolute inset-x-0 bottom-16 sm:bottom-24 z-30 flex justify-center px-4 pointer-events-auto"
        >
          <div className="px-5 sm:px-6 py-2.5 sm:py-3.5 rounded-2xl bg-[#121622]/95 hover:bg-[#1A2232] border border-cyan/50 hover:border-cyan text-white shadow-[0_0_30px_rgba(70,199,222,0.35)] backdrop-blur-xl flex items-center gap-3 transition-all cursor-pointer animate-bounce">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan/20 border border-cyan flex items-center justify-center text-cyan shrink-0">
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] sm:text-xs font-heading font-black uppercase text-cyan tracking-wider">
                SOUND OFF (BROWSER DEFAULT)
              </span>
              <span className="block text-[10px] sm:text-[11px] font-sans text-slate-300">
                Tap anywhere on screen to enable audio 🔊
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Bottom Watermark */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 hidden xs:flex items-center gap-3 pointer-events-none">
        <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.22em] text-cyan font-bold bg-[#121622]/80 px-3 py-1 rounded-lg border border-cyan/30 backdrop-blur-md">
          VEXORIS '26 · OFFICIAL TEASER
        </span>
      </div>
    </div>
  );
}
