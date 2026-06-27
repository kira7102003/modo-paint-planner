import { notFound } from 'next/navigation';
import { kitSchemes, getSchemeById } from '@/data/kit-schemes';
import { getPaintById } from '@/data/modo-paints';
import ColorZoneCard from '@/components/ColorZoneCard';
import WorkflowTimeline from '@/components/WorkflowTimeline';

export function generateStaticParams() {
  return kitSchemes.map(scheme => ({ id: scheme.id }));
}

export default async function KitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scheme = getSchemeById(id);
  if (!scheme) notFound();

  const clearPaint = getPaintById(scheme.clearCoat);

  const allPaintIds = new Set<string>();
  scheme.zones.forEach(zone => {
    if (typeof zone.baseColor === 'string') allPaintIds.add(zone.baseColor);
    else zone.baseColor.paintIds.forEach(id => allPaintIds.add(id));
    if (zone.shadowColor) {
      if (typeof zone.shadowColor === 'string') allPaintIds.add(zone.shadowColor);
      else zone.shadowColor.paintIds.forEach(id => allPaintIds.add(id));
    }
    if (zone.highlightColor) {
      if (typeof zone.highlightColor === 'string') allPaintIds.add(zone.highlightColor);
      else zone.highlightColor.paintIds.forEach(id => allPaintIds.add(id));
    }
  });

  const paintList = Array.from(allPaintIds)
    .map(id => getPaintById(id))
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <div>
        <a href="/" className="inline-flex items-center gap-1 text-xs text-sky-500 hover:text-sky-600 transition-colors font-semibold">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          返回機體列表
        </a>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-600 font-bold border border-sky-200">
            {scheme.grade}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-500 font-medium border border-slate-200">
            {scheme.brand === 'bandai' ? 'BANDAI' : 'KOTOBUKIYA'}
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-500 font-medium border border-violet-200">
            {scheme.series}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">{scheme.kitName}</h1>
        <p className="text-sm text-slate-400 font-mono mb-3">{scheme.kitNameEn}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{scheme.description}</p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-sky-400 to-cyan-500" />
          分色方案
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheme.zones.map((zone, i) => (
            <ColorZoneCard key={i} zone={zone} />
          ))}
        </div>
      </section>

      {scheme.workflow && scheme.workflow.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-orange-400 to-red-500" />
            上色順序 & 工法
          </h2>
          <WorkflowTimeline steps={scheme.workflow} />
        </section>
      )}

      {clearPaint && (
        <section className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-400 to-purple-500" />
            最終保護漆
          </h2>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl border-2 border-white shadow-lg ring-1 ring-slate-200/50"
              style={{ backgroundColor: clearPaint.hex }}
            />
            <div>
              <div className="text-sm text-slate-800 font-bold">{clearPaint.code} {clearPaint.nameZh}</div>
              <div className="text-[11px] text-slate-400">{clearPaint.nameEn}</div>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-300 to-orange-400" />
          施工建議
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-sm">
          {scheme.tips.map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[11px] font-black text-amber-500 bg-amber-50 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-200 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-green-500" />
          需要購買的顏料清單
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {paintList.map(paint => (
              <div key={paint!.id} className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-2.5 border border-slate-100 hover:border-sky-200 hover:bg-sky-50/50 transition-colors">
                <div
                  className="w-9 h-9 rounded-lg border-2 border-white shadow-md ring-1 ring-slate-200/50 flex-shrink-0"
                  style={{ backgroundColor: paint!.hex }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-mono font-bold text-slate-700 truncate">{paint!.code}</div>
                  <div className="text-[10px] text-slate-400 truncate">{paint!.nameZh}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">採購清單</span>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              共 {paintList.length} 瓶顏料
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
