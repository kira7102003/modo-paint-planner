'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ExtractedColor, extractColorsFromCanvas, loadImageToCanvas } from '@/lib/color-extract';
import { getContrastColor } from '@/lib/color-utils';
import { simulateColors } from '@/lib/color-simulate';
import WorkflowTimeline from './WorkflowTimeline';

interface AiColorMapping {
  zone: string;
  colorSystem: string;
  basePaint: { code: string; name: string; hex: string };
  shadowPaint: { code: string; name: string; hex: string };
  highlightPaint: { code: string; name: string; hex: string };
  finish: string;
}

interface AiWorkflowStep {
  step: number;
  phase: string;
  phaseEn: string;
  description: string;
  paints: string[];
  tools: string;
  dryTime: string;
}

interface AiTroubleshooting {
  problem: string;
  solution: string;
}

interface AiResult {
  styleScope: { title: string; features: string[] };
  colorMapping: AiColorMapping[];
  sharpnessTechniques: { edgeHighlight: string; panelLining: string; metallicBlocking: string };
  materialsChecklist: { paints: string[]; decalTools: string[]; clearCoats: string[] };
  workflow: AiWorkflowStep[];
  troubleshooting: AiTroubleshooting[];
  summary: string[];
  _provider?: string;
}

type AnalysisState = 'idle' | 'loading' | 'extracted' | 'ai-loading' | 'done' | 'error';

