'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 1. BACKGROUND IMAGE (Pink Hearts) */}
      <div className="absolute inset-0 z-0">
      <Image 
        src="/hero-bg.png" 
        alt="Romantic Background" 
        fill // This makes it fill the container automatically
        priority // This tells Next.js to load this IMAGE FIRST
        className="object-cover opacity-90"/>
        {/* Optional: Very subtle white overlay to make sure Black text pops */}
        <div className="absolute inset-0 bg-white/20" /> 
      </div>

      {/* Main Text Group */}
      <div className="flex flex-col items-center justify-center z-10">
        <motion.span
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          // CHANGED: text-white -> text-black
          className="text-8xl font-script text-black mb-2 md:mb-4 drop-shadow-sm"
        >
          Hey
        </motion.span>
        
        <motion.span
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.75, delay: 0.5, ease: "easeOut" }}
          // CHANGED: text-white -> text-black
          className="text-8xl font-script text-black drop-shadow-sm"
        >
          Enny!
        </motion.span>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        // CHANGED: text-white/50 -> text-black/60 (Darker for visibility)
        className="absolute bottom-12 md:bottom-20 text-black/60 flex flex-col items-center gap-2 z-10"
        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <span className="text-xs md:text-sm font-light uppercase tracking-widest font-serif">Scroll for more</span>
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </div>
  );
}