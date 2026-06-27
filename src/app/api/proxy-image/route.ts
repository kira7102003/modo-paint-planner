import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: '缺少圖片網址' }, { status: 400 });
  }

  const headerSets: Record<string, string>[] = [
    {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'Referer': new URL(url).origin + '/',
    },
    {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'image/*,*/*',
    },
  ];

  for (const h of headerSets) {
    try {
      const res = await fetch(url, { headers: h, signal: AbortSignal.timeout(15000), redirect: 'follow' });
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.byteLength < 100) continue;
        const contentType = res.headers.get('content-type') || 'image/jpeg';
        const base64 = buffer.toString('base64');
        return NextResponse.json({ dataUrl: `data:${contentType};base64,${base64}` });
      }
    } catch { continue; }
  }

  return NextResponse.json({
    error: '圖片無法下載（網站有防盜鏈限制）。請改用截圖貼上 (Ctrl+V) 或拖放上傳。'
  }, { status: 502 });
}
