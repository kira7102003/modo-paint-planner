'use client';

import { ModoPaint } from '@/data/modo-paints';
import { getContrastColor } from '@/lib/color-utils';

export default function PaintSwatch({ paint, size = 'md', showCode = true }: {
  paint: ModoPaint;
  size?: 'sm' | 'md' | 'lg';
  showCode?: boolean;
}) {
  const sizes = {
    sm: 'w-10 h-10 text-[9px]',
    md: 'w-16 h-16 text-[10px]',
    lg: 'w-24 h-24 text-xs',
  };

  const textColor = getContrastColor(paint.hex);
  const isTransparent = paint.opacity === 'transparent';

  return (
    <div className="group relative flex flex-col items-center gap-1">
      <div
        className={`${sizes[size]} rounded-xl shadow-md border-2 border-white ring-1 ring-slate-200/50 flex items-center justify-center transition-transform group-hover:scale-110 cursor-pointer ${isTransparent ? 'bg-[repeating-conic-gradient(#e8e8e8_0%_25%,#fff_0%_50%)] bg-[length:10px_10px]' : ''}`}
        style={isTransparent ? {} : { backgroundColor: paint.hex }}
        title={`${paint.code} ${paint.nameZh} (${paint.nameEn})`}
      >
        {isTransparent && (
          <div className="absolute inset-0 rounded-xl" style={{ backgroundColor: paint.hex, opacity: 0.3 }} />
        )}
        {showCode && (
          <span className="font-mono font-black relative z-10 drop-shadow-sm" style={{ color: isTransparent ? '#333' : textColor }}>
            {paint.code}
          </span>
        )}
      </div>
      {size !== 'sm' && (
        <span className="text-[10px] text-slate-500 text-center leading-tight max-w-[70px] truncate font-medium">
          {paint.nameZh}
        </span>
      )}
    </div>
  );
}
