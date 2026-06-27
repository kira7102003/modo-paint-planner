'use client';

import { useState } from 'react';
import { modoPaints, ModoPaint } from '@/data/modo-paints';
import { mixMultipleColors, getContrastColor } from '@/lib/color-utils';

interface MixEntry {
  paintId: string;
  ratio: number;
}

export default function ColorMixer() {
  const [entries, setEntries] = useState<MixEntry[]>([
    { paintId: 'm003', ratio: 7 },
    { paintId: 'm002', ratio: 3 },
  ]);
  const [search, setSearch] = useState('');
  const [showPicker, setShowPicker] = useState<number | null>(null);

  const paintables = modoPaints.filter(p => p.opacity !== 'transparent' && p.series !== 'D');

  const filteredPaints = paintables.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.code.toLowerCase().includes(q) || p.nameZh.includes(q) || p.nameEn.toLowerCase().includes(q);
  });

  const selectedPaints = entries
    .map(e => ({ ...e, paint: paintables.find(p => p.id === e.paintId) }))
    .filter((e): e is MixEntry & { paint: ModoPaint } => e.paint !== undefined);

  const totalRatio = selectedPaints.reduce((sum, e) => sum + e.ratio, 0);
  const mixedHex = selectedPaints.length > 0
    ? mixMultipleColors(
        selectedPaints.map(e => e.paint.hex),
        selectedPaints.map(e => e.ratio)
      )
    : '#808080';

  const addEntry = (paintId: string) => {
    setEntries([...entries, { paintId, ratio: 1 }]);
    setShowPicker(null);
    setSearch('');
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateRatio = (index: number, ratio: number) => {
    setEntries(entries.map((e, i) => i === index ? { ...e, ratio: Math.max(0.5, ratio) } : e));
  };

  const selectPaint = (index: number, paintId: string) => {
    setEntries(entries.map((e, i) => i === index ? { ...e, paintId } : e));
    setShowPicker(null);
    setSearch('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-400 to-purple-500" />
          選擇顏料 & 比例
        </h3>

        {entries.map((entry, i) => {
          const paint = paintables.find(p => p.id === entry.paintId);
          return (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setShowPicker(showPicker === i ? null : i); setSearch(''); }}
                  className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 hover:bg-sky-50 hover:border-sky-200 transition-colors flex-1 min-w-0 border border-slate-200"
                >
                  {paint && (
                    <div
                      className="w-7 h-7 rounded-lg border-2 border-white shadow-md ring-1 ring-slate-200/50 flex-shrink-0"
                      style={{ backgroundColor: paint.hex }}
                    />
                  )}
                  <span className="text-xs text-slate-700 font-medium truncate">
                    {paint ? `${paint.code} ${paint.nameZh}` : '選擇顏料'}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => updateRatio(i, entry.ratio - 0.5)}
                    className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-sky-100 hover:text-sky-600 text-sm flex items-center justify-center font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-mono font-bold text-slate-700 w-8 text-center">{entry.ratio}</span>
                  <button
                    onClick={() => updateRatio(i, entry.ratio + 0.5)}
                    className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 hover:bg-sky-100 hover:text-sky-600 text-sm flex items-center justify-center font-bold transition-colors"
                  >
                    +
                  </button>
                  <span className="text-[10px] text-slate-400 font-bold w-10 text-right">
                    {totalRatio > 0 ? Math.round(entry.ratio / totalRatio * 100) : 0}%
                  </span>
                </div>

                {entries.length > 1 && (
                  <button
                    onClick={() => removeEntry(i)}
                    className="text-slate-300 hover:text-red-400 text-sm transition-colors font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {showPicker === i && (
                <div className="mt-3 space-y-2">
                  <input
                    type="text"
                    placeholder="搜尋色號或名稱..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    autoFocus
                  />
                  <div className="max-h-48 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-1">
                    {filteredPaints.slice(0, 48).map(p => (
                      <button
                        key={p.id}
                        onClick={() => selectPaint(i, p.id)}
                        className="flex flex-col items-center gap-0.5 p-1.5 rounded-xl hover:bg-sky-50 transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-white shadow-md ring-1 ring-slate-200/50"
                          style={{ backgroundColor: p.hex }}
                        />
                        <span className="text-[8px] text-slate-400 font-bold truncate w-full text-center">{p.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => addEntry('m001')}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-bold hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50/50 transition-all"
        >
          + 增加顏料
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-sky-400 to-cyan-500" />
          混色結果
        </h3>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 flex flex-col items-center gap-5 shadow-sm">
          <div className="glow-border rounded-3xl">
            <div
              className="w-44 h-44 rounded-3xl shadow-2xl"
              style={{ backgroundColor: mixedHex }}
            />
          </div>
          <div className="text-center">
            <div className="text-xl font-mono font-black text-slate-700">{mixedHex.toUpperCase()}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">混色結果預覽</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">比例條</h4>
          <div className="flex rounded-xl overflow-hidden h-9 shadow-inner ring-1 ring-slate-200/50">
            {selectedPaints.map((entry, i) => (
              <div
                key={i}
                className="flex items-center justify-center transition-all"
                style={{
                  backgroundColor: entry.paint.hex,
                  width: `${(entry.ratio / totalRatio) * 100}%`,
                }}
              >
                <span
                  className="text-[9px] font-mono font-black drop-shadow-sm"
                  style={{ color: getContrastColor(entry.paint.hex) }}
                >
                  {entry.paint.code}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-2.5 shadow-sm">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">配方</h4>
          {selectedPaints.map((entry, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-5 h-5 rounded-md border-2 border-white shadow-sm ring-1 ring-slate-200/50"
                  style={{ backgroundColor: entry.paint.hex }}
                />
                <span className="text-slate-700 font-medium">{entry.paint.code} {entry.paint.nameZh}</span>
              </div>
              <span className="text-slate-500 font-mono font-bold">
                {entry.ratio} ({Math.round(entry.ratio / totalRatio * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
