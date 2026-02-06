'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';


export default function EnvelopeSection() {
  const [step, setStep] = useState<'idle' | 'animating-open' | 'extracting' | 'reading'>('idle');
  const [openFrame, setOpenFrame] = useState(0); // 0=Closed, 1=Partial, 2=More, 3=Full
  const [rejectionCount, setRejectionCount] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'wrong' | 'correct'>('none');
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // PRELOAD IMAGES
  useEffect(() => {
    const images = [
      '/envelope-0.png', 
      '/envelope-1.png', 
      '/envelope-2.png', 
      '/envelope-3.png',
      '/letter-texture.jpg'
    ];
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleOpen = () => {
    if (step !== 'idle') return;
    setStep('animating-open');

    // 1. FRAME ANIMATION (0 -> 3)
    setTimeout(() => setOpenFrame(1), 300);
    setTimeout(() => setOpenFrame(2), 400);
    setTimeout(() => {
        setOpenFrame(3); // Fully Open
        // 2. TRIGGER THE SWAP (Envelope Down, Paper Up)
        setTimeout(() => setStep('extracting'), 500);
    }, 500);

    // 3. FINAL STATE (Envelope to Side)
    setTimeout(() => {
      setStep('reading');
    }, 1100);
  };

  useEffect(() => {
    const checkScreen = () => {
      // 1024px is a standard "Laptop/Desktop" breakpoint. 
      // If > 1024, we consider it a Large PC Screen.
      setIsLargeScreen(window.innerWidth > 1024);
    };

    // Check on mount
    checkScreen();
    
    // Add listener for resize
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const handleNo = () => {
    setFeedback('wrong');
    setRejectionCount(prev => prev + 1);
    
    const duration = 2000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 5, angle: 270, spread: 40, origin: { x: Math.random(), y: -0.1 },
        colors: ['#ef4444'], shapes: ['square'], ticks: 200
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
    setTimeout(() => setFeedback('none'), 2000);
  };

  const handleYes = () => {
    setFeedback('correct');
    const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 5, angle: 60, spread: 55, origin: { x: 0 },
        colors: ['#ec4899', '#f472b6'], shapes: ['circle'] 
      });
      confetti({
        particleCount: 5, angle: 120, spread: 55, origin: { x: 1 },
        colors: ['#ec4899', '#f472b6'], shapes: ['circle']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const noTexts = ["Naaaa!!", "Fackaff!!!", "Wrong button!", "Don't do it!", "This isn't the real you", "Just click yes already!"];
  const currentNo = noTexts[Math.min(rejectionCount, noTexts.length - 1)];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-curtain">
      
      {/* BACKGROUND TYPOGRAPHY */}
      <div className="inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
         <h2 className="font-script text-white/80 text-4xl md:text-6xl -rotate-6 translate-y-8 z-10 drop-shadow-lg">
            will you be my
         </h2>
         <h1 className="font-serif text-[3.15rem] md:text-[10rem] leading-none text-metallic tracking-tighter z-0">
            VALENTINE?
         </h1>
      </div>

      {/* FEEDBACK OVERLAYS */}
      <AnimatePresence>
        {feedback === 'wrong' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <h1 className="text-8xl font-black text-red-600 border-8 border-red-600 p-8 rounded-xl -rotate-12 bg-white font-serif">
              WRONG! ❌
            </h1>
          </motion.div>
        )}
        {feedback === 'correct' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-pink-600"
          >
            <h1 className="text-8xl font-script text-white drop-shadow-2xl">She said YES! 💖</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- THE STAGE --- */}
      <div className="relative z-20 mt-10 w-full flex justify-center items-center h-[600px] perspective-[1000px]">
        
        {/* 1. THE ENVELOPE */}
        <motion.div 
            className="absolute z-30"
            initial={{ y: 0, opacity: 1 }}
            animate={
                step === 'idle' || step === 'animating-open' ? { x: 0, y: 0, opacity: 1, rotate: 0 } :
                step === 'extracting' ? { y: 400, opacity: 0 } : 
                step === 'reading' ? { x: isLargeScreen ? 300 : 120, y: 0, opacity: 1, rotate: 90 } : {}
            }
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
             <img 
                src={`/envelope-${step === 'reading' ? '0' : openFrame}.png`}
                alt="Envelope"
                className="w-[250px] md:w-[500px] h-auto object-contain drop-shadow-2xl cursor-pointer"
                onClick={handleOpen}
             />
        </motion.div>

        {/* 2. THE PAPER */}
        <motion.div
            className="absolute w-[200px] md:w-[450px] md:min-h-[500px] min-h-[250px]  shadow-2xl flex flex-col items-center md:p-8 p-4 origin-center"
            style={{ 
                backgroundImage: 'url(/letter-texture.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            initial={{ y: 200, scale: 0.8, opacity: 0 }}
            animate={
                step === 'idle' || step === 'animating-open' ? { y: 200, scale: 0.8, opacity: 0 } :
                // SWAP
                step === 'extracting' ? { y: 0, scale: 1, opacity: 1, zIndex: 40 } : 
                // READ (Added opacity: 1 here to fix the bug)
                step === 'reading' ? { y: 0, x: 0, scale: 1.1, rotate: 0, zIndex: 50, opacity: 1 } : {}
            }
            transition={{ duration: 0.8, ease: "backOut" }} 
        >
             {/* LETTER HEADER */}
             <div className="w-full border-b-2 border-black/10 pb-4 mb-6">
                <h2 className="text-lg md:text-2xl font-handwritten text-black self-start -rotate-1">
                    My Sweet Mama,
                </h2>
             </div>

             {/* LETTER BODY */}
             <p className="text-md md:text-3xl font-handwritten text-gray-800 leading-relaxed mb-10 w-full">
               I have a very pressing question to ask you...<br/>
               <span className="bg-yellow-100/60 px-2 box-decoration-clone">
                 Will you be my Valentine?
               </span>
            </p>

            {/* CHECKBOXES */}
            <div className="flex flex-col md:gap-6 gap-2 w-full pl-4 mt-auto pb-4">
                
                {/* YES */}
                <motion.div 
                    className="flex items-center md:gap-6 gap-2 cursor-pointer group"
                    onClick={handleYes}
                    whileHover={{ scale: 1.02 + (rejectionCount * 0.1) }}
                    style={{ scale: 1 + (rejectionCount * 0.1) }}
                >
                    <div className="w-5 h-5 md:w-10 md:h-10 border-3 md:border-4 border-black rounded-md flex items-center justify-center"></div>
                    <span className="font-handwritten text-lg md:text-4xl text-black md:font-bold">
                        Yes baby!
                    </span>
                </motion.div>

                {/* NO */}
                <div className="flex items-center gap-2 md:gap-6 cursor-pointer group" onClick={handleNo} style={{ scale: 1 - (rejectionCount * 0.1) }}>
                    <div className="w-5 h-5 md:w-10 md:h-10 border-3 md:border-4 border-black rounded-md relative flex items-center justify-center">
                         {rejectionCount > 0 && <span className="text-red-600 font-bold text-4xl">✕</span>}
                    </div>
                    <span className="font-handwritten text-lg md:text-4xl text-gray-800 decoration-wavy group-hover:text-red-600 transition-colors">
                        {currentNo}
                    </span>
                </div>
            </div>
            
        </motion.div>

      </div>
    </div>
  );
}