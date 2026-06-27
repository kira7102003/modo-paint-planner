'use client';

import Link from 'next/link';
import { ChogokinScheme } from '@/data/kit-schemes';
import { getPaintById } from '@/data/modo-paints';

export default function KitCard({ scheme }: { scheme: ChogokinScheme }) {
  const mainColors = scheme.zones
    .map(z => typeof z.baseColor === 'string' ? getPaintById(z.baseColor) : null)
    .filter(Boolean)
    .slice(0, 5);

  return (
    <Link href={`/kits/${scheme.id}`}>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100/50 transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 font-bold border border-sky-200">
                {scheme.grade}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-500 font-medium border border-slate-200">
                {scheme.brand === 'bandai' ? 'BANDAI' : 'KOTOBUKIYA'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
              {scheme.kitName}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">{scheme.kitNameEn}</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{scheme.description}</p>

        <div className="flex items-center gap-1.5">
          {mainColors.map(paint => (
            <div
              key={paint!.id}
              className="w-7 h-7 rounded-lg border-2 border-white shadow-md ring-1 ring-slate-200/50"
              style={{ backgroundColor: paint!.hex }}
              title={paint!.nameZh}
            />
          ))}
          <span className="text-[10px] text-slate-400 font-medium ml-2">{scheme.zones.length} 個分色區域</span>
        </div>
      </div>
    </Link>
  );
}
