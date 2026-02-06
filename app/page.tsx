'use client';

import { useState, useRef, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import VideoSection from '@/components/VideoSection';
import EnvelopeSection from '@/components/EnvelopeSection';

export default function Home() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      bgAudioRef.current = new Audio('/bg-music.mp3'); 
      bgAudioRef.current.loop = true;
      bgAudioRef.current.volume = 0.5;
    }
  }, []);

  const handleStartInteraction = () => {
    if (hasInteracted) return;
    setHasInteracted(true);

    // --- THE IOS "WARM UP" TRICK ---
    // Browsers require a direct interaction to allow audio.
    // We play silence for a split second here to "unlock" the Audio Context
    // so that later (in the VideoSection) we can play/unmute without errors.
    if (bgAudioRef.current) {
      bgAudioRef.current.play().then(() => {
        // Immediately pause so it doesn't actually play yet, 
        // we just wanted the permission.
        bgAudioRef.current?.pause();
      }).catch(e => console.log("Audio unlock failed", e));
    }
  };

  return (
    <main 
      className="fixed inset-0 w-full h-full overflow-y-scroll snap-y snap-mandatory bg-black text-white"
      // CHANGED: onClick -> onPointerDown
      // This catches the very first moment their finger hits the screen
      onPointerDown={handleStartInteraction}
    >
      {/* SECTION 1: HERO */}
      <section className="w-full h-full snap-start shrink-0 relative flex items-center justify-center">
        <HeroSection />
      </section>

      {/* SECTION 2: VIDEO */}
      <section className="w-full h-full snap-start shrink-0 relative overflow-hidden flex items-center justify-center bg-black">
        <VideoSection canPlay={hasInteracted} bgAudioRef={bgAudioRef} />
      </section>

      {/* SECTION 3: ENVELOPE */}
      <section className="w-full h-full snap-start shrink-0 relative bg-white text-black flex items-center justify-center">
        <EnvelopeSection />
      </section>
    </main>
  );
}