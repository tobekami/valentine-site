'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react'; 

interface VideoSectionProps {
  canPlay: boolean;
  bgAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

export default function VideoSection({ canPlay, bgAudioRef }: VideoSectionProps) {
  const containerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true); // START MUTED to satisfy Chrome
  
  // Keep threshold low (0.3) for easier loading
  const isInView = useInView(containerRef, { amount: 0.3 });

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (isInView && canPlay) {
      // 1. Pause BG music
      if (bgAudioRef.current) bgAudioRef.current.pause();

      // 2. Play the video MUTED first (Guaranteed to work on Chrome/iOS)
      // We rely on the 'muted' prop in the JSX below
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // 3. Once playing, try to UNMUTE
            video.muted = false; 
            setIsMuted(false);
          })
          .catch((error) => {
            // 4. If Unmute fails (Chrome blocks it), keep it Muted but keep playing
            console.log("Unmute blocked by browser. Playing muted.");
            video.muted = true;
            setIsMuted(true);
            video.play(); // Ensure it keeps moving
          });
      }
    } else {
      video.pause();
      if (canPlay && bgAudioRef.current && video.currentTime > 0 && !isInView) {
         bgAudioRef.current.play().catch(e => console.log("BG resume blocked", e));
      }
    }
  }, [isInView, canPlay, bgAudioRef]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black flex items-center justify-center">
      
      <h2 className="absolute top-[15%] z-20 text-5xl md:text-7xl font-script text-white/90 drop-shadow-lg text-center w-full px-4 mix-blend-overlay">
        My Pretty Girl
      </h2>

      <video
        ref={videoRef}
        className="w-full h-full object-cover opacity-80"
        playsInline 
        webkit-playsinline="true"
        loop 
        muted={true} // <--- THE KEY: Default to Muted so it actually starts
        preload="auto"
        poster="/video-poster.jpg"
      >
        <source src="/your-video.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

      {/* Button only shows if we are forced to be muted */}
      {isMuted && (
        <button 
          onClick={toggleMute}
          className="absolute bottom-20 right-8 z-30 p-3 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30 animate-pulse"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      )}
    </div>
  );
}