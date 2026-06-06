import { Article, Project, GalleryItem } from '../types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'seed-design-system',
    title: 'Membangun Sistem Desain Minimalis & Bertaraf Premium',
    summary: 'Bagaimana whitespace, tipografi Space Grotesk, dan palet warna arang emas dapat meningkatkan retensi visual pembaca hingga dua kali lipat.',
    content: `## Pengantar ke Estetika Premium

Sistem desain modern tidak lagi tentang memasukkan semua elemen ke dalam layar atau menggunakan gradasi warna pelangi yang terlalu ramai. Di era sekarang, **kemewahan visual dicapai melalui kesederhanaan dan kepresisian**.

### Tiga Pilar Estetika Kontemporer

1. **Whitespace (Negative Space) yang Lapang**
Memberikan ruang bagi mata pengguna untuk bernapas. Jarak antar komponen yang besar memberikan kesan bahwa setiap elemen diletakkan dengan penuh pertimbangan.

2. **Tipografi Berkarakter**
Gunakan kontras ukuran font yang dramatis. Judul yang besar lambat laun mengalir ke teks paragraf yang bersih dan terbaca dengan nyaman.

3. **Interaksi Mikro yang Halus**
Animasi hover yang lembut dengan kecepatan transisi sekitar \`300ms\` (seperti \`transition-all duration-300 ease-out\`) terasa organik di mata manusia.

### Implementasi Praktis

Jika Anda ingin membuat border pada dark mode, gunakan opacity border yang sangat tipis, contohnya \`border border-white/5\`. Jangan gunakan garis abu-abu padat yang tebal karena akan menghancurkan kesan premium.`,
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    category: 'Desain',
    author: 'MyKonten Admin',
    views: 142,
    published: true,
    createdAt: '2026-06-05T09:00:00Z'
  },
  {
    id: 'seed-react-performance',
    title: 'Optimasi Performa React 19 di Lingkungan Serverless',
    summary: 'Teknik-tekniki krusial dalam mereduksi bundle size dan mengoptimasi visual hydration pada rendering browser cloud modern.',
    content: `## Era Baru Web Rendering

Dengan rilisnya React 19, terjadi pergeseran paradigma tentang bagaimana kita memperlakukan state komponen, rendering sisi server, dan manajemen dependensi.

### Menghindari Re-render Tak Perlu

Salah satu masalah utama di sistem frontend yang dinamis adalah konsumsi CPU yang berlebih karena looping state yang salah. Pastikan untuk:
* Selalu menstabilkan dependensi pada \`useEffect\` menggunakan primitive values.
* Memanfaatkan struktur modular untuk melokalisasi render trigger.

\`\`\`typescript
// Pola yang direkomendasikan
const count = usePrimitiveValue(state);
useEffect(() => {
  fetchData(count);
}, [count]); // Menggunakan nilai primitif, bukan objek kompleks
\`\`\`

### Masa Depan Serverless

Integrasi instan dengan database cloud super cepat seperti Firebase Firestore memungkinkan kita menyimpan metadata konfigurasi di server-side secara real-time tanpa perlu mengorbankan performa payload dari browser klien.`,
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    category: 'Teknologi',
    author: 'MyKonten Admin',
    views: 98,
    published: true,
    createdAt: '2026-06-04T14:30:00Z'
  },
  {
    id: 'seed-minimalist-workspace',
    title: 'Esensi Produktivitas: Workspace, Filosofi, dan Kode',
    summary: 'Melihat lebih dekat bagaimana penataan ruang kerja fisik dapat memberikan dampak langsung pada kejelasan logika dan struktur kode pemrograman kita.',
    content: `## Keterkaitan Pikiran dan Lingkungan

Banyak developer mengira bahwa kebersihan kode hanya berasal dari latihan algoritma secara terus menerus. Namun, lingkungan fisik bertindak sebagai perpanjangan dari cara berpikir kita.

### Desk Setup Minimalis

Sebuah monitor berjarak pas di mata, keyboard mechanical bertipe senyap, pencahayaan hangat dengan intensitas \`2700K\`, dan menjauhkan dekorasi meja yang tidak fungsional.

> "Simplicity is the ultimate sophistication." — Leonardo da Vinci

### Menulis Kode yang Memiliki Ruang Bernapas

Sama seperti workspace Anda, biasakan menulis fungsi-fungsi yang ringkas dan modular:
1. Satu fungsi hanya melakukan satu tugas secara spesifik (\`Single Responsibility\`).
2. Tulis komentar hanya untuk menjawab alasan bisnis ("mengapa"), bukan alur logis ("bagaimana").
3. Beri jarak satu baris kosong yang rapi di antara deklarasi logika utama.`,
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    category: 'Edukasi',
    author: 'MyKonten Admin',
    views: 220,
    published: true,
    createdAt: '2026-06-02T08:15:00Z'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Simplikatif Analytics Engine',
    description: 'Sebuah dashboard analisis data serverless super ringan berbasis React dan Firestore yang melacak visualisasi grafik real-time tanpa membebani browser klien.',
    category: 'Web App',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    tags: ['React 19', 'Firestore', 'Tailwind', 'D3.js'],
    demoUrl: 'https://demo.mykonten.id/analytics',
    githubUrl: 'https://github.com/mykonten/analytics-engine',
    featured: true,
    createdAt: '2026-05-20T10:00:00Z'
  },
  {
    id: 'proj-2',
    title: 'Lumina Elegant Taskboard',
    description: 'Manajer tugas kolaboratif berciri glassmorphism yang dikhususkan bagi profesional kreatif untuk mengelola sprint mingguan tanpa polusi visual.',
    category: 'Productivity',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&q=80&w=800',
    tags: ['TypeScript', 'Firebase Auth', 'Motion'],
    demoUrl: 'https://demo.mykonten.id/lumina',
    githubUrl: 'https://github.com/mykonten/lumina-taskboard',
    featured: true,
    createdAt: '2026-05-10T12:00:00Z'
  },
  {
    id: 'proj-3',
    title: 'Aura Premium Audio Synthesizer',
    description: 'Sintetisator audio berbasis web yang merubah gelombang sinus menjadi suara ambient penunjang konsentrasi coding bertema malam hari.',
    category: 'Audio Tech',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
    tags: ['Web Audio API', 'React', 'Tailwind CSS'],
    demoUrl: 'https://demo.mykonten.id/aura-synth',
    githubUrl: 'https://github.com/mykonten/aura-ambient-synth',
    featured: false,
    createdAt: '2026-04-15T15:30:00Z'
  }
];

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800',
    caption: 'Fokus penuh pada baris baris kode di sepertiga malam hari.',
    category: 'Workspace',
    createdAt: '2026-05-28T21:00:00Z'
  },
  {
    id: 'gal-2',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    caption: 'Sirkuitar board terintegrasi mikroprosesor berskala ultra nano.',
    category: 'Technology',
    createdAt: '2026-05-25T14:20:00Z'
  },
  {
    id: 'gal-3',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    caption: 'Aliran bit data digital yang terangkai dalam kerangka enkripsi.',
    category: 'Coding',
    createdAt: '2026-05-20T10:15:00Z'
  },
  {
    id: 'gal-4',
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800',
    caption: 'Analisis visual grafik laba rugi makro ekonomi digital.',
    category: 'Analytics',
    createdAt: '2026-05-18T09:40:00Z'
  },
  {
    id: 'gal-5',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800',
    caption: 'Menikmati secangkir kopi hitam hangat sembari meluncurkan rilis v1.0.0.',
    category: 'Coffee & Code',
    createdAt: '2026-05-15T08:10:00Z'
  },
  {
    id: 'gal-6',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    caption: 'Menganalisis performa muatan sasis container server hosting lokal.',
    category: 'Infrastructure',
    createdAt: '2026-05-10T16:30:00Z'
  }
];
