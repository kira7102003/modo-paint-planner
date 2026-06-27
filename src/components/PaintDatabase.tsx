'use client';

import { useState } from 'react';
import { modoPaints, seriesInfo, PaintSeries } from '@/data/modo-paints';
import { getContrastColor } from '@/lib/color-utils';

const seriesOrder: PaintSeries[] = ['M', 'MX', 'T', 'MK', 'D'];

export default function PaintDatabase() {
  const [search, setSearch] = useState('');
  const [activeSeries, setActiveSeries] = useState<PaintSeries | 'ALL'>('ALL');

  const filtered = modoPaints
    .filter(p => p.series !== 'D' || activeSeries === 'D' || activeSeries === 'ALL')
    .filter(p => {
      if (activeSeries !== 'ALL' && p.series !== activeSeries) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        p.code.toLowerCase().includes(q) ||
        p.nameZh.includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜尋色號、名稱、標籤..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveSeries('ALL')}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${activeSeries === 'ALL' ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sky-200' : 'bg-white text-slate-500 border border-slate-200 hover:border-sky-300 hover:text-sky-600'}`}
        >
          全部
        </button>
        {seriesOrder.map(s => (
          <button
            key={s}
            onClick={() => setActiveSeries(s)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${activeSeries === s ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sky-200' : 'bg-white text-slate-500 border border-slate-200 hover:border-sky-300 hover:text-sky-600'}`}
          >
            {seriesInfo[s].nameZh}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400 font-medium">{filtered.length} 個顏色</div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map(paint => {
          const textColor = getContrastColor(paint.hex);
          const isTransparent = paint.opacity === 'transparent';
          return (
            <div
              key={paint.id}
              className="rounded-2xl overflow-hidden bg-white border border-slate-200/80 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-50 transition-all hover:scale-[1.03] cursor-pointer group"
            >
              <div
                className={`h-20 flex items-end p-2.5 relative ${isTransparent ? 'bg-[repeating-conic-gradient(#e8e8e8_0%_25%,#fff_0%_50%)] bg-[length:10px_10px]' : ''}`}
                style={isTransparent ? {} : { backgroundColor: paint.hex }}
              >
                {isTransparent && (
                  <div className="absolute inset-0" style={{ backgroundColor: paint.hex, opacity: 0.3 }} />
                )}
                <span
                  className="text-xs font-mono font-black relative z-10 drop-shadow-sm"
                  style={{ color: isTransparent ? '#333' : textColor }}
                >
                  {paint.code}
                </span>
              </div>
              <div className="p-2.5">
                <div className="text-xs font-bold text-slate-700 truncate">{paint.nameZh}</div>
                <div className="text-[10px] text-slate-400 truncate">{paint.nameEn}</div>
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-500 font-medium border border-slate-100">
                    {paint.finish === 'gloss' ? '亮光' :
                     paint.finish === 'matte' ? '消光' :
                     paint.finish === 'semi-gloss' ? '半光澤' :
                     paint.finish === 'metallic' ? '金屬' :
                     paint.finish === 'pearl' ? '珠光' :
                     paint.finish === 'fluorescent' ? '螢光' :
                     paint.finish === 'chrome' ? '電鍍' :
                     paint.finish === 'chameleon' ? '偏光' : paint.finish}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 font-mono border border-slate-100">
                    {paint.hex}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