export default function ImageAnalyzer() {
  const [modelName, setModelName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [refPreviewSrc, setRefPreviewSrc] = useState<string | null>(null);
  const [state, setState] = useState<AnalysisState>('idle');
  const [error, setError] = useState('');
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [refColors, setRefColors] = useState<ExtractedColor[]>([]);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [paintType, setPaintType] = useState<'lacquer' | 'water'>('lacquer');
  const [applyMethod, setApplyMethod] = useState<'airbrush' | 'brush' | 'both'>('airbrush');
  const [customPrompt, setCustomPrompt] = useState('');
  const [primerConfig, setPrimerConfig] = useState<{ body: string; weapon: string; frame: string }>({ body: 'auto', weapon: 'auto', frame: 'auto' });
  const [savedPresets, setSavedPresets] = useState<{ name: string; prompt: string }[]>([]);
  const [showPresets, setShowPresets] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [primaryRatio, setPrimaryRatio] = useState(75);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('style_presets');
      if (saved) setSavedPresets(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const callAi = useCallback(async (extractedColorsInput?: ExtractedColor[], nameInput?: string) => {
    const colorsToUse = extractedColorsInput || colors;
    const nameToUse = nameInput || modelName;
    if (!colorsToUse.length) return;

    setState('ai-loading');
    setError('');
    setSimGenerated(false);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelName: nameToUse || '未命名模型',
          extractedColors: colorsToUse,
          refColors: refColors.length > 0 ? refColors : undefined,
          paintType,
          applyMethod,
          primerConfig,
          customPrompt: customPrompt.trim() || undefined,
          primaryColor: primaryColor || undefined,
          primaryRatio,
          geminiKey: localStorage.getItem('gemini_key') || '',
          groqKey: localStorage.getItem('groq_key') || '',
          deepseekKey: localStorage.getItem('deepseek_key') || '',
          openaiKey: localStorage.getItem('openai_key') || '',
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data.raw) {
        setError('AI 回傳格式無法解析，請重試');
        setState('error');
        return;
      }
      setAiResult(data);
      setState('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI 分析失敗');
      setState('error');
    }
  }, [colors, modelName, refColors, paintType, applyMethod, primerConfig, customPrompt, primaryColor, primaryRatio]);

  const analyze = useCallback(async (src: string) => {
    setState('loading');
    setError('');
    try {
      const canvas = await loadImageToCanvas(src);
      const extracted = extractColorsFromCanvas(canvas, 10);
      if (extracted.length === 0) {
        setError('無法從圖片中提取顏色，請換一張圖片試試');
        setState('error');
        return;
      }
      setColors(extracted);
      setState('extracted');
    } catch (e) {
      const msg = e instanceof Error ? e.message : '圖片分析失敗';
      setError(msg);
      setState('error');
    }
  }, []);

  const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const src = ev.target?.result as string;
      setRefPreviewSrc(src);
      try {
        const canvas = await loadImageToCanvas(src);
        const extracted = extractColorsFromCanvas(canvas, 10);
        setRefColors(extracted);
      } catch { /* ignore */ }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setPreviewSrc(src);
      analyze(src);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl.trim()) return;
    setPreviewSrc(imageUrl);
    setState('loading');
    setError('');

    try {
      const proxyRes = await fetch('/api/proxy-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl.trim() }),
      });
      const proxyData = await proxyRes.json();

      if (proxyData.dataUrl) {
        setPreviewSrc(proxyData.dataUrl);
        analyze(proxyData.dataUrl);
      } else if (proxyData.error) {
        setError(proxyData.error);
        setState('error');
      }
    } catch {
      analyze(imageUrl);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        setPreviewSrc(src);
        analyze(src);
      };
      reader.readAsDataURL(file);
    }
  };

  const processPastedImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setPreviewSrc(src);
      analyze(src);
    };
    reader.readAsDataURL(file);
  }, [analyze]);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;
        processPastedImage(file);
        return;
      }
    }
  };

  useEffect(() => {
    const globalPaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const items = e.clipboardData.items;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) processPastedImage(file);
          return;
        }
      }
    };
    window.addEventListener('paste', globalPaste);
    return () => window.removeEventListener('paste', globalPaste);
  }, [processPastedImage]);

  const reset = () => {
    setPreviewSrc(null);
    setRefPreviewSrc(null);
    setColors([]);
    setRefColors([]);
    setAiResult(null);
    setState('idle');
    setError('');
    setImageUrl('');
  };

  const workflowSteps = aiResult?.workflow?.map(w => ({
    order: w.step,
    phase: w.phase,
    phaseEn: w.phaseEn,
    icon: w.step <= 2 ? '🔧' : w.step <= 4 ? '🎯' : w.paints.length > 0 ? '🎨' : '✒️',
    description: w.description,
    paintIds: [],
    tool: w.tools,
    thinRatio: (w as unknown as Record<string, string>).thinRatio || undefined,
    dryTime: w.dryTime,
  })) ?? [];

  const simCanvasRef = useRef<HTMLCanvasElement>(null);
  const [simGenerated, setSimGenerated] = useState(false);
  const [simStrength, setSimStrength] = useState(70);

  const generateSimulation = useCallback(async () => {
    if (!previewSrc || !aiResult?.colorMapping?.length || !simCanvasRef.current) return;
    const canvas = simCanvasRef.current;
    const img = new Image();
    img.onload = () => {
      simulateColors(canvas, img, aiResult.colorMapping, colors, simStrength / 100);
      setSimGenerated(true);
    };
    img.src = previewSrc;
  }, [previewSrc, aiResult, colors, simStrength]);

  const downloadReport = useCallback(() => {
    if (!aiResult) return;
    const lines: string[] = [];
    lines.push(`MODO 超合繪配色分析報告`);
    lines.push(`模型：${modelName || '未命名'}`);
    lines.push(`漆料：${paintType === 'water' ? '水性漆' : '硝基漆'}`);
    lines.push(`上色：${applyMethod === 'brush' ? '筆塗' : applyMethod === 'both' ? '混合' : '噴漆'}`);
    lines.push(`日期：${new Date().toLocaleDateString('zh-TW')}`);
    lines.push(`AI：${aiResult._provider || 'unknown'}`);
    lines.push('');

    if (aiResult.styleScope) {
      lines.push(`═══ ${aiResult.styleScope.title} ═══`);
      aiResult.styleScope.features.forEach((f: string, i: number) => lines.push(`  ${i+1}. ${f}`));
      lines.push('');
    }

    if (aiResult.colorMapping) {
      lines.push('═══ MODO 配色表 ═══');
      aiResult.colorMapping.forEach((m: AiColorMapping, i: number) => {
        lines.push(`  #${i+1} ${m.zone} [${m.colorSystem}] (${m.finish})`);
        lines.push(`     底色: ${m.basePaint.code} ${m.basePaint.name} ${m.basePaint.hex}`);
        lines.push(`     陰影: ${m.shadowPaint.code} ${m.shadowPaint.name} ${m.shadowPaint.hex}`);
        lines.push(`     高光: ${m.highlightPaint.code} ${m.highlightPaint.name} ${m.highlightPaint.hex}`);
      });
      lines.push('');
    }

    if (aiResult.sharpnessTechniques) {
      lines.push('═══ MB 銳利化技法 ═══');
      lines.push(`  邊緣高光: ${aiResult.sharpnessTechniques.edgeHighlight}`);
      lines.push(`  滲線方式: ${aiResult.sharpnessTechniques.panelLining}`);
      lines.push(`  金屬分塊: ${aiResult.sharpnessTechniques.metallicBlocking}`);
      lines.push('');
    }

    if (aiResult.materialsChecklist) {
      lines.push('═══ 耗材清單 ═══');
      lines.push('  漆料:');
      aiResult.materialsChecklist.paints.forEach((p: string) => lines.push(`    • ${p}`));
      lines.push('  水貼工具:');
      aiResult.materialsChecklist.decalTools.forEach((t: string) => lines.push(`    • ${t}`));
      lines.push('  保護漆:');
      aiResult.materialsChecklist.clearCoats.forEach((c: string) => lines.push(`    • ${c}`));
      lines.push('');
    }

    if (aiResult.workflow) {
      lines.push('═══ 上色工序 ═══');
      aiResult.workflow.forEach((w: AiWorkflowStep) => {
        lines.push(`  Step ${w.step}: ${w.phase} (${w.phaseEn})`);
        lines.push(`    ${w.description}`);
        if (w.paints.length) lines.push(`    顏料: ${w.paints.join(', ')}`);
        if ((w as unknown as Record<string, unknown>).thinRatio) lines.push(`    稀釋: ${(w as unknown as Record<string, unknown>).thinRatio}`);
        lines.push(`    工具: ${w.tools}`);
        lines.push(`    乾燥: ${w.dryTime}`);
        lines.push('');
      });
    }

    if (aiResult.troubleshooting) {
      lines.push('═══ 除錯建議 ═══');
      aiResult.troubleshooting.forEach((t: AiTroubleshooting) => {
        lines.push(`  問題: ${t.problem}`);
        lines.push(`  解決: ${t.solution}`);
        lines.push('');
      });
    }

    if (aiResult.summary) {
      lines.push('═══ 心得總結 ═══');
      aiResult.summary.forEach((s: string, i: number) => lines.push(`  ${i+1}. ${s}`));
    }

    const text = lines.join('\n');
    const blob = new Blob(['﻿' + text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MODO配色_${modelName || '模型'}_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [aiResult, modelName, paintType, applyMethod]);

  const downloadSimImage = useCallback(() => {
    if (!simCanvasRef.current) return;
    const url = simCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `MODO配色模擬_${modelName || '模型'}_${new Date().toISOString().slice(0,10)}.png`;
    a.click();
  }, [modelName]);

  return (
    <div className="space-y-8" onPaste={handlePaste}>
      {/* Step 1: Input */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-sky-200">1</div>
          <h2 className="text-lg font-bold text-slate-800">輸入模型 & 上傳圖片</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">模型名稱</label>
            <input
              type="text"
              placeholder="例：MG 攻擊自由、HG 風靈鋼彈、壽屋 轟雷..."
              value={modelName}
              onChange={e => setModelName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>

          {/* Row 1: Paint Type + Apply Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">漆料類型</label>
              <div className="flex gap-1.5">
                <button onClick={() => setPaintType('lacquer')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all ${paintType === 'lacquer' ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                  硝基漆（油性）
                </button>
                <button onClick={() => setPaintType('water')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all ${paintType === 'water' ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                  水性漆
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">上色方式</label>
              <div className="flex gap-1.5">
                <button onClick={() => setApplyMethod('airbrush')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all ${applyMethod === 'airbrush' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                  噴漆
                </button>
                <button onClick={() => setApplyMethod('brush')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all ${applyMethod === 'brush' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                  筆塗
                </button>
                <button onClick={() => setApplyMethod('both')} className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold transition-all ${applyMethod === 'both' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                  混合
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Primer Config */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">底漆配置</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'body' as const, label: '主體裝甲', icon: '🛡️' },
                { key: 'weapon' as const, label: '武器/暗色件', icon: '🔫' },
                { key: 'frame' as const, label: '骨架/關節', icon: '⚙️' },
              ]).map(({ key, label, icon }) => (
                <div key={key} className="bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 mb-1.5">{icon} {label}</div>
                  <div className="flex flex-wrap gap-1">
                    {([
                      { id: 'auto', name: 'AI配', hex: '' },
                      { id: 'white', name: '白', hex: '#F0F0F0' },
                      { id: 'gray', name: '灰', hex: '#808080' },
                      { id: 'black', name: '黑', hex: '#222222' },
                      { id: 'pink', name: '粉紅', hex: '#E8A0B0' },
                      { id: 'purple', name: '紫', hex: '#6B4C8A' },
                    ]).map(p => (
                      <button key={p.id} onClick={() => setPrimerConfig(prev => ({ ...prev, [key]: p.id }))}
                        className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[9px] font-bold transition-all ${primerConfig[key] === p.id ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200'}`}>
                        {p.hex ? <div className="w-3 h-3 rounded-sm border border-white/50" style={{ backgroundColor: p.hex }} /> : <span>🤖</span>}
                        {p.name}
                      </button>
                    ))}
                    <input type="text" placeholder="自訂"
                      value={primerConfig[key].startsWith('custom:') ? primerConfig[key].slice(7) : ''}
                      onChange={e => setPrimerConfig(prev => ({ ...prev, [key]: e.target.value ? `custom:${e.target.value}` : 'auto' }))}
                      onClick={e => e.stopPropagation()}
                      className={`w-14 px-1.5 py-1 rounded-lg text-[9px] border transition-all ${primerConfig[key].startsWith('custom:') ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3: Primary Color */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">主色佔比設定</label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
              <input type="text" placeholder="主色名（如：白色、深藍）" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)}
                className="w-full sm:w-40 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100" />
              <div className="flex items-center gap-2 flex-1">
                <input type="range" min={10} max={90} value={primaryRatio} onChange={e => setPrimaryRatio(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-sky-500" />
                <span className="text-sm font-black text-sky-600 w-12 text-right">{primaryRatio}%</span>
              </div>
            </div>
          </div>

          {/* Custom Prompt with Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">風格定調 / 提示詞</label>
              <button onClick={() => setShowPresets(!showPresets)} className="text-[10px] font-bold text-sky-500 hover:text-sky-600 transition-colors">
                {showPresets ? '收起' : '選擇風格 ▾'}
              </button>
            </div>

            {showPresets && (
              <div className="mb-2 space-y-2">
                {/* Built-in presets */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: 'MB 超合金', prompt: `MB (Metal Build) 風格通用特徵：
1. 層次與深度：將每一個零件視為微型立體雕塑，透過陰影與高光的過渡，賦予裝甲深厚的體積感。
2. 質感對比：以半光澤裝甲為基調，與金屬骨架的冷硬、透明件的寶石光澤形成強烈觸感對比。
3. 光線邊緣：邊緣高光的處理如同切削出的金屬鋒芒，展現出精密製造的銳利感。
4. 深邃視效：透過金屬層疊加透明色的方式，創造出彷彿有「核心光源」或「內部折射」的深度視覺。
5. 刻線精度：極度細膩且精準的滲線，賦予模型極高的機械精密感。
6. 機械細節：凸顯關節結構的機械金屬色，使其在視覺上具備真實的機動動力特徵。
7. 立體分色：相鄰板塊間細膩的色階差異，讓視覺層次不僅停留在輪廓，更深入板塊細節。
8. 資訊密度：繁複的水貼標語，為整體設計增添嚴謹的軍事與科技規格感。
9. 光澤調度：透過不同部位的保護漆選擇，讓模型在不同角度的光線照射下產生多層次的反光律動。` },
                    { name: '寫實軍武', prompt: `寫實軍武風格通用特徵：
1. 消光為主：全機以消光/超級消光質感為基調，消除塑膠感。
2. 陰影加重：預陰影和漸層陰影都要比一般塗裝壓得更重，增加厚重感。
3. 舊化處理：適度加入掉漆（海綿沾銀色點壓邊緣）、鏽蝕（棕色+橘色漬洗）、煙燻（噴嘴周圍黑色漸層）。
4. 色調偏暗：所有顏色都往暗一階走，白色用灰白、紅色用暗紅、藍色用深藍。
5. 乾刷提亮：金屬部位和邊緣用乾刷技法做出磨損/使用痕跡。
6. 泥漬和雨痕：腳部和下半身可加入泥土色漬洗，做出野戰感。` },
                    { name: '動漫塗裝', prompt: `動漫/漫畫風塗裝通用特徵：
1. 高飽和度：所有顏色都用最鮮豔的版本，不要灰調。
2. 硬邊陰影：陰影不做漸層，用遮蓋膠帶做出明確的明暗分界線，模擬賽璐璐動畫風格。
3. 邊緣描線：裝甲邊緣用深色勾線加粗，強調輪廓。
4. 色塊分明：每個區域顏色界線清晰，不要混色過渡。
5. 亮面為主：用亮光或半光澤保護漆，保持鮮豔光澤。
6. 簡化陰影層：只需底色+陰影兩層，不需要複雜的多層漸變。` },
                    { name: '極簡素組感', prompt: `極簡素組強化風格通用特徵：
1. 保留成型色：不做大幅改色，只做局部補色和小區域分色。
2. 墨線為核心：重點全放在精確的墨線滲入，讓細節浮現。
3. 消光統一：全機噴消光透明漆統一質感，消除成型色的塑膠光澤。
4. 局部金屬：只在小面積零件（天線、噴嘴、武器細節）用金屬色點綴。
5. 補色修正：成型色不足的部位做局部補色，而非全面重塗。` },
                    { name: '電鍍超合金', prompt: `超合金電鍍風格通用特徵：
1. 電鍍基底：大面積使用電鍍漆（Super Chrome 系列），先噴究極黑底色再上電鍍漆。
2. 鏡面效果：追求玩具超合金般的鏡面金屬反射。
3. 色分電鍍：不同部位用不同電鍍色（銀角/金角/赤角/青角），做出彩色金屬分區。
4. 透明色疊加：電鍍銀上疊透明色做出有色金屬效果。
5. 亮光保護：電鍍漆面用亮光透明漆保護，不能用消光（會破壞電鍍效果）。
6. 分件噴塗：電鍍漆不能遮蓋修補，必須完全拆件分噴。` },
                    { name: '糖果漆車色', prompt: `糖果漆車色風格通用特徵：
1. 三層結構：亮黑底色 → 金屬銀中間層 → 透明色面漆，三層疊加做出糖果色深度。
2. 高光澤：全機亮光質感，追求汽車烤漆般的鏡面光澤。
3. 色彩深邃：透明色可疊加多層控制深淺，層數越多顏色越深邃。
4. 漸層效果：透明色可做從深到淺的漸層噴塗。
5. 研磨拋光：最終保護漆後可研磨拋光提升光澤度。
6. 表面要求極高：任何灰塵或顆粒都會被放大，打磨要做到位。` },
                  ].map(p => (
                    <button key={p.name} onClick={() => { setCustomPrompt(p.prompt); setShowPresets(false); }}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-600 border border-sky-200 hover:from-sky-100 hover:to-cyan-100 transition-all">
                      {p.name}
                    </button>
                  ))}
                </div>

                {/* User saved presets */}
                {savedPresets.length > 0 && (
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">我的風格</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {savedPresets.map((p, i) => (
                        <div key={i} className="flex items-center gap-0.5">
                          <button onClick={() => { setCustomPrompt(p.prompt); setShowPresets(false); }}
                            className="px-3 py-1.5 rounded-l-lg text-[10px] font-bold bg-violet-50 text-violet-600 border border-violet-200 hover:bg-violet-100 transition-all">
                            {p.name}
                          </button>
                          <button onClick={() => {
                            const updated = savedPresets.filter((_, j) => j !== i);
                            setSavedPresets(updated);
                            localStorage.setItem('style_presets', JSON.stringify(updated));
                          }}
                            className="px-1.5 py-1.5 rounded-r-lg text-[10px] font-bold bg-red-50 text-red-400 border border-red-200 hover:bg-red-100 transition-all">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <textarea
              placeholder="例：陰影色要偏紫色調、金屬部分用電鍍漆、整體偏暗色系、想做舊化效果..."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all resize-none"
            />

            {/* Save current prompt */}
            {customPrompt.trim() && (
              <div className="flex gap-2 mt-1.5">
                <input type="text" placeholder="風格名稱..." value={presetName} onChange={e => setPresetName(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-violet-400" />
                <button onClick={() => {
                  if (!presetName.trim() || !customPrompt.trim()) return;
                  const updated = [...savedPresets, { name: presetName.trim(), prompt: customPrompt.trim() }];
                  setSavedPresets(updated);
                  localStorage.setItem('style_presets', JSON.stringify(updated));
                  setPresetName('');
                }}
                  disabled={!presetName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-violet-500 text-white text-[10px] font-bold hover:bg-violet-600 disabled:opacity-40 transition-all">
                  儲存風格
                </button>
              </div>
            )}
          </div>

          {/* Two image areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">原始圖片（模型素組/官圖）</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/30 transition-all group"
            >
              {previewSrc ? (
                <div className="inline-flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
                  <div className="relative inline-block">
                    <img src={previewSrc} alt="預覽" className="max-h-64 rounded-xl shadow-lg object-contain" />
                    <button
                      onClick={reset}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white text-sm font-bold shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                      title="移除圖片"
                    >✕</button>
                  </div>
                  {(state === 'loading' || state === 'ai-loading') && (
                    <div className="flex items-center gap-2 text-sky-500">
                      <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium">
                        {state === 'loading' ? '抽色中...' : 'AI 分析 MB 風格中...'}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                    <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl hover:bg-sky-50 transition-colors w-full sm:w-auto">
                      <div className="text-3xl">📸</div>
                      <span className="text-xs font-bold text-slate-500">點擊上傳</span>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-slate-200" />
                    <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl hover:bg-violet-50 transition-colors cursor-default w-full sm:w-auto" onClick={e => e.stopPropagation()}>
                      <div className="text-3xl">📋</div>
                      <span className="text-xs font-bold text-violet-500">Ctrl+V 貼上截圖</span>
                    </div>
                    <div className="hidden sm:block w-px h-12 bg-slate-200" />
                    <div className="flex flex-col items-center gap-1.5 p-4 rounded-xl hover:bg-emerald-50 transition-colors w-full sm:w-auto">
                      <div className="text-3xl">🖱️</div>
                      <span className="text-xs font-bold text-slate-500">拖放圖片</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">截圖後直接 Ctrl+V 貼上，最快！</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>

          {/* Reference color image */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">改色參考圖（選填）</label>
            <div
              onClick={() => refFileInputRef.current?.click()}
              className="border-2 border-dashed border-violet-200 rounded-2xl p-4 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all min-h-[120px] flex items-center justify-center"
            >
              {refPreviewSrc ? (
                <div className="inline-flex flex-col items-center gap-2" onClick={e => e.stopPropagation()}>
                  <div className="relative inline-block">
                    <img src={refPreviewSrc} alt="改色參考" className="max-h-40 rounded-xl shadow-lg object-contain" />
                    <button onClick={() => { setRefPreviewSrc(null); setRefColors([]); }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg hover:bg-red-600 flex items-center justify-center">✕</button>
                  </div>
                  {refColors.length > 0 && (
                    <div className="flex gap-1">
                      {refColors.slice(0, 6).map((c, i) => (
                        <div key={i} className="w-5 h-5 rounded border-2 border-white shadow-sm" style={{ backgroundColor: c.hex }} title={`${c.label} ${c.hex}`} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-2xl">🎨</div>
                  <p className="text-[11px] text-violet-400 font-medium">上傳想要的配色參考圖</p>
                </div>
              )}
            </div>
            <input ref={refFileInputRef} type="file" accept="image/*" onChange={handleRefUpload} className="hidden" />
          </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="或貼上圖片網址..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <button onClick={handleUrlSubmit} disabled={!imageUrl.trim()} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-sm font-bold shadow-md shadow-sky-200 hover:shadow-lg disabled:opacity-40 disabled:shadow-none transition-all">
              分析
            </button>
          </div>

          {/* Action buttons */}
          {colors.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button onClick={() => callAi()} disabled={state === 'ai-loading'}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-violet-200 hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50">
                {state === 'ai-loading' ? '⏳ AI 分析中...' : aiResult ? '🔄 重新分析（套用新設定）' : '🚀 開始 AI 分析'}
              </button>
              <button onClick={reset} className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm font-bold hover:bg-slate-200 transition-all">
                重新開始
              </button>
            </div>
          )}
        </div>

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>}
      </div>

      {/* Step 2: Extracted Colors */}
      {colors.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-violet-200">2</div>
            <h2 className="text-lg font-bold text-slate-800">圖片抽色</h2>
            <span className="text-xs text-slate-400 ml-2">{colors.length} 個主色</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {colors.map((color, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-lg ring-1 ring-slate-200/50" style={{ backgroundColor: color.hex }} />
                <span className="text-[10px] font-bold text-slate-500">{color.label}</span>
                <span className="text-[9px] font-mono text-slate-400">{color.hex}</span>
                <span className="text-[9px] text-slate-300">{color.percentage}%</span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Simulation + Download Bar */}
      {aiResult && previewSrc && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-pink-200">🎭</div>
              <h2 className="text-lg font-bold text-slate-800">配色模擬預覽</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={generateSimulation} className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold shadow-md shadow-pink-200 hover:shadow-lg transition-all active:scale-95">
                {simGenerated ? '重新生成' : '生成模擬圖'}
              </button>
              {simGenerated && (
                <button onClick={downloadSimImage} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-all active:scale-95">
                  下載模擬圖
                </button>
              )}
              <button onClick={downloadReport} className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-xs font-bold shadow-md shadow-sky-200 hover:shadow-lg transition-all active:scale-95">
                下載分析報告
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">改色強度</span>
            <input type="range" min={10} max={100} value={simStrength} onChange={e => setSimStrength(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-pink-500" />
            <span className="text-xs font-black text-pink-600 w-10 text-right">{simStrength}%</span>
            <span className="text-[9px] text-slate-400">低=保留原色 高=完全替換</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">原圖</p>
              <img src={previewSrc} alt="原圖" className="w-full rounded-xl shadow-md object-contain bg-slate-50" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">配色模擬（HSL 色相替換）{!simGenerated && ' — 按「生成模擬圖」'}</p>
              <canvas ref={simCanvasRef} className={`w-full rounded-xl shadow-md ${simGenerated ? '' : 'bg-slate-50 min-h-[200px]'}`} />
              {!simGenerated && (
                <div className="flex items-center justify-center h-48 -mt-48 relative">
                  <button onClick={generateSimulation} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow-lg shadow-pink-200 hover:shadow-xl transition-all">
                    生成配色模擬圖
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Loading */}
      {state === 'ai-loading' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-10 shadow-sm flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-600">Claude AI 正在分析 MB 風格配色方案...</p>
          <p className="text-xs text-slate-400">包含風格定調、配色表、技法、工序、除錯建議</p>
        </div>
      )}

      {/* Step 3: AI MB Style Scope */}
      {aiResult?.styleScope && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-amber-200">3</div>
            <h2 className="text-lg font-bold text-slate-800">{aiResult.styleScope.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {aiResult.styleScope.features.map((f, i) => (
              <div key={i} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <span className="text-xs font-black text-amber-500">特徵 {i + 1}</span>
                <p className="text-sm text-slate-700 mt-1">{f}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Color Mapping */}
      {aiResult?.colorMapping && aiResult.colorMapping.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-200">4</div>
            <h2 className="text-lg font-bold text-slate-800">MODO 配色表（MB 風格）</h2>
          </div>
          <div className="space-y-4">
            {aiResult.colorMapping.map((m, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-black text-slate-400">#{i + 1}</span>
                  <span className="text-sm font-bold text-slate-700">{m.zone}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">{m.colorSystem}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200">{m.finish}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Primer */}
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl border-2 border-white shadow-md bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-sm">🎯</div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold">底漆</div>
                      <div className="text-[10px] text-slate-600 font-medium">{(m as unknown as Record<string, string>).primer || 'AI建議'}</div>
                    </div>
                  </div>
                  {/* Base / Shadow / Highlight */}
                  {[
                    { label: '底色', color: 'sky', paint: m.basePaint },
                    { label: '陰影', color: 'violet', paint: m.shadowPaint },
                    { label: '高光', color: 'amber', paint: m.highlightPaint },
                  ].map(({ label, color, paint }) => {
                    const mix = (paint as unknown as Record<string, string>).mix;
                    return (
                      <div key={label} className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl border-2 border-white shadow-md ring-2 ring-${color}-200`} style={{ backgroundColor: paint.hex }}>
                          <span className="text-[7px] font-black flex items-center justify-center h-full" style={{ color: getContrastColor(paint.hex) }}>{paint.code}</span>
                        </div>
                        <div>
                          <div className={`text-[10px] text-${color}-500 font-bold`}>{label}</div>
                          <div className="text-[10px] text-slate-600 font-medium">{paint.name}</div>
                          {mix && mix !== '純色' && <div className="text-[9px] text-slate-400 font-mono">{mix}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Shopping List */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-3">採購清單</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(aiResult.colorMapping.flatMap(m => [
                `${m.basePaint.code}|${m.basePaint.name}|${m.basePaint.hex}`,
                `${m.shadowPaint.code}|${m.shadowPaint.name}|${m.shadowPaint.hex}`,
                `${m.highlightPaint.code}|${m.highlightPaint.name}|${m.highlightPaint.hex}`,
              ]))).map(key => {
                const [code, name, hex] = key.split('|');
                return (
                  <div key={key} className="flex items-center gap-1.5 bg-white rounded-lg px-2.5 py-1.5 border border-slate-200 shadow-sm">
                    <div className="w-5 h-5 rounded border-2 border-white shadow-sm" style={{ backgroundColor: hex }} />
                    <span className="text-[10px] font-mono font-bold text-slate-600">{code}</span>
                    <span className="text-[10px] text-slate-400">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Sharpness Techniques */}
      {aiResult?.sharpnessTechniques && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-200">5</div>
            <h2 className="text-lg font-bold text-slate-800">MB 銳利化技法</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: '邊緣高光', content: aiResult.sharpnessTechniques.edgeHighlight, icon: '✨' },
              { title: '滲線方式', content: aiResult.sharpnessTechniques.panelLining, icon: '✒️' },
              { title: '金屬色分塊', content: aiResult.sharpnessTechniques.metallicBlocking, icon: '🥇' },
            ].map(t => (
              <div key={t.title} className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-xs font-bold text-emerald-600">{t.title}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{t.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 6: Materials Checklist */}
      {aiResult?.materialsChecklist && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-pink-200">6</div>
            <h2 className="text-lg font-bold text-slate-800">耗材清單</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: '漆料', items: aiResult.materialsChecklist.paints },
              { title: '水貼工具', items: aiResult.materialsChecklist.decalTools },
              { title: '保護漆', items: aiResult.materialsChecklist.clearCoats },
            ].map(group => (
              <div key={group.title} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{group.title}</h4>
                <ul className="space-y-1">
                  {group.items.map((item, j) => (
                    <li key={j} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-sky-400 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 7: Workflow */}
      {workflowSteps.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-200">7</div>
            <h2 className="text-lg font-bold text-slate-800">上色順序 & 工法</h2>
          </div>
          <WorkflowTimeline steps={workflowSteps} />
        </div>
      )}

      {/* Step 8: Troubleshooting */}
      {aiResult?.troubleshooting && aiResult.troubleshooting.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-200">8</div>
            <h2 className="text-lg font-bold text-slate-800">除錯 & 疑難排解</h2>
          </div>
          <div className="space-y-3">
            {aiResult.troubleshooting.map((t, i) => (
              <div key={i} className="bg-red-50 rounded-xl p-4 border border-red-100">
                <p className="text-xs font-bold text-red-600 mb-1">問題：{t.problem}</p>
                <p className="text-xs text-slate-600">解決：{t.solution}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 9: Summary */}
      {aiResult?.summary && aiResult.summary.length > 0 && (
        <div className="bg-gradient-to-r from-sky-50 via-cyan-50 to-violet-50 rounded-3xl border border-sky-200/50 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 via-cyan-500 to-violet-500 flex items-center justify-center text-white font-black text-sm shadow-md">✓</div>
            <h2 className="text-lg font-bold text-slate-800">MB 風格塗裝心得總結</h2>
          </div>
          <div className="space-y-3">
            {aiResult.summary.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[11px] font-black text-sky-500 bg-white w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 border border-sky-200 shadow-sm">{i + 1}</span>
                <p className="text-sm text-slate-700 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 10: Color Breakdown Verification */}
      {aiResult?.colorMapping && aiResult.colorMapping.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-200">📋</div>
            <h2 className="text-lg font-bold text-slate-800">各部位配色說明（驗證用）</h2>
          </div>

          <div className="space-y-4">
            {aiResult.colorMapping.map((m, i) => {
              const origColor = colors[i];
              return (
                <div key={i} className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xs font-black text-indigo-400 bg-indigo-50 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border border-indigo-200">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-800">{m.zone}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">{m.colorSystem}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200">{m.finish}</span>
                      </div>
                    </div>
                  </div>

                  {/* Color blocks + layered preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    {/* Left: individual colors */}
                    <div className="space-y-2">
                      {origColor && (
                        <div className="flex items-center gap-3 bg-white rounded-xl p-2.5 border border-slate-200">
                          <div className="w-12 h-12 rounded-xl border-2 border-white shadow-md" style={{ backgroundColor: origColor.hex }} />
                          <div>
                            <div className="text-[9px] text-slate-400 font-bold">圖片原色</div>
                            <div className="text-xs font-mono font-bold text-slate-600">{origColor.hex}</div>
                            <div className="text-[10px] text-slate-400">{origColor.label} {origColor.percentage}%</div>
                          </div>
                          <span className="text-slate-300 text-xl ml-auto">→</span>
                        </div>
                      )}
                      {(m as unknown as Record<string, string>).primer && (
                        <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200">
                          <div className="w-12 h-12 rounded-xl border-2 border-white shadow-md bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-lg">🎯</div>
                          <div>
                            <div className="text-[9px] text-slate-500 font-bold">底漆 Primer</div>
                            <div className="text-xs font-bold text-slate-700">{(m as unknown as Record<string, string>).primer}</div>
                          </div>
                        </div>
                      )}
                      {[
                        { label: '底色 Base', paint: m.basePaint, bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
                        { label: '陰影 Shadow', paint: m.shadowPaint, bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600' },
                        { label: '高光 Highlight', paint: m.highlightPaint, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600' },
                      ].map(({ label, paint, bg, border, text }) => {
                        const mix = (paint as unknown as Record<string, string>).mix;
                        return (
                          <div key={label} className={`flex items-center gap-3 ${bg} rounded-xl p-2.5 border ${border}`}>
                            <div className="w-12 h-12 rounded-xl border-2 border-white shadow-md" style={{ backgroundColor: paint.hex }} />
                            <div>
                              <div className={`text-[9px] ${text} font-bold`}>{label}</div>
                              <div className="text-xs font-bold text-slate-700">{paint.code} {paint.name}</div>
                              <div className="text-[10px] font-mono text-slate-400">{paint.hex}</div>
                              {mix && mix !== '純色' && (
                                <div className="text-[10px] font-bold text-orange-500 mt-0.5">調色：{mix}</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: layered preview */}
                    <div className="bg-white rounded-xl p-3 border border-slate-200 flex flex-col items-center justify-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">疊色效果預覽</span>
                      <div className="relative w-full max-w-[180px] aspect-square">
                        {/* Shadow layer */}
                        <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: m.shadowPaint.hex }} />
                        {/* Base layer */}
                        <div className="absolute inset-[15%] rounded-xl" style={{ backgroundColor: m.basePaint.hex }} />
                        {/* Highlight layer */}
                        <div className="absolute inset-[35%] rounded-lg" style={{ backgroundColor: m.highlightPaint.hex }} />
                        {/* Labels */}
                        <span className="absolute bottom-1 left-2 text-[8px] font-bold px-1 py-0.5 rounded bg-white/80 text-slate-500">{m.shadowPaint.code}</span>
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-black px-1.5 py-0.5 rounded bg-white/80 text-slate-700">{m.basePaint.code}</span>
                        <span className="absolute top-[38%] right-[38%] text-[8px] font-bold px-1 py-0.5 rounded bg-white/80 text-slate-500">{m.highlightPaint.code}</span>
                      </div>
                      <div className="flex gap-1 text-[8px] text-slate-400">
                        <span>外圈=陰影</span>
                        <span>中間=底色</span>
                        <span>內圈=高光</span>
                      </div>
                    </div>
                  </div>

                  {/* Text explanation */}
                  <div className="bg-white rounded-xl p-3 border border-slate-100">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800">【{m.zone}】</span>
                      使用 <span className="font-bold text-sky-600">{m.basePaint.code} {m.basePaint.name}</span> 作為底色
                      （{m.finish}），
                      陰影處噴 <span className="font-bold text-violet-600">{m.shadowPaint.code} {m.shadowPaint.name}</span> 加深暗面，
                      高光處用 <span className="font-bold text-amber-600">{m.highlightPaint.code} {m.highlightPaint.name}</span> 提亮凸面。
                      {m.colorSystem && <span className="text-slate-400">（{m.colorSystem}）</span>}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* All paints summary table */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-3">全部使用顏料一覽</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-slate-500 font-bold">部位</th>
                    <th className="text-left py-2 px-3 text-slate-400 font-bold">底漆</th>
                    <th className="text-left py-2 px-3 text-sky-500 font-bold">底色</th>
                    <th className="text-left py-2 px-3 text-violet-500 font-bold">陰影</th>
                    <th className="text-left py-2 px-3 text-amber-500 font-bold">高光</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-bold">質感</th>
                  </tr>
                </thead>
                <tbody>
                  {aiResult.colorMapping.map((m, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-sky-50/30">
                      <td className="py-2 px-3 font-bold text-slate-700">{m.zone}</td>
                      <td className="py-2 px-3 text-slate-400 text-[10px]">{(m as unknown as Record<string, string>).primer || '-'}</td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded border border-white shadow-sm" style={{ backgroundColor: m.basePaint.hex }} />
                          <span className="font-mono">{m.basePaint.code}</span>
                          <span className="text-slate-400">{m.basePaint.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded border border-white shadow-sm" style={{ backgroundColor: m.shadowPaint.hex }} />
                          <span className="font-mono">{m.shadowPaint.code}</span>
                          <span className="text-slate-400">{m.shadowPaint.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded border border-white shadow-sm" style={{ backgroundColor: m.highlightPaint.hex }} />
                          <span className="font-mono">{m.highlightPaint.code}</span>
                          <span className="text-slate-400">{m.highlightPaint.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-500">{m.finish}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
