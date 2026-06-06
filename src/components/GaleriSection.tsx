import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X, Calendar, Camera } from 'lucide-react';
import { GalleryItem } from '../types';

interface GaleriSectionProps {
  gallery: GalleryItem[];
}

export default function GaleriSection({ gallery }: GaleriSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // Derive categories
  const categories = ['Semua', ...Array.from(new Set(gallery.map(g => g.category).filter(Boolean)))];

  // Filter list
  const filteredGallery = gallery.filter(item => {
    return selectedCategory === 'Semua' || item.category === selectedCategory;
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="galeri" className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center">
      
      {/* Decorative Title */}
      <div className="space-y-4 mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-500 font-semibold">TANGKAPAN LENSA</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white">
          Galeri Visual Estetik
        </h2>
        <div className="h-1 w-12 bg-amber-500 rounded-full" />
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-light">
          Sebuah kurasi tangkapan lensa, workspace setups, dan abstraksi warna yang mewakili filosofi hidup minimalis bertema modernitas sunyi.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 items-center mb-10 pb-6 border-b border-white/5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 cursor-pointer rounded-full text-xs font-semibold transition-all duration-300 ${
              selectedCategory === cat 
                ? 'bg-amber-500 text-black font-semibold' 
                : 'bg-zinc-900 text-zinc-400 border border-white/5 hover:text-white hover:border-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid gallery layout */}
      {filteredGallery.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/10 rounded-2xl border border-white/5">
          <p className="text-zinc-500 text-sm font-mono">Belum ada foto pada kategori "{selectedCategory}".</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredGallery.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => setLightboxImage(item)}
              className="break-inside-avoid relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5 group cursor-pointer shadow-md"
            >
              
              {/* Cover Image with lazy loading */}
              <img
                src={item.imageUrl}
                alt={item.caption}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-auto object-cover filter brightness-[0.85] group-hover:brightness-100 transition-all duration-500 group-hover:scale-[1.03]"
              />

              {/* Seamless glass overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                
                <span className="mb-2 py-0.5 px-2 bg-amber-500/20 border border-amber-500/30 text-[9px] font-mono text-amber-300 uppercase tracking-widest w-max rounded font-bold">
                  {item.category || 'Capture'}
                </span>
                
                <p className="text-white text-sm font-light leading-snug mb-1 line-clamp-2">
                  {item.caption}
                </p>
                
                <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono pt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <div className="absolute top-4 right-4 p-2 bg-black/60 rounded-full border border-white/10 text-white">
                  <ZoomIn className="w-4 h-4" />
                </div>

              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* --- LIGHTBOX OVERLAY --- */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            >
              
              {/* Image box frame */}
              <div className="relative rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl flex items-center justify-center">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.caption}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[75vh] object-contain filter brightness-[0.95]"
                />
              </div>

              {/* Caption and description block below image */}
              <div className="text-center mt-4 max-w-xl space-y-2 px-4">
                <div className="flex items-center justify-center gap-2.5">
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] font-mono font-bold text-amber-300 uppercase">
                    {lightboxImage.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {formatDate(lightboxImage.createdAt)}
                  </span>
                </div>
                <p className="text-zinc-200 text-sm md:text-base font-light font-sans leading-relaxed">
                  {lightboxImage.caption}
                </p>
              </div>

              {/* Close Hover Trigger */}
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 md:-right-12 p-2 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white hover:text-amber-400 rounded-full cursor-pointer transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
