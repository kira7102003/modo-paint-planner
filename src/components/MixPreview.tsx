'use client';

import { MixRecipe } from '@/data/kit-schemes';
import { getPaintById } from '@/data/modo-paints';
import { mixMultipleColors } from '@/lib/color-utils';
import PaintSwatch from './PaintSwatch';

export default function MixPreview({ recipe }: { recipe: MixRecipe }) {
  const paints = recipe.paintIds.map(id => getPaintById(id)).filter(Boolean);
  if (paints.length === 0) return null;

  const hexColors = paints.map(p => p!.hex);
  const mixedHex = mixMultipleColors(hexColors, recipe.ratios);
  const total = recipe.ratios.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
      <div className="flex items-center gap-2 flex-wrap">
        {paints.map((paint, i) => (
          <div key={paint!.id} className="flex items-center gap-1">
            <PaintSwatch paint={paint!} size="sm" showCode={false} />
            <div className="text-[10px]">
              <div className="text-slate-700 font-mono font-bold">{paint!.code}</div>
              <div className="text-slate-400">{Math.round(recipe.ratios[i] / total * 100)}%</div>
            </div>
            {i < paints.length - 1 && <span className="text-slate-300 mx-1 font-bold">+</span>}
          </div>
        ))}
        <span className="text-slate-300 mx-2 text-lg">=</span>
        <div className="flex items-center gap-2">
          <div
            className="w-12 h-12 rounded-xl shadow-lg border-2 border-white ring-1 ring-slate-200/50"
            style={{ backgroundColor: mixedHex }}
          />
          <div className="text-[10px]">
            <div className="text-slate-700 font-mono font-bold">{mixedHex}</div>
            <div className="text-slate-400">混色結果</div>
          </div>
        </div>
      </div>
      {recipe.note && (
        <p className="text-[11px] text-amber-600 mt-1 font-medium">
          <span className="inline-block w-1 h-1 rounded-full bg-amber-400 mr-1 relative top-[-1px]" />
          {recipe.note}
        </p>
      )}
    </div>
  );
}
