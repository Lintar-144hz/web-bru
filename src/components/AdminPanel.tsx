import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, ShieldCheck, Mail, AlertTriangle, Plus, Edit2, Trash2, 
  Eye, FileText, Briefcase, Image, LogOut, Check, ArrowLeft, Upload, RefreshCw
} from 'lucide-react';
import { Article, Project, GalleryItem, Stat } from '../types';
import { 
  db, auth, signInWithGoogle, logout, handleFirestoreError, OperationType, storage
} from '../firebase';
import { 
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MOCK_ARTICLES, MOCK_PROJECTS, MOCK_GALLERY } from '../data/mockData';

interface AdminPanelProps {
  articles: Article[];
  projects: Project[];
  gallery: GalleryItem[];
  stats: Stat | null;
  onRefreshData: () => void;
  onBackToSite: () => void;
}

export default function AdminPanel({
  articles,
  projects,
  gallery,
  stats,
  onRefreshData,
  onBackToSite
}: AdminPanelProps) {
  const [user, setUser] = useState(auth.currentUser);
  const [activeTab, setActiveTab] = useState<'articles' | 'projects' | 'gallery' | 'stats'>('articles');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Storage loading indicators
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);

  // Form states
  const [articleForm, setArticleForm] = useState<Partial<Article>>({
    title: '', summary: '', content: '', imageUrl: '', category: 'Teknologi', author: 'Tegar Al Ghozali', published: true
  });
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '', description: '', category: 'Web App', imageUrl: '', tags: [], demoUrl: '', githubUrl: '', featured: false
  });
  const [tagsInput, setTagsInput] = useState('');
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    imageUrl: '', caption: '', category: 'Workspace'
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u && u.email !== 'tarzzgg1@gmail.com') {
        setAuthError(`Email ${u.email} tidak terdaftar sebagai Administrator Utama 'tarzzgg1@gmail.com'. Akses tulis ditolak oleh Firestore rules.`);
      } else {
        setAuthError(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setAuthError(null);
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Login error details:", err);
      let customMsg = `Gagal melakukan login: ${err?.code || 'Error tidak dikenal'}. `;
      if (err?.code === 'auth/unauthorized-domain') {
        customMsg += 'Domain situs Anda saat ini belum didaftarkan sebagai "Authorized Domains" di Firebase Console Anda. Silakan pergi ke Firebase Console -> Authentication -> Settings -> Authorized Domains lalu tambahkan domain Vercel / domain saat ini.';
      } else if (err?.code === 'auth/popup-blocked') {
        customMsg += 'Popup diblokir oleh browser. Silakan berikan izin popup atau buka situs ini langsung bukan melalui iframe.';
      } else if (err?.code === 'auth/operation-not-allowed') {
        customMsg += 'Metode masuk "Google" belum diaktifkan di Firebase Console Anda. Silakan masuk ke Firebase Console -> Authentication -> Sign-in Method dan aktifkan Google Provider.';
      } else if (err?.code === 'auth/network-request-failed') {
        customMsg += 'Koneksi jaringan gagal atau diblokir oleh ekstensi browser (Adblocker). Nonaktifkan Adblocker Anda.';
      } else {
        customMsg += `${err?.message || ''}. Tips: Jika Anda mencobanya di dalam editor AI Studio, silakan buka aplikasi di TAB BARU menggunakan ikon panah di kanan atas preview, atau pastikan Domain Authorized & Google Provider sudah diaktifkan di Firebase Console Anda.`;
      }
      setAuthError(customMsg);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Helper flash messages
  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // File Uploader to Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetFieldUpdater: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showStatus('Ukuran file terlalu besar. Maksimal 5MB.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      targetFieldUpdater(downloadUrl);
      showStatus('Media berhasil diunggah ke Firebase Storage!');
    } catch (error) {
      console.error(error);
      showStatus('Gagal mengunggah media ke Firebase Storage. Storage rules menolak atau project belum dikonfigurasi.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Seed default portfolio database entries with one click
  const handleSeedDatabase = async () => {
    if (confirm('Semaikan seluruh Data Contoh (Mock Data) ke Firebase Firestore? Tindakan ini akan menyatukan data contoh ke dalam Firestore.')) {
      setIsSubmitLoading(true);
      try {
        const batch = writeBatch(db);
        
        // Feed Articles
        MOCK_ARTICLES.forEach((art) => {
          const docRef = doc(db, 'articles', art.id);
          batch.set(docRef, {
            title: art.title,
            summary: art.summary,
            content: art.content,
            imageUrl: art.imageUrl,
            category: art.category,
            author: art.author,
            views: art.views,
            published: art.published,
            createdAt: new Date().toISOString()
          });
        });

        // Feed Projects
        MOCK_PROJECTS.forEach((proj) => {
          const docRef = doc(db, 'projects', proj.id);
          batch.set(docRef, {
            title: proj.title,
            description: proj.description,
            category: proj.category,
            imageUrl: proj.imageUrl,
            tags: proj.tags.join(', '),
            demoUrl: proj.demoUrl || '',
            githubUrl: proj.githubUrl || '',
            featured: proj.featured,
            createdAt: new Date().toISOString()
          });
        });

        // Feed Gallery
        MOCK_GALLERY.forEach((gal) => {
          const docRef = doc(db, 'gallery', gal.id);
          batch.set(docRef, {
            imageUrl: gal.imageUrl,
            caption: gal.caption,
            category: gal.category,
            createdAt: new Date().toISOString()
          });
        });

        // Initialize Stats views views
        const statRef = doc(db, 'stats', 'analytics');
        batch.set(statRef, {
          views: 124,
          updatedAt: new Date().toISOString()
        });

        await batch.commit();
        showStatus('Seluruh data contoh berhasil disemaikan ke Firestore database!');
        onRefreshData();
      } catch (error: any) {
        console.error(error);
        const errMsg = error?.message || String(error);
        if (errMsg.includes('unavailable') || errMsg.includes('Could not reach') || errMsg.includes('offline')) {
          showStatus('Gagal: Firestore belum diaktifkan di Firebase Console "web-ix-d". Masuk ke Firebase Console -> Firestore Database, lalu klik "Create Database"!', 'error');
        } else {
          showStatus('Gagal menyemaikan data. Pastikan akun masuk Anda sesuai dan database Firestore Anda sudah diaktifkan.', 'error');
        }
      } finally {
        setIsSubmitLoading(false);
      }
    }
  };

  // --- ARTICLES CRUD ---
  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    const path = 'articles';

    try {
      const payload = {
        title: articleForm.title,
        summary: articleForm.summary,
        content: articleForm.content,
        imageUrl: articleForm.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        category: articleForm.category || 'Teknologi',
        author: articleForm.author || 'Tegar Al Ghozali',
        views: articleForm.views || 0,
        published: articleForm.published !== undefined ? articleForm.published : true,
        createdAt: editingId ? (articles.find(a => a.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, path, editingId), payload);
        showStatus('Artikel berhasil diredaksi!');
      } else {
        const customId = `art-${Date.now()}`;
        await setDoc(doc(db, path, customId), payload);
        showStatus('Artikel baru berhasil dipublikasikan!');
      }

      setArticleForm({ title: '', summary: '', content: '', imageUrl: '', category: 'Teknologi', author: 'Tegar Al Ghozali', published: true });
      setEditingId(null);
      onRefreshData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
      showStatus('Gagal menyimpan artikel. Cek kepemilikan admin.', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleEditArticle = (article: Article) => {
    setArticleForm(article);
    setEditingId(article.id);
  };

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Hapus artikel ini secara permanen?')) {
      const path = 'articles';
      try {
        await deleteDoc(doc(db, path, id));
        showStatus('Artikel berhasil dihapus.');
        onRefreshData();
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
        showStatus('Gagal menghapus.', 'error');
      }
    }
  };


  // --- PROJECTS CRUD ---
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    const path = 'projects';

    try {
      const tagString = Array.isArray(projectForm.tags) ? (projectForm.tags as string[]).join(', ') : tagsInput;
      const payload = {
        title: projectForm.title,
        description: projectForm.description,
        category: projectForm.category || 'Web App',
        imageUrl: projectForm.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        tags: tagString, // store as string in Firestore as per schema mapping
        demoUrl: projectForm.demoUrl || '',
        githubUrl: projectForm.githubUrl || '',
        featured: projectForm.featured || false,
        createdAt: editingId ? (projects.find(p => p.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, path, editingId), payload);
        showStatus('Proyek berhasil diredaksi!');
      } else {
        const customId = `proj-${Date.now()}`;
        await setDoc(doc(db, path, customId), payload);
        showStatus('Proyek baru berhasil dipublikasikan!');
      }

      setProjectForm({ title: '', description: '', category: 'Web App', imageUrl: '', tags: [], demoUrl: '', githubUrl: '', featured: false });
      setTagsInput('');
      setEditingId(null);
      onRefreshData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
      showStatus('Gagal menyimpan proyek.', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleEditProject = (proj: Project) => {
    setProjectForm(proj);
    setTagsInput(proj.tags.join(', '));
    setEditingId(proj.id);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Hapus proyek ini secara permanen?')) {
      const path = 'projects';
      try {
        await deleteDoc(doc(db, path, id));
        showStatus('Proyek dihapus.');
        onRefreshData();
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
        showStatus('Gagal menghapus.', 'error');
      }
    }
  };


  // --- GALLERY CRUD ---
  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    const path = 'gallery';

    try {
      const payload = {
        imageUrl: galleryForm.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        caption: galleryForm.caption,
        category: galleryForm.category || 'Workspace',
        createdAt: editingId ? (gallery.find(g => g.id === editingId)?.createdAt || new Date().toISOString()) : new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, path, editingId), payload);
        showStatus('Galeri berhasil diredaksi!');
      } else {
        const customId = `gal-${Date.now()}`;
        await setDoc(doc(db, path, customId), payload);
        showStatus('Foto baru berhasil diunggah!');
      }

      setGalleryForm({ imageUrl: '', caption: '', category: 'Workspace' });
      setEditingId(null);
      onRefreshData();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
      showStatus('Gagal menyimpan asset galeri.', 'error');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleEditGallery = (item: GalleryItem) => {
    setGalleryForm(item);
    setEditingId(item.id);
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm('Hapus foto ini secara permanen?')) {
      const path = 'gallery';
      try {
        await deleteDoc(doc(db, path, id));
        showStatus('Foto terhapus.');
        onRefreshData();
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
        showStatus('Gagal menghapus.', 'error');
      }
    }
  };

  // --- RENDERING LOGIN BAR ---
  if (!user || user.email !== 'tarzzgg1@gmail.com') {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#141417] rounded-3xl border border-white/10 p-8 text-center relative z-10 shadow-2xl space-y-6"
        >
          <div className="mx-auto h-12 w-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-500">
            <Lock className="w-5 h-5" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-display text-white">Panel Administrator</h2>
            <p className="text-zinc-400 text-xs font-light font-sans max-w-xs mx-auto leading-relaxed">
              Silakan login dengan akun Google utama milik Anda untuk membuka dasbor manajemen portofolio MyKonten.
            </p>
          </div>

          {authError && (
            <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-left flex gap-3 items-start">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-400 font-mono leading-relaxed">{authError}</p>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleLogin}
              className="w-full py-3 px-5 rounded-xl cursor-pointer bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Masuk dengan Akun Google
            </button>

            <button
              onClick={onBackToSite}
              className="w-full py-3 px-5 rounded-xl cursor-pointer bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-zinc-300 font-medium text-sm transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Kembali ke Beranda
            </button>
          </div>

          <div className="text-[10px] text-zinc-600 font-mono">
            Protected by Cloud Firestore strict collection security rules.
          </div>
        </motion.div>
      </div>
    );
  }

  // --- ADMIN PORTAL LANDING VIEW AFTER SUCCESSFUL AUTHORIZATION ---
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex flex-col space-y-8 select-none">
      
      {/* 1. Portal header with logout triggers */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-xl font-bold font-display text-white">Dasbor Administrator MyKonten</h2>
          </div>
          <p className="text-xs text-zinc-400">
            Terautentikasi secara aman sebagai: <strong className="font-mono text-amber-400">{user.email}</strong> (Superadmin)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Mock Seeder Option */}
          <button
            onClick={handleSeedDatabase}
            className="px-4 py-2 cursor-pointer rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Semaikan seluruh dummy data portfolio ke database"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Semaikan Data Contoh
          </button>
          
          <button
            onClick={onBackToSite}
            className="px-4 py-2 cursor-pointer bg-zinc-850 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold border border-white/5 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali ke Web
          </button>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 cursor-pointer bg-red-950/20 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl text-xs font-semibold border border-red-500/15 flex items-center gap-1"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Keluar
          </button>
        </div>
      </div>

      {/* Status Messages Flash Area */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl text-xs font-medium border flex items-center gap-2 ${
              statusMessage.type === 'success' 
                ? 'bg-green-950/20 border-green-500/20 text-green-400' 
                : 'bg-red-950/20 border-red-500/20 text-red-450'
            }`}
          >
            <Check className="w-4 h-4" />
            {statusMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Analytical Statistics Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Views Card */}
        <div className="p-5 bg-[#141417]/60 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">Total Kunjungan</span>
            <p className="text-2xl font-bold font-display text-white">{stats?.views || 124}</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        {/* Articles Count */}
        <div className="p-5 bg-[#141417]/60 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">Total Artikel</span>
            <p className="text-2xl font-bold font-display text-white">{articles.length}</p>
          </div>
          <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Projects Count */}
        <div className="p-5 bg-[#141417]/60 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">Total Proyek</span>
            <p className="text-2xl font-bold font-display text-white">{projects.length}</p>
          </div>
          <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Shot grid Count */}
        <div className="p-5 bg-[#141417]/60 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold block">Koleksi Galeri</span>
            <p className="text-2xl font-bold font-display text-white">{gallery.length}</p>
          </div>
          <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-400">
            <Image className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* 3. Dashboard management layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left segment tab trigger lists */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider font-semibold pl-2">Segmentasi Konten</p>
          
          <button
            onClick={() => { setActiveTab('articles'); setEditingId(null); }}
            className={`px-4 py-3 cursor-pointer rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'articles' ? 'bg-amber-500 text-black' : 'bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Kelola Blog & Artikel
          </button>
          
          <button
            onClick={() => { setActiveTab('projects'); setEditingId(null); }}
            className={`px-4 py-3 cursor-pointer rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'projects' ? 'bg-amber-500 text-black' : 'bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Kelola Proyek Rekayasa
          </button>
          
          <button
            onClick={() => { setActiveTab('gallery'); setEditingId(null); }}
            className={`px-4 py-3 cursor-pointer rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'gallery' ? 'bg-amber-500 text-black' : 'bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300'
            }`}
          >
            <Image className="w-4 h-4" />
            Kelola Galeri Visual
          </button>
        </div>

        {/* Right workspace displaying the selected tab managers */}
        <div className="lg:col-span-9 bg-[#141417]/60 border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur-md">
          
          {/* A. TAB ARTICLES */}
          {activeTab === 'articles' && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-white/5">
                <h3 className="text-lg font-bold text-white font-display">
                  {editingId ? 'Edit Artikel Blog' : 'Tuliskan Artikel Baru'}
                </h3>
                <p className="text-xs text-zinc-500 pt-1">Kelola publikasi tulisan teknologi Anda di halaman utama.</p>
              </div>

              {/* Form write */}
              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">Judul Artikel *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan judul artikel"
                      value={articleForm.title}
                      onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white uppercase-none focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">Kategori *</label>
                    <select
                      required
                      value={articleForm.category}
                      onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Teknologi">Teknologi</option>
                      <option value="Desain">Desain</option>
                      <option value="Life">Life Style</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="Ulasan">Review Buku / Gadget</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">Rangkuman / Dekripsi Singkat *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan ringkasan artikel satu paragraf"
                    value={articleForm.summary}
                    onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                    className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-zinc-400">Teks Cover Image (URL atau Upload di kanan) *</label>
                    <span className="text-[10px] font-mono text-zinc-650">Storage terintegrasi</span>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={articleForm.imageUrl}
                      onChange={(e) => setArticleForm({ ...articleForm, imageUrl: e.target.value })}
                      className="grow bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer border border-white/5 flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setArticleForm({ ...articleForm, imageUrl: url }))}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">Paragraf Konten Lengkap *</label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Tuliskan materi penuh di sini..."
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                    className="w-full bg-zinc-900/80 border border-white/5 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={articleForm.published}
                      onChange={(e) => setArticleForm({ ...articleForm, published: e.target.checked })}
                      className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="published" className="text-xs text-zinc-300 cursor-pointer">
                      Segera publikasikan tulisan ini (status: Terbuka untuk Umum)
                    </label>
                  </div>

                  <div className="flex gap-2">
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setArticleForm({ title: '', summary: '', content: '', imageUrl: '', category: 'Teknologi', author: 'Tegar Al Ghozali', published: true });
                        }}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-zinc-300 transition-colors"
                      >
                        Batal Redaksi
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitLoading}
                      className="px-5 py-2 cursor-pointer bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {isSubmitLoading ? 'Proses...' : editingId ? 'Simpan Redaksi' : 'Terbitkan Sekarang'}
                    </button>
                  </div>
                </div>

              </form>

              {/* Display existing lists to edit/delete */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider pl-1">Daftar Artikel di Basis Data</h4>
                
                {articles.length === 0 ? (
                  <p className="text-zinc-600 text-xs italic p-4 text-center border border-dashed border-white/5 rounded-xl">Chassis artikel masih kosong. Mulailah menulis di form atas atau klik Semaikan Data Contoh.</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {articles.map((art) => (
                      <div key={art.id} className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white line-clamp-1">{art.title}</p>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                            <span className="text-amber-500">{art.category}</span>
                            <span>•</span>
                            <span>{art.views || 0} views</span>
                            <span>•</span>
                            <span className={art.published ? 'text-green-500' : 'text-zinc-650'}>
                              {art.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleEditArticle(art)}
                            className="p-2 cursor-pointer bg-zinc-800 hover:bg-amber-500/10 text-zinc-400 hover:text-amber-400 border border-zinc-700/60 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-2 cursor-pointer bg-zinc-800 hover:bg-red-950/30 text-zinc-400 hover:text-red-400 border border-zinc-700/60 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* B. TAB PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-white/5">
                <h3 className="text-lg font-bold text-white font-display">
                  {editingId ? 'Edit Proyek' : 'Tambahkan Proyek Baru'}
                </h3>
                <p className="text-xs text-zinc-500 pt-1">Kelola album rekayasa software dan tech app fungsional.</p>
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">Nama Proyek *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama proyek"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">Kategori Proyek *</label>
                    <select
                      required
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Web App">Web App</option>
                      <option value="Productivity">Productivity</option>
                      <option value="Audio Tech">Audio Tech</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Hardware / IoT">Hardware / IoT</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">Penjelasan Singkat Proyek *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Berikan ringkasan fungsionalitas teknologi proyek..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full bg-zinc-900/80 border border-white/5 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">Link Demo Live (Opsional)</label>
                    <input
                      type="text"
                      placeholder="https://demo.mykonten.id/app"
                      value={projectForm.demoUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">Link Repo GitHub (Opsional)</label>
                    <input
                      type="text"
                      placeholder="https://github.com/tegar/repo"
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400">Tag Teknologi (Pisahkan dengan koma) *</label>
                  <input
                    type="text"
                    required
                    placeholder="React, Tailwind, Firestore, D3.js"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-zinc-400">Screenshot Cover (URL atau upload kanan)</label>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={projectForm.imageUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                      className="grow bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer border border-white/5 flex items-center gap-1.5 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setProjectForm({ ...projectForm, imageUrl: url }))}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="rounded border-zinc-750 bg-zinc-900 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="featured" className="text-xs text-zinc-300 cursor-pointer">
                      Sematkan sebagai proyek Utama / Unggulan (tampil lencana bintang)
                    </label>
                  </div>

                  <div className="flex gap-2">
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setProjectForm({ title: '', description: '', category: 'Web App', imageUrl: '', tags: [], demoUrl: '', githubUrl: '', featured: false });
                          setTagsInput('');
                        }}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-zinc-300"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitLoading}
                      className="px-5 py-2 cursor-pointer bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                      {isSubmitLoading ? 'Proses...' : editingId ? 'Simpan Redaksi' : 'Terbitkan Proyek'}
                    </button>
                  </div>
                </div>

              </form>

              {/* Display list existing */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider pl-1">Daftar Proyek di Basis Data</h4>
                
                {projects.length === 0 ? (
                  <p className="text-zinc-650 text-xs italic p-4 text-center">Belum ada proyek.</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {projects.map((proj) => (
                      <div key={proj.id} className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white line-clamp-1">{proj.title}</p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            Kategori: <span className="text-amber-500">{proj.category}</span> {proj.featured ? '• ★ Featured' : ''}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProject(proj)}
                            className="p-2 cursor-pointer bg-zinc-800 hover:bg-amber-500/10 text-zinc-400 hover:text-amber-400 border border-zinc-700/60 rounded-lg transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 cursor-pointer bg-zinc-800 hover:bg-red-950/30 text-zinc-400 hover:text-red-400 border border-zinc-700/60 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* C. TAB GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <div className="pb-4 border-b border-white/5">
                <h3 className="text-lg font-bold text-white font-display">
                  {editingId ? 'Edit Asset Galeri' : 'Unggah Foto Baru ke Galeri'}
                </h3>
                <p className="text-xs text-zinc-500 pt-1">Kelola feed visual estetik di portofolio Anda.</p>
              </div>

              <form onSubmit={handleGallerySubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono text-zinc-400">Media Image File (URL atau select file)</label>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={galleryForm.imageUrl}
                      onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                      className="grow bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <label className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold cursor-pointer border border-white/5 flex items-center gap-1.5 shrink-0 animate-pulse-none">
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, (url) => setGalleryForm({ ...galleryForm, imageUrl: url }))}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">Keterangan Foto / Dialog Caption *</label>
                    <input
                      type="text"
                      required
                      placeholder="Membasuh hati sewaktu merobek baris syntax..."
                      value={galleryForm.caption}
                      onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400">Kategori Visual *</label>
                    <select
                      required
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      className="w-full bg-zinc-900/80 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                    >
                      <option value="Workspace">Workspace</option>
                      <option value="Technology">Technology</option>
                      <option value="Coding">Coding</option>
                      <option value="Analytics">Analytics</option>
                      <option value="Coffee & Code">Coffee & Code</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setGalleryForm({ imageUrl: '', caption: '', category: 'Workspace' });
                      }}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-zinc-300"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitLoading}
                    className="px-5 py-2 cursor-pointer bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {isSubmitLoading ? 'Proses...' : editingId ? 'Simpan Edit' : 'Simpan Foto'}
                  </button>
                </div>

              </form>

              {/* Display list existing */}
              <div className="space-y-3 pt-6 border-t border-white/5">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider pl-1">Daftar Foto di Galeri</h4>
                
                {gallery.length === 0 ? (
                  <p className="text-zinc-650 text-xs italic p-4 text-center">Belum ada foto.</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {gallery.map((item) => (
                      <div key={item.id} className="p-4 bg-zinc-900/40 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.imageUrl} 
                            alt={item.caption} 
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg shrink-0 border border-white/10"
                          />
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-white line-clamp-1">{item.caption}</p>
                            <p className="text-[9px] text-zinc-550 font-mono">
                              Kategori: <span className="text-amber-500">{item.category}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditGallery(item)}
                            className="p-2 cursor-pointer bg-zinc-800 hover:bg-amber-500/10 text-zinc-400 hover:text-amber-400 border border-zinc-700/60 rounded-lg transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGallery(item.id)}
                            className="p-2 cursor-pointer bg-zinc-800 hover:bg-red-950/30 text-zinc-400 hover:text-red-400 border border-zinc-700/60 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
