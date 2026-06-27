import { modoPaints, ModoPaint } from '@/data/modo-paints';
import { ExtractedColor } from './color-extract';
import { hexToRgb, darken, lighten } from './color-utils';

export interface PaintMatch {
  extractedColor: ExtractedColor;
  basePaint: ModoPaint;
  distance: number;
  shadowPaint: ModoPaint;
  highlightPaint: ModoPaint;
  zone: string;
}

function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const rmean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt((2 + rmean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rmean) / 256) * db * db);
}

const paintableColors = modoPaints.filter(p =>
  p.opacity !== 'transparent' &&
  p.series !== 'D' &&
  !p.tags.includes('添加劑') &&
  !p.tags.includes('底漆') &&
  !p.tags.includes('補土') &&
  !p.tags.includes('溶劑') &&
  !p.tags.includes('清洗')
);

export function findClosestPaint(r: number, g: number, b: number): { paint: ModoPaint; distance: number } {
  let best: ModoPaint = paintableColors[0];
  let bestDist = Infinity;

  for (const paint of paintableColors) {
    const pc = hexToRgb(paint.hex);
    const dist = colorDistance(r, g, b, pc.r, pc.g, pc.b);
    if (dist < bestDist) {
      bestDist = dist;
      best = paint;
    }
  }

  return { paint: best, distance: bestDist };
}

function findShadowPaint(basePaint: ModoPaint): ModoPaint {
  const baseRgb = hexToRgb(basePaint.hex);
  const targetHex = darken(basePaint.hex, 0.35);
  const target = hexToRgb(targetHex);

  let best: ModoPaint = basePaint;
  let bestDist = Infinity;

  for (const p of paintableColors) {
    if (p.id === basePaint.id) continue;
    const pc = hexToRgb(p.hex);
    const dist = colorDistance(target.r, target.g, target.b, pc.r, pc.g, pc.b);
    if (dist < bestDist) {
      bestDist = dist;
      best = p;
    }
  }

  return best;
}

function findHighlightPaint(basePaint: ModoPaint): ModoPaint {
  const targetHex = lighten(basePaint.hex, 0.35);
  const target = hexToRgb(targetHex);

  let best: ModoPaint = basePaint;
  let bestDist = Infinity;

  for (const p of paintableColors) {
    if (p.id === basePaint.id) continue;
    const pc = hexToRgb(p.hex);
    const dist = colorDistance(target.r, target.g, target.b, pc.r, pc.g, pc.b);
    if (dist < bestDist) {
      bestDist = dist;
      best = p;
    }
  }

  return best;
}

export function matchPaintsToColors(colors: ExtractedColor[]): PaintMatch[] {
  return colors.map((color, i) => {
    const { paint: basePaint, distance } = findClosestPaint(color.r, color.g, color.b);
    const shadowPaint = findShadowPaint(basePaint);
    const highlightPaint = findHighlightPaint(basePaint);

    return {
      extractedColor: color,
      basePaint,
      distance,
      shadowPaint,
      highlightPaint,
      zone: `色區 ${i + 1}：${color.label}`,
    };
  });
}
