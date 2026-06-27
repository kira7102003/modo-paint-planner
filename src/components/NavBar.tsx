'use client';

import ApiKeySettings from './ApiKeySettings';

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 via-cyan-400 to-violet-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-sky-300/30 group-hover:shadow-sky-400/50 transition-shadow">
              M
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors tracking-tight">
                MODO 超合繪
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">Paint Planner</span>
            </div>
          </a>
          <div className="flex items-center gap-0.5">
            <a href="/" className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all">
              圖片分析
            </a>
            <a href="/paints" className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all">
              顏料資料庫
            </a>
            <a href="/mixer" className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-violet-600 hover:bg-violet-50 transition-all">
              調色模擬
            </a>
            <a href="/sync" className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-sm shadow-emerald-200 transition-all">
              更新色號
            </a>
            <div className="ml-2">
              <ApiKeySettings />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
