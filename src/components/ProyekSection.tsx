import { useState } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, Code2, Tag } from 'lucide-react';
import { Project } from '../types';

interface ProyekSectionProps {
  projects: Project[];
}

export default function ProyekSection({ projects }: ProyekSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Derive available categories
  const categories = ['Semua', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];

  // Filter projects list
  const filteredProjects = projects.filter(project => {
    return selectedCategory === 'Semua' || project.category === selectedCategory;
  });

  return (
    <section id="proyek" className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center bg-zinc-950/20">
      
      {/* Dynamic Header */}
      <div className="space-y-4 mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-500 font-semibold font-medium">REKAYASA SISTEM</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white">
          Portofolio Proyek Terpilih
        </h2>
        <div className="h-1 w-12 bg-amber-500 rounded-full" />
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-light">
          Kumpulan aplikasi web fungsional yang menggabungkan kecepatan performa database dengan keindahan antarmuka pengguna responsif.
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

      {/* Projects Grid Container */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-[#141417]/40 rounded-2xl border border-white/5">
          <p className="text-zinc-500 text-sm font-mono">Maaf, belum ada proyek di kategori "{selectedCategory}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="group relative flex flex-col md:flex-row bg-[#141417]/60 rounded-2xl border border-white/5 shadow-xl hover:border-amber-500/30 transition-all duration-300 overflow-hidden"
            >
              
              {/* Highlight Tag for Featured Project */}
              {project.featured && (
                <div className="absolute top-0 right-0 z-20">
                  <span className="bg-amber-500 text-black font-mono font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1">
                    ★ Unggulan
                  </span>
                </div>
              )}

              {/* Cover Screenshot Image */}
              <div className="md:w-5/12 h-48 md:h-auto overflow-hidden relative bg-zinc-950 flex items-center justify-center">
                <img
                  src={project.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-95 transition-all duration-500 group-hover:scale-102"
                />
              </div>

              {/* Informative description block */}
              <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-4">
                
                <div className="space-y-2">
                  <span className="flex items-center gap-1 bg-zinc-900 border border-white/5 py-0.5 px-2.5 rounded-full text-[10px] font-mono text-zinc-400 w-max font-semibold uppercase">
                    <Code2 className="w-3 h-3 text-amber-500" />
                    {project.category || 'Product'}
                  </span>
                  
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-amber-300 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-xs font-light leading-relaxed line-clamp-4">
                    {project.description}
                  </p>
                </div>

                {/* Tech Badges && Action paths */}
                <div className="space-y-4">
                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 rounded bg-zinc-800/60 border border-white/5 text-[10px] font-mono text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links Row */}
                  <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-xs">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        Demo Live
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-zinc-400 hover:text-white transition-colors"
                      >
                        Source Code
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          ))}
        </div>
      )}

    </section>
  );
}
