'use client';

import { useState, useEffect, useRef } from 'react';

interface KeyState {
  key: string;
  verified: boolean;
  verifying: boolean;
  error: string;
}

const PROVIDERS = [
  { id: 'gemini', label: 'Google Gemini', badge: '優先', badgeColor: 'blue', icon: 'G', iconBg: 'bg-blue-500', placeholder: 'AIza... 金鑰', keyUrl: 'https://aistudio.google.com/apikey', keyLabel: '取得 Gemini Key（免費）', desc: '2.0 Flash Lite・免費・速度快' },
  { id: 'groq', label: 'Groq (Llama)', badge: '推薦', badgeColor: 'orange', icon: '⚡', iconBg: 'bg-orange-500', placeholder: 'gsk_... 金鑰', keyUrl: 'https://console.groq.com/keys', keyLabel: '取得 Groq Key（免費）', desc: 'Llama 3.1 8B・免費・131K TPM額度' },
  { id: 'deepseek', label: 'DeepSeek', badge: '便宜', badgeColor: 'green', icon: 'D', iconBg: 'bg-teal-600', placeholder: 'sk-... 金鑰', keyUrl: 'https://platform.deepseek.com/api_keys', keyLabel: '取得 DeepSeek Key', desc: 'V3・極強推理・$0.27/百萬token' },
  { id: 'openai', label: 'ChatGPT (OpenAI)', badge: '備用', badgeColor: 'slate', icon: 'C', iconBg: 'bg-slate-800', placeholder: 'sk-... 金鑰', keyUrl: 'https://platform.openai.com/api-keys', keyLabel: '取得 OpenAI Key（付費）', desc: 'GPT-4o-mini・需綁卡' },
] as const;

type ProviderId = typeof PROVIDERS[number]['id'];

const defaultState: KeyState = { key: '', verified: false, verifying: false, error: '' };

export default function ApiKeySettings() {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<Record<ProviderId, KeyState>>({
    gemini: { ...defaultState }, groq: { ...defaultState }, deepseek: { ...defaultState }, openai: { ...defaultState },
  });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loaded: Record<string, KeyState> = {};
    for (const p of PROVIDERS) {
      loaded[p.id] = {
        key: localStorage.getItem(`${p.id}_key`) || '',
        verified: localStorage.getItem(`${p.id}_verified`) === 'true',
        verifying: false, error: '',
      };
    }
    setKeys(loaded as Record<ProviderId, KeyState>);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const saveKey = (id: ProviderId, key: string) => {
    localStorage.setItem(`${id}_key`, key);
    localStorage.setItem(`${id}_verified`, 'false');
    setKeys(prev => ({ ...prev, [id]: { ...prev[id], key, verified: false, error: '' } }));
  };

  const verifyKey = async (id: ProviderId) => {
    if (!keys[id].key.trim()) return;
    setKeys(prev => ({ ...prev, [id]: { ...prev[id], verifying: true, error: '' } }));
    try {
      const res = await fetch('/api/verify-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: id, key: keys[id].key.trim() }),
      });
      const data = await res.json();
      localStorage.setItem(`${id}_verified`, data.valid ? 'true' : 'false');
      setKeys(prev => ({ ...prev, [id]: { ...prev[id], verified: data.valid, verifying: false, error: data.valid ? '' : (data.error || '金鑰無效') } }));
    } catch {
      setKeys(prev => ({ ...prev, [id]: { ...prev[id], verifying: false, error: '驗證請求失敗' } }));
    }
  };

  const hasAnyKey = Object.values(keys).some(k => k.verified);
  const verifiedCount = Object.values(keys).filter(k => k.verified).length;

  const badgeColors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-500 border-blue-100',
    orange: 'bg-orange-50 text-orange-500 border-orange-100',
    green: 'bg-emerald-50 text-emerald-500 border-emerald-100',
    slate: 'bg-slate-100 text-slate-400 border-slate-200',
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 h-8 px-2.5 rounded-lg transition-all ${
          hasAnyKey
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
            : 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 animate-pulse'
        }`}
        title="AI 金鑰設定"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        {hasAnyKey && <span className="text-[9px] font-black">{verifiedCount}</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-[400px] bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 p-5 z-50 max-h-[80vh] overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-800 mb-0.5">AI 金鑰設定</h3>
          <p className="text-[10px] text-slate-400 mb-4">依序嘗試：Gemini → Groq → DeepSeek → ChatGPT</p>

          {PROVIDERS.map((p, i) => (
            <div key={p.id} className={`${i > 0 ? 'mt-4 pt-4 border-t border-slate-100' : ''}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-5 h-5 rounded-md ${p.iconBg} flex items-center justify-center text-white text-[9px] font-black`}>{p.icon}</div>
                <span className="text-xs font-bold text-slate-700">{p.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${badgeColors[p.badgeColor]}`}>{p.badge}</span>
                {keys[p.id]?.verified && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">✓ 已驗證</span>}
              </div>
              <p className="text-[9px] text-slate-400 mb-1.5">{p.desc}</p>
              <div className="flex gap-1.5">
                <input
                  type="password"
                  placeholder={p.placeholder}
                  value={keys[p.id]?.key || ''}
                  onChange={e => saveKey(p.id, e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100 font-mono"
                />
                <button
                  onClick={() => verifyKey(p.id)}
                  disabled={!keys[p.id]?.key?.trim() || keys[p.id]?.verifying}
                  className={`px-3 py-2 rounded-lg text-white text-[10px] font-bold disabled:opacity-40 transition-all whitespace-nowrap ${p.iconBg} hover:opacity-90`}
                >
                  {keys[p.id]?.verifying ? '...' : '驗證'}
                </button>
              </div>
              {keys[p.id]?.error && <p className="text-[10px] text-red-500 mt-1">{keys[p.id].error}</p>}
              <a href={p.keyUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-sky-400 hover:text-sky-600 mt-1 inline-block">
                → {p.keyLabel}
              </a>
            </div>
          ))}

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              金鑰只存在你的瀏覽器，不會上傳到任何伺服器
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
