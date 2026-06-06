import { motion } from 'motion/react';
import { Award, Compass, GraduationCap, Gamepad2, Brain, Coffee, Laptop, Dumbbell, Code } from 'lucide-react';

export default function TentangSection() {
  const skills = [
    { name: 'React (Vite / Next.js)', level: 92, category: 'Frontend' },
    { name: 'TypeScript / JS (ESNext)', level: 88, category: 'Bahasa' },
    { name: 'Firebase (Auth/Store/Storage)', level: 85, category: 'Backend/Cloud' },
    { name: 'Tailwind CSS (v4)', level: 95, category: 'Desain Sistem' },
    { name: 'Node.js (Express)', level: 80, category: 'Backend' },
    { name: 'Python (AI Basics & Scripting)', level: 75, category: 'Bahasa' }
  ];

  const hobbies = [
    { name: 'Bermain Game Teknis', desc: 'Mengasah taktik strategis dan kerja sama di ranah MMORPG / RTS.', icon: <Gamepad2 className="w-4 h-4 text-amber-500" /> },
    { name: 'Kopi & Menjelajah Kode', desc: 'Mencoba API baru ditemani secangkir espresso pagi hari.', icon: <Coffee className="w-4 h-4 text-amber-500" /> },
    { name: 'Membaca Dokumentasi', desc: 'Menyelami artikel teknik demi mengusir rasa penasaran teknologi.', icon: <Brain className="w-4 h-4 text-amber-500" /> },
    { name: 'Hanyut dalam Musik', desc: 'Mendengarkan playlist lofi ambient sewaktu merangkai kode program.', icon: <Compass className="w-4 h-4 text-amber-500" /> }
  ];

  const milestones = [
    {
      year: 'Semester Ganjil 2026',
      title: 'Tahun Kelulusan & MyKonten launch',
      detail: 'Menyelesaikan kurikulum sarjana rekayasa perangkat lunak, mempublikasikan portofolio interaktif terintegrasi Firestore.'
    },
    {
      year: '2024 - 2025',
      title: 'Full-stack Cloud Engineering',
      detail: 'Mendalami model arsitektur asinkronus serverless menggunakan Firebase, meletakkan dasar pemrosesan data real-time.'
    },
    {
      year: '2022 - 2023',
      title: 'Memasuki Gerbang Kode',
      detail: 'Pertama kali menyentuh HTML/CSS dan struktur JavaScript dasar. Berlanjut hingga membangun interface statis yang responsif.'
    }
  ];

  return (
    <section id="tentang" className="min-h-screen py-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center bg-zinc-950/40">
      
      {/* Narrative Section Header */}
      <div className="space-y-4 mb-16">
        <p className="font-mono text-xs uppercase tracking-widest text-amber-500 font-semibold">TENTANG SAYA</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white">
          Di Balik MyKonten
        </h2>
        <div className="h-1 w-12 bg-amber-500 rounded-full" />
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-light">
          Menjembatani keindahan visual piksel murni dengan skalabilitas performa serverless modern guna menghadirkan sensasi web terbaik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: Profile bio, stats and hobbies */}
        <div className="lg:col-span-6 space-y-10">
          
          {/* Bio block */}
          <div className="space-y-4 font-sans text-zinc-300 font-light leading-relaxed text-sm md:text-base">
            <h3 className="text-2xl font-bold text-white font-display">Tegar Al Ghozali</h3>
            <p className="font-mono text-xs text-amber-400 font-medium">Mahasiswa Sistem Informasi & Pengembang Web Mandiri</p>
            <p>
              Halo! Saya adalah pengembang web independen bergaya modern yang meyakini bahwa baris kode haruslah disusun serapi baris paragraf dalam buku esai. Berfokus pada perpaduan estetis interface bertemakan warna kalem, glassmorphism, dan minimalisme.
            </p>
            <p>
              Dengan bekal kelulusan di tahun 2026, saya terus memotivasi diri melangkah lebih dalam ke ranah rekayasa teknologi cloud, optimasi database nirlaba, serta pengerjaan website personal yang sarat kenyamanan visual bagi pengunjung.
            </p>
          </div>

          {/* Hobbies grid */}
          <div className="space-y-4">
            <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-500">Minat & Hobi Terpilih</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hobbies.map((hb) => (
                <div 
                  key={hb.name}
                  className="p-4 bg-zinc-900/60 rounded-xl border border-white/5 flex gap-3 items-start hover:border-amber-500/20 transition-all duration-300"
                >
                  <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg mt-0.5 shrink-0">
                    {hb.icon}
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-white mb-0.5">{hb.name}</h5>
                    <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{hb.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Timeline & Skills */}
        <div className="lg:col-span-6 space-y-10">
          
          {/* Timeline of tech education */}
          <div className="space-y-5">
            <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-500">Lini Masa Belajar Teknologi</h4>
            <div className="relative border-l border-white/10 ml-2.5 pl-6 space-y-8">
              {milestones.map((ms, idx) => (
                <motion.div 
                  key={ms.year}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative space-y-1"
                >
                  {/* Timeline dot marker */}
                  <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-zinc-950 border-2 border-amber-500 shadow shadow-amber-500/40" />
                  
                  <span className="font-mono text-[10px] text-amber-500 font-semibold tracking-wider uppercase">
                    {ms.year}
                  </span>
                  <h5 className="text-sm font-bold text-white font-display">
                    {ms.title}
                  </h5>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    {ms.detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Technical skills meter bar */}
          <div className="space-y-4">
            <h4 className="text-sm font-mono uppercase tracking-wider text-zinc-500">Keterampilan Teknis Utama</h4>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white hover:text-amber-300 transition-colors">{skill.name}</span>
                    <span className="text-zinc-500">{skill.level}%</span>
                  </div>
                  
                  {/* Slatted line meters */}
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
