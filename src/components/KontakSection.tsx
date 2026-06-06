import { motion } from 'motion/react';
import { Instagram, Github, Mail, MessageCircle, Music2, ArrowUpRight } from 'lucide-react';

export default function KontakSection() {
  const contactLinks = [
    {
      name: 'Instagram',
      handle: '@tegar_ghozali',
      url: 'https://instagram.com/tegar_ghozali',
      icon: <Instagram className="w-5 h-5" />,
      colorClass: 'group-hover:text-pink-400 group-hover:border-pink-500/30',
      glowColor: 'rgba(236,72,153,0.15)',
      description: 'Berbagi cerita visual, fotografi urban, dan rutinitas harian.'
    },
    {
      name: 'WhatsApp',
      handle: '+62 822-4545-2026',
      url: 'https://wa.me/6282245452026',
      icon: <MessageCircle className="w-5 h-5" />,
      colorClass: 'group-hover:text-green-400 group-hover:border-green-500/30',
      glowColor: 'rgba(34,197,94,0.15)',
      description: 'Saluran obrolan cepat untuk membicarakan kerja sama freelance.'
    },
    {
      name: 'GitHub',
      handle: 'tegar-ghozali',
      url: 'https://github.com/tegar-ghozali',
      icon: <Github className="w-5 h-5" />,
      colorClass: 'group-hover:text-white group-hover:border-zinc-500/40',
      glowColor: 'rgba(255,255,255,0.1)',
      description: 'Gudang baris sirkuit kode, library nirlaba, dan eksperimen open-source.'
    },
    {
      name: 'Email',
      handle: 'tarzzgg1@gmail.com',
      url: 'mailto:tarzzgg1@gmail.com',
      icon: <Mail className="w-5 h-5" />,
      colorClass: 'group-hover:text-blue-400 group-hover:border-blue-500/30',
      glowColor: 'rgba(59,130,246,0.15)',
      description: 'Saran perbaikan, surat bisnis formal, atau say hi secara aman.'
    },
    {
      name: 'TikTok',
      handle: '@mykonten.tech',
      url: 'https://tiktok.com/@mykonten.tech',
      icon: <Music2 className="w-5 h-5" />,
      colorClass: 'group-hover:text-cyan-400 group-hover:border-cyan-500/30',
      glowColor: 'rgba(6,182,212,0.15)',
      description: 'Berbagi cuplikan coding ringkas 60 detik dan visualisasi UI estetis.'
    }
  ];

  return (
    <section id="kontak" className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center">
      
      {/* Decorative Contact Header */}
      <div className="space-y-4 mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-500 font-semibold">KONEKSI GUNA KOLABORASI</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white">
          Mari Saling Terhubung
        </h2>
        <div className="h-1 w-12 bg-amber-500 rounded-full" />
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-light">
          Ingin memulai kemitraan inovatif, berdiskusi mengenai proyek web baru, atau sekadar bertukar wawasan seputar teknologi? Silakan hubungi saya melalui kanal sosial media di bawah.
        </p>
      </div>

      {/* Grid of contact card anchors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactLinks.map((contact, idx) => (
          <motion.a
            key={contact.name}
            href={contact.url}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className="group relative block p-6 bg-[#141417]/70 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-amber-500/30 cursor-pointer hover:-translate-y-1 shadow-md"
            style={{
              boxShadow: `0 0 0 0 transparent`
            }}
            whileHover={{
              boxShadow: `0 10px 40px -20px ${contact.glowColor}`
            }}
          >
            
            {/* Dynamic glowing radial filter */}
            <div 
              className="absolute -right-12 -top-12 w-28 h-28 rounded-full blur-2xl transition-opacity opacity-0 group-hover:opacity-40 duration-300 pointer-events-none"
              style={{ backgroundColor: contact.glowColor }}
            />

            <div className="flex justify-between items-start mb-6">
              
              {/* Icon Shield */}
              <div className={`p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400 font-medium transition-colors duration-300 ${contact.colorClass}`}>
                {contact.icon}
              </div>

              {/* Minimal chevron launcher icon */}
              <div className="p-1 bg-zinc-900/40 border border-white/5 rounded-lg text-zinc-600 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>

            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold block">
                {contact.name}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-display">
                {contact.handle}
              </h3>
              <p className="text-zinc-400 text-xs font-light leading-relaxed pt-2">
                {contact.description}
              </p>
            </div>

          </motion.a>
        ))}
      </div>

      {/* Footer credits boundary of mykonten */}
      <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-600">
        <p>© 2026 MyKonten. Tegar Al Ghozali — Graduation Portfolio.</p>
        <p className="flex items-center gap-1">
          <span>Didesain dengan Cinta & Logika</span>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 block" />
        </p>
      </div>

    </section>
  );
}
