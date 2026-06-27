export interface ExtractedColor {
  hex: string;
  r: number;
  g: number;
  b: number;
  percentage: number;
  label: string;
}

export function extractColorsFromCanvas(
  canvas: HTMLCanvasElement,
  maxColors: number = 8
): ExtractedColor[] {
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  const colorMap = new Map<string, { r: number; g: number; b: number; count: number }>();

  const step = Math.max(1, Math.floor(pixels.length / 4 / 10000));

  for (let i = 0; i < pixels.length; i += 4 * step) {
    const r = Math.round(pixels[i] / 16) * 16;
    const g = Math.round(pixels[i + 1] / 16) * 16;
    const b = Math.round(pixels[i + 2] / 16) * 16;
    const a = pixels[i + 3];

    if (a < 128) continue;

    const key = `${r},${g},${b}`;
    const existing = colorMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorMap.set(key, { r, g, b, count: 1 });
    }
  }

  const sorted = Array.from(colorMap.values()).sort((a, b) => b.count - a.count);

  const clusters: { r: number; g: number; b: number; count: number }[] = [];
  const minDist = 50;

  for (const color of sorted) {
    const tooClose = clusters.some(c => {
      const dr = c.r - color.r;
      const dg = c.g - color.g;
      const db = c.b - color.b;
      return Math.sqrt(dr * dr + dg * dg + db * db) < minDist;
    });
    if (!tooClose) {
      clusters.push(color);
      if (clusters.length >= maxColors) break;
    }
  }

  const totalPixels = sorted.reduce((sum, c) => sum + c.count, 0);

  return clusters.map(c => {
    const hex = '#' + [c.r, c.g, c.b].map(v => Math.min(255, v).toString(16).padStart(2, '0')).join('');
    return {
      hex,
      r: c.r,
      g: c.g,
      b: c.b,
      percentage: Math.round(c.count / totalPixels * 100),
      label: guessColorLabel(c.r, c.g, c.b),
    };
  });
}

function guessColorLabel(r: number, g: number, b: number): string {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lum = (r * 0.299 + g * 0.587 + b * 0.114);
  const sat = max === 0 ? 0 : (max - min) / max;

  if (lum > 230 && sat < 0.1) return '白色';
  if (lum < 30) return '黑色';
  if (sat < 0.12 && lum > 160) return '淺灰';
  if (sat < 0.12 && lum > 80) return '中灰';
  if (sat < 0.12) return '深灰';

  let hue = 0;
  if (max === min) {
    hue = 0;
  } else if (max === r) {
    hue = 60 * ((g - b) / (max - min)) % 360;
  } else if (max === g) {
    hue = 60 * ((b - r) / (max - min)) + 120;
  } else {
    hue = 60 * ((r - g) / (max - min)) + 240;
  }
  if (hue < 0) hue += 360;

  if (hue < 15 || hue >= 345) return '紅色';
  if (hue < 40) return '橘色';
  if (hue < 70) return '黃色';
  if (hue < 160) return '綠色';
  if (hue < 200) return '青色';
  if (hue < 260) return '藍色';
  if (hue < 300) return '紫色';
  return '粉紅';
}

export function loadImageToCanvas(src: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const isDataUrl = src.startsWith('data:');
    if (!isDataUrl) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const maxDim = 400;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale) || 1;
        const h = Math.round(img.height * scale) || 1;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas 不支援')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        ctx.getImageData(0, 0, 1, 1);
        resolve(canvas);
      } catch {
        if (!isDataUrl) {
          const img2 = new Image();
          img2.onload = () => {
            const maxDim = 400;
            const scale = Math.min(1, maxDim / Math.max(img2.width, img2.height));
            const w = Math.round(img2.width * scale) || 1;
            const h = Math.round(img2.height * scale) || 1;
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img2, 0, 0, w, h);
            resolve(canvas);
          };
          img2.onerror = () => reject(new Error('圖片跨域限制，請改用上傳方式'));
          img2.src = src;
        } else {
          reject(new Error('Canvas 讀取失敗'));
        }
      }
    };
    img.onerror = () => {
      if (!isDataUrl) {
        reject(new Error('圖片網址無法載入，請改用上傳方式'));
      } else {
        reject(new Error('圖片格式無法辨識'));
      }
    };
    img.src = src;
  });
}
