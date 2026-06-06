import { useState } from 'react';
import { Menu, X, ShieldAlert, LogOut, Code } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
  onAdminClick: () => void;
}

export default function Navbar({ 
  activeSection, 
  onNavigate, 
  isAdminLoggedIn, 
  onLogout, 
  onAdminClick 
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'konten', label: 'Konten' },
    { id: 'proyek', label: 'Proyek' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'tentang', label: 'Tentang' },
    { id: 'kontak', label: 'Kontak' }
  ];

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-panel border-b border-white/5 flex items-center justify-between px-6 md:px-12">
      {/* Brand Logomark */}
      <div 
        onClick={() => handleNavClick('beranda')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-display font-bold text-black text-sm group-hover:scale-105 transition-all duration-300 shadow-md shadow-amber-500/10">
          MK
        </div>
        <span className="font-display font-semibold tracking-wider text-base text-white hover:text-amber-300 transition-colors duration-300">
          My<span className="text-amber-500">Konten</span>
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`cursor-pointer text-sm font-medium transition-all duration-300 relative py-1 hover:text-amber-300 ${
              activeSection === item.id 
                ? 'text-amber-400 font-semibold' 
                : 'text-zinc-400'
            }`}
          >
            {item.label}
            {activeSection === item.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Admin Quick Action Button */}
      <div className="hidden md:flex items-center gap-3">
        {isAdminLoggedIn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onAdminClick}
              className="px-3.5 py-1.5 cursor-pointer rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/30 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              Admin Panel
            </button>
            <button
              onClick={onLogout}
              className="p-1.5 cursor-pointer rounded-full bg-zinc-800 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-zinc-700 transition-all"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onAdminClick}
            className="px-4 py-1.5 cursor-pointer rounded-full bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:border-amber-500/40 text-xs font-semibold tracking-wide transition-all"
          >
            Admin / /login
          </button>
        )}
      </div>

      {/* Mobile Menu Actions */}
      <div className="flex items-center gap-2 md:hidden">
        {isAdminLoggedIn && (
          <button
            onClick={onAdminClick}
            className="p-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25"
          >
            <ShieldAlert className="w-4 h-4 animation-pulse" />
          </button>
        )}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white bg-zinc-900/50 rounded-lg border border-white/5 transition-all"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 glass-panel border-b border-white/10 md:hidden animate-fade-in flex flex-col p-6 space-y-4 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left text-base py-1.5 border-b border-white/5 transition-colors ${
                activeSection === item.id ? 'text-amber-400 font-semibold' : 'text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <div className="pt-4 flex items-center justify-between">
            {isAdminLoggedIn ? (
              <div className="flex w-full justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                <button
                  onClick={() => {
                    onAdminClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-semibold flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Dashboard Admin
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Selesai
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onAdminClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 text-sm font-medium hover:text-amber-400 transition-colors"
              >
                Masuk ke Panel Admin (/login)
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
