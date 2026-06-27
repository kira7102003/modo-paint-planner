export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

export function mixColors(hex1: string, hex2: string, ratio: number): string {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  return rgbToHex(
    c1.r * ratio + c2.r * (1 - ratio),
    c1.g * ratio + c2.g * (1 - ratio),
    c1.b * ratio + c2.b * (1 - ratio),
  );
}

export function mixMultipleColors(hexColors: string[], ratios: number[]): string {
  const total = ratios.reduce((a, b) => a + b, 0);
  const normalized = ratios.map(r => r / total);
  const colors = hexColors.map(hexToRgb);
  const r = colors.reduce((sum, c, i) => sum + c.r * normalized[i], 0);
  const g = colors.reduce((sum, c, i) => sum + c.g * normalized[i], 0);
  const b = colors.reduce((sum, c, i) => sum + c.b * normalized[i], 0);
  return rgbToHex(r, g, b);
}

export function getContrastColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1a1a1a' : '#ffffff';
}

export function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.max(0, r * (1 - amount)),
    Math.max(0, g * (1 - amount)),
    Math.max(0, b * (1 - amount)),
  );
}

export function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(
    Math.min(255, r + (255 - r) * amount),
    Math.min(255, g + (255 - g) * amount),
    Math.min(255, b + (255 - b) * amount),
  );
}
