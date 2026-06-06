import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Mail, Eye } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onContactClick: () => void;
  totalViews: number;
}

export default function Hero({ onExploreClick, onContactClick, totalViews }: HeroProps) {
  const titles = [
    'Mahasiswa Rekayasa Perangkat Lunak',
    'Tech Content Creator',
    'Fullscreen Developer Enthusiast',
    'Peminat Kecerdasan Buatan & Web'
  ];
  
  const [currentTitleIdx, setCurrentTitleIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = titles[currentTitleIdx];

    const handleType = () => {
      if (!isDeleting) {
        // Typing
        setTypedText(fullText.substring(0, typedText.length + 1));
        setTypingSpeed(100);

        if (typedText === fullText) {
          // Pause before deleting
          timer = setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      } else {
        // Deleting
        setTypedText(fullText.substring(0, typedText.length - 1));
        setTypingSpeed(50);

        if (typedText === '') {
          setIsDeleting(false);
          setCurrentTitleIdx((prev) => (prev + 1) % titles.length);
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [typedText, isDeleting, currentTitleIdx]);

  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 px-4 md:px-8">
      
      {/* 1. Slow drifting ambient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] animate-pulse duration-10000" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse duration-12000" />
      </div>

      {/* 2. "GRADUATION 2026" Big Watermark Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-1 overflow-hidden">
        <h1 className="text-[12vw] font-bold tracking-widest text-white/[0.012] md:text-white/[0.015] font-display uppercase whitespace-nowrap select-none rotate-[-4deg]">
          GRADUATION 2026
        </h1>
      </div>

      {/* 3. Hero Layout Grid */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 py-12">
        
        {/* Left copy section */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-left order-2 lg:order-1">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            <p className="font-mono text-xs uppercase tracking-widest text-amber-500/80 font-medium">
              Aktif & Terbuka untuk Kolaborasi
            </p>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white"
          >
            Membangun Masa Depan <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-blue-400">
              Melalui Baris Kode & Desain
            </span>
          </motion.h2>

          {/* Typing Effect Subtitle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="h-8 md:h-10 flex items-center"
          >
            <p className="font-mono text-base md:text-lg text-zinc-400">
              Saya adalah <span className="text-amber-300 font-semibold">{typedText}</span>
              <span className="animate-pulse font-bold text-amber-300">|</span>
            </p>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-zinc-400 text-sm md:text-base max-w-xl leading-relaxed font-light"
          >
            Selamat datang di dunia kreatif digital saya. MyKonten didesain sebagai galeri visual terpadu—tempat saya berbagi tulisan teknologi mendalam, portofolio sistem fungsional, dan tangkapan lensa estetis. Sentuhan modernitas yang tenang untuk mendampingi evolusi digital.
          </motion.p>

          {/* Call-to-action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={onExploreClick}
              className="px-6 py-3 cursor-pointer rounded-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-amber-500/20 hover:scale-[1.02]"
            >
              Jelajahi Konten
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </button>
            
            <button
              onClick={onContactClick}
              className="px-6 py-3 cursor-pointer rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all duration-300 flex items-center gap-2 hover:scale-[1.02]"
            >
              Hubungi Saya
              <Mail className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Counter views aesthetic */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 pt-6 text-zinc-500 text-xs font-mono"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-600" />
            <span>Kunjungan Platform: {totalViews || '...'} views</span>
          </motion.div>

        </div>

        {/* Right photo section (half body) */}
        <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
          >
            {/* Elegant glowing frame background */}
            <div className="absolute inset-2 bg-gradient-to-tr from-amber-500/20 via-blue-500/10 to-amber-500/30 rounded-3xl blur-2xl transform rotate-6 scale-95" />
            
            {/* Main Image Shield (Glassmorphism borders) */}
            <div className="absolute inset-0 bg-zinc-900/40 rounded-3xl p-2.5 border border-white/10 shadow-2xl backdrop-blur-md overflow-hidden transform hover:scale-[1.01] transition-transform duration-500 ease-out flex items-center justify-center">
              <img
                src="/src/assets/images/owner_photo_png_1780724735955.png"
                alt="MyKonten Owner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl filter brightness-[0.85] contrast-[1.05]"
              />
              
              {/* Overlaid minimal tag */}
              <div className="absolute bottom-4 left-4 right-4 glass-panel border border-white/10 rounded-xl px-4 py-2 flex items-center justify-between">
                <div>
                  <p className="text-white text-xs font-semibold">Tegar Al Ghozali</p>
                  <p className="text-[10px] text-zinc-400">Class of 2026</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300 uppercase tracking-widest font-semibold">
                  Developer
                </span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

    </section>
  );
}
