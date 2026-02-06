'use client';
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface VideoSectionProps {
  canPlay: boolean;
  bgAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

export default function VideoSection({ canPlay, bgAudioRef }: VideoSectionProps) {
  const containerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Detect if this section is currently on screen
  const isInView = useInView(containerRef, { amount: 0.6 });

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView && canPlay) {
      // 1. Play Video
      videoRef.current.play().catch(e => console.log("Autoplay blocked", e));
      videoRef.current.muted = false; // Unmute if allowed
      
      // 2. Pause Background Loop if it was running
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
    } else {
      // 1. Pause Video to save resources
      videoRef.current.pause();
      
      // 2. If we scrolled PAST this section (to section 3), play BG music
      // Simple check: if we interacted but aren't viewing video, assume we are reading the letter
      if (canPlay && bgAudioRef.current && videoRef.current.currentTime > 0) {
        bgAudioRef.current.play().catch(e => console.log("BG Audio blocked", e));
      }
    }
  }, [isInView, canPlay, bgAudioRef]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black flex items-center justify-center">
      
      {/* The Header */}
      <h2 className="absolute top-20 z-20 text-4xl md:text-6xl font-script text-white tracking-widest drop-shadow-lg text-center w-full">
        my pretty girl
      </h2>

      {/* The Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover opacity-90"
        playsInline
        webkit-playsinline="true"
        loop // Loop the video visually
        preload="auto"
        poster="/video-poster.jpg" // Add a placeholder image in public folder
      >
        <source src="/your-video.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}