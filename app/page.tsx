'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'motion/react';

const SLIDES = [
  {
    id: 'shxrp',
    title: 'SHxRP',
    color: '#CB5221', // Refined Terracotta/Cognac Orange 
    image: '/shxrp-suit.png',
  },
  {
    id: 'noble',
    title: 'NOBLE',
    color: '#15201A', // Racing Green
    image: '/noble.png',
  },
  {
    id: 'tariq',
    title: 'TARIQ',
    color: '#80391d',
    image: '/tariq.png',
  }
];

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track the scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // Update active index based on scroll position
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    // Snap at halfway points between slides
    const index = Math.min(
      SLIDES.length - 1,
      Math.max(0, Math.round(latest * (SLIDES.length - 1)))
    );
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  });

  const activeSlide = SLIDES[activeIndex];

  // Smoothly interpolate background color based on scroll
  const bgColor = useTransform(
    scrollYProgress,
    SLIDES.map((_, i) => i / (SLIDES.length - 1)),
    SLIDES.map(s => s.color)
  );

  // Parallax transform for the giant typography background mapping scroll progress to downward drift
  const textParallaxY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    // Set to 200vh for a balanced continuous scroll: provides 50vh of scrolling distance per transition.
    <main 
      ref={containerRef} 
      className="relative w-full h-[200vh] font-sans selection:bg-[#FDFBF7] selection:text-black"
    >
      {/* Sticky layout so content stays fixed in the viewport while we scroll the body natively */}
      <motion.div 
        className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center pointer-events-auto"
        style={{ backgroundColor: bgColor }}
      >
        {/* Navbar */}
        <nav className="absolute top-0 w-full pt-6 md:pt-10 px-6 md:px-12 flex justify-between items-center z-50 pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[#FDFBF7] font-display text-2xl md:text-4xl tracking-widest uppercase drop-shadow-sm font-semibold flex items-center h-10"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={activeSlide.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                {activeSlide.title}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden bg-[#FDFBF7] px-5 py-2.5 md:px-8 md:py-4 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-xl md:mt-[-8px]"
            >
              {/* Dynamic hover background */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" 
                style={{ backgroundColor: bgColor }} 
              />
              <div className="relative z-10 block">
                {/* Default Text (syncs with section background) */}
                <motion.span 
                  style={{ color: bgColor }}
                  className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"
                >
                  Book Fitting
                </motion.span>
                {/* Hover Text */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#FDFBF7] block">
                  Book Fitting
                </span>
              </div>
            </motion.button>
          </motion.div>
        </nav>

        {/* Background Typography */}
        <motion.div 
          style={{ y: textParallaxY }}
          className="absolute top-[22vh] md:top-[15vh] flex items-start justify-center pointer-events-none z-10 w-full px-4 md:px-8 h-[50vh]"
        >
          <AnimatePresence mode="popLayout">
            <motion.h1 
              key={activeSlide.id}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.05, opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[34vw] md:text-[22vw] leading-none font-display font-medium text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/5 whitespace-nowrap tracking-tight absolute"
            >
              {activeSlide.title}
            </motion.h1>
          </AnimatePresence>
        </motion.div>

        {/* Centerpiece Image */}
        <div className="relative z-20 w-[95vw] md:w-[85vw] lg:w-[900px] h-[78vh] md:h-[95vh] mt-auto pointer-events-none origin-bottom flex items-end justify-center">
          <AnimatePresence mode="popLayout">
            <motion.div 
              key={activeSlide.id}
              initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -20, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-end justify-center"
            >
              <Image
                src={activeSlide.image}
                alt={`${activeSlide.title} custom suit model`}
                fill
                unoptimized
                className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Decorative details / Micro-labels */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-6 md:bottom-10 left-6 md:left-12 z-50 text-[#FDFBF7]/80 text-[8px] md:text-[11px] uppercase tracking-[0.2em] max-w-[130px] md:max-w-[220px] leading-relaxed md:leading-loose"
        >
          <p className="font-semibold mb-1 md:mb-2 text-[#FDFBF7]">The New Standard</p>
          <p>Uncompromising luxury tailoring crafted for the modern gentleman.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-6 md:bottom-10 right-6 md:right-12 z-50 flex flex-col items-end text-[#FDFBF7]/80 text-[8px] md:text-[11px] uppercase tracking-[0.2em] leading-relaxed md:leading-loose text-right"
        >
          <p className="mb-1 md:mb-2">Est. 2026</p>
          <p className="max-w-[100px] md:max-w-none">Savile Row // NYC // Milan</p>
        </motion.div>
      </motion.div>
    </main>
  );
}
