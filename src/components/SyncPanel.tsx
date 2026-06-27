'use client';

import { useState } from 'react';
import { modoPaints } from '@/data/modo-paints';
import { getContrastColor } from '@/lib/color-utils';

interface SyncedPaint {
  code: string;
  nameZh: string;
  nameEn: string;
  series: string;
  finish: string;
  hex: string;
}

interface SyncResult {
  paints: SyncedPaint[];
  sources: string[];
  totalFound: number;
}

type SyncState = 'idle' | 'fetching' | 'done' | 'error';

export default function SyncPanel() {
  const [state, setState] = useState<SyncState>('idle');
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState('');

  const existingCodes = new Set(modoPaints.map(p => p.code));

  const handleSync = async () => {
    setState('fetching');
    setError('');
    try {
      const res = await fetch('/api/sync-paints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geminiKey: localStorage.getItem('gemini_key') || '',
          groqKey: localStorage.getItem('groq_key') || '',
          deepseekKey: localStorage.getItem('deepseek_key') || '',
          openaiKey: localStorage.getItem('openai_key') || '',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.raw) throw new Error('AI 回傳格式無法解析');
      setResult(data);
      setState('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : '同步失敗');
      setState('error');
    }
  };

  const newPaints = result?.paints.filter(p => !existingCodes.has(p.code)) ?? [];
  const existingPaints = result?.paints.filter(p => existingCodes.has(p.code)) ?? [];

  const copyToClipboard = () => {
    const lines = newPaints.map(p => {
      const id = p.code.toLowerCase().replace('-', '').replace(/^0+/, '');
      return `  { id: '${id}', code: '${p.code}', nameZh: '${p.nameZh}', nameEn: '${p.nameEn}', hex: '${p.hex}', series: '${p.series}', finish: '${p.finish}', type: 'lacquer', opacity: 'opaque', volume: 30, tags: ['${p.nameZh}'] },`;
    });
    navigator.clipboard.writeText(lines.join('\n'));
  };

  return (
    <div className="space-y-6">
      {/* Sources & Action */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <h2 className="text-lg font-bold text-slate-800">同步來源</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { name: 'YYZ 模型工作室', url: 'https://yyz.easy.co/collections/modo' },
            { name: 'HRS 模型', url: 'https://www.hiroshisanmodel.com/collections/摩多製造所總部-modocolors' },
            { name: 'Chico Hobby', url: 'https://chicohobby.com/zh/collections/modo-paints' },
            { name: 'MR.JOE HOBBY', url: 'https://store.mrjoe.com.tw/category/60122' },
          ].map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
              className="bg-slate-50 rounded-xl p-3 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-center group">
              <div className="text-xs font-bold text-slate-600 group-hover:text-emerald-600">{s.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">點擊開啟官網</div>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSync}
            disabled={state === 'fetching'}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 disabled:opacity-50 disabled:shadow-none transition-all text-sm"
          >
            {state === 'fetching' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                正在抓取 & AI 解析中...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                一鍵同步最新色號
              </>
            )}
          </button>

          <div className="text-xs text-slate-400">
            目前資料庫：<span className="font-bold text-slate-600">{modoPaints.length}</span> 個色號
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm text-center">
              <div className="text-2xl font-black text-slate-700">{result.totalFound}</div>
              <div className="text-xs text-slate-400 mt-1">網站找到色號</div>
            </div>
            <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm text-center">
              <div className="text-2xl font-black text-emerald-600">{newPaints.length}</div>
              <div className="text-xs text-emerald-500 mt-1">新色號</div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm text-center">
              <div className="text-2xl font-black text-slate-400">{existingPaints.length}</div>
              <div className="text-xs text-slate-400 mt-1">已有色號</div>
            </div>
          </div>

          {/* New Paints */}
          {newPaints.length > 0 && (
            <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <h2 className="text-lg font-bold text-slate-800">發現 {newPaints.length} 個新色號</h2>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  複製程式碼
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {newPaints.map(paint => (
                  <div key={paint.code} className="rounded-2xl overflow-hidden bg-white border-2 border-emerald-100 hover:border-emerald-300 transition-all">
                    <div className="h-16 flex items-end p-2.5" style={{ backgroundColor: paint.hex }}>
                      <span className="text-xs font-mono font-black drop-shadow-sm" style={{ color: getContrastColor(paint.hex) }}>
                        {paint.code}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <div className="text-xs font-bold text-slate-700 truncate">{paint.nameZh}</div>
                      <div className="text-[10px] text-slate-400 truncate">{paint.nameEn}</div>
                      <div className="flex gap-1 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-bold border border-emerald-100">NEW</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 font-mono border border-slate-100">{paint.hex}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-xs text-emerald-700">
                  <span className="font-bold">如何加入資料庫：</span>
                  點「複製程式碼」，然後貼到 <code className="bg-white px-1.5 py-0.5 rounded text-[10px] font-mono">src/data/modo-paints.ts</code> 的 <code className="bg-white px-1.5 py-0.5 rounded text-[10px] font-mono">modoPaints</code> 陣列末尾即可。
                </p>
              </div>
            </div>
          )}

          {newPaints.length === 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-sm font-bold text-slate-700">資料庫已是最新！</p>
              <p className="text-xs text-slate-400 mt-1">所有網站上的色號都已收錄</p>
            </div>
          )}

          {/* Existing (collapsed) */}
          {existingPaints.length > 0 && (
            <details className="bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <summary className="p-5 cursor-pointer text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                已收錄的 {existingPaints.length} 個色號（點擊展開）
              </summary>
              <div className="px-5 pb-5">
                <div className="flex flex-wrap gap-2">
                  {existingPaints.map(paint => (
                    <div key={paint.code} className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100">
                      <div className="w-4 h-4 rounded border border-white shadow-sm" style={{ backgroundColor: paint.hex }} />
                      <span className="text-[10px] font-mono font-bold text-slate-500">{paint.code}</span>
                      <span className="text-[10px] text-slate-400">{paint.nameZh}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          )}

          {/* Sources */}
          {result.sources && (
            <div className="text-xs text-slate-400 text-center">
              資料來源：{result.sources.join('、')}
            </div>
          )}
        </>
      )}
    </div>
  );
}
