import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, Eye, X, BookOpen } from 'lucide-react';
import { Article } from '../types';

interface KontenSectionProps {
  articles: Article[];
  onIncrementViews: (id: string, currentViews: number) => void;
}

export default function KontenSection({ articles, onIncrementViews }: KontenSectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  // Derive categories
  const categories = ['Semua', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];

  // Filter & Search
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    return matchesSearch && matchesCategory && article.published;
  });

  const handleReadMore = (article: Article) => {
    setReadingArticle(article);
    // Increment local views count to reflect live state instantly
    onIncrementViews(article.id, article.views || 0);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="konten" className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center">
      
      {/* Headings */}
      <div className="space-y-4 mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-500 font-semibold">BLOG & ARTIKEL</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white">
          Tulisan & Pemikiran Terbaru
        </h2>
        <div className="h-1 w-12 bg-amber-500 rounded-full" />
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-light">
          Ulasan komprehensif seputar arsitektur website modern, optimasi database, rekayasa produk, serta kisah inspiratif perjalanan rekayasa perangkat lunak.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-10 pb-6 border-b border-white/5">
        
        {/* Categories Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-xs font-medium transition-all duration-300 ${
                selectedCategory === cat 
                  ? 'bg-amber-500 text-black font-semibold' 
                  : 'bg-zinc-900 text-zinc-400 border border-white/5 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Cari artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-full px-5 py-2.5 pl-12 text-sm text-white focus:outline-none focus:border-amber-500/80 transition-all font-sans"
          />
          <Search className="absolute left-4 top-3 h-4 w-4 text-zinc-500" />
        </div>

      </div>

      {/* Articles Grid container */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-2xl border border-white/5">
          <p className="text-zinc-500 text-sm font-mono">Tidak ada artikel yang cocok dengan filter / kata kunci.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="group flex flex-col h-full bg-[#141417]/80 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-amber-500/30 shadow-lg"
            >
              {/* Cover Photo */}
              <div className="relative h-48 overflow-hidden bg-zinc-950">
                <img
                  src={article.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800'}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-[0.85] group-hover:brightness-100"
                />
                
                {/* Float Category Tag */}
                {article.category && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-black/75 backdrop-blur-md rounded-full text-[10px] font-mono uppercase font-semibold text-amber-400 border border-amber-500/10">
                    {article.category}
                  </span>
                )}
              </div>

              {/* Informative Body */}
              <div className="flex-grow p-6 flex flex-col space-y-3 justify-between">
                <div>
                  
                  {/* Date and Views metadata row */}
                  <div className="flex items-center gap-4 text-zinc-500 text-[11px] font-mono mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {article.views || 0} views
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-zinc-400 text-sm font-light mt-2 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Read Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono">Oleh: {article.author || 'Admin'}</span>
                  
                  <button
                    onClick={() => handleReadMore(article)}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-amber-500 hover:text-amber-300 transition-transform hover:translate-x-1"
                  >
                    Baca Selengkapnya
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </motion.article>
          ))}
        </div>
      )}

      {/* --- PREMIUM ARTICLE READER LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {readingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl max-h-[85vh] bg-[#111113] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Top Header Actions */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 bg-zinc-950/60 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300 uppercase tracking-wider font-semibold">
                    {readingArticle.category || 'Membaca'}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    Dipublikasikan: {formatDate(readingArticle.createdAt)}
                  </span>
                </div>
                <button
                  onClick={() => setReadingArticle(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Reader Core Panel */}
              <div className="overflow-y-auto p-6 md:p-10 space-y-6">
                
                {/* Hero banner cover inside modal */}
                {readingArticle.imageUrl && (
                  <div className="w-full h-56 md:h-80 rounded-xl overflow-hidden bg-zinc-950 border border-white/5">
                    <img
                      src={readingArticle.imageUrl}
                      alt={readingArticle.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter brightness-[0.9]"
                    />
                  </div>
                )}

                {/* Typography Heading */}
                <h1 className="text-3xl md:text-4xl font-extrabold font-display text-white leading-tight">
                  {readingArticle.title}
                </h1>

                {/* Author card row */}
                <div className="flex items-center justify-start gap-3 border-y border-white/5 py-4 my-2 text-zinc-500 text-xs font-mono">
                  <div className="h-6 w-6 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-[10px]">
                    MK
                  </div>
                  <div>
                    <span>Penulis: <strong>{readingArticle.author || 'Tegar Al Ghozali'}</strong></span>
                    <span className="mx-2">•</span>
                    <span>Telah dibaca {readingArticle.views || 0} kali</span>
                  </div>
                </div>

                {/* Content body with markdown spacing */}
                <div className="text-zinc-300 text-base font-light leading-relaxed font-sans space-y-4 whitespace-pre-wrap selection:bg-amber-500 selection:text-black">
                  {readingArticle.content}
                </div>

              </div>

              {/* End Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 bg-zinc-950/60 border-t border-white/5">
                <button
                  onClick={() => setReadingArticle(null)}
                  className="px-5 py-2 cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-white border border-white/5 hover:border-zinc-700 rounded-xl text-xs font-semibold transition-all"
                >
                  Tutup Bacaan
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
