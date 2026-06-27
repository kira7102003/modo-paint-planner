'use client';

import { ColorZone, MixRecipe } from '@/data/kit-schemes';
import { getPaintById } from '@/data/modo-paints';
import PaintSwatch from './PaintSwatch';
import MixPreview from './MixPreview';

function ColorDisplay({ label, color, labelColor }: {
  label: string;
  color: string | MixRecipe;
  labelColor: string;
}) {
  if (typeof color === 'string') {
    const paint = getPaintById(color);
    if (!paint) return null;
    return (
      <div className="flex flex-col items-center gap-1">
        <span className={`text-[10px] font-bold tracking-wide uppercase ${labelColor}`}>{label}</span>
        <PaintSwatch paint={paint} size="md" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1">
      <span className={`text-[10px] font-bold tracking-wide uppercase ${labelColor}`}>{label}</span>
      <MixPreview recipe={color} />
    </div>
  );
}

export default function ColorZoneCard({ zone }: { zone: ColorZone }) {
  const hasSimpleBase = typeof zone.baseColor === 'string';
  const basePaint = hasSimpleBase ? getPaintById(zone.baseColor as string) : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:shadow-lg hover:shadow-sky-50 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{zone.zone}</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">{zone.description}</p>
        </div>
        {basePaint && (
          <div
            className="w-9 h-9 rounded-xl border-2 border-white shadow-lg ring-1 ring-slate-200/50 flex-shrink-0"
            style={{ backgroundColor: basePaint.hex }}
          />
        )}
      </div>

      <div className="grid gap-3">
        <ColorDisplay label="底色 Base" color={zone.baseColor} labelColor="text-sky-500" />
        {zone.shadowColor && (
          <ColorDisplay label="陰影 Shadow" color={zone.shadowColor} labelColor="text-violet-500" />
        )}
        {zone.highlightColor && (
          <ColorDisplay label="高光 Highlight" color={zone.highlightColor} labelColor="text-amber-500" />
        )}
      </div>

      <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-3 border border-sky-100">
        <p className="text-[11px] text-slate-600 leading-relaxed">
          <span className="text-sky-600 font-bold">噴塗技法：</span>
          {zone.technique}
        </p>
      </div>
    </div>
  );
}
