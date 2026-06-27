export interface ColorMapping {
  zone: string;
  basePaint: { hex: string; code: string; name: string };
  shadowPaint: { hex: string; code: string; name: string };
  highlightPaint: { hex: string; code: string; name: string };
}

interface HSL { h: number; s: number; l: number }

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s, l };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255),
  ];
}

function hexToHsl(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return rgbToHsl(r, g, b);
}

interface HueRange { minH: number; maxH: number; label: string; targetBase: HSL; targetShadow: HSL; targetHighlight: HSL }

function classifyPixelHue(h: number, s: number, l: number): string {
  if (l > 0.85 && s < 0.15) return 'white';
  if (l < 0.15) return 'black';
  if (s < 0.1) return 'gray';
  if (h < 15 || h >= 345) return 'red';
  if (h < 45) return 'orange';
  if (h < 70) return 'yellow';
  if (h < 160) return 'green';
  if (h < 200) return 'cyan';
  if (h < 260) return 'blue';
  if (h < 300) return 'purple';
  return 'pink';
}

function buildHueRanges(mappings: ColorMapping[], extractedColors: { hex: string; label: string }[]): HueRange[] {
  const ranges: HueRange[] = [];
  const usedLabels = new Set<string>();

  for (const m of mappings) {
    const target = hexToHsl(m.basePaint.hex);
    const shadow = hexToHsl(m.shadowPaint.hex);
    const highlight = hexToHsl(m.highlightPaint.hex);

    const zone = m.zone.toLowerCase();
    let label = '';
    if (zone.includes('白') || zone.includes('white')) label = 'white';
    else if (zone.includes('黑') || zone.includes('black')) label = 'black';
    else if (zone.includes('灰') || zone.includes('gray') || zone.includes('grey')) label = 'gray';
    else if (zone.includes('紅') || zone.includes('red')) label = 'red';
    else if (zone.includes('橘') || zone.includes('orange')) label = 'orange';
    else if (zone.includes('黃') || zone.includes('yellow') || zone.includes('金')) label = 'yellow';
    else if (zone.includes('綠') || zone.includes('green')) label = 'green';
    else if (zone.includes('青') || zone.includes('cyan')) label = 'cyan';
    else if (zone.includes('藍') || zone.includes('blue')) label = 'blue';
    else if (zone.includes('紫') || zone.includes('purple') || zone.includes('violet')) label = 'purple';
    else if (zone.includes('粉') || zone.includes('pink')) label = 'pink';
    else if (zone.includes('骨架') || zone.includes('frame') || zone.includes('關節')) label = 'gray';
    else {
      const matched = extractedColors.find(c => {
        const cLabel = c.label.replace('色', '');
        return zone.includes(cLabel);
      });
      if (matched) {
        const mHsl = hexToHsl(matched.hex);
        label = classifyPixelHue(mHsl.h, mHsl.s, mHsl.l);
      } else {
        label = classifyPixelHue(target.h, target.s, target.l);
      }
    }

    if (!usedLabels.has(label)) {
      usedLabels.add(label);
      const hueRanges: Record<string, [number, number]> = {
        red: [345, 15], orange: [15, 45], yellow: [45, 70], green: [70, 160],
        cyan: [160, 200], blue: [200, 260], purple: [260, 300], pink: [300, 345],
      };
      const range = hueRanges[label];
      ranges.push({
        minH: range ? range[0] : 0,
        maxH: range ? range[1] : 360,
        label,
        targetBase: target,
        targetShadow: shadow,
        targetHighlight: highlight,
      });
    }
  }

  return ranges;
}

export function simulateColors(
  canvas: HTMLCanvasElement,
  sourceImage: HTMLImageElement,
  mappings: ColorMapping[],
  extractedColors: { hex: string; label: string }[],
  strength: number = 0.7
) {
  const ctx = canvas.getContext('2d')!;
  const maxW = 600;
  const scale = Math.min(1, maxW / sourceImage.width);
  const w = Math.round(sourceImage.width * scale);
  const h = Math.round(sourceImage.height * scale);
  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(sourceImage, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  const hueRanges = buildHueRanges(mappings, extractedColors);

  const whiteMapping = mappings.find(m => {
    const z = m.zone.toLowerCase();
    return z.includes('白') || z.includes('white');
  });
  const grayMapping = mappings.find(m => {
    const z = m.zone.toLowerCase();
    return z.includes('灰') || z.includes('gray') || z.includes('骨架') || z.includes('frame');
  });
  const blackMapping = mappings.find(m => {
    const z = m.zone.toLowerCase();
    return z.includes('黑') || z.includes('black');
  });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const hsl = rgbToHsl(r, g, b);
    let targetHsl: HSL | null = null;

    if (hsl.l > 0.85 && hsl.s < 0.15 && whiteMapping) {
      const t = hexToHsl(whiteMapping.basePaint.hex);
      targetHsl = { h: t.h, s: t.s * strength + hsl.s * (1 - strength), l: hsl.l * 0.3 + t.l * 0.7 };
    } else if (hsl.l < 0.15 && blackMapping) {
      const t = hexToHsl(blackMapping.basePaint.hex);
      targetHsl = { h: t.h, s: t.s * 0.5, l: hsl.l };
    } else if (hsl.s < 0.1 && grayMapping) {
      const t = hexToHsl(grayMapping.basePaint.hex);
      targetHsl = { h: t.h, s: t.s * strength * 0.5, l: hsl.l * 0.4 + t.l * 0.6 };
    } else if (hsl.s >= 0.1) {
      for (const range of hueRanges) {
        let inRange = false;
        if (range.minH > range.maxH) {
          inRange = hsl.h >= range.minH || hsl.h < range.maxH;
        } else {
          inRange = hsl.h >= range.minH && hsl.h < range.maxH;
        }

        if (inRange) {
          let target: HSL;
          if (hsl.l < 0.35) target = range.targetShadow;
          else if (hsl.l > 0.7) target = range.targetHighlight;
          else target = range.targetBase;

          targetHsl = {
            h: target.h * strength + hsl.h * (1 - strength),
            s: target.s * strength + hsl.s * (1 - strength),
            l: hsl.l * 0.5 + target.l * 0.5,
          };
          break;
        }
      }
    }

    if (targetHsl) {
      const [nr, ng, nb] = hslToRgb(targetHsl.h, Math.min(1, targetHsl.s), Math.max(0, Math.min(1, targetHsl.l)));
      data[i] = nr;
      data[i + 1] = ng;
      data[i + 2] = nb;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // Draw labels
  mappings.forEach((m, idx) => {
    const labelY = 8 + idx * 26;
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.roundRect(6, labelY, 200, 22, 4);
    ctx.fill();
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 4;

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText(m.zone, 12, labelY + 15);

    [m.basePaint, m.shadowPaint, m.highlightPaint].forEach((p, j) => {
      const sx = 120 + j * 24;
      ctx.fillStyle = p.hex;
      ctx.beginPath();
      ctx.roundRect(sx, labelY + 3, 20, 16, 3);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
    ctx.restore();
  });
}
