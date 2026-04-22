'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    id: 'shxrp',
    title: 'SHxRP',
    color: '#CB5221', 
    image: './shxrp-suit.png',
  },
  {
    id: 'noble',
    title: 'NOBLE',
    color: '#15201A', 
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
  const [activeColor, setActiveColor] = useState(SLIDES[0].color);

  useGSAP(() => {
    const slides = gsap.utils.toArray<HTMLElement>('.gsap-slide');

    // Initial setup
    gsap.set(slides, { opacity: 0, y: 40, zIndex: 0 });
    gsap.set(slides[0], { opacity: 1, y: 0, zIndex: 10 });
    
    // We create a ScrollTrigger based directly on the 300vh wrapper scrolling natively
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Add 1 second of smoothing to the scroll to enforce that smooth 600-800ms feeling
        onUpdate: (self) => {
          // Keep the CTA buttons and UI visually synced with the active slide context
          const index = Math.round(self.progress * (SLIDES.length - 1));
          if (SLIDES[index]) {
             setActiveColor(SLIDES[index].color);
          }
        }
      }
    });

    // We build the timeline in units of duration to distribute over the scroll height.
    // Transition duration is 1, holding duration is 0.5.
    
    // Initial hold before user starts moving deep
    tl.to({}, { duration: 0.2 });

    // Transition 1 (SHxRP out, NOBLE in)
    tl.to(slides[0], { opacity: 0, y: -40, ease: 'power2.inOut', duration: 1 }, "transition1");
    tl.to(slides[1], { opacity: 1, y: 0, zIndex: 10, ease: 'power2.inOut', duration: 1 }, "transition1");

    // Hold NOBLE
    tl.to({}, { duration: 0.5 }); // Holds position so users can digest the image

    // Transition 2 (NOBLE out, TARIQ in)
    tl.to(slides[1], { opacity: 0, y: -40, ease: 'power2.inOut', duration: 1 }, "transition2");
    tl.to(slides[2], { opacity: 1, y: 0, zIndex: 10, ease: 'power2.inOut', duration: 1 }, "transition2");

    // Hold TARIQ before leaving the pinned container
    tl.to({}, { duration: 0.2 }); 

  }, { scope: containerRef });

  return (
    <div className="bg-[#15201A]">
      <main ref={containerRef} className="relative w-full h-[300vh] font-sans selection:bg-[#FDFBF7] selection:text-black">
        {/* Sticky viewport content - exactly 100vh height */}
        <div className="sticky top-0 w-full h-screen overflow-hidden">
          
          {/* SLIDES STACK */}
          <div className="absolute inset-0 z-0">
             {SLIDES.map((slide) => (
                <div 
                  key={slide.id} 
                  className="gsap-slide absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                  style={{ backgroundColor: slide.color }}
                >
                  {/* BIG TEXT */}
                  <div className="absolute top-[22vh] md:top-[15vh] flex items-start justify-center w-full px-4 md:px-8 h-[50vh]">
                    <h1 className="text-[34vw] md:text-[22vw] leading-none font-display font-medium text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/5 whitespace-nowrap tracking-tight">
                      {slide.title}
                    </h1>
                  </div>

                  {/* CHARACTER IMAGE */}
                  <div className="relative z-20 w-[95vw] md:w-[85vw] lg:w-[900px] h-[78vh] md:h-[95vh] mt-auto origin-bottom flex items-end justify-center">
                    <div className="absolute inset-0 flex items-end justify-center">
                      <Image
                        src={slide.image}
                        alt={`${slide.title} custom suit model`}
                        fill
                        unoptimized
                        className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        priority
                      />
                    </div>
                  </div>
                </div>
             ))}
          </div>

          {/* GLOBAL UI OVELAY (Navbar, details) - sits static over the transitioning slides */}
          <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between p-6 md:p-12">
            
            {/* Navbar */}
            <nav className="w-full flex justify-between items-center pointer-events-auto">
              <div className="text-[#FDFBF7] pt-2 md:pt-0 font-display text-2xl md:text-4xl tracking-widest uppercase drop-shadow-sm font-semibold flex items-center h-10">
                SHxRP
              </div>

              {/* Framer motion used here to keep the crisp interactive button feel independent of ScrollTrigger */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative overflow-hidden bg-[#FDFBF7] px-5 py-2.5 md:px-8 md:py-4 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase shadow-xl"
              >
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" 
                  style={{ backgroundColor: activeColor }} 
                />
                <div className="relative z-10 block text-center">
                  <motion.span 
                    style={{ color: activeColor }}
                    className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"
                  >
                    Book Fitting
                  </motion.span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#FDFBF7] block">
                    Book Fitting
                  </span>
                </div>
              </motion.button>
            </nav>

            {/* Bottom details */}
            <div className="flex justify-between items-end w-full pb-2 md:pb-0 pointer-events-none">
              <div className="text-[#FDFBF7]/80 text-[8px] md:text-[11px] uppercase tracking-[0.2em] max-w-[130px] md:max-w-[220px] leading-relaxed md:leading-loose">
                <p className="font-semibold mb-1 md:mb-2 text-[#FDFBF7]">The New Standard</p>
                <p>Uncompromising luxury tailoring crafted for the modern gentleman.</p>
              </div>

              <div className="flex flex-col items-end text-[#FDFBF7]/80 text-[8px] md:text-[11px] uppercase tracking-[0.2em] leading-relaxed md:leading-loose text-right">
                <p className="mb-1 md:mb-2">Est. 2026</p>
                <p className="max-w-[100px] md:max-w-none">Savile Row // NYC // Milan</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Next content section (verifies scroll passes correctly out of the 300vh block) */}
      <section className="relative z-10 w-full min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center text-center p-8 border-t border-[#15201A]/10">
        <h2 className="text-[#15201A] font-display font-medium text-4xl md:text-6xl mb-6 uppercase tracking-widest">Mastery in Detail</h2>
        <p className="text-[#15201A]/70 max-w-lg leading-relaxed md:text-lg">
          Our bespoke journey translates precise measurements into architectural garments. The scrolling narrative has completed.
        </p>
      </section>
    </div>
  );
}
