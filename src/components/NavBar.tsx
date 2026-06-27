'use client';

import { useState } from 'react';
import ApiKeySettings from './ApiKeySettings';

const NAV_LINKS = [
  { href: '/', label: '圖片分析', icon: '📸' },
  { href: '/paints', label: '顏料資料庫', icon: '🎨' },
  { href: '/mixer', label: '調色模擬', icon: '🧪' },
  { href: '/sync', label: '更新色號', icon: '🔄' },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-sky-400 via-cyan-400 to-violet-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-sky-300/30">
              M
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-slate-800 tracking-tight">MODO 超合繪</span>
              <span className="text-[10px] text-slate-400 block leading-tight">Paint Planner</span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${l.href === '/sync' ? 'text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-sm' : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'}`}>
                {l.label}
              </a>
            ))}
            <div className="ml-2">
              <ApiKeySettings />
            </div>
          </div>

          {/* Mobile: key + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ApiKeySettings />
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-sky-100 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all active:bg-sky-100">
                <span className="text-lg">{l.icon}</span>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
